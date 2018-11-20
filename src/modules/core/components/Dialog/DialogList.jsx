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
  subtitle: MessageDescriptor | string | Node,
  /** Icon to be rendered in the first column */
  icon?: string,
  /** This can be whatever other component since we
   * sometimes require a button but other times s link */
  extra?: Node,
};

type Props = {
  items: Array<DialogListItem>,
};

const displayName = 'DialogList';

const DialogList = ({ items }: Props) => (
  <div>
    {items.map(({ title, subtitle, icon, extra }) => (
      <div key={`${title}`} className={styles.main}>
        {icon && (
          <div className={styles.rowIcon}>
            <Icon name={icon} title={title} />
          </div>
        )}
        <div className={styles.rowContent}>
          <Heading
            appearance={{ size: 'small', weight: 'bold', margin: 'small' }}
            text={title}
          />
          {subtitle.id ? (
            <Heading
              appearance={{ size: 'tiny', weight: 'thin', margin: 'small' }}
              text={subtitle}
            />
          ) : (
            subtitle
          )}
        </div>
        {extra}
      </div>
    ))}
  </div>
);

DialogList.displayName = displayName;

export default DialogList;
