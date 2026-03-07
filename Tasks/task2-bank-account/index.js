// Bank Account Simulator
// Demonstrates: closures, prototypal inheritance, currying, call/apply/bind, callbacks, modules

// ---- Base Account using Closure + Prototype ----
function Account(owner, initialBalance = 0) {
  // Private balance using closure
  let balance = initialBalance;
  let transactionHistory = [];

  // Public owner property
  this.owner = owner;

  // Privileged methods (they have access to private balance)
  this.getBalance = function () {
    return balance;
  };

  this.deposit = function (amount) {
    if (amount <= 0) throw new Error('Deposit amount must be positive.');
    balance += amount;
    transactionHistory.push({ type: 'deposit', amount, date: new Date().toISOString() });
    console.log(`  [${this.owner}] Deposited $${amount}. Balance: $${balance}`);
    this._checkLowBalance(balance); // trigger callback
    return this;
  };

  this.withdraw = function (amount) {
    if (amount <= 0) throw new Error('Withdrawal amount must be positive.');
    if (amount > balance) throw new Error('Insufficient funds!');
    balance -= amount;
    transactionHistory.push({ type: 'withdrawal', amount, date: new Date().toISOString() });
    console.log(`  [${this.owner}] Withdrew $${amount}. Balance: $${balance}`);
    this._checkLowBalance(balance);
    return this;
  };

  this.getHistory = function () {
    return [...transactionHistory]; // return a copy
  };
}

// Prototype methods shared across all Account instances
Account.prototype._checkLowBalance = function (balance) {
  if (balance < 100 && typeof this.onLowBalance === 'function') {
    this.onLowBalance(balance);
  }
};

Account.prototype.transfer = function (targetAccount, amount) {
  console.log(`  [Transfer] ${this.owner} → ${targetAccount.owner}: $${amount}`);
  this.withdraw(amount);
  targetAccount.deposit(amount);
};

Account.prototype.printStatement = function () {
  console.log(`\n  📄 Statement for: ${this.owner}`);
  const history = this.getHistory();
  if (history.length === 0) {
    console.log('    No transactions yet.');
  } else {
    history.forEach((t, i) => {
      console.log(`    ${i + 1}. ${t.type.padEnd(12)} $${t.amount}  (${t.date})`);
    });
  }
  console.log(`    Current Balance: $${this.getBalance()}`);
};

// ---- SavingsAccount: inherits from Account ----
function SavingsAccount(owner, initialBalance, interestRate = 0.05) {
  // Call parent constructor
  Account.call(this, owner, initialBalance);

  this.interestRate = interestRate;
}

// Set up prototype chain
SavingsAccount.prototype = Object.create(Account.prototype);
SavingsAccount.prototype.constructor = SavingsAccount;

// Add method specific to SavingsAccount
SavingsAccount.prototype.applyInterest = function () {
  const interest = this.getBalance() * this.interestRate;
  console.log(`  [${this.owner}] Applying interest: $${interest.toFixed(2)} (${this.interestRate * 100}%)`);
  this.deposit(interest);
};

// ---- CheckingAccount: inherits from Account ----
function CheckingAccount(owner, initialBalance, overdraftLimit = 200) {
  Account.call(this, owner, initialBalance);
  this.overdraftLimit = overdraftLimit;
}

CheckingAccount.prototype = Object.create(Account.prototype);
CheckingAccount.prototype.constructor = CheckingAccount;

// Override withdraw to allow overdraft
CheckingAccount.prototype.withdraw = function (amount) {
  if (amount <= 0) throw new Error('Withdrawal amount must be positive.');
  if (amount > this.getBalance() + this.overdraftLimit) {
    throw new Error(`Exceeds overdraft limit of $${this.overdraftLimit}`);
  }
  // Use the parent Account's deposit to reduce balance (trick using call)
  // Actually just directly adjust - for a student level, we call parent logic via call:
  Account.prototype.withdraw.call(this, amount);
};

// ---- Currying: Fee Calculator ----
function createFeeCalculator(feePercent) {
  return function (amount) {
    return function (transactionType) {
      const fee = (feePercent / 100) * amount;
      console.log(`  [Fee] ${transactionType} of $${amount}: fee = $${fee.toFixed(2)} (${feePercent}%)`);
      return fee;
    };
  };
}

// ---- Account Factory Function (for module export) ----
function createAccount(type, owner, balance, extra) {
  if (type === 'savings') return new SavingsAccount(owner, balance, extra);
  if (type === 'checking') return new CheckingAccount(owner, balance, extra);
  return new Account(owner, balance);
}

// ---- Function Borrowing with call/apply/bind ----
function demonstrateFunctionBorrowing(savings, checking) {
  console.log('\n--- Function Borrowing (call/apply/bind) ---');

  // call: borrow printStatement from savings to use on checking
  console.log('  Using call:');
  Account.prototype.printStatement.call(checking);

  // apply: same but with apply (array of args, here no args needed)
  console.log('  Using apply:');
  Account.prototype.printStatement.apply(savings);

  // bind: create a bound function for later use
  const printSavings = Account.prototype.printStatement.bind(savings);
  console.log('  Using bind (called later):');
  printSavings();
}

// ---- Main Demo ----
console.log('========== BANK ACCOUNT SIMULATOR ==========\n');

// Create accounts
const alice = new SavingsAccount('Alice', 500, 0.05);
const bob = new CheckingAccount('Bob', 300, 200);

// Set up low balance callbacks (event-like)
alice.onLowBalance = (bal) => {
  console.log(`  ⚠️  [ALERT] Alice's balance is low: $${bal.toFixed(2)}`);
};
bob.onLowBalance = (bal) => {
  console.log(`  ⚠️  [ALERT] Bob's balance is low: $${bal.toFixed(2)}`);
};

console.log('--- Initial State ---');
console.log(`  Alice (Savings) balance: $${alice.getBalance()}`);
console.log(`  Bob (Checking) balance: $${bob.getBalance()}`);

console.log('\n--- Deposits ---');
alice.deposit(200);
bob.deposit(50);

console.log('\n--- Withdrawals ---');
alice.withdraw(560); // will trigger low balance alert
bob.withdraw(200);

console.log('\n--- Apply Interest (Savings) ---');
alice.deposit(300); // top up first
alice.applyInterest();

console.log('\n--- Transfer ---');
alice.transfer(bob, 100);

console.log('\n--- Fee Calculator (Currying) ---');
const internationalFee = createFeeCalculator(2.5);
internationalFee(1000)('International Transfer');
internationalFee(500)('Wire Transfer');

const atmFee = createFeeCalculator(1.5);
atmFee(200)('ATM Withdrawal');

console.log('\n--- Statements ---');
alice.printStatement();
bob.printStatement();

demonstrateFunctionBorrowing(alice, bob);

// Module export
module.exports = { createAccount, Account, SavingsAccount, CheckingAccount };
