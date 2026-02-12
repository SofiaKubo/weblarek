import { FormBase } from './FormBase';
import { ensureElement } from '../../../utils/utils';
import type { IEvents } from '../../base/Events';
import type { FormFieldChangedEvent } from '../../../types/index';

export class FormOrder extends FormBase {
  private readonly cardButton: HTMLButtonElement;
  private readonly cashButton: HTMLButtonElement;
  private readonly addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

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
      this.events.emit<FormFieldChangedEvent>('form:field-changed', {
        form: 'order',
        field: 'payment',
        value: 'card',
      });
    });

    this.cashButton.addEventListener('click', () => {
      this.events.emit<FormFieldChangedEvent>('form:field-changed', {
        form: 'order',
        field: 'payment',
        value: 'cash',
      });
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

