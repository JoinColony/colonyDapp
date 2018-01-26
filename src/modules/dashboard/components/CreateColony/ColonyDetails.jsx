/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { FormProps } from '~types/forms';

import layout from '~styles/layout.css';
import styles from './ColonyDetails.css';

import { FieldSet } from '../../../core/components/Fields';
import Button from '../../../core/components/Button';
import Heading from '../../../core/components/Heading';

const MSG = defineMessages({
  heading: {
    id: 'CreateColony.ColonyDetails.heading',
    defaultMessage: 'Create your very own Colony!',
  },
  buttonCreateColony: {
    id: 'CreateColony.ColonyDetails.button.createColony',
    defaultMessage: 'Create Colony',
  },
  helpText: {
    id: 'CreateColony.ColonyDetails.helpText',
    defaultMessage: 'So, this is some placeholder text',
  },
});

const displayName = 'dashboard.CreateColony.ColonyDetails';

type CustomProps = {
  nextStep: () => void,
};

type Props = FormProps<CustomProps>;

const ColonyDetails = ({ nextStep, handleSubmit, submitting }: Props) => (
  <section className={`${styles.main} ${layout.flexContent}`}>
    <header className={styles.header}>
      <Heading
        appearance={{ size: 'thin' }}
        text={MSG.heading}
      />
    </header>
    <form
      className="form"
      data-wd-hook="colony-creation-form"
      onSubmit={handleSubmit(nextStep)}
    >
      <FieldSet appearance={{ align: 'right' }}>
        <Button
          theme="primary"
          size="large"
          loading={submitting}
          value={MSG.buttonCreateColony}
        />
      </FieldSet>
    </form>
  </section>
);

ColonyDetails.displayName = displayName;

export default ColonyDetails;

export const helpText = <FormattedMessage {...MSG.helpText} />;
