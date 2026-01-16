import { IProduct } from '../../../types/index';

export class ProductsModel {
  private items: IProduct[];
  private selectedItem: IProduct | null;

  constructor() {
    this.items = [];
    this.selectedItem = null;
  }

  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setSelectedItem(item: IProduct | null): void {
    this.selectedItem = item;
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}
