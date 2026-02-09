import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import type { IFormBaseData, IFormActions } from './types';

export abstract class FormBase extends Component<IFormBaseData> {
  protected readonly formElement: HTMLFormElement;
  protected readonly submitButton: HTMLButtonElement;
  protected readonly errorsElement: HTMLElement;

  protected constructor(
    container: HTMLFormElement,
    protected readonly actions: IFormActions
  ) {
    super(container);

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
      this.actions.onSubmitRequest();
    });

    this.formElement.addEventListener('input', (evt) => {
      const target = evt.target;

      if (!(target instanceof HTMLInputElement)) return;
      if (!target.name) return;

      this.actions.onFieldChange(target.name, target.value);
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
