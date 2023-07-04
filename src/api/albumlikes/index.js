// module albumLikes handler
const AlbumLikesHandler = require('./handler');
// module routes song
const routes = require('./routes');

// plugin albumlike
module.exports = {
  name: 'albumlikes',
  version: '1.0.0',
  register: async (server, { albumLikesService, albumsService }) => {
    const albumLikesHandler = new AlbumLikesHandler(albumLikesService, albumsService);
    server.route(routes(albumLikesHandler));
  },
};
