let instance: AppLoadingState | null = null;

/**
 * @class AppLoadingState
 *
 * Basic singleton that handles the app loading state, which tracks the user
 * context saga events listeners being set up, before triggering an initial action
 */
class AppLoadingState {
  loading: boolean;

  constructor() {
    if (!instance) {
      instance = this;
    }
    this.loading = false;
    return instance;
  }

  get isLoading() {
    return this.loading;
  }

  set isLoading(loadingState) {
    this.loading = loadingState;
  }
}

export default AppLoadingState;
