import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let quiz = [];

// Connect Database
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "Divya123",
    port: 5432
});

db.connect();

db.query("SELECT * FROM capitals", (err, res) => {
    if (err) {
        console.log("There is an error!", err.stack);
    } else {
        quiz = res.rows;
        console.log("Quiz data loaded:", quiz);
    }
    db.end(); // Close the database connection after fetching data
});

let countTotal = 0;
let currentQuestion = {};

app.get("/", async (req, res) => {
    countTotal = 0;
    await nextQuestion();
    console.log("Current question:", currentQuestion);
    res.render("index.ejs", { question: currentQuestion });
});

app.post("/submit", (req, res) => {
    const ans = req.body.answer.trim();
    let isCorrect = false; // Corrected from False to false
    if (currentQuestion.capital.toLowerCase() === ans.toLowerCase()) {
        countTotal += 1;
        console.log("Total correct:", countTotal);
        isCorrect = true;
    }
    nextQuestion();
    res.render("index.ejs", {
        question: currentQuestion,
        wasCorrect: isCorrect,
        totalScore: countTotal // Corrected variable name from totalCorrect to countTotal
    });
});

async function nextQuestion() {
    const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
    currentQuestion = randomCountry;
}

app.listen(port, () => {
    console.log(`The app is listening on port ${port}`);
});
