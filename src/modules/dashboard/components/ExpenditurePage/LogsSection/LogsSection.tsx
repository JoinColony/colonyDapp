import React from 'react';

import styles from './LogsSection.css';
import { logs } from './consts';
import Log from './Log';
import { useLoggedInUser } from '~data/helpers';
import { CommentInput } from '~core/Comment';

interface Props {
  colonyAddress: string;
}

const LogsSection = ({ colonyAddress }: Props) => {
  const { username: currentUserName, ethereal } = useLoggedInUser();
  // add logs fetching here

  return (
    <div className={styles.container}>
      {logs.map((log, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <Log {...log} key={`${idx}_${logs.length}`} />
      ))}
      {/*
       *  @NOTE A user can comment only if he has a wallet connected
       * and a registered user profile
       */}
      {currentUserName && !ethereal && (
        <div>
          <CommentInput
            {...{
              colonyAddress,
              transactionHash:
                // eslint-disable-next-line max-len
                '0x1785d214f0127279681354be8e23ad1a1501207432229db93a415c7a58427138',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default LogsSection;
