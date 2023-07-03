class ExportsHandler {
    constructor(service, playlistsService, validator) {
      this._exportService = service;
      this._playlistsService = playlistsService;
      this._validator = validator;
    }
    async postExportPlaylistHandler(request, h) {
      this._validator.validateExportPlaylistPayload(request.payload);
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      const message = {
        playlistId,
        targetEmail: request.payload.targetEmail,
      };
      await this._exportService.sendMessage('export:playlist', JSON.stringify(message));
      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
      response.code(201);
      return response;
    }
  }
  module.exports = ExportsHandler;
