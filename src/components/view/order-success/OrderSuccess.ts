import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import type { IEvents } from '../../base/Events';
import type { IOrderSuccessData } from './types';

export class OrderSuccess extends Component<IOrderSuccessData> {
  private readonly descriptionElement: HTMLElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private readonly events: IEvents
  ) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      '.order-success__description',
      this.container
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      '.order-success__close',
      this.container
    );

    this.closeButton.addEventListener('click', () => {
      this.events.emit('order-success:close-clicked');
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}
