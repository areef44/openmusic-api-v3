const routes = (handler) => [
    // endpoint untuk add collaborations
    {
        method: 'POST',
        path: '/collaborations',
        handler: (request, h) => handler.postCollaborationHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
    // endpoint untuk delete collaborations
    {
        method: 'DELETE',
        path: '/collaborations',
        handler: (request, h) => handler.deleteCollaborationHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
];
// exports routes collaborations
module.exports = routes;
