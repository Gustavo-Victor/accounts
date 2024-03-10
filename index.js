// dependencies
import chalk from "chalk"; 
import inquirer from "inquirer"; 
import fs from "node:fs"; 


// constants / operations
const CREATE_ACCOUNT = "Create account"; 
const CHECK_BALANCE = "Check balance";
const DEPOSIT = "Deposit"; 
const WITHDRAW = "Withdraw";
const EXIT = "Exit"; 


// operation
async function operation() {
    try {
        const response = await inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "What operation do you want to perform on the system?",
                choices: [
                    CREATE_ACCOUNT,
                    CHECK_BALANCE,
                    DEPOSIT,
                    WITHDRAW,
                    EXIT
                ]
            }
        ]); 

        const { action } = response; 
        
        switch(action) {
            case CREATE_ACCOUNT: 
                createAccount(); 
            break; 
            case CHECK_BALANCE: 
                getAccountBalance();
            break;
            case DEPOSIT: 
                deposit();
            break;
            case WITHDRAW: 
                withdraw(); 
            break;
            case EXIT:
                console.log(chalk.bgBlue.black("Thank you for using Accounts."));
                process.exit();   
        }

    } catch (error) {
        console.log(chalk.bgRed.black(error)); 
    }
}


//create account 
function createAccount() {
    console.log(chalk.bgGreen.black("Thank you for choosing our bank!")); 
    console.log(chalk.green("Set your account options below: ")); 
    buildAccount(); 
}


async function buildAccount() {
    try {
        const response = await inquirer.prompt([
            { 
                name: "accountName",
                message: "Enter a name for the account: "
             },
        ]); 

        const { accountName } = response; 

        if(!accountName) {
            // throw new Error("Account name is required."); 
            console.log(chalk.bgRed.black("Account name is required.")); 
            return buildAccount(); 
        }
        
        console.info(accountName); 

        if(!fs.existsSync("user_accounts")) {
            fs.mkdirSync("user_accounts"); 
        }

        if(fs.existsSync(`./user_accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black("This account already exists. Choose another name."));
            return buildAccount(); 
        }

        fs.writeFileSync(`./user_accounts/${accountName}.json`, `{"balance": 0}`, (err) => {
            if(err) {
                throw new Error (err); 
            }
        }); 

        console.log(chalk.green("Congratulations! The account was successfully created!")); 
        operation(); 
        
    } catch (error) {
        console.log(chalk.bgRed.black(error));
    }
} 


// check balance
async function getAccountBalance() {
    try {
        const response = await inquirer.prompt([
            {
                name: "accountName",
                message: "Enter the name of the account: "
            }
        ]); 

        const { accountName } = response; 

        if(!accountName) {
            console.log(chalk.bgRed.black("Account name is required."));
            return getAccountBalance(); 
        }

        if(!accountExists(accountName)) {
            return operation(); 
        }

        const accountInfo = getAccount(accountName); 
        const { balance } = accountInfo; 

        console.log(chalk.bgBlue.black(`The current balance is $${parseFloat(balance)}`));
        return operation(); 
    } catch (error) {
        console.log(chalk.bgRed.black(error)); 
    }
}


// deposit
async function deposit() {
    try {
        const response = await inquirer.prompt([
            {
                name: "accountName",
                message: "Which account would you like to deposit into?"
            }
        ]); 

        const { accountName } = response; 
        
        if (!accountName) {
            console.log(chalk.bgRed.black("Account name is required")); 
            return deposit(); 
        }

        if(!accountExists(accountName)) {
            return operation(); 
        }

        addAmount(accountName); 
    } catch (error) {
        console.log(chalk.bgRed.black(error)); 
    }
}


// withdraw
async function withdraw() {
    try {
        const response = await inquirer.prompt([
            {
                name: "accountName",
                message: "Enter the name of the account: "
            }
        ]); 
        const { accountName } = response; 

        if(!accountName) {
            console.log(chalk.bgRed("Account name is required.")); 
            return withdraw(); 
        }

        if(!accountExists(accountName)) {
            return operation(); 
        }

        removeAmount(accountName);         

    } catch (error) {
        console.log(chalk.bgRed.black(error)); 
    }
}


// remove amount from account
async function removeAmount(accountName) {
    try {
        const accountInfo = getAccount(accountName); 
        const withdrawResponse = await inquirer.prompt([
            {
                name: "amount",
                message: "How much would you like to withdraw?"
            }
        ]); 

        const { amount } = withdrawResponse; 

        if(!amount) {
            console.log(chalk.bgRed.black("Amount is required."));
            return removeAmount(accountName); 
        }

        if(isNaN(Number(amount))) {
            console.log(chalk.bgRed.black("Amount must be a number.")); 
            return removeAmount(accountName); 
        }

        const { balance } = accountInfo; 
        if(parseFloat(balance) < parseFloat(amount)) {
            console.log(chalk.bgRed.black("Insufficient funds."));
            return removeAmount(accountName); 
        }

        accountInfo.balance = parseFloat(balance) - parseFloat(amount); 
        const accountJSON = JSON.stringify(accountInfo); 

        fs.writeFileSync(`./user_accounts/${accountName}.json`, accountJSON, (err) => {
            if(err) {
                throw new Error("Failed to withdraw."); 
            }
        })
    
        console.log(chalk.green(`$${parseFloat(amount)} was withdrawn from the account.`));
        return operation(); 
    } catch (error) {
        console.log(chalk.bgRed.black(error));
    }
}


// check if account exists
function accountExists(accountName) {
    if(!fs.existsSync(`./user_accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black("This account does not exist. Choose another name!")); 
        return false; 
    } 
    return true; 
}


// add ammount 
async function addAmount(accountName) {
    try {
        const amountResponse = await inquirer.prompt([
            {
                name: "amount",
                message: "Which amount would you like to deposit into the account?"
            }
        ]); 

        let { amount } = amountResponse; 

        if(!String(amount)) {
            console.log(chalk.bgRed.black("Amount is required.")); 
            return addAmount(accountName); 
        }

        if(isNaN(Number(amount))) {
            console.log(chalk.bgRed.black("Amount must be a number.")); 
            return addAmount(accountName); 
        }

        // deposit
        const accountObj = getAccount(accountName); 
        accountObj.balance = parseFloat(amount) + parseFloat(accountObj.balance);
        const accountJSON = JSON.stringify(accountObj);

        fs.writeFileSync(`./user_accounts/${accountName}.json`, accountJSON, (err) => {
            if(err) {
                throw new Error("Failed to deposit."); 
            }            
        }); 

        console.log(chalk.green(`The amount of $${parseFloat(amount)} was deposited into the account.`)); 
        return operation();         
    } catch (error) {
        console.log(chalk.bgRed.black(error)); 
    }
}


// get account data
function getAccount(accountName) {
    try {
        const accountJSON = fs.readFileSync(`./user_accounts/${accountName}.json`, {
            encoding: "utf-8",
            flag: "r"
        }, (err) => {
            if(err) {
                throw new Error("This account does not exist."); 
            }
        });

        return JSON.parse(accountJSON); 
    } catch (error) {
        console.log(chalk.bgRed.black(error)); 
        return false;
    }

    
}


// start application
operation(); 
