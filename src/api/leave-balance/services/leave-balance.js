'use strict';

/**
 * leave-balance service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::leave-balance.leave-balance');
