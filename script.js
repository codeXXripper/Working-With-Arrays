'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
<div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
<div class="movements__date">3 days ago</div>
<div class="movements__value">${mov}€</div>
</div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
  //mdn element.insertAdjacentHTML
};

// displayMovements(account1.movements);

const calcPrintBal = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

// calcPrintBal(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}€ `;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€ `;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€ `;
};

const createUN = function (acc) {
  acc.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUN(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(currentAcc.movements);

  //Display balance
  calcPrintBal(currentAcc);

  //Display summary
  calcDisplaySummary(currentAcc);
};

let currentAcc;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAcc = accounts.find(acc => acc.username === inputLoginUsername.value);
  //mdn array.find
  // console.log(currentAcc);

  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back , ${
      currentAcc.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAcc);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(amount, receiverAcc);
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAcc.balance >= amount &&
    receiverAcc?.username !== currentAcc.username
  ) {
    //Doing tht transfer
    currentAcc.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Update the UI
    updateUI(currentAcc);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAcc.movements.some(mov => mov >= amount * 0.1)) {
    currentAcc.movements.push(amount);
    //mdn array.some
    //mdn array.every

    updateUI(currentAcc);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAcc.username &&
    Number(inputClosePin.value) === currentAcc.pin
  ) {
    const currentAccIndx = accounts.findIndex(
      acc => acc.username === currentAcc.username
    );
    //mdn array.findIndex

    //Delete the user account
    accounts.splice(currentAccIndx, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAcc.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/* const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
 */
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*
let arr = ['a', 'b', 'c', 'd', 'e'];

//SLICE

console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-1));
console.log(arr.slice(1, -1));
console.log(arr.slice());
console.log([...arr]);

//SPLICE

// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

//REVERSE   - mutate the array

arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['f', 'g', 'h', 'i', 'j'];
console.log(arr2.reverse());
console.log(arr2);

//CONCAT

const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

//JOIN
console.log(letters.join(' - '));
*/

//AT method

/* 
const arr = [23, 11, 44];
console.log(arr[0]);
console.log(arr.at(0));

//getting last array elements

console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);

console.log(arr.at(-1));
console.log('izzy'.at(-1));
 */

/* 
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const movement of movements) {
  if (movement > 0) {
    // console.log(`You deposited ${movement}`);
  } else {
    // console.log(`You withdraw ${Math.abs(movement)}`);
  }
}

movements.forEach(function (mov, i, array) {
  if (mov > 0) {
    console.log(`mov ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`mov ${i + 1}: You withdraw ${Math.abs(mov)}`);
  }
});
 */

/* 
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

//Map

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//SET

const currenciesUnique = new Set(['USD','GBP','USD','EUR'])
console.log(currenciesUnique);
currenciesUnique.forEach(function(value,_,map){
  console.log(`${value}: ${value}`);

}) */

//MAP method

/* 
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const rate = 1.1;

const movUSD = movements.map(mov => mov * rate);
console.log(movUSD);

const newMov =movements.map((mov,i)=> `Mov ${i+1}: You ${mov >0 ? 'deposited' :'withdraw'} ${Math.abs(mov)}`);
console.log(newMov);
 */

