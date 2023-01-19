import { useFormikContext, setNestedObjectValues, FormikTouched } from 'formik';
import { isEmpty } from 'lodash';
import React, { useCallback } from 'react';
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
  handleEditCancel?: () => void;
}

const EditButtons = ({ handleEditCancel, handleEditSubmit }: Props) => {
  const { errors, touched, setTouched } = useFormikContext<ValuesType>() || {};
  const handleSubmit = useCallback(() => {
    setTouched(setNestedObjectValues<FormikTouched<ValuesType>>(errors, true));
    handleEditSubmit();
  }, [errors, handleEditSubmit, setTouched]);

  return (
    <div className={styles.wrapper}>
      {handleEditCancel && (
        <Button appearance={{ theme: 'secondary' }} onClick={handleEditCancel}>
          <FormattedMessage {...MSG.cancel} />
        </Button>
      )}
      <Button
        onClick={handleSubmit}
        disabled={!isEmpty(errors) && !isEmpty(touched)}
      >
        <FormattedMessage {...MSG.update} />
      </Button>
    </div>
  );
};

EditButtons.displayName = displayName;

export default EditButtons;
