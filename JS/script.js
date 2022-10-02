"use strict";

////////// Elements
const loginSection = document.querySelector(".login");
const loginBtn = document.querySelector(".login--btn");
const usernameInput = document.querySelector(".username--input");
const passwordInput = document.querySelector(".password--input");

const loginMessage = document.querySelector(".login--message");
const dateVal = document.querySelector(".date--value");
const balanceVal = document.querySelector(".balance--value");

const timer = document.querySelector(".logout--timer");

const mainApp = document.querySelector(".main-app");
const movements = document.querySelector(".movements-list");

const transferBtn = document.querySelector(".transfer--btn");
const requestBtn = document.querySelector(".request--btn");
const closeBtn = document.querySelector(".close--btn");

const transferToInput = document.querySelector(".transfer--to--input");
const transferAmountInput = document.querySelector(".transfer--amount--input");
const requestInput = document.querySelector(".request--input");
const confirmUserInput = document.querySelector(".confirm--username--input");
const confirmPasswordInput = document.querySelector(
    ".confirm--password--input"
);

const sortBtn = document.querySelector(".sort--btn");
const inputSummary = document.querySelector(".input--summary");
const outputSummary = document.querySelector(".output--summary");
const interestSummary = document.querySelector(".interest--summary");

const summaryInputVal = document.querySelector(".summary--input--val");
const summaryOutputVal = document.querySelector(".summary--output--val");
const summaryInterestVal = document.querySelector(".summary--interest--val");

////////// Data
const eurToUsd = 1.1;

const account1 = {
    owner: "Jonas Schmedtmann",
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        "2019-11-18T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2020-04-01T10:17:24.185Z",
        "2020-05-08T14:11:59.604Z",
        "2020-05-27T17:01:17.194Z",
        "2020-07-11T23:36:17.929Z",
        "2020-07-12T10:51:36.790Z",
    ],
    currency: "EUR",
    locale: "pt-PT", // de-DE
};

const account2 = {
    owner: "Jessica Davis",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z",
        "2020-04-10T14:43:26.374Z",
        "2020-06-25T18:49:59.371Z",
        "2020-07-26T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
};

const accounts = [account1, account2];

////////// Functions

// Display the list of movements (widthrawals and deposits) and sort them
const displayMovement = function (acc, sort = false) {
    acc.movements.innerHTML = "";

    // Sort movements ascending/descending
    const movs = sort
        ? acc.movements.slice().sort((a, b) => a - b)
        : acc.movements;

    // Display the movements
    movs.forEach(function (mov, i) {
        const type = mov > 0 ? "deposit" : "withdrawal";

        const date = new Date(acc.movementsDates[i]);
        const day = `${date.getDate()}`.padStart(2, 0);
        const month = `${date.getMonth() + 1}`.padStart(2, 0);
        const year = date.getFullYear();
        const displayDate = `${day}/${month}/${year}`;

        const HTML = `
            <div class="movement --${type}">
                <span class="mov--number-type">No. ${
                    i + 1
                } &rarr; ${type.toUpperCase()}</span>
                <span class="mov--date">${displayDate}</span>
                <span class="mov--amount">${mov.toFixed(2)}€</span>
            </div>
        `;

        movements.insertAdjacentHTML("afterbegin", HTML);
    });
};

// Create usernames based on the initial letters of the owners' names
const createUsernames = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(" ")
            .map(currentEl => currentEl[0])
            .join("");
    });
};

// Calculate and display the total balance
const calcDisplayBalance = function (acc) {
    acc.balance = acc.movements.reduce((accum, curr) => accum + curr, 0);
    balanceVal.textContent = `${acc.balance.toFixed(2)}€`;
};

// Calculate the total deposit in USD
const totalDepositUSD = function (movs) {
    movs.filter(mov => mov > 0)
        .map(mov => mov * eurToUsd)
        .reduce((accum, curr) => accum + curr, 0);
};

// Calculate and display the total of deposits, widthrawals, and interests
const calcDisplaySummary = function (acc) {
    // Calculate and show the total of deposits
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((accum, curr) => accum + curr, 0);
    summaryInputVal.textContent = `${incomes.toFixed(2)}€`;

    // Calculate and show the total of widthrawals
    const outcome = acc.movements
        .filter(mov => mov < 0)
        .reduce((accum, curr) => accum + curr, 0);
    summaryOutputVal.textContent = `${Math.abs(outcome.toFixed(2))}€`;

    // Calculate and show the total of interests that are above 1€
    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * acc.interestRate) / 100)
        .filter(interest => interest >= 1)
        .reduce((accum, curr) => accum + curr, 0);
    summaryInterestVal.textContent = `${interest.toFixed(2)}€`;
};

