import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import { CustomRadio } from '~core/Fields/Radio';
import Numeral from '~core/Numeral';
import { Form } from '~core/Fields';

import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './TotalStakeWidget.css';

type Props = {
  requiredStake: string | number;
  formattedTotalYAYStakedPercentage: string;
  formattedTotalNAYStakedPercentage: string;
  tokenDecimals?: number;
  tokenSymbol?: string;
};

const MSG = defineMessages({
  stakeProgress: {
    id:
      'dashboard.ActionsPage.TotalStakeWidget.GroupedTotalStake.stakeProgress',
    defaultMessage: '{totalPercentage}% of {requiredStake}',
  },
  crowdfundStakeTitle: {
    id: `dashboard.ActionsPage.TotalStakeWidget.GroupedTotalStake.crowdfundStakeTitle`,
    defaultMessage: 'Crowdfund stakes',
  },
  YAYName: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.GroupedTotalStake.YAYName',
    defaultMessage: 'Motion',
  },
  NAYName: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.GroupedTotalStake.NAYName',
    defaultMessage: 'Objection',
  },
  fullyStaked: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.GroupedTotalStake.fullyStaked',
    defaultMessage: 'Fully staked',
  },
});

const GroupedTotalStake = ({
  requiredStake,
  formattedTotalYAYStakedPercentage,
  formattedTotalNAYStakedPercentage,
  tokenDecimals,
  tokenSymbol,
}: Props) => {
  const isYAYSideFullyStaked = formattedTotalYAYStakedPercentage === '100';
  const isNAYSideFullyStaked = formattedTotalNAYStakedPercentage === '100';

  /*
   * @NOTE
   *
   * A Form component is added here just to make CustomRadio happy.
   *
   * This isn't really a Form, and those are not really Radio buttons.
   *
   * The CustomRadio are just there for the visuals.
   */
  // eslint-disable-next-line no-console
  const handleSubmit = () => console.log('Time to submit');

  return (
    <Form initialValues={{}} onSubmit={handleSubmit}>
      <div className={styles.widgetHeading}>
        <Heading
          appearance={{
            theme: 'dark',
            size: 'small',
            weight: 'bold',
            margin: 'none',
          }}
          text={MSG.crowdfundStakeTitle}
          className={styles.title}
        />
      </div>
      <div className={styles.totalStakeRadio}>
        <CustomRadio
          value=""
          name="stakeYAY"
          description={
            isYAYSideFullyStaked ? MSG.fullyStaked : MSG.stakeProgress
          }
          descriptionValues={{
            totalPercentage: formattedTotalYAYStakedPercentage,
            requiredStake: (
              <Numeral
                value={requiredStake}
                unit={getTokenDecimalsWithFallback(tokenDecimals)}
                suffix={` ${tokenSymbol}`}
                truncate={2}
              />
            ),
          }}
          label={MSG.YAYName}
          labelIcon={isYAYSideFullyStaked ? 'circle-check-primary' : null}
          appearance={{ theme: 'primary' }}
          checked
          disabled={isYAYSideFullyStaked}
        />
      </div>
      <div className={styles.totalStakeRadio}>
        <CustomRadio
          value=""
          name="stakeNAY"
          description={
            isNAYSideFullyStaked ? MSG.fullyStaked : MSG.stakeProgress
          }
          descriptionValues={{
            totalPercentage: formattedTotalNAYStakedPercentage,
            requiredStake: (
              <Numeral
                value={requiredStake}
                unit={getTokenDecimalsWithFallback(tokenDecimals)}
                suffix={` ${tokenSymbol}`}
                truncate={2}
              />
            ),
          }}
          label={MSG.NAYName}
          labelIcon={isNAYSideFullyStaked ? 'circle-check-primary' : null}
          appearance={{ theme: 'danger' }}
          checked
          disabled={isNAYSideFullyStaked}
        />
      </div>
    </Form>
  );
};

export default GroupedTotalStake;
