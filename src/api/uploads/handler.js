// definisi class constructor untuk UploadsHandler
class UploadsHandler {
    // inisialiasi service dan validator untuk album handler
    constructor(service, albumsService, validator) {
      this._service = service;
      this._albumsService = albumsService;
      this._validator = validator;
    }
    // handler untuk post album cover
    async postUploadAlbumCoverHandler(request, h) {
      // payload cover
      const { cover } = request.payload;
      // get payload params
      const { id } = request.params;
      // validasi uploads payload
      this._validator.validateImageHeaders(cover.hapi.headers);
      const filename = await this._service.writeFile(cover, cover.hapi, id);
      const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/uploads/images/${filename}`;
      // eksekusi updatealbumcover
      await this._albumsService.updateAlbumCover(id, coverUrl);
      // response hasil eksekusi
      const response = h.response({
        status: 'success',
        message: 'Cover berhasil diunggah',
      });
      response.code(201);
      return response;
    }
  }
  // eksports module AlbumsHandler
  module.exports = { UploadsHandler };
