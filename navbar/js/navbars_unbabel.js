/*
 * CustomNavbar 1.0
 * vertical scroll trigger horizontal swipe
 * click108
 * Copyright 2018, MIT License
 *
*/
; (function ($, window, document, undefined) {
  'use strict';
  $.action = function (el, options) {
    let base = this;

    // Access to jQuery and DOM versions of element
    base.$el = $(el);
    // base.el = el;

    // Cached objects
    base.$win = $(window);
    base.$doc = $(document);
    base.win = window;
    base.doc = document;
    base.$body = $('html, body');
    base.updateNavbarOnScrolling = true;
    base.device = base.doc.body.className;

    // Initialize
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
      let overHeadHeight;
      // if (base.options.horzbar.overhead.bool == true && (typeof base.options.horzbar.overhead.id) != 'undefined') {
      if (base.options.horzbar.overhead.bool == true && (typeof base.options.horzbar.overhead.id) !== 'undefined') {
        // overHeadHeight = $('#' + base.options.horzbar.id).offset().top;
        // when window on scrolling, navbarfixed get Confused, so don't use navbar as target, use its next silbing
        // overHeadHeight = (base.device == 'PC') ? $('#' + base.options.horzbar.overhead.id).offset().top  - $('#' + base.options.horzbar.id).get(0).getBoundingClientRect().height | 0 : $('#' + base.options.horzbar.overhead.id).offset().top;
        overHeadHeight = (base.device == 'PC') ? $('#' + base.options.horzbar.overhead.id).offset().top : $('#' + base.options.horzbar.overhead.id).offset().top;
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
    }
    base.underHeadHeight = function () {
      let underHeadHeight;
      if (base.options.horzbar.underhead.bool == true) {
        underHeadHeight = $(base.options.horzbar.underhead.id).get(0).getBoundingClientRect().height;
      } else {
        underHeadHeight = 0;
      }
      return underHeadHeight;
    }

    // Horzbar default setting
    base.initBarSetting = function () {
      let $self = base.$el;
      let columns = base.options.horzbar.columns;
      // let winWidth = base.$body.get(0).getBoundingClientRect().width + 4;
      let winWidth = base.$body.get(0).getBoundingClientRect().width;
      let btnsWidth = base.options.horzbar.btns.bool ? Object.values(base.options.horzbar.btns.width).reduce((a, b) => a + b) : 0;
      let ulOuterWidth = winWidth - btnsWidth;
      // let ulOuterWidth = winWidth * 85 / 100;
      let liOuterWidth = ulOuterWidth / columns;
      let fn = (function () {
        $self.find('ul').parent().css({ 'width': ulOuterWidth + 'px' });
        // $self.find('ul').parent().css({ 'width': '85%', });
        $self.find('ul li').css({ 'width': liOuterWidth + 'px' });
      })();
      return {
        fn: fn,
        ul: ulOuterWidth,
        li: liOuterWidth,
      };
    }
    base.Swipe = function () {
      let swipePage = 1;
      let $swipe = base.$swipe;
      // initializing page1 is to have 15px deviation
      let deviation = 15;
      $swipe.css('height', $('#' + base.pageId + swipePage).get(0).getBoundingClientRect().height | 0 + deviation);

      let mySwipe = Swipe(document.getElementById(base.swipeId), {
        callback: function (index, elem) {
          let id = 'undefined';
          let $self = base.$el;
          base.isScroll ? base.triggerNavbarScrolled($self, id, index) : null;
          // $swipe.css('height', $('#' + base.pageId + index).get(0).getBoundingClientRect().height | 0);
          // console.log($('#' + base.pageId + index).get(0).getBoundingClientRect().height | 0);
          base.triggerClassAdded($self, id, index);
        },
        transitionEnd: function (index, elem) {
          swipePage = index + 1;
          let thisPageHeight = $('#' + base.pageId + swipePage).get(0).getBoundingClientRect().height | 0;
          // console.log(thisPageHeight);
          let slideTopPos = base.options.horzbar.overhead.bool ? base.overHeadHeight() : 0;
          $swipe.animate({ 'height': thisPageHeight }, 300);
          switch (base.device) {
            case "PC":
              base.$body.animate({ 'scrollTop': (slideTopPos) + 'px' }, 300);
              break;
            case "MOBILE":
              base.$body.animate({ 'scrollTop': (slideTopPos - 45) + 'px' }, 300);
              break;

          }
        }
      });
      window.mySwipe = mySwipe;
      return mySwipe;
    }
    // Horzpage default setting
    base.initSwipeSetting = function () {
      let initPage = 1;
      $('#' + base.swipeId).addClass('swipe');
      $("div[id^=" + base.pageId + "]").wrapAll('<div class="swipe-wrap"></div>');
      base.$swipe = $('#' + base.swipeId + '.swipe .swipe-wrap');
      base.$swipe.css('height', $('#' + base.pageId + initPage).get(0).getBoundingClientRect().height | 0);
      // console.log($('#' + base.pageId + initPage).get(0).getBoundingClientRect().height | 0);
    }
    base.getMultiScripts = function (jsArray, path) {
      var _jsArray = $.map(jsArray, function (js) {
        return window.$.getScript((path || "") + js);
      });
      return $.when.apply($, _jsArray);
    };
    base.importCSS = function (cssArray) {
      cssArray.map(function (css) {
        var path = css.path, files = css.css;
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
        })
      })
    };
    base.importJS = function (jsArray) {
      jsArray.map(function (js) {
        var path = js.path, files = js.js;
        if (typeof files === 'undefined') return;
        files.map(function (file) {
          window.$.getScript(path + file).done(function (script, textStatus) {
          });
        });
      })
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
    }
    // page swipe actively or passively
    base.triggerPageSwiped = function ($self, id) {
      // base.$mySwipe = base.Swipe();
      // base.$mySwipe.setup();
      switch (id) {
        case "nextBtn":
          base.$mySwipe.next();
          break;
        case "prevBtn":
          base.$mySwipe.prev();
          break;
        case base.hashtag:
          // let idx = $self.attr('href').slice(4, 5);
          let idx = ($self.attr('href').match(/\d+/))[0];
          // console.log(printPdfUrl);
          if (base.device == 'PC' && typeof printPdfUrl !== 'undefined') {
            let printPdfUrl_parts = printPdfUrl.split('?');
            let currentPageIndex = '0' + idx;
            let pattern = /^(.+)(\d{2})(\.php)$/;
            let currentPdfUrl = printPdfUrl_parts[0].replace(pattern, '$1' + currentPageIndex + '$3') + '?' + printPdfUrl_parts[1];
            printPdfUrl = currentPdfUrl;
          }

          // console.log(idx);
          // slide(idx - 1), why should minus 1, still don't get it ??
          base.$mySwipe.slide(idx - 1);
          switch (base.device) {
            case "PC":
              $('#minus .T_INFOAREA a').attr({
                href: 'print0' + idx + '.php',
                target: '_blank'
              });
              let slideTopPos = base.options.horzbar.overhead.bool ? base.overHeadHeight() : 0;
              // console.log('slideTopPos: ' + slideTopPos);
              base.$body.animate({ 'scrollTop': (slideTopPos) + 'px' }, 300);
              break;
          }
          base.$swipe.css('height', $('#' + base.pageId + idx).get(0).getBoundingClientRect().height | 0);
          break;
      }
    }
    // when btn was clicked
    base.triggerToSpeciPos = function ($self, id, curActIdx, offsetTop) {
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
        switch (id) {
          case "nextBtn":
            base.lis.eq((curActIdx + 1) % base.liLength).find('a').click();
            break;
          case "prevBtn":
            // console.log((curActIdx + base.liLength - 1) % base.liLength);
            base.lis.eq((curActIdx + base.liLength - 1) % base.liLength).find('a').click();
            break;
          case base.hashtag:
            document.body.className == 'PC' ? base.triggerScrollingTop(offsetTop, 50) : base.triggerScrollingTop(offsetTop, 90);
            break;
        }
      }
    }
    base.dynamicCurActIdx = function () {
      let $$a = base.$el.find('ul li a');
      let scrollbarLocation = base.$win.scrollTop();
      let deviation = 90;
      let idxs = [];
      $$a.each(function (i, e) {
        let target = $(this).attr('href'); //Get the target
        let offsetTop = $(target).offset().top;
        if (offsetTop <= scrollbarLocation + deviation) {
          idxs.push(parseInt($(this).attr('href').replace('#' + base.pageId, ''), 10));
        }
      });
      let dynamicCurActIdx = Math.max.apply(null, idxs) - 1;
      if (dynamicCurActIdx < 1) {
        dynamicCurActIdx = 0;
      }
      return dynamicCurActIdx;
    }
    base.staticCurActIdx = function () {
      let staticCurActIdx = base.$el.find('ul li' + '.' + base.className).index();
      // console.log('staticCurActIdx: ' + staticCurActIdx);
      if (staticCurActIdx == -1) {
        staticCurActIdx = 0;
      };
      return staticCurActIdx;
    }
    // add active class when horzbar was clicked
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
    }
    base.triggerNavbarFixed = function ($el, scrollbarLocation) {
      let vltFixed = base.options.horzbar.vltFixed;
      let eTop = base.options.horzbar.overhead.bool ? base.overHeadHeight() : 0;
      eTop = base.device == 'MOBILE' ? eTop - 45 : eTop;
      // console.log(eTop);
      if (vltFixed == true && scrollbarLocation >= eTop) {
        $el.addClass('NFIX');
        $('.PC #' + base.options.horzbar.overhead.id).css('height', '50px');
        $('#plus:visible').length == 0 ? $('#minus').css('display', 'none') : null;
      } else {
        $el.removeClass('NFIX');
        $('.PC #' + base.options.horzbar.overhead.id).css('height', '0');
        $('#minus:visible').length == 0 ? $('#plus').css('display', 'block') : null;
      }
    }
    base.scrollToLeft = function (curActIdx, leftPos, sec1, sec2) {
      if (leftPos == 'undefined') {
        // leftPos = (curActIdx) * base.liWidth - (base.liWidth / 2);
        leftPos = (curActIdx - 1) * base.liWidth;
      };
      // console.log('leftPos: ' + leftPos, 'curActIdx: ' + curActIdx);
      setTimeout(function () {
        base.ul.animate({ scrollLeft: leftPos }, sec1);
      }, sec2);
    }
    // proactively page scrolling
    base.triggerNavbarScrolling = function (curActIdx) {
      let $$li = base.lis;
      let leftPos = 'undefined';
      let oldActIdx = base.staticCurActIdx();
      if (curActIdx !== oldActIdx) {
        if (curActIdx == 0) {
          base.toggleClass($$li, curActIdx);
          base.scrollToLeft(curActIdx, leftPos, 100, 0)
        } else {
          // idxActive = curActIdx;
          // console.log(curActIdx);
          base.toggleClass($$li, curActIdx);
          base.scrollToLeft(curActIdx, leftPos, 100, 0)
        }
      }
    }
    base.toggleClass = function ($self, curActIdx) {
      $self.removeClass(base.className);
      $self.find('[href=' + base.hashtag + (curActIdx + 1) + ']').parent().addClass(base.className);
    }
    base.triggerNavbarScrolled = function ($self, id, curActIdx) {
      switch (id) {
        case "nextBtn":
          base.leftPos = ((curActIdx + 1) % base.liLength) * base.liWidth - (base.liWidth / 2);
          break;
        case "prevBtn":
          base.leftPos = ((curActIdx + base.liLength - 1) % base.liLength) * base.liWidth - (base.liWidth / 2);
          break;
        case base.hashtag:
          base.curActIdx = ($self.attr('href').match(/\d+/))[0] - 1;
          // base.leftPos = base.curActIdx * base.liWidth - (base.liWidth / 2);
          base.leftPos = (base.curActIdx - 1) * base.liWidth;
          // base.leftPos = base.options.horzbar.btns.bool ? (base.leftPos - Object.values(base.options.horzbar.btns.width).reduce((a, b) => a + b)) : base.leftPos;
          break;
        // case "undefined":
        default:
          // base.leftPos = curActIdx * base.liWidth - (base.liWidth / 2);
          base.leftPos = (curActIdx - 1) * base.liWidth;
          // base.leftPos = base.options.horzbar.btns.bool ? (base.leftPos - Object.values(base.options.horzbar.btns.width).reduce((a, b) => a + b)) : base.leftPos;
          break;
      }
      // console.log(base.leftPos);
      base.scrollToLeft(curActIdx, base.leftPos, 100, 0);
    }
    // Run initializer
    base.init();

    base.$win.on('load', function () {
      console.log('window onLoad');
      if (base.isSwipe) {
        base.$mySwipe = base.Swipe();
        base.$mySwipe.setup();
      };
    });
    base.$win.on('resize orientationchange', function () {
      if (base.isSwipe == true && base.isScroll == true && base.device == 'MOBILE') {
        base.initBarSetting();
        base.liWidth = base.initBarSetting().li;
        let $swipe = base.$swipe;
        let swipePage = base.$mySwipe.getPos() + 1;
        // let slideTopPos = 0;
        let thisPageHeight = $('#' + base.pageId + swipePage).get(0).getBoundingClientRect().height | 0;

        base.win.setTimeout(function () {
          $swipe.animate({ 'height': thisPageHeight }, 300);
          // base.$body.animate({ 'scrollTop': (slideTopPos) + 'px' }, 300);
        }, 200);
      };
      if (base.isSwipe == false && base.isScroll == true && base.device == 'MOBILE') {
        base.initBarSetting();
        base.liWidth = base.initBarSetting().li;
      }
      base.scrollToLeft(base.staticCurActIdx(), 'undefined', 100, 0);
    });

    base.$el.on('click', function (e) {
      let target = e.target;
      let $self = $(target);
      if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector;
      }
      if (target.matches('#nextBtn') || target.matches('#prevBtn')) {
        let offsetTop = 'undefined';
        let curActIdx = base.staticCurActIdx();
        base.triggerToSpeciPos($self, target.id, curActIdx, offsetTop);
        return;
      }
      if (target.matches('a')) {
        e.preventDefault();
        let offsetTop = $(target.hash).offset().top;
        let curActIdx = parseInt(($self.attr('href').match(/\d+/))[0], 10) - 1;
        if (base.isScroll == true && base.device == 'MOBILE') {
          base.triggerNavbarScrolled($self, (target.hash.match(/\#\w[^0-9]+/))[0], curActIdx)
        }
        base.triggerClassAdded($self, (target.hash.match(/\#\w[^0-9]+/))[0], curActIdx);
        base.triggerToSpeciPos($self, (target.hash.match(/\#\w[^0-9]+/))[0], curActIdx, offsetTop);
        return;
      }
    })
    // On scroll and load listener
    base.$win.on('scroll', function () {
      // when window is scrolling
      let $self = $(this);
      let scrollbarLocation = $self.scrollTop();
      // base.isScroll ? base.triggerNavbarFixed(base.$el, scrollbarLocation) : null;
      base.triggerNavbarFixed(base.$el, scrollbarLocation);
      let curActIdx = base.dynamicCurActIdx();
      if (!base.isSwipe && base.updateNavbarOnScrolling) {
        base.triggerNavbarScrolling(curActIdx);
        return;
      }
    });

  }
  $.action.defaultOptions = {
    dependence: [{ path: 'navbar/', js: ['js/swipe.js'], css: ['css/navbar.css'] }],
    horzbar: {
      scroll: false, //boolean
      columns: 3, //default column number
      id: 'navbar',
      hashtag: '#div',
      btnsWidth: { '#nextBtn': 27, '#prevBtn': 27 },
      overhead: { bool: true, id: '#overhead' }, //sth is on navbar's head
      underhead: { bool: true, id: '#underhead' }, //sth is under navbar's head
      vltFixed: true, //navbar is not moving when window is scrolling
      class: 'active'
    },
    horzpage: {
      swipe: false, //boolean
      id: 'slider', //optional
      pageId: 'div'
    }
  };

  $.fn.action = function (options) {
    return this.each(function () {
      (new $.action(this, options));
    });
  };
})(jQuery, window, document);
