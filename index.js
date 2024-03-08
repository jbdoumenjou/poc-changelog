const _ = require('lodash');

function sum(numbers) {
    return _.sum(numbers)
}


function helloWorld() {
    return "hello World"
}

module.exports = {
    helloWorld,
    sum
}