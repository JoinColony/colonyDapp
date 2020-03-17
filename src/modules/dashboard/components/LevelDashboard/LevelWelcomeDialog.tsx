import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Tag from '~core/Tag';
import Button from '~core/Button';
import Dialog, { DialogSection, DialogProps } from '~core/Dialog';
import Badge from '~core/Badge';
import OverviewList, { OverviewListItem } from '~core/OverviewList';
import Heading from '~core/Heading';
import { OneLevel } from '~data/index';
import { Address } from '~types/index';

const MSG = defineMessages({
  title: {
    id: 'dashboard.LevelDashboard.LevelWelcomeDialog.title',
    defaultMessage: 'Welcome to {programTitle}',
  },
  welcomeText: {
    id: 'dashboard.LevelDashboard.LevelWelcomeDialog.welcomeText',
    defaultMessage: `Congratulations, you’ve joined {programTitle}! The first
      level is {levelTitle}. To complete this level, you need to finish
      {numRequiredSteps} out of {numTotalSteps} tasks. Once you do, you will
      earn an achievement{nextLevelTitle, select,
        undefined {}
        other { and will gain access to the next level, {nextLevelTitle}}
      }.`,
  },
  overviewBadgeTitle: {
    id: 'dashboard.LevelDashboard.LevelWelcomeDialog.overviewBadgeTitle',
    defaultMessage: 'Achievement',
  },
  overviewRewardTitle: {
    id: 'dashboard.LevelDashboard.LevelWelcomeDialog.overviewRewardTitle',
    defaultMessage: 'Payout',
  },
  overviewRewardDescription: {
    id: 'dashboard.LevelDashboard.LevelWelcomeDialog.overviewRewardDescription',
    defaultMessage: 'Total tokens available',
  },
  overviewRequirementTitle: {
    id: 'dashboard.LevelDashboard.LevelWelcomeDialog.overviewRequirementTitle',
    defaultMessage: 'Requirement',
  },
  overviewRequirementDescription: {
    id: `dashboard.LevelDashboard.LevelWelcomeDialog.overviewRequirementDescription`,
    defaultMessage: 'Number of tasks to complete',
  },
  overviewRequirementText: {
    id: 'dashboard.LevelDashboard.LevelWelcomeDialog.overviewRequirementText',
    defaultMessage: '{numRequiredSteps} out of {numTotalSteps}',
  },
});

interface Props extends DialogProps {
  level: OneLevel;
  nextLevel?: OneLevel;
  programTitle: string;
  levelTotalPayouts: { address: Address; amount: string; symbol: string }[];
}

const LevelWelcomeDialog = ({
  cancel,
  close,
  level,
  nextLevel,
  programTitle,
  levelTotalPayouts,
}: Props) => {
  const { achievement, title: levelTitle, numRequiredSteps, stepIds } = level;
  const nextLevelTitle = nextLevel ? nextLevel.title : undefined;
  const numTotalSteps = stepIds.length;
  const requirementValues = {
    numRequiredSteps: numRequiredSteps || '0',
    numTotalSteps,
  };
  return (
    <Dialog cancel={cancel}>
      <DialogSection>
        <Heading
          appearance={{ margin: 'none', size: 'medium' }}
          text={MSG.title}
          textValues={{ programTitle }}
        />
      </DialogSection>
      <DialogSection appearance={{ border: 'top' }}>
        <FormattedMessage
          {...MSG.welcomeText}
          values={{
            levelTitle,
            programTitle,
            nextLevelTitle,
            ...requirementValues,
          }}
        />
      </DialogSection>
      <DialogSection>
        <OverviewList>
          {achievement && levelTitle && (
            <OverviewListItem
              title={MSG.overviewBadgeTitle}
              description={levelTitle}
            >
              <Badge size="s" title={levelTitle} name={achievement} />
            </OverviewListItem>
          )}
          <OverviewListItem
            title={MSG.overviewRewardTitle}
            description={MSG.overviewRewardDescription}
          >
            {levelTotalPayouts.map(({ amount, address, symbol }) => (
              <Tag
                appearance={{ theme: 'golden' }}
                key={address}
                text={`${amount} ${symbol}`}
                title={address}
              />
            ))}
          </OverviewListItem>
          <OverviewListItem
            title={MSG.overviewRequirementTitle}
            description={MSG.overviewRequirementDescription}
          >
            <FormattedMessage
              {...MSG.overviewRequirementText}
              values={requirementValues}
            />
          </OverviewListItem>
        </OverviewList>
      </DialogSection>
      <DialogSection appearance={{ align: 'center' }}>
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={{ id: 'button.ok' }}
          onClick={close}
        />
      </DialogSection>
    </Dialog>
  );
};

export default LevelWelcomeDialog;
