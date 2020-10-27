import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'redux-react-hook';
import * as yup from 'yup';

import { TransactionType } from '~immutable/index';
import { getMainClasses } from '~utils/css';
import { withId } from '~utils/actions';
import { ActionTypes } from '~redux/index';
import { IconButton } from '~core/Button';
import { ActionForm } from '~core/Fields';

import {
  transactionEstimateGas,
  transactionSend,
} from '../../../../core/actionCreators';

import styles from './GasStationControls.css';

interface Props {
  transaction: TransactionType;
}

type FormValues = {
  id: string;
};

const validationSchema = yup.object().shape({
  transactionId: yup.string(),
});

const displayName = 'users.GasStation.GasStationPrice';

const GasStationPrice = ({ transaction: { id, error } }: Props) => {
  const dispatch = useDispatch();
  const transform = useCallback(withId(id), [id]);

  useEffect(() => {
    dispatch(transactionEstimateGas(id));
  }, [dispatch, id]);

  /*
   * @NOTE Automatically send the transaction
   * Since we're just using Metamask, we won't wait for the user to click the "Confirm"
   * button anymore, we just dispatch the action to send the transaction, and the user
   * will deal with _confirm-ing_ the action using Metamask's interface.
   *
   * The only time we actually show controls, is when the transaction has failed, and
   * we need to retry it.
   */
  useEffect(() => {
    if (!error) {
      dispatch(transactionSend(id));
    }
  }, [dispatch, id, error]);

  const initialFormValues: FormValues = { id };

  return (
    <div className={getMainClasses({}, styles)}>
      <ActionForm
        submit={ActionTypes.TRANSACTION_RETRY}
        success={ActionTypes.TRANSACTION_SENT}
        error={ActionTypes.TRANSACTION_ERROR}
        validationSchema={validationSchema}
        initialValues={initialFormValues}
        transform={transform}
      >
        {error && (
          <div className={styles.controls}>
            <IconButton type="submit" text={{ id: 'button.retry' }} />
          </div>
        )}
      </ActionForm>
    </div>
  );
};

GasStationPrice.displayName = displayName;

export default GasStationPrice;
