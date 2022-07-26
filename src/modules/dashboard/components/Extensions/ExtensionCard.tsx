import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useParams } from 'react-router';
import Card from '~core/Card';
import Icon from '~core/Icon';
import Heading from '~core/Heading';

import styles from './ExtensionCard.css';

import { ExtensionData } from '~data/staticData/extensionData';
import { ColonyExtension } from '~data/index';
import Link from '~core/Link';
import ExtensionStatus from './ExtensionStatus';

interface Props {
  extension: ExtensionData;
  installedExtension?: ColonyExtension;
  dataTest?: string;
}

const ExtensionCard = ({ extension, installedExtension, dataTest }: Props) => {
  const { colonyName } = useParams<{
    colonyName: string;
  }>();
  return (
    <div className={styles.main}>
      <Link
        to={`/colony/${colonyName}/extensions/${extension.extensionId}`}
        data-test={dataTest}
      >
        <Card className={styles.card}>
          <div className={styles.header}>
            <div className={styles.headerIcon}>
              <Icon
                name="colony-logo"
                title={extension.name}
                appearance={{ size: 'small' }}
              />
            </div>
            <div>
              <Heading
                tagName="h4"
                appearance={{ size: 'normal', margin: 'none', theme: 'dark' }}
                text={extension.name}
              />
              <span className={styles.version}>
                v{extension.currentVersion}
              </span>
            </div>
          </div>
          <div className={styles.cardDescription}>
            {typeof extension.descriptionShort === 'object' ? (
              <FormattedMessage {...extension.descriptionShort} />
            ) : (
              extension.descriptionShort
            )}
          </div>
          {installedExtension ? (
            <div className={styles.status}>
              <ExtensionStatus installedExtension={installedExtension} />
            </div>
          ) : null}
        </Card>
      </Link>
    </div>
  );
};

export default ExtensionCard;
