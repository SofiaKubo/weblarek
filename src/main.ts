import { EventEmitter } from './components/base/Events';
import { WebLarekApi } from './api/WebLarekApi';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductsModel } from './components/models/ProductsModel';
import { Gallery } from './components/view/gallery/Gallery';
import { Modal } from './components/view/modal/Modal';
import { Presenter } from './presenter/Presenter';
import './scss/styles.scss';
import { ensureElement } from './utils/utils';
import { BasketModel } from './components/models/BasketModel';

function bootstrap(): void {
  try {
    // 1. Infrastructure
    const events = new EventEmitter();
    const api = new Api(API_URL);
    const webLarekApi = new WebLarekApi(api);
    const imageBaseUrl = CDN_URL;

    // 2. Models
    const productsModel = new ProductsModel(events);
    const basketModel = new BasketModel(events);

    // 3. DOM containers (queried once at startup)
    const galleryContainer = ensureElement<HTMLElement>('.gallery');
    const modalContainer = ensureElement<HTMLElement>('#modal-container');

    // 4. Templates
    const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
    const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

    // 5. Views (long-lived container components)
    const galleryView = new Gallery(galleryContainer);
    const modalView = new Modal(modalContainer, events);

    // 6. Presenter
    const presenter = new Presenter({
      events,
      webLarekApi,
      imageBaseUrl,
      productsModel,
      basketModel,
      galleryView,
      modalView,
      templates: {
        cardCatalog: catalogTemplate,
        cardPreview: previewTemplate,
      },
    });

    // 7. Launch
    presenter.init();
  } catch (error) {
    console.error('App bootstrap failed', error);
  }
}

bootstrap();
