/* @flow */

import React, { Component } from 'react';
import type { ComponentType } from 'react';

type Props = {
  component: ComponentType<any>,
};

type State = {
  active: boolean,
};

class StandaloneField extends Component<Props, State> {
  static displayName = 'core.Fields.StandaloneField';
  constructor(props: Props) {
    super(props);
    this.state = {
      active: false,
    };
  }
  setActive = (): void => {
    this.setState({
      active: true,
    });
  };
  setInactive = (): void => {
    this.setState({
      active: false,
    });
  };
  render() {
    const { component: RowComponent, ...props } = this.props;
    const { active } = this.state;
    return (
      <RowComponent
        {...props}
        onFocus={this.setActive}
        onBlur={this.setInactive}
        meta={{ active }}
      />
    );
  }
}

export default StandaloneField;
