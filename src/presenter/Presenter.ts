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
import type {
  ProductSelectionChangedEvent,
  ProductsListChangedEvent,
} from '../types/events';

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
    void this.loadInitialCatalog();
  }

  private bindEvents() {
    this.events.on<ProductsListChangedEvent>(
      'products:list-changed',
      this.handleProductsListChanged
    );
    this.events.on<ProductSelectionChangedEvent>(
      'products:selection-changed',
      this.handleProductSelectionChanged
    );
    this.events.on('modal:close-triggered', this.handleModalCloseTriggered);
  }

  private async loadInitialCatalog(): Promise<void> {
    try {
      const products = await this.webLarekApi.getProducts();
      this.productsModel.setItems(products);
    } catch {
      this.productsModel.setItems([]);
      // API failure — catalog stays empty, but app remains functional
    }
  }

  private handleProductsListChanged = ({ items }: ProductsListChangedEvent) => {
    const cardElements = items.map((item) => {
      const card = new CardCatalog(cloneTemplate(this.templates.cardCatalog), {
        onCardClick: () => {
          this.productsModel.setSelectedItem(item);
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

  private handleProductSelectionChanged = ({
    item,
  }: ProductSelectionChangedEvent) => {
    if (!item) return;

    const product = item;
    const isPriceless = product.price === null;
    const isInBasket = this.basketModel.hasItem(product.id);

    const cardView = new CardPreview(
      cloneTemplate(this.templates.cardPreview),
      {
        onActionClick: () => {
          this.handleProductActionClick({ product });
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

  private handleProductActionClick = ({ product }: { product: IProduct }) => {
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

  private handleModalCloseTriggered = () => {
    this.modalView.close();
  };
}
