export interface IFormBase {
  valid: boolean;
  errors: string[];
}

export interface IFormActions {
  onSubmit: () => void;
  onChange: (field: string, value: string) => void;
}

export interface IFormContacts extends IFormBase {
  email: string;
  phone: string;
}

export interface IFormOrder extends IFormBase {
  payment: 'card' | 'cash' | null;
  address: string;
}
