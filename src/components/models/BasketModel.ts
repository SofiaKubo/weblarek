import { IProduct } from '../../types/index';
import { IEvents } from '../../components/base/Events';
export class BasketModel {
  private items: IProduct[];

  constructor(private events: IEvents) {
    this.items = [];
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    if (!this.hasItem(item.id)) {
      this.items.push(item);
      this.emitChange();
    }
  }

  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.emitChange();
  }

  clear(): void {
    this.items = [];
    this.emitChange();
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

  private emitChange(): void {
    this.events.emit('basket:changed', {
      items: this.items,
      total: this.getTotalPrice(),
    });
  }
}
