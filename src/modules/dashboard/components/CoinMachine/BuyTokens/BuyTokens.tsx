import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { FormikProps } from 'formik';
import { AddressZero } from 'ethers/constants';
import { BigNumber, bigNumberify } from 'ethers/utils';
import Decimal from 'decimal.js';
import toFinite from 'lodash/toFinite';
import { useMediaQuery } from 'react-responsive';

import Heading from '~core/Heading';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import ExternalLink from '~core/ExternalLink';
import { ActionForm, Input, InputStatus } from '~core/Fields';
import Numeral from '~core/Numeral';
import Button from '~core/Button';
import EthUsd from '~core/EthUsd';
import { SpinnerLoader } from '~core/Preloaders';

import {
  Colony,
  useLoggedInUser,
  useCoinMachineSaleTokensQuery,
  useUserTokensQuery,
  useUserWhitelistStatusQuery,
  useCoinMachineHasWhitelistQuery,
} from '~data/index';
import { ActionTypes } from '~redux/index';
import {
  getTokenDecimalsWithFallback,
  getFormattedTokenValue,
} from '~utils/tokens';
import { getMainClasses } from '~utils/css';
import { mapPayload, withMeta, pipe } from '~utils/actions';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { CM_LEARN_MORE } from '~externalUrls';

import GetWhitelisted from '../GetWhitelisted';

import { query700 as query } from '~styles/queries.css';
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
  accountWhitelisted: {
    id: 'dashbord.CoinMachine.BuyWidget.accountWhitelisted',
    defaultMessage: 'Your account is whitelisted. 😎',
  },
  soldOut: {
    id: 'dashbord.CoinMachine.BuyWidget.soldOut',
    defaultMessage: 'Sold Out',
  },
});

type Props = {
  colony: Colony;
  isSoldOut: boolean;
  salePriceData?: any;
  maxUserPurchaseData?: any;
  loadingSalePrice: boolean;
  loadingMaxUserPurchase: boolean;
  /*
   * @NOTE This acts like an indicator that the sale is not currently active
   */
  isCurrentlyOnSale: boolean;
};

interface FormValues {
  amount: string;
}

const displayName = 'dashboard.CoinMachine.BuyTokens';

const validationSchema = (userBalance: string, tokenDecimals: number) => {
  const uncappedUserBalance = new Decimal(userBalance).div(
    new Decimal(10).pow(tokenDecimals),
  );
  const formattedUserBalance = getFormattedTokenValue(
    userBalance,
    tokenDecimals,
  );

  let amountFieldValidation = yup
    .number()
    .transform((value) => toFinite(value))
    .moreThan(0)
    .max(
      uncappedUserBalance.toNumber(),
      `The amount must be less or equal to ${formattedUserBalance}`,
    );

  if (tokenDecimals === 0) {
    amountFieldValidation = amountFieldValidation.integer();
  }

  return yup.object().shape({
    amount: amountFieldValidation,
  });
};

