import { TPayment } from '../../../types/index';
import { IBuyer } from '../../../types/index';
export class BuyerModel {
    private payment: TPayment | null;
    private email: string;
    private phone: string;
    private address: string;

    constructor() {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
    }

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) {
            this.payment = data.payment;
        }
        if (data.email !== undefined) {
            this.email = data.email;
        }
        if (data.phone !== undefined) {
            this.phone = data.phone;
        }
        if (data.address !== undefined) {
            this.address = data.address;
        }
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    clear(): void {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
    }

    validate(): Partial<Record<keyof IBuyer, string>> {
  const errors: Partial<Record<keyof IBuyer, string>> = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;

  if (!this.email) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(this.email)) {
    errors.email = 'Invalid email format';
  }
  if (!this.phone) {
    errors.phone = 'Phone number is required';
  } else if (!phoneRegex.test(this.phone)) {
    errors.phone = 'Invalid phone number format';
  }
  if (!this.address || this.address.trim().length < 5) {
    errors.address = 'Address is required';
  }
  if (!this.payment) {
    errors.payment = 'Payment method is required';
  }
  return errors;
 }
}
