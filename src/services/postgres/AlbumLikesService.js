const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');

class AlbumLikesService {
    constructor(cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;
    }

    async addAlbumLike(userId, albumId) {
        const id = `like-${nanoid(16)}`;
        const query = {
          text: 'INSERT INTO album_likes values ($1, $2, $3)',
          values: [id, userId, albumId],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
          throw new InvariantError('User gagal like album');
        }
        await this._cacheService.delete(`likes:${albumId}`);
    }

    async dislikeAlbum(albumId, userId) {
        const query = {
          text: 'DELETE FROM album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
          values: [albumId, userId],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
          throw new InvariantError('User gagal unlike album');
        }
        await this._cacheService.delete(`likes:${albumId}`);
    }

    async verifyAlbumLike(userId, albumId) {
        const query = {
          text: 'SELECT * FROM album_likes WHERE user_id = $1 AND album_id = $2',
          values: [userId, albumId],
        };
        const result = await this._pool.query(query);

        if (result.rowCount > 0) {
          throw new ClientError('Anda sudah menyukai album ini');
        }
        return result.rowCount;
    }

    async getAlbumLike(albumId) {
      try {
        const result = await this._cacheService.get(`likes:${albumId}`);
        return {
          likes: JSON.parse(result),
          isCache: 1,
        };
      } catch (error) {
        const query = {
          text: 'SELECT * FROM album_likes WHERE album_id = $1',
          values: [albumId],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
          throw new NotFoundError('Album tidak ditemukan');
        }

        await this._cacheService.set(`likes:${albumId}`, JSON.stringify(result.rowCount));
        return {
          likes: result.rowCount,
        };
      }
    }
}

module.exports = AlbumLikesService;
