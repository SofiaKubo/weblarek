import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import type { IBasketData } from './types';
import type { IEvents } from '../../base/Events';

export class Basket extends Component<IBasketData> {
  private readonly listElement: HTMLElement;
  private readonly totalElement: HTMLElement;
  private readonly submitButton: HTMLButtonElement;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);

    this.listElement = ensureElement<HTMLElement>(
      '.basket__list',
      this.container
    );

    this.totalElement = ensureElement<HTMLElement>(
      '.basket__price',
      this.container
    );

    this.submitButton = ensureElement<HTMLButtonElement>(
      '.basket__button',
      this.container
    );

    this.submitButton.addEventListener('click', () => {
      this.events.emit('basket:checkout-clicked');
    });
  }

  set items(cards: HTMLElement[]) {
    this.listElement.replaceChildren(...cards);
  }

  set submitDisabled(value: boolean) {
    this.submitButton.disabled = value;
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }
}
