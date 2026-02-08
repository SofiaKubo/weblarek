import { TPayment } from '../../types/index';
import { IBuyer } from '../../types/index';
import { IEvents } from '../../components/base/Events';
export class BuyerModel {
  private payment: TPayment | null;
  private email: string;
  private phone: string;
  private address: string;

  constructor(private readonly events: IEvents) {
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

    this.emitChange();
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

    this.emitChange();
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.payment) {
      errors.payment = 'Payment method is required';
    }
    if (!this.email) {
      errors.email = 'Email is required';
    }
    if (!this.phone) {
      errors.phone = 'Phone is required';
    }
    if (!this.address) {
      errors.address = 'Address is required';
    }
    return errors;
  }

  private emitChange(): void {
    this.events.emit('buyer:changed', {
      buyer: this.getData(),
    });
  }
}
