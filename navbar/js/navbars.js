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

    base.updateNavbarOnScrolling = true;

    // Initialize
    base.init = function () {
      base.options = $.extend({}, $.action.defaultOptions, options);
      base.isSwipe = base.options.horzpage.swipe;
      base.pageId = base.options.horzpage.pageId;
      base.className = base.options.horzbar.class;
      base.ul = base.$el.find('ul');
      base.lis = base.$el.find('ul li');
      // base.liAct = base.$el.find('ul li' + base.className);
      base.liLength = base.lis.length;
      if (base.isSwipe) {
        base.swipeId = base.options.horzpage.id;
        base.importJS('swipe');
        base.initSwipeSetting();
      }
      base.importCSS('navbar');
      base.initBarSetting();
      base.liWidth = base.initBarSetting().li;
      // base.idxActive = 0;
      // base.leftPos = 0;
      // base.curActIdx = 0;
      // base.maxbase.PageID;
    };
    base.overHeadHeight = function () {
      let overHeadHeight = $('.TOP h1').get(0).getBoundingClientRect().height;
      return overHeadHeight;
    }
    // Horzbar default setting
    base.initBarSetting = function () {
      let $self = base.$el;
      let columns = base.options.horzbar.columns;
      let winWidth = $('html, body').get(0).getBoundingClientRect().width + 4;
      let ulOuterWidth = winWidth * 85 / 100;
      let liOuterWidth = ulOuterWidth / columns;
      let fn = (function () {
        $self.find('ul').parent().css({ 'width': '85%', });
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
      let $swipe = $('.MOBILE ' + base.swipeId + '.swipe .swipe-wrap');
      // $swipe.css('height', parseInt($(base.pageId + swipePage).css('height'), 10));
      let mySwipe = Swipe(document.getElementById(base.swipeId.replace('#', '')), {
        callback: function (index, elem) {
          // console.log('index: ' + index, 'elem: ' + elem);
          let id = 'undefined';
          let $self = base.$el;
          base.triggerNavbarScrolled($self, id, index);
          base.triggerClassAdded($self, id, index);
        },
        transitionEnd: function (index, elem) {
          // console.log('index: ' + index, 'elem: ' + elem);
          swipePage = index + 1;
          console.log(swipePage);
          let thisPageHeight = parseInt($(base.pageId + swipePage).css('height'), 10);
          let slideTopPos = 0;
          $swipe.animate({ 'height': thisPageHeight }, 300);
          $('html, body').animate({ 'scrollTop': (slideTopPos) + 'px' }, 300);
        }
      });
      return mySwipe;
    }
    // Horzpage default setting
    base.initSwipeSetting = function () {
      $(base.swipeId).addClass('swipe');
      $("div[id^=" + base.pageId.replace('#', '') + "]").wrapAll('<div class="swipe-wrap"></div>');
      $(base.swipeId + '.swipe .swipe-wrap').css('height', parseInt($(base.pageId + "1").css('height'), 10));
    }
    // Third party css import
    base.importCSS = function (name) {
      let link = document.createElement('link');
      link.type = 'text/css';
      link.href = 'navbar/css/' + name + '.css';
      link.rel = 'stylesheet';
      let l = document.getElementsByTagName('link')[1];
      // Fire the loading
      l.parentNode.insertBefore(link, l);
    }
    // Third party module import
    base.importJS = function (name) {
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'navbar/js/' + name + '.js';
      let s = document.getElementsByTagName('script')[1];
      // Fire the loading
      s.parentNode.insertBefore(script, s);
    }
    base.triggerScrollingTop = function (offsetTop, deviation) {
      base.updateNavbarOnScrolling = false;
      $('body, html').animate({
        scrollTop: offsetTop - deviation
      }, 200, function () {
        setTimeout(function () {
          base.updateNavbarOnScrolling = true;
        }, 100);
      });
    }
    // page swipe actively or passively
    base.triggerPageSwiped = function ($self, id) {
      switch (id) {
        case "nextBtn":
          base.$mySwipe.next();
          break;
        case "prevBtn":
          base.$mySwipe.prev();
          break;
        case "#div":
          let idx = $self.attr('href').slice(4, 5);
          console.log(idx);
          base.$mySwipe.slide(idx - 1);
          break;
      }
    }
    // when btn was clicked
    base.triggerToSpeciPos = function ($self, id, curActIdx, offsetTop) {
      if (base.isSwipe) {
        switch (id) {
          case "nextBtn":
            base.triggerPageSwiped($self, id);
            // mySwipe.next();
            break;
          case "prevBtn":
            base.triggerPageSwiped($self, id);
            // mySwipe.prev();
            break;
          case "#div":
            base.triggerPageSwiped($self, id);
            break;
        }
        return;
      }
      switch (id) {
        case "nextBtn":
          base.lis.eq((curActIdx + 1) % base.liLength).find('a').click();
          break;
        case "prevBtn":
          console.log((curActIdx + base.liLength - 1) % base.liLength);
          base.lis.eq((curActIdx + base.liLength - 1) % base.liLength).find('a').click();
          break;
        case "#div":
          base.triggerScrollingTop(offsetTop, 90);
          break;
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
          idxs.push(parseInt($(this).attr('href').replace(base.pageId, ''), 10));
        }
      });
      let dynamicCurActIdx = Math.max.apply(null, idxs) - 1;
      if (dynamicCurActIdx < 1) {
        dynamicCurActIdx = 0;
      }
      return dynamicCurActIdx;
    }
    base.staticCurActIdx = function () {
      let staticCurActIdx = base.$el.find('ul li' + base.className).index();
      console.log('staticCurActIdx: ' + staticCurActIdx);
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
          // base.lis.eq((curActIdx + 1) % base.liLength).siblings().removeClass(base.className.replace('.', ''));
          // base.lis.eq((curActIdx + 1) % base.liLength).addClass(base.className.replace('.', ''));
          break;
        case "prevBtn":
          base.toggleClass(base.lis, curActIdx = (curActIdx + base.liLength - 1) % base.liLength);
          // base.lis.eq((curActIdx + base.liLength - 1) % base.liLength).siblings().removeClass(base.className.replace('.', ''));
          // base.lis.eq((curActIdx + base.liLength - 1) % base.liLength).addClass(base.className.replace('.', ''));
          break;
        case "#div":
          // siblings() not include itself
          // let $$a = $self.parent().siblings();
          // let idx = $self.attr('href').slice(4, 5);
          $self.parent().siblings().removeClass(base.className.replace('.', ''));
          $self.parent().addClass(base.className.replace('.', ''));
          break;
        case "undefined":
          base.toggleClass(base.lis, curActIdx);
          // base.lis.eq(curActIdx).siblings().removeClass(base.className.replace('.', ''));
          // base.lis.eq(curActIdx).addClass(base.className.replace('.', ''));
          break;
      }
    }
    base.triggerNavbarFixed = function ($el, scrollbarLocation) {
      let vltFixed = base.options.horzbar.vltFixed;
      let overhead = base.options.horzbar.overhead;
      const eTop1 = base.overHeadHeight();
      let eTop = overhead ? eTop1 : 45;
      if (vltFixed == true && scrollbarLocation >= eTop) {
        $el.addClass('NFIX');
      } else {
        $el.removeClass('NFIX');
      }
    }
    base.scrollToLeft = function (curActIdx, leftPos, sec1, sec2) {
      // base.idxActive = curActIdx;
      if (leftPos == 'undefined') {
        leftPos = (curActIdx) * base.liWidth - (base.liWidth / 2);
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
          console.log(curActIdx);
          base.toggleClass($$li, curActIdx);
          base.scrollToLeft(curActIdx, leftPos, 100, 0)
        }
      }
    }
    base.toggleClass = function ($self, curActIdx) {
      $self.eq(curActIdx).siblings().removeClass(base.className.replace('.', ''));
      $self.eq(curActIdx).addClass(base.className.replace('.', ''));
    }
    base.triggerNavbarScrolled = function ($self, id, curActIdx) {
      switch (id) {
        case "nextBtn":
          // console.log(curActIdx);
          base.leftPos = ((curActIdx + 1) % base.liLength) * base.liWidth - (base.liWidth / 2);
          break;
        case "prevBtn":
          base.leftPos = ((curActIdx + base.liLength - 1) % base.liLength) * base.liWidth - (base.liWidth / 2);
          break;
        case "#div":
          base.curActIdx = $self.attr('href').slice(4, 5) - 1;
          // console.log(base.curActIdx);
          base.leftPos = base.curActIdx * base.liWidth - (base.liWidth / 2);
          break;
        case "undefined":
          base.leftPos = (curActIdx) * base.liWidth - (base.liWidth / 2);
          console.log(base.leftPos);
          break;
      }
      base.scrollToLeft(curActIdx, base.leftPos, 100, 0);
    }
    // Run initializer
    base.init();

    base.$win.on('load', function () {
      if (base.isSwipe) {
        base.$mySwipe = base.Swipe();
        base.$mySwipe.setup();
        return;
      };
    });
    base.$win.on('orientationchange', function () {
      if (base.isSwipe) {
        let $swipe = $('.MOBILE ' + base.swipeId + '.swipe .swipe-wrap');
        let swipePage = base.$mySwipe.getPos() + 1;
        let slideTopPos = 0;
        let thisPageHeight = parseInt($(base.pageId + swipePage).css('height'), 10);
        window.setTimeout(function () {
          $swipe.animate({ 'height': thisPageHeight }, 300);
          $('html, body').animate({ 'scrollTop': (slideTopPos) + 'px' }, 300);
        }, 200);
      };
    });
    base.$el.on('click', function (e) {
      let target = e.target;
      let $self = $(target);
      if (target.matches('#nextBtn') || target.matches('#prevBtn')) {
        let offsetTop = 'undefined';
        let curActIdx = base.staticCurActIdx();
        // base.triggerNavbarScrolled($self, target.id, curActIdx);
        // base.triggerClassAdded($self, target.id, curActIdx);
        base.triggerToSpeciPos($self, target.id, curActIdx, offsetTop);
        return;
      }
      if (target.matches('a')) {
        e.preventDefault();
        let offsetTop = $(target.hash).offset().top;
        let curActIdx = 'undefined';
        base.triggerNavbarScrolled($self, target.hash.slice(0, 4), curActIdx);
        base.triggerClassAdded($self, target.hash.slice(0, 4), curActIdx);
        base.triggerToSpeciPos($self, target.hash.slice(0, 4), curActIdx, offsetTop);
        return;
      }
    })
    base.$win.on('resize', function () {
      base.initBarSetting().fn;
    });
    // On scroll and load listener
    base.$win.on('scroll', function () {
      // when window is scrolling
      let $self = $(this);
      let scrollbarLocation = $self.scrollTop();
      base.triggerNavbarFixed(base.$el, scrollbarLocation);
      let curActIdx = base.dynamicCurActIdx();
      // console.log(base.curActIdx);
      if (!base.isSwipe && base.updateNavbarOnScrolling) {
        base.triggerNavbarScrolling(curActIdx);
        return;
      }
    });

  }
  $.action.defaultOptions = {
    horzbar: {
      scroll: true, //boolean
      columns: 3, //default column number
      nextBtn: '#nextBtn',
      prevBtn: '#prevBtn',
      overhead: true, //sth is on navbar's head
      vltFixed: true, //navbar is not moving when window is scrolling
      class: '.active'
    },
    horzpage: {
      swipe: true, //boolean
      id: '#slider', //optional
      pageId: '#div'
    }
  };

  $.fn.action = function (options) {
    return this.each(function () {
      (new $.action(this, options));
    });
  };
})(jQuery, window, document);
