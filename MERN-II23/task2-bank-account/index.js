// Bank Account Simulator
// closures for private balance, prototypal inheritance for savings/checking
// currying for fee calculators, call apply bind demo

// base Account using closure + prototype
function Account(owner, initialBalance) {
  initialBalance = initialBalance || 0

  // private balance - cant access from outside (closure)
  let balance = initialBalance
  let history = []

  this.owner = owner

  this.getBalance = function () {
    return balance
  }

  this.deposit = function (amount) {
    if (amount <= 0) throw new Error('deposit must be positive')
    balance += amount
    history.push({ type: 'deposit', amount: amount, date: new Date().toISOString() })
    console.log(this.owner + ' deposited $' + amount + ' | balance: $' + balance)
    // check if balance is low
    this._checkLowBalance(balance)
    return this
  }

  this.withdraw = function (amount) {
    if (amount <= 0) throw new Error('amount must be positive')
    if (amount > balance) throw new Error('not enough money!')
    balance -= amount
    history.push({ type: 'withdrawal', amount: amount, date: new Date().toISOString() })
    console.log(this.owner + ' withdrew $' + amount + ' | balance: $' + balance)
    this._checkLowBalance(balance)
    return this
  }

  this.getHistory = function () {
    return [...history]
  }
}

// prototype methods - shared by all Account instances
Account.prototype._checkLowBalance = function (balance) {
  if (balance < 100 && typeof this.onLowBalance === 'function') {
    this.onLowBalance(balance)
  }
}

Account.prototype.transfer = function (targetAccount, amount) {
  console.log('Transfer: ' + this.owner + ' to ' + targetAccount.owner + ' $' + amount)
  this.withdraw(amount)
  targetAccount.deposit(amount)
}

Account.prototype.printStatement = function () {
  console.log('\nStatement for: ' + this.owner)
  const hist = this.getHistory()
  if (hist.length === 0) {
    console.log('  no transactions yet')
  } else {
    hist.forEach(function(t, i) {
      console.log('  ' + (i+1) + '. ' + t.type + ' $' + t.amount)
    })
  }
  console.log('  balance: $' + this.getBalance())
}

// SavingsAccount extends Account using prototypal inheritance
function SavingsAccount(owner, initialBalance, interestRate) {
  // call parent constructor
  Account.call(this, owner, initialBalance)
  this.interestRate = interestRate || 0.05
}

// set up the prototype chain
SavingsAccount.prototype = Object.create(Account.prototype)
SavingsAccount.prototype.constructor = SavingsAccount

SavingsAccount.prototype.applyInterest = function () {
  const interest = this.getBalance() * this.interestRate
  console.log(this.owner + ' interest: $' + interest.toFixed(2))
  this.deposit(interest)
}

// CheckingAccount extends Account
function CheckingAccount(owner, initialBalance, overdraftLimit) {
  Account.call(this, owner, initialBalance)
  this.overdraftLimit = overdraftLimit || 200
}

CheckingAccount.prototype = Object.create(Account.prototype)
CheckingAccount.prototype.constructor = CheckingAccount

// override withdraw to allow overdraft
CheckingAccount.prototype.withdraw = function (amount) {
  if (amount <= 0) throw new Error('amount must be positive')
  if (amount > this.getBalance() + this.overdraftLimit) {
    throw new Error('exceeds overdraft limit of $' + this.overdraftLimit)
  }
  Account.prototype.withdraw.call(this, amount)
}

// currying for fee calculator
// returns a function that returns another function
function createFeeCalculator(feePercent) {
  return function (amount) {
    return function (transactionType) {
      const fee = (feePercent / 100) * amount
      console.log(transactionType + ' fee on $' + amount + ': $' + fee.toFixed(2))
      return fee
    }
  }
}

// factory function - exported as module
function createAccount(type, owner, balance, extra) {
  if (type === 'savings') return new SavingsAccount(owner, balance, extra)
  if (type === 'checking') return new CheckingAccount(owner, balance, extra)
  return new Account(owner, balance)
}

// demonstrate call apply bind
function showFunctionBorrowing(savings, checking) {
  console.log('\n--- call / apply / bind demo ---')

  // call - borrow method from savings and use on checking
  console.log('using call:')
  Account.prototype.printStatement.call(checking)

  // apply - same thing but with apply
  console.log('using apply:')
  Account.prototype.printStatement.apply(savings)

  // bind - create bound version for later
  const printLater = Account.prototype.printStatement.bind(savings)
  console.log('using bind:')
  printLater()
}

// --- main demo ---
console.log('=== BANK ACCOUNT SIMULATOR ===\n')

const alice = new SavingsAccount('Alice', 500, 0.05)
const bob = new CheckingAccount('Bob', 300, 200)

// low balance callbacks - event-like behavior
alice.onLowBalance = function(bal) {
  console.log('ALERT: Alice low balance $' + bal.toFixed(2))
}
bob.onLowBalance = function(bal) {
  console.log('ALERT: Bob low balance $' + bal.toFixed(2))
}

console.log('alice balance: $' + alice.getBalance())
console.log('bob balance: $' + bob.getBalance())

console.log('\n-- deposits --')
alice.deposit(200)
bob.deposit(50)

console.log('\n-- withdrawals --')
alice.withdraw(560) // should trigger low balance
bob.withdraw(200)

console.log('\n-- interest --')
alice.deposit(300)
alice.applyInterest()

console.log('\n-- transfer --')
alice.transfer(bob, 100)

console.log('\n-- fee calculator (currying) --')
const intlFee = createFeeCalculator(2.5)
intlFee(1000)('International Transfer')
intlFee(500)('Wire')

const atmFee = createFeeCalculator(1.5)
atmFee(200)('ATM')

console.log('\n-- statements --')
alice.printStatement()
bob.printStatement()

showFunctionBorrowing(alice, bob)

module.exports = { createAccount, Account, SavingsAccount, CheckingAccount }
