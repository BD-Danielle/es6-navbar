/*========================================================================
 * CustomNavbar 2.0
 * vertical scroll trigger horizontal swipe
 * Yiling Chen
 * Copyright 2018, MIT License
 * (git@github.com:shutuzi88/Navbar.git)
========================================================================*/
// if the module has no dependencies, the above pattern can be simplified to
// eslint-disable-next-line no-extra-semi
;(function (root, factory) {
  root = root || {};
  // eslint-disable-next-line no-undef
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    // eslint-disable-next-line no-undef
    define([], function(){
      root.Navbar = factory();
      return root.Navbar;
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals
    root.Navbar = factory();
  }
}(this, function () {
  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
             typeof global == 'object' && global.global === global && global ||
             this;

  var _document = root.document;

  function Navbar(bar, options){
    'use strict';
    options = options || {};

    // setup initial vars

    var isScrolling;
    var disabled = false;

    // quit if no root element
    if (!bar) return;
    var element = bar.get(0).children;
    var slides, slidePos, width, length;
    var index = parseInt(options.startSlide, 10) || 0;
    var speed = options.speed || 300;
    // trigger setup
    setup();

    // start auto slideshow if applicable
    begin();

    // Expose the Swipe API
    return {
      // initialize
      setup: setup,

      // go to slide
      slide: function(to, speed) {
        stop();
        slide(to, speed);
      },

      // move to previous
      prev: function() {
        stop();
        prev();
      },

      // move to next
      next: function() {
        stop();
        next();
      },

      // Restart slideshow
      restart: restart,

      // cancel slideshow
      stop: stop,

      // return current index position
      getPos: getPos,

      // disable slideshow
      disable: disable,

      // enable slideshow
      enable: enable,

      // return total number of slides
      getNumSlides: function() { return length; },

      // completely remove swipe
      kill: kill
    };

    function setup(){
      // Overwrite options if necessary
      if (opts != null) {
        for (var prop in opts) {
          options[prop] = opts[prop];
        }
      }

      // cache sliders
      slides = element.get(0).children;
      // ul[2].children[0].children.length;
      length = (function(){
        if(!slides.length){
          return 0;
        }else{
          for(var i=0; i<slides.length; i++){
            if(slides[i].children.length){
              for(var child of slides[i].children){
                return child.children.length;
              }
            }
          }
        }
      })()

    }
    // window.myNavbar = new Navbar(element, {
    //   startSlide: 0,
    //   buttons: true, // if true needs default customization {'next': '#nextBtn', 'prev': '#prevBtn', 'drop': '#dropBtn'}
    //   slidesToShow: 3,
    //   slidesToScroll: 3
    //   affix: false, // if true needs default customization {'overTheBar': '#over-the-bar'}
    //   callback: function(index, element) {}, // if 
    //   transitionEnd: function(index, element) {}
    // });
    // <div id="over-the-navbar"></div>
    // <div id="navbar" class="LM_MENU">
    //   <div id="nextBtn"></div>
    //   <div id="prevBtn"></div>
    //   <div class="MENU">
    //     <ul>
    //       <li class="active"><a href="#div1">服務內容</a></li>
    //       <li><a href="#div2">白金特色</a></li>
    //       <li><a href="#div3">好評推薦</a></li>
    //       <li><a href="#div4">付費方案</a></li>
    //       <li><a href="#div5">客服諮詢</a></li>
    //     </ul>
    //   </div>
    // </div>
    // <div id="slider" class="swipe">
    //   <div class="swipe-wrap">
    //     <div></div>
    //     <div></div>
    //     <div></div>
    //   </div>
    // </div>
    // horzbar: {
    //   scroll: true, //boolean
    //   id: 'navbar',
    //   columns: 3, //default column number
    //   button: {bool: true, width: {'#nextBtn': 27, '#prevBtn': 27}},
    //   overthehead: { bool: true, id: 'navbarTop'}, //sth is on navbar's head
    //   underthehead: {bool: false}, //sth is under navbar's head
    //   vltFixed: true, //navbar is not moving when window is scrolling
    //   class: 'active'
    // },
    // disable: ƒ disable()
    // enable: ƒ enable()
    // getNumSlides: ƒ ()
    // getPos: ƒ getPos()
    // kill: ƒ kill()
    // next: ƒ ()
    // prev: ƒ ()
    // restart: ƒ restart()
    // setup: ƒ setup(opts)
    // slide: ƒ (to, speed)
    // stop: ƒ stop()
    // var element = document.getElementById('mySwipe');
    
  if ( root.jQuery || root.Zepto ) {
    (function($) {
      $.fn.Navbar = function(params) {
        return this.each(function() {
          $(this).data('Navbar', new Navbar($(this)[0], params));
        });
      };
    })( root.jQuery || root.Zepto );
  }

  return Navbar;
}));