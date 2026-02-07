import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { IHeader } from './types';

export class Gallery extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.basketButton = ensureElement<HTMLButtonElement>(
      '.header__basket',
      this.container
    );

    this.counterElement = ensureElement<HTMLElement>(
      '.header__basket-counter',
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
