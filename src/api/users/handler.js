class UsersHandler {
    constructor(service, validator) {
        // inisialiasi service dan validator users handler
        this._service = service;
        this._validator = validator;
    }

    // handler untuk menambahkan Users
    async postUserHandler(request, h) {
        // validasi userpayload
        const userValidated = await this._validator.validateUserPayload(request.payload);
        // menambahkan user
        const userId = await this._service.addUser(userValidated);
        // response untuk hasil eksekusi
        const response = h.response({
            status: 'success',
            message: 'User berhasil ditambahkan',
            data: {
                userId: userId,
            },
        });
        // responce code
        response.code(201);
        // kembalikan response
        return response;
    }
}

module.exports = UsersHandler;
