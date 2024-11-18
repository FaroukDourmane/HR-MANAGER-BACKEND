'use strict';

module.exports = {
    createLeaveBalance: async ({leave, user}) => {
        const currentYear = new Date().getFullYear().toString();
        console.log(`CHECKING IF USER ${user.id} HAS BALANCE FOR: `, currentYear);
        const checkUserBalance = await strapi.entityService.findMany("api::leave-balance.leave-balance", {
            filters: {
                year: currentYear,
                user: user.id
            },
            limit: 1
        });

        const userBalance = checkUserBalance[0] || null;

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
                }
            });

            console.log("CREATED BALANCE: ", createdBalance);
            return createdBalance;
        }

        console.log("USER HAS BALANCE: ", userBalance);
        return userBalance;
    },
    createLeaveTransaction: async ({ balance, comment, amount, type }) => {
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
        const leaveTypes = await strapi.entityService.findMany("api::leave-type.leave-type", {
            filters: {
                carry_over: {
                  $neq: "carry_over"
                },
                active: {
                    $eq: true
                }
            }
        });

        if ( leaveTypes.length > 0 ) {
            leaveTypes.map( async (leaveType) => {
                const balance = await module.exports.createLeaveBalance({
                    leave: leaveType,
                    user: user
                });
            })
        }
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

        console.log(`${leaveTypes.length} LEAVE TYPES FOUND`);
        console.log(`${eligibleEmployees.length} EMPLOYEES FOUND`);

        if ( leaveTypes.length > 0 ) {
            leaveTypes.map((leaveType) => {
                if ( eligibleEmployees.length > 0 ) {
                    eligibleEmployees.map( async(user) => {
                        const balance = await module.exports.createLeaveBalance({
                            leave: leaveType,
                            user: user
                        });

                        if ( balance ) {
                            module.exports.createLeaveTransaction({
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