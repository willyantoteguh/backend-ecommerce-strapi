'use strict';

/**
 * payment-callback controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::payment-callback.payment-callback', ({ strapi }) => ({
    async create(ctx) {
        let requestData = ctx.request.body;

        console.log('request xendit ', requestData);

        // Get order by Id
        let order = await strapi.service('api::order.order').findOne(parseInt(requestData.external_id));


        let inputData = { 'data': { 'history': requestData } };
        // Insert into payment table
        const result = await strapi.service('api::payment-callback.payment-callback').create(inputData);

        let params = {}

        if (requestData.status == 'PAID') {
            params = { 'data': { 'status': 'packaging' } }
        } else {
            params = { 'data': { 'status': 'cancel' } }
        }
        // Check update order by status
        let updateOrder = await strapi.service('api::order.order').update(parseInt(requestData.external_id), params);
        return { 'data': updateOrder }
    }
}));
