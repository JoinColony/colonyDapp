import React, { useEffect } from 'react';
import { EditorContent, Editor } from '@tiptap/react';
import classnames from 'classnames';

import { useField } from 'formik';
import Toolbar from './Toolbar';

import styles from './RichTextEditor.css';
import { InputStatus } from '~core/Fields';

const displayName = 'RichTextEditor';

interface Props {
  editor: Editor;
  isSubmitting: boolean;
  limit: number;
}

const RichTextEditor = ({ editor, isSubmitting, limit }: Props) => {
  const [
    ,
    { error: contentError, touched: contentTouched },
    { setValue: setContentValue, setTouched: setContentTouched },
  ] = useField('content');

  /* Manually update form state on change to Editor component */
  const handleUpdate = ({ editor: editorContent }) =>
    setContentValue(editorContent.getHTML());

  useEffect(() => {
    editor?.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={classnames(styles.main, {
        [styles.disabled]: isSubmitting,
      })}
    >
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className={classnames(styles.editorContainer, {
          [styles.error]: contentError && contentTouched,
        })}
        name="content"
        onBlur={() => {
          setContentTouched(true);
        }}
      />
      <span className={styles.characterCount}>
        {editor.storage.characterCount.characters()} / {limit}
      </span>
      {contentTouched && contentError && (
        <InputStatus error={contentError && 'Please enter a description'} />
      )}
    </div>
  );
};

RichTextEditor.displayName = displayName;

export default RichTextEditor;
