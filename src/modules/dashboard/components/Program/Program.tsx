import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useParams, Redirect } from 'react-router-dom';

import { ROOT_DOMAIN } from '~constants';
import { useLoggedInUser, useProgram, ProgramStatus } from '~data/index';
import { Address } from '~types/index';
import { useDataFetcher, useTransformer } from '~utils/hooks';

import ProgramDashboard from '../ProgramDashboard';
import ProgramEdit from '../ProgramEdit';
import { canCreateProgram } from '../../checks';
import { domainsAndRolesFetcher } from '../../fetchers';
import { getUserRoles } from '../../../transformers';
import { SpinnerLoader } from '~core/Preloaders';

const MSG = defineMessages({
  programNotFoundText: {
    id: 'dashboard.Program.programNotFoundText',
    defaultMessage: 'Sorry, this program could not be loaded.',
  },
});

interface Props {
  colonyAddress: Address;
  colonyName: string;
}

const displayName = 'dashboard.Program';

const Program = ({ colonyAddress, colonyName }: Props) => {
  const { programId } = useParams();
  const { walletAddress } = useLoggedInUser();

  const { data: domainsAndRolesData } = useDataFetcher(
    domainsAndRolesFetcher,
    [colonyAddress],
    [colonyAddress],
  );
  const userRoles = useTransformer(getUserRoles, [
    domainsAndRolesData,
    ROOT_DOMAIN,
    walletAddress,
  ]);

  const { data: program, error, loading } = useProgram(
    colonyAddress,
    programId,
  );

  const canAdmin = canCreateProgram(userRoles);

  if (loading) {
    return <SpinnerLoader />;
  }

  if (
    program &&
    (program.status === ProgramStatus.Deleted ||
      (program.status === ProgramStatus.Draft && !canAdmin))
  ) {
    return <Redirect to={`/colony/${colonyName}`} />;
  }

  if (!program || !!error) {
    return <FormattedMessage tag="p" {...MSG.programNotFoundText} />;
  }

  return program.status === ProgramStatus.Draft ? (
    <ProgramEdit colonyName={colonyName} program={program} />
  ) : (
    <ProgramDashboard program={program} />
  );
};

Program.displayName = displayName;

export default Program;
