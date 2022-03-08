import React, { useCallback, useState } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';

import Dialog, { DialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { Colony } from '~data/index';
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
  colony: { colonyAddress },
}: Props) => {
  const [showInput, setShowInput] = useState<boolean>(true);
  const toggleShowInput = () => setShowInput(!showInput);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const toggleSubmitSuccess = () => setFormSuccess(!formSuccess);

  const history = useHistory();

  const validationSchema = yup.object().shape({
    annotation: yup.string().max(4000),
  });

  const mergedSchemas = mergeSchemas(
    validationSchema,
    showInput ? validationSchemaInput : validationSchemaFile,
  );

  const handleSubmitSuccess = useCallback(() => {
    setFormSuccess(true);
  }, [setFormSuccess]);

  const transform = useCallback(
    pipe(
      mapPayload(
        ({
          annotation: annotationMessage,
          whitelistAddress,
          whitelistCSVUploader,
        }) => {
          return {
            annotationMessage,
            userAddresses:
              whitelistAddress !== undefined
                ? [whitelistAddress]
                : whitelistCSVUploader[0].parsedData,
            colonyAddress,
            status: true,
          };
        },
      ),
      withMeta({ history }),
    ),
    [],
  );

  const whitelistedUsers = [
    {
      id: '0x9dF24e73f40b2a911Eb254A8825103723E13209C',
      profile: {
        walletAddress: '0x9dF24e73f40b2a911Eb254A8825103723E13209C',
        username: 'alicja',
      },
    },
    {
      id: '0xd6Bf4Be334A4661e12a647b62EF1510a247dd625',
      profile: {
        walletAddress: '0xd6Bf4Be334A4661e12a647b62EF1510a247dd625',
        username: 'jan',
      },
    },
  ]; // Feed with real data

  return (
    <ActionForm
      validateOnChange
      initialValues={{
        annotation: undefined,
        isWhiletlistActivated: true,
        whitelistedAddresses: whitelistedUsers.map(
          (user) => user.profile.walletAddress,
        ),
        isSubmitting: false,
      }}
      submit={ActionTypes.WHITELIST_UPDATE}
      error={ActionTypes.WHITELIST_UPDATE_ERROR}
      success={ActionTypes.WHITELIST_UPDATE_SUCCESS}
      validationSchema={mergedSchemas}
      transform={transform}
      onSuccess={handleSubmitSuccess}
    >
      {(formValues: FormikProps<FormValues>) => (
        <Dialog cancel={cancel} noOverflow={false}>
          <DialogForm
            {...formValues}
            colony={colony}
            whitelistedUsers={whitelistedUsers}
            back={() => callStep(prevStep)}
            showInput={showInput}
            toggleShowInput={toggleShowInput}
            submitSuccess={formSuccess}
            toggleSubmitSuccess={toggleSubmitSuccess}
          />
        </Dialog>
      )}
    </ActionForm>
  );
};

ManageWhitelistDialog.displayName = displayName;

export default ManageWhitelistDialog;
