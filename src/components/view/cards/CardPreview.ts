import { ensureElement } from '../../../utils/utils';
import { CardBase } from './CardBase';
import type { IPreviewCardActions, IPreviewCardData } from './types';

export class CardPreview extends CardBase<IPreviewCardData> {
  private readonly descriptionElement: HTMLElement;

  constructor(container: HTMLElement, actions: IPreviewCardActions) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      '.card__text',
      this.container
    );

    if (!this.actionButton) {
      throw new Error('Для CardPreview требуется кнопка действия');
    }

    this.actionButton.addEventListener('click', () => {
      actions.onActionClick();
    });
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }
}
