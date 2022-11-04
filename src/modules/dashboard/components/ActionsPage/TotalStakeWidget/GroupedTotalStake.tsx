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

import { getFormattedTokenValue } from '~utils/tokens';

import styles from './TotalStakeWidget.css';

enum StakeSide {
  Motion = 'MOTION',
  Objection = 'OBJECTION',
}

type Props = {
  requiredStake: string | number;
  isUserLoggedIn: boolean;
  formattedYAYPercentage: string;
  formattedNAYPercentage: string;
  handleSideSelect: Dispatch<SetStateAction<boolean>>;
  tokenDecimals?: number;
  tokenSymbol?: string;
  handleWidgetState: (isObjection: boolean) => void;
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
    defaultMessage: `The total staked amount and weight for each side of the Motion.`,
  },
  nextButton: {
    id: `dashboard.ActionsPage.TotalStakeWidget.GroupedTotalStake.nextButton`,
    defaultMessage: 'Next',
  },
});

const GroupedTotalStake = ({
  requiredStake,
  formattedYAYPercentage,
  formattedNAYPercentage,
  tokenDecimals,
  tokenSymbol,
  isUserLoggedIn,
  handleSideSelect,
  handleWidgetState,
}: Props) => {
  const isYAYSideFullyStaked = formattedYAYPercentage === '100';
  const isNAYSideFullyStaked = formattedNAYPercentage === '100';
  const handleSubmit = ({ stakeSide }) => {
    handleSideSelect(stakeSide === StakeSide.Objection);
    handleWidgetState(false);
  };
  const validationSchema = yup.object().shape({
    stakeSide: yup.string().required(),
  });
  const formattedRequiredStake = getFormattedTokenValue(
    requiredStake,
    tokenDecimals,
  );

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
              tooltipPopperOptions={{
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
                totalPercentage: formattedYAYPercentage,
                requiredStake: (
                  <Numeral
                    value={formattedRequiredStake}
                    suffix={tokenSymbol}
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
                totalPercentage: formattedNAYPercentage,
                requiredStake: (
                  <Numeral
                    value={formattedRequiredStake}
                    suffix={tokenSymbol}
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
              disabled={isNAYSideFullyStaked || !isUserLoggedIn}
            />
          </div>
          <div className={styles.submitButtonContainer}>
            <Button
              type="submit"
              appearance={{ theme: 'primary', size: 'medium' }}
              text={MSG.nextButton}
              disabled={!isValid || !isUserLoggedIn || !values.stakeSide}
            />
          </div>
        </>
      )}
    </Form>
  );
};

export default GroupedTotalStake;
