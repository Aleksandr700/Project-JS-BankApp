"use strict";

const account1 = {
  owner: "Dmitrii Fokeev",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2024-05-13T17:01:17.194Z",
    "2024-05-14T17:23:17.929Z",
    "2024-05-15T10:51:36.790Z",
    // "2024-05-15T11:30:36.790Z",
  ],
  currency: "RUB",
  locale: "pt-PT",
};

const account2 = {
  owner: "Anna Filimonova",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
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
    // "2024-05-15T11:30:36.790Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Polina Filimonova",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,

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
  currency: "EUR",
  locale: "es-PE",
};

const account4 = {
  owner: "Stanislav Ivanchenko",
  movements: [430, 1000, 700, 50, 90],
  pin: 4444,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
  ],
  currency: "USD",
  locale: "ru-RU",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

alert("1) Login:df,Password:1111, 2)Login:af,Password:2222");

// Вывод на страницу всех приходов и уходов
function displayMovements(acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (value, i) {
    const type = value > 0 ? "deposit" : "withdrawal";
    const typeMessage = value > 0 ? "внесение" : "снятие";
    // создаем дату и через каждый аккаунт обращаемся к его свойству дат транзакций(к индексу)
    const date = new Date(acc.movementsDates[i]);
    // Перенесли в функцию dayMovements для работы "сегодня и вчера"
    // const year = date.getFullYear();
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const hour = `${date.getHours()}`.padStart(2, 0);
    // const minute = `${date.getMinutes()}`.padStart(2, 0);
    // // создаем переменную добавленную в html документ
    // const displayDate = `${day}/${month}/${year} ${hour}:${minute}`;
    const displayDate = dayMovements(date);

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${i + 1} ${typeMessage}
          </div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${value}₽</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

// Создание логина из ФИО в объекте
function createLogIn(accs) {
  accs.forEach(function (acc) {
    acc.logIn = acc.owner
      .toLowerCase()
      .split(" ")
      .map(function (val) {
        return val[0];
      })
      .join("");
  });
}
createLogIn(accounts);

// Подсчет и вывод на страницу общего баланса
function calcPrintBalance(acc) {
  acc.balance = acc.movements.reduce(function (acc, val) {
    return acc + val;
  });

  labelBalance.textContent = `${acc.balance} RUB`;
}

// Сумма и вывод на страницу прихода и ухода в footer
function calcDisplaySum(movements) {
  const incomes = movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}₽`;

  const out = movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}₽`;

  labelSumInterest.textContent = `${incomes + out}₽`;
}

//Обновление интерфейса сайта
function updateUi(acc) {
  displayMovements(acc);
  calcPrintBalance(acc);
  calcDisplaySum(acc.movements);
}

//Кнопка входа в аккаунт
let currentAccount;
let timer;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Login");
  currentAccount = accounts.find(function (acc) {
    return acc.logIn === inputLoginUsername.value;
  });
  console.log(currentAccount);
  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;

    inputLoginPin.value = inputLoginUsername.value = "";

    // Генерация даты после входа
    const local = navigator.language;
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "long",
      hour12: false,
    };
    labelDate.textContent = Intl.DateTimeFormat(local, options).format(
      new Date()
    );
    // в первую очередь!!! очистка таймера после взода в акк таймер сущуествует - true, он исчезнет
    // во избежание наложения таймера предидущего пользователя на таймер последующего пользователя
    if (timer) {
      clearInterval(timer);
    }
    // вторым действием!!! происходит включение таймера текущего пользователя
    timer = timeLogOut();
    updateUi(currentAccount);
  }
});

//Перевод денег на другой аккаунт
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const reciveAcc = accounts.find(function (acc) {
    return acc.logIn === inputTransferTo.value;
  });
  const amount = Number(inputTransferAmount.value);
  console.log(amount, reciveAcc);
  if (
    reciveAcc &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    reciveAcc.logIn !== currentAccount.logIn
  ) {
    currentAccount.movements.push(-amount);
    reciveAcc.movements.push(amount);
    // запись в массив принимающего аккаунта даты и времни поступления денег и корректное отображение
    reciveAcc.movementsDates.push(new Date().toISOString());
    // отображаем корректные даты и время новых,совершенных переводов
    // добавляем новую дату в массив(из дат и времни транзакций), при переводе денег на другой акк
    currentAccount.movementsDates.push(new Date().toISOString());
    // обновление таймера(запуск заново) при пополнении или переводе
    clearInterval(timer);
    // вкл таймер
    timer = timeLogOut();
    updateUi(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = "";
  }
});

//Удаление аккаунта
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.logIn &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.logIn === currentAccount.logIn;
    });
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    console.log(accounts);
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

