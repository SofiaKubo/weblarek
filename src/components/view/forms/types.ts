export interface IFormBaseData {
  valid: boolean;
  errors: string[];
}

export interface IFormActions {
  onSubmit: () => void;
  onFieldInput: (field: string, value: string) => void;
}
