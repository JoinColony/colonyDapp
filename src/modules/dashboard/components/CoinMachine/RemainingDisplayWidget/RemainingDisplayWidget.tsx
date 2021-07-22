import React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import classnames from 'classnames';

import Heading from '~core/Heading';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import { getMainClasses } from '~utils/css';

import TokenPriceStatusIcon, {
  TokenPriceStatuses,
} from '../TokenPriceStatusIcon/TokenPriceStatusIcon';

import styles from './RemainingDisplayWidget.css';

type Appearance = {
  theme?: 'white' | 'danger';
};

type Props = {
  title: string | MessageDescriptor;
  value: string | number | null;
  tooltipText: string | MessageDescriptor;
  placeholderText: string | MessageDescriptor;
  footerText?: string | MessageDescriptor;
  appearance?: Appearance;
  tokenPriceStatus?: TokenPriceStatuses;
};

const displayName = 'dashboard.RemainingDisplayWidget';

const RemainingDisplayWidget = ({
  appearance = { theme: 'white' },
  title,
  value,
  tooltipText,
  tokenPriceStatus,
  placeholderText,
  footerText,
}: Props) => {
  const placeholder =
    typeof placeholderText === 'string' ? (
      placeholderText
    ) : (
      <FormattedMessage {...placeholderText} />
    );
  return (
    <div className={getMainClasses(appearance, styles)}>
      <div className={styles.header}>
        <Heading
          text={title}
          appearance={{
            size: 'small',
            theme: appearance.theme === 'danger' ? 'invert' : 'dark',
          }}
        />
        <QuestionMarkTooltip
          tooltipText={tooltipText}
          invertedIcon={appearance.theme === 'danger'}
          tooltipClassName={styles.tooltip}
        />
      </div>
      <p
        className={classnames(styles.value, {
          [styles.valueWarning]: false, // @TODO:  Add logic to determine if we show the value on red
        })}
      >
        {value || placeholder}
      </p>
      {footerText && value && (
        <div className={styles.footer}>
          <p className={styles.footerText}>
            {typeof footerText === 'string' ? (
              footerText
            ) : (
              <FormattedMessage {...footerText} />
            )}
          </p>
          {tokenPriceStatus && (
            <TokenPriceStatusIcon status={tokenPriceStatus} />
          )}
        </div>
      )}
    </div>
  );
};

RemainingDisplayWidget.displayName = displayName;

export default RemainingDisplayWidget;
