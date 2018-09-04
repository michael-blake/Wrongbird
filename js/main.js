'use strict'

//-------------------------------DOCUMENT INIT--------------------------------//
//-------------------PLACE ANY JQUERY INITIALIZATION HERE---------------------//
window.location.hash = '';

$(document).ready(function(){
  window.setTimeout(function(){
    $(".home").animate({
      height: "0px"
    }, 600, function(){});

    $("#name").animate({
      top: 0,
      fontSize: "2em"
    }, 600, function(){});
  }, [3000]);                  // Adjust auto-scroll time here

  var nav = new Navigator();
  nav.addNavLocation("Shows", "#shows-area");
  nav.addNavLocation("Gallery", "#gallery-area");
  nav.addNavLocation("Contact", "#contact-area");

  // AJAX requests for shows
  $.ajax({
    type: "GET",
    url: "src/shows.csv",
    dataType: "text",
    success: function(data) {processCSV(data, 7);}
 });

 function processCSV(allText, length){
  var record_num = length;  // number of records
  var allTextLines = allText.split(/\r\n|\n/);
  allTextLines.pop()    // pop the garbage off the end
  
  for(var i = 1; i < allTextLines.length; ++i) {
    var entry = allTextLines[i].split(',');
    new Show(entry);
  }
}

// AJAX request for photos

var gallery = new Gallery();
var dir = "images/photos/"
$.ajax({
  type: "GET",
  url: dir,
  dataType: "text",
  success: function (data) {processPhotos(data);}
});

function processPhotos(data){
  $(data).find("a:contains(.jpg)").each(function () {
      var filename = this.href.replace(window.location.host, "").replace("http://", "");
      getMeta(filename);
  })
  var real_image_sizes = {};
  $(data).one('load', function() {
      //get real image size
      real_image_sizes.width = this.width;   // Note: $(this).width() will not
      real_image_sizes.height = this.height; // work for in memory images.
  }).each(function() {
      if(this.complete) $(this).load();
});
}

function getMeta(url){
  var img = new Image();
  img.onload = function(){
      var ar = this.width / this.height;
      gallery.addPhoto(url, ar);
  };
  img.src = url;
}

$(".grid").masonry('layout');

  var name = $("#name")[0];
  name.style.opacity = "100";
})

//------------------------------EVENT LISTENERS-------------------------------//
window.addEventListener("beforeunload", function (event) {
  $.scrollify.instantMove("#home");
  $.scrollify.destroy();
  return null;
});

window.onresize = function() {

}

//-------------------------------NAVIGATION-----------------------------------//
class NavElement {
  constructor(buttonText, areaID, navigator) {
    this.button = document.createElement('div');
    this.button.classList.add('nav-button');
    this.button.innerHTML = buttonText;
    this.button.navElement = this;
    this.area = $(areaID)[0].cloneNode(true);
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

    return item;
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

//----------------------------SHOW ELEMENTS-----------------------------------//
class Show {
  constructor(data) {
    this.venue       = data[0];
    this.city         = data[1];
    this.state        = data[2];
    this.year         = data[3];
    this.month        = data[4];
    this.day          = data[5];
    this.url          = data[6];
    this.parent       = $("#shows-area")[0];
    
    this.createElement();
  }

  createElement(){
    this.element = $("#show")[0].cloneNode(true);
    this.element.classList.remove("hide");
    this.parent.appendChild(this.element);
    $(this.element).find('.location')[0].innerHTML = this.venue + " - " + this.city + ", " + this.state;
    $(this.element).find('.date')[0].innerHTML = this.convertDate(this.year, this.month, this.day);
    var string = "Info";
    var result = string.link(this.url);
    $(this.element).find('.link')[0].innerHTML = result;
    $(this.element).find('.link')[0].color = "white";
    
  }

  convertDate(year, month, day){
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "Septemeber", "October", "November", "December"];
    return months[month - 1] + " " + day + ", " + year;
  }
}

//--------------------------------GALLERY-------------------------------------//
class Gallery {
  constructor() {
    this.parent = $("#gallery-area")[0];
    this.photos = [];
    this.grid = $('.grid');
    this.grid.masonry({
      itemSelector: '.grid-item',
      columnWidth: 8
      // columnWidth: $('#gallery-area').innerWidth
    });
  }

  addPhoto(url, ar){
    console.log("got pic");
    var photo = new Photo(url);
    this.photos.push(photo);
    $(".grid")[0].appendChild(photo.element);

    var string = "url('" + url + "')";
    photo.element.style.backgroundImage = string;

    photo.element.classList.add("grid-item");        
    if(ar > 1.3)
      photo.element.classList.add("grid-item-wide");
    if(ar > 0.7)
      photo.element.classList.add("grid-item-tall");


    $(".grid").masonry( 'appended', photo.element);
$(".grid").masonry();  
  }
}

class Photo {
  constructor(url) {
    this.element = document.createElement("a");
    this.url = url;
  }
}