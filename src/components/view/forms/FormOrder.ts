import { FormBase } from './FormBase';
import { ensureElement } from '../../../utils/utils';
import type { IFormActions } from './types';

export class FormOrder extends FormBase {
  private readonly cardButton: HTMLButtonElement;
  private readonly cashButton: HTMLButtonElement;
  private readonly addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, actions: IFormActions) {
    super(container, actions);

    this.cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container
    );

    this.cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container
    );

    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container
    );

    this.cardButton.addEventListener('click', () => {
      actions.onChange('payment', 'card');
    });

    this.cashButton.addEventListener('click', () => {
      actions.onChange('payment', 'cash');
    });
  }

  set payment(value: 'card' | 'cash' | null) {
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
