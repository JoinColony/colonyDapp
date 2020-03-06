import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Tag from '~core/Tag';
import Button from '~core/Button';
import Dialog, { DialogSection, DialogProps } from '~core/Dialog';
import Badge from '~core/Badge';
import OverviewList, { OverviewListItem } from '~core/OverviewList';
import Heading from '~core/Heading';
import { OneLevel } from '~data/index';

const MSG = defineMessages({
  title: {
    id: 'dashboard.LevelDashboard.LevelWelcomeDialog.title',
    defaultMessage: 'Welcome to the {levelTitle} level',
  },
  welcomeText: {
    id: 'dashboard.LevelDashboard.LevelWelcomeDialog.welcomeText',
    defaultMessage: `Congratulations, you’ve joined the {programTitle} Program! This is the {levelTitle} level where you need to complete {numRequiredSteps} out of {numTotalSteps} tasks to complete. Once you do this you will recieve the {levelTitle} badge.`,
  },
  overviewBadgeTitle: {
    id: 'dashboard.LevelDashboard.LevelWelcomeDialog.overviewBadgeTitle',
    defaultMessage: 'Badge',
  },
  overviewBadgeDescription: {
    id: 'dashboard.LevelDashboard.LevelWelcomeDialog.overviewBadgeDescription',
    defaultMessage: '{levelTitle} level',
  },
  overviewRewardTitle: {
    id: 'dashboard.LevelDashboard.LevelWelcomeDialog.overviewRewardTitle',
    defaultMessage: 'Rewards',
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
    defaultMessage: 'Complete {numRequiredSteps} out of {numTotalSteps}',
  },
  overviewRequirementText: {
    id: 'dashboard.LevelDashboard.LevelWelcomeDialog.overviewRequirementText',
    defaultMessage: '{numRequiredSteps} out of {numTotalSteps}',
  },
});

interface Props extends DialogProps {
  level: OneLevel;
  programTitle: string;
  levelTotalPayouts: { amount: string; symbol: string }[];
}

const LevelWelcomeDialog = ({
  cancel,
  close,
  level,
  programTitle,
  levelTotalPayouts,
}: Props) => {
  const { achievement, title: levelTitle, numRequiredSteps, stepIds } = level;
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
          textValues={{ levelTitle }}
        />
      </DialogSection>
      <DialogSection appearance={{ border: 'top' }}>
        <FormattedMessage
          {...MSG.welcomeText}
          values={{
            levelTitle,
            programTitle,
            ...requirementValues,
          }}
        />
      </DialogSection>
      <DialogSection>
        <OverviewList>
          {achievement && (
            <OverviewListItem
              title={MSG.overviewBadgeTitle}
              description={MSG.overviewBadgeDescription}
              descriptionValues={{ levelTitle }}
            >
              <Badge size="s" title={levelTitle || ''} name={achievement} />
            </OverviewListItem>
          )}
          <OverviewListItem
            title={MSG.overviewRewardTitle}
            description={MSG.overviewRewardDescription}
          >
            {levelTotalPayouts.map(({ amount, symbol }) => (
              <Tag
                // Theoretically it's still possible to create two entries with the same key but we really don't care about that right now
                key={`${amount}-${symbol}`}
                appearance={{ theme: 'golden' }}
                // Use symbol, since sums will be aggregated by token
                key={symbol}
                text={`${amount} ${symbol}`}
              />
            ))}
          </OverviewListItem>
          <OverviewListItem
            title={MSG.overviewRequirementTitle}
            description={MSG.overviewRequirementDescription}
            descriptionValues={requirementValues}
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
