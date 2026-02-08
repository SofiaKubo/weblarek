import { CardBasket } from './components/view/cards/CardBasket';
import { CardCatalog } from './components/view/cards/CardCatalog';
import { CardPreview } from './components/view/cards/CardPreview';
import { Gallery } from './components/view/gallery/Gallery';
import { Header } from './components/view/header/Header';
import { EventEmitter } from './components/base/Events';
import './scss/styles.scss';
import { ensureElement } from './utils/utils';
import { cloneTemplate } from './utils/utils';
import { Modal } from './components/view/modal/Modal';

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

// =====================
// Gallery
// =====================
const galleryElement = ensureElement<HTMLElement>('.gallery');
const gallery = new Gallery(galleryElement);

// =====================
// Templates
// =====================
const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

// =====================
// Modal
// =====================
const events = new EventEmitter();
const modalElement = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalElement, events);

events.on('modal:close', () => {
  modal.close();
  console.log('Modal closed');
});

// =====================
// Helper: open preview
// =====================
function openPreview(data: {
  title: string;
  price: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
}) {
  const previewElement = cloneTemplate<HTMLElement>(previewTemplate);

  const preview = new CardPreview(previewElement, {
    onAction: () => {
      console.log('Add to basket clicked');
    },
  });

  preview.title = data.title;
  preview.priceText = data.price;
  preview.category = data.category;
  preview.imageSrc = data.imageSrc;
  preview.imageAlt = data.imageAlt;
  preview.description =
    'Если планируете решать задачи в тренажёре, берите два.';

  modal.content = preview.render();
  modal.open();
}

// =====================
// Cards (Catalog)
// =====================
const cardsData = [
  {
    title: '+1 час в сутках',
    price: '750',
    category: 'софт-скил',
    imageSrc: '/5 Dots.svg',
    imageAlt: 'Изображение товара',
  },
  {
    title: 'Фреймворк куки судьбы',
    price: '2500',
    category: 'хард-скилл',
    imageSrc: '/Subtract.svg',
    imageAlt: 'Изображение товара',
  },
  {
    title: 'БЭМ-пилюлька',
    price: '150000',
    category: 'другое',
    imageSrc: '/Subtract.svg',
    imageAlt: 'Изображение товара',
  },
];

const catalogCards = cardsData.map((data, index) => {
  const cardElement = cloneTemplate<HTMLElement>(catalogTemplate);

  const card = new CardCatalog(cardElement, {
    onSelect: () => {
      console.log(`Card ${index + 1} selected`);
      openPreview(data);
    },
  });

  card.title = data.title;
  card.priceText = data.price;
  card.category = data.category;
  card.imageSrc = data.imageSrc;
  card.imageAlt = data.imageAlt;

  return card.render();
});

// =====================
// Render gallery
// =====================
gallery.catalog = catalogCards;
