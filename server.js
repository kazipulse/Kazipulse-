const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

/*
KaziPulse USSD endpoint
*/

app.post("/ussd", (req, res) => {

    const phoneNumber = req.body.phoneNumber || "";
    const text = req.body.text || "";

    let response = "";

    if (text === "") {

        response =
`CON KaziPulse
1. Register
2. Mobile Number
3. Surveys
4. Loans
5. Transaction History
6. My Balance
7. Withdraw
8. Help
0. Exit`;

    } else if (text === "1") {

        response =
`CON KaziPulse Registration

Enter your full name:`;

    } else if (text === "2") {

        response =
`END KaziPulse

Mobile Number:
${phoneNumber}`;

    } else if (text === "3") {

        response =
`CON KaziPulse Surveys

1. Available Surveys
2. Completed Surveys
0. Back`;

    } else if (text === "4") {

        response =
`CON KaziPulse Loans

Loan Limit: KSh 70,000
Interest: 2.3%

1. Apply for Loan
2. Loan Status
3. Loan Balance
0. Back`;

    } else if (text === "5") {

        response =
`END KaziPulse

Transaction History
No transactions found.`;

    } else if (text === "6") {

        response =
`END KaziPulse

Your Balance:
KSh 0.00`;

    } else if (text === "7") {

        response =
`CON KaziPulse Withdraw

Available Balance:
KSh 0.00

1. Withdraw to M-PESA
0. Back`;

    } else if (text === "8") {

        response =
`CON KaziPulse Help

1. Registration
2. Surveys
3. Loans
4. Withdrawals
0. Back`;

    } else if (text === "0") {

        response = "END Thank you for using KaziPulse.";

    } else {

        response =
`END Invalid option.

Please try again.`;
    }

    res.set("Content-Type", "text/plain");

    res.send(response);
});


/*
Basic health check
*/

app.get("/", (req, res) => {

    res.send("KaziPulse USSD & SMS Backend is running.");
});


app.listen(PORT, () => {

    console.log(
        `KaziPulse server running on port ${PORT}`
    );

});
