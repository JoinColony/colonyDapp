import React from 'react';
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

  const { data: program, loading } = useProgram(colonyAddress, programId);

  const canAdmin = canCreateProgram(userRoles);

  if (loading) {
    return <SpinnerLoader />;
  }

  if (!program) {
    return null;
  }

  if (program.status !== ProgramStatus.Active && !canAdmin) {
    return <Redirect to={`/colony/${colonyName}`} />;
  }

  return program.status === ProgramStatus.Draft ? (
    <ProgramEdit colonyName={colonyName} program={program} />
  ) : (
    <ProgramDashboard program={program} />
  );
};

Program.displayName = displayName;

export default Program;
