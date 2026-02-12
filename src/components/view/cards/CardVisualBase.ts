import { categoryMap } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';
import { CardBase } from './CardBase';
import type { ICardVisualData } from './types';

export abstract class CardVisualBase<
  T extends ICardVisualData,
> extends CardBase<T> {
  protected readonly categoryElement: HTMLElement;
  protected readonly imageElement: HTMLImageElement;

  protected constructor(container: HTMLElement) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      '.card__category',
      this.container
    );

    this.imageElement = ensureElement<HTMLImageElement>(
      '.card__image',
      this.container
    );

  }

  set category(value: string | undefined) {
    this.categoryElement.textContent = value ?? '';

    for (const [key, className] of Object.entries(categoryMap)) {
      this.categoryElement.classList.toggle(className, key === value);
    }

    this.categoryElement.hidden = !value;
  }

  set imageSrc(value: string | undefined) {
    if (value) {
      this.imageElement.src = value;
      this.imageElement.hidden = false;
    } else {
      this.imageElement.hidden = true;
    }
  }

  set imageAlt(value: string | undefined) {
    this.imageElement.alt = value ?? '';
  }

}
