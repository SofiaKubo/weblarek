export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}
export type TPayment = 'card' | 'cash';
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}
export interface ProductsResponse {
  total: number;
  items: IProduct[];
}

export type OrderRequest = {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  items: string[];
  total: number;
};

export type OrderResponse = {
  id: string;
  total: number;
};

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
