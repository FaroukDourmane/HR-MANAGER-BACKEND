const { initiateLeavesBalance } = require("../../../../utils/leaves");

module.exports = {
    afterUpdate(event) {
        console.log('USER WAS UPDATED: ', event);
    },
    afterCreate(event) {
        // initiateLeavesBalance();
    }
}