/*

//mdn array.map

//FILTER METHOD


// const deposits = movements.filter(function(mov){
//   return mov > 0
// });
// console.log(deposits);

// const withdrawals = movements.filter(mov => mov <0);
// console.log(withdrawals);

//mdn array.filter

//REDUCE METHOD

const balance = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balance);

//mdn array.reduce

const maximum = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);

// console.log(maximum);

// Challenge number 1
//mdn array.slice
const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice();
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);
  // console.log(dogsJuliaCorrected);
  const dogs = dogsJuliaCorrected.concat(dogsKate);
  console.log(dogs);
  // const printAge =dogs.map((mov,i)=> `Dog number ${i+1} is ${mov >5 ? 'an adult, and is' :'still a puppy'`));
  dogs.forEach(function (value, key) {
    if (value >= 3)
      console.log(`Dog number ${key + 1} is  and ${value} years old`);
    else console.log(`Dog number ${key + 1}  'still a puppy 🐶'`);
  });
};

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

const calcAvgHumanAge = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((sum, cur, i, arr) => sum + cur / arr.length, 0);

const avg1 = calcAvgHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAvgHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2);


const eurToUsd = 1.1;

const totalDepositUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    return mov * eurToUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);
  
  // console.log(totalDepositUSD);
 //mdn array.reduce

//Find method

 const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

 const firstWithdrawal = movements.find(mov => mov <0);

 console.log(movements);
 console.log(firstWithdrawal);

 //mdn array.find


 console.log(accounts);

 const account = accounts.find(acc => acc.owner === 'Jessica Davis');
 console.log(account);  

//FLAT
const movements = [[[200, 450, [-400, [3000, -650]]]], [-130, 70, 1300]];
// console.log(movements.flat(4).sort((a, b) => a - b));

// const overAllBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);

//Flat map

const overAllBalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

// console.log(overAllBalance);

// mdn array.flatmap

const x = new Array(7);
// console.log(x);
// console.log(x.map(()=> 5));

x.fill(1, 3, 5);
// console.log(x);

//Array .From function

const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});

//////////////////////////////////////////////////////

//Array methods exercises

//1
const depositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);

// console.log(depositSum);

//2.
// const numDeposits1k = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 1000).length;

const numDeposits1k = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
// console.log(numDeposits1k);

//3.
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    {
      deposits: 0,
      withdrawals: 0,
    }
  );

console.log(deposits, withdrawals);

//4.

const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};

console.log(convertTitleCase('this is a test title'));
console.log(convertTitleCase('this is a SHORT title but we will see'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
 */

//////////////////////////////////////////////////////

/* coding challenge

Coding Challenge #4
Julia and Kate are still studying dogs, and this time they are studying if dogs are
eating too much or too little.
Eating too much means the dog's current food portion is larger than the
recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10%
above and 10% below the recommended portion (see hint).
Your tasks:
1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate
the recommended food portion and add it to the object as a new property. Do
not create a new array, simply loop over the array. Formula:
recommendedFood = weight ** 0.75 * 28. (The result is in grams of
food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too
little. Hint: Some dogs have multiple owners, so you first need to find Sarah in
the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much
('ownersEatTooMuch') and an array with all owners of dogs who eat too little
('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and
Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat
too little!"
5. Log to the console whether there is any dog eating exactly the amount of food
that is recommended (just true or false)
6. Log to the console whether there is any dog eating an okay amount of food
(just true or false)
7. Create an array containing the dogs that are eating an okay amount of food (try
to reuse the condition used in 6.)
8. Create a shallow copy of the 'dogs' array and sort it by recommended food
portion in an ascending order (keep in mind that the portions are inside the
array's objects 😉)
The Complete JavaScript Course
25Hints:
§
Use many different tools to solve these challenges, you can use the summary
lecture to choose between them 😉
§
Being within a range 10% above and below the recommended portion means:
current > (recommended * 0.90) && current < (recommended *
1.10). Basically, the current portion should be between 90% and 110% of the
recommended portion.
Test data:

GOOD LUCK 😀

*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

/* 
const createUN = function (acc) {
  acc.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};









.reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    {
      deposits: 0,
      withdrawals: 0,
    }




 */
// console.log(dogs);

//Task number 1

dogs.forEach(
  el => (el.recommendedFood = (el.weight / 1000) ** 0.75 * 28 * 1000)
);

console.log(dogs);
//mdn array.foreach

//Task number 2
const findSarah = dogs
  .flatMap(dog =>
    dog.owners.map(owners => ({
      recommended: dog.recommendedFood,
      current: dog.curFood,
      owners,
    }))
  )
  .filter(dogOwner => dogOwner.owners === 'Sarah')
  .filter((el, cur) => {
    if (el.recommended >= el.cur) {
      // console.log('Eating too much');
    } else {
      // console.log('Eating too little');
    }
  });

// console.log(findSarah);

//Task number 3
const ownersEatTooMuch = dogs.map(dog => ({
  recommended: dog.recommendedFood,
  current: dog.curFood,
  owners: dog.owners.flat(1),
}));

// .filter((el, cur) => {
//   el.cur >= el.recommended;
// });

console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .flatMap(dog =>
    dog.owners.map(owners => ({
      recommended: dog.recommendedFood,
      current: dog.curFood,
      owners,
    }))
  )
  .filter((el, cur) => {
    el.cur < el.recommended;
  });

console.log(ownersEatTooLittle);
