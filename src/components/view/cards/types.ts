export interface ICardBase {
  title: string;
  priceText: string;
  category?: string;
  imageSrc?: string;
  imageAlt?: string;
  actionDisabled?: boolean;
  actionText?: string;
}

export interface ICatalogCardActions {
  onSelect: () => void;
}

export interface IPreviewCardActions {
  onAction: () => void;
}

export interface IBasketCardActions {
  onRemove: () => void;
}
