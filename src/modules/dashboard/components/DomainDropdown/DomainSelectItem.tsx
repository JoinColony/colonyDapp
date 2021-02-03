import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import React, {
  KeyboardEventHandler,
  MouseEventHandler,
  useCallback,
} from 'react';

import Button from '~core/Button';
import ColorTag, { Color } from '~core/ColorTag';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Paragraph from '~core/Paragraph';
import { OneDomain } from '~data/index';
import { ENTER } from '~types/index';

import { ALLDOMAINS_DOMAIN_SELECTION } from '~constants';

import styles from './DomainSelectItem.css';

interface Props {
  domain: OneDomain | typeof ALLDOMAINS_DOMAIN_SELECTION;
}

const displayName = 'dashboard.DomainDropdown.DomainSelectItem';

const DomainSelectItem = ({
  domain: {
    color = Color.LightPink,
    description,
    ethDomainId,
    ethParentDomainId,
    name,
  },
}: Props) => {
  const openUAC = useCallback(() => {
    /*
     * @fixme open UAC here
     */
    // eslint-disable-next-line no-alert
    alert('Open UAC');
  }, []);

  const handleEditClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (evt) => {
      evt.stopPropagation();
      openUAC();
    },
    [openUAC],
  );
  const handleEditKeyDown = useCallback<
    KeyboardEventHandler<HTMLButtonElement>
  >(
    (evt) => {
      if (evt.key === ENTER) {
        evt.stopPropagation();
        openUAC();
      }
    },
    [openUAC],
  );
  return (
    <div className={styles.main}>
      {typeof ethParentDomainId === 'number' && (
        <div className={styles.childDomainIcon}>
          <Icon
            appearance={{ size: 'small' }}
            name="return-arrow"
            title="Child Domain"
          />
        </div>
      )}
      <div className={styles.mainContent}>
        <div className={styles.title}>
          <div className={styles.color}>
            {/*
             * @TODO fallback color won't be needed after graphql
             * typedef updated to reflect guaranteed color value
             */}
            <ColorTag color={color || Color.LightPink} />
          </div>
          <div className={styles.headingWrapper}>
            <Heading
              appearance={{ margin: 'none', size: 'normal', theme: 'dark' }}
              text={name}
            />
          </div>
          {ethDomainId === ROOT_DOMAIN_ID && (
            <div className={styles.rootText}>(Root)</div>
          )}
        </div>
        {description && (
          <Paragraph className={styles.description} title={description}>
            {description}
          </Paragraph>
        )}
      </div>
      <div className={styles.editButtonCol}>
        {ethDomainId !== 0 && (
          // Hide for `All Domains` option
          <div className={styles.editButton}>
            <Button
              appearance={{ theme: 'blue' }}
              onClick={handleEditClick}
              onKeyDown={handleEditKeyDown}
              tabIndex={0}
              text={{ id: 'button.edit' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

DomainSelectItem.displayName = displayName;

export default DomainSelectItem;
