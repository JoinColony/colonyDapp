import React, { useState, useCallback, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useLocation, useParams, Redirect } from 'react-router-dom';

import { ROOT_DOMAIN } from '~constants';
import { SpinnerLoader } from '~core/Preloaders';
import { useLoggedInUser, ProgramStatus, useProgramQuery } from '~data/index';
import { Address } from '~types/index';
import { useDataFetcher, useTransformer } from '~utils/hooks';

import ProgramDashboard from '../ProgramDashboard';
import ProgramEdit from '../ProgramEdit';
import { canCreateProgram } from '../../checks';
import { domainsAndRolesFetcher } from '../../fetchers';
import { getUserRoles } from '../../../transformers';

const MSG = defineMessages({
  loading: {
    id: 'dashboard.Program.loading',
    defaultMessage: 'Loading program...',
  },
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
  const location = useLocation();
  const { programId } = useParams();
  const { walletAddress } = useLoggedInUser();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    setIsEditing(false);
    // Force out of edit state after each route change
  }, [location]);

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

  const { data, error, loading } = useProgramQuery({
    variables: { id: programId },
  });

  const toggleEditMode = useCallback(() => {
    setIsEditing(val => !val);
  }, []);

  const canAdmin = canCreateProgram(userRoles);

  if (loading) {
    return (
      <SpinnerLoader
        loadingText={MSG.loading}
        appearance={{ size: 'massive', theme: 'primary' }}
      />
    );
  }

  const program = data && data.program;

  if (
    program &&
    (program.status === ProgramStatus.Deleted ||
      (program.status === ProgramStatus.Draft && !canAdmin))
  ) {
    return <Redirect to={`/colony/${colonyName}`} />;
  }

  if (!program || !!error) {
    return (
      <p>
        <FormattedMessage {...MSG.programNotFoundText} />
      </p>
    );
  }

  return canAdmin && (program.status === ProgramStatus.Draft || isEditing) ? (
    <ProgramEdit
      colonyName={colonyName}
      program={program}
      toggleEditMode={toggleEditMode}
    />
  ) : (
    <ProgramDashboard
      canAdmin={canAdmin}
      program={program}
      toggleEditMode={toggleEditMode}
    />
  );
};

Program.displayName = displayName;

export default Program;
