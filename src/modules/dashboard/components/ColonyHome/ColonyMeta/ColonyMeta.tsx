import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { stripProtocol, multiLineTextEllipsis } from '~utils/strings';
import ExpandedParagraph from '~core/ExpandedParagraph';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Button from '~core/Button';
import Link from '~core/Link';
import ExternalLink from '~core/ExternalLink';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';
import ColonySubscribe from './ColonySubscribe';
import { useDataFetcher } from '~utils/hooks';
import { domainsFetcher } from '../../../fetchers';

import { ColonyType, DomainType } from '~immutable/index';

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
  setFilteredDomainId: Function;
  filteredDomainId: number;
}

const getActiveDomainFilterClass = (id = 0, filteredDomainId: number) =>
  filteredDomainId === id ? styles.filterItemActive : styles.filterItem;

const ColonyMeta = ({
  colony: {
    colonyAddress,
    description,
    colonyName,
    guideline,
    displayName,
    website,
  },
  setFilteredDomainId,
  filteredDomainId,
  colony,
  canAdminister,
}: Props) => {
  // eslint-disable-next-line prettier/prettier
  const { data: domains } = useDataFetcher<DomainType[]>(
    domainsFetcher,
    [colonyAddress],
    [colonyAddress],
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
      <section className={styles.colonyAvatarAndName}>
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
      </section>
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
      <div className={styles.domainContainer}>
        <ul>
          <li>
            <Button
              className={getActiveDomainFilterClass(0, filteredDomainId)}
              onClick={() => setFilteredDomainId(0)}
            >
              <FormattedMessage id="domain.root" />
            </Button>
          </li>
          {(domains || []).map(({ name, id }) => (
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
      </div>
    </div>
  );
};

ColonyMeta.displayName = 'dashboard.ColonyHome.ColonyMeta';

export default ColonyMeta;
