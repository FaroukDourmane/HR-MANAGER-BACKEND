'use strict';

module.exports = {
    createLeaveBalance: async () => {
        const currentYear = new Date().getFullYear().toString();
        await strapi.entityService.create("api::leave-balance.leave-balance", {
            data: {
                user: 0,
                leave_type: 0,
                year: currentYear,
                expiry_date: "",
                available_from: "",
                carry_over: "",
                carry_over_expiry: "",
                balance: 0,
            }
        });
    },
    addLeaveTransaction: async (data) => {
        await strapi.entityService.create("api::leave-transaction.leave-transaction", {
            data: {
                transaction_type: 'addition',
                amount: 15,
                comment: '',
                balance_reference: 0,
            }
        });
    },
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

        if ( leaveTypes.length > 0 ) {
            leaveTypes.map((leaveType) => {
                
            });
        }
    }
}