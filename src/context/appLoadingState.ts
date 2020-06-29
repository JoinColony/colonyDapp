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
    this.loading = true;
    return instance;
  }

  /**
   * @NOTE We're using named getter and setters as opposed as the built-in ones
   *
   * Ie: set isLoading() { ... }
   * Because otherwise we would need to jump through various hoops in order to
   * call the setter from a redux saga.
   * So in order to cut down on code boilerplate, we're just doing this
   */
  getIsLoading() {
    return this.loading;
  }

  setIsLoading(loadingState) {
    this.loading = loadingState;
  }
}

export default new AppLoadingState();
