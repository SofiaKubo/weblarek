export interface ICardBase {
  title: string;
  priceText?: string;
  category?: string;
  imageSrc?: string;
  imageAlt?: string;
  isActionDisabled?: boolean;
}

export interface ICatalogCardActions {
  onSelect: () => void;
}
