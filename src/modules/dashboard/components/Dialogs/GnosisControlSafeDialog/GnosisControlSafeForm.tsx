import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FormikProps } from 'formik';

import { DialogSection } from '~core/Dialog';
import Heading from '~core/Heading';
import ExternalLink from '~core/ExternalLink';
import Button from '~core/Button';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';

import { GNOSIS_SAFE_INTEGRATION_LEARN_MORE } from '~externalUrls';
import { Colony } from '~data/index';

import { FormValues } from './GnosisControlSafeDialog';
import styles from './GnosisControlSafeForm.css';
import Avatar from '~core/Avatar';

const MSG = defineMessages({
  title: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.title',
    defaultMessage: 'Control Safe',
  },
  description: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.description',
    defaultMessage: `You can use Control Safe to interact with other third party smart contracts. Be careful. <a>Learn more</a>`,
  },
  selectSafe: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.selectSafe',
    defaultMessage: 'Select Safe',
  },
  buttonInteract: {
    id:
      'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.buttonInteract',
    defaultMessage: 'Interact',
  },
});

const displayName = 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm';

interface Props {
  colony: Colony;
  back?: () => void;
}

const renderAvatar = (address: string, item) => (
  <Avatar
    seed={address.toLocaleLowerCase()}
    size="xs"
    notSet={false}
    title={item.name}
    placeholderIcon="at-sign-circle"
  />
);

const GnosisControlSafeForm = ({
  back,
  handleSubmit,
}: Props & FormikProps<FormValues>) => {
  return (
    <>
      <DialogSection>
        <Heading
          appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
          text={MSG.title}
        />
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <FormattedMessage
          {...MSG.description}
          values={{
            a: (chunks) => (
              <ExternalLink href={GNOSIS_SAFE_INTEGRATION_LEARN_MORE}>
                {chunks}
              </ExternalLink>
            ),
          }}
        />
      </DialogSection>
      <DialogSection>
        <SingleUserPicker
          appearance={{ width: 'wide' }}
          // data={subscribedUsers}
          label={MSG.selectSafe}
          name="safeType"
          filter={filterUserSelection}
          renderAvatar={renderAvatar}
          // disabled={inputDisabled}
          // placeholder={MSG.userPickerPlaceholder}
        />
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => handleSubmit()}
          text={MSG.buttonInteract}
          // loading={isSubmitting}
          // disabled={!isValid || inputDisabled}
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

GnosisControlSafeForm.displayName = displayName;

export default GnosisControlSafeForm;
