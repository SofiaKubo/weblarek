import { IApi, IProduct, OrderRequest, OrderResponse } from '../types';

export class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProduct[]> {
    return this.api.get('/product/');
  }

  postOrder(data: OrderRequest): Promise<OrderResponse> {
    return this.api.post('/order/', data);
  }
}
