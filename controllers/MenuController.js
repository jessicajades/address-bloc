const inquirer = require('inquirer');
const ContactController = require('./ContactController');

module.exports = class MenuController {
    constructor() {
        this.mainMenuQuestions = [
            {
                type: 'list',
                name: 'mainMenuChoice',
                message: 'please choose from an option below: ',
                choices: [
                    'add new contact',
                    'exit'
                ]
            }
        ];
        this.book = new ContactController(); 
    }

    main() {
        console.log('welcome to addressbloc!');
        inquirer.prompt(this.mainMenuQuestions).then((response) => {
            switch (response.mainMenuChoice) {
                case 'add new contact':
                    this.addContact();
                    break;
                case 'exit':
                    this.exit();
                default:
                    console.log('invalid input');
                    this.main();
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    clear() {
        console.log('\x1Bc');
    }

    addContact() {
        this.clear();
        inquirer.prompt(this.book.addContactQuestions).then((answers) => {
            this.book.addContact(answers.name, answers.phone, answers.email).then((contact) => {
                console.log('contact added successfully');
                this.main();
            }).catch((err) => {
                console.log(err);
                this.main();
            });
        });
    }

    exit() {
        console.log('thanks for using addressbloc!');
        process.exit();
    }

    getContactCount() {
        return this.contacts.length;
    }
}