import React, { MouseEventHandler, useCallback } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import Icon from '~core/Icon';

import styles from './CreateDomainButton.css';

const MSG = defineMessages({
  buttonCreateNewDomain: {
    id: 'dashboard.DomainDropdown.CreateDomainButton.buttonCreateNewDomain',
    defaultMessage: 'Create new domain',
  },
});

const displayName = 'dashboard.DomainDropdown.CreateDomainButton';

const CreateDomainButton = () => {
  const { formatMessage } = useIntl();
  const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (evt) => {
      evt.stopPropagation();
      alert('Open UAC');
    },
    [],
  );

  const text = formatMessage(MSG.buttonCreateNewDomain);

  return (
    <button className={styles.main} onClick={handleClick} type="button">
      <div className={`${styles.buttonPartIcon} ${styles.buttonPart}`}>
        <Icon name="circle-plus" title={text} />
      </div>
      <div className={styles.buttonPart}>{text}</div>
    </button>
  );
};

CreateDomainButton.displayName = displayName;

export default CreateDomainButton;
