const routes = (handler) => [
    // endpoint untuk post exportsplaylist
    {
      method: 'POST',
      path: '/export/playlists/{playlistId}',
      handler: (request, h) => handler.postExportPlaylistHandler(request, h),
      options: {
        auth: 'openmusic_jwt',
      },
    },
  ];
  module.exports = routes;
