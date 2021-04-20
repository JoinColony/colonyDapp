import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { ActionForm } from '~core/Fields';
import Heading from '~core/Heading';

import { Colony, useLoggedInUser } from '~data/index';
import { ActionTypes } from '~redux/index';
import { ColonyMotions } from '~types/index';
import { mapPayload } from '~utils/actions';

import styles from './FinalizeMotionWidget.css';

interface Props {
  colony: Colony;
  motionId: number;
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
    id: 'dashboard.ActionsPage.FinalizeMotionWidget.title',
    defaultMessage: `Should "{actionType, select,
      ${ColonyMotions.MintTokensMotion} {Mint tokens}
      other {Generic Action}
    }" be approved?`,
  },
});

const FinalizeMotionWidget = ({
  colony: { colonyAddress },
  colony,
  motionId,
  actionType,
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const transform = useCallback(
    mapPayload(({}) => ({
      colonyAddress,
      walletAddress,
    })),
    [],
  );

  const hasRegisteredProfile = !!username && !ethereal;

  return (
    <ActionForm
      initialValues={{}}
      submit={ActionTypes.COLONY_ACTION_GENERIC}
      error={ActionTypes.COLONY_ACTION_GENERIC_ERROR}
      success={ActionTypes.COLONY_ACTION_GENERIC_SUCCESS}
      transform={transform}
    >
      {({ handleSubmit, isSubmitting }: FormikProps<{}>) => (
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

FinalizeMotionWidget.displayName = 'dashboard.ActionsPage.FinalizeMotionWidget';

export default FinalizeMotionWidget;
