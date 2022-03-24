import React, { useCallback, useState } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';

import Dialog, { DialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { Colony, useVerifiedUsersQuery } from '~data/index';
import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';
import {
  mergeSchemas,
  validationSchemaInput,
  validationSchemaFile,
} from '~utils/whitelistValidation';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { Address } from '~types/index';

import DialogForm from './ManageWhitelistDialogForm';

export interface FormValues {
  annotation: string;
  isWhiletlistActivated: boolean;
  whitelistedAddresses: Address[];
}

interface CustomWizardDialogProps {
  prevStep: string;
  colony: Colony;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const displayName = 'dashboard.ManageWhitelistDialog';

const ManageWhitelistDialog = ({
  cancel,
  callStep,
  prevStep,
  colony,
  colony: { colonyAddress, avatarHash },
}: Props) => {
  const [showInput, setShowInput] = useState<boolean>(true);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  const handleToggleShowInput = useCallback(() => {
    setShowInput((state) => !state);
    // clear success msgs when switching inputs
    setFormSuccess(false);
  }, [setShowInput, setFormSuccess]);

  const history = useHistory();
  const { data } = useVerifiedUsersQuery({
    variables: {
      verifiedAddresses: colony.whitelistedAddresses,
    },
  });

  const validationSchema = yup.object().shape({
    annotation: yup.string().max(4000),
  });

  const mergedSchemas = mergeSchemas(
    validationSchema,
    showInput ? validationSchemaInput : validationSchemaFile,
  );

  const transform = useCallback(
    pipe(
      mapPayload(
        ({
          annotation: annotationMessage,
          whitelistAddress,
          whitelistCSVUploader,
        }) => {
          return {
            colonyAddress,
            colonyDisplayName: colony.displayName,
            colonyAvatarHash: avatarHash,
            verifiedAddresses:
              whitelistAddress !== undefined
                ? [whitelistAddress]
                : whitelistCSVUploader[0].parsedData,
            annotationMessage,
          };
        },
      ),
      withMeta({ history }),
    ),
    [],
  );

  return (
    <ActionForm
      validateOnChange
      initialValues={{
        annotation: undefined,
        isWhiletlistActivated: true,
        whitelistedAddresses: data?.verifiedUsers.map(
          (user) => user?.profile.walletAddress,
        ),
        isSubmitting: false,
      }}
      submit={ActionTypes.COLONY_VERIFIED_RECIPIENTS_MANAGE}
      error={ActionTypes.COLONY_VERIFIED_RECIPIENTS_MANAGE_ERROR}
      success={ActionTypes.COLONY_VERIFIED_RECIPIENTS_MANAGE_SUCCESS}
      validationSchema={mergedSchemas}
      transform={transform}
      onSuccess={() => setFormSuccess(true)}
    >
      {(formValues: FormikProps<FormValues>) => (
        <Dialog cancel={cancel} noOverflow={false}>
          <DialogForm
            {...formValues}
            colony={colony}
            whitelistedUsers={data?.verifiedUsers || []}
            back={() => callStep(prevStep)}
            showInput={showInput}
            toggleShowInput={handleToggleShowInput}
            formSuccess={formSuccess}
            setFormSuccess={setFormSuccess}
          />
        </Dialog>
      )}
    </ActionForm>
  );
};

ManageWhitelistDialog.displayName = displayName;

export default ManageWhitelistDialog;
