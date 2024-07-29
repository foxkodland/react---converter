import { useState, useEffect, useRef } from "react"

export default function Converter() {
    const listCurencies = ["RUB", "USD", "EUR", "GBP"]

    const currentCurencyFrom = useRef("USD")
    const currentCurencyTo = useRef("RUB")
    const rates = useRef({})

    const [inputFrom, setInputFrom] = useState(1)
    const [inputTo, setInputTo] = useState(0)


    async function getApiRates() {
        const res = await fetch("https://www.cbr-xml-daily.ru/daily_json.js")
        let result = await res.json()
        // api отдаёт цены в рублях, поэтому добавлю RUB со стоимостью 1
        result["Valute"]["RUB"] = { "Value": 1 }
        rates.current = result["Valute"]
        convertFrom()
    }
    useEffect(() => {
        getApiRates();
    }, []);


    function convertFrom(value = 0) {
        if (!value) { value = inputFrom }
        const newCount = value * rates.current[currentCurencyFrom.current]["Value"] / rates.current[currentCurencyTo.current]["Value"]
        setInputTo(newCount.toFixed(2))
    }

    function convertTo(value = 0) {
        if (!value) { value = inputTo }
        const newCount = value * rates.current[currentCurencyTo.current]["Value"] / rates.current[currentCurencyFrom.current]["Value"]
        setInputFrom(newCount.toFixed(2))
    }

    return (
        <>
            <div className="converter-wrap">
                <div className="converter">
                    <div className="converter__list">
                        {listCurencies.map(currency =>
                            <div className={`converter__item ${currentCurencyFrom.current == currency ? "converter__item--accent" : ""}`}
                                key={currency}
                                onClick={() => { currentCurencyFrom.current = currency; convertFrom() }}
                            >{currency}</div>
                        )}
                    </div>
                    <input className="converter__input" type="number"
                        value={inputFrom}
                        onChange={(event) => { setInputFrom(event.target.value); convertFrom(event.target.value) }} />
                </div>

                <div className="converter">
                    <div className="converter__list">
                        {listCurencies.map(currency =>
                            <div className={`converter__item ${currentCurencyTo.current == currency ? "converter__item--accent" : ""}`}
                                key={currency}
                                onClick={() => { currentCurencyTo.current = currency; convertTo() }}
                            >{currency}</div>
                        )}
                    </div>
                    <input className="converter__input" type="number"
                        value={inputTo}
                        onChange={(event) => { setInputTo(event.target.value); convertTo(event.target.value) }} />
                </div>
            </div>
        </>
    )
}