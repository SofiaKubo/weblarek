import { IProduct } from '../../types/index';
import { IEvents } from '../../components/base/Events';

export class ProductsModel {
  private items: IProduct[];
  private selectedItem: IProduct | null;

  constructor(private readonly events: IEvents) {
    this.items = [];
    this.selectedItem = null;
  }

  setItems(items: IProduct[]): void {
    this.items = items;

    this.events.emit('catalog:changed', {
      items: this.items,
    });
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setSelectedItem(item: IProduct | null): void {
    this.selectedItem = item;

    this.events.emit('product:selected', {
      item: this.selectedItem,
    });
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}
