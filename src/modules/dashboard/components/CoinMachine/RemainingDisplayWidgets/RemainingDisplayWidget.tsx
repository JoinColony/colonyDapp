import React, { ReactElement } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import classnames from 'classnames';

import Heading from '~core/Heading';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';

import { getMainClasses } from '~utils/css';

import TokenPriceStatusIcon, {
  TokenPriceStatuses,
} from '../TokenPriceStatusIcon';

import styles from './RemainingDisplayWidget.css';

export enum DataDisplayType {
  Time = 'Time',
  Tokens = ' Tokens',
}

type Appearance = {
  theme?: 'white' | 'danger';
};

type Props = {
  appearance?: Appearance;
  widgetText: {
    title: MessageDescriptor;
    placeholder: MessageDescriptor;
    tooltipText: MessageDescriptor;
    footerText?: MessageDescriptor;
  };
  isWarning: boolean;
  displayedValue: string | ReactElement;
  priceStatus?: TokenPriceStatuses;
};

const displayName = 'dashboard.CoinMachine.RemainingDisplayWidget';

const RemainingDisplayWidget = ({
  widgetText,
  appearance = { theme: 'white' },
  isWarning,
  displayedValue,
  priceStatus,
}: Props) => {
  return (
    <div className={getMainClasses(appearance, styles)}>
      <div className={styles.header}>
        <Heading
          text={widgetText.title}
          appearance={{
            size: 'small',
            theme: appearance.theme === 'danger' ? 'invert' : 'dark',
          }}
        />
        <QuestionMarkTooltip
          className={styles.tooltipIcon}
          tooltipText={widgetText.tooltipText}
          invertedIcon={appearance.theme === 'danger'}
          tooltipClassName={styles.tooltip}
        />
      </div>
      <p
        className={classnames(styles.value, {
          [styles.valueWarning]: isWarning,
        })}
      >
        {displayedValue}
      </p>
      {widgetText.footerText && (
        <div className={styles.footer}>
          <p className={styles.footerText}>
            <FormattedMessage {...widgetText.footerText} />
          </p>
          {priceStatus && <TokenPriceStatusIcon status={priceStatus} />}
        </div>
      )}
    </div>
  );
};

RemainingDisplayWidget.displayName = displayName;

export default RemainingDisplayWidget;
