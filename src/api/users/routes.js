const routes = (handler) => [

    // endpoint untuk add users
    {
        method: 'POST',
        path: '/users',
        handler: (request, h) => handler.postUserHandler(request, h),
    },
];

// exports module routes
module.exports = routes;
