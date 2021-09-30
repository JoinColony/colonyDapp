import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import Heading from '~core/Heading';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';

import { FieldSet, Form, FormStatus, Input, Toggle } from '~core/Fields';
import Button from '~core/Button';
import { AnyUser } from '~data/index';
import ExternalLink from '~core/ExternalLink';
import { DEFAULT_NETWORK_INFO } from '~constants';
import styles from './UserProfileEdit.css';
import stylesAdvance from './UserAdvanceSettings.css';

const MSG = defineMessages({
  heading: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.heading',
    defaultMessage: 'Advanced settings',
  },
  metaDesc: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.metaDesc',
    defaultMessage: `You have turned off metatransactions. Please, make sure to switch to xDai RPC in your Metamask.`,
  },
  headingEndpoints: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.headingEndpoints',
    defaultMessage: 'Endpoints (optional)',
  },
  endpointsDesc: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.endpointsDesc',
    defaultMessage:
      'Specify your own endpoints for interacting with 3rd party services.',
  },
  labelMetaTx: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.labelMetaTx',
    defaultMessage: `Metatransactions ({isOn, select,
      true {off}
      false {on}
    })`,
  },
  labelRPC: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.labelRPC',
    defaultMessage: 'Ethereum RPC',
  },
  labelGraph: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.labelGraph',
    defaultMessage: 'The Graph',
  },
  labelReputationOracle: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.labelReputationOracle',
    defaultMessage: 'Reputation Oracle',
  },
  labelIPFS: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.labelIPFS',
    defaultMessage: 'IPFS',
  },
  tooltip: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.tooltip',
    defaultMessage: `Metatransactions are turned on by default. 
    If you would rather connect directly to xDai chain,
    and pay for your own transactions, you can turn them off 
    by switching the toggle at any time. {br}{br} Please note,
    this setting is stored locally in your browser,
    if you clear your cache you will need to turn Metatransactions off again.`,
  },
  tokensLink: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.tokensLink',
    defaultMessage: 'Microcopy: {link}',
  },
});

const displayName = 'users.UserProfileEdit.UserAdvanceSettings';

interface FormValues {
  metatransactions: boolean;
  ethereumRPC?: string;
  graph?: string;
  reputationOracle?: string;
  ipfs?: string;
}

interface Props {
  user: AnyUser;
}

const validationSchema = yup.object({
  metatransactions: yup.boolean(),
  ethereumRPC: yup.string().nullable(),
  graph: yup.string().nullable(),
  reputationOracle: yup.string().nullable(),
  ipfs: yup.string().url().nullable(),
});

const UserAdvanceSettings = ({ user }: Props) => {
  const tokensLink = (link) => (
    <div className={stylesAdvance.linkWrapper}>
      <FormattedMessage
        {...MSG.tokensLink}
        values={{
          link: <ExternalLink href={link} />,
        }}
      />
    </div>
  );
  return (
    <>
      <Form<FormValues>
        initialValues={{
          metatransactions: true,
          ethereumRPC: user.profile.username || undefined,
          graph: undefined,
          reputationOracle: undefined,
          ipfs: undefined,
        }}
        validationSchema={validationSchema}
        onSubmit={() => {}}
      >
        {({ status, isSubmitting }) => (
          <div className={styles.main}>
            <Heading
              appearance={{ theme: 'dark', size: 'medium' }}
              text={MSG.heading}
            />
            <div className={stylesAdvance.toggleContainer}>
              <Toggle
                label={MSG.labelMetaTx}
                labelValues={{ isOn: false }}
                name="metatransactions"
              />
              <QuestionMarkTooltip
                tooltipText={MSG.tooltip}
                tooltipTextValues={{ br: <br /> }}
                className={stylesAdvance.tooltipContainer}
                tooltipClassName={stylesAdvance.tooltipContent}
                tooltipPopperProps={{
                  placement: 'right',
                }}
              />
            </div>
            <div className={stylesAdvance.metaDesc}>
              <FormattedMessage {...MSG.metaDesc} />
            </div>
            <Heading
              appearance={{ theme: 'dark', size: 'medium' }}
              text={MSG.headingEndpoints}
            />
            <div className={stylesAdvance.endpointsDesc}>
              <FormattedMessage {...MSG.endpointsDesc} />
            </div>
            <FieldSet className={styles.inputFieldSet}>
              <Input
                label={MSG.labelRPC}
                name="ethereumRPC"
                appearance={{ colorSchema: 'grey' }}
              />
              {DEFAULT_NETWORK_INFO.tokenExplorerLink &&
                tokensLink(DEFAULT_NETWORK_INFO.tokenExplorerLink)}
              <Input
                label={MSG.labelGraph}
                appearance={{ colorSchema: 'grey' }}
                name="graph"
              />
              {DEFAULT_NETWORK_INFO.tokenExplorerLink &&
                tokensLink(DEFAULT_NETWORK_INFO.tokenExplorerLink)}
              <Input
                label={MSG.labelReputationOracle}
                appearance={{ colorSchema: 'grey' }}
                name="reputationOracle"
              />
              {DEFAULT_NETWORK_INFO.tokenExplorerLink &&
                tokensLink(DEFAULT_NETWORK_INFO.tokenExplorerLink)}
              <Input
                label={MSG.labelIPFS}
                appearance={{ colorSchema: 'grey' }}
                name="ipfs"
              />
              {DEFAULT_NETWORK_INFO.tokenExplorerLink &&
                tokensLink(DEFAULT_NETWORK_INFO.tokenExplorerLink)}
            </FieldSet>
            <Button
              type="submit"
              text={{ id: 'button.save' }}
              loading={isSubmitting}
            />
            <FormStatus status={status} />
          </div>
        )}
      </Form>
    </>
  );
};

UserAdvanceSettings.displayName = displayName;

export default UserAdvanceSettings;
