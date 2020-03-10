import React, { useCallback, useEffect, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import Button from '~core/Button';
import Dialog, { DialogProps, DialogSection } from '~core/Dialog';
import Heading from '~core/Heading';
import {
  OneLevel,
  OnePersistentTask,
  useColonyNativeTokenQuery,
  useCreateLevelTaskSubmissionMutation,
  useDomainLazyQuery,
} from '~data/index';
import { Input, Form } from '~core/Fields';
import PayoutsList from '~core/PayoutsList';
import { SpinnerLoader } from '~core/Preloaders';

import styles from './PersistentTaskSubmitWorkDialog.css';
import taskSkillsTree from '~dashboard/TaskSkills/taskSkillsTree';

const MSG = defineMessages({
  domainText: {
    id: 'dashboard.PersistentTaskSubmitWorkDialog.domainText',
    defaultMessage: 'in {domainName}',
  },
  helpSubmitWork: {
    id: 'dashboard.PersistentTaskSubmitWorkDialog.helpSubmitWork',
    defaultMessage:
      'Add a comment or drop in a link so the admin can review your work.',
  },
  labelSubmitWork: {
    id: 'dashboard.PersistentTaskSubmitWorkDialog.labelSubmitWork',
    defaultMessage: 'Submit your work',
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
}

const displayName = 'dashboard.PersistentTaskSubmitWorkDialog';

const validationSchema = yup.object({
  submission: yup.string().required(),
});

const PersistentTaskSubmitWorkDialog = ({
  cancel,
  close,
  levelId,
  persistentTask: {
    id: persistentTaskId,
    colonyAddress,
    description,
    ethDomainId,
    ethSkillId,
    payouts,
    title,
  },
}: Props) => {
  const [fetchDomain, { data: domainData }] = useDomainLazyQuery();

  const { data: nativeTokenData } = useColonyNativeTokenQuery({
    variables: { address: colonyAddress },
  });
  const [
    createLevelTaskSubmission,
    { data, loading },
  ] = useCreateLevelTaskSubmissionMutation();

  const handleSubmit = useCallback(
    ({ submission }: FormValues) => {
      createLevelTaskSubmission({
        variables: { input: { levelId, persistentTaskId, submission } },
      });
    },
    [createLevelTaskSubmission, levelId, persistentTaskId],
  );

  useEffect(() => {
    if (data) {
      close(data);
    }
  }, [close, data]);

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
          initialValues={{ submission: '' } as FormValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ dirty, isValid }) => (
            <>
              {title && (
                <DialogSection>
                  <div className={styles.headingContainer}>
                    <div>
                      <Heading
                        appearance={{ margin: 'none', size: 'medium' }}
                        text={title}
                      />
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
                    <div>
                      <PayoutsList
                        nativeTokenAddress={
                          nativeTokenData.colony.nativeTokenAddress
                        }
                        payouts={payouts}
                      />
                    </div>
                  </div>
                </DialogSection>
              )}
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
                <Input
                  appearance={{ colorSchema: 'grey', theme: 'fat' }}
                  status={MSG.helpSubmitWork}
                  label={MSG.labelSubmitWork}
                  name="submission"
                />
              </DialogSection>
              <DialogSection appearance={{ align: 'right', border: 'top' }}>
                <Button
                  appearance={{ size: 'large', theme: 'secondary' }}
                  disabled={loading}
                  onClick={cancel}
                  text={{ id: 'button.cancel' }}
                />
                <Button
                  appearance={{ size: 'large', theme: 'primary' }}
                  disabled={!isValid || !dirty}
                  loading={loading}
                  text={{ id: 'button.submit' }}
                  type="submit"
                />
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
