class CollaborationsHandler {
    constructor(collaborationsService, playlistsService, validator) {
        // inisialiasi playlistservice collaborationsservice dan validator untuk authentications handler
        this._collaborationsService = collaborationsService;
        this._playlistsService = playlistsService;
        this._validator = validator;
    }

    // handler untuk menambahkan Collaboration
    async postCollaborationHandler(request, h) {
        // validasi collaboration
        const collaborationValidated = this._validator.validateCollaborationPayload(request.payload);

        // simpan credentials
        const { id: credentialId } = request.auth.credentials;

        // verifikasi playlist owner
        await this._playlistsService.verifyPlaylistOwner(collaborationValidated.playlistId, credentialId);

        // tambahkan kolaborasi
        const collaborationId = await this._collaborationsService.addCollaboration(collaborationValidated);

        // response untuk hasil eksekusi
        const response = h.response({
            status: 'success',
            message: 'Kolaborasi berhasil ditambahkan',
            data: {
                collaborationId,
            },
        });
        // response code
        response.code(201);
        // kembalikan response
        return response;
    }

    // handler untuk menghapus Collaboration
    async deleteCollaborationHandler(request, h) {
        const collaborationValidated = this._validator.validateCollaborationPayload(request.payload);

        // simpan credentials
        const { id: credentialId } = request.auth.credentials;

        // verifikasi playlist owner
        await this._playlistsService.verifyPlaylistOwner(collaborationValidated.playlistId, credentialId);

        // hapus kolaborasi
        await this._collaborationsService.deleteCollaboration(collaborationValidated);

        // response untuk hasil eksekusi
        const response = h.response({
            status: 'success',
            message: 'Kolaborasi berhasil dihapus',
        });
        // response code
        response.code(200);
        // kembalikan response
        return response;
    }
}

// exports CollaborationsHandler
module.exports = CollaborationsHandler;
