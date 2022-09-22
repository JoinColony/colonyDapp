/* eslint-disable no-console */
import React from 'react';
import { useParams } from 'react-router';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Button from '~core/Button';
import { FormSection } from '~core/Fields';
import { Tooltip } from '~core/Popover';
import Icon from '~core/Icon';
import { useDialog } from '~core/Dialog';
import { useColonyFromNameQuery } from '~data/generated';
import CancelStreamingDialog from '~dashboard/Dialogs/CancelStreamingDialog';
import { ValuesType } from '~pages/ExpenditurePage/types';

import styles from './StreamingStages.css';

const MSG = defineMessages({
  draft: {
    id: 'dashboard.ExpenditurePage.Stages.StreamingStages.draft',
    defaultMessage: 'Draft {text}',
  },
  notSaved: {
    id: 'dashboard.ExpenditurePage.Stages.StreamingStages.notSaved',
    defaultMessage: 'Not saved',
  },
  startStream: {
    id: 'dashboard.ExpenditurePage.Stages.StreamingStages.startStream',
    defaultMessage: 'Start Stream',
  },
  paidToDate: {
    id: 'dashboard.ExpenditurePage.Stages.StreamingStages.paidToDate',
    defaultMessage: 'Paid to date',
  },
  notStarted: {
    id: 'dashboard.ExpenditurePage.Stages.StreamingStages.notStarted',
    defaultMessage: 'Not started',
  },
  openModal: {
    id: 'dashboard.ExpenditurePage.Stages.StreamingStages.openModal',
    defaultMessage: 'Open modal',
  },
  tooltipOpenModalText: {
    id: 'dashboard.ExpenditurePage.Stages.StreamingStages.tooltipOpenModalText',
    defaultMessage: 'Cancel streaming payment',
  },
});

const displayName = 'dashboard.ExpenditurePage.Stages.StreamingStages';

export const buttonStyles = {
  height: styles.buttonHeight,
  width: styles.buttonWidth,
  padding: 0,
};

export interface Props {
  handleSaveDraft?: () => void;
  formValues: ValuesType;
}

const StreamingStages = ({ formValues, handleSaveDraft }: Props) => {
  const { colonyName } = useParams<{
    colonyName: string;
  }>();
  const { data: colonyData } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });

  const openCancelStreamingDialog = useDialog(CancelStreamingDialog);

  const handleCancelStreaming = () =>
    openCancelStreamingDialog({
      onCancelStreaming: () => console.log('cancel expenditure'),
      colony: colonyData.processedColony,
      isVotingExtensionEnabled: true, // temporary value
      formValues,
    });

  return (
    <div className={styles.stagesWrapper}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={classNames(styles.stagesRow, styles.paddingTopZero)}>
          <span className={classNames(styles.label, styles.dark)}>
            <FormattedMessage
              {...MSG.draft}
              values={{
                text: (
                  <span className={styles.notSaved}>
                    <FormattedMessage {...MSG.notSaved} />
                  </span>
                ),
              }}
            />
          </span>
          <Button className={styles.iconButton} onClick={handleCancelStreaming}>
            <Tooltip
              placement="top-start"
              content={<FormattedMessage {...MSG.tooltipOpenModalText} />}
              popperOptions={{
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 14],
                    },
                  },
                ],
              }}
            >
              <div className={styles.iconWrapper}>
                <Icon
                  name="circle-minus"
                  title={MSG.openModal}
                  appearance={{ size: 'normal' }}
                  style={{ fill: styles.iconColor }}
                />
              </div>
            </Tooltip>
          </Button>
          <Button
            text={MSG.startStream}
            onClick={handleSaveDraft}
            style={buttonStyles}
          />
        </div>
      </FormSection>
      <div className={styles.stagesRow}>
        <span className={styles.label}>
          <FormattedMessage {...MSG.paidToDate} />
        </span>
        <span className={styles.value}>
          <FormattedMessage {...MSG.notStarted} />
        </span>
      </div>
    </div>
  );
};

StreamingStages.displayName = displayName;

export default StreamingStages;
