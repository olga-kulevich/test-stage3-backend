'use strict';

module.exports = [
    {
        type: 'list',
        name: 'Q1',
        message: '?',
        choices: [
            'Order a pizza',
            'Make a reservation',
            'Talk to the receptionist'
        ]
    },
    {
        type: 'list',
        name: 'Q2',
        message: 'What size do you need?',
        choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
        filter: function (val) {
            return val.toLowerCase();
        }
    }
];