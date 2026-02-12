import type { IBuyer, IProduct, TPayment } from './index';

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
  form: 'order' | 'contacts';
}

type OrderFieldChangedEvent =
  | { field: 'payment'; value: TPayment }
  | { field: 'address'; value: string };

type ContactsFieldChangedEvent =
  | { field: 'email'; value: string }
  | { field: 'phone'; value: string };

export type FormFieldChangedEvent =
  | ({ form: 'order' } & OrderFieldChangedEvent)
  | ({ form: 'contacts' } & ContactsFieldChangedEvent);
