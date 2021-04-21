import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import { FormikProps } from 'formik';

import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import { Annotations } from '~core/Fields';
import Heading from '~core/Heading';
import PermissionsLabel from '~core/PermissionsLabel';
import Slider from '~core/Slider';

import { FormValues } from './RaiseObjectionDialog';
import styles from './RaiseObjectionDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.RaiseObjectionDialog.RaiseObjectionDialogForm.title',
    defaultMessage: 'Raise an objection',
  },
  objectionDescription: {
    id: `dashboard.RaiseObjectionDialog.RaiseObjectionDialogForm.objectionDescription`,
    defaultMessage: `
    You are about to make an objection to the motion. If fully staked,
    it will immediately start a voting process to determine whether
    the motion should pass. <a>Learn more.</a>`,
  },
  annotation: {
    id: 'dashboard.RaiseObjectionDialog.RaiseObjectionDialogForm.annotation',
    defaultMessage: 'Explain why you’re making this objection (optional)',
  },
});

const OBJECTION_HELP_LINK = `https://colony.io/dev/docs/colonynetwork/whitepaper-tldr-objections-and-disputes#objections`;

const RaiseObjectionDialogForm = ({
  handleSubmit,
  isSubmitting,
}: FormikProps<FormValues>) => {
  return (
    <>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={MSG.title}
          className={styles.title}
        />
      </DialogSection>
      <DialogSection>
        <FormattedMessage
          {...MSG.objectionDescription}
          values={{
            roleRequired: (
              <PermissionsLabel
                permission={ColonyRole.Recovery}
                name={{
                  id: `role.${ColonyRole.Recovery}`,
                }}
              />
            ),
            a: (chunks) => (
              <a
                href={OBJECTION_HELP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {chunks}
              </a>
            ),
          }}
        />
      </DialogSection>
      <DialogSection>
        <div className={styles.slider}>
          {/* will be corrected when staking widget PR is merged */}
          {/* @ts-ignore */}
          <Slider
            value={10}
            name="slider"
            appearance={{ theme: 'danger', size: 'thick' }}
            limit={100}
            max={100}
            // onChange={() => console.log('CHANGE slider')}
          />
        </div>
      </DialogSection>
      <DialogSection>
        <Annotations label={MSG.annotation} name="annotation" maxLength={90} />
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          text={{ id: 'button.cancel' }}
        />
        <span className={styles.nextButton}>
          <Button
            // !!!!!: to change for `pink`
            appearance={{ theme: 'primary', size: 'large' }}
            text={{ id: 'button.next' }}
            onClick={() => handleSubmit()}
            loading={isSubmitting}
          />
        </span>
      </DialogSection>
    </>
  );
};

export default RaiseObjectionDialogForm;