//Внесение денег на счет
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0) {
    currentAccount.movements.push(amount);
    // Аналогично что и при переводах на другой акк
    currentAccount.movementsDates.push(new Date().toISOString());
    clearInterval(timer);
    timer = timeLogOut();
    updateUi(currentAccount);
  }
  inputLoanAmount.value = "";
});

// Общий баланс длинно
// const accMov = accounts.map(function (acc) {
//   return acc.movements;
// });
// const allMov = accMov.flat();

// const allBalance = allMov.reduce(function (acc, mov) {
//   return acc + mov;
// }, 0);
// console.log(allBalance);

// Общий баланс коротко
const overalBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

//Сортировка по приходам и уходам
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

//Изменение значка валюты
labelBalance.addEventListener("click", function () {
  Array.from(document.querySelectorAll(".movements__value"), function (val, i) {
    return (val.innerText = val.textContent.replace("₽", "RUB"));
  });
});

//-------------------------------------

// Добавление даты и времени

// // получаем настоящую дату
// const toDay = new Date();
// const year = toDay.getFullYear();
// // делаем из метода строчку, затем применяем метод padStart(если меньше двух чисел ставим в начало 0)
// const month = `${toDay.getMonth() + 1}`.padStart(2, 0);
// // аналогично с датой, для корректного отображения
// const date = `${toDay.getDate()}`.padStart(2, 0);
// const hour = `${toDay.getHours()}`.padStart(2, 0);
// const minute = `${toDay.getMinutes()}`.padStart(2, 0);
// // привычный визуальный вывод
// labelDate.textContent = `${date}/${month}/${year} ${hour}:${minute}`;

// пример расчета секунд,минут,часов,дней
// const future = new Date(2025, 3, 15);
// const now = new Date(2025, 2.13, 18, 38);
// const result = future.getTime() - now.getTime();
// // получили 26 дней по принципу(1 сек = 1000 милисек)
// // округлили через round чтобы не отображать возможные часы и минуты
// console.log(Math.round(result / 1000 / 60 / 60 / 24));

// Функция расчета прошедшего времени("вчера и сегодня")

function dayMovements(date) {
  // функциональное выражение расчета формулы для "вчера и сегодня"
  const calcDayPassed = function (day1, day2) {
    // 1000-милисек, 60-мин, 24-часа
    // округлили все выражение
    return Math.round((day1 - day2) / (1000 * 60 * 60 * 24));
  };
  // в параметрах новая дата и дата
  const dayPassed = calcDayPassed(new Date(), date);
  console.log(dayPassed);
  // логика 0-сегодня, 1-прошел 1 день
  if (dayPassed === 0) return "Сегодня";
  if (dayPassed === 1) return "Вчера";
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  const hour = `${date.getHours()}`.padStart(2, 0);
  const minute = `${date.getMinutes()}`.padStart(2, 0);
  return `${day}/${month}/${year} ${hour}:${minute}`;
}

// // Отображение дат через Intl.DateTimeFormat()

// // настройка через браузер определяет страну(любую), необходимо для сайтов с разными странами
// const local = navigator.language;
// // обьект для отображения свойств необходимых для корректного отображения
// const options = {
//   year: "numeric",
//   month: "numeric",
//   day: "numeric",
//   // например long и наоборот
//   weekday: "short",
//   hour: "numeric",
//   minute: "numeric",
//   second: "numeric",
//   timeZoneName: "long",
//   hour12: false,
// };
// const toDay = new Date();
// // передаем свойтсва и местность для получения времени и страны
// // через format передаем кокретную дату
// const ru = Intl.DateTimeFormat(local, options).format(toDay);
// console.log(ru);

// Числа
// const num = 5676456345;
// const locaL = navigator.language;
// const optionS = {
//   style: "currency",
//   currency: "RUB",
// };
// const rus = Intl.NumberFormat(locaL, optionS).format(num);
// console.log(rus);

//----------------------------------------

// Отложенный запуск функции

// выполняется 1 раз
// const timer1 = setTimeout(
//   function (word1, word2) {
//     console.log(`${word1},${word2}`);
//   },
//   // выполнится через 2 сек
//   2000,
//   // аргументы слово1 и слово2
//   "hello",
//   "world"
// );
// // бесконечное повторение
// const timer2 = setInterval(function () {
//   console.log("hi");
// }, 1000);
// // условия остановки функции
// // если верно то будет очистка функции и ничего не сработает
// if (true) {
//   clearTimeout(timer1);
//   clearInterval(timer2);
// }

// Установка таймера для сессии

function timeLogOut() {
  // 10 мин
  let time = 600;
  // функция моментального срабатывания таймера сразу после входа
  function startNow() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // класс для визуала
    labelTimer.textContent = `${min}:${sec}`;
    // закрытие приложения
    if (time == 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
    }
    // -1 сек
    time--;
  }
  startNow();
  // колбэк метода setInterval функция - startNow и минус - 1 сек
  const timer = setInterval(startNow, 1000);
  return timer;
}
