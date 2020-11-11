import { FormikProps } from 'formik';
import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useHistory, useParams } from 'react-router';

import { IconButton } from '~core/Button';
import { Input, ActionForm } from '~core/Fields';
import Heading from '~core/Heading';
import { ActionTypes } from '~redux/index';
import { ExtensionData } from '~data/staticData/extensionData';
import { Address } from '~types/index';

import styles from './ExtensionSetup.css';

import {
  createExtensionInitValidation,
  createExtensionDefaultValues,
} from './utils';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Extensions.ExtensionSetup.title',
    defaultMessage: 'Enable extension',
  },
  description: {
    id: 'dashboard.Extensions.ExtensionSetup.description',
    defaultMessage: `Enabling this extension requires additional parameters. These parameters can not be changed after enabling it. To do that you have to uninstall the extension, install and enable it again with new parameters.`,
  },
});

interface Props {
  colonyAddress: Address;
  extension: ExtensionData;
}
// @TODO needed
/* {/1* transform={transform} *1/} */
/* values={{ */
/*   colonyAddress, */
/*   extensionId: extension.extensionId, */
/* }} */

const ExtensionSetup = ({
  /* colonyAddress, */
  extension: { initializationParams },
}: Props) => {
  const { colonyName, extensionId } = useParams();
  const history = useHistory();

  const handleFormSuccess = useCallback(() => {
    history.replace(`/colony/${colonyName}/extensions/${extensionId}`);
  }, [history, colonyName, extensionId]);

  if (!initializationParams || !initializationParams.length) return null;

  return (
    <ActionForm
      initialValues={createExtensionDefaultValues(initializationParams)}
      validationSchema={createExtensionInitValidation(initializationParams)}
      submit={ActionTypes.COLONY_EXTENSION_ENABLE}
      error={ActionTypes.COLONY_EXTENSION_ENABLE_ERROR}
      success={ActionTypes.COLONY_EXTENSION_ENABLE_SUCCESS}
      onSuccess={handleFormSuccess}
    >
      {({ handleSubmit, isSubmitting, isValid }: FormikProps<object>) => (
        <div className={styles.main}>
          <Heading
            appearance={{ size: 'medium', margin: 'none' }}
            text={MSG.title}
          />
          <FormattedMessage {...MSG.description} />
          <div className={styles.inputContainer}>
            {initializationParams.map(({ paramName, title, description }) => (
              <div key={paramName} className={styles.input}>
                <Input
                  appearance={{ size: 'medium', theme: 'minimal' }}
                  label={title}
                  name={paramName}
                />
                <FormattedMessage {...description} />
              </div>
            ))}
          </div>
          <IconButton
            appearance={{ theme: 'primary', size: 'large' }}
            onClick={() => handleSubmit()}
            text={{ id: 'button.confirm' }}
            loading={isSubmitting}
            disabled={!isValid}
          />
        </div>
      )}
    </ActionForm>
  );
};
ExtensionSetup.displayName = 'dashboard.Extensions.ExtensionSetup';

export default ExtensionSetup;
