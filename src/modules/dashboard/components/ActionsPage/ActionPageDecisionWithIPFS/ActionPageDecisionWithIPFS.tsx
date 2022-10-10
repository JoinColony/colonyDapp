import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import parse from 'html-react-parser';
import {
  getDecisionDetailsFromResponse,
  getAnnotationMsgFromResponse,
} from '@colony/colony-event-metadata-parser';

import Heading from '~core/Heading';
import CalloutCard from '~core/CalloutCard';
import Link from '~core/Link';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { useDataFetcher } from '~utils/hooks';
import { Colony, AnyUser } from '~data/index';
import { DecisionDetails } from '~types/index';
import TimeRelative from '~core/TimeRelative';
import Tag, { Appearance as TagAppearance } from '~core/Tag';
import { MotionState, MOTION_TAG_MAP } from '~utils/colonyMotions';

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
  hash: string;
  createdAt: number;
  isObjection?: boolean;
}
// @NOTE For a Decision motions, the annotation stores the decision details.
const ActionPageDecisionWithIPFS = ({
  colony,
  user,
  hash,
  createdAt,
  isObjection = false,
}: Props) => {
  const {
    profile: { username, walletAddress },
  } = user;

  const { data: ipfsDataJSON } = useDataFetcher(
    ipfsDataFetcher,
    [hash],
    [hash],
  );

  const decisionDetails: DecisionDetails | undefined = useMemo(() => {
    if (!ipfsDataJSON) {
      return undefined;
    }
    // @NOTE: Decision objection message is stored in the `annotationMessage` field
    if (isObjection) {
      const objectionMessage = getAnnotationMsgFromResponse(ipfsDataJSON);
      return {
        description: objectionMessage,
      } as DecisionDetails;
    }

    const details: DecisionDetails = getDecisionDetailsFromResponse(
      ipfsDataJSON,
    ) as DecisionDetails;
    return details;
  }, [ipfsDataJSON, isObjection]);

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
    <>
      <div
        className={
          isObjection
            ? styles.objectionContentContainer
            : styles.contentContainer
        }
      >
        <div className={styles.leftContent}>
          <div className={styles.header}>
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

            <div className={styles.nameAndTime}>
              <span className={styles.userName}>{`@${username}`}</span>
              <span className={styles.time}>
                <TimeRelative value={new Date(createdAt)} />
              </span>
            </div>

            {isObjection && (
              <div className={styles.tag}>
                <Tag
                  text={MOTION_TAG_MAP[MotionState.Objection].name}
                  appearance={{
                    theme: MOTION_TAG_MAP[MotionState.Objection]
                      .theme as TagAppearance['theme'],
                    colorSchema: MOTION_TAG_MAP[MotionState.Objection]
                      .colorSchema as TagAppearance['colorSchema'],
                  }}
                />
              </div>
            )}
          </div>
          {!isObjection && (
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
            </div>
          )}
          {parse(decisionDetails?.description)}
        </div>
      </div>
      {isObjection && <hr className={styles.divider} />}
    </>
  );
};

ActionPageDecisionWithIPFS.displayName = displayName;

export default ActionPageDecisionWithIPFS;
