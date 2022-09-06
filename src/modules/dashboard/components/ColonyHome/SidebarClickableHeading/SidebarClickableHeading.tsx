import React, { ReactChild } from 'react';

import Heading from '~core/Heading';
import NavLink from '~core/NavLink';
import Icon from '~core/Icon';

import styles from './SidebarClickableHeading.css';

interface Props {
  children?: ReactChild;
  linkTo: string;
}

const SidebarClickableHeading = ({ children, linkTo }: Props) => {
  return (
    <div className={styles.heading}>
      <Heading appearance={{ size: 'smallish', weight: 'bold' }}>
        <NavLink to={linkTo}>
          <span className={styles.contents}>
            {children}

            <Icon name="caret-right" className={styles.icon} />
          </span>
        </NavLink>
      </Heading>
    </div>
  );
};

export default SidebarClickableHeading;
