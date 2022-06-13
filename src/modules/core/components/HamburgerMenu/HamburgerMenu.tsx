import React from 'react';
import MenuLine from './MenuLine';

import styles from './HamburgerMenu.css';

const HamburgerMenu = () => {
  return (
    <div className={styles.container}>
      <MenuLine className={styles.menuLine} />
      <MenuLine className={styles.menuLine} />
      <MenuLine className={styles.menuLine} />
    </div>
  );
};

export default HamburgerMenu;
