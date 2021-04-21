import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow'

const BASE_URL = 'http://api.exchangeratesapi.io/latest?access_key=38f26f75a3516407513c2e5e96749d43'

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  let toAmount, fromAmount
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = Math.round(amount * exchangeRate*1000)/1000
  } else {
    toAmount = amount
    fromAmount = Math.round((amount / exchangeRate)*1000)/1000
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {
        const firstCurrency = Object.keys(data.rates)[0]
        setCurrencyOptions([...Object.keys(data.rates)])
        setToCurrency(firstCurrency)
        setExchangeRate(data.rates[firstCurrency]/data.rates["INR"])
      })
  }, [])

  useEffect(() => {
    if (toCurrency != null) {
      fetch(BASE_URL)
        .then(res => res.json())
        .then(data => {
          setExchangeRate(data.rates[toCurrency]/data.rates["INR"])
        })
    }
  }, [toCurrency])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <>
      <div class="glass">
        <h1>Convert</h1>
        <h3>{fromAmount} INR is equals to <br/><span>{toAmount}</span>{toCurrency}</h3>
        <CurrencyRow
          currencyOptions={["INR"]}
          selectedCurrency={"INR"}
          onChangeCurrency={null}
          onChangeAmount={handleFromAmountChange}
          amount={fromAmount}
        />
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrency={toCurrency}
          onChangeCurrency={e => setToCurrency(e.target.value)}
          onChangeAmount={handleToAmountChange}
          amount={toAmount}
        />
      </div>
    </>
  );
}

export default App;