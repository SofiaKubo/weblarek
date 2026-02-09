export interface IFormBaseData {
  valid: boolean;
  errors: string[];
}

export interface IFormActions {
  onSubmitRequest: () => void;
  onFieldChange: (field: string, value: string) => void;
}

export interface IFormContactsData extends IFormBaseData {
  email: string;
  phone: string;
}

export interface IFormOrderData extends IFormBaseData {
  payment: 'card' | 'cash' | null;
  address: string;
}
