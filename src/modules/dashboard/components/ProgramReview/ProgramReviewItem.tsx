import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { IconButton } from '~core/Button';
import PayoutsList from '~core/PayoutsList';
import Heading from '~core/Heading';
import { Form } from '~core/Fields';
import { useDomainFundsCheck } from '~dashboard/TaskFinalizeDialog';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';
import { useAsyncFunction } from '~utils/hooks';
import {
  cacheUpdates,
  OnePersistentTask,
  OneProgramSubmission,
  Payouts,
  useAcceptLevelTaskSubmissionMutation,
} from '~data/index';

import styles from './ProgramReviewItem.css';

const MSG = defineMessages({
  inDomain: {
    id: 'dashboard.ProgramReview.ProgramReviewItem.inDomain',
    defaultMessage: 'in {domainName}',
  },
  submissionHeading: {
    id: 'dashboard.ProgramReview.ProgramReviewItem.submissionHeading',
    defaultMessage: 'Submission',
  },
  noSubmission: {
    id: 'dashboard.ProgramReview.ProgramReviewItem.noSubmission',
    defaultMessage: 'No submission',
  },
});

const UserAvatar = HookedUserAvatar({ fetchUser: false });

interface Props {
  colonyAddress: string;
  domainId: number;
  domainName: string;
  levelId: string;
  levelTitle?: string | null;
  nativeTokenAddress: Address;
  payouts: Payouts;
  programId: string;
  skillId: number;
  submission: string;
  submissionId: string;
  taskDescription: string;
  taskId: string;
  taskTitle: OnePersistentTask['title'];
  worker: OneProgramSubmission['submission']['creator'];
}

const displayName = 'dashboard.ProgramReview.ProgramReviewItem';

const ProgramReviewItem = ({
  colonyAddress,
  domainId,
  domainName,
  levelId,
  levelTitle,
  nativeTokenAddress,
  payouts,
  programId,
  skillId,
  submission,
  submissionId,
  taskDescription,
  taskId,
  taskTitle,
  worker,
}: Props) => {
  const finalizeTask = useAsyncFunction({
    submit: ActionTypes.TASK_FINALIZE,
    error: ActionTypes.TASK_FINALIZE_ERROR,
    success: ActionTypes.TASK_FINALIZE_SUCCESS,
  });

  const [acceptLevelTaskSubmission] = useAcceptLevelTaskSubmissionMutation({
    update: cacheUpdates.acceptLevelTaskSubmission(programId),
    variables: { input: { levelId, submissionId } },
  });

  const checkDomainBalance = useDomainFundsCheck(
    colonyAddress,
    payouts,
    domainId,
  );

  const handleAccept = useCallback(async () => {
    if (await checkDomainBalance()) {
      if (payouts.length > 0) {
        await finalizeTask({
          colonyAddress,
          domainId,
          draftId: taskId,
          payouts,
          skillId,
          workerAddress: worker.profile.walletAddress,
        });
      }
      await acceptLevelTaskSubmission();
    }
  }, [
    acceptLevelTaskSubmission,
    checkDomainBalance,
    colonyAddress,
    domainId,
    finalizeTask,
    payouts,
    skillId,
    taskId,
    worker.profile.walletAddress,
  ]);

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <UserAvatar
            size="s"
            address={worker.profile.walletAddress}
            user={worker}
            showInfo
          />
          <div className={styles.titleContainer}>
            <div className={styles.title}>
              {taskTitle || <FormattedMessage id="levelStep.untitled" />}
            </div>
            <div className={styles.meta}>
              <span>{levelTitle}</span>
              <span>
                <FormattedMessage {...MSG.inDomain} values={{ domainName }} />
              </span>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <PayoutsList
            payouts={payouts}
            nativeTokenAddress={nativeTokenAddress}
          />
          <div className={styles.button}>
            <Form onSubmit={handleAccept} initialValues={{}}>
              {({ isSubmitting }) => (
                <IconButton
                  appearance={{ theme: 'primary' }}
                  loading={isSubmitting}
                  text={{ id: 'button.confirm' }}
                  type="submit"
                />
              )}
            </Form>
          </div>
        </div>
      </div>
      <p className={styles.taskDescription}>{taskDescription}</p>
      <Heading
        appearance={{ margin: 'small', size: 'normal' }}
        text={MSG.submissionHeading}
      />
      <p className={styles.submission}>
        {submission || <FormattedMessage {...MSG.noSubmission} />}
      </p>
    </div>
  );
};

ProgramReviewItem.displayName = displayName;

export default ProgramReviewItem;
