import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IModal, IModalActions } from './types';

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(container: HTMLElement, actions: IModalActions) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(
      '.modal__close',
      this.container
    );

    this.contentElement = ensureElement<HTMLElement>(
      '.modal__content',
      this.container
    );

    this.closeButton.addEventListener('click', actions.onClose);

    this.container.addEventListener('click', (evt) => {
      if (evt.target === this.container) {
        actions.onClose();
      }
    });

    this.contentElement.addEventListener('click', (evt) => {
      evt.stopPropagation();
    });

    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        actions.onClose();
      }
    });
  }

  set content(value: HTMLElement | null) {
    this.contentElement.replaceChildren();

    if (value) {
      this.contentElement.append(value);
    }
  }

  open(): void {
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.content = null;
  }
}
