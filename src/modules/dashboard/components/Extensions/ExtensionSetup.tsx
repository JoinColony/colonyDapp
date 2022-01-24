import React, { useCallback, useMemo } from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useHistory, useParams, Redirect } from 'react-router';
import moveDecimal from 'move-decimal-point';
import { endsWith } from 'lodash';
import { Extension } from '@colony/colony-js';
import Decimal from 'decimal.js';
import { bigNumberify } from 'ethers/utils';
import { AddressZero } from 'ethers/constants';

import { IconButton, ActionButton } from '~core/Button';
import {
  Input,
  ActionForm,
  Textarea,
  TokenSymbolSelector,
  InputLabel,
} from '~core/Fields';
import Heading from '~core/Heading';
import MaskedAddress from '~core/MaskedAddress';

import { ActionTypes } from '~redux/index';
import { Colony, ColonyExtension } from '~data/index';

import {
  ExtensionData,
  ExtensionParamType,
} from '~data/staticData/extensionData';
import { mergePayload, mapPayload, pipe } from '~utils/actions';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import { Address } from '~types/index';

import { ColonyPolicySelector } from '../Whitelist';

import styles from './ExtensionSetup.css';

import {
  createExtensionInitValidation,
  createExtensionDefaultValues,
  getButtonAction,
} from './utils';

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
  nativeTokenAddress: Address;
}
const ExtensionSetup = ({
  colony: { colonyAddress, tokens },
  extension: {
    initializationParams,
    extraInitParams,
    descriptionExtended,
    descriptionLinks,
    tokenContractAddress,
  },
  installedExtension,
  nativeTokenAddress,
}: Props) => {
  const { colonyName, extensionId } = useParams<{
    colonyName: string;
    extensionId: string;
  }>();
  const history = useHistory();

  const getToken = useCallback(
    (address) => tokens.find((token) => token.address === address),
    [tokens],
  );

  const handleCoinMachineTokenValidation = useCallback(
    (fieldName, newValue, { values, status, setStatus }) => {
      if (extensionId === Extension.CoinMachine) {
        const defaultStatus = {
          purchaseTokenError: false,
          tokenToBeSoldError: false,
        };
        if (fieldName === 'tokenToBeSold') {
          if (newValue === values.purchaseToken) {
            setStatus({
              ...status,
              ...defaultStatus,
              tokenToBeSoldError: true,
            });
          } else {
            setStatus({
              ...status,
              ...defaultStatus,
            });
          }
          return;
        }
        if (fieldName === 'purchaseToken') {
          if (newValue === values.tokenToBeSold) {
            setStatus({
              ...status,
              ...defaultStatus,
              purchaseTokenError: true,
            });
          } else {
            setStatus({
              ...status,
              ...defaultStatus,
            });
          }
        }
      }
    },
    [extensionId],
  );

  const handleCoinMachineTargetValidation = useCallback(
    (fieldName, event, { values, status, setStatus }) => {
      if (extensionId === Extension.CoinMachine) {
        const newValue =
          typeof event.target.value === 'string'
            ? parseInt(event.target.value, 10)
            : event.target.value;
        const defaultStatus = {
          targetPerPeriod: false,
          maxPerPeriod: false,
        };
        if (fieldName === 'targetPerPeriod') {
          if (newValue > values.maxPerPeriod) {
            setStatus({
              ...status,
              ...defaultStatus,
              targetPerPeriod: true,
            });
          } else {
            setStatus({
              ...status,
              ...defaultStatus,
            });
          }
          return;
        }
        if (fieldName === 'maxPerPeriod') {
          if (newValue < values.targetPerPeriod) {
            setStatus({
              ...status,
              ...defaultStatus,
              maxPerPeriod: true,
            });
          } else {
            setStatus({
              ...status,
              ...defaultStatus,
            });
          }
        }
      }
    },
    [extensionId],
  );

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
        if (extensionId === Extension.CoinMachine) {
          const {
            targetPerPeriod,
            tokenToBeSold,
            maxPerPeriod,
            userLimitFraction,
            startingPrice,
            purchaseToken,
            periodLength,
          } = payload;

          const soldTokenDecimals = getToken(tokenToBeSold)?.decimals;

          return {
            ...payload,
            targetPerPeriod: bigNumberify(
              moveDecimal(targetPerPeriod, soldTokenDecimals),
            ),
            maxPerPeriod: bigNumberify(
              moveDecimal(maxPerPeriod, soldTokenDecimals),
            ),
            userLimitFraction: bigNumberify(
              /* to be interpreted as a fixed point float with 18 digits after the decimal point */
              moveDecimal(userLimitFraction / 100, 18),
            ),
            startingPrice: bigNumberify(
              moveDecimal(startingPrice, getToken(purchaseToken)?.decimals),
            ),
            periodLength: new Decimal(periodLength)
              .mul(3600) // Seconds in 1 hour
              .toFixed(0, Decimal.ROUND_HALF_UP),
          };
        }
        return payload;
      }),
      mergePayload({ colonyAddress, extensionId }),
    ),
    [colonyAddress, extensionId, initializationParams],
  );

  const {
    isWhitelistExtensionEnabled,
    whitelistAddress,
  } = useEnabledExtensions({
    colonyAddress,
  });

  const initialValues = useMemo(() => {
    if (!initializationParams) {
      return {};
    }
    const defaultValues = createExtensionDefaultValues(initializationParams);
    const extraParamsDefaultValues =
      extraInitParams && createExtensionDefaultValues(extraInitParams);

    if (extensionId === Extension.CoinMachine) {
      return {
        ...defaultValues,
        ...extraParamsDefaultValues,
        whitelistAddress:
          (isWhitelistExtensionEnabled && whitelistAddress) || AddressZero,
        tokenToBeSold: nativeTokenAddress,
      };
    }
    return defaultValues;
  }, [
    extensionId,
    extraInitParams,
    initializationParams,
    nativeTokenAddress,
    isWhitelistExtensionEnabled,
    whitelistAddress,
  ]);

  const showInputField = useCallback(
    (paramName) => {
      return (
        (paramName !== 'whitelistAddress' &&
          paramName !== 'userLimitFraction') ||
        // @ts-ignore
        initialValues?.whitelistAddress !== AddressZero
      );
    },
    [initialValues],
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
            submit={getButtonAction('SUBMIT', installedExtension.id)}
            error={getButtonAction('ERROR', installedExtension.id)}
            success={getButtonAction('SUCCESS', installedExtension.id)}
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
      ({
        paramName,
        title,
        fieldName,
        description,
        type,
        options,
        disabled,
        complementaryLabel,
        tokenLabel,
      }) => (
        <div
          key={paramName}
          className={isExtraParams ? styles.extraParams : ''}
        >
          {type === ExtensionParamType.Input && showInputField(paramName) && (
            <div
              className={`${styles.input} ${
                paramName.endsWith('Address') ? styles.addressInput : ''
              }`}
            >
              <Input
                appearance={{ size: 'medium', theme: 'minimal' }}
                label={title}
                name={paramName}
                onChange={(newValue) =>
                  handleCoinMachineTargetValidation(
                    paramName,
                    newValue,
                    formikBag,
                  )
                }
                forcedFieldError={
                  formikBag?.status?.[paramName]
                    ? MSG[`${paramName}Error`]
                    : undefined
                }
              />
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
              {(complementaryLabel || tokenLabel) && (
                <span className={styles.complementaryLabel}>
                  {complementaryLabel ? (
                    <FormattedMessage {...MSG[complementaryLabel]} />
                  ) : (
                    getToken(formikBag.values[tokenLabel])?.symbol
                  )}
                </span>
              )}
            </div>
          )}
          {type === ExtensionParamType.Textarea && (
            <div className={styles.textArea}>
              <Textarea
                appearance={{ colorSchema: 'grey' }}
                label={title}
                name={paramName}
                disabled={disabled && disabled(formikBag.values)}
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
          {type === ExtensionParamType.ColonyPolicySelector && (
            <ColonyPolicySelector
              name={paramName}
              title={title}
              options={options || []}
            />
          )}
          {type === ExtensionParamType.TokenSelector && (
            <div>
              <InputLabel
                label={title}
                appearance={{
                  theme: 'minimal',
                  size: 'medium',
                }}
              />
              <div className={styles.tokenSelectorContainer}>
                {fieldName && (
                  <p>
                    <FormattedMessage {...fieldName} />
                  </p>
                )}
                <TokenSymbolSelector
                  tokens={tokens}
                  name={paramName}
                  appearance={{ alignOptions: 'right', theme: 'grey' }}
                  elementOnly
                  label={paramName}
                  onChange={(newValue) =>
                    handleCoinMachineTokenValidation(
                      paramName,
                      newValue,
                      formikBag,
                    )
                  }
                />
              </div>
              <div className={styles.tokenAddessLink}>
                {tokenContractAddress &&
                  tokenContractAddress(formikBag.values[paramName])}
                <div>
                  <MaskedAddress address={formikBag.values[paramName]} full />
                </div>
              </div>
              {description && (
                <p className={styles.inputsDescription}>
                  <FormattedMessage {...description} />
                </p>
              )}
              {formikBag?.status?.[`${paramName}Error`] && (
                <p className={styles.tokenErrors}>
                  <FormattedMessage {...MSG.tokenValidationError} />
                </p>
              )}
            </div>
          )}
        </div>
      ),
    );

  return (
    <ActionForm
      initialValues={initialValues}
      validationSchema={createExtensionInitValidation(initializationParams)}
      submit={ActionTypes.COLONY_EXTENSION_ENABLE}
      error={ActionTypes.COLONY_EXTENSION_ENABLE_ERROR}
      success={ActionTypes.COLONY_EXTENSION_ENABLE_SUCCESS}
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
          />
          <div
            className={descriptionExtended ? styles.extensionDescription : ''}
          >
            <FormattedMessage {...MSG.description} />
          </div>
          {descriptionExtended && (
            <div className={styles.descriptionExtended}>
              <FormattedMessage
                {...descriptionExtended}
                values={{
                  link1: descriptionLinks?.[1],
                  link2: descriptionLinks?.[2],
                }}
              />
            </div>
          )}
          {extraInitParams && (
            <div className={styles.inputContainer}>
              {displayParams(extraInitParams, formikBag, true)}
              <Heading
                appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
                text={MSG.initParams}
              />
            </div>
          )}
          <div className={styles.inputContainer}>
            {displayParams(initializationParams, formikBag, false)}
          </div>
          {extraInitParams && <div className={styles.divider} />}
          <IconButton
            appearance={{ theme: 'primary', size: 'large' }}
            onClick={() => handleSubmit()}
            text={{ id: 'button.confirm' }}
            loading={isSubmitting}
            disabled={
              !isValid ||
              Object.values(formikBag?.status || {}).some((value) => !!value)
            }
          />
        </div>
      )}
    </ActionForm>
  );
};

export default ExtensionSetup;
