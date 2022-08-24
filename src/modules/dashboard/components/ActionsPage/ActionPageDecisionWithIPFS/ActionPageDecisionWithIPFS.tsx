import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import CalloutCard from '~core/CalloutCard';
import Link from '~core/Link';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { useDataFetcher } from '~utils/hooks';
import { Colony, AnyUser } from '~data/index';
import { DecisionDetails } from '~types/index';

import { ipfsDataFetcher } from '../../../../core/fetchers';

import styles from './ActionPageDecisionWithIPFS.css';

const displayName = 'dashboard.ActionsPage.ActionPageDecisionWithIPFS';

const MSG = defineMessages({
  warningTitle: {
    id: 'dashboard.ActionsPage.ActionPageDecisionWithIPFS.warningTitle',
    defaultMessage: `<span>Attention.</span> `,
  },
  warningText: {
    id: 'dashboard.ActionsPage.ActionPageDecisionWithIPFS.internalLink',
    defaultMessage: `Unable to connect to IPFS gateway, Decision details not loaded. {link}`,
  },
  reloadLink: {
    id: 'dashboard.ActionsPage.ActionPageDecisionWithIPFS.internalLink',
    defaultMessage: `Reload to try again`,
  },
});

interface Props {
  colony: Colony;
  user: AnyUser;
  username: string;
  walletAddress: string;
  hash: string;
}
// @NOTE For a Decision motions, the annotation stores the decision details.
const ActionPageDecisionWithIPFS = ({
  colony,
  user,
  username,
  walletAddress,
  hash,
}: Props) => {
  const { data: ipfsDataJSON } = useDataFetcher(
    ipfsDataFetcher,
    [hash],
    [hash],
  );

  const decisionDetails = useMemo(() => {
    if (!ipfsDataJSON) {
      return undefined;
    }
    // @TODO - add V2 IPFS support inc validation
    const details: DecisionDetails = JSON.parse(ipfsDataJSON);
    return details;
  }, [ipfsDataJSON]);

  const location = useLocation();
  // trouble connecting to IPFS
  if (!ipfsDataJSON) {
    return (
      <CalloutCard
        label={MSG.warningTitle}
        labelValues={{
          span: (chunks) => (
            <span className={styles.noIPFSLabel}>{chunks}</span>
          ),
        }}
        description={MSG.warningText}
        descriptionValues={{
          link: (
            <Link
              to={location.pathname}
              text={MSG.reloadLink}
              className={styles.link}
              onClick={() => window.location.reload()}
            />
          ),
        }}
      />
    );
  }

  /*
   * This means that the annotation object is in a format we don't recognize
   */
  if (!decisionDetails) {
    return null;
  }

  const UserAvatar = HookedUserAvatar({ fetchUser: false });

  return (
    <div className={styles.contentContainer}>
      <div className={styles.leftContent}>
        <span className={styles.userinfo}>
          <UserAvatar
            colony={colony}
            size="s"
            notSet={false}
            user={user}
            address={walletAddress || ''}
            showInfo
            popperOptions={{
              showArrow: false,
              placement: 'left',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 10],
                  },
                },
              ],
            }}
          />
          <span className={styles.userName}>{`@${username}`}</span>
        </span>
        <div className={styles.title}>
          <Heading
            tagName="h3"
            appearance={{
              size: 'medium',
              margin: 'small',
              theme: 'dark',
            }}
            text={decisionDetails.title}
          />
          <p>{decisionDetails.title}</p>
        </div>
        {decisionDetails.description}
      </div>
    </div>
  );
};

ActionPageDecisionWithIPFS.displayName = displayName;

export default ActionPageDecisionWithIPFS;
