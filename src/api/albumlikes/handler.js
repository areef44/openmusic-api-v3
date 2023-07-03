class AlbumLikesHandler {
    constructor(albumLikesService, albumsService) {
        this._albumLikesService = albumLikesService;
        this._albumsService = albumsService;
    }

    async getAlbumLikeHandler(request, h) {
      const { id } = request.params;
      await this._albumsService.getAlbumById(id);
      const { likes, isCache } = await this._albumLikesService.getAlbumLike(id);
      const response = h.response({
        status: 'success',
        data: {
          likes,
        },
      });
      if (isCache) {
        response.header('X-Data-Source', 'cache');
      }
      return response;
    }

    async postAlbumLikeHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const { id: albumId } = request.params;
        await this._albumsService.getAlbumById(albumId);
        const alreadyLike = await this._albumLikesService.verifyAlbumLike(credentialId, albumId);
        if (!alreadyLike) {
          await this._albumLikesService.addAlbumLike(credentialId, albumId);
        } else {
          await this._albumLikesService.dislikeAlbum(credentialId, albumId);
        }
        const response = h.response({
          status: 'success',
          message: 'Berhasil like/dislike albums',
        });
        response.code(201);
        return response;
    }

    async deleteAlbumLikesHandler(request) {
        const { id: albumId } = request.params;
        const { id: credentialId } = request.auth.credentials;
        await this._albumLikesService.dislikeAlbum(albumId, credentialId);
        return {
          status: 'success',
          message: 'Berhasil membatalkan like',
        };
    }
}

module.exports = AlbumLikesHandler;
