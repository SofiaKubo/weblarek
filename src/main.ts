import { ProductsModel } from './models/ProductsModel';

import './scss/styles.scss';

import { apiProducts } from './utils/data';

const productsModel = new ProductsModel();

productsModel.setItems(apiProducts.items);
console.log('Каталог товаров загружен:', productsModel.getItems());

productsModel.getItems().forEach(({ id, title, price }) => {
  console.log(`Товар: id=${id}, title=${title}, price=${price}`);
});

const selectedProduct = productsModel.getItemById(
  'c101ab44-ed99-4a54-990d-47aa2bb4e7d9'
);

productsModel.setSelectedItem(selectedProduct ?? null);
console.log('Выбранный товар:', productsModel.getSelectedItem());
