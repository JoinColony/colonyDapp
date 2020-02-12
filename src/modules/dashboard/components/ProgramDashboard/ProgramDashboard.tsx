import React from 'react';

import { OneProgram } from '~data/index';

interface Props {
  program: OneProgram;
}

const displayName = 'Dashboard.ProgramDashboard';

const ProgramDashboard = ({ program }: Props) => (
  <div>{JSON.stringify(program)}</div>
);

ProgramDashboard.displayName = displayName;

export default ProgramDashboard;
