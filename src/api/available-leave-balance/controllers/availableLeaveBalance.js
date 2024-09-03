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
          fields: ["id", "type", "balance"],
          populate: {
            user: {
              fields: ["id"],
            }
          },
          filters: {
            user: {
              id: userId,
            },
            expiry_date: {
              $gt: currentDate,
            }
          }
        }
      );

      const accumulatedBalances = leaves.reduce((acc, leave) => {
        if (acc[leave.type]) {
          acc[leave.type] += leave.balance;
        } else {
          acc[leave.type] = leave.balance;
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
