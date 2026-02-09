import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { ICardBaseData } from './types';
import { categoryMap } from '../../../utils/constants';

export abstract class CardBase<T extends ICardBaseData> extends Component<T> {
  protected readonly titleElement: HTMLElement;
  protected readonly priceTextElement: HTMLElement;
  protected readonly categoryElement?: HTMLElement;
  protected readonly imageElement?: HTMLImageElement;
  protected readonly actionButton?: HTMLButtonElement;

  protected constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(
      '.card__title',
      this.container
    );

    this.priceTextElement = ensureElement<HTMLElement>(
      '.card__price',
      this.container
    );

    this.categoryElement =
      this.container.querySelector('.card__category') ?? undefined;

    this.imageElement =
      this.container.querySelector('.card__image') ?? undefined;

    this.actionButton =
      this.container.querySelector('.card__button') ?? undefined;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set priceText(value: string | undefined) {
    this.priceTextElement.textContent = value ?? '';
  }

  set category(value: string | undefined) {
    if (!this.categoryElement) return;

    this.categoryElement.textContent = value ?? '';

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as keyof typeof categoryMap],
        key === value
      );
    }

    this.categoryElement.hidden = !value;
  }

  set imageSrc(value: string | undefined) {
    if (!this.imageElement) return;

    if (value) {
      this.imageElement.src = value;
      this.imageElement.hidden = false;
    } else {
      this.imageElement.hidden = true;
    }
  }

  set imageAlt(value: string | undefined) {
    if (!this.imageElement) return;

    this.imageElement.alt = value ?? '';
  }

  set actionDisabled(value: boolean) {
    if (!this.actionButton) return;
    this.actionButton.disabled = value;
  }

  set actionText(value: string) {
    if (!this.actionButton) return;
    this.actionButton.textContent = value;
  }
}
