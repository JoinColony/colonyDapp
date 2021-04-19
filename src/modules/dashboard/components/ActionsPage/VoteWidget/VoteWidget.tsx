import React, { useCallback, useEffect, useState, RefObject } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';

import Button from '~core/Button';
import { ActionForm, TextareaAutoresize, InputStatus } from '~core/Fields';
import { MiniSpinnerLoader } from '~core/Preloaders';
import Heading from '~core/Heading';

import {
  Colony,
  useGetRecoveryStorageSlotLazyQuery,
  useLoggedInUser,
} from '~data/index';
import { ActionTypes } from '~redux/index';
import { ensureHexPrefix } from '~utils/strings';
import { ENTER, SPACE, ColonyMotions, ColonyActions } from '~types/index';
import { mapPayload } from '~utils/actions';
import { useTransformer } from '~utils/hooks';
import { getAllUserRoles } from '../../../../transformers';
import { userHasRole } from '../../../../users/checks';

import styles from './VoteWidget.css';

export interface FormValues {}

interface Props {
  colony: Colony;
  actionType: string;
}

const MSG = defineMessages({
  /*
   * @NOTE I didn't want to create a mapping for this, since they will only
   * be used in this instance
   *
   * If by chance we end up having to use this mapping elsewhere, feel free
   * to create it's own map
   */
  title: {
    id: 'dashboard.ActionsPage.VoteWidget.title',
    defaultMessage: `Should "{actionType, select,
      ${ColonyMotions.MintTokensMotion} {Mint tokens}
      other {Generic Action}
    }" be approved?`,
  },
});

const validationSchema = yup.object().shape({
  storageSlotLocation: yup.string().max(66).hexString(),
  newStorageSlotValue: yup.string().max(66).hexString(),
});

const VoteWidget = ({ colony: { colonyAddress }, colony, actionType }: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  // const transform = useCallback(
  //   mapPayload(({ storageSlotLocation, newStorageSlotValue }) => ({
  //     colonyAddress,
  //     walletAddress,
  //     startBlock,
  //     storageSlotLocation,
  //     storageSlotValue: newStorageSlotValue,
  //   })),
  //   [],
  // );

  const hasRegisteredProfile = !!username && !ethereal;

  return (
    <ActionForm
      initialValues={{}}
      validationSchema={validationSchema}
      submit={ActionTypes.COLONY_ACTION_GENERIC}
      error={ActionTypes.COLONY_ACTION_GENERIC_ERROR}
      success={ActionTypes.COLONY_ACTION_GENERIC_SUCCESS}
      // transform={transform}
    >
      {({ handleSubmit, isSubmitting, isValid }: FormikProps<FormValues>) => (
        <div className={styles.main}>
          <Heading
            text={MSG.title}
            textValues={{ actionType }}
            appearance={{ size: 'normal', theme: 'dark', margin: 'none' }}
          />
        </div>
      )}
    </ActionForm>
  );
};

VoteWidget.displayName = 'dashboard.ActionsPage.VoteWidget';

export default VoteWidget;
