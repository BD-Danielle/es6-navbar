"use strict";

/*
 * CustomNavbar 1.0
 * vertical scroll trigger horizontal swipe
 * click108
 * Copyright 2018, MIT License
 *
 */
;

(function ($, window, document, undefined) {
  'use strict';

  $.action = function (el, options) {
    var base = this; // Access to jQuery and DOM versions of element

    base.$el = $(el); // base.el = el;
    // Cached objects

    base.$win = $(window);
    base.$doc = $(document);
    base.win = window;
    base.doc = document;
    base.$body = $('html, body');
    base.updateNavbarOnScrolling = true;
    base.device = base.doc.body.className; // Initialize

    base.init = function () {
      base.options = $.extend({}, $.action.defaultOptions, options);
      base.isSwipe = base.options.horzpage.swipe;
      base.isScroll = base.options.horzbar.scroll;
      base.pageId = base.options.horzpage.pageId;
      base.className = base.options.horzbar.class;
      base.hashtag = base.options.horzbar.hashtag;
      base.ul = base.$el.find('ul');
      base.lis = base.$el.find('ul li');
      base.liLength = base.lis.length;
      base._curActIdx = 0;

      if (base.isSwipe) {
        base.importJS(base.options.dependence);
        base.swipeId = base.options.horzpage.id;
        base.initSwipeSetting();
      }

      base.importCSS(base.options.dependence);

      if (base.isScroll == true && base.device == 'MOBILE') {
        base.initBarSetting();
        base.liWidth = base.initBarSetting().li;
      }
    };

    base.overHeadHeight = function () {
      var overHeadHeight; // if (base.options.horzbar.overhead.bool == true && (typeof base.options.horzbar.overhead.id) != 'undefined') {

      if (base.options.horzbar.overhead.bool == true && typeof base.options.horzbar.overhead.id !== 'undefined') {
        overHeadHeight = base.device == 'PC' ? $('#' + base.options.horzbar.overhead.id).offset().top : $('#' + base.options.horzbar.overhead.id).offset().top;
      } else {
        switch (base.device) {
          case "MOBILE":
            overHeadHeight = 45;
            break;

          case "PC":
            overHeadHeight = 38;
            break;

          default:
        }
      }
      return overHeadHeight;
    };

    base.underHeadHeight = function () {
      var underHeadHeight;

      if (base.options.horzbar.underhead.bool == true) {
        underHeadHeight = $(base.options.horzbar.underhead.id).get(0).getBoundingClientRect().height;
      } else {
        underHeadHeight = 0;
      }

      return underHeadHeight;
    }; // Horzbar default setting


    base.initBarSetting = function () {
      var $self = base.$el;
      var columns = base.options.horzbar.columns; // let winWidth = base.$body.get(0).getBoundingClientRect().width + 4;
      var winWidth = base.$body.get(0).getBoundingClientRect().width;
      var btnsWidth = base.options.horzbar.btns.bool ? Object.values(base.options.horzbar.btns.width).reduce(function (a, b) {
        return a + b;
      }) : 0;
      var ulOuterWidth = winWidth - btnsWidth; // let ulOuterWidth = winWidth * 85 / 100;
      var liOuterWidth = ulOuterWidth / columns;
      console.log(liOuterWidth);
      var fn = function () {
        $self.find('ul').parent().css({
          'width': ulOuterWidth + 'px'
        }); // $self.find('ul').parent().css({ 'width': '85%', });

        $self.find('ul li').css({
          'width': liOuterWidth + 'px'
        });
      }();

      return {
        fn: fn,
        ul: ulOuterWidth,
        li: liOuterWidth,
      };
    };

    base.Swipe = function () {
      var swipePage = 1;
      var $swipe = base.$swipe; // initializing page1 is to have 15px deviation

      var deviation = 15;
      $swipe.css('height', $('#' + base.pageId + swipePage).get(0).getBoundingClientRect().height | 0 + deviation);
      var mySwipe = Swipe(document.getElementById(base.swipeId), {
        callback: function (index, elem) {
          var id = 'undefined';
          var $self = base.$el;
          base.isScroll ? base.triggerNavbarScrolled($self, id, index) : null; // $swipe.css('height', $('#' + base.pageId + index).get(0).getBoundingClientRect().height | 0);
          // console.log($('#' + base.pageId + index).get(0).getBoundingClientRect().height | 0);

          base.triggerClassAdded($self, id, index);
        },
        transitionEnd: function (index, elem) {
          swipePage = index + 1;
          var thisPageHeight = $('#' + base.pageId + swipePage).get(0).getBoundingClientRect().height | 0; // console.log(thisPageHeight);

          var slideTopPos = base.options.horzbar.overhead.bool ? base.overHeadHeight() : 0;
          $swipe.animate({
            'height': thisPageHeight
          }, 300);

          switch (base.device) {
            case "PC":
              base.$body.animate({
                'scrollTop': slideTopPos + 'px'
              }, 300);
              break;

            case "MOBILE":
              base.$body.animate({
                'scrollTop': slideTopPos - 45 + 'px'
              }, 300);
              break;
          }
        }
      });
      window.mySwipe = mySwipe;
      return mySwipe;
    }; // Horzpage default setting


    base.initSwipeSetting = function () {
      var initPage = 1;
      $('#' + base.swipeId).addClass('swipe');
      $("div[id^=" + base.pageId + "]").wrapAll('<div class="swipe-wrap"></div>');
      base.$swipe = $('#' + base.swipeId + '.swipe .swipe-wrap');
      base.$swipe.css('height', $('#' + base.pageId + initPage).get(0).getBoundingClientRect().height | 0); // console.log($('#' + base.pageId + initPage).get(0).getBoundingClientRect().height | 0);
    };

    base.getMultiScripts = function (jsArray, path) {
      var _jsArray = $.map(jsArray, function (js) {
        return window.$.getScript((path || "") + js);
      });

      return $.when.apply($, _jsArray);
    };

    base.importCSS = function (cssArray) {
      cssArray.map(function (css) {
        var path = css.path,
          files = css.css;
        if (typeof files === 'undefined') return;
        files.map(function (file) {
          var link = document.createElement('link');
          link.href = path + file;
          link.type = 'text/css';
          link.rel = 'stylesheet';

          if (document.getElementsByTagName('link').length == 0) {
            document.head.prepend(link);
          } else {
            var l = document.getElementsByTagName('link')[document.getElementsByTagName('link').length - 1];
            l.parentNode.insertBefore(link, l);
          }
        });
      });
    };

    base.importJS = function (jsArray) {
      jsArray.map(function (js) {
        var path = js.path,
          files = js.js;
        if (typeof files === 'undefined') return;
        files.map(function (file) {
          window.$.getScript(path + file).done(function (script, textStatus) { });
        });
      });
    };

    base.triggerScrollingTop = function (offsetTop, deviation) {
      base.updateNavbarOnScrolling = false;
      base.$body.animate({
        scrollTop: offsetTop - deviation
      }, 200, function () {
        setTimeout(function () {
          base.updateNavbarOnScrolling = true;
        }, 100);
      });
    }; // page swipe actively or passively


    base.triggerPageSwiped = function ($self, id) {
      // base.$mySwipe = base.Swipe();
      // base.$mySwipe.setup();
      if (typeof base.$mySwipe !== 'undefined') {
        switch (id) {
          case "nextBtn":
            base.$mySwipe.next();
            break;

          case "prevBtn":
            base.$mySwipe.prev();
            break;

          case base.hashtag:
            // let idx = $self.attr('href').slice(4, 5);
            var idx = $self.attr('href').match(/\d+/)[0]; // console.log(printPdfUrl);

            if (base.device == 'PC' && typeof printPdfUrl !== 'undefined') {
              var printPdfUrl_parts = printPdfUrl.split('?');
              var currentPageIndex = '0' + idx;
              var pattern = /^(.+)(\d{2})(\.php)$/;
              var currentPdfUrl = printPdfUrl_parts[0].replace(pattern, '$1' + currentPageIndex + '$3') + '?' + printPdfUrl_parts[1];
              // printPdfUrl = currentPdfUrl;
            } // console.log(idx);

            base.$mySwipe.slide(idx - 1);

            switch (base.device) {
              case "PC":
                var slideTopPos = base.options.horzbar.overhead.bool ? base.overHeadHeight() : 0; // console.log('slideTopPos: ' + slideTopPos);

                base.$body.animate({
                  'scrollTop': slideTopPos + 'px'
                }, 300);
                break;
            }

            base.$swipe.css('height', $('#' + base.pageId + idx).get(0).getBoundingClientRect().height | 0);
            break;
        }
      }
    }; // when btn was clicked


    base.triggerToSpecPos = function ($self, id, curActIdx, offsetTop) {
      // base.isSwipe and base.isScroll can't be true together
      if (base.isSwipe) {
        switch (id) {
          case "nextBtn":
            base.triggerPageSwiped($self, id);
            break;

          case "prevBtn":
            base.triggerPageSwiped($self, id);
            break;

          case base.hashtag:
            base.triggerPageSwiped($self, id);
            break;
        }

        return;
      }

      if (base.isScroll) {
        var href;
        switch (id) {
          case "nextBtn":
            /*
            base._curActIdx++;
            base._curActIdx == base.liLength - 1 ? base._curActIdx = 0 : base._curActIdx = base._curActIdx;
            href = base.lis.eq((curActIdx + 1) % base.liLength).find('a').attr('href');
            if(href.match(/^[#]/) !== null){
              console.log('if:' + href);
              base.lis.eq((curActIdx + 1) % base.liLength).find('a').click();
            }else{
              console.log('else:' + href);
              base.scrollToLeft((base._curActIdx + 1) % base.liLength, 'undefined', 100, 0);
              break;
            }
            */
            var _findNext = false;
            do {
              // base._curActIdx++;
              // base._curActIdx = (base._curActIdx == base.liLength - 1) ? 0 : base._curActIdx;
              href = base.lis.eq((curActIdx + 1) % base.liLength).find('a').attr('href');
              if (href.match(/^[#]/) !== null) {
                base.lis.eq((curActIdx + 1) % base.liLength).find('a').click();
                _findNext = true;
              } else {
                curActIdx++;
              }
            } while (_findNext === false)

            break;
          case "prevBtn":
            var _findNext = false;
            do {
              // base._curActIdx--;
              // base._curActIdx = (base._curActIdx == base.liLength - 1) ? -1 : base._curActIdx;
              href = base.lis.eq((curActIdx + base.liLength - 1) % base.liLength).find('a').attr('href');
              if (href.match(/^[#]/) !== null) {
                base.lis.eq((curActIdx + base.liLength - 1) % base.liLength).find('a').click();
                _findNext = true;
              } else {
                curActIdx--;
                // base.scrollToLeft((base._curActIdx + base.liLength - 1) % base.liLength, 'undefined', 100, 0);
              }
            } while (_findNext === false)
            break;

          case base.hashtag:
            document.body.className == 'PC' ? base.triggerScrollingTop(offsetTop, 90) : base.triggerScrollingTop(offsetTop, 89);
            break;
        }
      }
    };

    base.dynamicCurActIdx = function () {
      var $$a = base.$el.find('ul li a');
      var scrollbarLocation = base.$win.scrollTop();
      var deviation = 90;
      var idxs = [];
      $$a.each(function (i, e) {
        var target = $(this).attr('href'); //Get the target
        // if(typeof offsetTop == "undefined" && offsetTop == null) return;
        if (target.match(/^[#]/) !== null) {
          var offsetTop = $(target).offset().top;
          if (offsetTop <= scrollbarLocation + deviation) {
            idxs.push(parseInt($(this).attr('href').replace('#' + base.pageId, ''), 10));
          }
        } return;
      });
      var dynamicCurActIdx = Math.max.apply(null, idxs) - 1;

      if (dynamicCurActIdx < 1) {
        dynamicCurActIdx = 0;
      }

      return dynamicCurActIdx;
    };

    base.staticCurActIdx = function () {
      var staticCurActIdx = base.$el.find('ul li' + '.' + base.className).index();

      if (staticCurActIdx == -1) staticCurActIdx = 0;
      return staticCurActIdx;
    }; // add active class when horzbar was clicked


    base.triggerClassAdded = function ($self, id, curActIdx) {
      switch (id) {
        case "nextBtn":
          base.toggleClass(base.lis, curActIdx = (curActIdx + 1) % base.liLength);
          break;

        case "prevBtn":
          base.toggleClass(base.lis, curActIdx = (curActIdx + base.liLength - 1) % base.liLength);
          break;

        case base.hashtag:
          base.toggleClass(base.lis, curActIdx);
          break;

        case "undefined":
          base.toggleClass(base.lis, curActIdx);
          break;
      }
    };

    base.triggerNavbarFixed = function ($el, scrollbarLocation, barHeight) {
      var vltFixed = base.options.horzbar.vltFixed;
      var eTop = base.options.horzbar.overhead.bool ? base.overHeadHeight() : 0;
      eTop = base.device == 'MOBILE' ? eTop - 45 : eTop; // console.log(eTop);

      if (vltFixed == true && scrollbarLocation >= eTop) {
        $el.addClass('NFIX');
        $('.PC #' + base.options.horzbar.overhead.id).css('height', barHeight);
        //$('#plus:visible').length == 0 ? $('#minus').css('display', 'none') : null;
      } else {
        $el.removeClass('NFIX');
        $('.PC #' + base.options.horzbar.overhead.id).css('height', '0');
        //$('#minus:visible').length == 0 ? $('#plus').css('display', 'block') : null;
      }
    };

    base.scrollToLeft = function (curActIdx, leftPos, sec1, sec2) {
      if (leftPos == 'undefined') {
        // leftPos = (curActIdx) * base.liWidth - (base.liWidth / 2);
        leftPos = (curActIdx - 1) * base.liWidth;
      } // console.log('leftPos: ' + leftPos, 'curActIdx: ' + curActIdx);

      setTimeout(function () {
        base.ul.animate({
          scrollLeft: leftPos
        }, sec1);
      }, sec2);
    }; // proactively page scrolling


    base.triggerNavbarScrolling = function (curActIdx) {
      var $$li = base.lis;
      var leftPos = 'undefined';
      var oldActIdx = base.staticCurActIdx();
      if (curActIdx !== oldActIdx) {
        if (curActIdx == 0) {
          base.toggleClass($$li, curActIdx);
          base.scrollToLeft(curActIdx, leftPos, 100, 0);
        } else {
          base.toggleClass($$li, curActIdx);
          base.scrollToLeft(curActIdx, leftPos, 100, 0);
        }
      }
    };

    base.toggleClass = function ($self, curActIdx) {
      $self.removeClass(base.className);
      $self.find('[href=' + base.hashtag + (curActIdx + 1) + ']').parent().addClass(base.className);
    };

    base.triggerNavbarScrolled = function ($self, id, curActIdx) {
      switch (id) {
        case "nextBtn":
          base.leftPos = (curActIdx + 1) % base.liLength * base.liWidth - base.liWidth / 2;
          break;

        case "prevBtn":
          base.leftPos = (curActIdx + base.liLength - 1) % base.liLength * base.liWidth - base.liWidth / 2;
          break;

        case base.hashtag:
          base.curActIdx = $self.attr('href').match(/\d+/)[0] - 1; // base.leftPos = base.curActIdx * base.liWidth - (base.liWidth / 2);
          base.leftPos = (base.curActIdx - 1) * base.liWidth; // base.leftPos = base.options.horzbar.btns.bool ? (base.leftPos - Object.values(base.options.horzbar.btns.width).reduce((a, b) => a + b)) : base.leftPos;

          break;
        // case "undefined":

        default:
          // base.leftPos = curActIdx * base.liWidth - (base.liWidth / 2);
          base.leftPos = (curActIdx - 1) * base.liWidth; // base.leftPos = base.options.horzbar.btns.bool ? (base.leftPos - Object.values(base.options.horzbar.btns.width).reduce((a, b) => a + b)) : base.leftPos;

          break;
      } // console.log(base.leftPos);


      base.scrollToLeft(curActIdx, base.leftPos, 100, 0);
    }; // Run initializer


    base.init();
    base.$win.on('load', function () {
      if (base.isSwipe) {
        base.$mySwipe = base.Swipe();
        base.$mySwipe.setup();
        $('.swipe-wrap').get(0).scrollTop = 0;
      };
    });
    base.$win.on('resize orientationchange', function () {
      if (base.isSwipe == true && base.isScroll == true && base.device == 'MOBILE') {
        base.initBarSetting();
        base.liWidth = base.initBarSetting().li;
        var $swipe = base.$swipe;
        var swipePage = base.$mySwipe.getPos() + 1; // let slideTopPos = 0;
        var thisPageHeight = $('#' + base.pageId + swipePage).get(0).getBoundingClientRect().height | 0;
        base.win.setTimeout(function () {
          $swipe.animate({
            'height': thisPageHeight
          }, 300); // base.$body.animate({ 'scrollTop': (slideTopPos) + 'px' }, 300);
        }, 200);
      }

      if (base.isSwipe == false && base.isScroll == true && base.device == 'MOBILE') {
        base.initBarSetting();
        base.liWidth = base.initBarSetting().li;
      }

      base.scrollToLeft(base.staticCurActIdx(), 'undefined', 100, 0);
    });
    base.$el.on('click', function (e) {
      var target = e.target;
      var $self = $(target);
      var _target = $self.attr('href');
      // console.log(target); //<a href="index02.php">流年點燈</a>
      if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector;
      }

      if (target.matches('#nextBtn') || target.matches('#prevBtn')) {
        var offsetTop = 'undefined';
        var curActIdx = base.staticCurActIdx();
        base.triggerToSpecPos($self, target.id, curActIdx, offsetTop);
      }

      if (target.matches('a')) {
        e.preventDefault();
        if (_target.match(/^[#]/) !== null) {
          var _offsetTop = $(target.hash).offset().top;
          var _curActIdx = parseInt($self.attr('href').match(/\d+/)[0], 10) - 1;

          if (base.isScroll == true && base.device == 'MOBILE') {
            base.triggerNavbarScrolled($self, target.hash.match(/\#\w[^0-9]+/)[0], _curActIdx);
          }

          base.triggerClassAdded($self, target.hash.match(/\#\w[^0-9]+/)[0], _curActIdx);
          base.triggerToSpecPos($self, target.hash.match(/\#\w[^0-9]+/)[0], _curActIdx, _offsetTop);
        } else {
          window.open(_target, "_self")
        };
      }
    }); // On scroll and load listener

    base.$win.on('scroll', function () {
      // when window is scrolling
      var $self = $(this);
      var scrollbarLocation = $self.scrollTop(); // base.isScroll ? base.triggerNavbarFixed(base.$el, scrollbarLocation, barHeight) : null;
      // console.log(scrollbarLocation);
      var barHeight = base.$el.get(0).getBoundingClientRect().height;
      base.triggerNavbarFixed(base.$el, scrollbarLocation, barHeight);
      var curActIdx = base.dynamicCurActIdx();

      if (!base.isSwipe && base.updateNavbarOnScrolling) {
        base.triggerNavbarScrolling(curActIdx);
        return;
      }
    });
  };

  $.action.defaultOptions = {
  };

  $.fn.action = function (options) {
    return this.each(function () {
      new $.action(this, options);
    });
  };
})(jQuery, window, document);

$(document).on('click', '#navbar a', function (e) {
  e.preventDefault();
});