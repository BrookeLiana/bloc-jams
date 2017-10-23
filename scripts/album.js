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

 // Another Example Album
 var albumMadonna = {
     name: 'Sunshine',
     artist: 'Madonna',
     label: 'PRG',
     year: '2015',
     albumArtUrl: 'assets/images/album_covers/02.png',
     songs: [
         { name: 'Arizona', duration: '2:51' },
         { name: 'Tomorrow Land', duration: '5:01' },
         { name: 'Chocolate Cake', duration: '3:21'},
         { name: 'Green Daisies', duration: '3:45' },
         { name: 'Tell your mama', duration: '2:15'}
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
    var albumArtist = document.getElementsByClassName('album-view-artists')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

var setCurrentAlbum = function(album) {
    // #2

    albumTitle.firstChild.nodeValue = album.name;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);

    // #3
    albumSongList.innerHTML = '';

    // #4
    for (var i = 0; i < album.songs.length; i++) {
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].name, album.songs[i].duration);
    }
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs
 var currentlyPlayingSong = null;

window.onload = function() {
    setCurrentAlbum(albumPicasso);

    var findParentByClassName = function(element, targetClass) {
      if (element) {
          var currentParent = element.parentElement;
          while (currentParent.className !== targetClass && currentParent.className !== null) {
              currentParent = currentParent.parentElement;

          }
          if (currentParent.className !== targetClass) {
              console.log('No parent found with that class name');
          }
          if (currentParent.className === null){
            console.log('No parent found');
          }
          return currentParent;
        }
    };

    var getSongItem = function(element) {
        switch (element.className) {
            case 'album-song-button':
            case 'ion-play':
            case 'ion-pause':
                return findParentByClassName(element, 'song-item-number');
            case 'album-view-song-item':
                return element.querySelector('.song-item-number');
            case 'song-item-title':
            case 'song-item-duration':
                return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
            case 'song-item-number':
                return element;
            default:
                return;
        }
    };

    var clickHandler = function(targetElement) {
      var songItem = getSongItem(targetElement);

      if (currentlyPlayingSong === null) {
         songItem.innerHTML = pauseButtonTemplate;

         currentlyPlayingSong = songItem.getAttribute('data-song-number');
       } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
           songItem.innerHTML = playButtonTemplate;
           currentlyPlayingSong = null;

         } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
           var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
           currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
           songItem.innerHTML = pauseButtonTemplate;
           currentlyPlayingSong = songItem.getAttribute('data-song-number');
       }
 };

    songListContainer.addEventListener('mouseover', function(event) {
           // #1
           if (event.target.parentElement.className === 'album-view-song-item') {

                var songItem = getSongItem(event.target);

               if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                    songItem.innerHTML = playButtonTemplate;
              }
          }
       });

       for (var i = 0; i < songRows.length; i++) {
         songRows[i].addEventListener('mouseleave', function(event) {

           // #1
             var songItem = getSongItem(event.target);
             var songItemNumber = songItem.getAttribute('data-song-number');

             // #2
             if (songItemNumber !== currentlyPlayingSong) {
                 songItem.innerHTML = songItemNumber;
             }
         });

         songRows[i].addEventListener('click', function(event) {
             clickHandler(event.target);
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
