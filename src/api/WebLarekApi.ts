import {
  IApi,
  IProduct,
  OrderRequest,
  OrderResponse,
  ProductsResponse,
} from '../types';
export class WebLarekApi {
  constructor(private api: IApi) {}

  getProducts(): Promise<IProduct[]> {
    return this.api
      .get<ProductsResponse>('/product')
      .then((data) => data.items);
  }

  postOrder(data: OrderRequest): Promise<OrderResponse> {
    return this.api.post<OrderResponse>('/order/', data);
  }
}
