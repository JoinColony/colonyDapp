import React, { Component } from 'react';
import {
  MessageDescriptor,
  defineMessages,
  FormattedMessage,
} from 'react-intl';

import { getMainClasses } from '~utils/css';
import Icon from '../Icon';
import Link from '../Link';
import { Tooltip } from '../Popover';
import Heading from '../Heading';
import { asField } from '../Fields';
import styles from './DecisionOption.css';

const MSG = defineMessages({
  iconTitle: {
    id: 'DecisionOption.iconTitle',
    defaultMessage: 'Choose this option',
  },
});

interface Appearance {
  theme?: 'alt';
}

interface Props {
  appearance?: Appearance;
  option: {
    value: string;
    title: MessageDescriptor | string;
    subtitle: MessageDescriptor | string;
    icon?: string;
    tooltip?: MessageDescriptor;
  };
  link?: string;

  /** @ignore Will be injected by `asField` */
  setValue: (val: string) => void;
}

const displayName = 'DecisionOption';

class DecisionOption extends Component<Props> {
  makeDecision = () => {
    const {
      option: { value },
      setValue,
    } = this.props;
    setValue(value);
  };

  renderIcon = (tooltip, icon, title) => {
    /* Wrap icon in tooltip wrapper only if tooltip propert exists */
    if (tooltip && icon) {
      return (
        <Tooltip
          placement="left"
          trigger="hover"
          content={
            <span className={styles.tooltip}>
              <FormattedMessage {...tooltip} />
            </span>
          }
        >
          <div className={styles.rowIcon}>
            <Icon name={icon} title={title} appearance={{ size: 'small' }} />
          </div>
        </Tooltip>
      );
    }
    if (icon) {
      return (
        <div className={styles.rowIcon}>
          <Icon name={icon} title={title} />
        </div>
      );
    }
    return null;
  };

  render() {
    const {
      appearance,
      option: { icon, subtitle, title, tooltip },
      link,
    } = this.props;
    const Element = link ? Link : 'button';
    const elmProps = link ? { to: link } : { onClick: this.makeDecision };

    return (
      <Element
        type="submit"
        className={getMainClasses(appearance, styles)}
        {...elmProps}
      >
        {this.renderIcon(tooltip, icon, title)}
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
      </Element>
    );
  }
}

// @ts-ignore
DecisionOption.displayName = displayName;

export default asField({ initialValue: '' })(DecisionOption);
