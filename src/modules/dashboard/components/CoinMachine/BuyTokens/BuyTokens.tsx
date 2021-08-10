import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { FormikProps } from 'formik';
import { AddressZero } from 'ethers/constants';
import { formatEther, bigNumberify } from 'ethers/utils';

import Heading from '~core/Heading';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import ExternalLink from '~core/ExternalLink';
import { ActionForm, Input, InputStatus } from '~core/Fields';
import Numeral from '~core/Numeral';
import Button from '~core/Button';
import EthUsd from '~core/EthUsd';
import { SpinnerLoader } from '~core/Preloaders';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';

import {
  Colony,
  useLoggedInUser,
  useCoinMachineSaleTokensQuery,
  useCoinMachineCurrentPeriodPriceQuery,
  useCoinMachineCurrentPeriodMaxUserPurchaseQuery,
  useUserTokensQuery,
  useWhitelistPolicyQuery,
} from '~data/index';
import { ActionTypes } from '~redux/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { getMainClasses } from '~utils/css';
import { mapPayload, withMeta, pipe } from '~utils/actions';

import styles from './BuyTokens.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.CoinMachine.BuyTokens.title',
    defaultMessage: `Buy {tokenSymbol}`,
  },
  helpTooltip: {
    id: 'dashboard.CoinMachine.BuyTokens.helpTooltip',
    defaultMessage: `This is where you buy tokens. You put how much you want in the amount field and click the big green buy button. It’s really quite self explanatory.`,
  },
  amountLabel: {
    id: 'dashboard.CoinMachine.BuyTokens.amountLabel',
    defaultMessage: 'Amount',
  },
  userBalanceLabel: {
    id: 'dashboard.CoinMachine.BuyTokens.userBalanceLabel',
    defaultMessage: 'Balance {amount}',
  },
  maxBalanceLabel: {
    id: 'dashboard.CoinMachine.BuyTokens.maxBalanceLabel',
    defaultMessage: 'Max',
  },
  priceLabel: {
    id: 'dashboard.CoinMachine.BuyTokens.priceLabel',
    defaultMessage: 'Price',
  },
  costLabel: {
    id: 'dashboard.CoinMachine.BuyTokens.costLabel',
    defaultMessage: 'Cost',
  },
  buyLabel: {
    id: 'dashboard.CoinMachine.BuyTokens.buyLabel',
    defaultMessage: 'Buy',
  },
  mainMessage: {
    id: 'dashbord.CoinMachine.BuyWidget.mainMessage',
    defaultMessage: 'Coin Machine is empty.\nPlease come back later.',
  },
  tellMore: {
    id: 'dashbord.CoinMachine.BuyWidget.tellMore',
    defaultMessage: 'Tell me more',
  },
  getWhitelisted: {
    id: 'dashbord.CoinMachine.BuyWidget.getWhitelisted',
    defaultMessage: 'Get whitelisted',
  },
  accountWhitelisted: {
    id: 'dashbord.CoinMachine.BuyWidget.accountWhitelisted',
    defaultMessage: 'Your account is whitelisted. 😎',
  },
});

const TELL_ME_MORE_LINK = '';

type Props = {
  colony: Colony;
  /*
   * @NOTE This acts like an indicator that the sale is not currently active
   */
  disabled?: boolean;
};

interface FormValues {
  amount: string;
}

const displayName = 'dashboard.CoinMachine.BuyTokens';

const validationSchema = (userBalance: number) =>
  yup.object().shape({
    amount: yup.number().moreThan(0).max(userBalance),
  });

