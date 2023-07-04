// import module nanoid
const { nanoid } = require('nanoid');
// import module pg
const { Pool } = require('pg');
// import module error
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
// import mapDBpplaylistsong sama playlist activity
const { mapDBPlaylistSong, mapDBPlaylistActivity } = require('../../utils');

// buat class playlistservice
class PlaylistsService {
    constructor(songsService, activitiesService, collaborationsService) {
        // inisialiasi pgservice
        this._pool = new Pool();
        // inisialiasi songservice
        this._songsService = songsService;
        // inisialiasi activities service
        this._activitiesService = activitiesService;
        // inisialiasi collaboration service
        this._collaborationsService = collaborationsService;
    }

    // fungsi untuk verifikasi pemilik playlist
    async verifyPlaylistOwner(id, owner) {
        // query untuk seleksi owner dari tabel playlists
        const query = {
            text: `SELECT id,owner 
                   FROM playlists 
                   WHERE id = $1`,
            values: [id],
        };
        // simpan ke dalam rows dan hitung rowscountnya
        const { rows, rowCount } = await this._pool.query(query);
        // cek rowsnya jika tidak ada
        if (!rowCount) {
            // maka munculkan pesan error
            throw new NotFoundError('Playlist tidak ditemukan');
        }
        // simpan rowsnya ke dalam variabel playlist
        const playlist = rows[0];
        // cek jika rows owner yang diseleksi tidak sama dengan owner di database maka
        if (playlist.owner !== owner) {
            // munculkan pesan authorization error
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }
      // fungsi untuk verifikasi playlist access
      async verifyPlaylistAccess(playlistId, userId) {
          try {
              // cek menggunakan fungsi verifyplaylistowner
              await this.verifyPlaylistOwner(playlistId, userId);
          } catch (error) {
              // jika error munculkan pesan error
              if (error instanceof NotFoundError) {
                  throw error;
              }
              try {
                  // verifikasi juga collaborationnya
                  await this._collaborationsService.verifyCollaboration(playlistId, userId);
              } catch {
                  throw error;
              }
          }
      }
    // fungsi untuk menambahkan playlist
    async addPlaylist({ name, owner }) {
        // dapatkan id menggunakan nano id
        const id = `playlist-${nanoid(16)}`;
        // dapatkan waktu dibuat dengan menggunakan fungsi new data
        const createdAt = new Date().toISOString();
        // query menambahkan playlists
        const query = {
            text: `INSERT INTO playlists 
                   VALUES($1,$2,$3,$4,$5) 
                   RETURNING id`,
            values: [id, name, owner, createdAt, createdAt],
        };
        // simpan hasil query ke variabel object rows
        const { rows } = await this._pool.query(query);

        // cek object rows jika kosong
        if (!rows[0].id) {
           // munculkan pesan error
           throw new InvariantError('Daftar putar gagal ditambahkan.');
        }
        // jika ada nilainya kembalikan nilai rows
        return rows[0].id;
    }
    // fungsi untuk mendapatkan daftar playlists
    async getPlaylists(id) {
        // query mendapatkan daftar playlists
        const query = {
            text: `SELECT p.id, p.name, u.username 
                   FROM playlists p
                   LEFT JOIN collaborations c ON c.playlist_id = p.id
                   INNER JOIN users u ON u.id = p.owner
                   WHERE p.owner = $1 
                   OR p.id = $1 
                   OR c.user_id = $1`,
            values: [id],
        };
        // simpan hasil query ke variabel object rows
        const { rows } = await this._pool.query(query);
        // lalu kembalikan nilai rowsnya
        return rows;
    }

    // fungsi untuk menghapus playlists
    async deletePlaylistById(id) {
        // query untuk menghapus playlists
        const query = {
            text: `DELETE FROM playlists 
                   WHERE id = $1 
                   RETURNING id`,
            values: [id],
        };
        // simpan ke variabel rowCount lalu hitung
        const { rowCount } = await this._pool.query(query);

        // jika rowCountnya kosong
        if (!rowCount) {
            // maka munculkan pesan error
            throw new NotFoundError('Daftar putar gagal dihapus. Id tidak ditemukan.');
        }
    }
    // fungsi untuk menghapus lagu dari playlists
    async addSongToPlaylist(playlistId, songId, userId) {
        // check dulu lagunya di dalam tabel song lalu simpan ke variabel checkSong
        const songIdfromDatabase = await this._songsService.verifySongInDatabase(songId);
        // jika tidak ada lagunya maka
        if (!songIdfromDatabase) {
            // bangkitkan error
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        // jika lagunya ada maka dapatkan id untuk songsnya
        const id = `playlist-song-${nanoid(16)}`;
        // dapatkan waktu sekarang menggunakan fungsi newDate
        const createdAt = new Date().toISOString();
        // query untuk menambahkan lagu ke tabel playlists song
        const query = {
            text: `INSERT INTO playlist_songs 
                   VALUES($1, $2, $3, $4, $5) 
                   RETURNING id`,
            values: [id, playlistId, songId, createdAt, createdAt],
        };
        // simpan kedalam variabel rows
        const { rows } = await this._pool.query(query);

        // cek jika rowsnya kosong maka munculkan pesan error
        if (!rows[0].id) {
          throw new InvariantError('Lagu gagal ditambahkan ke daftar putar');
        }
        // kemudian tambahkan services addactivity
        await this._activitiesService.addActivities(playlistId, userId, songId);
    }

    // fungsi untuk mendapatkan daftar lagu dari daftar putar
    async getSongFromPlaylist(playlistId) {
        // query untuk mendapatkan daftar putar
        const getPlaylist = {
            text: `SELECT p.id, p.name, u.username 
                   FROM playlists p
                   LEFT JOIN users u ON p.owner = u.id
                   WHERE p.id = $1`,
            values: [playlistId],
        };

        // query untuk mendapatkan daftar lagu
        const getSongs = {
            text: `SELECT s.id, s.title, s.performer
                   FROM playlist_songs ps
                   JOIN songs s ON ps.song_id = s.id
                   WHERE ps.playlist_id = $1`,
            values: [playlistId],
          };

          // eksekusi query dan simpan kedalam variabel Playlist dan songs
          const Playlist = await this._pool.query(getPlaylist);
          const Songs = await this._pool.query(getSongs);

          // kembalikan nilainya lalu map kedalam mapDBplaylistSongs
          return mapDBPlaylistSong(Playlist.rows[0], Songs.rows);
    }

    // fungsi untuk menghapus lagu dari daftarputar
    async deleteSongFromPlaylist(songId, playlistId, userId) {
        const query = {
            text: `DELETE FROM playlist_songs 
                   WHERE song_id = $1
                   RETURNING song_id`,
            values: [songId],
        };

        // simpan ke variabel rowCount lalu hitung
        const { rowCount } = await this._pool.query(query);

        // jika nilainya tidak maka bangkitkan pesan error
        if (!rowCount) {
            // pesan error yang akan muncul
            throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
        }

        // kemudian tambahkan services deleteactivityplaylist
        await this._activitiesService.deleteActivities(playlistId, userId, songId);
    }

    // fungsi untuk mendapatkan aktivitas dari menambahkan dan menghapus lagu dari playlists
    async getActivities(playlistId) {
        // dapatkan dlu playlistsnya
        const playlist = await this.getPlaylists(playlistId);
        // query untuk mendapatkan aktivitas
        const query = {
            text: `SELECT u.username, s.title, psa.action, psa.time
            FROM playlist_song_activities psa
            INNER JOIN users u ON u.id = psa.user_id
            INNER JOIN songs s ON s.id = psa.song_id
            WHERE psa.playlist_id = $1
            ORDER BY psa.time ASC`,
            values: [playlistId],
        };

        // simpan ke variabel row
        const { rows } = await this._pool.query(query);

        // kembalikan nilai lalu buat mappingnya
        return mapDBPlaylistActivity(playlist[0].id, rows);
    }
}

// export module playlist service
module.exports = { PlaylistsService };
