export interface IModal {
  content: HTMLElement | null;
}

export interface IModalActions {
  onClose(): void;
}
