// import module postgres
const { Pool } = require('pg');
// import Invariant error dari exceptions
const InvariantError = require('../../exceptions/InvariantError');

// buat class untuk authentication service
class AuthenticationsService {
    constructor() {
        // inisialiasasi properti pool postgres
        this._pool = new Pool();
    }

    // fungsi untuk menambah refresh token
    async addRefreshToken(token) {
        // query untuk menambahkan refresh token
        const query = {
            text: `INSERT INTO authentications 
                   VALUES($1)`,
            // variabel yang diinputkan
            values: [token],
        };
        // eksekusi query tanpa mengembalikan nilai dan response
        await this._pool.query(query);
    }

    // fungsi untuk verifikasi refresh token
    async verifyRefreshToken(token) {
        // query untuk memilih refresh token berdasarkan id
        const query = {
            text: `SELECT token 
                   FROM authentications 
                   WHERE token = $1`,
            // variabel yang diinputkan
            values: [token],
        };

        // simpan nilai query dan hitung jumlah rownya
        const { rows, rowCount } = await this._pool.query(query);

        // cek jika jumlah rownya = 0
        if (!rowCount) {
            // maka munculkan pesan error
            throw new InvariantError('Refresh token tidak valid');
        }

        // return nilai refreshtoken
        return rows;
    }

    // fungsi untuk menghapus refresh token
    async deleteRefreshToken(token) {
        // query untuk menghapus refresh token berdasarkan id
        const query = {
            text: `DELETE FROM authentications 
                   WHERE token = $1`,
            // variabel yang diinputkan
            values: [token],
        };

        // eksekusi query tanpa mengembalikan nilai dan response
        await this._pool.query(query);
    }
}

// exports module activities service
module.exports = AuthenticationsService;
