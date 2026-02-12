import type { WebLarekApi } from '../api/WebLarekApi';
import type { IEvents } from '../components/base/Events';
import { BasketModel } from '../components/models/BasketModel';
import type { BuyerModel } from '../components/models/BuyerModel';
import type { ProductsModel } from '../components/models/ProductsModel';
import { Basket } from '../components/view/basket/Basket';
import { CardBasket } from '../components/view/cards/CardBasket';
import { CardCatalog } from '../components/view/cards/CardCatalog';
import { CardPreview } from '../components/view/cards/CardPreview';
import { FormContacts } from '../components/view/forms/FormContacts';
import { FormOrder } from '../components/view/forms/FormOrder';
import { OrderSuccess } from '../components/view/order-success/OrderSuccess';
import type { Gallery } from '../components/view/gallery/Gallery';
import type { Header } from '../components/view/header/Header';
import type { Modal } from '../components/view/modal/Modal';

import { IProduct, TPayment } from '../types';
import type {
  BasketStateChangedEvent,
  ProductSelectionChangedEvent,
  ProductsListChangedEvent,
  FormFieldChangedEvent,
  FormSubmitTriggeredEvent,
} from '../types/events';
import { cloneTemplate } from '../utils/utils';

type StepState<TFields> = {
  fields: TFields;
  errors: string[];
  valid: boolean;
};

type PresenterDependencies = {
  events: IEvents;
  webLarekApi: WebLarekApi;
  imageBaseUrl: string;
  productsModel: ProductsModel;
  basketModel: BasketModel;
  buyerModel: BuyerModel;
  galleryView: Gallery;
  modalView: Modal;
  headerView: Header;
  templates: {
    cardCatalog: HTMLTemplateElement;
    cardPreview: HTMLTemplateElement;
    basket: HTMLTemplateElement;
    cardBasket: HTMLTemplateElement;
    order: HTMLTemplateElement;
    contacts: HTMLTemplateElement;
    success: HTMLTemplateElement;
  };
};

export class Presenter {
  private events: IEvents;
  private webLarekApi: WebLarekApi;
  private imageBaseUrl: string;
  private productsModel: ProductsModel;
  private basketModel: BasketModel;
  private buyerModel: BuyerModel;
  private galleryView: Gallery;
  private modalView: Modal;
  private headerView: Header;
  private isBasketViewOpen = false;
  private currentCheckoutStep: 'order' | 'contacts' | null = null;
  private orderFormView: FormOrder | null = null;
  private contactsFormView: FormContacts | null = null;
  private templates: {
    cardCatalog: HTMLTemplateElement;
    cardPreview: HTMLTemplateElement;
    basket: HTMLTemplateElement;
    cardBasket: HTMLTemplateElement;
    order: HTMLTemplateElement;
    contacts: HTMLTemplateElement;
    success: HTMLTemplateElement;
  };

  constructor(deps: PresenterDependencies) {
    this.events = deps.events;
    this.webLarekApi = deps.webLarekApi;
    this.imageBaseUrl = deps.imageBaseUrl;
    this.productsModel = deps.productsModel;
    this.basketModel = deps.basketModel;
    this.buyerModel = deps.buyerModel;
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

    this.events.on('basket:checkout-clicked', this.handleBasketCheckoutClick);
    this.events.on<FormFieldChangedEvent>(
      'form:field-changed',
      this.handleFormFieldChanged
    );
    this.events.on<FormSubmitTriggeredEvent>(
      'form:submit-triggered',
      this.handleFormSubmitTriggered
    );
    this.events.on('buyer:data-changed', this.handleBuyerDataChanged);
    this.events.on(
      'order-success:close-clicked',
      this.handleOrderSuccessCloseClicked
    );
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
    const cardElements = this.buildCatalogCardElements(products);
    this.galleryView.render({ catalog: cardElements });
  };

