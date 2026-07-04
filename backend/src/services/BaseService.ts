import { IRepository } from '../interfaces/IRepository';

export abstract class BaseService<T> {
  constructor(protected repository: IRepository<T>) {}

  public async getAll(filter: any = {}): Promise<T[]> {
    return this.repository.find(filter);
  }

  public async getById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  public async create(item: Partial<T>): Promise<T> {
    return this.repository.create(item);
  }

  public async update(id: string, item: Partial<T>): Promise<T | null> {
    return this.repository.update(id, item);
  }

  public async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
