// definisi class constructor untuk AlbumsHandler
class AlbumsHandler {
    constructor(service, validator) {
        // inisialiasi service dan validator untuk album handler
        this._service = service;
        this._validator = validator;
    }
    // handler untuk menambahkan album
    async postAlbumHandler(request, h) {
        // validasi album payload
        const albumValidated = this._validator.validateAlbumPayload(request.payload);

        // eksekusi service add albums yang telah divalidasi
        const albumId = await this._service.addAlbum(albumValidated);

        // response untuk eksekusi
        const response = h.response({
            status: 'success',
            message: 'Album berhasil ditambahkan',
            data: {
                albumId,
            },
        });
        // pesan response hasil eksekusi
        response.code(201);
        // return hasil respon
        return response;
    }

    // handler untuk mendapatkan data album berdasarkan id
    async getAlbumByIdHandler(request) {
        // tangkap request params
        const { id } = request.params;
      // eksekusi service get albumsById
        const album = await this._service.getAlbumById(id);
        // return hasil eksekusi
        return {
        status: 'success',
        data: {
            album,
        },
        };
    }

    // handler untuk merubah data album berdasarkan id
    async putAlbumByIdHandler(request, h) {
        // validasi album payload
        const albumValidated = this._validator.validateAlbumPayload(request.payload);

        // dapatkan id
        const { id } = request.params;

        // eksekusi service editAlbumById
        await this._service.editAlbumById(id, albumValidated);

        // simpan response ke variabel response
        const response = h.response({
            status: 'success',
            message: 'Album berhasil diperbarui',
        });

        // kembalikan response
        return response;
    }

    // handler untuk merubah data album berdasarkan id
    async deleteAlbumByIdHandler(request, h) {
        // dapatkan id
        const { id } = request.params;

        // eksekusi service deleteAlbumByid
        await this._service.deleteAlbumById(id);

        // simpan response ke variabel response
        const response = h.response({
            status: 'success',
            message: 'Album berhasil dihapus',
        });

        // kembalikan response
        return response;
    }
}

// eksports module AlbumsHandler
module.exports = AlbumsHandler;
