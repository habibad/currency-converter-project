const BASE_URL = "https://v6.exchangerate-api.com/v6/7a9df268d36488e657910f1a/latest/USD";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const result = document.querySelector(".result");


for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
  }

  const fromCurrency = fromCurr.value;
  const toCurrency = toCurr.value;

  fetch(BASE_URL)
    .then((resp) => {
      if (!resp.ok) throw new Error("Failed to fetch exchange rates.");
      return resp.json();
    })
    .then((data) => {
      const fromExchangeRate = data.conversion_rates[fromCurrency];
      const toExchangeRate = data.conversion_rates[toCurrency];
      const convertedAmount = (amtVal / fromExchangeRate) * toExchangeRate;
      msg.innerHTML = `${amtVal} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    })
    .catch((error) => {
      msg.innerText = "Error fetching data: " + error.message;
    });
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
