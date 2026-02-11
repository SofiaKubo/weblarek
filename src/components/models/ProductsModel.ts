import { IProduct } from '../../types/index';
import { IEvents } from '../../components/base/Events';
import type {
  ProductSelectionChangedEvent,
  ProductsListChangedEvent,
} from '../../types/events';

export class ProductsModel {
  private items: IProduct[];
  private selectedItem: IProduct | null;

  constructor(private readonly events: IEvents) {
    this.items = [];
    this.selectedItem = null;
  }

  setItems(items: IProduct[]): void {
    this.items = items;

    this.events.emit<ProductsListChangedEvent>('products:list-changed', {
      products: this.items,
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

    this.events.emit<ProductSelectionChangedEvent>(
      'products:selection-changed',
      {
        product: this.selectedItem,
      }
    );
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}
