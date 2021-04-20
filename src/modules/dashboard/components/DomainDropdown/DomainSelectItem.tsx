import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import React, {
  KeyboardEventHandler,
  MouseEventHandler,
  useCallback,
} from 'react';
import classnames from 'classnames';

import Button from '~core/Button';
import ColorTag, { Color } from '~core/ColorTag';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Paragraph from '~core/Paragraph';
import EditDomainDialog from '~dashboard/EditDomainDialog';
import { useDialog } from '~core/Dialog';
import { OneDomain, Colony } from '~data/index';
import { ENTER } from '~types/index';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';

import { ALLDOMAINS_DOMAIN_SELECTION } from '~constants';

import styles from './DomainSelectItem.css';

interface Props {
  domain: OneDomain | typeof ALLDOMAINS_DOMAIN_SELECTION;
  colony: Colony;
  isSelected: boolean;
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
  colony,
  isSelected,
}: Props) => {
  const { isVotingExtensionEnabled } = useEnabledExtensions({
    colonyAddress: colony.colonyAddress,
  });

  const openEditDialog = useDialog(EditDomainDialog);
  const handleEditDomain = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (evt) => {
      evt.stopPropagation();
      if (colony) {
        openEditDialog({
          selectedDomainId: ethDomainId.toString(),
          colony,
          isVotingExtensionEnabled,
        });
      }
    },
    [openEditDialog, colony, ethDomainId, isVotingExtensionEnabled],
  );

  const handleEditDomainKeyDown = useCallback<
    KeyboardEventHandler<HTMLButtonElement>
  >(
    (evt) => {
      if (evt.key === ENTER) {
        evt.stopPropagation();
        if (colony) {
          openEditDialog({
            selectedDomainId: ethDomainId.toString(),
            colony,
            isVotingExtensionEnabled,
          });
        }
      }
    },
    [openEditDialog, colony, ethDomainId, isVotingExtensionEnabled],
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
        {ethDomainId !== 0 && ethDomainId !== ROOT_DOMAIN_ID && (
          // Hide for `All Domains` option
          <div className={styles.editButton}>
            <Button
              appearance={{ theme: 'blue' }}
              onClick={handleEditDomain}
              onKeyDown={handleEditDomainKeyDown}
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
