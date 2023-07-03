const routes = (handler) => [
    // endpoint untuk add playlist
    {
        method: 'POST',
        path: '/playlists',
        handler: (request, h) => handler.postPlaylistHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
    // endpoint untuk get playlists
    {
        method: 'GET',
        path: '/playlists',
        handler: (request, h) => handler.getPlaylistsHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
    // endpoint untuk delete playlist
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: (request, h) => handler.deletePlaylistByIdHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
    // endpoint untuk add song to playlist
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: (request, h) => handler.postPlaylistSongHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
    // endpoint untuk get songs from playlist
    {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: (request, h) => handler.getPlaylistSongsHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
    // endpoint untuk delete song from playlist
    {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: (request, h) => handler.deletePlaylistSongHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
    // endpoint untuk get activity from playlist
    {
        method: 'GET',
        path: '/playlists/{id}/activities',
        handler: (request, h) => handler.getPlaylistActivitiesHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
];
// export routes
module.exports = routes;
