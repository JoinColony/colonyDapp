import React from 'react';
import { defineMessages } from 'react-intl';

import { stripProtocol, multiLineTextEllipsis } from '~utils/strings';
import { useOldRoles } from '~utils/hooks';
import { ColonyType } from '~immutable/index';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Link from '~core/Link';
import { SpinnerLoader } from '~core/Preloaders';
import ExternalLink from '~core/ExternalLink';
import CopyableAddress from '~core/CopyableAddress';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';
import HookedUserAvatar from '~users/HookedUserAvatar';
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
  founderLabel: {
    id: 'dashboard.ColonyHome.ColonyMeta.founderLabel',
    defaultMessage: 'Colony Founder',
  },
  adminsLabel: {
    id: 'dashboard.ColonyHome.ColonyMeta.adminsLabel',
    defaultMessage: 'Colony Admins',
  },
  editColonyTitle: {
    id: 'dashboard.ColonyHome.ColonyMeta.editColonyTitle',
    defaultMessage: 'Edit Colony',
  },
});

const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });
const UserAvatar = HookedUserAvatar();

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
  const { data: roles } = useOldRoles(colonyAddress);
  const { admins = [], founder = undefined } = roles || {};

  return (
    <div className={styles.main}>
      <div className={styles.colonyAvatar}>
        <ColonyAvatar
          className={styles.avatar}
          colonyAddress={colonyAddress}
          colony={colony}
          size="xl"
        />
        <ColonySubscribe colonyAddress={colonyAddress} />
      </div>
      <section>
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
          <p>{description}</p>
        </section>
      )}
      <section className={styles.dynamicTextSection}>
        <Heading
          appearance={{ margin: 'none', size: 'small', theme: 'dark' }}
          text={MSG.addressLabel}
        />
        <CopyableAddress>{colonyAddress}</CopyableAddress>
      </section>
      {website && (
        <section className={styles.dynamicTextSection}>
          <Heading
            appearance={{ margin: 'none', size: 'small', theme: 'dark' }}
            text={MSG.websiteLabel}
          />
          <span className={styles.link} title={stripProtocol(website)}>
            <ExternalLink href={website} text={stripProtocol(website)} />
          </span>
        </section>
      )}
      {guideline && (
        <section className={styles.dynamicTextSection}>
          <Heading
            appearance={{ margin: 'none', size: 'small', theme: 'dark' }}
            text={MSG.guidelineLabel}
          />
          <span className={styles.link} title={stripProtocol(guideline)}>
            <ExternalLink href={guideline} text={stripProtocol(guideline)} />
          </span>
        </section>
      )}
      <section className={styles.dynamicSection}>
        <Heading
          appearance={{ margin: 'none', size: 'small', theme: 'dark' }}
          text={MSG.founderLabel}
        />
        {founder ? (
          <div className={styles.avatarWrapper}>
            <UserAvatar
              key={`founder_${founder}`}
              address={founder}
              className={styles.userAvatar}
              showInfo
            />
          </div>
        ) : (
          <div className={styles.spinnerContainer}>
            <SpinnerLoader appearance={{ size: 'large' }} />
          </div>
        )}
      </section>
      {admins && admins.length ? (
        <section className={styles.dynamicSection}>
          <Heading
            appearance={{ margin: 'none', size: 'small', theme: 'dark' }}
            text={MSG.adminsLabel}
          />
          {admins.map((adminAddress: string) => {
            if (admins && adminAddress) {
              return (
                <div className={styles.avatarWrapper}>
                  <UserAvatar
                    key={`admin_${adminAddress}`}
                    address={adminAddress}
                    className={styles.userAvatar}
                    showInfo
                  />
                </div>
              );
            }
            return (
              <div className={styles.spinnerContainer}>
                <SpinnerLoader appearance={{ size: 'large' }} />
              </div>
            );
          })}
        </section>
      ) : null}
    </div>
  );
};

ColonyMeta.displayName = 'dashboard.ColonyHome.ColonyMeta';

export default ColonyMeta;
