module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/availableLeaveBalance/:id',
     handler: 'available-leave-balance.leaveBalances',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
