import React from 'react';

import styles from './HamburgerMenu.css';

const displayName = 'HamburgerMenu';

const HamburgerMenu = () => {
  const MenuLine = () => <div className={styles.menuLine} />;

  return (
    <div className={styles.container}>
      <MenuLine />
      <MenuLine />
      <MenuLine />
    </div>
  );
};

HamburgerMenu.displayName = displayName;

export default HamburgerMenu;
