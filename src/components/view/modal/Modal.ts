import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import type { IEvents } from '../../base/Events';
import { IModalData } from './types';

export class Modal extends Component<IModalData> {
  private readonly closeButton: HTMLButtonElement;
  private readonly contentElement: HTMLElement;
  private isOpen = false;

  constructor(
    container: HTMLElement,
    private events: IEvents
  ) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(
      '.modal__close',
      this.container
    );

    this.contentElement = ensureElement<HTMLElement>(
      '.modal__content',
      this.container
    );

    this.bindEvents();
  }

  private bindEvents(): void {
    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal:close-request');
    });

    this.container.addEventListener('click', (evt) => {
      if (evt.target === this.container) {
        this.events.emit('modal:close-request');
      }
    });
  }

  private handleEscape = (evt: KeyboardEvent): void => {
    if (evt.key === 'Escape' && this.isOpen) {
      this.events.emit('modal:close-request');
    }
  };

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

  set content(node: HTMLElement | null) {
    this.contentElement.replaceChildren();
    if (node) {
      this.contentElement.append(node);
    }
  }
}
