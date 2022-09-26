import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import * as yup from 'yup';
import { useApolloClient } from '@apollo/client';
import { useMediaQuery } from 'react-responsive';

import { WizardProps } from '~core/Wizard';
import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';

import { multiLineTextEllipsis } from '~utils/strings';
import ENS from '~lib/ENS';
import {
  useLoggedInUser,
  ColonyAddressDocument,
  ColonyAddressQuery,
  ColonyAddressQueryVariables,
} from '~data/index';
import { DEFAULT_NETWORK_INFO } from '~constants';
import { checkIfNetworkIsAllowed } from '~utils/networks';

import { query700 as query } from '~styles/queries.css';
import styles from './StepColonyName.css';

interface FormValues {
  displayName: string;
  colonyName: string;
  username: string;
}

type Props = WizardProps<FormValues>;

/**
 * @NOTE On the specific colony address type
 *
 * This came about as a result of hooking into the result of the colony query,
 * on the client side query, before it sends the result on to the server query,
 * and act upon that if that's in an error state (in which case, it won't actually
 * reach the server)
 */
type SuperSpecificColonyAddress = string | Error;

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.heading',
    defaultMessage: `Welcome @{username}, let's begin creating your colony.`,
  },
  descriptionOne: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.descriptionOne',
    defaultMessage: `What would you like to name your colony? Note, it is not possible to change it later.`,
  },
  colonyUniqueURLlabel: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.colonyUniqueURLlabel',
    defaultMessage: 'Colony Unique URL',
  },
  colonyNameLabel: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.colonyNameLabel',
    defaultMessage: 'Colony Name',
  },
  continue: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.Continue',
    defaultMessage: 'Continue',
  },
  errorDomainTaken: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.errorDomainTaken',
    defaultMessage: 'This colony domain name is already taken',
  },
  statusText: {
    id: 'users.CreateColonyWizard.StepColonyName.statusText',
    defaultMessage: 'Actual Colony Name: {normalized}',
  },
  tooltip: {
    id: 'users.CreateColonyWizard.StepColonyName.tooltip',
    defaultMessage: `We use ENS to create a .{displayENSDomain} subdomain for your colony. You can use this to create a custom URL and invite people to join your colony.`,
  },
  keyRequired: {
    id: 'users.CreateColonyWizard.StepColonyName.keyRequired',
    defaultMessage: `{key} is a required field`,
  },
});

const displayName = 'dashboard.CreateColonyWizard.StepColonyName';

