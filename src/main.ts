import { CardBasket } from './components/view/cards/CardBasket';
import { CardCatalog } from './components/view/cards/CardCatalog';
import { CardPreview } from './components/view/cards/CardPreview';
import { Gallery } from './components/view/gallery/Gallery';
import './scss/styles.scss';
import { ensureElement } from './utils/utils';
import { cloneTemplate } from './utils/utils';

// import { ProductsModel } from './components/models/ProductsModel';
// import { BasketModel } from './components/models/BasketModel';
// import { BuyerModel } from './components/models/BuyerModel';

// import { apiProducts } from './utils/data';

// import { API_URL } from './utils/constants';
// import { Api } from './components/base/Api';
// import { WebLarekApi } from './api/WebLarekApi';

/* =============================== PRODUCTS MODEL =============================== */

// console.log('=== ProductsModel ===');

// const productsModel = new ProductsModel();

// productsModel.setItems(apiProducts.items);
// console.log('Каталог товаров загружен:', productsModel.getItems());

// productsModel.getItems().forEach(({ id, title, price }) => {
//   console.log(`Товар: id = ${id}, title = ${title}, price = ${price}`);
// });

// const selectedProduct = productsModel.getItemById(
//   'c101ab44-ed99-4a54-990d-47aa2bb4e7d9'
// );

// productsModel.setSelectedItem(selectedProduct ?? null);
// console.log('Выбранный товар:', productsModel.getSelectedItem());

/* =============================== BASKET MODEL =============================== */

// console.log('=== BasketModel ===');

// const basketModel = new BasketModel();

// const productIds = [
//   'c101ab44-ed99-4a54-990d-47aa2bb4e7d9',
//   '854cef69-976d-4c2a-a18c-2aa45046c390',
//   '412bcf81-7e75-4e70-bdb9-d3c73c9803b7',
// ];

// productIds.forEach((id) => {
//   const product = productsModel.getItemById(id);
//   if (product) {
//     basketModel.addItem(product);
//   }
// });

// console.log('Товары в корзине:', basketModel.getItems());
// console.log('Количество товаров в корзине:', basketModel.getItemsCount());
// console.log('Общая стоимость:', basketModel.getTotalPrice());

// basketModel.removeItem('c101ab44-ed99-4a54-990d-47aa2bb4e7d9');
// console.log('Товары в корзине после удаления:', basketModel.getItems());

// console.log('Количество товаров в корзине:', basketModel.getItemsCount());

// basketModel.clear();
// console.log('Товары в корзине после очистки:', basketModel.getItems());

/* =============================== BUYER MODEL =============================== */

// console.log('=== BuyerModel ===');

// const buyerModel = new BuyerModel();

// buyerModel.setData({
//   email: 'test@example.com',
//   phone: '+49123456789',
//   address: 'Berlin, Alexanderplatz',
//   payment: 'card',
// });

// console.log('Данные покупателя:', buyerModel.getData());
// console.log('Ошибки валидации:', buyerModel.validate());

// buyerModel.setData({
//   email: '',
//   phone: '+49123456789',
//   address: 'Berlin, Alexanderplatz',
//   payment: 'card',
// });

// console.log('Ошибки валидации:', buyerModel.validate());

// buyerModel.clear();
// console.log('Данные после очистки:', buyerModel.getData());

/* =============================== INTEGRATION TEST WITH API =============================== */

// async function run() {
//   console.log('=== API → ProductsModel ===');

//   const api = new Api(API_URL);
//   const webLarekApi = new WebLarekApi(api);
//   const productsModel = new ProductsModel();

//   const products = await webLarekApi.getProducts();
//   productsModel.setItems(products);

//   console.log('Каталог товаров загружен с сервера:', productsModel.getItems());
//   console.log('Количество товаров:', productsModel.getItems().length);
// }

// run().catch((error) => {
//   console.error('Ошибка при загрузке каталога:', error);
// });

// // 1. Получили DOM-контейнер
// const gallery = ensureElement<HTMLElement>('.gallery');
// const template = ensureElement<HTMLTemplateElement>('#card-basket');
// const cardElement = cloneTemplate<HTMLElement>(template);

// // 2. Создали экземпляр карточки
// const card = new CardBasket(cardElement, {
//   onRemove: () => {
//     console.log('Basket item removed');
//   },
// });

// // 4. Заполнили данными через сеттеры
// card.title = 'Фреймворк куки судьбы';
// card.priceText = '2500 синанков';
// card.index = 1;

// // 5. Отрендерили
// gallery.replaceChildren(card.render());
// const galleryElement = ensureElement<HTMLElement>('.gallery');
// const gallery = new Gallery(galleryElement);

// const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

// const card1Element = cloneTemplate<HTMLElement>(cardTemplate);
// const card2Element = cloneTemplate<HTMLElement>(cardTemplate);
// const card3Element = cloneTemplate<HTMLElement>(cardTemplate);

// const card1 = new CardCatalog(card1Element, {
//   onSelect: () => console.log('Card 1 selected'),
// });

// const card2 = new CardCatalog(card2Element, {
//   onSelect: () => console.log('Card 2 selected'),
// });

// const card3 = new CardCatalog(card3Element, {
//   onSelect: () => console.log('Card 3 selected'),
// });

// card1.title = '+1 час в сутках';
// card1.priceText = '750';
// card1.category = 'софт-скил';
// card1.imageSrc = '/5 Dots.svg';
// card1.imageAlt = 'Изображение товара';

// card2.title = 'Фреймворк куки судьбы';
// card2.priceText = '2500';
// card2.category = 'хард-скил';
// card2.imageSrc = '/Subtract.svg';
// card2.imageAlt = 'Изображение товара';

// card3.title = 'БЭМ-пилюлька';
// card3.priceText = '150000';
// card3.category = 'другое';
// card3.imageSrc = '/Subtract.svg';
// card3.imageAlt = 'Изображение товара';

// gallery.catalog = [card1.render(), card2.render(), card3.render()];
