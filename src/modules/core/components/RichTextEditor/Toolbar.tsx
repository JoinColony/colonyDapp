import React, { useState } from 'react';
import { Editor } from '@tiptap/core';
import Icon from '~core/Icon';

import styles from './Toolbar.css';
import Button from '~core/Button';

const displayName = 'RichText.Toolbar';

interface Props {
  editor: Editor;
}

enum ICONS {
  bold = 'bold',
  codeBlock = 'codeBlock',
  bulletList = 'bulletList',
  strike = 'strike',
  heading = 'heading',
  underline = 'underline',
  link = 'link',
  image = 'image',
  color = 'color',
}

// @ts-ignore. userAgentData does exist on the Navigator object, contrary to TS's assertion
const OS = window.navigator.userAgentData.platform;
const ctrl = OS === 'macOS' ? 'Cmd' : 'Ctrl';

const toolbarActions = (editor: Editor) => [
  {
    icon: ICONS.bulletList,
    onClick: () => editor.chain().focus().toggleBulletList().run(),
    keyboardShortcut: `${ctrl}+Shift+8`,
    annotation: 'Add a bulleted list',
  },
  {
    icon: ICONS.bold,
    onClick: () => editor.chain().focus().toggleBold().run(),
    keyboardShortcut: `${ctrl}+B`,
    annotation: 'Add bold text',
  },
  {
    icon: ICONS.underline,
    onClick: () => editor.chain().focus().toggleUnderline().run(),
    keyboardShortcut: `${ctrl}+U`,
    annotation: 'Add an underline',
  },
  {
    icon: ICONS.strike,
    onClick: () => editor.chain().focus().toggleStrike().run(),
    keyboardShortcut: `${ctrl}+Shift+X`,
    annotation: 'Add a strikethrough',
  },
  {
    icon: ICONS.heading,
    onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    keyboardShortcut: `${ctrl}+Alt+3`,
    annotation: 'Add heading text',
  },
  {
    icon: ICONS.codeBlock,
    onClick: () => editor.chain().focus().toggleCodeBlock().run(),
    keyboardShortcut: `${ctrl}+Alt+C`,
    annotation: 'Add a code block',
  },
];

const Toolbar = ({ editor }: Props) => {
  const [colorValue, setColorValue] = useState(
    editor.getAttributes('textStyle').color || '#2f2f2f',
  );

  return (
    <div className={styles.main}>
      {toolbarActions(editor).map((action) => (
        <Button
          appearance={{ theme: 'ghost' }}
          onClick={action.onClick}
          key={action.icon}
        >
          <Icon
            name={action.icon}
            title={`${action.annotation}, <${action.keyboardShortcut}>`}
          />
        </Button>
      ))}
      <div className={styles.inputWrapper} title="Change text color">
        <Button appearance={{ theme: 'ghost' }}>
          <Icon name={ICONS.color} />
        </Button>
        <input
          type="color"
          defaultValue={colorValue}
          onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
            editor.chain().focus().setColor(event.target.value).run();
            setColorValue(event.target.value);
          }}
        />
      </div>
    </div>
  );
};

Toolbar.displayName = displayName;
export default Toolbar;
