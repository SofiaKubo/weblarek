import type { IEvents } from '../components/base/Events';
import type { WebLarekApi } from '../api/WebLarekApi';
import type { ProductsModel } from '../components/models/ProductsModel';
import type { Gallery } from '../components/view/gallery/Gallery';
import type { Modal } from '../components/view/modal/Modal';
import type { Header } from '../components/view/header/Header';
import { CardCatalog } from '../components/view/cards/CardCatalog';
import { IProduct } from '../types';
import { cloneTemplate } from '../utils/utils';
import { CardPreview } from '../components/view/cards/CardPreview';
import { BasketModel } from '../components/models/BasketModel';
import type {
  BasketStateChangedEvent,
  ProductSelectionChangedEvent,
  ProductsListChangedEvent,
} from '../types/events';
import { Basket } from '../components/view/basket/Basket';
import { CardBasket } from '../components/view/cards/CardBasket';

type PresenterDependencies = {
  events: IEvents;
  webLarekApi: WebLarekApi;
  imageBaseUrl: string;
  productsModel: ProductsModel;
  basketModel: BasketModel;
  galleryView: Gallery;
  modalView: Modal;
  headerView: Header;
  templates: {
    cardCatalog: HTMLTemplateElement;
    cardPreview: HTMLTemplateElement;
    basket: HTMLTemplateElement;
    cardBasket: HTMLTemplateElement;
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
  private headerView: Header;
  private templates: {
    cardCatalog: HTMLTemplateElement;
    cardPreview: HTMLTemplateElement;
    basket: HTMLTemplateElement;
    cardBasket: HTMLTemplateElement;
  };

  constructor(deps: PresenterDependencies) {
    this.events = deps.events;
    this.webLarekApi = deps.webLarekApi;
    this.imageBaseUrl = deps.imageBaseUrl;
    this.productsModel = deps.productsModel;
    this.basketModel = deps.basketModel;
    this.galleryView = deps.galleryView;
    this.modalView = deps.modalView;
    this.headerView = deps.headerView;
    this.templates = deps.templates;
  }

  init() {
    this.bindEvents();
    this.handleBasketStateChanged({
      items: this.basketModel.getItems(),
      total: this.basketModel.getTotalPrice(),
    });
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
    this.events.on<BasketStateChangedEvent>(
      'basket:state-changed',
      this.handleBasketStateChanged
    );
    this.events.on('basket:icon-clicked', this.handleBasketIconClick);
    this.events.on('modal:close-triggered', this.handleModalCloseTriggered);
  }

  private async loadInitialCatalog(): Promise<void> {
    try {
      const products = await this.webLarekApi.getProducts();
      this.productsModel.setItems(products);
    } catch {
      this.productsModel.setItems([]);
    }
  }

  private handleProductsListChanged = ({
    products,
  }: ProductsListChangedEvent) => {
    const cardElements = products.map((product) => {
      const card = new CardCatalog(cloneTemplate(this.templates.cardCatalog), {
        onCardClick: () => {
          this.productsModel.setSelectedItem(product);
        },
      });

      return card.render({
        title: product.title,
        priceText:
          product.price === null ? 'Бесценно' : `${product.price} синапсов`,
        category: product.category,
        imageSrc: product.image
          ? `${this.imageBaseUrl}/${product.image}`
          : undefined,
        imageAlt: product.title,
      });
    });

    this.galleryView.render({ catalog: cardElements });
  };

  private handleProductSelectionChanged = ({
    product,
  }: ProductSelectionChangedEvent) => {
    if (!product) return;
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

  private handleBasketStateChanged = ({ items }: BasketStateChangedEvent) => {
    this.headerView.counter = items.length;
  };

  private getBasketState = (): {
    basketItems: IProduct[];
    total: number;
    isBasketEmpty: boolean;
  } => {
    const basketItems = this.basketModel.getItems();
    const total = this.basketModel.getTotalPrice();
    const isBasketEmpty = basketItems.length === 0;

    return {
      basketItems,
      total,
      isBasketEmpty,
    };
  };

  private buildBasketCardElements = (items: IProduct[]): HTMLElement[] => {
    return items.map((item, index) => {
      const basketCardView = new CardBasket(
        cloneTemplate(this.templates.cardBasket),
        {
          onRemoveClick: () => {
            this.basketModel.removeItem(item.id);
          },
        }
      );

      return basketCardView.render({
        index: index + 1,
        title: item.title,
        priceText: `${item.price} синапсов`,
      });
    });
  };

  private renderBasketModal = (
    cardElements: HTMLElement[],
    total: number,
    isBasketEmpty: boolean
  ) => {
    const basket = new Basket(
      cloneTemplate(this.templates.basket),
      this.events
    );

    const content = basket.render({
      items: cardElements,
      total,
      submitDisabled: isBasketEmpty,
    });
    this.modalView.content = content;

    this.modalView.open();
  };

  private showBasket = () => {
    const { basketItems, total, isBasketEmpty } = this.getBasketState();

    const cardElements = this.buildBasketCardElements(basketItems);

    this.renderBasketModal(cardElements, total, isBasketEmpty);
  };

  private handleBasketIconClick = () => {
    this.showBasket();
  };
}
