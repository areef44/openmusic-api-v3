// import module nanoid
const { nanoid } = require('nanoid');
// module postgresql
const { Pool } = require('pg');
// import Invariant error dari exceptions
const InvariantError = require('../../exceptions/InvariantError');

// buat class Collaborations service
class CollaborationsService {
    // tambahkan usersservice
    constructor(usersService) {
        // inisialiasasi properti pool postgres
        this._pool = new Pool();
        // inisialiasi users service
        this._usersService = usersService;
    }

    // fungsi untuk menambah collaboration
    async addCollaboration({ playlistId, userId }) {
        // cek dulu data user didatabase
        await this._usersService.verifyUserInDatabase(userId);
        // dapatkan id menggunakan nanoid
        const id = `collab-${nanoid(16)}`;
        // dapatkan waktu sekarang menggunakan fungsi new Date()
        const createdAt = new Date().toISOString();
        // query untuk menambah collaborations
        const query = {
            text: `INSERT INTO collaborations 
                   VALUES ($1, $2, $3, $4, $5) 
                   RETURNING id`,
            // variabel yang diinputkan
            values: [id, playlistId, userId, createdAt, createdAt],
        };

        // eksekusi query lalu simpan rows nya dan hitung jumlah rownya
        const { rows, rowCount } = await this._pool.query(query);

        // jika rowcountnya tidak ada
        if (!rowCount) {
            // munculkan invariant error
            throw new InvariantError('Kolaborasi gagal dibuat');
        }
        // kembalikan nilai rowsnya
        return rows[0].id;
    }

    // fungsi untuk menghapus collaboration
    async deleteCollaboration({ playlistId, userId }) {
        // query untuk menghapus collaborations
        const query = {
            text: `DELETE FROM collaborations 
                   WHERE playlist_id = $1 AND user_id = $2 
                   RETURNING id`,
            // variabel yang diinputkan
            values: [playlistId, userId],
        };

        // eksekusi query lalu simpan rows nya dan hitung jumlah rownya
        const { rows, rowCount } = await this._pool.query(query);

        // jika jumlah rownya kosong maka
        if (!rowCount) {
            // munculkan pesan error
            throw new InvariantError('Kolaborasi gagal dihapus');
        }

        // kembalikan nilai rowsnya
        return rows[0].id;
    }

    // fungsi untuk verifikasi collaboration
    async verifyCollaboration(playlistId, userId) {
        // query untuk memilih collaborations berdasar playlist_id dan user_id
        const query = {
            text: `SELECT * FROM collaborations 
                   WHERE playlist_id = $1 AND user_id = $2`,
            // variabel yang diinputkan
            values: [playlistId, userId],
        };

        // eksekusi query lalu simpan rows nya dan hitung jumlah rownya
        const { rows, rowCount } = await this._pool.query(query);

        // jika jumlah rownya kosong maka
        if (!rowCount) {
            // munculkan pesan error
            throw new InvariantError('Kolaborasi gagal diverifikasi.');
        }
        // kembalikan nilai rowsnya
        return rows[0].id;
    }
}

// exports module collaborations service
module.exports = CollaborationsService;
