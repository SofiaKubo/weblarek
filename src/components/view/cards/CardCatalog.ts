import { CardVisualBase } from './CardVisualBase';
import type { ICatalogCardActions, ICatalogCardData } from './types';

export class CardCatalog extends CardVisualBase<ICatalogCardData> {
  constructor(container: HTMLElement, actions: ICatalogCardActions) {
    super(container);

    this.container.addEventListener('click', actions.onCardClick);
  }
}