const BuyTokens = ({ colony: { colonyAddress, colonyName }, disabled }: Props) => {
  const { username, ethereal, walletAddress } = useLoggedInUser();
  const history = useHistory();

  const {
    data: saleTokensData,
    loading: loadingSaleTokens,
  } = useCoinMachineSaleTokensQuery({
    variables: { colonyAddress },
  });

  const { isWhitelistExtensionEnabled } = useEnabledExtensions({
    colonyAddress,
  });

  const {
    data: whitelistPolicyData,
    loading: whitelistLoading,
  } = useWhitelistPolicyQuery({
    variables: { colonyAddress, userAddress: walletAddress },
    skip: !isWhitelistExtensionEnabled,
  });

  const isUserApproved = whitelistPolicyData?.whitelistPolicy?.userIsApproved;
  /* Wire in is sale started logic */
  const isSale = true;
  const { data: userTokenData, loading: loadingUserToken } = useUserTokensQuery(
    {
      variables: { address: walletAddress },
    },
  );

  const {
    data: salePriceData,
    loading: loadingSalePrice,
  } = useCoinMachineCurrentPeriodPriceQuery({
    variables: { colonyAddress },
    fetchPolicy: 'network-only',
  });

  const {
    data: maxUserPurchaseData,
    loading: loadingMaxUserPurchase,
  } = useCoinMachineCurrentPeriodMaxUserPurchaseQuery({
    variables: { colonyAddress, userAddress: walletAddress },
    fetchPolicy: 'network-only',
  });

  const sellableToken = saleTokensData?.coinMachineSaleTokens?.sellableToken;
  const purchaseToken = saleTokensData?.coinMachineSaleTokens?.purchaseToken;

  const userPurchaseToken = userTokenData?.user?.tokens.find(
    ({ address: userTokenAddress }) =>
      userTokenAddress === purchaseToken?.address,
  );
  const userPurchaseTokenBalance = formatEther(
    userPurchaseToken?.balance || '0',
  );

  const currentSalePrice = formatEther(
    salePriceData?.coinMachineCurrentPeriodPrice || '0',
  );

  const globalDisable = disabled || !username || ethereal;

  const handleInputFocus = useCallback(
    ({ amount }, setFieldValue) => {
      if (!globalDisable && amount === '0') {
        setFieldValue('amount', '');
      }
    },
    [globalDisable],
  );
  const handleInputBlur = useCallback(
    ({ amount }, resetForm, setFieldError) => {
      if (!globalDisable && !amount) {
        resetForm();
        setFieldError('amount', false);
      }
    },
    [globalDisable],
  );

  const maxUserPurchase = useMemo(() => {
    if (
      maxUserPurchaseData?.coinMachineCurrentPeriodMaxUserPurchase &&
      salePriceData?.coinMachineCurrentPeriodPrice &&
      userPurchaseToken?.balance
    ) {
      const userTokenBalance = bigNumberify(userPurchaseToken.balance);
      const maxPurchase =
        maxUserPurchaseData.coinMachineCurrentPeriodMaxUserPurchase;
      const currentPrice = salePriceData.coinMachineCurrentPeriodPrice;
      const maxPurchaseCost = bigNumberify(maxPurchase).mul(currentPrice);
      if (maxPurchaseCost.gt(userTokenBalance)) {
        return userTokenBalance;
      }
      return maxPurchaseCost;
    }
    return bigNumberify(0);
  }, [maxUserPurchaseData, salePriceData, userPurchaseToken]);

  const handleSetMaxAmount = useCallback(
    (event, setFieldValue) => {
      if (!globalDisable) {
        event.preventDefault();
        event.stopPropagation();
        /*
         * @NOTE This will set the max amount a user can buy
         * Either the max tokens available this period, or the user's total purchase
         * tokens balance, whichever is smaller
         */
        setFieldValue('amount', formatEther(maxUserPurchase));
      }
    },
    [globalDisable, maxUserPurchase],
  );
  const handleFormReset = useCallback((resetForm) => resetForm(), []);

  const transform = useCallback(
    pipe(
      mapPayload(({ amount }) => ({
        colonyAddress,
        amount,
        colonyName,
      })),
      withMeta({ history }),
    ),
    [],
  );

  if (
    loadingSaleTokens &&
    loadingUserToken &&
    loadingSalePrice &&
    whitelistLoading &&
    loadingMaxUserPurchase
  ) {
    return (
      <div className={styles.loader}>
        <SpinnerLoader appearance={{ size: 'huge', theme: 'primary' }} />
      </div>
    );
  }

  return (
    <div
      className={getMainClasses({}, styles, {
        disabled: globalDisable,
      })}
    >
      <div className={styles.heading}>
        <Heading
          appearance={{
            margin: 'none',
            size: 'medium',
            weight: 'bold',
            theme: 'dark',
          }}
          text={MSG.title}
          textValues={{ tokenSymbol: sellableToken?.symbol }}
        />
      </div>
      <QuestionMarkTooltip
        tooltipText={MSG.helpTooltip}
        className={styles.help}
        tooltipPopperProps={{
          placement: 'top',
        }}
        tooltipClassName={styles.tooltip}
      />
      {isSale ? (
        <div className={styles.form}>
          <ActionForm
            initialValues={{
              amount: '0',
            }}
            validationSchema={validationSchema(
              parseFloat(formatEther(maxUserPurchase)),
            )}
            submit={ActionTypes.COIN_MACHINE_BUY_TOKENS}
            error={ActionTypes.COIN_MACHINE_BUY_TOKENS_ERROR}
            success={ActionTypes.COIN_MACHINE_BUY_TOKENS_SUCCESS}
            transform={transform}
            onSuccess={(result, { resetForm }) => handleFormReset(resetForm)}
          >
            {({
              values,
              setFieldValue,
              isSubmitting,
              handleSubmit,
              isValid,
              errors,
              resetForm,
              setFieldError,
            }: FormikProps<FormValues>) => (
              <div>
                <div className={styles.inputContainer}>
                  <div
                    className={styles.inputComponent}
                    onClick={() => handleInputFocus(values, setFieldValue)}
                    onBlur={() =>
                      handleInputBlur(values, resetForm, setFieldError)
                    }
                    aria-hidden="true"
                  >
                    <Input
                      appearance={{ theme: 'minimal' }}
                      formattingOptions={{
                        numeral: true,
                        numeralPositiveOnly: true,
                        numeralDecimalScale: getTokenDecimalsWithFallback(
                          sellableToken?.decimals,
                        ),
                      }}
                      label={MSG.amountLabel}
                      name="amount"
                      disabled={globalDisable}
                      elementOnly
                    />
                    {errors?.amount && (
                      <div className={styles.fieldError}>
                        <InputStatus error={errors.amount} />
                      </div>
                    )}
                    {!globalDisable && (
                      <div className={styles.userBalance}>
                        <span>
                          <FormattedMessage
                            {...MSG.userBalanceLabel}
                            values={{
                              amount: (
                                <Numeral
                                  value={userPurchaseTokenBalance}
                                  truncate={2}
                                  suffix={` ${purchaseToken?.symbol}`}
                                />
                              ),
                            }}
                          />
                        </span>
                        <Button
                          text={MSG.maxBalanceLabel}
                          appearance={{ size: 'small', theme: 'blue' }}
                          onClick={(event) =>
                            handleSetMaxAmount(event, setFieldValue)
                          }
                        />
                      </div>
                    )}
                  </div>
                  <span
                    className={styles.nativeToken}
                    title={sellableToken?.name || undefined}
                  >
                    {sellableToken?.symbol}
                  </span>
                </div>
                <div className={styles.amountsContainer}>
                  <div className={styles.amounts}>
                    <div className={styles.amountsLabel}>
                      <FormattedMessage {...MSG.priceLabel} />
                    </div>
                    <div className={styles.amountsValues}>
                      <div>{!disabled ? currentSalePrice : 'N/A'}</div>
                      {
                        /*
                         * @NOTE only show the exchange rate if the token is XDAI/ETH
                         * since otherwise there's not place we can (currently) fetch
                         * this data
                         */
                        purchaseToken?.address === AddressZero && (
                          <div>
                            <EthUsd
                              appearance={{ theme: 'grey', size: 'small' }}
                              value={
                                /*
                                 * @NOTE Set value to 0 if amount is only the decimal point
                                 * Just entering the decimal point will pass it through to EthUsd
                                 * and that will try to fetch the balance for, which, obviously, will fail
                                 */
                                !disabled ? parseFloat(currentSalePrice) : 0
                              }
                            />
                          </div>
                        )
                      }
                    </div>
                  </div>
                  <div className={styles.symbols}>
                    {`${purchaseToken?.symbol}/${sellableToken?.symbol}`}
                  </div>
                </div>
                <div className={styles.amountsContainer}>
                  <div className={styles.amounts}>
                    <div className={styles.amountsLabel}>
                      <FormattedMessage {...MSG.costLabel} />
                    </div>
                    <div className={styles.amountsValues}>
                      {!disabled ? (
                        <div>
                          {values.amount
                            ? (
                                parseInt(values.amount, 10) *
                                parseFloat(currentSalePrice)
                              ).toFixed(2)
                            : ''}
                        </div>
                      ) : (
                        <div>N/A</div>
                      )}
                      {
                        /*
                         * @NOTE only show the exchange rate if the token is XDAI/ETH
                         * since otherwise there's not place we can (currently) fetch
                         * this data
                         */
                        purchaseToken?.address === AddressZero && (
                          <div>
                            <EthUsd
                              appearance={{ theme: 'grey', size: 'small' }}
                              value={
                                /*
                                 * @NOTE Set value to 0 if amount is only the decimal point
                                 * Just entering the decimal point will pass it through to EthUsd
                                 * and that will try to fetch the balance for, which, obviously, will fail
                                 */
                                values.amount
                                  ? parseInt(values.amount, 10) *
                                    parseFloat(currentSalePrice)
                                  : '0'
                              }
                            />
                          </div>
                        )
                      }
                    </div>
                  </div>
                  <div
                    className={styles.symbols}
                  >{`${purchaseToken?.symbol}`}</div>
                </div>
                <div className={styles.controls}>
                  {isWhitelistExtensionEnabled && !isUserApproved ? (
                    <Button
                      text={MSG.getWhitelisted}
                      appearance={{ theme: 'primary', size: 'large' }}
                      disabled={globalDisable}
                    />
                  ) : (
                    <Button
                      type="submit"
                      text={MSG.buyLabel}
                      appearance={{ theme: 'primary', size: 'large' }}
                      onClick={() => handleSubmit()}
                      loading={isSubmitting}
                      disabled={
                        globalDisable ||
                        !isValid ||
                        parseFloat(values.amount) <= 0
                      }
                    />
                  )}
                </div>
              </div>
            )}
          </ActionForm>
        </div>
      ) : (
        <>
          <div className={styles.mainMessage}>
            <FormattedMessage {...MSG.mainMessage} />
            <div>
              <ExternalLink
                className={styles.link}
                text={MSG.tellMore}
                href={TELL_ME_MORE_LINK}
              />
            </div>
          </div>
          <div className={styles.accountStatus}>
            {isWhitelistExtensionEnabled && (
              <>
                {!isUserApproved ? (
                  <Button
                    appearance={{ size: 'large', theme: 'primary' }}
                    text={MSG.getWhitelisted}
                  />
                ) : (
                  <div className={styles.statusMessage}>
                    <FormattedMessage {...MSG.accountWhitelisted} />
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

BuyTokens.displayName = displayName;

export default BuyTokens;
