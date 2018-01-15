/* @flow */

import React, { Component } from 'react';
import type { ComponentType } from 'react';

type Props = {
  component: ComponentType<*>,
};

type State = {
  active: boolean,
};

class StandaloneField extends Component<Props, State> {
  setActive: () => void;
  setInactive: () => void;
  static displayName = 'Fields.StandaloneField';
  constructor(props: Props) {
    super(props);
    this.state = {
      active: false,
    };
    this.setActive = this.setActive.bind(this);
    this.setInactive = this.setInactive.bind(this);
  }
  setActive() {
    this.setState({
      active: true,
    });
  }
  setInactive() {
    this.setState({
      active: false,
    });
  }
  render() {
    const { component: RowComponent, ...props } = this.props;
    const { active } = this.state;
    return (
      <RowComponent {...props} onFocus={this.setActive} onBlur={this.setInactive} meta={{ active }} />
    );
  }
}

export default StandaloneField;
