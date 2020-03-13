import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import ListGroup, { ListGroupItem } from '~core/ListGroup';
import { SpinnerLoader } from '~core/Preloaders';
import {
  OneProgram,
  ProgramSubmissionsQuery,
  useColonyNativeTokenQuery,
} from '~data/index';

import ProgramReviewItem from './ProgramReviewItem';

import styles from './ProgramReview.css';

const MSG = defineMessages({
  emptyText: {
    id: 'dashboard.ProgramReview.emptyText',
    defaultMessage: 'Nothing left to review. Great work!',
  },
});

interface Props {
  program: OneProgram;
  submissions: ProgramSubmissionsQuery['program']['submissions'];
}

const displayName = 'dashboard.ProgramReview';

const ProgramReview = ({
  program: { id: programId, colonyAddress },
  submissions,
}: Props) => {
  const { data: nativeTokenData } = useColonyNativeTokenQuery({
    variables: { address: colonyAddress },
  });

  if (!nativeTokenData) return <SpinnerLoader />;

  const { nativeTokenAddress } = nativeTokenData.colony;

  if (!submissions.length)
    return (
      <p className={styles.emptyText}>
        <FormattedMessage {...MSG.emptyText} />
      </p>
    );

  return (
    <ListGroup appearance={{ gaps: 'true' }}>
      {submissions.map(
        ({
          submission: {
            id,
            creator,
            submission,
            task: {
              id: taskId,
              description: taskDescription,
              ethSkillId,
              payouts,
              title: taskTitle,
              domain,
            },
          },
          level: { id: levelId, title: levelTitle },
        }) => {
          if (!domain) return null;
          const { ethDomainId, name: domainName } = domain;
          return (
            <ListGroupItem key={id}>
              <ProgramReviewItem
                colonyAddress={colonyAddress}
                domainId={ethDomainId}
                domainName={domainName}
                levelId={levelId}
                levelTitle={levelTitle}
                nativeTokenAddress={nativeTokenAddress}
                payouts={payouts}
                programId={programId}
                skillId={ethSkillId || 0}
                submissionId={id}
                submission={submission}
                taskDescription={taskDescription || ''}
                taskId={taskId}
                taskTitle={taskTitle}
                worker={creator}
              />
            </ListGroupItem>
          );
        },
      )}
    </ListGroup>
  );
};

ProgramReview.displayName = displayName;

export default ProgramReview;
