import React, { useEffect, useRef, useState } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import copyToClipboard from 'copy-to-clipboard';
import classNames from 'classnames';

import Button from '~core/Button';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import {
  ExpenditureTypes,
  StageObject,
  ValuesType,
} from '~pages/ExpenditurePage/types';
import { Colony } from '~data/index';
import { Stages as StagesEnum } from '~pages/IncorporationPage/constants';

import StageItem from './StageItem';
import { Motion, MotionStatus, Stage, Status } from './constants';
import Label from './StageItem/Label';
import StagesButton from './StagesButton';
import { ClaimFundsOther, ClaimFundsRecipients } from './ClaimFunds';
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
    defaultMessage: 'Delete the {viewFor}',
  },
  tooltipShareText: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipShareText',
    defaultMessage: 'Share {viewFor} URL',
  },
  tooltipCancelText: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipCancelText',
    defaultMessage: 'Click to cancel {viewFor}',
  },
  tooltipForcedUpdate: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipForcedUpdate',
    defaultMessage: 'Value updated by arbitrator',
  },
  motion: {
    id: 'dashboard.ExpenditurePage.Stages.motion',
    defaultMessage: `You can't {action} unless motion ends`,
  },
});

const displayName = 'dashboard.ExpenditurePage.Stages';

export const buttonStyles = {
  height: styles.buttonHeight,
  width: styles.buttonWidth,
  padding: 0,
};

export interface Appearance {
  size?: 'small' | 'medium';
}

export interface StageType
  extends Omit<StageObject, 'buttonText' | 'buttonAction'> {
  buttonText?: MessageDescriptor | string;
  buttonAction?: VoidFunction;
  description?: MessageDescriptor;
}

export interface Props {
  stages: StageType[];
  activeStageId?: string | StagesEnum;
  handleDeleteDraft?: () => void;
  handleSaveDraft?: () => void;
  handleButtonClick: () => void;
  status?: Status;
  motion?: Motion;
  handleCancel?: () => void;
  colony: Colony;
  buttonDisabled?: boolean;
  formValues?: ValuesType;
  activeLine?: boolean;
  appearance?: Appearance;
  viewFor?: 'incorporation' | 'expenditure';
}

