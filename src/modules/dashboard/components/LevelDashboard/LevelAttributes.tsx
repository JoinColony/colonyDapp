import React from 'react';

import Heading from '~core/Heading';
import { OneLevel } from '~data/index';

interface Props {
  level: OneLevel;
}

const displayName = 'dashboard.LevelDashboard.LevelAttributes';

const LevelAttributes = ({ level: { title } }: Props) => (
  <div>{title && <Heading text={title} />}</div>
);

LevelAttributes.displayName = displayName;

export default LevelAttributes;
