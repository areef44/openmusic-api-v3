const routes = (handler) => [
    // endpoint untuk get albums like
    {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.getAlbumLikeHandler(request, h),
    },
    // endpoint untuk post albums like
    {
      method: 'POST',
      path: '/albums/{id}/likes',
      handler: (request, h) => handler.postAlbumLikeHandler(request, h),
      options: {
        auth: 'openmusic_jwt',
      },
    },
    // endpoint untuk delete albums likes
    {
      method: 'DELETE',
      path: '/albums/{id}/likes',
      handler: (request, h) => handler.deleteAlbumLikesHandler(request, h),
      options: {
        auth: 'openmusic_jwt',
      },
    },
  ];
// exports module routes
  module.exports = routes;
