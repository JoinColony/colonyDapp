import React, { useCallback, useState } from 'react';
import throttle from 'lodash/throttle';
import { defineMessages, useIntl } from 'react-intl';
import { useHistory } from 'react-router';

import Button from '~core/Button';
import NavLink from '~core/NavLink';
import {
  cacheUpdates,
  ProgramStatus,
  useColonyProgramsQuery,
  useCreateProgramMutation,
} from '~data/index';
import { Address } from '~types/index';

import styles from './ColonyPrograms.css';

const MSG = defineMessages({
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
  canAdminister: boolean;
  colonyAddress: Address;
  colonyName: string;
}

const displayName = 'dashboard.ColonyHome.ColonyMeta.ColonyPrograms';

const ColonyPrograms = ({
  colonyAddress,
  colonyName,
  canAdminister,
}: Props) => {
  const { formatMessage } = useIntl();
  const [isCreatingProgram, setIsCreatingProgram] = useState<boolean>(false);
  const history = useHistory();

  const { data: programsData } = useColonyProgramsQuery({
    variables: { address: colonyAddress },
  });

  const unfilteredPrograms =
    (programsData && programsData.colony.programs) || [];

  const programs = unfilteredPrograms.filter(
    ({ status }) =>
      status === ProgramStatus.Active ||
      (status === ProgramStatus.Draft && canAdminister),
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
      history.push(`/colony/${colonyName}/program/${id}`);
      setIsCreatingProgram(false);
    }, 2000),
    [colonyName, createProgramFn, history],
  );

  if (!programsData || (!canAdminister && programs.length === 0)) {
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
                  text={title || { id: 'program.untitled' }}
                  title={MSG.linkProgramTitleText}
                  titleValues={{
                    isDraft,
                    title: title || formatMessage({ id: 'program.untitled' }),
                  }}
                  to={`/colony/${colonyName}/program/${id}`}
                />
              </span>
            );
          })}
        </nav>
      )}
      {canAdminister && (
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
