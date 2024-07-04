#! usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
const NUM_QUESTIONS = 5;
const baseURL = `https://opentdb.com/api.php?amount=${NUM_QUESTIONS}&category=18&difficulty=easy&type=multiple`;
async function getQuiz() {
    try {
        const response = await fetch(baseURL);
        const data = await response.json();
        return data.results;
    }
    catch (error) {
        console.error(chalk.red("Error fetching quiz questions:", error.message));
        process.exit(1);
    }
}
async function askQuestions(name, quizzes) {
    let score = 0;
    for (let quizNum = 0; quizNum < quizzes.length; quizNum++) {
        const { question, correct_answer, incorrect_answers } = quizzes[quizNum];
        // Randomize answer order
        const shuffledAnswers = [correct_answer, ...incorrect_answers].sort(() => Math.random() - 0.5);
        console.log(chalk.whiteBright.bold.italic(`\nQuestion ${quizNum + 1}:`));
        const answer = await inquirer.prompt([
            {
                name: "answer",
                type: "list",
                message: chalk.magenta.bold.italic(question),
                choices: shuffledAnswers,
            },
        ]);
        if (answer.answer === correct_answer) {
            console.log(chalk.greenBright("\u{2705} Correct\n"));
            score++;
        }
        else {
            console.log(chalk.red("\u{1F480} Wrong\n"));
        }
    }
    console.log(chalk.whiteBright.bold.italic(`
    \n\t\t${chalk.green.bold(name)}, your score is ${score < quizzes.length / 2
        ? chalk.red(score)
        : chalk.greenBright(score)}/${chalk.greenBright(quizzes.length)}
  `));
}
async function main() {
    console.clear();
    const rainbow = chalkAnimation.rainbow("\n\n\t\tWELCOME TO THE QUIZ\n");
    try {
        const quizzes = await getQuiz();
        rainbow.stop();
        const answer = await inquirer.prompt({
            name: "name",
            type: "input",
            message: chalk.cyanBright.bold.italic("Enter your Name: "),
            default: () => "Anonymous",
        });
        console.log();
        await askQuestions(answer.name, quizzes);
    }
    catch (error) {
        console.error(chalk.red("Error initializing quiz:", error.message));
    }
}
// Execute main function only once
main();
//# sourceMappingURL=index.js.map