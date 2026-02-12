import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import type { IEvents } from '../../base/Events';
import type { IHeaderData } from './types';

export class Header extends Component<IHeaderData> {
  private readonly counterElement: HTMLElement;
  private readonly basketButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private readonly events: IEvents
  ) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>(
      '.header__basket-counter',
      this.container
    );

    this.basketButton = ensureElement<HTMLButtonElement>(
      '.header__basket',
      this.container
    );

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:icon-clicked');
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
