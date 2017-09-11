/**
 * User: rlindgren
 * Date: 9/11/17
 * Time: 9:53 AM
 */

var config = require('./Config')
var _ = require('lodash');
var FCM = require('fcm').FCM;
var fcm = new FCM(config.get('fcm').apiKey);
var pushAssociations = require('./PushAssociations');


var push = function (tokens, message) {
    [].concat(tokens).forEach(function(token) {
        let msg = _.cloneDeep(message);
        msg.registration_id = token;
        fcm.send(msg, function (err, messageId) {
            if (err) {
                console.log(err);
                if (err.message === 'InvalidRegistration' || err.message === 'NotRegistered') {
                    pushAssociations.removeDevice(token);
                }
            }

            if (messageId) {
                pushAssociations.updateToken(token)
            }
        });
    });
};

var buildPayload = function (options) {
    return _.extend({}, options || {});
};

module.exports = {
    push: push,
    buildPayload: buildPayload
};
