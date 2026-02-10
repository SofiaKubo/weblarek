import type { IEvents } from '../components/base/Events';
import type { WebLarekApi } from '../api/WebLarekApi';
import type { ProductsModel } from '../components/models/ProductsModel';
import type { Gallery } from '../components/view/gallery/Gallery';
import type { Modal } from '../components/view/modal/Modal';
import { CardCatalog } from '../components/view/cards/CardCatalog';
import { IProduct } from '../types';
import { cloneTemplate } from '../utils/utils';
import { CardPreview } from '../components/view/cards/CardPreview';
import { BasketModel } from '../components/models/BasketModel';

type PresenterDependencies = {
  events: IEvents;
  webLarekApi: WebLarekApi;
  productsModel: ProductsModel;
  basketModel: BasketModel;
  galleryView: Gallery;
  modalView: Modal;
  templates: {
    cardCatalog: HTMLTemplateElement;
    cardPreview: HTMLTemplateElement;
  };
};

export class Presenter {
  private events: IEvents;
  private webLarekApi: WebLarekApi;
  private productsModel: ProductsModel;
  private basketModel: BasketModel;
  private galleryView: Gallery;
  private modalView: Modal;
  private templates: {
    cardCatalog: HTMLTemplateElement;
    cardPreview: HTMLTemplateElement;
  };

  constructor(deps: PresenterDependencies) {
    this.events = deps.events;
    this.webLarekApi = deps.webLarekApi;
    this.productsModel = deps.productsModel;
    this.basketModel = deps.basketModel;
    this.galleryView = deps.galleryView;
    this.modalView = deps.modalView;
    this.templates = deps.templates;
  }

  init() {
    this.bindEvents();
    this.loadInitialCatalog();
  }

  private bindEvents() {
    this.events.on('products:changed', this.onProductsChanged);

    this.events.on('ui:product-clicked', this.onProductSelected);
    this.events.on('products:selected-changed', this.onProductSelectedChanged);
    this.events.on('ui:product-action', this.onProductAction);
  }

  private async loadInitialCatalog() {
    try {
      const products = await this.webLarekApi.getProducts();
      this.productsModel.setItems(products);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  }

  private onProductsChanged = (items: IProduct[]) => {
    const cardElements = items.map((item) => {
      const card = new CardCatalog(cloneTemplate(this.templates.cardCatalog), {
        onSelectRequest: () => {
          this.events.emit('ui:product-clicked', item);
        },
      });

      return card.render({
        title: item.title,
        priceText: `${item.price} синапсов`,
        category: item.category,
        imageSrc: item.image, // здесь вызвать метод для получения URL изображения, если нужно
        imageAlt: item.title,
      });
    });

    this.galleryView.render({
      catalog: cardElements,
    });
  };

  private onProductSelected = (product: IProduct) => {
    this.productsModel.setSelectedItem(product);
  };

  private onProductSelectedChanged = (product: IProduct) => {
    if (!product) return;

    let priceText: string;
    let actionText: string;
    let actionDisabled: boolean;

    if (product.price === null) {
      priceText = 'Бесценно';
      actionText = 'Недоступно';
      actionDisabled = true;
    } else if (this.basketModel.hasItem(product.id)) {
      priceText = `${product.price} синапсов`;
      actionText = 'Удалить из корзины';
      actionDisabled = false;
    } else {
      priceText = `${product.price} синапсов`;
      actionText = 'Купить';
      actionDisabled = false;
    }

    const cardView = new CardPreview(
      cloneTemplate(this.templates.cardPreview),
      {
        onActionRequest: () => {
          this.events.emit('ui:product-action', product);
        },
      }
    );

    this.modalView.content = cardView.render({
      title: product.title,
      description: product.description,
      imageSrc: product.image,
      imageAlt: product.title,
      priceText,
      category: product.category,
      actionDisabled,
      actionText,
    });
    this.modalView.open();
  };

  private onProductAction = (product: IProduct) => {
    if (product.price === null) {
      return;
    }

    if (this.basketModel.hasItem(product.id)) {
      this.basketModel.removeItem(product.id);
    } else {
      this.basketModel.addItem(product);
    }
  };
}
