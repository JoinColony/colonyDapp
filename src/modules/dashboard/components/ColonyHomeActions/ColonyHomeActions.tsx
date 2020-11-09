import React from 'react';
import Button from '~core/Button';

const displayName = 'dashboard.ColonyHomeActions';

const ColonyHomeActions = () => {
  return (
    <Button
      appearance={{ theme: 'primary', size: 'large' }}
      text={{ id: 'button.action' }}
    />
  );
};

ColonyHomeActions.displayName = displayName;

export default ColonyHomeActions;
