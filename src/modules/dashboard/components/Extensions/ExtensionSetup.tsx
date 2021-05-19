import { FormikProps } from 'formik';
import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useHistory, useParams, Redirect } from 'react-router';
import { endsWith } from 'lodash';
import { Extension } from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';

import { IconButton, ActionButton } from '~core/Button';
import { Input, ActionForm } from '~core/Fields';
import Heading from '~core/Heading';
import { ActionTypes } from '~redux/index';
import { ColonyExtension } from '~data/index';
import { ExtensionData } from '~data/staticData/extensionData';
import { mergePayload, mapPayload, pipe } from '~utils/actions';
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
  descriptionMissingPermissions: {
    id: 'dashboard.Extensions.ExtensionSetup.descriptionMissingPermissions',
    defaultMessage: `This Extension needs certain permissions in the Colony. Click here to set them.`,
  },
  setPermissions: {
    id: 'dashboard.Extensions.ExtensionSetup.setPermissions',
    defaultMessage: 'Set permissions',
  },
  complementaryLabel: {
    id: 'dashboard.Extensions.ExtensionSetup.complementaryLabel',
    defaultMessage: `{isPeriod, select,
      true {hours}
      false {%}
      other { }
    }`,
  },
});

interface Props {
  colonyAddress: Address;
  extension: ExtensionData;
  installedExtension: ColonyExtension;
}
const ExtensionSetup = ({
  colonyAddress,
  extension: { initializationParams },
  installedExtension,
}: Props) => {
  const { colonyName, extensionId } = useParams<{
    colonyName: string;
    extensionId: string;
  }>();
  const history = useHistory();

  const handleFormSuccess = useCallback(() => {
    history.replace(`/colony/${colonyName}/extensions/${extensionId}`);
  }, [history, colonyName, extensionId]);

  const transform = useCallback(
    pipe(
      mapPayload((payload) => {
        if (extensionId === Extension.VotingReputation) {
          const formattedPayload = {};
          initializationParams?.map(({ paramName }) => {
            if (endsWith(paramName, 'Period')) {
              formattedPayload[paramName] = payload[paramName] * 3600; // Seconds in 1 hour
            } else {
              formattedPayload[paramName] = bigNumberify(
                payload[paramName],
              ).mul(bigNumberify(10).pow(16));
            }
          });
          return formattedPayload;
        }

        return payload;
      }),
      mergePayload({ colonyAddress, extensionId }),
    ),
    [colonyAddress, extensionId, initializationParams],
  );

  if (
    installedExtension.details.deprecated ||
    (installedExtension.details.initialized &&
      !installedExtension.details.missingPermissions.length)
  ) {
    return <Redirect to={`/colony/${colonyName}/extensions/${extensionId}`} />;
  }

  // This is a special case that should not happen. Used to recover the
  // missing permission transactions
  if (
    installedExtension.details.initialized &&
    installedExtension.details.missingPermissions.length
  ) {
    return (
      <div className={styles.main}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={MSG.title}
        />
        <FormattedMessage {...MSG.descriptionMissingPermissions} />

        <div className={styles.inputContainer}>
          <ActionButton
            submit={ActionTypes.COLONY_EXTENSION_ENABLE}
            error={ActionTypes.COLONY_EXTENSION_ENABLE_ERROR}
            success={ActionTypes.COLONY_EXTENSION_ENABLE_SUCCESS}
            transform={transform}
            text={MSG.setPermissions}
          />
        </div>
      </div>
    );
  }

  if (!initializationParams) return null;

  return (
    <ActionForm
      initialValues={createExtensionDefaultValues(initializationParams)}
      validationSchema={createExtensionInitValidation(initializationParams)}
      submit={ActionTypes.COLONY_EXTENSION_ENABLE}
      error={ActionTypes.COLONY_EXTENSION_ENABLE_ERROR}
      success={ActionTypes.COLONY_EXTENSION_ENABLE_SUCCESS}
      onSuccess={handleFormSuccess}
      transform={transform}
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
                {extensionId === Extension.VotingReputation && (
                  <span className={styles.complementaryLabel}>
                    <FormattedMessage
                      {...MSG.complementaryLabel}
                      values={{ isPeriod: endsWith(paramName, 'Period') }}
                    />
                  </span>
                )}
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
