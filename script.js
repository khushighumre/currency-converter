const BASE_URL = "https://api.currencyapi.com/v3/latest";
const API_KEY = "cur_live_PTRhZwHMpPtfptzhd2Lrt1yCLHJrCJUrRzEVe3kv"; // Use your actual API key here
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdown options
for (let select of dropdowns) {
  for (let currCode in countryList) {
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

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = parseFloat(amount.value);

  if (isNaN(amtVal) || amtVal <= 0) {
    amtVal = 1;
    amount.value = "1";
  }

  // Construct the API URL with base and target currencies
  const URL = `${BASE_URL}?apikey=${API_KEY}&base_currency=${fromCurr.value}&currencies=${toCurr.value}`;
  console.log("Fetching exchange rate from:", URL); // Debugging output

  try {
    let response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let data = await response.json();
    let rate = data.data[toCurr.value].value;

    if (rate) {
      let finalAmount = (amtVal * rate).toFixed(2);
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } else {
      msg.innerText = "Exchange rate unavailable.";
    }
  } catch (error) {
    msg.innerText = "Error fetching exchange rate. Please try again later.";
    console.error("Error fetching exchange rate:", error); // Detailed error output for debugging
  }
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
