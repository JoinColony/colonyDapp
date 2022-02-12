let instance: AppErrorState | null = null;

export enum AppErrorType {
  ServerHttpConnection = 'ServerHttpConnection',
  ServerWebsocketConnection = 'ServerWebsocketConnection',
  ProviderConnection = 'ProviderConnection',
}

export interface AppErrorShape {
  type: AppErrorType;
}

/**
 * @class AppLoadingState
 *
 * Basic singleton that handles the app loading state, which tracks the user
 * context saga events listeners being set up, before triggering an initial action
 */
class AppErrorState {
  errors: AppErrorShape[];

  constructor() {
    if (!instance) {
      instance = this;
    }
    this.errors = [];
    return instance;
  }

  getErrors() {
    return this.errors;
  }

  addError(error: AppErrorShape) {
    this.errors.push(error);
  }

  clearErrors() {
    this.errors = [];
  }
}

export default new AppErrorState();
