// module uploads handler
const { UploadsHandler } = require('./handler');
// module routes uploads
const routes = require('./routes');

// plugin uploads
module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { service, albumsService, validator }) => {
    const uploadHandler = new UploadsHandler(service, albumsService, validator);
    server.route(routes(uploadHandler));
  },
};
