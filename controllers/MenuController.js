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
                    'list contacts',
                    'search for a contact',
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
                case 'list contacts':
                    this.getContacts();
                    break; 
                case 'search for a contact':
                    this.search();
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

    getContacts() {
        this.clear();

        this.book.getContacts().then((contacts) => {
            for (let contact of contacts) {
                console.log(`
                    name: ${contact.name}
                    phone number: ${contact.phone}
                    email: ${contact.email}
                `);
            }
            this.main();
        }).catch((err) => {
            console.log(err);
            this.main();
        })
    }

    search() {
        inquirer.prompt(this.book.searchQuestions)
        .then((target) => {
            this.book.search(target.name)
            .then((contact) => {
                if(contact === null) {
                    this.clear();
                    console.log('contact not found');
                    this.search();
                } else {
                    this.showContact(contact);
                }
            });
        })
        .catch((err) => {
            console.log(err);
            this.main();
        });
    }

    showContact(contact) {
        this._printContact(contact);
        inquirer.prompt(this.book.showContactQuestions)
        .then((answer) => {
            switch(answer.selected) {
                case 'delete contact':
                    this.delete(contact);
                    break;
                case 'main menu':
                    this.main();
                    break;
                default:
                    console.log('something went wrong');
                    this.showContact(contact);
            }
        })
        .catch((err) => {
            console.log(err);
            this.showContact(contact);
        })
    }

    _printContact(contact) {
        console.log(`
            name: ${contact.name}
            phone number: ${contact.phone}
            email: ${contact.email}
            ---------------------`
        );
    }

    delete(contact) {
        inquirer.prompt(this.book.deleteConfirmQuestions)
        .then((answer) => {
            if(answer.confirmation) {
                this.book.delete(contact.id);
                console.log('contact deleted');
                this.main();
            } else {
                console.log('contact not deleted');
                this.showContact(contact);
            }
        })
        .catch((err) => {
            console.log(err);
            this.main();
        })
    }
}