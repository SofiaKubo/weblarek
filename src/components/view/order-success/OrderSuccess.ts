import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IOrderSuccessData, IOrderSuccessActions } from './types';

export class OrderSuccess extends Component<IOrderSuccessData> {
  private readonly descriptionElement: HTMLElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private readonly actions: IOrderSuccessActions
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
      this.actions.onCloseRequest();
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}
