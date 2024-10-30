// controllers/available-leave-balance.js or controllers/availableLeaveBalance.js
'use strict';

const dayjs = require("dayjs");

/**
 * A set of functions called "actions" for `availableLeaveBalance`
 */

module.exports = {
  leaveBalances: async (ctx, next) => {
    try {
      // const currentDate = new Date().toISOString();
      const currentYear = new Date().getFullYear().toString();
      const userId = ctx.params.id;  // Retrieve userId from URL parameters

      if (!userId) {
        ctx.throw(400, 'User ID is required');
      }

      const leaves = await strapi.entityService.findMany(
        "api::leave-balance.leave-balance",
        {
          fields: ["id", "type", "balance", "carry_over", "carry_over_expiry"],
          populate: {
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
            // available_from: {
            //   $lte: currentDate,
            // },
            // $or: [
            //   {
            //     expiry_date: {
            //       $gt: currentDate,
            //     },
            //   },
            //   {
            //     carry_over: {
            //       $gt: 0,
            //     },
            //     carry_over_expiry: {
            //       $gt: currentDate,
            //     }
            //   }
            // ]
          }
        }
      );

      let availableBalance = [];

      leaves.map((balance) => {
        let days = balance?.balance;
      
        if ( balance?.leaves ) {
          balance.leaves.map((leave) => {
            const fromDate = dayjs(leave.from);
            const toDate = dayjs(leave.to);
            // Calculate the difference in days and add 1 to include both "from" and "to" dates
            const dayDifference = toDate.diff(fromDate, 'day');
            // Subtract the leave days from the balance
            days -= dayDifference;
          });
        }

        if ( balance?.transactions ) {
          balance.transactions.map((transaction) => {
            if ( transaction.transaction_type == "addition" ) {
              days += transaction.amount;
            } else if ( transaction.transaction_type == "deduction" ) {
              days -= transaction.amount;
            }
          });
        }
      
        availableBalance.push({
          type: balance.type,
          main_balance: balance.balance,
          remaining_balance: days
        })
      }, {});

      ctx.body = availableBalance;
    } catch (err) {
      console.error(err);
      ctx.status = err.status || 500;
      ctx.body = { error: err.message || 'Internal server error' };
    }
  }
};
