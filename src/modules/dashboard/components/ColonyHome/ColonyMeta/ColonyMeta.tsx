import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { DomainsMapType } from '~types/index';
import { stripProtocol, multiLineTextEllipsis } from '~utils/strings';
import ExpandedParagraph from '~core/ExpandedParagraph';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Button from '~core/Button';
import Link from '~core/Link';
import ExternalLink from '~core/ExternalLink';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';
import { ColonyType } from '~immutable/index';

import ColonySubscribe from './ColonySubscribe';
import ColonyInvite from './ColonyInvite';

import styles from './ColonyMeta.css';

const MSG = defineMessages({
  addressLabel: {
    id: 'dashboard.ColonyHome.ColonyMeta.addressLabel',
    defaultMessage: 'Address',
  },
  websiteLabel: {
    id: 'dashboard.ColonyHome.ColonyMeta.websiteLabel',
    defaultMessage: 'Website',
  },
  guidelineLabel: {
    id: 'dashboard.ColonyHome.ColonyMeta.guidelineLabel',
    defaultMessage: 'Contribute Guidelines',
  },
  editColonyTitle: {
    id: 'dashboard.ColonyHome.ColonyMeta.editColonyTitle',
    defaultMessage: 'Edit Colony',
  },
});

const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });

interface Props {
  colony: ColonyType;
  canAdminister: boolean;
  domains: DomainsMapType;
  setFilteredDomainId: (domainId: number) => void;
  filteredDomainId: number;
}

const getActiveDomainFilterClass = (
  id = COLONY_TOTAL_BALANCE_DOMAIN_ID,
  filteredDomainId: number,
) => (filteredDomainId === id ? styles.filterItemActive : styles.filterItem);

const ColonyMeta = ({
  colony: {
    colonyAddress,
    description,
    colonyName,
    guideline = '',
    displayName,
    website = '',
  },
  domains,
  setFilteredDomainId,
  filteredDomainId,
  colony,
  canAdminister,
}: Props) => {
  const sortedDomains = useMemo(
    () =>
      Object.keys(domains || {})
        .sort()
        .map(id => domains[id]),
    [domains],
  );

  const renderExpandedElements = (
    <>
      {website && (
        <ExternalLink
          className={styles.simpleLinkWebsite}
          href={website}
          text={stripProtocol(multiLineTextEllipsis(website, 30))}
        />
      )}
      {guideline && (
        <ExternalLink
          className={styles.simpleLinkGuideline}
          href={guideline}
          text={stripProtocol(multiLineTextEllipsis(guideline, 30))}
        />
      )}
    </>
  );
  return (
    <div className={styles.main}>
      <div className={styles.colonyAvatarAndName}>
        <ColonyAvatar
          className={styles.avatar}
          colonyAddress={colonyAddress}
          colony={colony}
          size="s"
        />
        <ColonySubscribe colonyAddress={colonyAddress} />
        <Heading appearance={{ margin: 'none', size: 'medium', theme: 'dark' }}>
          <div className={styles.headingAndSettings}>
            <span title={displayName}>
              {/*
               * @NOTE We need to use a JS string truncate here, rather then CSS as we do with the other fields,
               * since we also have to show the settings icon, after the truncated name, otherwise the icon
               * will be hidden with the rest of the text
               *
               * To fix this properly (ie: without JS), we'll need a re-design
               */
              multiLineTextEllipsis(displayName, 16)}
            </span>
            {canAdminister && (
              <Link
                className={styles.editColony}
                to={`/colony/${colonyName}/admin`}
              >
                <Icon name="settings" title={MSG.editColonyTitle} />
              </Link>
            )}
          </div>
        </Heading>
      </div>
      {description && (
        <section className={styles.description}>
          <ExpandedParagraph
            characterLimit={85}
            maximumCharacters={180}
            paragraph={description}
            expandedElements={renderExpandedElements}
          />
        </section>
      )}
      <section className={styles.domainContainer}>
        <ul>
          <li>
            <Button
              className={getActiveDomainFilterClass(
                COLONY_TOTAL_BALANCE_DOMAIN_ID,
                filteredDomainId,
              )}
              onClick={() =>
                setFilteredDomainId(COLONY_TOTAL_BALANCE_DOMAIN_ID)
              }
            >
              <FormattedMessage id="domain.all" />
            </Button>
          </li>
          {sortedDomains.map(({ name, id }) => (
            <li key={`domain_${id}`}>
              <Button
                className={getActiveDomainFilterClass(id, filteredDomainId)}
                onClick={() => setFilteredDomainId(id)}
              >
                {name}
              </Button>
            </li>
          ))}
        </ul>
      </section>
      <ColonyInvite colonyName={colony && colony.colonyName} />
    </div>
  );
};

ColonyMeta.displayName = 'dashboard.ColonyHome.ColonyMeta';

export default ColonyMeta;
