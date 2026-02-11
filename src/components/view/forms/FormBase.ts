import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import type { IFormBaseData, IFormActions } from './types';
import type { IEvents } from '../../base/Events';

export abstract class FormBase extends Component<IFormBaseData> {
  protected readonly formElement: HTMLFormElement;
  protected readonly submitButton: HTMLButtonElement;
  protected readonly errorsElement: HTMLElement;
  protected readonly eventBusOrActions: IEvents | IFormActions;

  protected constructor(
    container: HTMLFormElement,
    eventBusOrActions: IEvents | IFormActions
  ) {
    super(container);
    this.eventBusOrActions = eventBusOrActions;

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
      if (this.isEventBus(this.eventBusOrActions)) {
        this.eventBusOrActions.emit('form:submit-triggered', {
          form: this.formElement.name,
        });
      } else {
        this.eventBusOrActions.onSubmitRequest();
      }
    });

    this.formElement.addEventListener('input', (evt) => {
      const target = evt.target;

      if (!(target instanceof HTMLInputElement)) return;
      if (!target.name) return;

      if (this.isEventBus(this.eventBusOrActions)) {
        this.eventBusOrActions.emit('form:field-changed', {
          form: this.formElement.name,
          field: target.name,
          value: target.value,
        });
      } else {
        this.eventBusOrActions.onFieldChange(target.name, target.value);
      }
    });
  }

  private isEventBus(value: IEvents | IFormActions): value is IEvents {
    return 'emit' in value;
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
