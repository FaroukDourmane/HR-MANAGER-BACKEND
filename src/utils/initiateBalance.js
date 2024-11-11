'use strict';

module.exports = {
    initiateLeavesBalance: async (user) => {
        // const leaves = await strapi.entityService.create()
    },
    incrementMonthlyLeaveBalance: async () => {
        const currentYear = new Date().getFullYear().toString();

        const leaveTypes = await strapi.entityService.findMany("api::leave-type.leave-type", {
            filters: {
                increment_type: {
                  $eq: "monthly"
                },
                active: {
                    $eq: true
                }
            }
        });

        leaveTypes.map((leaveType) => {
        });
    }
}