const BuyTokens = ({
  colony: { colonyAddress, colonyName },
  isCurrentlyOnSale,
  isSoldOut,
  salePriceData,
  maxUserPurchaseData,
  loadingSalePrice,
  loadingMaxUserPurchase,
}: Props) => {
  const { username, ethereal, walletAddress } = useLoggedInUser();
  const history = useHistory();

  const userHasProfile = !!username && !ethereal;

  const {
    data: saleTokensData,
    loading: loadingSaleTokens,
  } = useCoinMachineSaleTokensQuery({
    variables: { colonyAddress },
  });

  const {
    data: whitelistState,
    loading: loadingCoinMachineWhitelistState,
  } = useCoinMachineHasWhitelistQuery({
    variables: { colonyAddress },
  });
  const isWhitelistExtensionEnabled =
    whitelistState?.coinMachineHasWhitelist || false;

  const {
    data: userWhitelistStatusData,
    loading: userStatusLoading,
  } = useUserWhitelistStatusQuery({
    variables: { colonyAddress, userAddress: walletAddress },
    skip: !isWhitelistExtensionEnabled,
  });

  const isUserWhitelisted =
    userWhitelistStatusData?.userWhitelistStatus?.userIsWhitelisted;
  const { data: userTokenData, loading: loadingUserToken } = useUserTokensQuery(
    {
      variables: { address: walletAddress },
    },
  );

  const sellableToken = saleTokensData?.coinMachineSaleTokens?.sellableToken;
  const purchaseToken = saleTokensData?.coinMachineSaleTokens?.purchaseToken;

  const userPurchaseToken = userTokenData?.user?.tokens.find(
    ({ address: userTokenAddress }) =>
      userTokenAddress === purchaseToken?.address,
  );
  const userPurchaseTokenBalance = getFormattedTokenValue(
    userPurchaseToken?.balance || '0',
    purchaseToken?.decimals || 18,
  );

  const currentSalePrice = getFormattedTokenValue(
    salePriceData?.coinMachineCurrentPeriodPrice || '0',
    purchaseToken?.decimals || 18,
  );

  const getFormattedCost = useCallback(
    (amount) => {
      const decimalCost = new Decimal(toFinite(amount))
        .times(salePriceData?.coinMachineCurrentPeriodPrice || '0')
        .toFixed(0, Decimal.ROUND_HALF_UP);

      return getFormattedTokenValue(
        decimalCost.toString(),
        purchaseToken?.decimals,
      );
    },
    [salePriceData, purchaseToken],
  );

  const globalDisable =
    !isCurrentlyOnSale ||
    !userHasProfile ||
    (isWhitelistExtensionEnabled && !isUserWhitelisted);

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

  const sellableTokenDecimals = sellableToken
    ? sellableToken.decimals
    : DEFAULT_TOKEN_DECIMALS;

  const maxUserPurchase: BigNumber = useMemo(() => {
    if (
      maxUserPurchaseData?.coinMachineCurrentPeriodMaxUserPurchase &&
      salePriceData?.coinMachineCurrentPeriodPrice &&
      userPurchaseToken?.balance &&
      purchaseToken
    ) {
      const userTokenBalance = bigNumberify(userPurchaseToken.balance);
      const maxContractPurchase =
        maxUserPurchaseData.coinMachineCurrentPeriodMaxUserPurchase;
      const currentPeriodPrice = bigNumberify(
        salePriceData?.coinMachineCurrentPeriodPrice || 0,
      );
      const currentPrice = currentPeriodPrice.gt(0)
        ? currentPeriodPrice
        : bigNumberify(1);

      const maxUserBalancePurchase = userTokenBalance
        /*
      when we divide by a number with moved decimal our final number
      gets smaller by the '10 * the number of 0 that are added'
      so we need to counteract it by multiplying it back
      */
        .mul(
          bigNumberify(10).pow(
            getTokenDecimalsWithFallback(purchaseToken.decimals),
          ),
        )
        .div(currentPrice);
      if (maxUserBalancePurchase.gt(maxContractPurchase)) {
        return bigNumberify(maxContractPurchase);
      }
      return maxUserBalancePurchase;
    }
    return bigNumberify(0);
  }, [maxUserPurchaseData, salePriceData, userPurchaseToken, purchaseToken]);

  const handleSetMaxAmount = useCallback(
    (event, setFieldValue) => {
      if (!globalDisable) {
        event.preventDefault();
        event.stopPropagation();

        const maxAmount = new Decimal(maxUserPurchase.toString())
          .div(
            new Decimal(10).pow(
              getTokenDecimalsWithFallback(sellableTokenDecimals),
            ),
          )
          .toString();
        /*
         * @NOTE This will set the max amount a user can buy
         * Either the max tokens available this period, or the user's total purchase
         * tokens balance, whichever is smaller
         */
        setFieldValue('amount', maxAmount);
      }
    },
    [globalDisable, maxUserPurchase, sellableTokenDecimals],
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

  const isMobile = useMediaQuery({ query });

  if (
    loadingSaleTokens &&
    loadingUserToken &&
    loadingSalePrice &&
    userStatusLoading &&
    loadingCoinMachineWhitelistState &&
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
        disabled: isSoldOut,
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
        <div className={styles.helpWrapper}>
          <QuestionMarkTooltip
            tooltipText={MSG.helpTooltip}
            tooltipPopperOptions={{
              placement: isMobile ? 'left' : 'top',
            }}
            tooltipClassName={styles.tooltip}
          />
        </div>
      </div>
      {isCurrentlyOnSale ? (
        <div className={styles.form}>
          <ActionForm
            initialValues={{
              amount: '0',
            }}
            validationSchema={validationSchema(
              maxUserPurchase.toString(),
              sellableTokenDecimals,
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
                      disabled={globalDisable || isSoldOut || isSubmitting}
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
                                  suffix={purchaseToken?.symbol}
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
                          disabled={isSoldOut || isSubmitting}
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
                      <div>{!isSoldOut ? currentSalePrice : 'N/A'}</div>
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
                                !isSoldOut ? parseFloat(currentSalePrice) : 0
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
                      {!isSoldOut ? (
                        <div>
                          {values.amount ? getFormattedCost(values.amount) : ''}
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
                                  ? toFinite(values.amount) *
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
                  {isWhitelistExtensionEnabled && !isUserWhitelisted ? (
                    <GetWhitelisted
                      colonyAddress={colonyAddress}
                      userStatus={userWhitelistStatusData?.userWhitelistStatus}
                    />
                  ) : (
                    <Button
                      type="submit"
                      text={isSoldOut ? MSG.soldOut : MSG.buyLabel}
                      appearance={{ theme: 'primary', size: 'large' }}
                      onClick={() => handleSubmit()}
                      loading={isSubmitting}
                      disabled={
                        globalDisable ||
                        isSoldOut ||
                        !isValid ||
                        toFinite(values.amount) <= 0 ||
                        isSubmitting
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
                href={CM_LEARN_MORE}
              />
            </div>
          </div>
          <div className={styles.accountStatus}>
            {isWhitelistExtensionEnabled && (
              <>
                {!isUserWhitelisted ? (
                  <GetWhitelisted
                    colonyAddress={colonyAddress}
                    userStatus={userWhitelistStatusData?.userWhitelistStatus}
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
