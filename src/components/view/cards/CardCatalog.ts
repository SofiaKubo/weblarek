import { CardBase } from './CardBase';
import { ICatalogCardActions, ICatalogCardData } from './types';

export class CardCatalog extends CardBase<ICatalogCardData> {
  constructor(container: HTMLElement, actions: ICatalogCardActions) {
    super(container);

    this.container.addEventListener('click', actions.onCardClick);
  }
}
