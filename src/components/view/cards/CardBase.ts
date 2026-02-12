import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import type { ICardBaseData } from './types';

export abstract class CardBase<T extends ICardBaseData> extends Component<T> {
  protected readonly titleElement: HTMLElement;
  protected readonly priceTextElement: HTMLElement;

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
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set priceText(value: string | undefined) {
    this.priceTextElement.textContent = value ?? '';
  }
}
