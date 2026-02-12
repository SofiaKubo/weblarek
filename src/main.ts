import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { ProductsModel } from './components/models/ProductsModel';
import { Gallery } from './components/view/gallery/Gallery';
import { Header } from './components/view/header/Header';
import { Modal } from './components/view/modal/Modal';
import { WebLarekApi } from './api/WebLarekApi';
import { Presenter } from './presenter/Presenter';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import './scss/styles.scss';

type AppContainers = {
  gallery: HTMLElement;
  header: HTMLElement;
  modal: HTMLElement;
};

type AppTemplates = {
  basket: HTMLTemplateElement;
  cardBasket: HTMLTemplateElement;
  cardCatalog: HTMLTemplateElement;
  cardPreview: HTMLTemplateElement;
  contacts: HTMLTemplateElement;
  order: HTMLTemplateElement;
  success: HTMLTemplateElement;
};

function queryAppContainers(): AppContainers {
  return {
    gallery: ensureElement<HTMLElement>('.gallery'),
    header: ensureElement<HTMLElement>('.header'),
    modal: ensureElement<HTMLElement>('#modal-container'),
  };
}

function queryAppTemplates(): AppTemplates {
  return {
    basket: ensureElement<HTMLTemplateElement>('#basket'),
    cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
    cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
    cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
    contacts: ensureElement<HTMLTemplateElement>('#contacts'),
    order: ensureElement<HTMLTemplateElement>('#order'),
    success: ensureElement<HTMLTemplateElement>('#success'),
  };
}

function bootstrapApp(): Presenter {
  // 1. Инфраструктура
  const events = new EventEmitter();
  const api = new Api(API_URL);
  const webLarekApi = new WebLarekApi(api);
  const imageBaseUrl = CDN_URL;

  // 2. Модели
  const productsModel = new ProductsModel(events);
  const basketModel = new BasketModel(events);
  const buyerModel = new BuyerModel(events);

  // 3. DOM-контейнеры и шаблоны (запрашиваются один раз при старте)
  const containers = queryAppContainers();
  const templates = queryAppTemplates();

  // 5. Представления (долгоживущие контейнерные компоненты)
  const galleryView = new Gallery(containers.gallery);
  const modalView = new Modal(containers.modal, events);
  const headerView = new Header(containers.header, events);

  // 6. Презентер
  return new Presenter({
    events,
    webLarekApi,
    imageBaseUrl,
    productsModel,
    basketModel,
    buyerModel,
    galleryView,
    modalView,
    headerView,
    templates,
  });
}

function initApp(): void {
  try {
    // 7. Запуск
    const presenter = bootstrapApp();
    presenter.init();
  } catch (error) {
    console.error('Ошибка инициализации приложения', error);
  }
}

initApp();
