export interface ICardBaseData {
  title: string;
  priceText: string;
}

export interface ICardVisualData extends ICardBaseData {
  category?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export interface ICardActionData extends ICardBaseData {
  actionDisabled?: boolean;
  actionText?: string;
}

export interface IPreviewCardData extends ICardVisualData, ICardActionData {
  description: string;
}

export interface IBasketCardData extends ICardBaseData {
  index: number;
}

export type ICatalogCardData = ICardVisualData;

export interface ICatalogCardActions {
  onCardClick: () => void;
}

export interface IPreviewCardActions {
  onActionClick: () => void;
}

export interface IBasketCardActions {
  onRemoveClick: () => void;
}
