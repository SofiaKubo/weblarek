export interface IFormBase {
  valid: boolean;
  errors: string[];
}

export interface IFormActions {
  onSubmit?: () => void;
  onInput?: (field: string, value: string) => void;
}