const updateUI = function (acc) {
    // Calculate and display balance
    calcDisplayBalance(acc);

    // Calculate and display summary
    calcDisplaySummary(acc);

    // Display movements
    displayMovement(acc);
};

createUsernames(accounts);

////////// Event handlers
let currentAccount;

// Login
loginBtn.addEventListener("click", function (e) {
    e.preventDefault();

    currentAccount = accounts.find(acc => acc.username === usernameInput.value);
    if (currentAccount?.pin === +passwordInput.value) {
        // Display UI and welcome message
        loginMessage.textContent = `Welcome back, ${
            currentAccount.owner.split(" ")[0]
        }`;
        mainApp.style.display = "block";

        // Create current date and time
        const now = new Date();
        const day = `${now.getDate()}`.padStart(2, 0);
        const month = `${now.getMonth() + 1}`.padStart(2, 0);
        const year = now.getFullYear();
        const hours = `${now.getHours()}`.padStart(2, 0);
        const minutes = `${now.getMinutes()}`.padStart(2, 0);
        dateVal.textContent = `${day}/${month}/${year}, ${hours}:${minutes}`;

        // Clear input fields
        usernameInput.value = passwordInput.value = "";

        // Clear focus from input field
        passwordInput.blur();

        // Update UI
        updateUI(currentAccount);

        // Start/Restart logout timer
    }
});

// Transfer money
transferBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const amount = +transferAmountInput.value;
    const receiverAcount = accounts.find(
        acc => acc.username === transferToInput.value
    );

    transferAmountInput.value = transferToInput.value = "";
    transferToInput.blur();

    if (
        amount > 0 &&
        receiverAcount &&
        currentAccount.balance >= amount &&
        receiverAcount?.username !== currentAccount.username
    ) {
        // Transfer
        currentAccount.movements.push(-amount);
        receiverAcount.movements.push(amount);

        // Add transfer date
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAcount.movementsDates.push(new Date().toISOString());

        // Update UI
        updateUI(currentAccount);
    }
});

// Request loan
requestBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const amount = Math.floor(requestInput.value);

    // Accept loan if there is at least one deposit with 10% of the requested loan
    if (
        amount > 0 &&
        currentAccount.movements.some(mov => mov >= amount * 0.1)
    ) {
        //Add movement
        currentAccount.movements.push(amount);

        // Add loan date
        currentAccount.movementsDates.push(new Date().toISOString());
    }

    // Update UI
    requestInput.value = "";
    requestInput.blur();
    updateUI(currentAccount);
});

// Close account
closeBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (
        confirmUserInput.value === currentAccount.username &&
        +confirmPasswordInput.value === currentAccount.pin
    ) {
        // Delete Account
        accounts.splice(
            accounts.findIndex(acc => acc.username === currentAccount.username),
            1
        );

        // Hide the UI
        mainApp.style.display = "none";
        loginMessage.textContent = "Log in to get started!";
        confirmUserInput.value = confirmPasswordInput.value = "";
    }
});

// Sort the movements
// State var
let sorted = false;
sortBtn.addEventListener("click", function (e) {
    e.preventDefault();
    displayMovement(currentAccount.movements, !sorted);
    sorted = !sorted;
});

const jsonData = ` { "user": { "name": "Armin", "age": "24" } } `;
const jsObj = JSON.parse(jsonData);
console.log(jsObj);
console.log(jsObj.user.name);
console.log(JSON.stringify(jsObj));

debugger

var longestCommonPrefix = function (strs) {
    if (strs.length === 0) return "";

    let lengthArr = [];

    for (let i = 0; i < strs.length; i++) {
        lengthArr.push(strs[i].length);
    }

    const minLength = Math.min(...lengthArr);

    let prefix = strs[0].slice(0, minLength);
    for (let i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(prefix) !== 0) {
            prefix = prefix.slice(0, prefix.length - 1);
        }
    }
    return prefix;
};

longestCommonPrefix('a');