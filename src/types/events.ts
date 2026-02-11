import type { IBuyer, IProduct } from './index';

export interface ProductsListChangedEvent {
  products: IProduct[];
}

export interface ProductSelectionChangedEvent {
  product: IProduct | null;
}

export interface BasketStateChangedEvent {
  items: IProduct[];
  total: number;
}

export interface BuyerDataChangedEvent {
  buyer: IBuyer;
}

export interface FormSubmitTriggeredEvent {
  form: string;
}

export interface FormFieldChangedEvent {
  form: string;
  field: string;
  value: string;
}
