// import module nanoid
const { nanoid } = require('nanoid');
// import module postgres
const { Pool } = require('pg');
// import module bcrypt
const bcrypt = require('bcrypt');
// import module error dafi folder exceptions
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const NotFoundError = require('../../exceptions/NotFoundError');

// buat class users service
class UsersService {
    constructor() {
        // inisialiasasi properti pool postgres
        this._pool = new Pool();
    }

     // fungsi verifikasi User Credential berdasarkan username
     async verifyUserCredential({ username, password }) {
        // query untuk menyeleksi id username fullname dan password dari table users
        const query = {
            text: `SELECT id, username, fullname,password 
                   FROM users 
                   WHERE username LIKE $1`,
            // variabel yang diinputkan
            values: [`%${username}`],
        };

        // eksekusi query lalu simpan rows nya dan hitung jumlah rownya
        const { rows, rowCount } = await this._pool.query(query);

        // jika jumlah rownya kosong maka
        if (!rowCount) {
            // munculkan pesan error
            throw new AuthenticationError('Kredensial yang Anda berikan salah');
        }

        // simpan kredensial id dan hashpassword yang diinput
        const { id, password: hashedPassword } = rows[0];

        // bandingkan credensial yang ada didatabase dengan yang diinputkan
        const compare = await bcrypt.compare(password, hashedPassword);

        // jika tidak sama
        if (!compare) {
            // munculkan pesan error
            throw new AuthenticationError('Krendensial yang Anda berikan salah');
        }

        // kembalikan nilai id
        return id;
    }

    // Verifikasi User di database
    async verifyUserInDatabase(userId) {
        // query untuk menyeleksi id dari table users
        const query = {
            text: `SELECT id 
                   FROM users 
                   WHERE id = $1`,
            // variabel yang diinputkan
            values: [userId],
        };
        // simpan dan hitung Rowsnya
        const { rowCount } = await this._pool.query(query);
        // jika rowsnya kosong maka
        if (!rowCount) {
                // munculkan pesan error
                throw new NotFoundError('User tidak ditemukan');
        }
    }

    // Verifikasi username
    async verifyNewUsername(username) {
        // query untuk menyeleksi username dari table users
        const query = {
            text: `SELECT username 
                   FROM users 
                   WHERE username = $1`,
            // variabel yang diinputkan
            values: [username],
        };

        // simpan dan hitung Rowsnya
        const { rowCount } = await this._pool.query(query);

        // jika rowsnya kosong maka
        if (rowCount) {
            // munculkan pesan error
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
        }
    }

       // fungsi menambahkan user
       async addUser({ username, password, fullname }) {
        // Verifikasi username, pastikan belum terdaftar.
        await this.verifyNewUsername(username);

        // Bila verifikasi lolos, maka masukkan user baru ke database.
        // dapatkan id dengan nanoid
        const id = `user-${nanoid(16)}`;
        // dapatkan password lalu hash passwordnya
        const hashedPassword = await bcrypt.hash(password, 10);
        // dapatkan waktu sekarang
        const createdAt = new Date().toISOString();
        // query untuk menambahkan user ke table users
        const query = {
            text: `INSERT INTO users 
                   VALUES($1,$2,$3,$4,$5,$6) 
                   RETURNING id`,
            // variabel yang diinputkan
            values: [id, username, fullname, hashedPassword, createdAt, createdAt],
        };
        // simpan datanya ke dalam rows
        const { rows } = await this._pool.query(query);
        // cek jika rowsnya tidak ada
        if (!rows[0].id) {
            // maka munculkan pesan error
            throw new InvariantError('User gagal ditambahkan');
        }

        // kembalikan nilai rows berdasarkan id
        return rows[0].id;
    }
}

// export users servicesnya
module.exports = UsersService;
