import React, { useEffect, useMemo } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useDispatch } from 'redux-react-hook';

import TimerValue from '~core/TimerValue';
import { SpinnerLoader } from '~core/Preloaders';

import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';
import useSplitTime from '~utils/hooks/useSplitTime';

import RemainingDisplayWidget from './RemainingDisplayWidget';

type Appearance = {
  theme?: 'white' | 'danger';
};

type Props = {
  colonyAddress: Address;
  value: number | null;
  appearance?: Appearance;
  periodLength: number;
  syncing?: boolean;
};

const displayName =
  'dashboard.CoinMachine.RemainingDisplayWidgets.RemainingTime';

const MSG = defineMessages({
  timeRemainingTitle: {
    id: 'dashboard.CoinMachine.RemainingDisplayWidgets.ReimainingTime.title',
    defaultMessage: 'Time remaining this batch',
  },
  timeRemainingTooltip: {
    id: 'dashboard.CoinMachine.RemainingDisplayWidgets.ReimainingTime.tooltip',
    defaultMessage: `This is the time remaining in the batch, not in the sale as a whole`,
  },
  timeTypePlaceholder: {
    id: `dashboard.CoinMachine.RemainingDisplayWidgets.ReimainingTime.placeholder`,
    defaultMessage: `N/A`,
  },
  comeBackTitle: {
    id: `dashboard.CoinMachine.RemainingDisplayWidgets.ReimainingTime.comeBackTitle`,
    defaultMessage: 'Come back in...',
  },
});

const RemainingTime = ({
  appearance = { theme: 'white' },
  value,
  periodLength,
  colonyAddress,
  syncing = false,
}: Props) => {
  const dispatch = useDispatch();

  const { splitTime, timeLeft } = useSplitTime(
    typeof value === 'number' ? value / 1000 : -1,
    true,
    periodLength / 1000,
  );

  const widgetText = useMemo(() => {
    return {
      title:
        appearance.theme === 'danger'
          ? MSG.comeBackTitle
          : MSG.timeRemainingTitle,
      placeholder: MSG.timeTypePlaceholder,
      tooltipText: MSG.timeRemainingTooltip,
    };
  }, [appearance]);

  const displayedValue = useMemo(() => {
    if (splitTime) {
      return (
        <div>
          {syncing && <SpinnerLoader appearance={{ size: 'small' }} />}
          <TimerValue splitTime={splitTime} />
        </div>
      );
    }

    return <FormattedMessage {...widgetText.placeholder} />;
  }, [splitTime, syncing, widgetText]);

  const showValueWarning =
    appearance.theme !== 'danger' &&
    typeof value === 'number' &&
    periodLength !== undefined &&
    (timeLeft * 1000 * 100) / periodLength <= 10;

  useEffect(() => {
    if (timeLeft <= 0 && colonyAddress !== undefined) {
      dispatch({
        type: ActionTypes.COIN_MACHINE_PERIOD_UPDATE,
        payload: { colonyAddress },
      });
    }
  }, [timeLeft, colonyAddress, dispatch]);

  return (
    <RemainingDisplayWidget
      widgetText={widgetText}
      appearance={appearance}
      isWarning={showValueWarning}
      displayedValue={displayedValue}
    />
  );
};

RemainingTime.displayName = displayName;

export default RemainingTime;
