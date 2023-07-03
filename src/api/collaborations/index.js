// module collaborations handler
const CollaborationsHandler = require('./handler');

// module routes collaborations
const routes = require('./routes');

// plugin collaborations
module.exports = {
    name: 'collaborations',
    version: '1.0.0',
    register: async (server, { collaborationsService, playlistsService, validator }) => {
        const collaborationsHandler = new CollaborationsHandler(collaborationsService, playlistsService, validator);
        server.route(routes(collaborationsHandler));
    },
};
