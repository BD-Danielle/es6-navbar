'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
使用方式如下：
綁定需被監視的物件target並給予id, 在頁面設置成對的錨點['start', 'end'], 不限組數, 範列如下：
  $(function () {
    var peekaboo = new Peekaboo();
    peekaboo.setArea('target', [['begin', 'end'], ['begin1', 'end1']]);

    window.onscroll = function () {
      peekaboo.start();
    }
  })
*/
var Peekaboo = function () {
  function Peekaboo() {
    _classCallCheck(this, Peekaboo);

    if (Peekaboo._instance) {
      throw new Error('Peekaboo already has an instance!!!');
    }
    Peekaboo._instance = this;
    this.areas = [];
  }

  _createClass(Peekaboo, [{
    key: 'setArea',
    value: function setArea(target, positions) {
      var positionObj = positions.map(function (pos) {
        return [this.toObj(pos[0]), this.toObj(pos[1])];
      }, this);
      this.areas.push({ target: this.toObj(target), positions: positionObj });
    }
  }, {
    key: 'toObj',
    value: function toObj(elem) {
      var obj = void 0;
      if (typeof elem === 'string') {
        obj = $("#" + elem);
      } else if ((typeof elem === 'undefined' ? 'undefined' : _typeof(elem)) === 'object') {
        if (elem instanceof jQuery) {
          obj = elem;
        } else {
          obj = $("#" + elem);
        }
      }

      return obj;
    }
  }, {
    key: 'layout',
    value: function layout() {
      var documentHeight = Math.max(document.body.scrollHeight, document.body.clientHeight);
      var scrolledHeight = window.pageYOffset || //flexible
      document.documentElement.scrollTop || document.body.scrollTop;
      var viewableContent = window.innerHeight; //fixed
      var viewableBrowser = window.outerHeight; //fixed
      var browserBarHeight = viewableBrowser - viewableContent; //fixed
      var unscrolledHeight = documentHeight - scrolledHeight - viewableContent;
      return {
        scrolledHeight: scrolledHeight,
        viewableBrowser: viewableBrowser,
        browserBarHeight: browserBarHeight,
        unscrolledHeight: unscrolledHeight,
        documentHeight: documentHeight
      };
    }
  }, {
    key: 'div',
    value: function div(id) {
      var documentHeight = this.layout().documentHeight;
      // divOffsetHeight including padding and border
      var divOffsetHeight = $(id).outerHeight() || $(id).get(0).offsetHeight;
      var divOffsetTop = function () {
        var myObj = $(id);
        if (myObj.length) {
          return myObj.offset().top;
        }
      }();
      var divOffsetBottom = documentHeight - (divOffsetTop + divOffsetHeight);
      return {
        divOffsetTop: divOffsetTop,
        divOffsetHeight: divOffsetHeight,
        divOffsetBottom: divOffsetBottom
      };
    }
  }, {
    key: 'start',
    value: function start() {
      this.areas.forEach(function (area) {
        this.detectVisible(area);
      }, this);
    }
  }, {
    key: 'detectVisible',
    value: function detectVisible(area) {
      var cat = area.target.css('display', 'none');
      var visible = [];
      area.positions.forEach(function (pos) {
        var begin = this.div(pos[0]).divOffsetTop;
        var end = this.div(pos[1]).divOffsetBottom;
        var scrollBarLocation = this.layout().scrolledHeight;
        var unscrollBarLocation = this.layout().unscrolledHeight;

        switch (document.body.classList.contains('MOBILE') ? 'MOBILE' : document.body.classList.contains('PC') ? 'PC' : '') {
          case 'PC':
            if (begin <= scrollBarLocation && end <= unscrollBarLocation) {
              //true
              // cat.show();
              visible.push(1);
            } else {
              // cat.hide();
              visible.push(0);
            }
            break;
          case 'MOBILE':
            if (begin <= scrollBarLocation + 45 && end <= unscrollBarLocation) {
              //true
              // cat.show();
              visible.push(1);
            } else {
              // cat.hide();
              visible.push(0);
            }
            break;
        }
      }, this);

      if (visible.reduce(function (pv, cv) {
        return pv + cv;
      }, 0) > 0) {
        cat.show();
      } else {
        cat.hide();
      }
    }
  }]);

  return Peekaboo;
}();
// window.Peekaboo = Peekaboo;
