import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useEditor } from '@tiptap/react';
import CharacterCount from '@tiptap/extension-character-count';
import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import * as yup from 'yup';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import Dialog, { DialogProps } from '~core/Dialog';
import { Form } from '~core/Fields';
import { Colony, useLoggedInUser } from '~data/index';
import {
  COLONY_TOTAL_BALANCE_DOMAIN_ID,
  LOCAL_STORAGE_DECISION_KEY,
} from '~constants';
import { DecisionDetails } from '~types/index';

import DialogForm from './DecisionDialogForm';

const displayName = 'dashboard.DecisionDialog';

export interface FormValues {
  motionDomainId: number;
  title: string;
  description: string;
}

interface Props extends DialogProps {
  colony: Colony;
  ethDomainId?: number;
  isNewDecision: boolean;
}

const characterLimit = 4000;

const DecisionDialog = ({
  cancel,
  colony,
  colony: { colonyName },
  ethDomainId,
  close,
  isNewDecision,
}: Props) => {
  const history = useHistory();
  const { walletAddress } = useLoggedInUser();

  const [decisionData] = useState<DecisionDetails | undefined>(
    isNewDecision || localStorage.getItem(LOCAL_STORAGE_DECISION_KEY) === null
      ? undefined
      : JSON.parse(localStorage.getItem(LOCAL_STORAGE_DECISION_KEY) || ''),
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      CharacterCount.configure({ limit: characterLimit }),
      Placeholder.configure({
        emptyEditorClass: 'is-editor-empty',
        placeholder: 'Enter the description...',
      }),
    ],
    content: decisionData?.description,
  });

  const domainId =
    ethDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID || ethDomainId === undefined
      ? ROOT_DOMAIN_ID
      : ethDomainId;

  const handleSubmit = (values) => {
    if (editor) {
      editor.setEditable(false);
    }

    localStorage.setItem(
      LOCAL_STORAGE_DECISION_KEY,
      JSON.stringify({ ...values, userAddress: walletAddress }),
    );
    close();

    const previewUrl = `/colony/${colonyName}/decisions/preview`;

    if (history.location.pathname === previewUrl) {
      history.replace(previewUrl);
    } else {
      history.push(previewUrl);
    }
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required('Please enter a title'),
    motionDomainId: yup.number(),
    description: yup.string().notOneOf(['<p></p>']).required(),
  });
  return (
    <Form
      initialValues={{
        motionDomainId: domainId || decisionData?.motionDomainId,
        title: decisionData?.title,
        description: decisionData?.description,
      }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {(formProps) => (
        <Dialog cancel={cancel}>
          <DialogForm
            colony={colony}
            {...formProps}
            ethDomainId={
              ethDomainId || decisionData?.motionDomainId || ROOT_DOMAIN_ID
            }
            cancel={cancel}
            editor={editor}
            limit={characterLimit}
          />
        </Dialog>
      )}
    </Form>
  );
};

DecisionDialog.displayName = displayName;

export default DecisionDialog;