const Stages = ({
  stages,
  activeStageId,
  handleDeleteDraft,
  handleSaveDraft,
  handleButtonClick,
  status,
  motion,
  handleCancel,
  colony,
  buttonDisabled,
  formValues,
  activeLine,
  appearance,
  viewFor = 'expenditure',
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

  const activeIndex = stages.findIndex((stage) => stage.id === activeStageId);
  const activeStage = stages.find((stage) => stage.id === activeStageId);
  const isLogedIn = true;

  const isCancelled =
    status === Status.Cancelled || status === Status.ForceCancelled;

  const claimFundsVisible =
    isLogedIn &&
    activeStageId === Stage.Released &&
    status !== Status.Cancelled;

  return (
    <div className={styles.mainContainer}>
      {claimFundsVisible && formValues && (
        <>
          {formValues.expenditure === ExpenditureTypes.Advanced ? (
            <ClaimFundsRecipients
              recipients={formValues.recipients}
              colony={colony}
              buttonAction={activeStage?.buttonAction}
              buttonText={activeStage?.buttonText}
              isDisabled={motion?.status === MotionStatus.Pending}
            />
          ) : (
            <ClaimFundsOther
              formValues={formValues}
              colony={colony}
              buttonAction={activeStage?.buttonAction}
              buttonText={activeStage?.buttonText}
              isDisabled={motion?.status === MotionStatus.Pending}
            />
          )}
        </>
      )}
      <div
        className={classNames(styles.statusContainer, {
          [styles.withTag]: motion?.status === MotionStatus.Pending,
        })}
      >
        <div className={styles.stagesText}>
          <span className={styles.status}>
            <FormattedMessage {...MSG.stages} />
          </span>
          {!activeStageId && (
            <span className={styles.notSaved}>
              <FormattedMessage {...MSG.notSaved} />
            </span>
          )}
        </div>
        <div className={styles.buttonsContainer}>
          {!activeStageId ? (
            <>
              <Button className={styles.iconButton} onClick={handleDeleteDraft}>
                <Tooltip
                  placement="top-start"
                  content={
                    <FormattedMessage
                      {...MSG.tooltipDeleteText}
                      values={{ viewFor }}
                    />
                  }
                  popperOptions={{
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, 12],
                        },
                      },
                    ],
                  }}
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
              <Button
                onClick={handleSaveDraft}
                style={buttonStyles}
                disabled={buttonDisabled}
              >
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
                    content={
                      <FormattedMessage
                        {...MSG.tooltipShareText}
                        values={{ viewFor }}
                      />
                    }
                    popperOptions={{
                      modifiers: [
                        {
                          name: 'offset',
                          options: {
                            offset: [0, 12],
                          },
                        },
                      ],
                    }}
                  >
                    <div className={styles.iconWrapper}>
                      <Icon name="share" className={styles.icon} />
                    </div>
                  </Tooltip>
                )}
              </Button>
              {!isCancelled && activeStageId === Stage.Draft && (
                <Button
                  className={styles.iconButton}
                  onClick={handleDeleteDraft}
                >
                  <Tooltip
                    placement="top-start"
                    content={
                      <FormattedMessage
                        {...MSG.tooltipDeleteText}
                        values={{ viewFor }}
                      />
                    }
                    popperOptions={{
                      modifiers: [
                        {
                          name: 'offset',
                          options: {
                            offset: [0, 12],
                          },
                        },
                      ],
                    }}
                  >
                    <div className={styles.iconWrapper}>
                      <Icon
                        name="trash"
                        title={MSG.deleteDraft}
                        appearance={{ size: 'normal' }}
                        style={{ fill: styles.iconColor }}
                      />
                    </div>
                  </Tooltip>
                </Button>
              )}
              {!isCancelled &&
                activeStageId !== Stage.Draft &&
                activeStageId !== Stage.Claimed && (
                  <Button
                    className={classNames(styles.iconButton, {
                      [styles.cancelIcon]:
                        motion?.status !== MotionStatus.Pending,
                      [styles.iconButtonDisabled]:
                        motion?.status === MotionStatus.Pending,
                    })}
                    onClick={handleCancel}
                    disabled={
                      isCancelled || motion?.status === MotionStatus.Pending
                    }
                  >
                    {motion?.status === MotionStatus.Pending ? (
                      <Icon
                        name="circle-minus"
                        appearance={{ size: 'normal' }}
                        style={{ fill: styles.iconColor }}
                      />
                    ) : (
                      <Tooltip
                        placement="top-start"
                        content={
                          <FormattedMessage
                            {...MSG.tooltipCancelText}
                            values={{ viewFor }}
                          />
                        }
                        popperOptions={{
                          modifiers: [
                            {
                              name: 'offset',
                              options: {
                                offset: [0, 12],
                              },
                            },
                          ],
                        }}
                      >
                        <div className={styles.iconWrapper}>
                          <Icon
                            name={
                              viewFor === 'incorporation'
                                ? 'trash'
                                : 'circle-minus'
                            }
                            appearance={{ size: 'normal' }}
                            style={{ fill: styles.iconColor }}
                          />
                        </div>
                      </Tooltip>
                    )}
                  </Button>
                )}
              <StagesButton
                activeStage={activeStage}
                handleButtonClick={handleButtonClick}
                motion={motion}
                status={status}
                buttonDisabled={buttonDisabled}
                canReleaseFunds // it's temporary value
                expenditureType={formValues?.expenditure}
              />
            </>
          )}
        </div>
      </div>
      {stages.map(({ id, label, description }, index) => (
        <StageItem
          key={id}
          label={label}
          description={description}
          isLast={stages.length === index + 1}
          isActive={activeStage ? index <= activeIndex : false}
          isCancelled={isCancelled && status === Status.ForceCancelled}
          labelComponent={
            status === Status.ForceEdited &&
            index === activeIndex && <Label label={label} />
          }
          isActiveLine={activeLine && index <= activeIndex - 1}
          appearance={appearance}
          viewFor={viewFor}
        />
      ))}
    </div>
  );
};

Stages.displayName = displayName;

export default Stages;
