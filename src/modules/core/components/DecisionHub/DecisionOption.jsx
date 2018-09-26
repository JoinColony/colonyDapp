/* @flow */

import React, { Component } from 'react';
import type { MessageDescriptor } from 'react-intl';

import { defineMessages } from 'react-intl';

import Icon from '../Icon';
import Heading from '../Heading';
import { asField } from '../Fields';
import styles from './DecisionOption.css';

const MSG = defineMessages({
  iconTitle: {
    id: 'DecisionOption.iconTitle',
    defaultMessage: 'Choose this option',
  },
});

type Props = {
  option: {
    value: string,
    title: MessageDescriptor | string,
    subtitle: MessageDescriptor | string,
    icon?: string,
  },
  /** @ignore Will be injected by `asField` */
  setValue: (val: string) => void,
};

const displayName = 'DecisionOption';

class DecisionOption extends Component<Props> {
  makeDecision = () => {
    const {
      option: { value },
      setValue,
    } = this.props;
    setValue(value);
  };

  render() {
    const {
      option: { icon, subtitle, title },
    } = this.props;
    return (
      <button onClick={this.makeDecision} type="submit" className={styles.row}>
        {icon && (
          <div className={styles.rowIcon}>
            <Icon name={icon} title={title} />
          </div>
        )}
        <div className={styles.rowContent}>
          <Heading
            appearance={{ size: 'small', weight: 'bold', margin: 'small' }}
            text={title}
          />
          <Heading
            appearance={{ size: 'tiny', weight: 'thin', margin: 'small' }}
            text={subtitle}
          />
        </div>
        <Icon name="caret-right" title={MSG.iconTitle} />
      </button>
    );
  }
}

DecisionOption.displayName = displayName;

export default asField({ initialValue: '' })(DecisionOption);
