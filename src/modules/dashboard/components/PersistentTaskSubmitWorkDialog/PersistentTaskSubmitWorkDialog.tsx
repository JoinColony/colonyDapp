import React, { useCallback, useEffect, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import Button from '~core/Button';
import Dialog, { DialogProps, DialogSection } from '~core/Dialog';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import {
  LevelTasksDocument,
  LevelTasksQueryVariables,
  OneLevel,
  OnePersistentTask,
  SubmissionStatus,
  useColonyNativeTokenQuery,
  useCreateLevelTaskSubmissionMutation,
  useDomainLazyQuery,
  useEditSubmissionMutation,
  ProgramSubmissionsDocument,
  ProgramSubmissionsQueryVariables,
} from '~data/index';
import { Input, Form } from '~core/Fields';
import PayoutsList from '~core/PayoutsList';
import { SpinnerLoader } from '~core/Preloaders';

import styles from './PersistentTaskSubmitWorkDialog.css';
import taskSkillsTree from '~dashboard/TaskSkills/taskSkillsTree';

const MSG = defineMessages({
  buttonResubmit: {
    id: 'dashboard.PersistentTaskSubmitWorkDialog.buttonResubmit',
    defaultMessage: 'Re-submit',
  },
  domainText: {
    id: 'dashboard.PersistentTaskSubmitWorkDialog.domainText',
    defaultMessage: 'in {domainName}',
  },
  helpSubmitWork: {
    id: 'dashboard.PersistentTaskSubmitWorkDialog.helpSubmitWork',
    defaultMessage:
      'Add a comment or drop in a link so the admin can review your work.',
  },
  headingSubmission: {
    id: 'dashboard.PersistentTaskSubmitWorkDialog.headingSubmission',
    defaultMessage: 'Submission',
  },
  labelSubmitWork: {
    id: 'dashboard.PersistentTaskSubmitWorkDialog.labelSubmitWork',
    defaultMessage: 'Submit your work',
  },
  statusCompleteText: {
    id: 'dashboard.PersistentTaskSubmitWorkDialog.statusCompleteText',
    defaultMessage: 'Complete',
  },
  statusPendingText: {
    id: 'dashboard.PersistentTaskSubmitWorkDialog.statusPendingText',
    defaultMessage: 'Pending review',
  },
  titleDescription: {
    id: 'dashboard.PersistentTaskSubmitWorkDialog.titleDescription',
    defaultMessage: 'Description',
  },
});

interface FormValues {
  submission: string;
}

interface Props extends DialogProps {
  levelId: OneLevel['id'];
  persistentTask: OnePersistentTask;
  programId: OneLevel['programId'];
}

const displayName = 'dashboard.PersistentTaskSubmitWorkDialog';

const validationSchema = yup.object({
  submission: yup.string(),
});

const PersistentTaskSubmitWorkDialog = ({
  cancel,
  close,
  levelId,
  persistentTask: {
    id: persistentTaskId,
    colonyAddress,
    currentUserSubmission,
    description,
    ethDomainId,
    ethSkillId,
    payouts,
    title,
  },
  programId,
}: Props) => {
  const isSubmissionAccepted =
    currentUserSubmission &&
    currentUserSubmission.status === SubmissionStatus.Accepted;
  const isSubmissionPending =
    currentUserSubmission &&
    currentUserSubmission.status === SubmissionStatus.Open;

  const [fetchDomain, { data: domainData }] = useDomainLazyQuery();

  const { data: nativeTokenData } = useColonyNativeTokenQuery({
    variables: { address: colonyAddress },
  });
  const [
    createLevelTaskSubmission,
    { loading: loadingCreation },
  ] = useCreateLevelTaskSubmissionMutation();
  const [
    editSubmission,
    { loading: loadingEdit },
  ] = useEditSubmissionMutation();

  const loading = loadingEdit || loadingCreation;

  const handleSubmit = useCallback(
    async ({ submission }: FormValues) => {
      const refetchQueries = [
        // Refetch in lieu of cache updates because of server-side resolvers (most notably `currentUserSubmission`)
        {
          query: LevelTasksDocument,
          variables: { id: levelId } as LevelTasksQueryVariables,
        },
        {
          query: ProgramSubmissionsDocument,
          variables: { id: programId } as ProgramSubmissionsQueryVariables,
        },
      ];
      if (currentUserSubmission) {
        await editSubmission({
          refetchQueries,
          variables: { input: { id: currentUserSubmission.id, submission } },
        });
      } else {
        await createLevelTaskSubmission({
          refetchQueries,
          variables: { input: { levelId, persistentTaskId, submission } },
        });
      }
      close(submission);
    },
    [
      close,
      createLevelTaskSubmission,
      currentUserSubmission,
      editSubmission,
      levelId,
      persistentTaskId,
      programId,
    ],
  );

  useEffect(() => {
    if (ethDomainId) {
      fetchDomain({ variables: { ethDomainId, colonyAddress } });
    }
  }, [colonyAddress, ethDomainId, fetchDomain]);

  const skillName = useMemo(
    () =>
      ethSkillId &&
      (taskSkillsTree.find(({ id }) => id === ethSkillId) || { name: '' }).name,
    [ethSkillId],
  );
  return (
    <Dialog cancel={cancel}>
      {!nativeTokenData ? (
        <DialogSection appearance={{ align: 'center' }}>
          <SpinnerLoader appearance={{ size: 'large' }} />
        </DialogSection>
      ) : (
        <Form
          initialValues={
            {
              submission: currentUserSubmission
                ? currentUserSubmission.submission
                : '',
            } as FormValues
          }
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ isValid }) => (
            <>
              <DialogSection>
                <div className={styles.headingContainer}>
                  <div>
                    <div className={styles.headingInner}>
                      <Heading
                        appearance={{ margin: 'none', size: 'medium' }}
                        text={title || { id: 'levelStep.untitled' }}
                      />
                      {isSubmissionAccepted && (
                        <Icon
                          className={styles.iconComplete}
                          name="circle-check-primary"
                          title={MSG.statusCompleteText}
                          viewBox="0 0 21 22"
                        />
                      )}
                    </div>
                    <div className={styles.categories}>
                      {domainData && (
                        <div className={styles.category}>
                          <FormattedMessage
                            {...MSG.domainText}
                            values={{ domainName: domainData.domain.name }}
                          />
                        </div>
                      )}
                      {skillName && (
                        <div className={styles.category}>{skillName}</div>
                      )}
                    </div>
                  </div>
                  <div className={styles.rewardsContainer}>
                    <div className={styles.payoutsContainer}>
                      <PayoutsList
                        nativeTokenAddress={
                          nativeTokenData.colony.nativeTokenAddress
                        }
                        payouts={payouts}
                      />
                    </div>
                    {isSubmissionPending && (
                      <div className={styles.pendingText}>
                        <Heading
                          appearance={{ margin: 'none', size: 'small' }}
                          text={MSG.statusPendingText}
                        />
                        <div className={styles.dot} />
                      </div>
                    )}
                  </div>
                </div>
              </DialogSection>
              {description && (
                <DialogSection appearance={{ border: 'top' }}>
                  <Heading
                    appearance={{ margin: 'small', size: 'normal' }}
                    text={MSG.titleDescription}
                  />
                  <p>{description}</p>
                </DialogSection>
              )}
              <DialogSection appearance={{ border: 'top' }}>
                {currentUserSubmission && isSubmissionAccepted ? (
                  <>
                    <Heading
                      appearance={{ size: 'normal' }}
                      text={MSG.headingSubmission}
                    />
                    <b>{currentUserSubmission.submission}</b>
                  </>
                ) : (
                  <Input
                    appearance={{ colorSchema: 'grey', theme: 'fat' }}
                    autoComplete="off"
                    status={MSG.helpSubmitWork}
                    label={MSG.labelSubmitWork}
                    name="submission"
                  />
                )}
              </DialogSection>
              <DialogSection appearance={{ align: 'right', border: 'top' }}>
                {isSubmissionAccepted ? (
                  <Button
                    appearance={{ size: 'large', theme: 'primary' }}
                    onClick={close}
                    text={{ id: 'button.close' }}
                  />
                ) : (
                  <>
                    <Button
                      appearance={{ size: 'large', theme: 'secondary' }}
                      disabled={loading}
                      onClick={cancel}
                      text={{ id: 'button.cancel' }}
                    />
                    <Button
                      appearance={{ size: 'large', theme: 'primary' }}
                      disabled={!isValid}
                      loading={loading}
                      text={
                        currentUserSubmission
                          ? MSG.buttonResubmit
                          : { id: 'button.submit' }
                      }
                      type="submit"
                    />
                  </>
                )}
              </DialogSection>
            </>
          )}
        </Form>
      )}
    </Dialog>
  );
};

PersistentTaskSubmitWorkDialog.displayName = displayName;

export default PersistentTaskSubmitWorkDialog;
