export interface IBasket {
  items: HTMLElement[];
  total: number;
  submitDisabled: boolean;
}

export interface IBasketActions {
  onSubmit: () => void;
}
