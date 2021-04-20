import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Colony, useLoggedInUser } from '~data/index';
import { ActionTypes } from '~redux/index';
import { ColonyMotions } from '~types/index';

import VoteResultsItem from './VoteResultsItem';

import styles from './VoteResults.css';

interface Props {
  colony: Colony;
  motionId: number;
}

const VoteResults = ({ colony: { colonyAddress }, colony }: Props) => {
  return (
    <div className={styles.main}>
      <div className={styles.firstVoteResult}>
        <VoteResultsItem
          value={20}
          maxValue={100}
          title="yes"
          voters={[
            '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
            '0x9dF24e73f40b2a911Eb254A8825103723E13209C',
          ]}
        />
      </div>
      <VoteResultsItem
        value={80}
        maxValue={100}
        title="no"
        appearance={{ theme: 'disapprove' }}
        voters={[
          '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
          '0x9dF24e73f40b2a911Eb254A8825103723E13209C',
          '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
          '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
          '0x9dF24e73f40b2a911Eb254A8825103723E13209C',
          '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
          '0x9dF24e73f40b2a911Eb254A8825103723E13209C',
        ]}
      />
    </div>
  );
};

VoteResults.displayName = 'dashboard.ActionsPage.VoteResults';

export default VoteResults;
