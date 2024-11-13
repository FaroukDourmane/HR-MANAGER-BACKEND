'use strict';

const leave = require("../api/leave/controllers/leave");

module.exports = {
    createLeaveBalance: async ({leave, user}) => {
        const currentYear = new Date().getFullYear().toString();
        const userBalance = await strapi.entityService.findOne("api::leave-balance.leave-balance", {
            filters: {
                year: currentYear,
                user: user.id
            }
        });
        if ( !userBalance ) {
            console.log("CREATING BALANCE...");
            const createdBalance = await strapi.entityService.create("api::leave-balance.leave-balance", {
                data: {
                    user: user.id,
                    leave_type: leave.id,
                    year: currentYear,
                    expiry_date: new Date(),
                    available_from: new Date(),
                    carry_over_expiry: new Date(),
                    balance: leave.increment_amount,
                }
            });

            console.log("CREATED BALANCE: ", createdBalance);
            return createdBalance;
        }

        console.log("USER HAS BALANCE: ", userBalance);
        return userBalance;
    },
    addLeaveTransaction: async ({ balance, comment, amount, type }) => {
        await strapi.entityService.create("api::leave-transaction.leave-transaction", {
            data: {
                transaction_type: type,
                amount: amount,
                comment: comment ?? "",
                balance_reference: balance,
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

        const eligibleEmployees = await strapi.entityService.findMany("plugin::users-permissions.user", {
            filters: {
                status: {
                    $eq: 'active'
                }
            }
        });

        if ( leaveTypes.length > 0 ) {
            leaveTypes.map((leaveType) => {
                if ( eligibleEmployees.length > 0 ) {
                    leaveTypes.map( async(user) => {
                        const balance = await module.exports.createLeaveBalance({
                            leave: leaveType,
                            user: user
                        });

                        if ( balance ) {
                            module.exports.addLeaveTransaction({
                                balance: balance?.id,
                                type: 'addition',
                                amount: leaveType.increment_amount,
                                comment: 'Added Monthly Balance'
                            })
                        }
                    })
                }
            });
        }
    }
}