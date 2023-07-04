// definisi class exportsHandler
class ExportsHandler {
    constructor(service, playlistsService, validator) {
      // inisialiasi service dan validator untuk album handler
      this._exportService = service;
      this._playlistsService = playlistsService;
      this._validator = validator;
    }
    // handler untuk exports playlist
    async postExportPlaylistHandler(request, h) {
      // validasi export playlist payload
      this._validator.validateExportPlaylistPayload(request.payload);
      // get params
      const { playlistId } = request.params;
      // get credentials
      const { id: credentialId } = request.auth.credentials;
      // verify playlist owner
      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      const message = {
        playlistId,
        targetEmail: request.payload.targetEmail,
      };
      // export service
      await this._exportService.sendMessage('export:playlist', JSON.stringify(message));
      // response hasil eksekusi
      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
      response.code(201);
      return response;
    }
  }
  // export module ExportsHandler
  module.exports = ExportsHandler;
