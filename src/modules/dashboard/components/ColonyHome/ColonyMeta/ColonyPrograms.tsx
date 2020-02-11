import React from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import NavLink from '~core/NavLink';
import { useColonyProgramsQuery } from '~data/index';
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
  colonyAddress: Address;
}

const displayName = 'dashboard.ColonyHome.ColonyMeta.ColonyPrograms';

const ColonyPrograms = ({ colonyAddress }: Props) => {
  const { data } = useColonyProgramsQuery({
    variables: { address: colonyAddress },
  });

  if (!data) {
    return null;
  }
  const {
    colony: { programs },
  } = data;
  return (
    <>
      <nav className={styles.programsNav}>
        {programs.map(({ id, title }) => (
          <NavLink
            className={styles.navLink}
            key={id}
            text={title}
            to="something"
          />
        ))}
      </nav>
      <Button
        appearance={{ theme: 'blue' }}
        text={MSG.buttonCreateProgram}
        textValues={{ hasPrograms: String(programs.length > 0) }}
      />
    </>
  );
};

ColonyPrograms.displayName = displayName;

export default ColonyPrograms;
