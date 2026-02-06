import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { ICardBase } from './types';
import { categoryMap } from '../../../utils/constants';

export abstract class CardBase extends Component<ICardBase> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected categoryElement?: HTMLElement;
  protected imageElement?: HTMLImageElement;

  protected constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(
      '.card__title',
      this.container
    );

    this.priceElement = ensureElement<HTMLElement>(
      '.card__price',
      this.container
    );

    this.categoryElement =
      this.container.querySelector('.card__category') ?? undefined;

    this.imageElement =
      this.container.querySelector('.card__image') ?? undefined;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent =
      value === null ? 'Бесценно' : `${value} синапсов`;
  }

  set category(value: string | undefined) {
    if (!this.categoryElement) return;

    this.categoryElement.className = 'card__category';

    if (value) {
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
}
