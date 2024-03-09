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
            break;
            case DEPOSIT: 
            break;
            case WITHDRAW: 
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
                message: "\nEnter a name for the account: "
             },
        ]); 

        const { accountName } = response; 

        if(!accountName) {
            // throw new Error("Account name is required."); 
            console.log(chalk.bgRed.black("Account name is required")); 
            buildAccount();
            return ;
        }
        
        console.info(accountName); 

        if(!fs.existsSync("user_accounts")) {
            fs.mkdirSync("user_accounts"); 
        }

        if(fs.existsSync(`./user_accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black("This account already exists. Choose another name."));
            buildAccount(); 
            return ;
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


// deposit


// withdraw


operation(); 
