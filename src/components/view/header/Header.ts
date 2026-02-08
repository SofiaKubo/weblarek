import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IHeader } from './types';
import type { IEvents } from '../../base/Events';

export class Header extends Component<IHeader> {
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
      this.events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
