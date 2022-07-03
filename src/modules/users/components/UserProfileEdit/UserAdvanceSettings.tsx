import React, { useCallback, useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import Heading from '~core/Heading';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import { Form, Toggle } from '~core/Fields';
import Snackbar, { SnackbarType } from '~core/Snackbar';
import Button from '~core/Button';

import { useUserSettings, SlotKey } from '~utils/hooks/useUserSettings';
import { canUseMetatransactions } from '../../checks';

import styles from './UserProfileEdit.css';
import stylesAdvance from './UserAdvanceSettings.css';

const MSG = defineMessages({
  heading: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.heading',
    defaultMessage: 'Advanced settings',
  },
  metaDescGlobalOff: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.metaDescGlobalOff',
    defaultMessage: `Metatransactions are disabled globally.`,
  },
  labelMetaTx: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.labelMetaTx',
    defaultMessage: `Metatransactions ({isOn, select,
      true {on}
      other {off}
    })`,
  },
  tooltip: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.tooltip',
    defaultMessage: `Metatransactions are turned on by default.
    If you would rather connect directly to the chain,
    and pay for your own transactions, you can turn them off
    by switching the toggle at any time. {br}{br} Please note,
    this setting is stored locally in your browser,
    if you clear your cache you will need to turn Metatransactions off again.`,
  },
  snackbarSuccess: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.snackbarSuccess',
    defaultMessage: 'Profile settings have been updated.',
  },
});

interface FormValues {
  metatransactions: boolean;
}

const validationSchema = yup.object({
  metatransactions: yup.bool(),
});

const displayName = 'users.UserProfileEdit.UserAdvanceSettings';

const UserAdvanceSettings = () => {
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  useEffect(() => {
    if (showSnackbar) {
      const timeout = setTimeout(() => setShowSnackbar(true), 200000);
      return () => {
        clearTimeout(timeout);
      };
    }
    return undefined;
  }, [showSnackbar]);

  const {
    settings: { metatransactions: metatransactionsSetting },
    setSettingsKey,
  } = useUserSettings();

  const onChange = useCallback(
    (oldValue) => {
      setSettingsKey(SlotKey.Metatransactions, !oldValue);
    },
    [setSettingsKey],
  );

  const metatransasctionsToggleAvailable = canUseMetatransactions();

  const metatransasctionsAvailable = metatransasctionsToggleAvailable
    ? metatransactionsSetting
    : false;

  return (
    <>
      <Form<FormValues>
        initialValues={{
          metatransactions: metatransasctionsAvailable,
        }}
        validationSchema={validationSchema}
        onSubmit={() => {}}
      >
        {({ isSubmitting }) => (
          <div className={styles.main}>
            <Heading
              appearance={{ theme: 'dark', size: 'medium' }}
              text={MSG.heading}
            />
            <div className={stylesAdvance.toggleContainer}>
              <Toggle
                label={MSG.labelMetaTx}
                labelValues={{
                  isOn: metatransasctionsAvailable,
                }}
                name="metatransactions"
                disabled={!metatransasctionsToggleAvailable}
                onChange={onChange}
              />
              <QuestionMarkTooltip
                tooltipText={MSG.tooltip}
                tooltipTextValues={{ br: <br /> }}
                className={stylesAdvance.tooltipContainer}
                tooltipClassName={stylesAdvance.tooltipContent}
                tooltipPopperOptions={{
                  placement: 'right',
                }}
              />
            </div>
            <div className={stylesAdvance.metaDesc}>
              {!metatransasctionsToggleAvailable && (
                <FormattedMessage {...MSG.metaDescGlobalOff} />
              )}
            </div>
            {metatransasctionsToggleAvailable && (
              <>
                <Button
                  text={{ id: 'button.save' }}
                  loading={isSubmitting}
                  onClick={() => setShowSnackbar(true)}
                  disabled={!metatransasctionsToggleAvailable}
                />
                <Snackbar
                  show={showSnackbar}
                  setShow={setShowSnackbar}
                  msg={MSG.snackbarSuccess}
                  type={SnackbarType.Success}
                />
              </>
            )}
          </div>
        )}
      </Form>
    </>
  );
};

UserAdvanceSettings.displayName = displayName;

export default UserAdvanceSettings;
