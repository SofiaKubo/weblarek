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

export type ICatalogCardData = ICardBaseData;

export interface ICatalogCardActions {
  onCardClick: () => void;
}

export interface IPreviewCardActions {
  onActionClick: () => void;
}

export interface IBasketCardActions {
  onRemoveClick: () => void;
}
