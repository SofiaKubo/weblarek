export interface IBasketData {
  items: HTMLElement[];
  total: number;
  submitDisabled: boolean;
}

export interface IBasketActions {
  onSubmitRequest: () => void;
}
