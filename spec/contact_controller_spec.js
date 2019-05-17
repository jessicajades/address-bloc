const ContactController = require('../controllers/ContactController');
const sequelize = require('../db/models/index').sequelize;

describe('ContactController', () => {

   beforeEach((done) => {
       this.book = new ContactController();
   

        sequelize.sync({force: true}).then((res) => {
            done();
        })
        .catch((err) => {
            done();
        });
    });

   it('should be defined', () => {
    expect(ContactController).toBeDefined();
    });

    describe('#addContact()', () => {
        it('should add a single contact into the book', (done) => {
            this.book.addContact('alice', '555-555-5555')
            .then((contact) => {
                expect(contact.name).toBe('alice');
                expect(contact.phone).toBe('555-555-5555');
                done();
            })
            .catch((err) => {
                done();
            });
        })
    })

});



