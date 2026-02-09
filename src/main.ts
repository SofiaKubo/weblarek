import { CardBasket } from './components/view/cards/CardBasket';
import { CardCatalog } from './components/view/cards/CardCatalog';
import { CardPreview } from './components/view/cards/CardPreview';
import { Basket } from './components/view/basket/Basket';
import { FormOrder } from './components/view/forms/FormOrder';
import { FormContacts } from './components/view/forms/FormContacts';
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
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// =====================
// Modal
// =====================
const events = new EventEmitter();
const modalElement = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalElement, events);

events.on('modal:close-request', () => {
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
  preview.priceText = `${data.price} синапсов`;
  preview.category = data.category;
  preview.imageSrc = data.imageSrc;
  preview.imageAlt = data.imageAlt;
  preview.actionText = 'Купить';
  preview.description =
    'Если планируете решать задачи в тренажёре, берите два.';

  modal.content = preview.render();
  modal.open();
}

// =====================
// Helper: open basket
// =====================
function openBasket(items: typeof cardsData) {
  const basketElement = cloneTemplate<HTMLElement>(basketTemplate);
  const basket = new Basket(basketElement, {
    onSubmit: () => {
      console.log('Basket submit');
      openOrderForm();
    },
  });

  const basketCards = items.map((item, index) => {
    const cardElement = cloneTemplate<HTMLElement>(basketCardTemplate);
    const card = new CardBasket(cardElement, {
      onRemove: () => {
        console.log(`Remove item ${index + 1}`);
      },
    });

    card.index = index + 1;
    card.title = item.title;
    card.priceText = item.price;

    return card.render();
  });

  const total = items.reduce((sum, item) => sum + Number(item.price), 0);

  basket.items = basketCards;
  basket.total = total;
  basket.submitDisabled = items.length === 0;

  modal.content = basket.render();
  modal.open();
}

// =====================
// Helper: open order form
// =====================
function openOrderForm() {
  const orderElement = cloneTemplate<HTMLFormElement>(orderTemplate);
  let payment: 'card' | 'cash' | null = null;
  let address = '';

  const orderForm = new FormOrder(orderElement, {
    onChange: (field, value) => {
      if (field === 'payment' && (value === 'card' || value === 'cash')) {
        payment = value;
        orderForm.payment = payment;
      }

      if (field === 'address') {
        address = value;
        orderForm.address = address;
      }

      const errors: string[] = [];

      if (!payment) {
        errors.push('Выберите способ оплаты.');
      }

      if (address.trim().length < 5) {
        errors.push('Введите адрес доставки (минимум 5 символов).');
      }

      orderForm.valid = errors.length === 0;
      orderForm.errors = errors;
    },
    onSubmit: () => {
      console.log('Order submit', { payment, address });
      openContactsForm();
    },
  });

  orderForm.payment = payment;
  orderForm.address = address;
  orderForm.valid = false;
  orderForm.errors = [];

  modal.content = orderForm.render();
  modal.open();
}

// =====================
// Helper: open contacts form
// =====================
function openContactsForm() {
  const contactsElement = cloneTemplate<HTMLFormElement>(contactsTemplate);
  let email = '';
  let phone = '';

  const contactsForm = new FormContacts(contactsElement, {
    onChange: (field, value) => {
      if (field === 'email') {
        email = value;
        contactsForm.email = email;
      }

      if (field === 'phone') {
        phone = value;
        contactsForm.phone = phone;
      }

      const errors: string[] = [];
      const emailValue = email.trim();
      const phoneValue = phone.trim();

      if (!emailValue.includes('@')) {
        errors.push('Введите корректный email.');
      }

      if (phoneValue.replace(/\D/g, '').length < 10) {
        errors.push('Введите корректный номер телефона.');
      }

      contactsForm.valid = errors.length === 0;
      contactsForm.errors = errors;
    },
    onSubmit: () => {
      console.log('Contacts submit', { email, phone });
      modal.close();
    },
  });

  contactsForm.email = email;
  contactsForm.phone = phone;
  contactsForm.valid = false;
  contactsForm.errors = [];

  modal.content = contactsForm.render();
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
    imageSrc:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=640&q=80',
    imageAlt: 'Изображение товара',
  },
  {
    title: 'Фреймворк куки судьбы',
    price: '2500',
    category: 'хард-скил',
    imageSrc:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=640&q=80',
    imageAlt: 'Изображение товара',
  },
  {
    title: 'БЭМ-пилюлька',
    price: '150000',
    category: 'другое',
    imageSrc:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=640&q=80',
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
// Header
// =====================
const headerElement = ensureElement<HTMLElement>('.header');
const header = new Header(headerElement, events);

events.on('basket:open', () => {
  openBasket(cardsData.slice(0, 2));
});

header.counter = 2;

// =====================
// Render gallery
// =====================
gallery.catalog = catalogCards;
