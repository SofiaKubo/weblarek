import type { IFormActions } from './types';
import { FormBase } from './FormBase';

export class FormContacts extends FormBase {
  constructor(container: HTMLFormElement, actions: IFormActions) {
    super(container, actions);
  }
}
