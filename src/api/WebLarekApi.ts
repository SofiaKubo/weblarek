import { IApi, IProduct, OrderRequest, OrderResponse } from '../types';

export class WebLarekApi {
  constructor(private api: IApi) {}

  getProducts(): Promise<IProduct[]> {
    return this.api.get<IProduct[]>('/product/');
  }

  postOrder(data: OrderRequest): Promise<OrderResponse> {
    return this.api.post<OrderResponse>('/order/', data);
  }
}
