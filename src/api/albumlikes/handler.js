// definisi class constructor untuk AlbumsLikes
class AlbumLikesHandler {
  // inisialiasi service dan validator untuk album likes
    constructor(albumLikesService, albumsService) {
        this._albumLikesService = albumLikesService;
        this._albumsService = albumsService;
    }
    // handler untuk get album likes
    async getAlbumLikeHandler(request, h) {
      const { id } = request.params;
      // eksekusi service get albumsById
      await this._albumsService.getAlbumById(id);
      const { likes, isCache } = await this._albumLikesService.getAlbumLike(id);
      // response untuk eksekusi
      const response = h.response({
        status: 'success',
        data: {
          likes,
        },
      });
      // cek cachee
      if (isCache) {
        response.header('X-Data-Source', 'cache');
      }
      // return hasil respon
      return response;
    }
    // handler untuk post album likes
    async postAlbumLikeHandler(request, h) {
        // dapatkan credentials
        const { id: credentialId } = request.auth.credentials;
        // dapatkan request params
        const { id: albumId } = request.params;
        // eksekusi service get albumsById
        await this._albumsService.getAlbumById(albumId);
        // verifikasi album like
        const liked = await this._albumLikesService.verifyAlbumLike(credentialId, albumId);
        // cek like
        if (!liked) {
          await this._albumLikesService.addAlbumLike(credentialId, albumId);
        } else {
          await this._albumLikesService.dislikeAlbum(credentialId, albumId);
        }
       // response untuk eksekusi
        const response = h.response({
          status: 'success',
          message: 'Berhasil like/dislike albums',
        });
        response.code(201);
        return response;
    }
    // handler untuk delete album likes
    async deleteAlbumLikesHandler(request) {
        // dapatkan request params
        const { id: albumId } = request.params;
        // dapatkan credentials
        const { id: credentialId } = request.auth.credentials;
        // eksekusi service get dislikealbums
        await this._albumLikesService.dislikeAlbum(albumId, credentialId);
       // return hasil eksekusi
        return {
          status: 'success',
          message: 'Berhasil membatalkan like',
        };
    }
}
// eksports module AlbumsLikesHandler
module.exports = AlbumLikesHandler;
