// mapDBToModel mapping
const mapAlbumDBToModel = ({
    id,
    name,
    year,
    cover,
  }) => ({
    id,
    name,
    year,
    coverUrl: cover,
  });

// mapDBToModelAlbums mapping
const mapDBToModelAlbums = ({
    id,
    name,
    year,
    cover,
    }) => ({
    id,
    name,
    year,
    coverUrl: cover,
    });

// mapDBToModelSongs mapping
const mapDBToModelSongs = ({
      id,
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    }) => ({
      id,
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

  // mapDBPlaylistSong mapping
  const mapDBPlaylistSong = (playlists, songs) => ({
      playlist: {
          id: playlists.id,
          name: playlists.name,
          username: playlists.username,
          songs: songs,
      },
  });

  // mapDBPlaylistActivity
  const mapDBPlaylistActivity = (playlistId, activities) => ({
    playlistId: playlistId,
    activities: activities,
});

// exports mapping
module.exports = {
  mapAlbumDBToModel,
  mapDBToModelAlbums,
  mapDBToModelSongs,
  mapDBPlaylistSong,
  mapDBPlaylistActivity,
};
