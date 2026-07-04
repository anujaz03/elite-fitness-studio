import { Model, Document } from 'mongoose';
import { IRepository } from '../interfaces/IRepository';

export abstract class BaseRepository<T extends Document> implements IRepository<T> {
  constructor(protected model: Model<T>) {}

  public async find(filter: any = {}): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  public async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  public async create(item: Partial<T>): Promise<T> {
    return this.model.create(item);
  }

  public async update(id: string, item: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, item, { new: true }).exec();
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}
