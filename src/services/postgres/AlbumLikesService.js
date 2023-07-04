// module nanoid
const { nanoid } = require('nanoid');
// module postgresql
const { Pool } = require('pg');
// module exceptions error
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');
// definisi class constructor untuk album likes service
class AlbumLikesService {
    constructor(cacheService) {
        // inisialiasasi properti pool postgres anda cache services
        this._pool = new Pool();
        this._cacheService = cacheService;
    }

    // service untuk menambahkan album like
    async addAlbumLike(userId, albumId) {
        const id = `like-${nanoid(16)}`;
        // query menambahkan album like
        const query = {
          text: 'INSERT INTO album_likes values ($1, $2, $3)',
          values: [id, userId, albumId],
        };
        // eksekusi query album like
        const result = await this._pool.query(query);
        // cek rows
        if (!result.rowCount) {
          // jika tidak ada munculkan pesan error
          throw new InvariantError('User gagal like album');
        }
        // tambahkan cache delete likes
        await this._cacheService.delete(`likes:${albumId}`);
    }
    // service untuk menghapus album like
    async dislikeAlbum(albumId, userId) {
        // query menghapus album like
        const query = {
          text: 'DELETE FROM album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
          values: [albumId, userId],
        };
        // eksekusi query album like
        const result = await this._pool.query(query);
        // cek rows
        if (!result.rowCount) {
          // jika tidak ada munculkan pesan error
          throw new InvariantError('User gagal unlike album');
        }
        // tambahkan cache delete likes
        await this._cacheService.delete(`likes:${albumId}`);
    }
    // service untuk verify album like
    async verifyAlbumLike(userId, albumId) {
        // query seleksi album like
        const query = {
          text: 'SELECT * FROM album_likes WHERE user_id = $1 AND album_id = $2',
          values: [userId, albumId],
        };
        //  eksekusi query
        const result = await this._pool.query(query);
        // cek row count jika sudah pernah like
        if (result.rowCount > 0) {
          // munculkan pesan error anda telah menyukai album ini
          throw new ClientError('Anda sudah menyukai album ini');
        }
        return result.rowCount;
    }
    // service untuk get album like
    async getAlbumLike(albumId) {
      try {
        const result = await this._cacheService.get(`likes:${albumId}`);
        return {
          likes: JSON.parse(result),
          isCache: 1,
        };
      } catch (error) {
        // query get album like
        const query = {
          text: 'SELECT * FROM album_likes WHERE album_id = $1',
          values: [albumId],
        };
        //  eksekusi query
        const result = await this._pool.query(query);
        // cek rowcount
        if (!result.rowCount) {
          throw new NotFoundError('Album tidak ditemukan');
        }
        // tambahkan cache untuk set album likes
        await this._cacheService.set(`likes:${albumId}`, JSON.stringify(result.rowCount));
        return {
          likes: result.rowCount,
        };
      }
    }
}
// eksport class albums service
module.exports = AlbumLikesService;
