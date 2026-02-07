import { Component } from '../../base/Component';
import { IGallery } from './types';

export class Gallery extends Component<IGallery> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set catalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}
