import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import sortBy from 'lodash/sortBy';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import Button from '~core/Button';
import CopyableAddress from '~core/CopyableAddress';
import ExpandedParagraph from '~core/ExpandedParagraph';
import ExternalLink from '~core/ExternalLink';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Link from '~core/Link';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';
import { Colony } from '~data/index';
import { multiLineTextEllipsis, stripProtocol } from '~utils/strings';

import ColonyInvite from './ColonyInvite';
import ColonyPrograms from './ColonyPrograms';
import ColonySubscribe from './ColonySubscribe';

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
  headlineColonyAddress: {
    id: 'dashboard.ColonyHome.ColonyMeta.headlineColonyAddress',
    defaultMessage: 'Colony Address',
  },
  headlineWebsite: {
    id: 'dashboard.ColonyHome.ColonyMeta.headlineWebsite',
    defaultMessage: 'Website',
  },
  headlineGuidelines: {
    id: 'dashboard.ColonyHome.ColonyMeta.headlineGuidelines',
    defaultMessage: 'Contribution Guidelines',
  },
});

const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });

interface Props {
  colony: Colony;
  canAdminister: boolean;
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
    domains,
    colonyName,
    guideline = '',
    displayName,
    website = '',
  },
  filteredDomainId,
  colony,
  canAdminister,
}: Props) => {
  const sortedDomains = sortBy(domains, 'name');

  const renderExpandedElements = (
    <>
      {website && (
        <div className={styles.headline}>
          <FormattedMessage {...MSG.headlineWebsite} tagName="p" />
          <ExternalLink
            className={styles.headlineLink}
            href={website}
            text={stripProtocol(multiLineTextEllipsis(website, 30))}
          />
        </div>
      )}
      {guideline && (
        <div className={styles.headline}>
          <FormattedMessage {...MSG.headlineGuidelines} tagName="p" />
          <ExternalLink
            className={styles.headlineLink}
            href={guideline}
            text={stripProtocol(multiLineTextEllipsis(guideline, 30))}
          />
        </div>
      )}
      <div className={styles.headline}>
        <FormattedMessage {...MSG.headlineColonyAddress} tagName="p" />
        <CopyableAddress>{colonyAddress}</CopyableAddress>
      </div>
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
            <span title={displayName || colonyName}>
              {
                /*
                 * @NOTE We need to use a JS string truncate here, rather then CSS as we do with the other fields,
                 * since we also have to show the settings icon, after the truncated name, otherwise the icon
                 * will be hidden with the rest of the text
                 *
                 * To fix this properly (ie: without JS), we'll need a re-design
                 */
                multiLineTextEllipsis(displayName || colonyName, 16)
              }
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
      {!description && (
        <section className={styles.headlineContainer}>
          {renderExpandedElements}
        </section>
      )}
      <ColonyPrograms
        canAdminister={canAdminister}
        colonyAddress={colonyAddress}
        colonyName={colonyName}
      />
      <section className={styles.domainContainer}>
        <ul>
          <li className={styles.domainFilterItem}>
            <Button
              className={getActiveDomainFilterClass(
                COLONY_TOTAL_BALANCE_DOMAIN_ID,
                filteredDomainId,
              )}
              linkTo={`/colony/${colonyName}`}
              text={{ id: 'domain.all' }}
            />
          </li>
          {sortedDomains.map(({ name, ethDomainId }) => (
            <li
              className={styles.domainFilterItem}
              key={`domain_${ethDomainId}`}
              title={name}
            >
              <Button
                className={getActiveDomainFilterClass(
                  ethDomainId,
                  filteredDomainId,
                )}
                linkTo={`/colony/${colonyName}?domainFilter=${ethDomainId}`}
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
