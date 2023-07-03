const routes = (handler) => [
    {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.getAlbumLikeHandler(request, h),
    },
    {
      method: 'POST',
      path: '/albums/{id}/likes',
      handler: (request, h) => handler.postAlbumLikeHandler(request, h),
      options: {
        auth: 'openmusic_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/albums/{id}/likes',
      handler: (request, h) => handler.deleteAlbumLikesHandler(request, h),
      options: {
        auth: 'openmusic_jwt',
      },
    },
  ];
  module.exports = routes;
