import React from 'react';
import { FormikProps } from 'formik';

import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { Address } from '~types/index';

// import { Colony } from '~data/index';
import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';

import { Safe } from './types';
import DialogForm from './RemoveSafeDialogForm';

const displayName = 'dashboard.RemoveSafeDialog';

// Mock data for testing
const safes: Safe[] = [
  {
    name: 'All Saints',
    chain: `Gnosis Chain`,
    address: '0x3a157280ca91bB49dAe3D1619C55Da7F9D4438c2',
  },
  // {
  //   name: '',
  //   chain: `Mainnet`
  //   address: '0x4a157280ca91bB49dAe3D1619C55Da7F9D4438c3',
  // },
  // {
  //   name: 'Big safe',
  //  chain: `Mainnet`
  //   address: '0x5a157280ca91bB49dAe3D1619C55Da7F9D4438c2',
  // },
  // {
  //   name: `Just a test with a very very long name,
  //   hang on its even longer!!!!!!!!`,
  //  chain: `Mainnet`
  //   address: '0x6a157280ca91bB49dAe3D1619C55Da7F9D4438c3',
  // },
  // {
  //   name: 'blalabalabal',
  //  chain: `Mainnet`
  //   address: '0x7a157280ca91bB49dAe3D1619C55Da7F9D4438c2',
  // },
  // {
  //   name: 'final test',
  //   chain: `Mainnet`
  //   address: '0x8a157280ca91bB49dAe3D1619C55Da7F9D4438c3',
  // },
];

export interface FormValues {
  safeList: Address[];
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  Omit<ActionDialogProps, 'isVotingExtensionEnabled'>;

const RemoveSafeDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony,
}: Props) => {
  return (
    <ActionForm
      initialValues={{
        // if there's only 1 safe then that safe is already checked.
        safeList: safes.length === 1 ? [safes[0].address] : [],
      }}
      // @TODO need to update action, in another PR
      submit={ActionTypes.COLONY_ACTION_GENERIC}
      error={ActionTypes.COLONY_ACTION_GENERIC_ERROR}
      success={ActionTypes.COLONY_ACTION_GENERIC_SUCCESS}
      onSuccess={close}
    >
      {(formValues: FormikProps<FormValues>) => {
        return (
          <Dialog cancel={cancel}>
            <DialogForm
              {...formValues}
              colony={colony}
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
              safeList={safes}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

RemoveSafeDialog.displayName = displayName;

export default RemoveSafeDialog;
