import { Response } from 'express';
import crypto from 'crypto';
import { MembershipPlan } from '../models/MembershipPlan';
import { UserMembership } from '../models/UserMembership';
import { Payment } from '../models/Payment';
import { AuthenticatedRequest } from '../types';
import { createOrderSchema, verifyPaymentSchema } from '../validators/paymentValidators';

// Mock Gateway Order Generator
const createMockGatewayOrder = (planId: string, planName: string, amount: number, currency: string, gateway: string) => {
  const randomId = crypto.randomBytes(16).toString('hex');
  return {
    gatewayOrderId: `${gateway === 'stripe' ? 'cs_' : 'order_'}${randomId}`,
    amount,
    currency,
    checkoutUrl: `http://localhost:3000/dashboard/payment-simulation?gateway=${gateway}&orderId=${randomId}&planName=${planName}&amount=${amount}&planId=${planId}`
  };
};

export const createOrder = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'You must be logged in.' }
      });
      return;
    }

    // 1. Validation
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Order creation inputs invalid',
          details: parsed.error.issues.map((i) => ({ field: i.path[0], message: i.message }))
        }
      });
      return;
    }

    const { planId, gateway } = parsed.data;

    // 2. Fetch Plan
    const plan = await MembershipPlan.findById(planId);
    if (!plan || !plan.isActive) {
      res.status(404).json({
        success: false,
        error: { code: 'PLAN_NOT_FOUND', message: 'The selected membership plan is not available.' }
      });
      return;
    }

    // 3. Compute price after discount
    const calculatedPrice = plan.price * (1 - plan.discountPercentage / 100);

    // 4. Initialize Gateway checkout details (fallback simulated checkout)
    const orderData = createMockGatewayOrder(
      plan._id.toString(),
      plan.planName,
      calculatedPrice,
      'INR',
      gateway
    );

    res.status(200).json({
      success: true,
      data: orderData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'ORDER_CREATION_FAILED',
        message: 'An error occurred initializing the checkout order.'
      }
    });
  }
};

export const verifyPayment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'You must be logged in.' }
      });
      return;
    }

    // 1. Validation
    const parsed = verifyPaymentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Payment verification inputs invalid',
          details: parsed.error.issues.map((i) => ({ field: i.path[0], message: i.message }))
        }
      });
      return;
    }

    const { transactionId, gateway } = parsed.data;
    const { planId } = req.body; // PlanId is expected in req.body to map membership bounds

    if (!planId) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_PLAN_ID', message: 'Plan ID reference is required to verify membership.' }
      });
      return;
    }

    const plan = await MembershipPlan.findById(planId);
    if (!plan) {
      res.status(404).json({
        success: false,
        error: { code: 'PLAN_NOT_FOUND', message: 'The associated membership plan was not found.' }
      });
      return;
    }

    // 2. Prevent duplicate transaction verification
    const existingPayment = await Payment.findOne({ transactionId });
    if (existingPayment) {
      res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE_PAYMENT', message: 'This transaction signature has already been processed.' }
      });
      return;
    }

    // 3. Create active UserMembership subscription record
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + plan.durationMonths);

    // Cancel any current memberships user holds
    await UserMembership.updateMany(
      { userId: req.user._id, status: 'active' },
      { status: 'cancelled' }
    );

    // Write new membership subscription
    await UserMembership.create({
      userId: req.user._id,
      planId: plan._id,
      startDate,
      endDate,
      status: 'active',
      gatewaySubscriptionId: transactionId
    });

    // 4. Save Payment transaction record
    const finalAmount = plan.price * (1 - plan.discountPercentage / 100);
    const payment = await Payment.create({
      userId: req.user._id,
      amount: finalAmount,
      currency: 'INR',
      gateway,
      transactionId,
      status: 'completed',
      invoiceUrl: `/payments/invoice/${transactionId}`
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified and membership activated.',
      data: {
        paymentId: payment._id,
        status: payment.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PAYMENT_VERIFICATION_FAILED',
        message: 'An error occurred during payment verification.'
      }
    });
  }
};

export const getPaymentHistory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'You must be logged in.' }
      });
      return;
    }

    const payments = await Payment.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PAYMENTS_FETCH_FAILED',
        message: 'An error occurred retrieving payment records.'
      }
    });
  }
};

export const getInvoice = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // transactionId
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'You must be logged in.' }
      });
      return;
    }

    const payment = await Payment.findOne({ transactionId: id }).populate('userId');
    if (!payment) {
      res.status(404).json({
        success: false,
        error: { code: 'INVOICE_NOT_FOUND', message: 'The payment transaction record was not found.' }
      });
      return;
    }

    // Verify ownership
    if (payment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'super-admin') {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You are not authorized to view this invoice.' }
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        invoiceNumber: `INV-${payment.transactionId.substring(0, 8).toUpperCase()}`,
        date: payment.createdAt,
        billingDetails: {
          name: `${(payment.userId as any).firstName} ${(payment.userId as any).lastName}`,
          email: (payment.userId as any).email,
          phone: (payment.userId as any).phone
        },
        items: [
          {
            description: 'EliteFit Membership Subscription',
            amount: payment.amount,
            currency: payment.currency
          }
        ],
        totalAmount: payment.amount,
        currency: payment.currency,
        status: payment.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INVOICE_FETCH_FAILED',
        message: 'An error occurred retrieving invoice data.'
      }
    });
  }
};
