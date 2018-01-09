var filterTimeCode = function(timeInSeconds) {
  var time = parseFloat(timeInSeconds);
  var minutes = Math.floor(time / 60);
  var seconds = Math.floor(time - minutes * 60);

  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  return minutes + ':' + seconds;
}

var createSongRow = function(songNumber, songName, songLength) {
    var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
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
    currentAlbum = album;
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

var setCurrentTimeInPlayerBar = function(currentTime) {
  $('.current-time').text(filterTimeCode(currentTime));
}

var updateSeekBarWhileSongPlays = function() {
   if (currentSoundFile) {
       // #10
       currentSoundFile.bind('timeupdate', function(event) {
           // #11
           var seekBarFillRatio = this.getTime() / this.getDuration();
           var $seekBar = $('.seek-control .seek-bar');

           updateSeekPercentage($seekBar, seekBarFillRatio);
           setCurrentTimeInPlayerBar(seekBarFillRatio * currentSoundFile.getDuration());
       });
   }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;
  // #1
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

  // #2
  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
}


var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPause = $('.main-controls .play-pause');

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  var $volumeFill = $('.volume .fill');
  var $volumeThumb = $('.volume .thumb');
  $volumeFill.width(currentVolume + '%');
  $volumeThumb.css({left: currentVolume + '%'});

  var setTotalTimeInPlayerBar = function(totalTime) {
    $('.total-time').html(filterTimeCode(totalTime));
  }

  var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
        updateSeekBarWhileSongPlays();
    }
  }

  var setVolume = function(volume) {
    if (currentSoundFile) {
      currentSoundFile.setVolume(volume);
    }
  }

  $previousButton.click(function(event) {
    previousSong();
  });
  $nextButton.click(function(event) {
    nextSong();
  });

  $playPause.click(function(event) {
    togglePlayFromPlayerBar();
  });

  var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');

     $seekBars.click(function(event) {
         // #3
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         // #4
         var seekBarFillRatio = offsetX / barWidth;

         if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
         } else {
            setVolume(seekBarFillRatio * 100);
         }

         // #5
         updateSeekPercentage($(this), seekBarFillRatio);
     });

     $seekBars.find('.thumb').mousedown(function(event) {
         // #8
         var $seekBar = $(this).parent();

         // #9
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;

             if ($seekBar.parent().attr('class') == 'seek-control') {
                  seek(seekBarFillRatio * currentSoundFile.getDuration());
             } else {
                  setVolume(seekBarFillRatio);
             }

             updateSeekPercentage($seekBar, seekBarFillRatio);
         });

         // #10
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
  };
  setupSeekBars();

  var togglePlayFromPlayerBar = function() {
    if (currentSoundFile) {
      if (currentSoundFile.isPaused()) {
        $('.song-item-number').html(pauseButtonTemplate);
        $playPause.html(playerBarPauseButton);
        currentSoundFile.play();
      } else {
        $('.song-item-number').html(playButtonTemplate);
        $playPause.html(playerBarPlayButton);
        currentSoundFile.pause();
      }
    }
  }

  var updatePlayerBarSong = function() {
    $('.song-name').text(currentAlbum.songs[currentlyPlayingSongNumber - 1].name);
    $('.artist-name').text(currentAlbum.artist);
    $('.artist-song-mobile').text(currentAlbum.songs[currentlyPlayingSongNumber - 1].name + ' - ' + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(currentAlbum.songs[currentlyPlayingSongNumber - 1].duration);
  }

  var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
  };

  var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex = currentSongIndex + 1;

    if (currentSongIndex >= currentAlbum.songs.length) {
      currentSongIndex = 0;
    }
    var previousSongNumber = currentlyPlayingSongNumber;

    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updatePlayerBarSong();

    $('[data-song-number="' + currentlyPlayingSongNumber + '"]').html(currentlyPlayingSongNumber);
    $('[data-song-number="' + previousSongNumber + '"]').html(previousSongNumber);
  }

  var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex = currentSongIndex - 1;

    if (currentSongIndex >= currentAlbum.songs.length) {
      currentSongIndex = 0;
    }
    var previousSongNumber = currentlyPlayingSongNumber;

    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updatePlayerBarSong();
    $('.main-controls .play-pause').html(playerBarPauseButton);

    $('[data-song-number="' + currentlyPlayingSongNumber + '"]').html(currentlyPlayingSongNumber);
    $('[data-song-number="' + previousSongNumber + '"]').html(previousSongNumber);

  }

  var setSong = function(songNumber) {
    if (currentSoundFile) {
      currentSoundFile.stop();
    }

    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
      formats: ['mp3'],
      preload: true
    });
    setVolume(currentVolume);
  }

  var getSongNumberCell = function(number) {
    var currentlyPlayingSongElement = $('[data-song-number="' + number + '"]');
    currentlyPlayingSongElement.html(parseInt(number));
    return currentlyPlayingSongElement;
  }

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

    if (currentlyPlayingSongNumber === null) {
       songItem.innerHTML = pauseButtonTemplate;

       setSong(songItem.getAttribute('data-song-number'));
       updatePlayerBarSong();

     } else if (currentlyPlayingSongNumber === songItem.getAttribute('data-song-number')) {
         if (currentSoundFile.isPaused()) {
           songItem.innerHTML = pauseButtonTemplate;
           $('.main-controls .play-pause').html(playerBarPlayButton);
            currentSoundFile.play();
            seek();
         } else {
           songItem.innerHTML = playButtonTemplate;
           $('.main-controls .play-pause').html(playerBarPauseButton);
           currentSoundFile.pause();
         }
         currentlyPlayingSongNumber = null;
         currentSongFromAlbum = null;

       } else if (currentlyPlayingSongNumber !== songItem.getAttribute('data-song-number')) {
         setSong(songItem.getAttribute('data-song-number'));
         currentSoundFile.play();
         seek();

         var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
         songItem.innerHTML = pauseButtonTemplate;
         updatePlayerBarSong();
       }
   };

   songListContainer.addEventListener('mouseover', function(event) {
     // #1
     if (event.target.parentElement.className === 'album-view-song-item') {

       var songItem = getSongItem(event.target);

       if (songItem.getAttribute('data-song-number') !== currentlyPlayingSongNumber) {
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
       if (songItemNumber !== currentlyPlayingSongNumber) {
         songItem.innerHTML = songItemNumber;
       }
     });

     songRows[i].addEventListener('click', function(event) {
       clickHandler(event.target);
     });
   }

   var albums = [albumPicasso, albumMarconi];
   var index = 1;
   albumImage.addEventListener("click", function(event){
      setCurrentAlbum(albums[index]);
      index++;
      if (index == albums.length){
        index = 0;
      }
   });
});
