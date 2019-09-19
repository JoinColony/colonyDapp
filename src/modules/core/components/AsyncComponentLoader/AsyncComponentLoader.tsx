import React, { Component, ElementType } from 'react';

interface Props {
  loaderFn: () => Promise<any>;
  preloader?: any;
}

interface State {
  loadedComponent: ElementType | null;
}

/**
 * A wrapper component that helps lazy loads components. (Via webpack's dynamic import()).
 * The preloader is optinal since this might be used in places that already have one. (eg: Fullscreen Modals w/ Preloaders).
 *
 * @method AsyncComponentLoader
 *
 * @param {[type]} loaderFn A callback function that returns the dynamic import call (eg: `() => import('./SomeComponent')`)
 * @param {[type]} preloader A component to be rendered while the lazy loaded component is being downloaded. (optional)
 */
export default class AsyncComponentLoader extends Component<Props, State> {
  static displayName = 'AsyncComponentLoader';

  state = {
    loadedComponent: null as ElementType | null,
  };

  componentDidMount() {
    const { loaderFn } = this.props;
    loaderFn().then(component =>
      this.setState({
        loadedComponent: component.default,
      }),
    );
  }

  render() {
    const { loadedComponent: LoadedComponent } = this.state;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { loaderFn, preloader: Preloader, ...restProps } = this.props;
    if (LoadedComponent) {
      return <LoadedComponent {...restProps} />;
    }
    if (typeof Preloader === 'function') {
      return <Preloader />;
    }
    if (typeof Preloader === 'object') {
      return Preloader;
    }
    return null;
  }
}
