// module album handler
const AuthenticationsHandler = require('./handler');

// module routes authentications
const routes = require('./routes');

// plugin authentications
module.exports = {
    name: 'authentications',
    version: '1.0.0',
    register: async (server, {
        authenticationsService, usersService, tokenManager, validator,
    }) => {
        const authenticationsHandler = new AuthenticationsHandler(authenticationsService, usersService, tokenManager, validator);

        server.route(routes(authenticationsHandler));
    },
};
