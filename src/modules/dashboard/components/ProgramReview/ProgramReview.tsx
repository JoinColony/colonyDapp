import React from 'react';

import ListGroup, { ListGroupItem } from '~core/ListGroup';
import { SpinnerLoader } from '~core/Preloaders';
import {
  OneProgram,
  useProgramSubmissionsQuery,
  useColonyNativeTokenQuery,
} from '~data/index';

import ProgramReviewItem from './ProgramReviewItem';

interface Props {
  program: OneProgram;
}

const displayName = 'dashboard.ProgramReview';

const ProgramReview = ({
  program: { id: programId, colonyAddress },
}: Props) => {
  const { data } = useProgramSubmissionsQuery({
    variables: { id: programId },
  });

  const { data: nativeTokenData } = useColonyNativeTokenQuery({
    variables: { address: colonyAddress },
  });

  if (!data || !nativeTokenData) return <SpinnerLoader />;

  const { submissions } = data.program;
  const { nativeTokenAddress } = nativeTokenData.colony;

  return (
    <ListGroup appearance={{ gaps: 'true' }}>
      {submissions.map(
        ({
          id,
          submission,
          task: {
            id: taskId,
            description: taskDescription,
            ethSkillId,
            payouts,
            title: taskTitle,
            domain,
          },
          level: { id: levelId, title: levelTitle },
          creator,
        }) => {
          if (!taskTitle || !domain) return null;
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
