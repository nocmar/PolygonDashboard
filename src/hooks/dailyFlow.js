import { useEffect, useState } from "react";
import { useMoralisQuery } from "react-moralis";
import { tokenValue, getDate, addDays } from "../utils";

const API_KEY = "YOUR COVALENT API KEY";
const bridgeAddress = "0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf";
export const useDailyFlow = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    fetch: fetchQuery,
    data: tokens,
    error,
    isLoading,
  } = useMoralisQuery(
    "EthTokenTransfers",
    (query) => {
      return query
        .greaterThan("updatedAt", getDate(selectedDate)) // index by 0!!!
        .lessThan("updatedAt", addDays(selectedDate, 1))
        .limit(10000);
    },
    [selectedDate],
    {
      autoFetch: true,
    }
  );

  const {
    data: tokensBalance,
    error: errorBalance,
    isLoading: isLoadingBalance,
  } = useMoralisQuery("EthTokenBalance", (query) =>
    query
      .equalTo("address", bridgeAddress)
      .notEqualTo("balance", "0")
      .limit(300)
  );
  const [dailyCoins, setDailyCoins] = useState([]);
  const [totalInflow, setTotalInflow] = useState(0);
  const [totalOutflow, setTotalOutflow] = useState(0);
  const [txNr, setTxNr] = useState(0);

  function extendTokens(tokens, tokensBalance) {
    return tokens.map((token) => {
      const balanceToken = tokensBalance.find(
        (t) => t.token_address === token.token_address
      );
      if (balanceToken) {
        return {
          ...token,
          name: balanceToken.name,
          symbol: balanceToken.symbol,
          decimal: balanceToken.decimal,
        };
      } else {
        return { ...token };
      }
    });
  }

  useEffect(() => {
    fetchQuery();
  }, [selectedDate]);

  useEffect(() => {
    if (tokens?.length && tokensBalance?.length) {
      const extendedTokens = extendTokens(
        tokens.map((token) => token.attributes),
        tokensBalance.map((token) => token.attributes)
      );

      const inOutFlowItems = [];
      const tickers = [...new Set(extendedTokens.map((token) => token.symbol))];

      const listOfTickers = tickers.toString().replaceAll(",", "%2C");
      let txNumber = 0;

      const url = `https://api.covalenthq.com/v1/pricing/tickers/?key=${API_KEY}&tickers=${listOfTickers}`;
      // fetch coin price data by ID
      fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": true,
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const tokenPrices = data.data.items;
          tokenPrices.map((token) => {
            const decimal = +token.contract_decimals;
            const price = token.quote_rate;

            const transactionsIn = extendedTokens.filter(
              (t) =>
                t.token_address === token.contract_address &&
                t.to_address === bridgeAddress
            );

            const transactionsOut = extendedTokens.filter(
              (t) =>
                t.token_address === token.contract_address &&
                t.from_address === bridgeAddress
            );
            txNumber+=transactionsIn.length + transactionsOut.length;

            const totalAddressInflow = transactionsIn?.reduce((acc,val)=>acc+tokenValue(+val.value, decimal),0);
            
            const totalAddressOut = transactionsOut?.reduce((acc,val)=>acc+tokenValue(+val.value, decimal),0);

            inOutFlowItems.push({
              symbol: token.contract_ticker_symbol,
              name: token.contract_name,
              decimal,
              logo_url: token.logo_url,
              price,
              totalInflowValue: price ? totalAddressInflow * price : 0,
              totalOutflowValue: price ? totalAddressOut * price : 0,
            });
          });
          setTxNr(txNumber);
          const sortedItems = inOutFlowItems
            .sort((a, b) => b.totalInflowValue - a.totalInflowValue);

          const totalInflow = inOutFlowItems?.reduce((acc,val)=>(acc+val.totalInflowValue),0);
          setTotalInflow(totalInflow);
          const totalOutflow = inOutFlowItems?.reduce((acc,val)=>(acc+val.totalOutflowValue),0);
          setTotalOutflow(totalOutflow);

          setDailyCoins(sortedItems);

        })
        .catch((error) => console.log(error));
    } else {
      setDailyCoins([]);
    }
  }, [tokens]);

  return { dailyCoins, isLoading, totalInflow, totalOutflow,txNr, setSelectedDate };
};
