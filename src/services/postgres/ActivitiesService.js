// import module nanoid
const { nanoid } = require('nanoid');
// module postgresql
const { Pool } = require('pg');

// constructor Activities Services
class ActivitiesService {
    constructor() {
        // inisialiasasi properti pool postgres
        this._pool = new Pool();
    }
    // Service untuk menghapus Activity
    async deleteActivities(playlistId, userId, songId) {
       // dapatkan id menggunakan nanoid
       const id = `activity-${nanoid(16)}`;
       // dapatkan waktu sekarang menggunakan new date
       const time = new Date();
       // query untuk menghapus activity playlist
       const query = {
          text: `INSERT INTO playlist_song_activities
          VALUES($1,$2,$3,$4,$5,$6)`,
          values: [id, playlistId, songId, userId, 'delete', time],
         };
         // eksekusi query tanpa return nilai atau response
         await this._pool.query(query);
      }
      // Service untuk menambah Activity
     async addActivities(playlistId, userId, songId) {
        // dapatkan id menggunakan nanoid
        const id = `activity-${nanoid(16)}`;
        // dapatkan waktu sekarang menggunakan new date
        const time = new Date();
        // query untuk menambahkan activity playlist
        const query = {
          text: `INSERT INTO playlist_song_activities
                 VALUES($1, $2, $3, $4, $5, $6)`,
           // variabel yang diinputkan
          values: [id, playlistId, songId, userId, 'add', time],
        };
        // eksekusi query tanpa return nilai atau response
        await this._pool.query(query);
     }
}

// exports module activities service
module.exports = { ActivitiesService };
