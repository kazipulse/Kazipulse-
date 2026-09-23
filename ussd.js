/*
 * KAZIPULSE USSD SYSTEM
 * Version 1.0
 */

const USERS = {};
const SESSIONS = {};

function mainMenu() {
    return `KaziPulse
1. Register
2. Mobile Number
3. Surveys
4. Loans
5. Transaction History
6. My Balance
7. Withdraw
8. Help
0. Exit`;
}


function loansMenu() {
    return `KaziPulse Loans

Loan Limit: KSh 70,000
Interest: 2.3%

1. Apply for Loan
2. Loan Status
3. Loan Balance
0. Back`;
}


function surveysMenu(user) {

    return `KaziPulse Surveys

1. Available Surveys
2. Completed Surveys
0. Back`;
}


function balanceMenu(user) {

    const balance = user.balance || 0;

    return `KaziPulse

Your Balance:
KSh ${balance.toFixed(2)}

0. Back`;
}


function helpMenu() {

    return `KaziPulse Help

1. How to Register
2. How Surveys Work
3. How Loans Work
4. Withdrawals
5. Contact Support
0. Back`;
}


function transactionMenu(user) {

    const transactions =
        user.transactions || [];

    if (transactions.length === 0) {

        return `Transaction History

No transactions found.

0. Back`;
    }

    let output =
        `Transaction History\n\n`;

    transactions
        .slice(-5)
        .reverse()
        .forEach((transaction, index) => {

            output +=
                `${index + 1}. ${transaction.type}
KSh ${transaction.amount}
${transaction.status}\n\n`;
        });

    output += `0. Back`;

    return output;
}


function withdrawMenu(user) {

    return `KaziPulse Withdraw

Available Balance:
KSh ${(user.balance || 0).toFixed(2)}

1. Withdraw to M-PESA
0. Back`;
}


/*
 * MAIN USSD HANDLER
 */

function handleUSSD(phoneNumber, input) {

    /*
     * Create user automatically from
     * the phone number making the USSD request.
     */

    if (!USERS[phoneNumber]) {

        USERS[phoneNumber] = {

            phone: phoneNumber,

            registered: false,

            balance: 0,

            loanLimit: 70000,

            loanInterest: 2.3,

            loanStatus: "No Active Loan",

            transactions: [],

            surveysCompleted: []

        };

    }


    const user = USERS[phoneNumber];


    /*
     * New session
     */

    if (!input || input === "") {

        SESSIONS[phoneNumber] = {
            level: "MAIN"
        };

        return mainMenu();
    }


    const session =
        SESSIONS[phoneNumber] ||
        { level: "MAIN" };


    /*
     * MAIN MENU
     */

    if (session.level === "MAIN") {

        switch (input) {

            case "1":

                session.level = "REGISTER_NAME";

                return "KaziPulse\n\nEnter your full name:";


            case "2":

                return `KaziPulse

Mobile Number:
${user.phone}

0. Back`;


            case "3":

                session.level = "SURVEYS";

                return surveysMenu(user);


            case "4":

                session.level = "LOANS";

                return loansMenu();


            case "5":

                session.level = "TRANSACTIONS";

                return transactionMenu(user);


            case "6":

                session.level = "BALANCE";

                return balanceMenu(user);


            case "7":

                session.level = "WITHDRAW";

                return withdrawMenu(user);


            case "8":

                session.level = "HELP";

                return helpMenu();


            case "0":

                delete SESSIONS[phoneNumber];

                return "Thank you for using KaziPulse.";


            default:

                return "Invalid option.\n\n" + mainMenu();
        }
    }


    /*
     * REGISTRATION
     */

    if (session.level === "REGISTER_NAME") {

        user.name = input;

        session.level = "REGISTER_EMAIL";

        return "Enter your email address:";
    }


    if (session.level === "REGISTER_EMAIL") {

        user.email = input;

        user.registered = true;

        user.registrationNumber =
            "KZP-" +
            Math.floor(
                100000 +
                Math.random() * 900000
            );

        session.level = "MAIN";

        return `Registration successful!

Registration Number:
${user.registrationNumber}

Your mobile number:
${user.phone}

0. Continue`;
    }


    /*
     * LOANS
     */

    if (session.level === "LOANS") {

        switch (input) {

            case "1":

                session.level = "LOAN_DEPOSIT";

                return `KaziPulse Loan

Loan Limit: KSh 70,000
Interest: 2.3%

A KSh 200 processing deposit
is required to continue.

1. Pay KSh 200
0. Cancel`;


            case "2":

                return `Loan Status

${user.loanStatus}

Loan Limit:
KSh 70,000

Interest:
2.3%

0. Back`;


            case "3":

                return `Loan Balance

No active loan.

0. Back`;


            case "0":

                session.level = "MAIN";

                return mainMenu();


            default:

                return loansMenu();
        }
    }


    /*
     * LOAN DEPOSIT
     */

    if (session.level === "LOAN_DEPOSIT") {

        if (input === "1") {

            /*
             * IMPORTANT:
             * Real STK Push will be connected
             * through the M-PESA API/backend.
             */

            session.level = "LOAN_PAYMENT";

            return `KaziPulse

An M-PESA payment request
for KSh 200 will be sent to:

${user.phone}

Check your phone and complete
the payment using M-PESA.

0. Cancel`;
        }


        if (input === "0") {

            session.level = "MAIN";

            return mainMenu();
        }


        return "Invalid option.";
    }


    /*
     * PAYMENT RESULT
     */

    if (session.level === "LOAN_PAYMENT") {

        return `KaziPulse

Payment verification is pending.

Your KSh 200 payment must be
confirmed before the loan
application can continue.

0. Back`;
    }


    /*
     * SURVEYS
     */

    if (session.level === "SURVEYS") {

        switch (input) {

            case "1":

                return `Available Surveys

No live surveys loaded yet.

0. Back`;


            case "2":

                return `Completed Surveys

No completed surveys yet.

0. Back`;


            case "0":

                session.level = "MAIN";

                return mainMenu();


            default:

                return surveysMenu(user);
        }
    }


    /*
     * BALANCE
     */

    if (session.level === "BALANCE") {

        if (input === "0") {

            session.level = "MAIN";

            return mainMenu();
        }

        return balanceMenu(user);
    }


    /*
     * TRANSACTIONS
     */

    if (session.level === "TRANSACTIONS") {

        if (input === "0") {

            session.level = "MAIN";

            return mainMenu();
        }

        return transactionMenu(user);
    }


    /*
     * WITHDRAW
     */

    if (session.level === "WITHDRAW") {

        if (input === "1") {

            return `Withdraw to M-PESA

Available:
KSh ${(user.balance || 0).toFixed(2)}

Enter amount:

0. Back`;
        }


        if (input === "0") {

            session.level = "MAIN";

            return mainMenu();
        }


        return withdrawMenu(user);
    }


    /*
     * HELP
     */

    if (session.level === "HELP") {

        if (input === "0") {

            session.level = "MAIN";

            return mainMenu();
        }

        return helpMenu();
    }


    return mainMenu();
      }
