/*************************************** STEP 1 ***********************************************************************/
var inquirer = require('inquirer');
var clear = require('clear');
var chalk = require('chalk');
var step2 = require('./step2');

module.exports = function step1() {
    console.log(chalk.green('\n\n#STEP 1: JavaScript Test\n'));
    console.log(chalk.yellow(`
    Пройдите тест. Выбирите правильные варианты ответов.\n\n
`));

    inquirer.prompt(require('./questions')).then(function (answers) {
        // TODO
        console.log(JSON.stringify(answers, null, '  '));
        clear();
        step2();
    });
};
