export interface IFormBase {
  valid: boolean;
  errors: string[];
}

export interface IFormActions {
  onSubmit: () => void;
  onChange: (field: string, value: string) => void;
}

export interface IFormContacts extends IFormBase {}
