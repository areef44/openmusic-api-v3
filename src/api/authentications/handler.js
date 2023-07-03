// definisi class constructor untuk AuthenticationsHandler
class AuthenticationsHandler {
    constructor(authenticationsService, usersService, tokenManager, validator) {
        // inisialiasi authenticationservice usersservice token manager validator untuk authentications handler
        this._authenticationsService = authenticationsService;
        this._usersService = usersService;
        this._tokenManager = tokenManager;
        this._validator = validator;
    }

    // handler untuk menambahkan authentications
    async postAuthenticationHandler(request, h) {
        // Validasi user
        const userValidated = await this._validator.validatePostAuthenticationPayload(request.payload);

        // verifikasi usercredential
        const id = await this._usersService.verifyUserCredential(userValidated);

        // generate access token
        const accessToken = await this._tokenManager.generateAccessToken({ id });

        // generate refresh token
        const refreshToken = await this._tokenManager.generateRefreshToken({ id });

        // lalu buat refresh token
        await this._authenticationsService.addRefreshToken(refreshToken);

        // response untuk hasil eksekusi
        const response = h.response({
            status: 'success',
            message: 'Authentication berhasil ditambahkan',
            data: {
                accessToken,
                refreshToken,
            },
        });
        // response code jika berhasil
        response.code(201);
        // kembalikan response
        return response;
    }

    // handler untuk refresh token
    async putAuthenticationHandler(request, h) {
        // validasi refresh token
        const refreshTokenValidated = this._validator.validatePutAuthenticationPayload(request.payload);
        // verify refresh token
        await this._authenticationsService.verifyRefreshToken(refreshTokenValidated.refreshToken);
        // verify refresh token
        const { id } = this._tokenManager.verifyRefreshToken(refreshTokenValidated.refreshToken);
        // simpan generaterefreshtoken dalam variabel accesstoken
        const accessToken = this._tokenManager.generateRefreshToken({ id });

        // response untuk hasil eksekusi
        const response = h.response({
            status: 'success',
            message: 'Access Token berhasil diperbarui',
            data: {
                accessToken,
            },
        });
        // kembalikan response
        return response;
    }

    // handler untuk delete token
    async deleteAuthenticationHandler(request, h) {
        // validasi refresh token
        const refreshTokenValidated = this._validator.validateDeleteAuthenticationPayload(request.payload);
        // verify refresh token
        await this._authenticationsService.verifyRefreshToken(refreshTokenValidated.refreshToken);
        // delete refresh token
        await this._authenticationsService.deleteRefreshToken(refreshTokenValidated.refreshToken);
        // response untuk hasil eksekusi
        const response = h.response({
            status: 'success',
            message: 'Refresh token berhasil dihapus',
        });
        // kembalikan response
        return response;
    }
}

// exports AuthenticationsHandler
module.exports = AuthenticationsHandler;
