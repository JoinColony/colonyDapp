import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import {
  EditorState as EditorStateType,
  ContentState,
  Editor,
  EditorState,
} from 'draft-js';

import 'draft-js/dist/Draft.css';

import { asField, InputLabel } from '~core/Fields';
import InputStatus from '~core/Fields/InputStatus';
import { AsFieldEnhancedProps } from '~core/Fields/types';
import { getMainClasses } from '~utils/css';

import styles from './MultiLineEdit.css';

interface Props {
  /** Should the return key create a new line */
  allowReturns?: boolean;

  /** Extra node to render on the top right in the label */
  extra?: ReactNode;

  /** Called when the editor loses focus */
  onEditorBlur?: (evt: FocusEvent, value: string) => void;

  /** Should the editor be read only */
  readOnly?: boolean;

  /** Should spell checking be enabled */
  spellCheck?: boolean;
}

enum Return {
  Handled = 'handled',
  NotHandled = 'not-handled',
}

const createEditorState = ($value: string) =>
  $value
    ? EditorState.createWithContent(ContentState.createFromText($value))
    : EditorState.createEmpty();

const MultiLineEdit = ({
  $error,
  $id,
  $value,
  allowReturns = true,
  extra,
  help,
  label,
  name,
  onEditorBlur,
  placeholder,
  setValue,
  status,
  elementOnly = true,
  readOnly = false,
  spellCheck = false,
}: Props & AsFieldEnhancedProps) => {
  const [editorState, setEditorState] = useState<EditorStateType>(() =>
    createEditorState($value),
  );
  useEffect(() => setEditorState(createEditorState($value)), [$value]);
  const handleReturn = useCallback(
    () => (!allowReturns ? Return.Handled : Return.NotHandled),
    [allowReturns],
  );
  const onBlur = useCallback(
    (evt: FocusEvent) => {
      const content = editorState.getCurrentContent();
      const newValue =
        (content.hasText() && content.getPlainText().trim()) || '';
      if (newValue !== $value && setValue) {
        setValue(newValue);
      }
      if (onEditorBlur) {
        onEditorBlur(evt, newValue);
      }
    },
    [$value, editorState, onEditorBlur, setValue],
  );
  return (
    <div className={getMainClasses({}, styles)}>
      {!elementOnly && <InputLabel help={help} extra={extra} label={label} />}
      <Editor
        name={name}
        editorKey={$id}
        editorState={editorState}
        handleReturn={handleReturn}
        onBlur={onBlur}
        onChange={setEditorState}
        placeholder={placeholder}
        readOnly={readOnly}
        spellCheck={spellCheck}
        stripPastedStyles
      />
      <InputStatus status={status} error={$error} />
    </div>
  );
};

export default asField<Props>({
  initialValue: '',
})(MultiLineEdit);
