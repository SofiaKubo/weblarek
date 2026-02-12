import { ensureElement } from '../../../utils/utils';
import { CardVisualBase } from './CardVisualBase';
import type { IPreviewCardActions, IPreviewCardData } from './types';

export class CardPreview extends CardVisualBase<IPreviewCardData> {
  private readonly descriptionElement: HTMLElement;
  protected readonly actionButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: IPreviewCardActions) {
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
      actions.onActionClick();
    });
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set actionDisabled(value: boolean) {
    this.actionButton.disabled = value;
  }

  set actionText(value: string) {
    this.actionButton.textContent = value;
  }
}
