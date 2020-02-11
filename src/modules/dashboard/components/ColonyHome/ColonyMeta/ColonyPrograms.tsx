import React, { useCallback, useState } from 'react';
import throttle from 'lodash/throttle';
import { defineMessages } from 'react-intl';
import { useHistory } from 'react-router';

import Button from '~core/Button';
import NavLink from '~core/NavLink';
import {
  ColonyPrograms as ColonyProgramsType,
  useCreateProgramMutation,
  ProgramStatus,
  cacheUpdates,
} from '~data/index';
import { Address } from '~types/index';

import styles from './ColonyPrograms.css';

const MSG = defineMessages({
  buttonCreateProgram: {
    id: 'dashboard.ColonyHome.ColonyMeta.ColonyPrograms.buttonCreateProgram',
    defaultMessage: `Create {hasPrograms, select,
      true {new}
      false {a}
    } program`,
  },
});

interface Props {
  canCreate: boolean;
  colonyAddress: Address;
  colonyName: string;
  programs: ColonyProgramsType;
}

const displayName = 'dashboard.ColonyHome.ColonyMeta.ColonyPrograms';

const ColonyPrograms = ({
  canCreate,
  colonyAddress,
  colonyName,
  programs,
}: Props) => {
  const [isCreatingProgram, setIsCreatingProgram] = useState<boolean>(false);

  const history = useHistory();

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
    }, 2000),
    [colonyName, createProgramFn, history],
  );

  return (
    <>
      <nav className={styles.programsNav}>
        {programs.map(({ id, status, title }) => {
          const className =
            status === ProgramStatus.Draft
              ? styles.navLinkDraft
              : styles.navLink;
          return (
            <NavLink
              className={className}
              key={id}
              text={title}
              to={`/colony/${colonyName}/program/${id}`}
            />
          );
        })}
      </nav>
      {canCreate && (
        <Button
          appearance={{ theme: 'blue' }}
          loading={isCreatingProgram && !error}
          onClick={handleCreateProgram}
          text={MSG.buttonCreateProgram}
          textValues={{ hasPrograms: programs.length > 0 }}
        />
      )}
    </>
  );
};

ColonyPrograms.displayName = displayName;

export default ColonyPrograms;
