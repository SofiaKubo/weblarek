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
  imageBaseUrl: string;
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
  private imageBaseUrl: string;
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
    this.imageBaseUrl = deps.imageBaseUrl;
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
    this.events.on('products:selected-changed', this.onProductSelectedChanged);
    this.events.on('ui:modal-close-request', this.onModalCloseRequest);
  }

  private async loadInitialCatalog() {
    try {
      const products = await this.webLarekApi.getProducts();
      this.productsModel.setItems(products);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  }

  private onProductsChanged = ({ items }: { items: IProduct[] }) => {
    const cardElements = items.map((item) => {
      const card = new CardCatalog(cloneTemplate(this.templates.cardCatalog), {
        onSelectRequest: () => {
          const product = this.productsModel.getItemById(item.id);
          if (product) this.productsModel.setSelectedItem(product);
        },
      });

      return card.render({
        title: item.title,
        priceText: item.price === null ? 'Бесценно' : `${item.price} синапсов`,
        category: item.category,
        imageSrc: item.image ? `${this.imageBaseUrl}/${item.image}` : undefined,
        imageAlt: item.title,
      });
    });

    this.galleryView.render({ catalog: cardElements });
  };

  private onProductSelectedChanged = ({ item }: { item: IProduct | null }) => {
    if (!item) return;

    const product = item;
    const isPriceless = product.price === null;
    const isInBasket = this.basketModel.hasItem(product.id);

    const cardView = new CardPreview(
      cloneTemplate(this.templates.cardPreview),
      {
        onActionRequest: () => {
          this.handleProductAction({ product });
        },
      }
    );

    const content = cardView.render({
      title: product.title,
      description: product.description,
      imageSrc: product.image
        ? `${this.imageBaseUrl}/${product.image}`
        : undefined,
      imageAlt: product.title,
      priceText: isPriceless ? 'Бесценно' : `${product.price} синапсов`,
      category: product.category,
      actionDisabled: isPriceless,
      actionText: isPriceless
        ? 'Недоступно'
        : isInBasket
          ? 'Удалить из корзины'
          : 'Купить',
    });

    this.modalView.content = content;

    this.modalView.open();
  };

  private handleProductAction = ({ product }: { product: IProduct }) => {
    if (product.price === null) {
      return;
    }

    const isInBasket = this.basketModel.hasItem(product.id);

    if (isInBasket) {
      this.basketModel.removeItem(product.id);
    } else {
      this.basketModel.addItem(product);
    }

    this.modalView.close();
  };

  private onModalCloseRequest = () => {
    this.modalView.close();
  };
}
