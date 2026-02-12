import { CardBase } from './CardBase';
import { ensureElement } from '../../../utils/utils';
import type { IBasketCardActions, IBasketCardData } from './types';

export class CardBasket extends CardBase<IBasketCardData> {
  private readonly indexElement: HTMLElement;
  private readonly removeButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: IBasketCardActions) {
    super(container);
    this.indexElement = ensureElement<HTMLElement>(
      '.basket__item-index',
      this.container
    );
    this.removeButton = ensureElement<HTMLButtonElement>(
      '.basket__item-delete.card__button',
      this.container
    );

    this.removeButton.addEventListener('click', actions.onRemoveClick);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
