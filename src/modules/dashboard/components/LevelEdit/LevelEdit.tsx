import React from 'react';
/* import { defineMessages } from 'react-intl'; */
import { useParams } from 'react-router-dom';

/* const MSG = defineMessages({}); */

const LevelEdit = () => {
  const { programId } = useParams();
  return <>{programId}</>;
};

export default LevelEdit;
