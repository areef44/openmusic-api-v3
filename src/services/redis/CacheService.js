// module redis
const redis = require('redis');
const config = require('../../utils/config');
// definisi class constructor untuk cache service
class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: config.redis.host,
      },
    });

    this._client.on('error', (error) => {
      console.error(error);
    });

    this._client.connect();
  }

  // service untuk menambahkan key
  async set(key, value, expirationInSecond = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  // service untuk mendapatkan key
  async get(key) {
    const result = await this._client.get(key);

    if (result === null) throw new Error('Cache tidak ditemukan');

    return result;
  }

  // service untuk menghapus key
  delete(key) {
    return this._client.del(key);
  }
}

// eksport class cache service
module.exports = CacheService;
