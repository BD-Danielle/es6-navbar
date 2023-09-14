(function (window, document) {
  var viewAction = {};
  class Action {
    constructor(id, options) {
      viewAction[id] = this;
      this.options = options;
      this.index = 0;
      this.init();
    }
    get device() {
      return document.body.classList.contains("PC") ? "PC" : document.body.classList.contains("MOBILE") ? "MOBILE" : null;
    }
    get xBar() {
      return this.options.xBar;
    }
    get barWidth() {
      return this.xBar.id ? this.q(this.xBar.id).offsetWidth: 0;
    }
    get nextBtnWidth() {
      return this.xBar.next ? this.q(this.xBar.next).offsetWidth: 0;
    }
    get prevBtnWidth() {
      return this.xBar.prev ? this.q(this.xBar.prev).offsetWidth: 0;
    }
    get containerWidth(){
      return this.barWidth - this.nextBtnWidth - this.prevBtnWidth
    }
    get columnWidth() {
      return this.containerWidth / this.xBar.columns;
    }
    get scrollContainer(){
      return this.q(this.xBar.id).lastElementChild?.children[0];
    }
    get contents(){
      return this.q(this.xBar.contents);
    }
    get offsetTops(){
      return this.contents.map(content => content.offsetTop);
    }
    get items(){
      return this.scrollContainer?.children || [];
    }
    get length() {
      return this.items.length;
    }
    get navbar(){
      return this.q(this.xBar.id);
    }
    q(str) {
      const elements = document.querySelectorAll(str);
      return elements.length === 1 ? elements[0] : [...elements];
    }
    init() {
      this.clickHandler(this.navbar);
      this.setupListeners();
    }
    setWidth(){
      this.scrollContainer.style.width = this.containerWidth + "px";
      [...this.items].forEach(item => item.style.width = this.columnWidth + "px");
    }
    scrollY() {
      window.scrollTo(0, this.offsetTops[this.index] - 45);
    }
    scrollX(direction) {

      if (direction === undefined) {
        // If direction is undefined, find the index based on scroll position
        this.index = this.offsetTops.findIndex(offsetTop => window.scrollY <= offsetTop);
        if(this.index === -1) return;
        [...this.items].forEach(item => item.firstElementChild.classList.remove(this.xBar.active));
        const targetElement = this.items[this.index];
        const scrollLeft =
          targetElement.offsetLeft + (targetElement.offsetWidth - this.scrollContainer.offsetWidth - this.prevBtnWidth - this.nextBtnWidth) /
          2;
        targetElement.firstElementChild.classList.add(this.xBar.active);
        this.scrollContainer.scrollLeft = scrollLeft;
        return;
      }
    
      // Update the index based on the direction
      this.index += direction;
    
      // Handle boundary conditions
      if (this.index >= this.length) {
        this.index = 0;
      } else if (this.index < 0) {
        this.index = this.length - 1;
      }
    
      // Scroll and trigger a click event
      this.items[this.index].firstElementChild.click();
    }
    
    addClass(selector) {
      if (!selector) return;
      selector.classList.toggle(this.xBar.active);
      this.index = [...this.items].findIndex(item => item.firstElementChild.classList.contains(this.xBar.active));
    }
    removeClass(selector) {
      if (!selector) return;
      const child = selector.querySelector(`.${this.xBar.active}`);
      child?.classList.remove(this.xBar.active);
    }
    rebound(bool, selector) {
      const existingRebounds = document.querySelectorAll(".rebound");
      existingRebounds.forEach(element => element.remove());

      if (bool) {
        const div = document.createElement("div");
        div.className = "rebound";
        div.style.height = selector.offsetHeight + 1.5 + "px";
        selector.insertAdjacentElement("beforebegin", div);
      }
    }
    toFixed() {
      if (!this.xBar.fixed) return;

      const overheadElement = this.q(this.xBar.overhead);
      const isArrived = window.scrollY > overheadElement.offsetHeight;

      this.navbar.style.position = isArrived ? "fixed" : "unset";
      this.navbar.style.top = isArrived ? this.xBar.top + "px" : "";
      this.rebound(isArrived, this.navbar);
    }
    setupListeners() {
      const eventTypes = ["DOMContentLoaded", "scroll", "resize", "orientationchange"];
      eventTypes.forEach(eventType => {
        window.addEventListener(eventType, () => {
          this.setWidth();
          this.toFixed();
          if(eventType === "scroll") this.scrollX();
        });
      });
    }

    clickHandler(selector) {
      selector.addEventListener("click", (event) => {
        event.preventDefault();
        const target = event.target;
        const id = target.id;
        switch (id) {
          case this.xBar.next.replace(/[#.]/g, ''):
          case this.xBar.prev.replace(/[#.]/g, ''):
            this.scrollX(id === this.xBar.next.replace(/[#.]/g, '') ? 1 : -1);
            break;
          default:
            this.removeClass(this.scrollContainer);
            this.addClass(target);
            this.scrollY();
            break;
        }
      })
    }
  }

  window.Action = Action;
  window.viewAction = viewAction;
})(window, document);


