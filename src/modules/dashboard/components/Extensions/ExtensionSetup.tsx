import React, { useCallback, useMemo } from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useHistory, useParams, Redirect } from 'react-router';
import { endsWith } from 'lodash';
import { Extension } from '@colony/colony-js';
import Decimal from 'decimal.js';
import { useMediaQuery } from 'react-responsive';

import { IconButton, ActionButton } from '~core/Button';
import { Input, ActionForm, Textarea } from '~core/Fields';
import Heading from '~core/Heading';

import { Colony, ColonyExtension } from '~data/index';

import {
  ExtensionData,
  ExtensionParamType,
} from '~data/staticData/extensionData';
import { mergePayload, mapPayload, pipe } from '~utils/actions';

import {
  createExtensionInitValidation,
  createExtensionDefaultValues,
  getButtonAction,
} from './utils';

import { query700 as query } from '~styles/queries.css';
import styles from './ExtensionSetup.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Extensions.ExtensionSetup.title',
    defaultMessage: 'Enable extension',
  },
  description: {
    id: 'dashboard.Extensions.ExtensionSetup.description',
    defaultMessage: `Enabling this extension requires additional parameters. These parameters cannot be changed after enabling it. To do so, you must uninstall the extension, and then install and enable it again with new parameters.`,
  },
  descriptionMissingPermissions: {
    id: 'dashboard.Extensions.ExtensionSetup.descriptionMissingPermissions',
    defaultMessage: `This Extension needs certain permissions in the Colony. Click here to set them.`,
  },
  setPermissions: {
    id: 'dashboard.Extensions.ExtensionSetup.setPermissions',
    defaultMessage: 'Set permissions',
  },
  hours: {
    id: 'dashboard.Extensions.ExtensionSetup.hours',
    defaultMessage: 'hours',
  },
  periods: {
    id: 'dashboard.Extensions.ExtensionSetup.periods',
    defaultMessage: 'periods',
  },
  percent: {
    id: 'dashboard.Extensions.ExtensionSetup.percent',
    defaultMessage: '%',
  },
  initParams: {
    id: 'dashboard.Extensions.ExtensionSetup.initParams',
    defaultMessage: 'Initialization parameters',
  },
  tokenValidationError: {
    id: 'dashboard.Extensions.ExtensionSetup.tokenValidationError',
    defaultMessage: `Error: The Token to be sold needs to be different from the purchase Token.`,
  },
  targetPerPeriodError: {
    id: 'dashboard.Extensions.ExtensionSetup.targetPerPeriodError',
    defaultMessage: `Error: Target per period value cannot exceed the Maximum per period value.`,
  },
  maxPerPeriodError: {
    id: 'dashboard.Extensions.ExtensionSetup.maxPerPeriodError',
    defaultMessage: `Error: Maximum per period value cannot be lower than then Target per period value.`,
  },
});

interface Props {
  colony: Colony;
  extension: ExtensionData;
  installedExtension: ColonyExtension;
}
const ExtensionSetup = ({
  colony: { colonyAddress },
  extension: { initializationParams },
  installedExtension,
}: Props) => {
  const { colonyName, extensionId } = useParams<{
    colonyName: string;
    extensionId: string;
  }>();
  const history = useHistory();
  const isMobile = useMediaQuery({ query });

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
              formattedPayload[paramName] = new Decimal(payload[paramName])
                .mul(3600) // Seconds in 1 hour
                .toFixed(0, Decimal.ROUND_HALF_UP);
            } else {
              formattedPayload[paramName] = new Decimal(payload[paramName])
                .mul(new Decimal(10).pow(16))
                .toString();
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

  const initialValues = useMemo(() => {
    if (!initializationParams) {
      return {};
    }
    return createExtensionDefaultValues(initializationParams);
  }, [initializationParams]);

  if (
    installedExtension.details?.deprecated ||
    (installedExtension.details?.initialized &&
      !installedExtension.details?.missingPermissions.length)
  ) {
    return <Redirect to={`/colony/${colonyName}/extensions/${extensionId}`} />;
  }

  // This is a special case that should not happen. Used to recover the
  // missing permission transactions
  if (
    installedExtension.details?.initialized &&
    installedExtension.details?.missingPermissions.length
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
            submit={getButtonAction('SUBMIT')}
            error={getButtonAction('ERROR')}
            success={getButtonAction('SUCCESS')}
            transform={transform}
            text={MSG.setPermissions}
          />
        </div>
      </div>
    );
  }

  if (!initializationParams) return null;

  const displayParams = (params, formikBag, isExtraParams) =>
    params.map(
      ({ paramName, title, description, type, complementaryLabel }) => {
        const Label = () =>
          complementaryLabel && (
            <span className={styles.complementaryLabel}>
              <FormattedMessage {...MSG[complementaryLabel]} />
            </span>
          );
        return (
          <div
            key={paramName}
            className={isExtraParams ? styles.extraParams : ''}
          >
            {type === ExtensionParamType.Input && (
              <div
                className={`${styles.input} ${
                  paramName.endsWith('Address') ? styles.addressInput : ''
                }`}
              >
                <div className={styles.inputWrapper}>
                  <Input
                    appearance={{ size: 'medium', theme: 'minimal' }}
                    label={title}
                    name={paramName}
                    forcedFieldError={
                      formikBag?.status?.[paramName]
                        ? MSG[`${paramName}Error`]
                        : undefined
                    }
                    disabled={formikBag.isSubmitting}
                  />
                  {isMobile && <Label />}
                </div>
                <p className={styles.inputsDescription}>
                  <FormattedMessage
                    {...description}
                    values={{
                      span: (chunks) => (
                        <span className={styles.descriptionExample}>
                          {chunks}
                        </span>
                      ),
                    }}
                  />
                </p>
                {!isMobile && <Label />}
              </div>
            )}
            {type === ExtensionParamType.Textarea && (
              <div className={styles.textArea}>
                <Textarea
                  appearance={{ colorSchema: 'grey' }}
                  label={title}
                  name={paramName}
                  disabled={formikBag.isSubmitting}
                  extra={
                    description && (
                      <p className={styles.textAreaDescription}>
                        <FormattedMessage {...description} />
                      </p>
                    )
                  }
                />
              </div>
            )}
          </div>
        );
      },
    );

  return (
    <ActionForm
      initialValues={initialValues}
      validationSchema={createExtensionInitValidation(initializationParams)}
      submit={getButtonAction('SUBMIT')}
      error={getButtonAction('ERROR')}
      success={getButtonAction('SUCCESS')}
      onSuccess={handleFormSuccess}
      transform={transform}
    >
      {({
        handleSubmit,
        isSubmitting,
        isValid,
        ...formikBag
      }: FormikProps<object>) => (
        <div className={styles.main}>
          <Heading
            appearance={{ size: 'medium', margin: 'none' }}
            text={MSG.title}
            id="enableExtnTitle"
          />
          <FormattedMessage {...MSG.description} />
          <div className={styles.inputContainer}>
            {displayParams(
              initializationParams,
              { ...formikBag, isSubmitting },
              false,
            )}
          </div>
          <IconButton
            appearance={{ theme: 'primary', size: 'large' }}
            onClick={() => handleSubmit()}
            text={{ id: 'button.confirm' }}
            loading={isSubmitting}
            disabled={
              !isValid ||
              Object.values(formikBag?.status || {}).some((value) => !!value) ||
              isSubmitting
            }
            data-test="setupExtensionConfirmButton"
          />
        </div>
      )}
    </ActionForm>
  );
};

export default ExtensionSetup;
