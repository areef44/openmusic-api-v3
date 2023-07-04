// module exports handler
const ExportsHandler = require('./handler');
// module routes song
const routers = require('./routes');

// plugin exports
module.exports = {
  name: 'export',
  version: '1.0.0',
  register: async (server, { service, playlistsService, validator }) => {
    const exportHandler = new ExportsHandler(service, playlistsService, validator);
    server.route(routers(exportHandler));
  },
};
