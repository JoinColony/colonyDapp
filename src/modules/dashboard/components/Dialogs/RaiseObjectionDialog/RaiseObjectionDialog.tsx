import React, { useCallback, RefObject } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { bigNumberify } from 'ethers/utils';
import { Decimal } from 'decimal.js';
import { useEditor } from '@tiptap/react';
import CharacterCount from '@tiptap/extension-character-count';
import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';

import Dialog from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { StakingAmounts } from '~dashboard/ActionsPage/StakingWidget';

import { useLoggedInUser, Colony } from '~data/index';
import { ActionTypes } from '~redux/index';
import { pipe, mapPayload } from '~utils/actions';
import { log } from '~utils/debug';

import DialogForm from './RaiseObjectionDialogForm';

export interface FormValues {
  amount: number;
  annotation: string;
}

interface Props extends StakingAmounts {
  colony: Colony;
  canUserStake: boolean;
  userActivatedTokens: Decimal;
  cancel: () => void;
  close: () => void;
  motionId: number;
  scrollToRef?: RefObject<HTMLInputElement>;
}

const displayName = 'dashboard.RaiseObjectionDialog';

const LIMIT = 4000;

const RaiseObjectionDialog = ({
  cancel,
  close,
  colony: { colonyAddress },
  colony,
  minUserStake,
  motionId,
  scrollToRef,
  ...props
}: Props) => {
  const { walletAddress } = useLoggedInUser();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      CharacterCount.configure({ limit: LIMIT }),
      Placeholder.configure({
        emptyEditorClass: 'is-editor-empty',
        placeholder: 'What would you like to say?',
      }),
    ],
  });

  const validationSchema = yup.object().shape({
    amount: yup.number().required(),
  });

  const transform = useCallback(
    pipe(
      mapPayload(({ amount, annotation: annotationMessage }) => {
        const { remainingToFullyNayStaked, maxUserStake } = props;
        const remainingToStake = new Decimal(remainingToFullyNayStaked);

        let finalStake;

        const stake = new Decimal(amount)
          .div(100)
          .times(remainingToStake.minus(minUserStake))
          .plus(minUserStake);

        if (amount === 100) {
          finalStake = maxUserStake;
        } else if (amount === 0 || new Decimal(minUserStake).gte(stake)) {
          finalStake = minUserStake;
        } else {
          finalStake = stake.round().toString();
        }

        log.verbose('Objection staking values: ', {
          minUserStake,
          maxUserStake,
          remainingToFullyNayStaked,
          stake: stake.toString(),
          finalStake,
        });

        return {
          amount: finalStake,
          userAddress: walletAddress,
          colonyAddress,
          motionId: bigNumberify(motionId),
          vote: 0,
          annotationMessage,
        };
      }),
    ),
    [walletAddress, colonyAddress, motionId],
  );

  const handleSuccess = useCallback(
    (_, { setFieldValue, resetForm }) => {
      resetForm({});
      setFieldValue('amount', 0);
      scrollToRef?.current?.scrollIntoView({ behavior: 'smooth' });
      close();
    },
    [scrollToRef, close],
  );

  return (
    <ActionForm
      initialValues={{
        amount: 0,
        annotation: undefined,
      }}
      submit={ActionTypes.MOTION_STAKE}
      error={ActionTypes.MOTION_STAKE_ERROR}
      success={ActionTypes.MOTION_STAKE_SUCCESS}
      validationSchema={validationSchema}
      onSubmit={close}
      onSuccess={handleSuccess}
      transform={transform}
    >
      {(formValues: FormikProps<FormValues>) => (
        <Dialog cancel={cancel}>
          <DialogForm
            {...formValues}
            colony={colony}
            minUserStake={minUserStake}
            cancel={cancel}
            editor={editor}
            limit={LIMIT}
            {...props}
          />
        </Dialog>
      )}
    </ActionForm>
  );
};

RaiseObjectionDialog.displayName = displayName;

export default RaiseObjectionDialog;
