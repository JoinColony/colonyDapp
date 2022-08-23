import React from 'react';
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
import { Colony } from '~data/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';

import DialogForm from './DecisionDialogForm';

const displayName = 'dashboard.DecisionDialog';

export interface FormValues {
  motionDomainId: number;
  title: string;
  description: string;
}

interface Props extends DialogProps {
  colony: Colony;
  ethDomainId: number;
  decisionTitle?: string;
  content?: string;
}

const characterLimit = 4000;

export const LOCAL_STORAGE_DECISION_KEY = 'decision';

const DecisionDialog = ({
  cancel,
  colony,
  ethDomainId,
  decisionTitle,
  content,
  close,
}: Props) => {
  const history = useHistory();

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
    content,
  });

  const domainId =
    ethDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID || ethDomainId === undefined
      ? ROOT_DOMAIN_ID
      : ethDomainId;

  const handleSubmit = (values) => {
    if (editor) {
      editor.setEditable(false);
    }

    localStorage.setItem(LOCAL_STORAGE_DECISION_KEY, JSON.stringify(values));
    close();
    history.push(`/colony/${colonyName}/decisions/preview`);
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required('Please enter a title'),
    motionDomainId: yup.number(),
    description: yup.string().notOneOf(['<p></p>']).required(),
  });
  return (
    <Form
      initialValues={{
        motionDomainId: domainId,
        decisionTitle,
        content,
      }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {(formProps) => (
        <Dialog cancel={cancel}>
          <DialogForm
            colony={colony}
            {...formProps}
            ethDomainId={ethDomainId}
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
