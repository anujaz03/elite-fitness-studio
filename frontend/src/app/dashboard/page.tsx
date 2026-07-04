'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Navbar, Footer, Button, Input } from '../../components/common';

// Interfaces
interface IBooking {
  _id: string;
  classId: {
    _id: string;
    date: string;
    timeSlot: string;
    programId: {
      title: string;
      difficulty: string;
      durationMinutes: number;
    };
    trainerId: {
      userId: {
        firstName: string;
        lastName: string;
      };
    };
  };
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'attended' | 'no-show';
}

interface IPayment {
  _id: string;
  amount: number;
  currency: string;
  gateway: string;
  transactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
}

interface IMembershipPlan {
  _id: string;
  planName: 'monthly' | 'quarterly' | 'annual';
  durationMonths: number;
  price: number;
  discountPercentage: number;
  features: string[];
}

interface ITrainerClass {
  _id: string;
  date: string;
  timeSlot: string;
  programId: {
    title: string;
    difficulty: string;
    durationMinutes: number;
  };
  capacity: number;
  slotsOccupied: number;
  status: string;
}

export default function UnifiedDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();

  // Tab Selection State
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal / Selection State
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [showRosterModal, setShowRosterModal] = useState<boolean>(false);

  // Profile Form States
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [profileSaving, setProfileSaving] = useState(false);

  // Blog Creation States (Admin)
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogSaving, setBlogSaving] = useState(false);

  // ----------------------------------------------------
  // MEMBER DATA QUERIES
  // ----------------------------------------------------
  const { data: memberBookings, isLoading: memberBookingsLoading } = useQuery({
    queryKey: ['myBookings'],
    queryFn: async () => {
      const res = await api.get('/bookings/my-bookings');
      return res.data?.data as IBooking[];
    },
    enabled: !!user && user.role === 'member'
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['paymentHistory'],
    queryFn: async () => {
      const res = await api.get('/payments/history');
      return res.data?.data as IPayment[];
    },
    enabled: !!user && user.role === 'member'
  });

  // ----------------------------------------------------
  // TRAINER DATA QUERIES
  // ----------------------------------------------------
  const { data: trainerClasses, isLoading: trainerClassesLoading } = useQuery({
    queryKey: ['trainerClasses'],
    queryFn: async () => {
      const res = await api.get('/trainers/classes');
      return res.data?.data as ITrainerClass[];
    },
    enabled: !!user && user.role === 'trainer'
  });

  const { data: classRoster, isLoading: rosterLoading } = useQuery({
    queryKey: ['classRoster', selectedClassId],
    queryFn: async () => {
      const res = await api.get(`/trainers/classes/${selectedClassId}/bookings`);
      return res.data?.data as IBooking[];
    },
    enabled: !!user && user.role === 'trainer' && !!selectedClassId && showRosterModal
  });

  // ----------------------------------------------------
  // ADMIN DATA QUERIES
  // ----------------------------------------------------
  const { data: allBlogs, refetch: refetchBlogs } = useQuery({
    queryKey: ['allBlogs'],
    queryFn: async () => {
      const res = await api.get('/blogs');
      return res.data?.data;
    },
    enabled: !!user && (user.role === 'admin' || user.role === 'super-admin')
  });

  // ----------------------------------------------------
  // MUTATIONS
  // ----------------------------------------------------
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await api.put(`/bookings/${bookingId}/cancel`);
      return res.data;
    },
    onSuccess: (data) => {
      setSuccessMsg(data.message || 'Booking cancelled.');
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Cancellation locked within 4 hours.');
    }
  });

  const purchasePlanMutation = useMutation({
    mutationFn: async ({ planId, gateway }: { planId: string; gateway: string }) => {
      const res = await api.post('/payments/create-order', { planId, gateway });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.data?.checkoutUrl) {
        router.push(data.data.checkoutUrl);
      }
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Payment initiation failed.');
    }
  });

  const updateAttendanceMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: 'attended' | 'no-show' | 'confirmed' }) => {
      const res = await api.put(`/trainers/bookings/${bookingId}/attendance`, { status });
      return res.data;
    },
    onSuccess: (data) => {
      setSuccessMsg(data.message || 'Attendance status recorded.');
      queryClient.invalidateQueries({ queryKey: ['classRoster'] });
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Attendance status update failed.');
    }
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      const res = await api.put('/users/profile', {
        firstName,
        lastName,
        phone,
        address,
        profileImage
      });
      if (res.data?.success) {
        setSuccessMsg('Profile updated successfully.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setBlogSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      const res = await api.post('/blogs', {
        title: blogTitle,
        slug: blogSlug,
        author: blogAuthor,
        category: blogCategory,
        content: blogContent
      });
      if (res.data?.success) {
        setSuccessMsg('Blog article created and published.');
        setBlogTitle('');
        setBlogSlug('');
        setBlogAuthor('');
        setBlogCategory('');
        setBlogContent('');
        refetchBlogs();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create blog post.');
    } finally {
      setBlogSaving(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    router.push('/login');
  };

  // Mock static plans for selection
  const plans = [
    { _id: 'monthly', planName: 'monthly', durationMonths: 1, price: 2999, features: ['Gym floor access', 'Group fitness classes', 'Locker & towel service'] },
    { _id: 'quarterly', planName: 'quarterly', durationMonths: 3, price: 7999, features: ['Gym floor access', 'Group fitness classes', '1 Guest pass per month'] },
    { _id: 'annual', planName: 'annual', durationMonths: 12, price: 24999, features: ['Gym floor access', 'Group fitness classes', 'Juice bar discount'] }
  ] as IMembershipPlan[];

  return (
    <div className="flex flex-col min-h-screen bg-brand-charcoal text-brand-ivory">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 py-12 sm:px-6 lg:px-8 flex-grow flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 flex flex-col gap-2">
          <div className="rounded-brand border border-brand-beige/10 bg-brand-charcoal-tint p-4 text-center space-y-2">
            <div className="mx-auto h-16 w-16 rounded-full bg-brand-charcoal overflow-hidden border border-brand-teal/40 flex items-center justify-center font-cinzel text-xl text-brand-teal font-bold relative">
              {user?.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={`${user.firstName} ${user.lastName}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-brand-teal/20">
                  {user?.firstName[0]}{user?.lastName[0]}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-cinzel text-md font-semibold text-brand-ivory">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-2xs font-secondary uppercase tracking-wider text-brand-gold">
                {user?.role} Portal
              </p>
            </div>
          </div>

          <div className="rounded-brand border border-brand-beige/10 bg-brand-charcoal-tint p-2 flex flex-col gap-1">
            <button
              onClick={() => { setActiveTab('overview'); setSuccessMsg(null); setErrorMsg(null); }}
              className={`w-full text-left font-secondary text-xs uppercase tracking-wider py-3 px-4 rounded-brand transition-colors ${
                activeTab === 'overview' ? 'bg-brand-gold text-brand-charcoal font-semibold' : 'text-brand-ivory-muted hover:text-brand-gold hover:bg-brand-charcoal/30'
              }`}
            >
              Overview
            </button>

            {/* MEMBER TABS */}
            {user?.role === 'member' && (
              <>
                <button
                  onClick={() => { setActiveTab('bookings'); setSuccessMsg(null); setErrorMsg(null); }}
                  className={`w-full text-left font-secondary text-xs uppercase tracking-wider py-3 px-4 rounded-brand transition-colors ${
                    activeTab === 'bookings' ? 'bg-brand-gold text-brand-charcoal font-semibold' : 'text-brand-ivory-muted hover:text-brand-gold hover:bg-brand-charcoal/30'
                  }`}
                >
                  Class Bookings
                </button>
                <button
                  onClick={() => { setActiveTab('membership'); setSuccessMsg(null); setErrorMsg(null); }}
                  className={`w-full text-left font-secondary text-xs uppercase tracking-wider py-3 px-4 rounded-brand transition-colors ${
                    activeTab === 'membership' ? 'bg-brand-gold text-brand-charcoal font-semibold' : 'text-brand-ivory-muted hover:text-brand-gold hover:bg-brand-charcoal/30'
                  }`}
                >
                  Membership
                </button>
                <button
                  onClick={() => { setActiveTab('payments'); setSuccessMsg(null); setErrorMsg(null); }}
                  className={`w-full text-left font-secondary text-xs uppercase tracking-wider py-3 px-4 rounded-brand transition-colors ${
                    activeTab === 'payments' ? 'bg-brand-gold text-brand-charcoal font-semibold' : 'text-brand-ivory-muted hover:text-brand-gold hover:bg-brand-charcoal/30'
                  }`}
                >
                  Billing Logs
                </button>
              </>
            )}

            {/* TRAINER TABS */}
            {user?.role === 'trainer' && (
              <button
                onClick={() => { setActiveTab('schedule'); setSuccessMsg(null); setErrorMsg(null); }}
                className={`w-full text-left font-secondary text-xs uppercase tracking-wider py-3 px-4 rounded-brand transition-colors ${
                  activeTab === 'schedule' ? 'bg-brand-gold text-brand-charcoal font-semibold' : 'text-brand-ivory-muted hover:text-brand-gold hover:bg-brand-charcoal/30'
                }`}
              >
                My Classes
              </button>
            )}

            {/* ADMIN TABS */}
            {(user?.role === 'admin' || user?.role === 'super-admin') && (
              <>
                <button
                  onClick={() => { setActiveTab('blogs'); setSuccessMsg(null); setErrorMsg(null); }}
                  className={`w-full text-left font-secondary text-xs uppercase tracking-wider py-3 px-4 rounded-brand transition-colors ${
                    activeTab === 'blogs' ? 'bg-brand-gold text-brand-charcoal font-semibold' : 'text-brand-ivory-muted hover:text-brand-gold hover:bg-brand-charcoal/30'
                  }`}
                >
                  CMS Blogs
                </button>
              </>
            )}

            <button
              onClick={() => { setActiveTab('profile'); setSuccessMsg(null); setErrorMsg(null); }}
              className={`w-full text-left font-secondary text-xs uppercase tracking-wider py-3 px-4 rounded-brand transition-colors ${
                activeTab === 'profile' ? 'bg-brand-gold text-brand-charcoal font-semibold' : 'text-brand-ivory-muted hover:text-brand-gold hover:bg-brand-charcoal/30'
              }`}
            >
              Profile Settings
            </button>
            <hr className="border-brand-beige/10 my-1" />
            <button
              onClick={handleSignOut}
              className="w-full text-left font-secondary text-xs uppercase tracking-wider py-3 px-4 rounded-brand text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Content Panel */}
        <section className="flex-1 rounded-brand border border-brand-beige/10 bg-brand-charcoal-tint p-8 shadow-xl min-h-[500px] flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Title */}
            <div className="flex items-center justify-between border-b border-brand-beige/10 pb-4">
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wide text-brand-gold uppercase">
                {activeTab} Management
              </h2>
            </div>

            {/* Alerts */}
            {successMsg ? (
              <div className="rounded-brand bg-green-950/20 border border-green-500/30 p-4 text-xs text-green-400 font-secondary">
                {successMsg}
              </div>
            ) : null}

            {errorMsg ? (
              <div className="rounded-brand bg-red-950/20 border border-red-500/30 p-4 text-xs text-red-400 font-secondary">
                {errorMsg}
              </div>
            ) : null}

            {/* =================================================== */}
            {/* TAB: OVERVIEW */}
            {/* =================================================== */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {user?.role === 'member' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-secondary">
                    <div className="space-y-4">
                      <h4 className="font-cinzel text-md font-semibold text-brand-ivory border-b border-brand-beige/5 pb-2">
                        Active Membership Status
                      </h4>
                      <div className="rounded-brand bg-brand-charcoal p-6 border border-brand-beige/5 space-y-2">
                        <div className="text-2xs text-brand-ivory-muted uppercase tracking-wider">Current Tier</div>
                        <div className="font-cinzel text-xl font-bold text-brand-gold">
                          {payments && payments.length > 0 ? 'PREMIUM ACCESS' : 'NO SUBSCRIPTION'}
                        </div>
                        <div className="text-xs text-brand-ivory-muted pt-2">
                          {payments && payments.length > 0
                            ? 'Unlimited access to scheduled classes.'
                            : 'Unlock the class calendar by purchasing a membership plan.'}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-cinzel text-md font-semibold text-brand-ivory border-b border-brand-beige/5 pb-2">
                        Upcoming Sessions
                      </h4>
                      <div className="space-y-2">
                        {memberBookingsLoading ? (
                          <div className="h-20 bg-brand-charcoal animate-pulse rounded-brand" />
                        ) : memberBookings && memberBookings.filter(b => b.status === 'confirmed').length > 0 ? (
                          memberBookings
                            .filter(b => b.status === 'confirmed')
                            .slice(0, 2)
                            .map((b) => (
                              <div key={b._id} className="rounded-brand bg-brand-charcoal p-4 border border-brand-beige/5 flex items-center justify-between">
                                <div>
                                  <div className="text-xs font-semibold text-brand-ivory">{b.classId.programId.title}</div>
                                  <div className="text-3xs text-brand-ivory-muted mt-0.5">
                                    Coach {b.classId.trainerId.userId.firstName} | {new Date(b.classId.date).toLocaleDateString()} at {b.classId.timeSlot}
                                  </div>
                                </div>
                                <span className="text-3xs text-brand-teal uppercase tracking-wider font-semibold">CONFIRMED</span>
                              </div>
                            ))
                        ) : (
                          <div className="rounded-brand bg-brand-charcoal p-6 border border-brand-beige/5 text-center text-xs text-brand-ivory-muted">
                            No upcoming class sessions reserved.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {user?.role === 'trainer' && (
                  <div className="space-y-4 font-secondary">
                    <h3 className="font-cinzel text-lg font-bold text-brand-gold">WELCOME BACK, COACH {user.firstName}</h3>
                    <p className="text-xs text-brand-ivory-muted leading-relaxed">
                      Manage your assigned class schedules, track student attendances, and coordinate your fitness routines from this panel. Select the **My Classes** tab on the left to mark roster registers.
                    </p>
                  </div>
                )}

                {(user?.role === 'admin' || user?.role === 'super-admin') && (
                  <div className="space-y-8 font-secondary">
                    <h3 className="font-cinzel text-lg font-bold text-brand-gold">STUDIO OVERVIEW</h3>
                    
                    {/* SVG Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="rounded-brand border border-brand-beige/5 bg-brand-charcoal p-6 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold">Monthly Revenue Trend (INR)</h4>
                        {/* Simple SVG Bar chart */}
                        <svg className="w-full h-40" viewBox="0 0 300 120">
                          <rect x="20" y="80" width="20" height="30" fill="#A56A23" />
                          <rect x="70" y="60" width="20" height="50" fill="#A56A23" />
                          <rect x="120" y="50" width="20" height="60" fill="#A56A23" />
                          <rect x="170" y="30" width="20" height="80" fill="#A56A23" />
                          <rect x="220" y="20" width="20" height="90" fill="#DDA964" />
                          <line x1="10" y1="110" x2="280" y2="110" stroke="#F7F5F2" strokeOpacity="0.2" />
                          <text x="22" y="118" fill="#F7F5F2" fontSize="6">Jan</text>
                          <text x="72" y="118" fill="#F7F5F2" fontSize="6">Feb</text>
                          <text x="122" y="118" fill="#F7F5F2" fontSize="6">Mar</text>
                          <text x="172" y="118" fill="#F7F5F2" fontSize="6">Apr</text>
                          <text x="222" y="118" fill="#F7F5F2" fontSize="6">May</text>
                        </svg>
                      </div>

                      <div className="rounded-brand border border-brand-beige/5 bg-brand-charcoal p-6 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-teal">Active Registrations Count</h4>
                        <svg className="w-full h-40" viewBox="0 0 300 120">
                          <rect x="20" y="90" width="20" height="20" fill="#667C81" />
                          <rect x="70" y="70" width="20" height="40" fill="#667C81" />
                          <rect x="120" y="60" width="20" height="50" fill="#667C81" />
                          <rect x="170" y="40" width="20" height="70" fill="#667C81" />
                          <rect x="220" y="30" width="20" height="80" fill="#667C81" />
                          <line x1="10" y1="110" x2="280" y2="110" stroke="#F7F5F2" strokeOpacity="0.2" />
                          <text x="22" y="118" fill="#F7F5F2" fontSize="6">Jan</text>
                          <text x="72" y="118" fill="#F7F5F2" fontSize="6">Feb</text>
                          <text x="122" y="118" fill="#F7F5F2" fontSize="6">Mar</text>
                          <text x="172" y="118" fill="#F7F5F2" fontSize="6">Apr</text>
                          <text x="222" y="118" fill="#F7F5F2" fontSize="6">May</text>
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =================================================== */}
            {/* TAB: MEMBER BOOKINGS */}
            {/* =================================================== */}
            {activeTab === 'bookings' && user?.role === 'member' && (
              <div className="space-y-4">
                {memberBookingsLoading ? (
                  <div className="h-40 bg-brand-charcoal animate-pulse rounded-brand" />
                ) : memberBookings && memberBookings.length > 0 ? (
                  <div className="space-y-4">
                    {memberBookings.map((b) => {
                      const isCancelled = b.status === 'cancelled';
                      return (
                        <div key={b._id} className="rounded-brand border border-brand-beige/5 bg-brand-charcoal p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-cinzel text-md font-bold">{b.classId.programId.title}</span>
                              <span className={`px-2 py-0.5 rounded text-3xs font-semibold tracking-wider font-secondary ${
                                isCancelled ? 'bg-red-950/20 text-red-400' : 'bg-brand-teal/10 text-brand-teal'
                              }`}>{b.status.toUpperCase()}</span>
                            </div>
                            <p className="text-xs text-brand-ivory-muted font-secondary">
                              Trainer: Coach {b.classId.trainerId.userId.firstName} {b.classId.trainerId.userId.lastName}
                            </p>
                            <p className="text-3xs text-brand-ivory-muted font-secondary">
                              Scheduled Date: {new Date(b.classId.date).toLocaleDateString()} at {b.classId.timeSlot}
                            </p>
                          </div>
                          {!isCancelled && (
                            <Button
                              onClick={() => cancelBookingMutation.mutate(b._id)}
                              variant="outline"
                              className="text-3xs py-2 px-4 rounded-brand border-red-500 text-red-500 hover:bg-red-500 hover:text-brand-charcoal"
                              disabled={cancelBookingMutation.isPending}
                            >
                              CANCEL
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-brand bg-brand-charcoal p-12 border border-brand-beige/5 text-center text-xs text-brand-ivory-muted font-secondary">
                    No bookings found. Navigate to the Schedule view to book.
                  </div>
                )}
              </div>
            )}

            {/* =================================================== */}
            {/* TAB: MEMBER MEMBERSHIP */}
            {/* =================================================== */}
            {activeTab === 'membership' && user?.role === 'member' && (
              <div className="space-y-8 font-secondary">
                <div className="rounded-brand bg-brand-charcoal p-6 border border-brand-beige/5 space-y-2">
                  <h4 className="font-cinzel text-sm font-semibold text-brand-gold uppercase tracking-wider">Active plan</h4>
                  <div className="text-xs text-brand-ivory">
                    {payments && payments.length > 0 ? (
                      <div className="space-y-1">
                        <p>Status: <span className="text-brand-teal font-semibold">Active</span></p>
                        <p>Total Billing: INR {payments[0].amount}</p>
                        <p>Activation Key: {payments[0].transactionId}</p>
                      </div>
                    ) : (
                      <p className="text-brand-ivory-muted">No active subscription plan. Select a tier package below to subscribe.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-cinzel text-md font-semibold text-brand-ivory border-b border-brand-beige/5 pb-2">Available Packages</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((p) => (
                      <div key={p._id} className="rounded-brand border border-brand-beige/10 bg-brand-charcoal p-6 flex flex-col justify-between hover:border-brand-gold">
                        <div className="space-y-4">
                          <div className="text-center">
                            <span className="text-xs uppercase tracking-widest text-brand-gold font-semibold">{p.planName}</span>
                            <div className="font-cinzel text-2xl font-bold mt-2">INR {p.price}</div>
                          </div>
                          <hr className="border-brand-beige/15" />
                          <ul className="space-y-1 text-3xs text-brand-ivory-muted leading-relaxed">
                            {p.features.map((f) => <li key={f}>✓ {f}</li>)}
                          </ul>
                        </div>
                        <div className="pt-6">
                          <Button
                            onClick={() => purchasePlanMutation.mutate({ planId: p._id, gateway: 'stripe' })}
                            variant="primary"
                            className="w-full text-3xs py-2"
                            disabled={purchasePlanMutation.isPending}
                          >
                            SUBSCRIBE
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* =================================================== */}
            {/* TAB: MEMBER PAYMENTS */}
            {/* =================================================== */}
            {activeTab === 'payments' && user?.role === 'member' && (
              <div className="space-y-4">
                {paymentsLoading ? (
                  <div className="h-40 bg-brand-charcoal animate-pulse rounded-brand" />
                ) : payments && payments.length > 0 ? (
                  <div className="overflow-x-auto rounded-brand border border-brand-beige/5">
                    <table className="min-w-full divide-y divide-brand-beige/10 font-secondary text-xs">
                      <thead className="bg-brand-charcoal">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider text-brand-gold">Transaction ID</th>
                          <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider text-brand-gold">Amount</th>
                          <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider text-brand-gold">Date</th>
                          <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider text-brand-gold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-beige/10 bg-brand-charcoal-tint/50">
                        {payments.map((p) => (
                          <tr key={p._id}>
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-brand-teal">{p.transactionId.substring(0, 12)}...</td>
                            <td className="px-6 py-4 whitespace-nowrap">{p.currency} {p.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-brand-ivory-muted">{new Date(p.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-brand-teal uppercase tracking-wider font-semibold text-3xs">{p.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-brand bg-brand-charcoal p-12 border border-brand-beige/5 text-center text-xs text-brand-ivory-muted font-secondary">
                    No billing logs found.
                  </div>
                )}
              </div>
            )}

            {/* =================================================== */}
            {/* TAB: TRAINER CLASSES */}
            {/* =================================================== */}
            {activeTab === 'schedule' && user?.role === 'trainer' && (
              <div className="space-y-4">
                {trainerClassesLoading ? (
                  <div className="h-40 bg-brand-charcoal animate-pulse rounded-brand" />
                ) : trainerClasses && trainerClasses.length > 0 ? (
                  <div className="space-y-4">
                    {trainerClasses.map((c) => (
                      <div key={c._id} className="rounded-brand border border-brand-beige/5 bg-brand-charcoal p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="font-cinzel text-md font-bold text-brand-gold">{c.programId.title}</h3>
                          <p className="text-xs text-brand-ivory-muted font-secondary">
                            Date: {new Date(c.date).toLocaleDateString()} | Time: {c.timeSlot}
                          </p>
                          <p className="text-3xs text-brand-teal font-secondary">
                            Enrolled: {c.slotsOccupied} / {c.capacity} students
                          </p>
                        </div>
                        <Button
                          onClick={() => { setSelectedClassId(c._id); setShowRosterModal(true); }}
                          variant="primary"
                          className="text-3xs py-2 px-4 uppercase font-semibold"
                        >
                          Roster Register
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-brand bg-brand-charcoal p-12 border border-brand-beige/5 text-center text-xs text-brand-ivory-muted font-secondary">
                    No classes assigned to you on schedule.
                  </div>
                )}
              </div>
            )}

            {/* =================================================== */}
            {/* TAB: ADMIN BLOG CMS */}
            {/* =================================================== */}
            {activeTab === 'blogs' && (user?.role === 'admin' || user?.role === 'super-admin') && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-secondary">
                {/* Form */}
                <form onSubmit={handleCreateBlog} className="rounded-brand bg-brand-charcoal p-6 border border-brand-beige/5 space-y-4">
                  <h3 className="font-cinzel text-sm font-semibold text-brand-gold uppercase tracking-wider">Add Blog Article</h3>
                  
                  <Input
                    label="Title"
                    type="text"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    required
                  />

                  <Input
                    label="Slug"
                    type="text"
                    value={blogSlug}
                    onChange={(e) => setBlogSlug(e.target.value)}
                    required
                  />

                  <Input
                    label="Author"
                    type="text"
                    value={blogAuthor}
                    onChange={(e) => setBlogAuthor(e.target.value)}
                    required
                  />

                  <Input
                    label="Category (e.g. Strength, Yoga)"
                    type="text"
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    required
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-brand-ivory-muted font-medium uppercase tracking-wider">Content Body</label>
                    <textarea
                      rows={4}
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      className="w-full rounded-brand border border-brand-beige/20 bg-brand-charcoal-tint px-4 py-3 text-xs text-brand-ivory focus:border-brand-gold focus:outline-none"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" variant="primary" className="w-full text-xs" isLoading={blogSaving}>
                      PUBLISH ARTICLE
                    </Button>
                  </div>
                </form>

                {/* List */}
                <div className="space-y-4">
                  <h3 className="font-cinzel text-sm font-semibold text-brand-ivory border-b border-brand-beige/5 pb-2">Published Articles</h3>
                  <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2">
                    {allBlogs && allBlogs.length > 0 ? (
                      allBlogs.map((b: any) => (
                        <div key={b._id} className="rounded-brand bg-brand-charcoal p-4 border border-brand-beige/5 flex justify-between items-center">
                          <div>
                            <h4 className="text-xs font-semibold">{b.title}</h4>
                            <span className="text-3xs text-brand-ivory-muted">By {b.author} | {b.category}</span>
                          </div>
                          <span className="text-3xs text-brand-gold font-mono">{b.slug}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-brand-ivory-muted">No published blog posts.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* =================================================== */}
            {/* TAB: PROFILE SETTINGS */}
            {/* =================================================== */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl font-secondary">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <Input
                  label="Phone Number"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <Input
                  label="Address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <Input
                  label="Profile Image URL"
                  type="text"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                />

                <div className="pt-4">
                  <Button type="submit" variant="primary" className="px-8 text-xs py-3" isLoading={profileSaving}>
                    SAVE PROFILE
                  </Button>
                </div>
              </form>
            )}

          </div>

          <div className="text-3xs text-brand-ivory-muted font-secondary pt-8 text-center border-t border-brand-beige/5 mt-8">
            EliteFit Studio Premium Control Desk | Jubilee Hills, Hyd.
          </div>
        </section>
      </main>

      {/* =================================================== */}
      {/* ROSTER MODAL (Trainer view) */}
      {/* =================================================== */}
      {showRosterModal && selectedClassId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-brand-charcoal/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-brand bg-brand-charcoal-tint border border-brand-beige/10 p-8 shadow-2xl space-y-6 relative">
            <button
              onClick={() => { setShowRosterModal(false); setSelectedClassId(null); }}
              className="absolute top-4 right-4 text-brand-ivory hover:text-brand-gold focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-1">
              <h3 className="font-cinzel text-lg font-bold text-brand-gold">Class Enrollment Roster</h3>
              <p className="text-xs text-brand-ivory-muted font-secondary">Mark student attendance logs</p>
            </div>

            <hr className="border-brand-beige/10" />

            <div className="space-y-4">
              {rosterLoading ? (
                <div className="h-20 bg-brand-charcoal animate-pulse rounded-brand" />
              ) : classRoster && classRoster.length > 0 ? (
                classRoster.map((booking) => (
                  <div key={booking._id} className="rounded-brand bg-brand-charcoal p-4 border border-brand-beige/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-secondary">
                    <div>
                      <div className="text-xs font-semibold">{booking.userId.firstName} {booking.userId.lastName}</div>
                      <div className="text-3xs text-brand-ivory-muted font-mono">{booking.userId.email}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-3xs font-semibold px-2 py-0.5 rounded tracking-wider ${
                        booking.status === 'attended'
                          ? 'bg-green-950/20 text-green-400'
                          : booking.status === 'no-show'
                          ? 'bg-red-950/20 text-red-400'
                          : 'bg-brand-teal/10 text-brand-teal'
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>

                      <div className="flex gap-1">
                        <button
                          onClick={() => updateAttendanceMutation.mutate({ bookingId: booking._id, status: 'attended' })}
                          className="bg-green-600 hover:bg-green-500 text-brand-charcoal text-3xs font-bold px-3 py-1 rounded-brand"
                        >
                          ATTEND
                        </button>
                        <button
                          onClick={() => updateAttendanceMutation.mutate({ bookingId: booking._id, status: 'no-show' })}
                          className="bg-red-600 hover:bg-red-500 text-brand-charcoal text-3xs font-bold px-3 py-1 rounded-brand"
                        >
                          ABSENT
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-brand-ivory-muted font-secondary text-center py-6">No students reserved slots for this class.</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => { setShowRosterModal(false); setSelectedClassId(null); }} variant="outline" className="text-xs">
                CLOSE
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
