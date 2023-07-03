// definisi class constructor untuk playlisthandler
class PlaylistHandler {
    constructor(service, validator) {
        // inisialiasi service dan validator untuk playlist handler
        this._service = service;
        this._validator = validator;
    }

    // handler untuk menambahkan Playlist
    async postPlaylistHandler(request, h) {
        // validasi playlist payload
        this._validator.validatePlaylistPayload(request.payload);

        // simpan payload ke object name
        const { name } = request.payload;

        // simpan auth credential ke credentialid
        const { id: credentialId } = request.auth.credentials;

        // eksekusi service addplaylist
        const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

        // response untuk eksekusi
        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: {
                playlistId,
            },
        });
        // responsecode
        response.code(201);
        // kembalikan response
        return response;
    }

    // handler untuk mendapatkan data semua playlist
    async getPlaylistsHandler(request, h) {
        // simpan auth credential ke credentialid
        const { id: credentialId } = request.auth.credentials;

        // eksekusi service getplaylist
        const playlists = await this._service.getPlaylists(credentialId);

        // response untuk eksekusi
        const response = h.response({
            status: 'success',
            data: {
                playlists,
            },
        });
        // kembalikan response
        return response;
    }

    // handler untuk menghapus data playlist
    async deletePlaylistByIdHandler(request, h) {
        // dapatkan parameter
        const { id: playlistId } = request.params;

        // simpan auth credential ke credentialid
        const { id: credentialId } = request.auth.credentials;

        // eksekusi service playlist owner
        await this._service.verifyPlaylistOwner(playlistId, credentialId);

        // eksekusi service delete playlist
        await this._service.deletePlaylistById(playlistId);

        // response untuk eksekusi
        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil dihapus',
        });

        // response untuk eksekusi
        response.code(200);
        // kembalikan response
        return response;
    }

    // handler untuk menambahkan lagu kedalam playlist
    async postPlaylistSongHandler(request, h) {
        // validasi payload lagunya
        const validateSong = this._validator.validatePlaylistSongPayload(request.payload);

        // simpan auth credential ke credentialid
        const { id: credentialId } = request.auth.credentials;

        // simpan ke parameter playlistId
        const playlistId = request.params;

        // eksekusi service verifyplaylistaccess
        await this._service.verifyPlaylistAccess(playlistId.id, credentialId);

        // eksekusi service addsong to playlist
        await this._service.addSongToPlaylist(playlistId.id, validateSong.songId, credentialId);

        // response hasil eksekusi
        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan ke daftar putar',
        });
        // response code
        response.code(201);
        // kembalikan response
        return response;
    }

    // handler untuk mendapatkan daftar lagu yang ada di dalam playlist
    async getPlaylistSongsHandler(request, h) {
        // simpan parameter
        const { id: playlistId } = request.params;
        // simpan auth credential ke credentialid
        const { id: credentialId } = request.auth.credentials;
        // eksekusi service verifyplaylist access
        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        // eksekusi service getsongfromplaylist
        const result = await this._service.getSongFromPlaylist(playlistId);
        // response hasil eksekusi
        const response = h.response({
            status: 'success',
            data: result,
        });
        // response code
        response.code(200);
        // kembalikan response
        return response;
    }

    // handler untuk menghapus lagu yang ada di dalam playlist
    async deletePlaylistSongHandler(request, h) {
        // validasi song payload
        const validatedSong = this._validator.validatePlaylistSongPayload(request.payload);
        // simpan auth credential ke credentialid
        const { id: credentialId } = request.auth.credentials;
        // simpan parameter
        const playlistId = request.params;
        // eksekusi service verifyplaylist access
        await this._service.verifyPlaylistAccess(playlistId.id, credentialId);
        // eksekusi service deletesongfromplaylist
        await this._service.deleteSongFromPlaylist(validatedSong.songId, playlistId.id, credentialId);
        // response hasil eksekusi
        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil dihapus dari playlist',
        });
        // response code
        response.code(200);
        // kembalikan response
        return response;
    }

    // handler untuk mendapatkan actvities handler
    async getPlaylistActivitiesHandler(request, h) {
        // simpan auth credential ke credentialid
        const { id: credentialId } = request.auth.credentials;
        // simpan parameter
        const playlistId = request.params;
        // eksekusi service verifyplaylist access
        await this._service.verifyPlaylistAccess(playlistId.id, credentialId);
        // eksekusi service getactivities
        const activities = await this._service.getActivities(playlistId.id);
        // response hasil eksekusi
        const response = h.response({
            status: 'success',
            data: activities,
        });
        // response code
        response.code(200);
        // kembalikan response
        return response;
    }
}
// eksports module PlaylistHandler
module.exports = PlaylistHandler;
