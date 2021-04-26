import React, { Dispatch, SetStateAction } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import Heading from '~core/Heading';
import { CustomRadio } from '~core/Fields/Radio';
import Numeral from '~core/Numeral';
import { Form } from '~core/Fields';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import Icon from '~core/Icon';
import Button from '~core/Button';

import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './TotalStakeWidget.css';
import { StakeSide } from './TotalStakeWidget';

type Props = {
  requiredStake: string | number;
  isUserLoggedIn: boolean;
  formattedTotalYAYStakedPercentage: string;
  formattedTotalNAYStakedPercentage: string;
  handleStakeSideSelect: Dispatch<SetStateAction<StakeSide | undefined>>;
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
    defaultMessage: 'Motion {fullyStakedEmoji}',
  },
  NAYName: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.GroupedTotalStake.NAYName',
    defaultMessage: 'Objection {fullyStakedEmoji}',
  },
  fullyStaked: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.GroupedTotalStake.fullyStaked',
    defaultMessage: 'Fully staked',
  },
  totalStakeTooltip: {
    id: `dashboard.ActionsPage.TotalStakeWidget.GroupedTotalStake.totalStakeTooltip`,
    defaultMessage: `[TO BE ADDED WHEN AVAILABLE]`,
  },
  nextButton: {
    id: `dashboard.ActionsPage.TotalStakeWidget.GroupedTotalStake.nextButton`,
    defaultMessage: 'Next',
  },
});

const GroupedTotalStake = ({
  requiredStake,
  formattedTotalYAYStakedPercentage,
  formattedTotalNAYStakedPercentage,
  tokenDecimals,
  tokenSymbol,
  isUserLoggedIn,
  handleStakeSideSelect,
}: Props) => {
  const isYAYSideFullyStaked = formattedTotalYAYStakedPercentage === '100';
  const isNAYSideFullyStaked = formattedTotalNAYStakedPercentage === '100';
  const handleSubmit = ({ stakeSide }) => handleStakeSideSelect(stakeSide);
  const validationSchema = yup.object().shape({
    stakeSide: yup.string().required(),
  });

  return (
    <Form
      initialValues={{ stakeSide: null }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isValid }) => (
        <>
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
            <QuestionMarkTooltip
              className={styles.help}
              tooltipClassName={styles.tooltip}
              tooltipText={MSG.totalStakeTooltip}
              tooltipPopperProps={{
                placement: 'right',
              }}
            />
          </div>
          <div className={styles.totalStakeRadio}>
            <CustomRadio
              value={StakeSide.Motion}
              name="stakeSide"
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
              labelValues={{
                fullyStakedEmoji: isYAYSideFullyStaked ? (
                  <Icon name="circle-check-primary" title={MSG.fullyStaked} />
                ) : null,
              }}
              appearance={{ theme: 'primary' }}
              checked={values.stakeSide === StakeSide.Motion}
              disabled={isYAYSideFullyStaked || !isUserLoggedIn}
            />
          </div>
          <div className={styles.totalStakeRadio}>
            <CustomRadio
              value={StakeSide.Objection}
              name="stakeSide"
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
              labelValues={{
                fullyStakedEmoji: isNAYSideFullyStaked ? (
                  <Icon name="circle-check-primary" title={MSG.fullyStaked} />
                ) : null,
              }}
              appearance={{ theme: 'danger' }}
              checked={values.stakeSide === StakeSide.Objection}
              disabled={!isNAYSideFullyStaked || !isUserLoggedIn}
            />
          </div>
          <Button
            type="submit"
            appearance={{ theme: 'primary', size: 'medium' }}
            text={MSG.nextButton}
            disabled={!isValid || !isUserLoggedIn}
          />
        </>
      )}
    </Form>
  );
};

export default GroupedTotalStake;
