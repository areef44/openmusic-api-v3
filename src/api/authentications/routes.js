const routes = (handler) => [

    // endpoint untuk add authentications
    {
        method: 'POST',
        path: '/authentications',
        handler: (request, h) => handler.postAuthenticationHandler(request, h),
    },

    // endpoint untuk update authentications
    {
        method: 'PUT',
        path: '/authentications',
        handler: (request, h) => handler.putAuthenticationHandler(request, h),
    },

    // endpoint untuk delete authentications
    {
        method: 'DELETE',
        path: '/authentications',
        handler: (request, h) => handler.deleteAuthenticationHandler(request, h),
    },
];

// exports module routes
module.exports = routes;
