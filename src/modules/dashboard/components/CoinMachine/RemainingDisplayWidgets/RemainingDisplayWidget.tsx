import React, { ReactElement } from 'react';
import { MessageDescriptor } from 'react-intl';
import classnames from 'classnames';

import Heading from '~core/Heading';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';

import { getMainClasses } from '~utils/css';
import { ComplexMessageValues } from '~types/index';

import styles from './RemainingDisplayWidget.css';

type Appearance = {
  theme?: 'white' | 'danger';
};

interface WidgetText {
  title: MessageDescriptor;
  titleValues?: ComplexMessageValues;
  placeholder: MessageDescriptor;
  tooltipText: MessageDescriptor;
  footerText?: MessageDescriptor;
}

type Props = {
  appearance?: Appearance;
  widgetText: WidgetText;
  isWarning: boolean;
  displayedValue: string | ReactElement;
  isTotalSale?: boolean;
};

const displayName = 'dashboard.CoinMachine.RemainingDisplayWidget';

const RemainingDisplayWidget = ({
  widgetText,
  appearance = { theme: 'white' },
  isWarning,
  displayedValue,
  isTotalSale,
}: Props) => {
  return (
    <div className={getMainClasses(appearance, styles)}>
      <div className={styles.header}>
        <Heading
          text={widgetText.title}
          textValues={{ isTotalSale }}
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
          tooltipTextValues={{ isTotalSale }}
        />
      </div>
      <div
        className={classnames(styles.value, {
          [styles.valueWarning]: isWarning,
        })}
      >
        {displayedValue}
      </div>
    </div>
  );
};

RemainingDisplayWidget.displayName = displayName;

export default RemainingDisplayWidget;
