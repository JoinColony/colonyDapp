/* @flow */

import type { Node } from 'react';
import React from 'react';
import type { MessageDescriptor } from 'react-intl';

import Icon from '../Icon';
import Heading from '../Heading';

import styles from './DialogList.css';

type DialogListItem = {
  /** Text in the first row of the second column */
  title: MessageDescriptor | string,
  /** Text in the second row of the second column */
  subtitleElement: Node,
  /** Icon to be rendered in the first column */
  icon?: string,
  imageUrl?: string,
  /** This can be whatever other component since we
   * sometimes require a button but other times s link */
  extra?: Node,
};

type Props = {
  items: Array<DialogListItem>,
};

const displayName = 'DialogList';

const DialogList = ({ items }: Props) => (
  <div className={styles.container}>
    {items.map(({ title, subtitleElement, icon, extra, imageUrl }, i) => (
      <div key={`element${i}`} className={styles.main}>
        <div className={styles.rowIcon}>
          {icon && <Icon name={icon} title={title} />}
          {imageUrl && <img src={imageUrl} alt="logo" />}
        </div>
        <div className={styles.rowContent}>
          <Heading
            appearance={{ size: 'small', weight: 'bold', margin: 'small' }}
            text={title}
          />
          {subtitleElement}
        </div>
        {extra}
      </div>
    ))}
  </div>
);

DialogList.displayName = displayName;

export default DialogList;
