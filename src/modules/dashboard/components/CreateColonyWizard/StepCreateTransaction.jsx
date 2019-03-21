/* @flow */

import { connect } from 'react-redux';

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import type { WizardProps } from '~core/Wizard';
import type { TransactionGroup } from '../../../users/components/GasStation/transactionGroup';

import styles from './StepCreateTransaction.css';

import Heading from '~core/Heading';
import { GroupedTransaction } from '../../../users/components/GasStation/TransactionCard';
import GasStationPrice from '../../../users/components/GasStation/GasStationPrice';

import { groupedTransactions } from '../../../core/selectors';

import { createColonyTransactions } from '../../actionCreators';

type FormValues = {
  colonyName: string,
  colonyId: string,
  colonyAddress: string,
};

type Props = WizardProps<FormValues> & {
  transactionGroups: Array<TransactionGroup>,
  createTransactions: () => void,
};

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepCreateTransaction.heading',
    defaultMessage: `Complete these transactions to deploy
      your colony to the blockchain.`,
  },
  descriptionOne: {
    id: 'dashboard.CreateColonyWizard.StepCreateTransaction.descriptionOne',
    defaultMessage:
      // eslint-disable-next-line max-len
      "Here's something cool about Colony: {boldText} You own it, you control it.",
  },
  descriptionBoldText: {
    id:
      'dashboard.CreateColonyWizard.StepCreateTransaction.descriptionBoldText',
    defaultMessage:
      // eslint-disable-next-line max-len
      "we are a fully decentralized application and do not have a central store of yours or anyone's data.",
  },
  descriptionTwo: {
    id: 'dashboard.CreateColonyWizard.StepCreateTransaction.descriptionTwo',
    defaultMessage:
      // eslint-disable-next-line max-len
      'To setup your data storage, we need you to create a unique name for your colony. This allows a mapping between the data stored on the blockchain, on IPFS, and your colony.',
  },
  label: {
    id: 'dashboard.CreateColonyWizard.StepCreateTransaction.label',
    defaultMessage: 'Your unique colony domain name',
  },
  continue: {
    id: 'dashboard.CreateColonyWizard.StepCreateTransaction.continue',
    defaultMessage: 'Continue',
  },
  callToAction: {
    id: 'dashboard.CreateColonyWizard.StepCreateTransaction.callToAction',
    defaultMessage: 'Click confirm to sign each transaction',
  },
  errorDomainTaken: {
    id: 'dashboard.CreateColonyWizard.StepCreateTransaction.errorDomainTaken',
    defaultMessage: 'This colony domain name is already taken',
  },
});

const displayName = 'dashboard.CreateColonyWizard.StepCreateTransaction';

class StepCreateTransaction extends Component<Props> {
  componentDidMount() {
    const { createTransactions } = this.props;
    createTransactions();
  }

  render() {
    const { transactionGroups } = this.props;
    return (
      <section className={styles.main}>
        <Heading
          appearance={{ size: 'medium', weight: 'medium' }}
          text={MSG.heading}
        />
        <div className={styles.container}>
          {transactionGroups && transactionGroups[0] && (
            <GroupedTransaction
              hideSummary
              selectedTransactionIdx={0}
              transactionGroup={transactionGroups[0]}
            />
          )}
        </div>
        <Heading
          appearance={{ size: 'small', weight: 'medium', margin: 'small' }}
          text={MSG.callToAction}
        />
        {transactionGroups && transactionGroups[0] && transactionGroups[0][0] && (
          <div className={styles.containerGasPrice}>
            <GasStationPrice transaction={transactionGroups[0][0]} />
          </div>
        )}
      </section>
    );
  }
}

StepCreateTransaction.displayName = displayName;

export default connect(
  (state: Object) => ({
    transactionGroups: groupedTransactions(state).toJS(),
  }),
  { createTransactions: createColonyTransactions },
)(StepCreateTransaction);
