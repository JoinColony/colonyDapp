import React, { useState } from 'react';
import { FormikProps } from 'formik';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import ColorSelect from '~core/ColorSelect';
import { Color } from '~core/ColorTag';
import DialogSection from '~core/Dialog/DialogSection';
import { Input, Annotations } from '~core/Fields';
import Heading from '~core/Heading';

import { FormValues } from './CreateEditDomainDialog';
import styles from './CreateEditDomainDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.CreateEditDomainDialog.CreateEditDomainDialogForm.title',
    defaultMessage: 'Create a new domain',
  },
  name: {
    id: 'dashboard.CreateEditDomainDialog.CreateEditDomainDialogForm.name',
    defaultMessage: 'Domain name',
  },
  purpose: {
    id: 'dashboard.CreateEditDomainDialog.CreateEditDomainDialogForm.name',
    defaultMessage: 'What is the purpose of this domain?',
  },
  annotation: {
    id:
      'dashboard.CreateEditDomainDialog.CreateEditDomainDialogForm.annotation',
    defaultMessage: 'Explain why you’re creating this domain',
  },
});

interface Props {
  back: () => void;
}

const CreateEditDomainDialogForm = ({
  back,
  handleSubmit,
}: Props & FormikProps<FormValues>) => {
  const [domainColor, setDomainColor] = useState(Color.LightPink);

  return (
    <>
      <DialogSection>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={MSG.title}
        />
      </DialogSection>
      <DialogSection>
        <div className={styles.displayFlex}>
          <div className={styles.domainName}>
            <Input
              label={MSG.name}
              name="name"
              appearance={{ colorSchema: 'grey', theme: 'fat' }}
            />
          </div>
          <ColorSelect
            activeOption={domainColor}
            alignOptions="right"
            onColorChange={setDomainColor}
          />
        </div>
      </DialogSection>
      <DialogSection>
        <Input
          label={MSG.purpose}
          name="purpose"
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          maxLength={90}
        />
      </DialogSection>
      <DialogSection>
        <Annotations label={MSG.annotation} name="annotation" />
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          text={{ id: 'button.back' }}
          onClick={back}
          appearance={{ theme: 'secondary', size: 'large' }}
        />
        <Button
          text={{ id: 'button.confirm' }}
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => handleSubmit()}
        />
      </DialogSection>
    </>
  );
};

export default CreateEditDomainDialogForm;
