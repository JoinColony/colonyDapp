import React, { ReactElement } from 'react';
import { MessageDescriptor } from 'react-intl';
import classnames from 'classnames';
import { Textfit } from 'react-textfit';

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
  isTokens?: boolean;
};

const displayName = 'dashboard.CoinMachine.RemainingDisplayWidget';

const RemainingDisplayWidget = ({
  widgetText,
  appearance = { theme: 'white' },
  isWarning,
  displayedValue,
  isTotalSale,
  isTokens = false,
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
        {/* This is to avoid unnecessary calculaitons from Textfit for the timer */}
        {isTokens ? (
          <Textfit min={10} max={18} perfectFit={false} mode="single">
            {displayedValue}
          </Textfit>
        ) : (
          displayedValue
        )}
      </div>
    </div>
  );
};

RemainingDisplayWidget.displayName = displayName;

export default RemainingDisplayWidget;
