import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { ValuesType } from '~pages/ExpenditurePage/types';

import styles from './EditButton.css';

const MSG = defineMessages({
  cancel: {
    id: 'dashboard.ExpenditurePage.EditButtons.cancel',
    defaultMessage: 'Cancel',
  },
  update: {
    id: 'dashboard.ExpenditurePage.EditButtons.update',
    defaultMessage: 'Update',
  },
});

const displayName = 'dashboard.ExpenditurePage.EditButtons';

interface Props {
  handleEditSubmit: () => void;
  handleEditCancel: () => void;
}

const EditButtons = ({ handleEditCancel, handleEditSubmit }: Props) => {
  const { errors } = useFormikContext<ValuesType>() || {};

  return (
    <div className={styles.wrapper}>
      <Button appearance={{ theme: 'secondary' }} onClick={handleEditCancel}>
        <FormattedMessage {...MSG.cancel} />
      </Button>
      <Button onClick={handleEditSubmit} disabled={!isEmpty(errors)}>
        <FormattedMessage {...MSG.update} />
      </Button>
    </div>
  );
};

EditButtons.displayName = displayName;

export default EditButtons;
