import { CardBase } from './CardBase';
import { ICatalogCardActions } from './types';

export class CardCatalog extends CardBase {
  constructor(container: HTMLElement, actions: ICatalogCardActions) {
    super(container);

    this.container.addEventListener('click', actions.onSelect);
  }
}
