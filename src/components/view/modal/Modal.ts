import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IModal, IModalActions } from './types';

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  private isOpen = false;
  private readonly actions: IModalActions;

  constructor(container: HTMLElement, actions: IModalActions) {
    super(container);
    this.actions = actions;

    this.closeButton = ensureElement<HTMLButtonElement>(
      '.modal__close',
      this.container
    );

    this.contentElement = ensureElement<HTMLElement>(
      '.modal__content',
      this.container
    );

    this.closeButton.addEventListener('click', () => {
      this.actions.onClose();
    });

    this.container.addEventListener('click', (evt) => {
      if (evt.target === this.container) {
        this.actions.onClose();
      }
    });
  }

  private handleEscape = (evt: KeyboardEvent) => {
    if (evt.key === 'Escape' && this.isOpen) {
      this.actions.onClose();
    }
  };

  set content(value: HTMLElement | null) {
    this.contentElement.replaceChildren();

    if (value) {
      this.contentElement.append(value);
    }
  }

  open(): void {
    if (this.isOpen) return;

    this.isOpen = true;
    this.container.classList.add('modal_active');
    document.addEventListener('keydown', this.handleEscape);
  }

  close(): void {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.container.classList.remove('modal_active');
    this.content = null;
    document.removeEventListener('keydown', this.handleEscape);
  }
}
