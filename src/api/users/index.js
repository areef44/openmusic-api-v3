// module users handler
const UsersHandler = require('./handler');
// routes users
const routes = require('./routes');
// plugin users handler
module.exports = {
    name: 'users',
    version: '1.0.0',
    register: async (server, { service, validator }) => {
        const usersHandler = new UsersHandler(service, validator);
        server.route(routes(usersHandler));
    },
};
