import React, { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';

import { SimpleMessageValues } from '~types/index';

import Icon from '../Icon';
import Heading from '../Heading';

import styles from './GroupList.css';

interface GroupListItem {
  id: string;

  /** Text in the first row of the second column */
  title?: MessageDescriptor | string;

  /** Values for html title (react-intl interpolation) */
  titleValues?: SimpleMessageValues;

  /** Text in the second row of the second column */
  subtitleElement: ReactNode;

  /** Icon to be rendered in the first column */
  icon?: string;

  /** Icon to be rendered in the first column as a bas64 encoded string */
  imageUrl?: string;

  /** This can be whatever other component since we
   * sometimes require a button but other times s link */
  extra?: ReactNode;
}

interface Props {
  items: GroupListItem[];
}

const displayName = 'GroupList';

const GroupList = ({ items }: Props) => (
  <div className={styles.container}>
    {items.map(
      ({ id, title, titleValues, subtitleElement, icon, extra, imageUrl }) => (
        <div key={id} className={styles.listMain}>
          <div className={styles.rowIcon}>
            {icon && <Icon name={icon} title={icon} />}
            {imageUrl && <img src={imageUrl} alt="logo" />}
          </div>
          <div className={styles.rowContent}>
            <Heading
              appearance={{ size: 'small', weight: 'bold', margin: 'small' }}
              text={title}
              textValues={titleValues}
            />
            {subtitleElement}
          </div>
          {extra}
        </div>
      ),
    )}
  </div>
);

GroupList.displayName = displayName;

export default GroupList;
