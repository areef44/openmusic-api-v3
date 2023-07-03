/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('users', {
        id: {
            type: 'VARCHAR(30)',
            primaryKey: true,
        },
        username: {
            type: 'VARCHAR(30)',
            notNull: true,
        },
        fullname: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        password: {
            type: 'TEXT',
            notNull: true,
        },
        created_at: {
            type: 'TEXT',
            notNull: true,
        },
        updated_at: {
            type: 'TEXT',
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('users');
};