  private handleProductSelectionChanged = ({
    product,
  }: ProductSelectionChangedEvent) => {
    if (!product) return;
    const previewState = this.getProductPreviewState(product);
    const content = this.buildProductPreviewContent(product, previewState);
    this.showModalContent(content);
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

    this.handleModalCloseTriggered();
  };

  private handleModalCloseTriggered = () => {
    this.modalView.close();
    this.isBasketViewOpen = false;
    this.currentCheckoutStep = null;
    this.orderFormView = null;
    this.contactsFormView = null;
  };

  private handleBasketIconClick = () => {
    this.showBasket();
  };

  private handleBasketStateChanged = ({ items }: BasketStateChangedEvent) => {
    this.headerView.counter = items.length;
    this.refreshBasketModalIfOpen();
  };

  private buildCatalogCardElements = (products: IProduct[]): HTMLElement[] => {
    return products.map((product) => {
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
  };

  private getProductPreviewState = (product: IProduct) => {
    const isPriceless = product.price === null;
    const isInBasket = this.basketModel.hasItem(product.id);

    return {
      isPriceless,
      isInBasket,
    };
  };

  private buildProductPreviewContent = (
    product: IProduct,
    state: { isPriceless: boolean; isInBasket: boolean }
  ): HTMLElement => {
    const cardView = new CardPreview(
      cloneTemplate(this.templates.cardPreview),
      {
        onActionClick: () => {
          this.handleProductActionClick({ product });
        },
      }
    );

    return cardView.render({
      title: product.title,
      description: product.description,
      imageSrc: product.image
        ? `${this.imageBaseUrl}/${product.image}`
        : undefined,
      imageAlt: product.title,
      priceText: state.isPriceless ? 'Бесценно' : `${product.price} синапсов`,
      category: product.category,
      actionDisabled: state.isPriceless,
      actionText: state.isPriceless
        ? 'Недоступно'
        : state.isInBasket
          ? 'Удалить из корзины'
          : 'Купить',
    });
  };

  private showModalContent = (content: HTMLElement) => {
    this.modalView.content = content;
    this.modalView.open();
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

    this.showModalContent(content);
  };

  private showBasket = () => {
    this.isBasketViewOpen = true;

    const { basketItems, total, isBasketEmpty } = this.getBasketState();
    const cardElements = this.buildBasketCardElements(basketItems);

    this.renderBasketModal(cardElements, total, isBasketEmpty);
  };

  private refreshBasketModalIfOpen = () => {
    if (!this.isBasketViewOpen) {
      return;
    }

    this.showBasket();
  };

  private getOrderStepState(): StepState<{
    payment: TPayment | null;
    address: string;
  }> {
    const { payment, address } = this.buyerModel.getData();
    const allErrors = this.buyerModel.validate();

    const errors = [allErrors.payment, allErrors.address].filter(
      (message): message is string => message !== undefined
    );

    const valid =
      errors.length === 0 && payment !== null && address.trim().length > 0;

    return {
      fields: {
        payment,
        address,
      },
      errors,
      valid,
    };
  }

  private getContactsStepState(): StepState<{ email: string; phone: string }> {
    const { email, phone } = this.buyerModel.getData();
    const allErrors = this.buyerModel.validate();

    const errors = [allErrors.email, allErrors.phone].filter(
      (message): message is string => message !== undefined
    );

    const valid =
      errors.length === 0 && email.trim().length > 0 && phone.trim().length > 0;

    return {
      fields: {
        email,
        phone,
      },
      errors,
      valid,
    };
  }

  private renderOrderStep = (
    orderStep: StepState<{ payment: TPayment | null; address: string }>
  ) => {
    const orderForm = new FormOrder(
      cloneTemplate(this.templates.order),
      this.events
    );
    orderForm.payment = orderStep.fields.payment;
    orderForm.address = orderStep.fields.address;

    const content = orderForm.render({
      valid: orderStep.valid,
      errors: orderStep.errors,
    });

    this.orderFormView = orderForm;
    this.contactsFormView = null;
    this.showModalContent(content);
  };

  private renderContactsStep = (
    contactsStep: StepState<{ email: string; phone: string }>
  ) => {
    const contactsForm = new FormContacts(
      cloneTemplate(this.templates.contacts),
      this.events
    );
    contactsForm.email = contactsStep.fields.email;
    contactsForm.phone = contactsStep.fields.phone;

    const content = contactsForm.render({
      valid: contactsStep.valid,
      errors: contactsStep.errors,
    });

    this.contactsFormView = contactsForm;
    this.orderFormView = null;
    this.showModalContent(content);
  };

  private renderSuccessStep(total: number) {
    const successView = new OrderSuccess(
      cloneTemplate(this.templates.success),
      this.events
    );

    successView.total = total;
    this.showModalContent(successView.render());
    this.currentCheckoutStep = null;
    this.basketModel.clear();
    this.buyerModel.clear();
  }

  private submitOrder = async (): Promise<void> => {
    const buyer = this.buyerModel.getData();
    const items = this.basketModel.getItems();
    const total = this.basketModel.getTotalPrice();

    if (buyer.payment === null) return;

    const orderData = {
      payment: buyer.payment,
      email: buyer.email,
      phone: buyer.phone,
      address: buyer.address,
      items: items.map((item) => item.id),
      total,
    };

    try {
      await this.webLarekApi.postOrder(orderData);
      this.renderSuccessStep(total);
    } catch {
      const contactsStep = this.getContactsStepState();
      this.renderContactsStep({
        ...contactsStep,
        valid: false,
        errors: [
          ...contactsStep.errors,
          'Не удалось оформить заказ. Попробуйте ещё раз.',
        ],
      });
    }
  };

  private handleBasketCheckoutClick = () => {
    const isBasketEmpty = this.basketModel.getItemsCount() === 0;

    if (isBasketEmpty) return;
    this.isBasketViewOpen = false;
    const orderStep = this.getOrderStepState();
    this.renderOrderStep(orderStep);
    this.currentCheckoutStep = 'order';
  };

  private handleFormFieldChanged = ({
    form,
    field,
    value,
  }: FormFieldChangedEvent) => {
    if (form === 'order') {
      if (field === 'payment') {
        this.buyerModel.setData({ payment: value });
      } else if (field === 'address') {
        this.buyerModel.setData({ address: value });
      }
      return;
    }

    if (form === 'contacts') {
      if (field === 'email') {
        this.buyerModel.setData({ email: value });
      } else if (field === 'phone') {
        this.buyerModel.setData({ phone: value });
      }
    }
  };

  private handleFormSubmitTriggered = ({ form }: FormSubmitTriggeredEvent) => {
    if (form === 'order') {
      const orderStep = this.getOrderStepState();

      if (!orderStep.valid) {
        this.renderOrderStep(orderStep);
        this.currentCheckoutStep = 'order';
        return;
      }

      const contactsStep = this.getContactsStepState();
      this.renderContactsStep(contactsStep);
      this.currentCheckoutStep = 'contacts';
      return;
    }

    if (form === 'contacts') {
      const contactsStep = this.getContactsStepState();

      if (!contactsStep.valid) {
        this.renderContactsStep(contactsStep);
        this.currentCheckoutStep = 'contacts';
        return;
      }

      void this.submitOrder();
    }
  };

  private handleBuyerDataChanged = () => {
    if (this.currentCheckoutStep === 'order') {
      if (!this.orderFormView) return;
      const orderStep = this.getOrderStepState();
      this.orderFormView.payment = orderStep.fields.payment;
      this.orderFormView.valid = orderStep.valid;
      this.orderFormView.errors = orderStep.errors;
      return;
    }

    if (this.currentCheckoutStep === 'contacts') {
      if (!this.contactsFormView) return;
      const contactsStep = this.getContactsStepState();
      this.contactsFormView.valid = contactsStep.valid;
      this.contactsFormView.errors = contactsStep.errors;
    }
  };

  private handleOrderSuccessCloseClicked = () => {
    this.handleModalCloseTriggered();
  };
}
