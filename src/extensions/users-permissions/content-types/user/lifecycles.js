const { initiateLeavesBalance } = require("../../../../utils/initiateBalance");

module.exports = {
    afterUpdate(event) {
        console.log('USER WAS UPDATED: ', event);
    },
    afterCreate(event) {
        // initiateLeavesBalance();
    }
}