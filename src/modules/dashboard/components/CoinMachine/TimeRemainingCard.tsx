import React from 'react';
import { defineMessages } from 'react-intl';

import Card from '~core/Card';
import Heading from '~core/Heading';
import { getMainClasses } from '~utils/css';

import styles from './CoinMachineCard.css';
import Countdown from '~core/Countdown';

interface Props {
  /* Total runtime of the sale */
  totalTime: number;
  /* Time remaining in ms */
  msRemaining: number;
}

const displayName = 'dashboard.CoinMachine.TimeRemainingCard';

const MSG = defineMessages({
  help: {
    id: 'dashboard.CoinMachine.TimeRemainingCard.help',
    defaultMessage: `This is the amount of time remaining in the sale. Whatever the time says, that’s how much time remains. When it reaches zero, there will be no more time remaining. That’s how time works. When no more time remains, the next sale will start, and the amount of time remaining for that sale will appear in this box.`,
  },
  title: {
    id: 'dashboard.CoinMachine.TimeRemainingCard.title',
    defaultMessage:
      '{saleOver, select, false {Time Remaining} true {Come back in...}}',
  },
});

const TimeRemainingCard = ({ totalTime = 0, msRemaining = 0 }: Props) => {
  const hurryUp = msRemaining / totalTime <= 1 / 8;
  const saleOver = msRemaining <= 0;
  const appearance = {
    theme: saleOver ? 'red' : undefined,
  };
  return (
    <Card
      className={getMainClasses(appearance, styles, { hurryUp })}
      help={MSG.help}
    >
      <div className={styles.heading}>
        <Heading
          appearance={{
            margin: 'none',
            size: 'normal',
            theme: saleOver ? 'invert' : 'dark',
          }}
          text={MSG.title}
          textValues={{ saleOver }}
        />
      </div>
      <div className={styles.content}>
        <Countdown msRemaining={msRemaining} />
      </div>
    </Card>
  );
};

TimeRemainingCard.displayName = displayName;

export default TimeRemainingCard;
