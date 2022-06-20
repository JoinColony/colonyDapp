import React from 'react';
import classnames from 'classnames';

import styles from './HamburgerMenu.css';

const displayName = 'HamburgerMenu';

interface Props {
  isOpen: boolean;
}
const HamburgerMenu = ({ isOpen }: Props) => {
  const MenuLine = () => (
    <div
      className={classnames(styles.menuLine, {
        [styles.menuOpen]: isOpen,
      })}
    />
  );

  return (
    <div className={styles.main}>
      <MenuLine />
      <MenuLine />
      <MenuLine />
    </div>
  );
};

HamburgerMenu.displayName = displayName;

export default HamburgerMenu;
