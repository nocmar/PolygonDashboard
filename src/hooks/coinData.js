import { useEffect, useState } from "react";
import { useMoralisQuery } from "react-moralis";
import { tokenValue, tokenValueTxt, n6 } from "../utils";

const API_KEY = "YOUR COVALENT API KEY";
export const useCoinData = () => {
  const bridgeAddress = "0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf";
  const {
    data: tokens,
    error,
    isLoading, isFetching
  } = useMoralisQuery("EthTokenBalance", (query) =>
    query
      .equalTo("address", bridgeAddress)
      .notEqualTo("balance", "0")
      .limit(300)
  );
  const [coinList, setCoinList] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  useEffect(() => {
    if (!isLoading) {
      const tokensAttr = tokens.map((token) => token.attributes);
      const tickers = tokensAttr.map((token) => token.symbol);
      const listOfTickers = encodeURIComponent(tickers.join());
      const url = `https://api.covalenthq.com/v1/pricing/tickers/?key=${API_KEY}&tickers=${listOfTickers}`;

      // fetch coin price data by ID ?? skad ten fetch
      fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": true,
          Accept: "application/json",
        },
      })
        .then((response) => response && response.json())
        .then((data) => {
          const tokenPrices = data.data.items;
          let totalBalance = 0;
          const newList = tokensAttr.map((token) => {
            const tokenPrice = tokenPrices.find(
              (price) => price.contract_address === token.token_address
            );
            const output = { ...token };
            if (tokenPrice) {
              output.price = tokenPrice.quote_rate; // nie wiem jaki bedzie resposne z tego covalnt api
              output.logo_url = tokenPrice.logo_url;
              output.amount = tokenValue(+output.balance, +output.decimals);
              output.value = output.price ? output.amount * output.price : 0;
              totalBalance += output.value;
              output.amountTxt = tokenValueTxt(
                +output.balance,
                +output.decimals,
                output.symbol
              );
            }
            return output;
          });
          const sortedList = newList
            .filter((t) => t.value && t.value > 0)
            .sort((a, b) => b.value - a.value);
          setCoinList(sortedList);
          setPortfolioValue(totalBalance);
        })
        .catch((error) => console.log(error));
    } else {
      setCoinList([]);
    }
  }, [tokens]);

  return { coinList, isLoading, portfolioValue };
};
