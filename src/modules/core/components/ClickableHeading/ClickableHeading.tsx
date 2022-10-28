import React, { ReactChild } from 'react';

import Heading, { Appearance } from '~core/Heading';
import NavLink from '~core/NavLink';
import Icon from '~core/Icon';

import styles from './ClickableHeading.css';

interface Props {
  linkTo: string;
  children?: ReactChild;
  appearance?: Pick<Appearance, 'margin'>;
}

const ClickableHeading = ({ linkTo, children, appearance }: Props) => {
  return (
    <div className={styles.heading}>
      <Heading appearance={{ size: 'smallish', weight: 'bold', ...appearance }}>
        <NavLink to={linkTo}>
          <span className={styles.contents}>
            {children}

            <span className={styles.icon}>
              <Icon name="caret-right" />
            </span>
          </span>
        </NavLink>
      </Heading>
    </div>
  );
};

export default ClickableHeading;
