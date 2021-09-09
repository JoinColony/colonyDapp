import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';

import Heading from '~core/Heading';
import { UserReputationForTopDomainsQuery } from '~data/generated';
import { Colony } from '~data/index';
import { ZeroValue } from '~utils/reputation';

import styles from './MemberInfoPopover.css';
import Icon from '~core/Icon';
import Numeral from '~core/Numeral';

const displayName = `InfoPopover.MemberInfoPopover.UserReputation`;

interface Props {
  colony: Colony;
  // eslint-disable-next-line max-len
  userReputationForTopDomains: UserReputationForTopDomainsQuery['userReputationForTopDomains'];
}

const MSG = defineMessages({
  labelText: {
    id: 'InfoPopover.MemberInfoPopover.UserReputation.labelText',
    defaultMessage: 'Reputation',
  },
  noReputationDescription: {
    id: 'InfoPopover.MemberInfoPopover.UserReputation.descriptionReputation',
    defaultMessage: `This user doesn’t have any reputation now.\nTo earn reputation they need to contribute to the colony.`,
  },
  starReputationTitle: {
    id: 'InfoPopover.MemberInfoPopover.UserReputation.starReputationTitle',
    defaultMessage: `User reputation on {domainName}: {reputation}%`,
  },
});

const UserReputation = ({ colony, userReputationForTopDomains }: Props) => {
  const formattedUserReputations = userReputationForTopDomains.map(
    ({ domainId, ...rest }) => {
      const reputationDomain = colony.domains.find(
        (domain) => domain.ethDomainId === domainId,
      );
      return {
        ...rest,
        reputationDomain,
      };
    },
  );

  return (
    <div
      className={classnames(styles.sectionContainer, {
        [styles.noReputationContainer]: isEmpty(formattedUserReputations),
      })}
    >
      <Heading
        appearance={{
          size: 'normal',
          margin: 'none',
          theme: 'grey',
          weight: 'bold',
        }}
        text={MSG.labelText}
      />
      {isEmpty(formattedUserReputations) ? (
        <p className={styles.noReputationDescription}>
          <FormattedMessage {...MSG.noReputationDescription} />
        </p>
      ) : (
        <ul>
          {formattedUserReputations.map(
            ({ reputationDomain, reputationPercentage }) => (
              <li
                key={`${reputationDomain?.name}-${reputationPercentage}`}
                className={styles.domainReputationItem}
              >
                <p className={styles.domainName}>{reputationDomain?.name}</p>
                <div className={styles.reputationContainer}>
                  {reputationPercentage === ZeroValue.NearZero && (
                    <div className={styles.reputation}>
                      {reputationPercentage}
                    </div>
                  )}
                  {reputationPercentage !== ZeroValue.NearZero && (
                    <Numeral
                      className={styles.reputation}
                      appearance={{ theme: 'primary' }}
                      value={reputationPercentage}
                      suffix="%"
                    />
                  )}
                  <Icon
                    name="star"
                    appearance={{ size: 'extraTiny' }}
                    className={styles.icon}
                    title={MSG.starReputationTitle}
                    titleValues={{
                      reputation: reputationPercentage,
                      domainName: reputationDomain?.name,
                    }}
                  />
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
};

UserReputation.displayName = displayName;

export default UserReputation;
