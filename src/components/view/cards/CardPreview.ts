import { ensureElement } from '../../../utils/utils';
import { CardBase } from './CardBase';
import type { IPreviewCardActions } from './types';

export class CardPreview extends CardBase {
  private readonly descriptionElement: HTMLElement;

  constructor(
    container: HTMLElement,
    private readonly actions: IPreviewCardActions
  ) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      '.card__text',
      this.container
    );

    if (!this.actionButton) {
      throw new Error('Action button is required for CardPreview');
    }

    this.actionButton.addEventListener('click', () => {
      this.actions.onAction();
    });
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }
}
