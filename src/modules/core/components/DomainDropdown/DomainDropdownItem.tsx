import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import React, {
  KeyboardEventHandler,
  MouseEventHandler,
  useCallback,
} from 'react';
import classnames from 'classnames';
import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '~core/Button';
import ColorTag, { Color } from '~core/ColorTag';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Paragraph from '~core/Paragraph';
import { OneDomain } from '~data/index';
import { ENTER } from '~types/index';

import {
  ALLDOMAINS_DOMAIN_SELECTION,
  COLONY_TOTAL_BALANCE_DOMAIN_ID,
} from '~constants';

import styles from './DomainDropdownItem.css';

const MSG = defineMessages({
  rootDomain: {
    id: 'DomainDropdown.DomainDropdownItem.rootDomain',
    defaultMessage: '(Root)',
  },
});

interface Props {
  /** Domain to render the entry for */
  domain: OneDomain | typeof ALLDOMAINS_DOMAIN_SELECTION;

  /** Toggle if mark the current domain with the "selected" highlight */
  isSelected: boolean;

  /** Optional method to trigger when clicking the "Edit Domain" button   */
  onDomainEdit?: (domainId: number) => any;

  /** Toggle if to show the domains descriptions text (if available) */
  showDescription?: boolean;
}

const displayName = `DomainDropdown.DomainDropdownItem`;

const DomainDropdownItem = ({
  domain: {
    color = Color.LightPink,
    description,
    ethDomainId,
    ethParentDomainId,
    name,
  },
  isSelected,
  onDomainEdit,
  showDescription = true,
}: Props) => {
  const handleEditDomain = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (evt) => {
      evt.stopPropagation();
      if (onDomainEdit) {
        onDomainEdit(ethDomainId);
      }
    },
    [onDomainEdit, ethDomainId],
  );

  const handleEditDomainKeyDown = useCallback<
    KeyboardEventHandler<HTMLButtonElement>
  >(
    (evt) => {
      if (evt.key === ENTER) {
        evt.stopPropagation();
        if (onDomainEdit) {
          onDomainEdit(ethDomainId);
        }
      }
    },
    [onDomainEdit, ethDomainId],
  );

  return (
    <div className={styles.main}>
      {typeof ethParentDomainId === 'number' && (
        <div className={styles.childDomainIcon}>
          <Icon name="return-arrow" title="Child Domain" />
        </div>
      )}
      <div className={styles.mainContent}>
        <div
          className={classnames(styles.title, {
            [styles.activeDomain]: isSelected,
          })}
        >
          <div className={styles.color}>
            <ColorTag color={color} />
          </div>
          <div
            className={styles.headingWrapper}
            data-test="domainDropdownItemName"
          >
            <Heading
              appearance={{ margin: 'none', size: 'normal', theme: 'dark' }}
              text={name}
            />
          </div>
          {ethDomainId === ROOT_DOMAIN_ID && (
            <div className={styles.rootText}>
              <FormattedMessage {...MSG.rootDomain} />
            </div>
          )}
        </div>
        {description && showDescription && (
          <Paragraph
            className={styles.description}
            title={description}
            data-test="domainDropdownItemPurpose"
          >
            {description}
          </Paragraph>
        )}
      </div>
      <div className={styles.editButtonCol}>
        {
          /*
           * Hide the edit button if:
           * - the selected domain is "All Domains"
           * - the selected domain is "Root"
           * - we haven't provider a `onDomainEdit` method
           */
          ethDomainId !== COLONY_TOTAL_BALANCE_DOMAIN_ID &&
            ethDomainId !== ROOT_DOMAIN_ID &&
            onDomainEdit && (
              <div className={styles.editButton}>
                <Button
                  appearance={{ theme: 'blue' }}
                  onClick={handleEditDomain}
                  onKeyDown={handleEditDomainKeyDown}
                  tabIndex={0}
                  text={{ id: 'button.edit' }}
                />
              </div>
            )
        }
      </div>
    </div>
  );
};

DomainDropdownItem.displayName = displayName;

export default DomainDropdownItem;
