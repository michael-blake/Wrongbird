'use strict'

$(document).ready(function(){
  console.log('ready');
});


var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: 'zJRUjQHAdc8',
      playerVars: {
          'controls': 0,
          'autoplay': 1,
          'showinfo': 0,
          'modestbranding': 1,
          'rel': 0
      },
      events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
      }
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
  player.mute();
}

var videoLoop;

function onPlayerStateChange(event) {
  var duration = player.getDuration();
  if(!videoLoop)
    videoLoop = setInterval(function(){player.seekTo(0)}, duration * 1000);
  document.getElementById('title-block').style.opacity = '1';

}