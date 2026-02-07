import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IHeader, IHeaderActions } from './types';

export class Header extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: IHeaderActions) {
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>(
      '.header__basket',
      this.container
    );

    this.counterElement = ensureElement<HTMLElement>(
      '.header__basket-counter',
      this.container
    );

    this.basketButton.addEventListener('click', actions.onBasketOpen);
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