const StepColonyName = ({
  wizardForm,
  nextStep,
  stepCompleted,
  wizardValues,
}: Props) => {
  const { formatMessage } = useIntl();
  const validationSchema = useMemo(
    () =>
      yup.object({
        colonyName: yup
          .string()
          .required(
            // use 'UI' fieldname in error message
            formatMessage(MSG.keyRequired, {
              key: formatMessage(MSG.colonyUniqueURLlabel),
            }),
          )
          .ensAddress(),
        displayName: yup.string().required(
          // use 'UI' fieldname in error message
          formatMessage(MSG.keyRequired, {
            key: formatMessage(MSG.colonyNameLabel),
          }),
        ),
      }),
    [formatMessage],
  );

  const apolloClient = useApolloClient();

  const checkDomainTaken = useCallback(
    async (values: FormValues) => {
      try {
        const { data } = await apolloClient.query<
          ColonyAddressQuery,
          ColonyAddressQueryVariables
        >({
          query: ColonyAddressDocument,
          variables: {
            name: values.colonyName,
          },
        });
        if (data && data.colonyAddress) {
          if (
            (data.colonyAddress as SuperSpecificColonyAddress) instanceof Error
          ) {
            return false;
          }
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    [apolloClient],
  );

  const { username, networkId } = useLoggedInUser();

  const [currentENSName, setCurrentENSName] = useState<string | undefined>();

  // @TODO debounce colony name validation
  // @BODY this is a bit harder than you'd expect.
  // We have to make sure that validation still works
  // and that the user can't just remove a character
  // quickly and then move on without the validation to happen.
  const validateDomain = useCallback(
    async (values: FormValues) => {
      if (values && currentENSName === values.colonyName) {
        return {};
      }
      try {
        // Let's check whether this is even valid first
        validationSchema.validateSyncAt('colonyName', values);
      } catch (caughtError) {
        // Just return. The actual validation will be done by the
        // validationSchema
        return {};
      }
      const taken = await checkDomainTaken(values);
      if (taken) {
        const errors = {
          colonyName: MSG.errorDomainTaken,
        };
        return errors;
      }
      setCurrentENSName(values.colonyName);
      return {};
    },
    [checkDomainTaken, currentENSName, validationSchema],
  );

  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);
  const isMobile = useMediaQuery({ query });
  return (
    <Form
      onSubmit={nextStep}
      validate={validateDomain}
      validationSchema={validationSchema}
      {...wizardForm}
    >
      {({ isValid, isSubmitting, dirty, values: { colonyName } }) => {
        const normalized = ENS.normalizeAsText(colonyName);
        return (
          <section className={styles.main}>
            <Heading appearance={{ size: 'medium', weight: 'medium' }}>
              <FormattedMessage
                {...MSG.heading}
                values={{
                  /*
                   * @NOTE We need to use a JS string truncate here, rather then CSS,
                   * since we're dealing with a string that needs to be truncated,
                   * inside a sentence that does not
                   */
                  username: (
                    <span
                      /*
                       * @NOTE Needed so the user can get the full username on hover
                       * (But still, if it's too long, the browser will trucate it)
                       */
                      title={ENS.normalizeAsText(
                        username || wizardValues.username,
                      )}
                    >
                      {multiLineTextEllipsis(
                        ENS.normalizeAsText(username || wizardValues.username),
                        38,
                      )}
                    </span>
                  ),
                }}
              />
            </Heading>
            <p className={styles.paragraph}>
              <FormattedMessage {...MSG.descriptionOne} />
            </p>
            <div className={styles.nameForm}>
              <Input
                appearance={{ theme: 'fat' }}
                name="displayName" // In Metatdata corresponds to: colonyDisplayName
                data-test="claimColonyDisplayNameInput"
                label={MSG.colonyNameLabel}
                disabled={!isNetworkAllowed || isSubmitting}
              />
              <Input
                appearance={{ theme: 'fat' }}
                name="colonyName" // In Metatdata corresponds to: colonyName
                data-test="claimColonyNameInput"
                // eslint-disable-next-line max-len
                extensionString={`.colony.${DEFAULT_NETWORK_INFO.displayENSDomain}`}
                label={MSG.colonyUniqueURLlabel}
                status={normalized !== colonyName ? MSG.statusText : undefined}
                formattingOptions={{ lowercase: true, blocks: [256] }}
                statusValues={{ normalized }}
                disabled={!isNetworkAllowed || isSubmitting}
                extra={
                  <QuestionMarkTooltip
                    tooltipText={MSG.tooltip}
                    tooltipTextValues={{
                      displayENSDomain: DEFAULT_NETWORK_INFO.displayENSDomain,
                    }}
                    className={styles.iconContainer}
                    tooltipClassName={styles.tooltipContent}
                    tooltipPopperOptions={
                      isMobile
                        ? {
                            placement: 'left',
                          }
                        : undefined
                    }
                  />
                }
              />
              <div className={styles.buttons}>
                <Button
                  appearance={{ theme: 'primary', size: 'large' }}
                  type="submit"
                  data-test="claimColonyNameConfirm"
                  disabled={
                    !isNetworkAllowed ||
                    !isValid ||
                    (!dirty && !stepCompleted) ||
                    isSubmitting
                  }
                  loading={isSubmitting}
                  text={MSG.continue}
                />
              </div>
            </div>
          </section>
        );
      }}
    </Form>
  );
};

StepColonyName.displayName = displayName;

export default StepColonyName;
