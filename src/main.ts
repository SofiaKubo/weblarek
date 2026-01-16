import './scss/styles.scss';

import { ProductsModel } from './models/ProductsModel';
import { BasketModel } from './models/BasketModel';
import { BuyerModel } from './models/BuyerModel';

import { apiProducts } from './utils/data';

/* =============================== PRODUCTS MODEL =============================== */

console.log('=== ProductsModel ===');

const productsModel = new ProductsModel();

productsModel.setItems(apiProducts.items);
console.log('Каталог товаров загружен:', productsModel.getItems());

productsModel.getItems().forEach(({ id, title, price }) => {
  console.log(`Товар: id = ${id}, title = ${title}, price = ${price}`);
});

const selectedProduct = productsModel.getItemById(
  'c101ab44-ed99-4a54-990d-47aa2bb4e7d9'
);

productsModel.setSelectedItem(selectedProduct ?? null);
console.log('Выбранный товар:', productsModel.getSelectedItem());

/* =============================== BASKET MODEL =============================== */

console.log('=== BasketModel ===');

const basketModel = new BasketModel();

const productIds = [
  'c101ab44-ed99-4a54-990d-47aa2bb4e7d9',
  '854cef69-976d-4c2a-a18c-2aa45046c390',
  '412bcf81-7e75-4e70-bdb9-d3c73c9803b7',
];

productIds.forEach((id) => {
  const product = productsModel.getItemById(id);
  if (product) {
    basketModel.addItem(product);
  }
});

console.log('Товары в корзине:', basketModel.getItems());
console.log('Количество товаров в корзине:', basketModel.getItemsCount());
console.log('Общая стоимость:', basketModel.getTotalPrice());

basketModel.removeItem('c101ab44-ed99-4a54-990d-47aa2bb4e7d9');
console.log('Товары в корзине после удаления:', basketModel.getItems());

console.log('Количество товаров в корзине:', basketModel.getItemsCount());

basketModel.clear();
console.log('Товары в корзине после очистки:', basketModel.getItems());

/* =============================== BUYER MODEL =============================== */
console.log('=== BuyerModel ===');

const buyerModel = new BuyerModel();

buyerModel.setData({
  email: 'test@example.com',
  phone: '+49123456789',
  address: 'Berlin, Alexanderplatz',
  payment: 'card',
});

console.log('Данные покупателя:', buyerModel.getData());
console.log('Ошибки валидации:', buyerModel.validate());

buyerModel.setData({
  email: '',
  phone: '+49123456789',
  address: 'Berlin, Alexanderplatz',
  payment: 'card',
});

console.log('Ошибки валидации:', buyerModel.validate());

buyerModel.clear();
console.log('Данные после очистки:', buyerModel.getData());
