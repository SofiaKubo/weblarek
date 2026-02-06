import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { ICardBase } from './types';
import { categoryMap } from '../../../utils/constants';

export abstract class CardBase extends Component<ICardBase> {
  protected titleElement: HTMLElement;
  protected priceTextElement: HTMLElement;
  protected categoryElement?: HTMLElement;
  protected imageElement?: HTMLImageElement;
  protected actionButton?: HTMLButtonElement;

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

    this.categoryElement.className = 'card__category';

    if (value && value in categoryMap) {
      this.categoryElement.textContent = value;
      this.categoryElement.classList.add(
        categoryMap[value as keyof typeof categoryMap]
      );
      this.categoryElement.hidden = false;
    } else {
      this.categoryElement.hidden = true;
    }
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

  set actionEnabled(value: boolean) {
    if (!this.actionButton) return;
    this.actionButton.disabled = !value;
  }

  set actionText(value: string) {
    if (!this.actionButton) return;
    this.actionButton.textContent = value;
  }
}
