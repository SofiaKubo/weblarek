export interface ICardBaseData {
  title: string;
  priceText: string;
  category?: string;
  imageSrc?: string;
  imageAlt?: string;
  actionDisabled?: boolean;
  actionText?: string;
}

export interface IPreviewCardData extends ICardBaseData {
  description: string;
}

export interface IBasketCardData extends ICardBaseData {
  index: number;
}

export interface ICatalogCardActions {
  onSelectRequest: () => void;
}

export interface IPreviewCardActions {
  onActionRequest: () => void;
}

export interface IBasketCardActions {
  onRemoveRequest: () => void;
}
