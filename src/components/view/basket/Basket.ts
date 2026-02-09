import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import type { IBasketActions, IBasketData } from './types';

export class Basket extends Component<IBasketData> {
  private readonly listElement: HTMLElement;
  private readonly totalElement: HTMLElement;
  private readonly submitButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: IBasketActions) {
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

    this.submitButton.addEventListener('click', actions.onSubmit);
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
