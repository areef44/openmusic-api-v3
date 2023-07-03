const ExportsHandler = require('./handler');
const routers = require('./routes');

module.exports = {
  name: 'export',
  version: '1.0.0',
  register: async (server, { service, playlistsService, validator }) => {
    const exportHandler = new ExportsHandler(service, playlistsService, validator);
    server.route(routers(exportHandler));
  },
};
