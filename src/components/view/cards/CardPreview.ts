import { CardBase } from './CardBase';
import { ensureElement } from '../../../utils/utils';

export class CardPreview extends CardBase {
  protected descriptionElement: HTMLElement;

  private actionHandler: (() => void) | null = null;

  constructor(container: HTMLElement) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      '.card__text',
      this.container
    );

    this.actionButton = ensureElement<HTMLButtonElement>(
      '.card__button',
      this.container
    );

    this.actionButton.addEventListener('click', () => {
      this.actionHandler?.();
    });
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  setActionHandler(handler: () => void) {
    this.actionHandler = handler;
  }
}
