/* @flow */

import React from 'react';

import layout from '~styles/layout.css';
import styles from './CreateWallet.css';

import { FieldSet } from '../../../core/components/Fields';
import Button from '../../../core/components/Button';
import Heading from '../../../core/components/Heading';

/* eslint-disable max-len */
const CreateWallet = () => (
  <section className={`${styles.main} ${layout.flexContent}`}>
    <header className={styles.header}>
      <Heading appearance={{ size: 'thin' }} text="Message" />
    </header>
    <form className="form" data-wd-hook="colony-creation-form">
      <FieldSet appearance={{ align: 'right' }}>
        <Button />
      </FieldSet>
    </form>
  </section>
);
/* eslint-enable max-len */

export default CreateWallet;
