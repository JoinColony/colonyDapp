import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import copyToClipboard from 'copy-to-clipboard';
import classNames from 'classnames';

import { ColonyRole } from '@colony/colony-js';
import Button from '~core/Button';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import PermissionsLabel from '~core/PermissionsLabel';
import { Motion, State } from '~pages/ExpenditurePage/ExpenditurePage';

import { MotionStatus, Stage, Status } from './constants';
import StageItem from './StageItem/StageItem';
import styles from './Stages.css';

const MSG = defineMessages({
  stages: {
    id: 'dashboard.ExpenditurePage.Stages.stages',
    defaultMessage: 'Stages',
  },
  notSaved: {
    id: 'dashboard.ExpenditurePage.Stages.notSaved',
    defaultMessage: 'Not saved',
  },
  submitDraft: {
    id: 'dashboard.ExpenditurePage.Stages.submitDraft',
    defaultMessage: 'Submit draft',
  },
  deleteDraft: {
    id: 'dashboard.ExpenditurePage.Stages.deleteDraft',
    defaultMessage: 'Delete draft',
  },
  tooltipDeleteText: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipDeleteText',
    defaultMessage: 'Delete the expenditure',
  },
  tooltipShareText: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipShareText',
    defaultMessage: 'Share expenditure URL',
  },
  tooltipCancelText: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipCancelText',
    defaultMessage: 'Click to cancel expenditure',
  },
  tooltipNoPermissionToRealese: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipNoPermissionToRealese',
    defaultMessage: 'You need to create a Motion to release funds.',
  },
  tooltipLockValuesText: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipLockValuesText',
    defaultMessage: `This will lock the values of the expenditure. To change values after locking will require the right permissions or a motion.`,
  },
  tooltipForcedUpdate: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipForcedUpdate',
    defaultMessage: 'Value updated by arbitrator',
  },
  updatedByArbitrator: {
    id: 'dashboard.ExpenditurePage.Stages.updatedByArbitrator',
    defaultMessage: 'Value updated by arbitrator',
  },
});

const displayName = 'dashboard.ExpenditurePage.Stages';

export const buttonStyles = {
  height: styles.buttonHeight,
  width: styles.buttonWidth,
  padding: 0,
};

export interface Props {
  states: State[];
  activeStateId?: string;
  handleDeleteDraft?: () => void;
  handleSaveDraft?: () => void;
  handleButtonClick: () => void;
  status?: Status;
  motion?: Motion;
  disabledButton?: boolean;
}

