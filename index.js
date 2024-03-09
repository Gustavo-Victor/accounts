import chalk from "chalk"; 
import inquirer from "inquirer"; 
import fs from "node:fs"; 

async function operation() {
    try {
        const response = await inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "What operation do you want to perform on the system?",
                choices: [
                    "Create account",
                    "Check balance",
                    "Deposit",
                    "Withdraw",
                    "Exit"
                ]
            }
        ]); 

        const { action } = response; 
        console.log(action); 
        
    } catch (err) {
        console.log(err); 
    }
}

operation(); 