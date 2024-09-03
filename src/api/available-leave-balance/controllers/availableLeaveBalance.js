// controllers/available-leave-balance.js or controllers/availableLeaveBalance.js
'use strict';

/**
 * A set of functions called "actions" for `availableLeaveBalance`
 */

module.exports = {
  leaveBalances: async (ctx, next) => {
    try {
      const currentDate = new Date().toISOString();
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
            }
          },
          filters: {
            user: {
              id: userId,
            },
            available_from: {
              $lte: currentDate,
            },
            $or: [
              {
                expiry_date: {
                  $gt: currentDate,
                },
              },
              {
                carry_over: {
                  $gt: 0,
                },
                carry_over_expiry: {
                  $gt: currentDate,
                }
              }
            ]
          }
        }
      );

      const accumulatedBalances = leaves.reduce((acc, leave) => {
        let balanceToAdd = leave.balance;
      
        // Check if the leave has expired
        if (new Date(leave.expiry_date) <= new Date(currentDate)) {
          // If it has expired, use the carry over balance if it's valid
          if (leave.carry_over > 0 && new Date(leave.carry_over_expiry) > new Date(currentDate)) {
            balanceToAdd = leave.carry_over; // Only carry over the allowed balance
          } else {
            balanceToAdd = 0; // Expired without valid carry over, so no balance is added
          }
        }
      
        // Add the balance to the appropriate type
        if (acc[leave.type]) {
          acc[leave.type] += balanceToAdd;
        } else {
          acc[leave.type] = balanceToAdd;
        }
      
        return acc;
      }, {});

      const result = Object.keys(accumulatedBalances).map(type => ({
        type,
        balance: accumulatedBalances[type]
      }));

      ctx.body = result;
    } catch (err) {
      console.error(err);
      ctx.status = err.status || 500;
      ctx.body = { error: err.message || 'Internal server error' };
    }
  }
};
