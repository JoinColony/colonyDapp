import React from 'react';

import styles from './Slider.css';

type Appearance = {
  theme?: 'primary' | 'danger';
};

interface Props {
  value?: number;
  max?: number;
  limit?: number;
  appearance?: Appearance;
}

const displayName = 'Slider';

const Slider = ({ value = 0, max = 100 }: Props) => {
  return (
    <div className={styles.main}>
      {value} {max}
    </div>
  );
};

Slider.displayName = displayName;

export default Slider;
