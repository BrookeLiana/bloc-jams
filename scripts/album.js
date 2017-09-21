// Example Album
 var albumPicasso = {
     name: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { name: 'Blue', duration: '4:26' },
         { name: 'Green', duration: '3:14' },
         { name: 'Red', duration: '5:01' },
         { name: 'Pink', duration: '3:21'},
         { name: 'Magenta', duration: '2:15'}
     ]
 };

 // Another Example Album
 var albumMadonna = {
     name: 'Sunshine',
     artist: 'Madonna',
     label: 'PRG',
     year: '2015',
     albumArtUrl: 'assets/images/album_covers/02.png',
     songs: [
         { name: 'Hello, Operator?', duration: '2:51' },
         { name: 'Ring, ring, ring', duration: '5:01' },
         { name: 'Fits in your pocket', duration: '3:21'},
         { name: 'Can you hear me now?', duration: '3:45' },
         { name: 'Wrong phone number', duration: '2:15'}
     ]
 };
 // Another Example Album
 var albumMarconi = {
     name: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { name: 'Hello, Operator?', duration: '1:01' },
         { name: 'Ring, ring, ring', duration: '5:01' },
         { name: 'Fits in your pocket', duration: '3:21'},
         { name: 'Can you hear me now?', duration: '3:14' },
         { name: 'Wrong phone number', duration: '2:15'}
     ]
 };



 var createSongRow = function(songNumber, songName, songLength) {
    var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>'
     ;

    return template;
};
    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

var setCurrentAlbum = function(album) {
    // #2
    albumTitle.firstChild.nodeValue = album.name;

    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);

    // #3
    albumSongList.innerHTML = '';

    // #4
    for (var i = 0; i < album.songs.length; i++) {
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

window.onload = function() {
    setCurrentAlbum(albumPicasso);

    songListContainer.addEventListener('mouseover', function(event) {
           // #1
           if (event.target.parentElement.className === 'album-view-song-item') {
             event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
          }
       });

       for (var i = 0; i < songRows.length; i++) {
         songRows[i].addEventListener('mouseleave', function(event) {
           // Selects first child element, which is the song-item-number element
            this.children[0].innerHTML = this.children[0].getAttribute('data-song-number');
         });
     }

    var albums = [albumPicasso, albumMarconi, albumMadonna];
    var index = 1;
    albumImage.addEventListener("click", function(event){
      setCurrentAlbum(albums[index]);
      index++;
      if (index == albums.length){
        index = 0;
      }
    });
};
