import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { FormikProps } from 'formik';

import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import Heading from '~core/Heading';

import { ActionDialogProps } from '~core/Dialog';
import { ColonySafe, useLoggedInUser } from '~data/index';
import { useTransformer } from '~utils/hooks';
import { getAllUserRoles } from '~modules/transformers';
import { canEnterRecoveryMode } from '~modules/users/checks';

import SafeListItem from './SafeListItem';
import { FormValues } from './RemoveSafeDialog';

import styles from './RemoveSafeDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.RemoveSafeDialog.RemoveSafeDialogForm.title',
    defaultMessage: 'Remove Safe',
  },
  desc: {
    id: 'dashboard.RemoveSafeDialog.RemoveSafeDialogForm.desc',
    defaultMessage: 'Select the Safe(s) you wish to remove',
  },
  emptySafeMsg: {
    id: 'dashboard.RemoveSafeDialog.RemoveSafeDialogForm.emptySafeMsg',
    defaultMessage: 'No Safes found to remove.',
  },
});

interface Props extends Omit<ActionDialogProps, 'isVotingExtensionEnabled'> {
  safeList: ColonySafe[];
}

const RemoveSafeDialogForm = ({
  back,
  colony,
  handleSubmit,
  isSubmitting,
  values,
  safeList,
}: Props & FormikProps<FormValues>) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);
  const hasRegisteredProfile = !!username && !ethereal;
  const userHasPermission =
    hasRegisteredProfile && canEnterRecoveryMode(allUserRoles);

  return (
    <>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={MSG.title}
          className={styles.title}
        />
      </DialogSection>
      {!safeList.length ? (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.emptySafeList}>
            <FormattedMessage {...MSG.emptySafeMsg} />
          </div>
        </DialogSection>
      ) : (
        <div>
          <DialogSection appearance={{ theme: 'sidePadding' }}>
            <div className={styles.description}>
              <FormattedMessage {...MSG.desc} />
            </div>
          </DialogSection>
          <DialogSection appearance={{ theme: 'sidePadding' }}>
            <div className={styles.content}>
              {safeList.map((item) => (
                <SafeListItem
                  key={`${item.chainId}-${item.contractAddress}`}
                  safe={item}
                  isChecked={
                    !!values?.safeList?.find(
                      (safe) =>
                        item.contractAddress === safe.contractAddress &&
                        item.chainId === safe.chainId,
                    )
                  }
                />
              ))}
            </div>
          </DialogSection>
        </div>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'pink', size: 'large' }}
          text={{ id: 'button.confirm' }}
          onClick={() => handleSubmit()}
          loading={isSubmitting}
          disabled={
            !userHasPermission || isSubmitting || !values?.safeList.length
          }
          data-test="removeSafeConfirmButton"
        />
      </DialogSection>
    </>
  );
};

export default RemoveSafeDialogForm;
