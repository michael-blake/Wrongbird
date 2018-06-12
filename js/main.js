'use strict'

//-------------------------------DOCUMENT INIT--------------------------------//
//-------------------PLACE ANY JQUERY INITIALIZATION HERE---------------------//
window.location.hash = '';

$(document).ready(function(){
  var nav = new Navigator();
  nav.addNavLocation("Shows", "#shows-area");
  nav.addNavLocation("Gallery", "#gallery-area");
  nav.addNavLocation("Video", "#video-area");
  nav.addNavLocation("Contact", "#contact-area");
})

//------------------------------EVENT LISTENERS-------------------------------//
window.addEventListener("beforeunload", function (event) {
  $.scrollify.instantMove("#home");
  $.scrollify.destroy();
  return null;
});

window.onresize = function() {
  var p = $("#player")[0];
  var aspectRatio = window.innerWidth / window.innerHeight;
  if(aspectRatio > 1.77) {
    p.style.height = window.innerHeight + "px";
    p.style.left = -(window.style.innerWidth - p.style.width) / 2 + "px";
    p.style.width = window.innerHeight * 1.77 + "px";
    p.style.top = 0 + "px";
  } else {
    p.style.width = window.innerWidth + "px";
    p.style.top = -(window.innerHeight - p.style.height) / 2 + "px";
    p.style.height = window.innerWidth / 1.77 + "px";
    p.style.left = 0 + "px";

  }

}
//-----------------------------BACKGROUND VIDEO-------------------------------//
var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
      height: '315',
      width: '560',
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
  document.getElementById('name').style.opacity = '1';

  if(player.getPlayerState() == 1)
    event.target.a.classList.remove('invisible');
}

//--------------------------------SCROLLIFY-----------------------------------//
var scrollSpeed = 500;

$(function() {
	$.scrollify({
		section:".panel",
    easing: "easeOutSine",
    scrollSpeed:scrollSpeed,
    scrollbars: false,
    before:function(i){
      var x = $.scrollify.current();

      if(x[0].dataset.sectionName == "info") {

        $("#name").animate({
          top: 0,
          fontSize: "2em"
        }, scrollSpeed, function(){});

        $("#player").animate({
          opacity: 0.1
        }, scrollSpeed,function(){});

      } else {

        $("#name").animate({
          top: "40vh",
          fontSize: "3em"
        }, scrollSpeed, function(){});

        $("#player").animate({
          opacity: 0.4
        }, scrollSpeed,function(){});

      }
    },
		after:function(i) {
		}
	});

	$(".scroll,.scroll-btn").click(function(e) {
		e.preventDefault();
		$.scrollify.next();
	});

	var hasHovered = false;
	$(".coffee").on("mouseenter focus",function() {
		if(hasHovered===false) {
			ga('send', 'event', 'Coffee', 'hover', 'Buy me a coffee');
			hasHovered = true;
		}
	});
});


//-------------------------------NAVIGATION-----------------------------------//
class NavElement {
  constructor(buttonText, areaID, navigator) {
    this.button = document.createElement('div');
    this.button.classList.add('nav-button');
    this.button.innerHTML = buttonText;
    this.button.navElement = this;
    this.area = $(areaID)[0].cloneNode();
    this.area.classList.remove("hide");
    $("#nav-area")[0].appendChild(this.area);
    this.navigator = navigator;

    $("#nav-pane")[0].appendChild(this.button);

    $(this.button).click(function(){
      this.navElement.navigator.navigate(this.navElement);
    })
  }
}

class Navigator {
  constructor() {
    this.navPane = $("#nav-pane")[0];
    this.navArea = $("#nav-area")[0];
    this.buttons = [];
    this.navElements = [];
    this.loc;
  }

  addNavLocation(buttonText, areaID) {
    var item = new NavElement(buttonText, areaID, this);
    this.buttons.push(item.button);
    this.navElements.push(item);
    
    if(this.navElements.length == 1){
      this.loc = item;
      item.button.classList.add("nav-selected");
    }
  }

  navigate(newLocation){
    this.loc.button.classList.remove("nav-selected");
    this.loc = newLocation;
    this.loc.button.classList.add("nav-selected");

    var ind = this.navElements.indexOf(this.loc);
    var left = this.navArea.offsetWidth * (-ind);

    $(this.navArea).animate({
      left: left + "px",
    }, 500, function(){});

    // this.navArea.style.left = left + "px" ;
  }


}