// controllers/available-leave-balance.js or controllers/availableLeaveBalance.js
'use strict';

const dayjs = require("dayjs");

/**
 * A set of functions called "actions" for `availableLeaveBalance`
 */

module.exports = {
  leaveBalances: async (ctx, next) => {
    try {
      const currentDate = new Date().toISOString();
      const currentYear = new Date().getFullYear().toString();
      const userId = ctx.params.id;  // Retrieve userId from URL parameters

      if (!userId) {
        ctx.throw(400, 'User ID is required');
      }

      const leaves = await strapi.entityService.findMany(
        "api::leave-balance.leave-balance",
        {
          fields: ["id", "carry_over_balance", "carry_over_expiry"],
          populate: {
            leave_type: {
              populate: "*"
            },
            user: {
              fields: ["id"],
            },
            leaves: {
              populate: "*"
            },
            transactions: {
              populate: "*"
            }
          },
          filters: {
            user: {
              id: userId
            },
            year: {
              $eq: currentYear
            },
            available_from: {
              $lte: currentDate,
            },
            $or: [
              {
                expiry_date: {
                  $gte: currentDate,
                },
              },
              {
                carry_over_balance: {
                  $gt: 0,
                },
                carry_over_expiry: {
                  $gte: currentDate,
                }
              }
            ]
          }
        }
      );

      let availableBalance = [];

      leaves.map((balance) => {
        let main_balance = 0;
        let remaining_balance = 0;
      
        if ( balance?.leaves ) {
          console.log("LEAVES: ", balance?.leaves);
          balance.leaves.map((leave) => {
            const fromDate = dayjs(leave.from);
            const toDate = dayjs(leave.to);
            // Calculate the difference in days and add 1 to include both "from" and "to" dates
            const dayDifference = toDate.diff(fromDate, 'day');
            // Subtract the leave days from the balance
            if ( leave.status == "approved" || leave.status == "pending" ) {
              remaining_balance -= dayDifference+1;
            }
          });
        }

        if ( balance?.transactions ) {
          balance.transactions.map((transaction) => {
            if ( transaction.transaction_type == "addition" ) {
              remaining_balance += transaction.amount;
              main_balance += transaction.amount;
            } else if ( transaction.transaction_type == "deduction" ) {
              remaining_balance -= transaction.amount;
            }
          });
        }
      
        if ( balance?.carry_over_balance > 0 ) {
          
        }

        availableBalance.push({
          type: balance.leave_type.type,
          main_balance: main_balance,
          remaining_balance: remaining_balance
        })
      }, {});

      ctx.body = availableBalance;
    } catch (err) {
      console.error(err);
      ctx.status = err.status || 500;
      ctx.body = { error: err.message || 'Internal server error' };
    }
  },
  leaveBalanceTransactions: async (ctx, next) => {
    
  }
};
