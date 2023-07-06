// env module
require('dotenv').config();

// Hapi module
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// Albums module
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const { AlbumsValidator } = require('./validator/albums');

// Songs module
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const { SongsValidator } = require('./validator/songs');

// Users module
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const { UsersValidator } = require('./validator/users');

// Authentications module
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const { AuthenticationsValidator } = require('./validator/authentications');

// Playlists module
const playlists = require('./api/playlists');
const { PlaylistsService } = require('./services/postgres/PlaylistsService');
const { PlaylistsValidator } = require('./validator/playlists');

// Activities module
const { ActivitiesService } = require('./services/postgres/ActivitiesService');

// Collaborations module
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const { CollaborationsValidator } = require('./validator/collaborations');

// exports
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

// uploads
const uploads = require('./api/uploads');
const { StorageService } = require('./services/storage/StorageService');
const { UploadsValidator } = require('./validator/uploads');

// user album like
const albumLikes = require('./api/albumlikes');
const AlbumLikesService = require('./services/postgres/AlbumLikesService');
const CacheService = require('./services/redis/CacheService');

// Exceptions module
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const cacheService = new CacheService();
  const albumsService = new AlbumsService(cacheService);
  const albumsValidator = new AlbumsValidator();
  const songsService = new SongsService();
  const songsValidator = new SongsValidator();
  const usersService = new UsersService();
  const usersValidator = new UsersValidator();
  const activitiesService = new ActivitiesService();
  const collaborationsService = new CollaborationsService(usersService);
  const collaborationsValidator = new CollaborationsValidator();
  const playlistsService = new PlaylistsService(songsService, activitiesService, collaborationsService);
  const playlistsValidator = new PlaylistsValidator();
  const authenticationsService = new AuthenticationsService();
  const authenticationsValidator = new AuthenticationsValidator();
  const albumLikesService = new AlbumLikesService(cacheService);
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      Credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    // register albums service dan validatornya
    {
      plugin: albums,
      options: {
          service: albumsService,
          validator: albumsValidator,
      },
    },

    // register songs service dan validatornya
    {
      plugin: songs,
      options: {
          service: songsService,
          validator: songsValidator,
      },
    },

    // register users service dan validatornya
    {
      plugin: users,
      options: {
          service: usersService,
          validator: usersValidator,
      },
    },
    // register authentication service dan validatornya
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: authenticationsValidator,
      },
    },
    // register playlists service dan validatornya
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: playlistsValidator,
      },
    },

    // register collaborations service dan validatornya
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: collaborationsValidator,
      },
    },
    // register exports service dan validatornya
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        playlistsService,
        validator: ExportsValidator,
      },
    },
    // register uploads service dan validatornya
    {
      plugin: uploads,
      options: {
        service: storageService,
        albumsService,
        validator: UploadsValidator,
      },
    },
    // register albums likes service dan validatornya
    {
      plugin: albumLikes,
      options: {
        albumLikesService,
        albumsService,
      },
    },
  ]);

  // konfigurasi response jika server error
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      newResponse.code(500);
      console.error(response);
      return newResponse;
    }

    return h.continue;
  });
  // Start Server
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
init();
