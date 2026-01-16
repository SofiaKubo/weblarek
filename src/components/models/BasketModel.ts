import { IProduct } from '../../types/index';
export class BasketModel {
  private items: IProduct[];

  constructor() {
    this.items = [];
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    if (!this.hasItem(item.id)) {
      this.items.push(item);
    }
  }

  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }

  clear(): void {
    this.items = [];
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price || 0), 0);
  }

  getItemsCount(): number {
    return this.items.length;
  }

  hasItem(itemId: string): boolean {
    return this.items.some((item) => item.id === itemId);
  }
}
