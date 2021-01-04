import React from 'react';
import DialogSection from '~core/Dialog/DialogSection';
import { Annotations } from '~core/Fields';
import Heading from '~core/Heading';

const RecoveryModeDialogForm = () => {
  return (
    <>
      <DialogSection>
        <Heading text="title placeholder" />
      </DialogSection>
      <DialogSection>
        <Annotations label="annotation placeholder" name="annotations" />
      </DialogSection>
    </>
  );
};

export default RecoveryModeDialogForm;
