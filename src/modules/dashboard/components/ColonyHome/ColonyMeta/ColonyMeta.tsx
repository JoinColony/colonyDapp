import React from 'react';
import { defineMessages } from 'react-intl';

import { stripProtocol, multiLineTextEllipsis } from '~utils/strings';
import { ColonyType } from '~immutable/index';
import ExpandedParagraph from '~core/ExpandedParagraph';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Link from '~core/Link';
import ExternalLink from '~core/ExternalLink';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';
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
});

const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });

interface Props {
  colony: ColonyType;
  canAdminister: boolean;
}

const ColonyMeta = ({
  colony: {
    colonyAddress,
    description,
    colonyName,
    guideline,
    displayName,
    website,
  },
  colony,
  canAdminister,
}: Props) => {
  const renderExpandedElements = (
    <>
      {website && (
        <ExternalLink
          className={styles.simpleLinkWebsite}
          href={website}
          text={stripProtocol(website)}
        />
      )}
      {guideline && (
        <ExternalLink
          className={styles.simpleLinkGuideline}
          href={guideline}
          text={stripProtocol(guideline)}
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
          <>
            <span title={displayName}>
              {/*
               * @NOTE We need to use a JS string truncate here, rather then CSS as we do with the other fields,
               * since we also have to show the settings icon, after the truncated name, otherwise the icon
               * will be hidden with the rest of the text
               *
               * To fix this properly (ie: without JS), we'll need a re-design
               */
              multiLineTextEllipsis(displayName, 65)}
            </span>
            {canAdminister && (
              <Link
                className={styles.editColony}
                to={`/colony/${colonyName}/admin`}
              >
                <Icon name="settings" title={MSG.editColonyTitle} />
              </Link>
            )}
          </>
        </Heading>
      </section>
      {description && (
        <section className={styles.description}>
          <ExpandedParagraph
            characterLimit={88}
            maximumCharacters={180}
            paragraph={description}
            expandedElements={renderExpandedElements}
          />
        </section>
      )}
    </div>
  );
};

ColonyMeta.displayName = 'dashboard.ColonyHome.ColonyMeta';

export default ColonyMeta;
