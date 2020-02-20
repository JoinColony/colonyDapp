import React, { useCallback, useState } from 'react';
import throttle from 'lodash/throttle';
import { defineMessages, useIntl } from 'react-intl';
import { useHistory } from 'react-router';

import { ROOT_DOMAIN } from '~constants';
import Button from '~core/Button';
import NavLink from '~core/NavLink';
import {
  cacheUpdates,
  ProgramStatus,
  useColonyProgramsQuery,
  useCreateProgramMutation,
  useLoggedInUser,
} from '~data/index';
import { Address } from '~types/index';
import { useDataFetcher, useTransformer } from '~utils/hooks';

import { canCreateProgram } from '../../../checks';
import { domainsAndRolesFetcher } from '../../../fetchers';
import { getUserRoles } from '../../../../transformers';

import styles from './ColonyPrograms.css';

const MSG = defineMessages({
  linkUntitledProgramText: {
    id:
      'dashboard.ColonyHome.ColonyMeta.ColonyPrograms.linkUntitledProgramText',
    defaultMessage: 'Untitled Program',
  },
  linkProgramTitleText: {
    id: 'dashboard.ColonyHome.ColonyMeta.ColonyPrograms.linkProgramTitleText',
    defaultMessage: '{isDraft, select, true {Draft - } false {}}{title}',
  },
  buttonCreateProgram: {
    id: 'dashboard.ColonyHome.ColonyMeta.ColonyPrograms.buttonCreateProgram',
    defaultMessage: `Create {hasPrograms, select,
      true {new}
      false {a}
    } program`,
  },
});

interface Props {
  colonyAddress: Address;
  colonyName: string;
}

const displayName = 'dashboard.ColonyHome.ColonyMeta.ColonyPrograms';

const ColonyPrograms = ({ colonyAddress, colonyName }: Props) => {
  const { formatMessage } = useIntl();
  const [isCreatingProgram, setIsCreatingProgram] = useState<boolean>(false);
  const history = useHistory();

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

  const { data: programsData } = useColonyProgramsQuery({
    variables: { address: colonyAddress },
  });

  const canCreate = canCreateProgram(userRoles);

  const unfilteredPrograms =
    (programsData && programsData.colony.programs) || [];

  const programs = unfilteredPrograms.filter(
    ({ status }) =>
      status === ProgramStatus.Active ||
      (status === ProgramStatus.Draft && canCreate),
  );

  const [createProgramFn, { error }] = useCreateProgramMutation({
    variables: { input: { colonyAddress } },
    update: cacheUpdates.createProgram(colonyAddress),
  });
  const handleCreateProgram = useCallback(
    throttle(async () => {
      setIsCreatingProgram(true);
      const mutationResult = await createProgramFn();
      const id =
        mutationResult &&
        mutationResult.data &&
        mutationResult.data.createProgram &&
        mutationResult.data.createProgram.id;
      history.replace(`/colony/${colonyName}/program/${id}`);
      setIsCreatingProgram(false);
    }, 2000),
    [colonyName, createProgramFn, history],
  );

  if (!programsData || (!canCreate && programs.length === 0)) {
    return null;
  }

  return (
    <section className={styles.main}>
      {programs.length > 0 && (
        <nav className={styles.programsNav}>
          {programs.map(({ id, status, title }) => {
            const isDraft = status === ProgramStatus.Draft;
            return (
              <span
                className={isDraft ? styles.draft : styles.baseStyles}
                key={id}
              >
                <NavLink
                  activeClassName={styles.navLinkActive}
                  className={styles.navLink}
                  text={title || MSG.linkUntitledProgramText}
                  title={MSG.linkProgramTitleText}
                  titleValues={{
                    isDraft,
                    title: title || formatMessage(MSG.linkUntitledProgramText),
                  }}
                  to={`/colony/${colonyName}/program/${id}`}
                />
              </span>
            );
          })}
        </nav>
      )}
      {canCreate && (
        <Button
          appearance={{ theme: 'blue' }}
          loading={isCreatingProgram && !error}
          onClick={handleCreateProgram}
          text={MSG.buttonCreateProgram}
          textValues={{ hasPrograms: programs.length > 0 }}
        />
      )}
    </section>
  );
};

ColonyPrograms.displayName = displayName;

export default ColonyPrograms;
