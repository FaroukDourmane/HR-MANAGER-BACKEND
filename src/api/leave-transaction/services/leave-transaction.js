'use strict';

/**
 * leave-transaction service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::leave-transaction.leave-transaction');
