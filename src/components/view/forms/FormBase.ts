import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import type { IFormBaseData } from './types';
import type { IEvents } from '../../base/Events';
import type {
  FormFieldChangedEvent,
  FormSubmitTriggeredEvent,
} from '../../../types/events';

export abstract class FormBase extends Component<IFormBaseData> {
  protected readonly formElement: HTMLFormElement;
  protected readonly submitButton: HTMLButtonElement;
  protected readonly errorsElement: HTMLElement;
  protected readonly events: IEvents;

  protected constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;

    this.formElement = container;

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.formElement
    );

    this.errorsElement = ensureElement<HTMLElement>(
      '.form__errors',
      this.formElement
    );

    this.bindEvents();
  }

  protected bindEvents(): void {
    this.formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.events.emit<FormSubmitTriggeredEvent>('form:submit-triggered', {
        form: this.formElement.name,
      });
    });

    this.formElement.addEventListener('input', (evt) => {
      const target = evt.target;

      if (!(target instanceof HTMLInputElement)) return;
      if (!target.name) return;

      this.events.emit<FormFieldChangedEvent>('form:field-changed', {
        form: this.formElement.name,
        field: target.name,
        value: target.value,
      });
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string[]) {
    this.errorsElement.textContent = value.join(' ');
  }

  reset(): void {
    this.formElement.reset();
    this.errors = [];
    this.valid = false;
  }
}
