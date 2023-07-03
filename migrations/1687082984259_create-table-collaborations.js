/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('collaborations', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            references: '"playlists"',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            unique: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            references: '"users"',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            unique: true,
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
    pgm.dropTable('collaborations');
};
