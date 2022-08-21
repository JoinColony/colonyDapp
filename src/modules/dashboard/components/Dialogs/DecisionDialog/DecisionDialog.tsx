import React from 'react';
import { useEditor } from '@tiptap/react';
import CharacterCount from '@tiptap/extension-character-count';
import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import * as yup from 'yup';

import Dialog, { DialogProps } from '~core/Dialog';
import { Form } from '~core/Fields';
import { Colony } from '~data/index';

import DialogForm from './DecisionDialogForm';

const displayName = 'dashboard.DecisionDialog';

export interface FormValues {
  motionDomainId: number;
  decisionTitle?: string;
  content?: string;
}

interface Props extends DialogProps {
  colony: Colony;
  ethDomainId: number;
  decisionTitle?: string;
  content?: string;
}

const characterLimit = 4000;

const DecisionDialog = ({
  cancel,
  colony,
  ethDomainId,
  decisionTitle,
  content,
}: Props) => {
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

  const handleSubmit = () => {
    if (editor) {
      editor.setEditable(false);
      // Do something with form contents
    }
  };

  const validationSchema = yup.object().shape({
    decisionTitle: yup.string().required('Please enter a title'),
    motionDomainId: yup.number(),
    content: yup.string().notOneOf(['<p></p>']).required(),
  });
  return (
    <Form
      initialValues={{
        motionDomainId: ethDomainId,
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
