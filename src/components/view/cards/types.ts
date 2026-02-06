export interface ICardBase {
  title: string;
  priceText?: string;
  category?: string;
  imageSrc?: string;
  imageAlt?: string;
  actionEnabled?: boolean;
  actionText?: string;
}

export interface ICatalogCardActions {
  onSelect: () => void;
}