const Stages = ({
  states,
  activeStateId,
  handleDeleteDraft,
  handleSaveDraft,
  handleButtonClick,
  status,
  motion,
  disabledButton,
}: Props) => {
  const [valueIsCopied, setValueIsCopied] = useState(false);
  const userFeedbackTimer = useRef<any>(null);

  const handleClipboardCopy = () => {
    copyToClipboard(window.location.href);
    setValueIsCopied(true);
    userFeedbackTimer.current = setTimeout(() => setValueIsCopied(false), 2000);
  };
  useEffect(() => () => clearTimeout(userFeedbackTimer.current), [
    userFeedbackTimer,
  ]);

  const activeIndex = states.findIndex((state) => state.id === activeStateId);
  const activeState = states.find((state) => state.id === activeStateId);

  const labelComponent = useMemo(
    () => ({
      label,
      index,
    }: {
      label: string | MessageDescriptor;
      index: number;
    }) => {
      // role is temporary mock value
      const role = ColonyRole.Arbitration;

      if (status === Status.ForceEdited && index === activeIndex) {
        return (
          <div className={styles.labelComponent}>
            {typeof label === 'object' && label?.id ? (
              <FormattedMessage {...label} />
            ) : (
              label
            )}{' '}
            <PermissionsLabel
              permission={role}
              appearance={{ theme: 'white' }}
              infoMessage={MSG.updatedByArbitrator}
              minimal
            />
          </div>
        );
      }

      return undefined;
    },
    [activeIndex, status],
  );

  return (
    <div
      className={classNames(styles.mainContainer, {
        [styles.paddingSmall]: motion?.status === MotionStatus.Pending,
      })}
    >
      <div className={styles.statusContainer}>
        <div className={styles.stagesText}>
          <span className={styles.status}>
            <FormattedMessage {...MSG.stages} />
          </span>
          {!activeStateId && (
            <span className={styles.notSaved}>
              <FormattedMessage {...MSG.notSaved} />
            </span>
          )}
        </div>
        <div className={styles.buttonsContainer}>
          {!activeStateId ? (
            <>
              <Button className={styles.iconButton} onClick={handleDeleteDraft}>
                <Tooltip
                  placement="top-start"
                  content={<FormattedMessage {...MSG.tooltipDeleteText} />}
                >
                  <div className={styles.iconWrapper}>
                    <Icon
                      name="trash"
                      className={styles.icon}
                      title={MSG.deleteDraft}
                    />
                  </div>
                </Tooltip>
              </Button>
              <Button onClick={handleSaveDraft} style={buttonStyles}>
                <FormattedMessage {...MSG.submitDraft} />
              </Button>
            </>
          ) : (
            <>
              <Button
                className={classNames(styles.iconButton, {
                  [styles.iconButtonDisabled]: valueIsCopied,
                })}
                onClick={handleClipboardCopy}
                disabled={valueIsCopied}
              >
                {valueIsCopied ? (
                  <Icon name="share" className={styles.icon} />
                ) : (
                  <Tooltip
                    placement="top-start"
                    content={<FormattedMessage {...MSG.tooltipShareText} />}
                  >
                    <div className={styles.iconWrapper}>
                      <Icon name="share" className={styles.icon} />
                    </div>
                  </Tooltip>
                )}
              </Button>
              {activeStateId === Stage.Draft && (
                <Button
                  className={styles.iconButton}
                  onClick={handleDeleteDraft}
                >
                  <Tooltip
                    placement="top-start"
                    content={<FormattedMessage {...MSG.tooltipDeleteText} />}
                  >
                    <div className={styles.iconWrapper}>
                      <Icon
                        name="trash"
                        className={styles.icon}
                        onClick={handleDeleteDraft}
                        title={MSG.deleteDraft}
                      />
                    </div>
                  </Tooltip>
                </Button>
              )}
              {activeStateId !== Stage.Draft && (
                <Button
                  className={classNames(styles.iconButton, styles.cancelIcon)}
                  onClick={handleDeleteDraft}
                >
                  <Tooltip
                    placement="top-start"
                    content={<FormattedMessage {...MSG.tooltipCancelText} />}
                  >
                    <div className={styles.iconWrapper}>
                      <Icon
                        name="circle-minus"
                        className={styles.icon}
                        title={MSG.deleteDraft}
                      />
                    </div>
                  </Tooltip>
                </Button>
              )}
              {activeState?.buttonTooltip ? (
                <Tooltip
                  placement="top"
                  content={
                    typeof activeState.buttonTooltip === 'string' ? (
                      <div className={styles.buttonTooltip}>
                        {activeState.buttonTooltip}
                      </div>
                    ) : (
                      <div className={styles.buttonTooltip}>
                        <FormattedMessage {...activeState.buttonTooltip} />
                      </div>
                    )
                  }
                >
                  <Button
                    onClick={handleButtonClick}
                    style={buttonStyles}
                    type="submit"
                  >
                    {typeof activeState?.buttonText === 'string' ? (
                      activeState.buttonText
                    ) : (
                      <FormattedMessage {...activeState?.buttonText} />
                    )}
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  onClick={handleButtonClick}
                  style={buttonStyles}
                  type="submit"
                  disabled={disabledButton}
                >
                  {typeof activeState?.buttonText === 'string' ? (
                    activeState.buttonText
                  ) : (
                    <FormattedMessage {...activeState?.buttonText} />
                  )}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      {states.map(({ id, label }, index) => (
        <div className={styles.stageWrapper} key={id}>
          <StageItem
            label={label}
            isFirst={index === 0}
            isActive={activeState ? index <= activeIndex : false}
            labelComponent={labelComponent({ label, index })}
          />
        </div>
      ))}
    </div>
  );
};

Stages.displayName = displayName;

export default Stages;
