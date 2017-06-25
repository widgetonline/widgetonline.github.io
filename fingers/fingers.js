!function e(t,n,r){function i(a,u){if(!n[a]){if(!t[a]){var c="function"==typeof require&&require;if(!u&&c)return c(a,!0);if(o)return o(a,!0);var s=new Error("Cannot find module '"+a+"'");throw s.code="MODULE_NOT_FOUND",s}var l=n[a]={exports:{}};t[a][0].call(l.exports,function(e){var n=t[a][1][e];return i(n||e)},l,l.exports,e,t,n,r)}return n[a].exports}for(var o="function"==typeof require&&require,a=0;a<r.length;a++)i(r[a]);return i}({1:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e("../../kernel/src/web/definition"),i=e("./toucher"),o=e("../../kernel/src/web/widgets/widget");r.definitions();var a=window,u=new i.Toucher;a.touch=u,a.w=o.Widget,o.Widget.init({})},{"../../kernel/src/web/definition":5,"../../kernel/src/web/widgets/widget":10,"./toucher":2}],2:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e("../../kernel/src/web/debug"),i=e("../../kernel/src/web/device"),o=function(){function e(){var e=!1;i.MobileDevice.any?(document.addEventListener("touchstart",function(t){e=!0,r.log("Touch Start","raw"),t.stopPropagation()},!0),document.addEventListener("touchmove",function(t){e=!0,r.log("Touch Move","raw"),t.stopPropagation(),i.Browser.isSafari&&t.preventDefault()},!0),document.addEventListener("touchend",function(t){e=!0,r.log("Touch End","raw"),t.stopPropagation()},!0),document.addEventListener("touchcancel",function(t){e=!0,r.log("Touch Cancel","raw"),t.stopPropagation()},!0)):(document.addEventListener("mousedown",function(t){e||r.log("Mouse Down","raw")},!0),document.addEventListener("mousemove",function(t){e||r.log("Mouse Move","raw")},!0),document.addEventListener("mouseup",function(t){e||r.log("Mouse Up","raw")},!0),document.addEventListener("mousewheel",function(e){r.log("Wheel","raw")},!0),document.addEventListener("DOMMouseScroll",function(e){r.log("Firefox Wheel","raw")},!0))}return e.prototype.contextmenu=function(e){document.body.oncontextmenu=function(t){if(!e)return t.preventDefault(),t.stopPropagation(),!1}},e}();n.Toucher=o},{"../../kernel/src/web/debug":4,"../../kernel/src/web/device":6}],3:[function(e,t,n){"use strict";function r(e,t){if(void 0===e||null===e||void 0===t)return!1;t instanceof Array||(t=[t]);var n=!1;return c(t,function(t,r){if(0==e.indexOf(t))return n=!0,!0}),n}function i(e,t,n){return e&&0==e.indexOf(t)&&e.lastIndexOf(n)==e.length-n.length}function o(e,t,n){var r=t?t.length:1,i=n?n.length:1;return e?e.substr(r,e.length-r-i):e}function a(e,t,n){if(t)for(var r in t)n&&n[r]||(e[r]=t[r])}function u(e,t,n){if(e&&t)return c(e,function(e,r){if(e[t]==n)return!0})}function c(e,t,n){var r=null;if(t){if(void 0===e||null===e)return n&&n(),r;if(e instanceof Array||void 0!==e.length){n&&n(!0);for(var i=0;i<e.length;i++)if(t(e[i],i,e)){r=e[i];break}}else{n&&n(!1);for(var i in e)if(t(e[i],i,e)){r=e[i];break}}}return r}function s(e){e||(e="$u$");var t=new Date;return e+"-"+t.getHours()+t.getMinutes()+t.getSeconds()+t.getMilliseconds()+Math.floor(100*Math.random())+"-"+t.getFullYear()+t.getMonth()+t.getDate()}function l(e,t){var n="$cloneid$";if(t=t||s("$cl$"),void 0===e||null===e||"object"!=typeof e)return e;var r=e;return e[n]&&e[n]==t?e:(c(e,function(e,n){r[n]=l(e,t)},function(i){r=i?[]:{},e[n]=t}),r)}function f(e,t){var n="";return c(e,function(e,r){n+=t?e[t]:e}),n}function d(e){if(e)for(;e.length>0;)e.pop();return e}function h(e,t,n){n||(n=function(e,t){return e==t});var r=!0;return c(e,function(e,i){if(n(e,t))return r=!1,!0}),r}function p(e,t,n){return n?!0===n&&(n=h):n=function(e,t){return!0},e?void 0===e.length&&n(e,t)?[e,t]:(n(e,t)&&(e[e.length]=t),e):[t]}function g(e,t){for(var n=0;n<t.length;n++){p(e,t[n])}}Object.defineProperty(n,"__esModule",{value:!0}),n.starts=r,n.between=i,n.inbetween=o,n.extend=a,n.find=u,n.all=c,n.uid=s,n.clone=l,n.join=f,n.clear=d,n.unique=h,n.add=p,n.addrange=g},{}],4:[function(e,t,n){"use strict";function r(e,t){if(e&&(document.body.debugging||"true"==document.body.getAttribute("debugging"))){var n=new Number(document.body.getAttribute("dlevel"));t>=n&&e()}}function i(){var e=document.body.$lbox$;return e||(e=document.createElement("div"),e.className="logbox",document.body.$lbox$=e,document.body.appendChild(e)),e}function o(e,t){var n=t||i();t&&("string"==typeof t&&a[t]?n=a[t]:e&&(a[e]=t,n=t,e="Box "+e+" activated")),n.innerHTML=e+"<br />"+n.innerHTML}Object.defineProperty(n,"__esModule",{value:!0}),n.default=r;var a={};n.log=o},{}],5:[function(e,t,n){"use strict";function r(){Array.prototype.add=function(e){return this[this.length]=e,this},Array.prototype.clear=function(){for(var e=this.length,t=0;t<e;t++)this.pop();return this},Array.prototype.eachfunc=NodeList.prototype.eachfunc=HTMLCollection.prototype.eachfunc=function(e,t){for(var n=0,r=this;n<r.length;n++){var i=r[n];i[e]&&i[e].apply(i,t)}return this},Array.prototype.each=NodeList.prototype.each=HTMLCollection.prototype.each=function(e){if(e)for(var t=0;t<this.length&&!e(this[t],t);t++);},Array.prototype.all=NodeList.prototype.all=HTMLCollection.prototype.all=function(e){if(e)for(var t=0,n=this;t<n.length;t++){var r=n[t];if(e(r))break}return this},String.prototype.between=function(e,t){return t||(t=e),this&&this.length>e.length+t.length&&this.substr(0,e.length)==e&&this.substr(this.length-t.length)==t},String.prototype.inbetween=function(e){return e||(e=1),this&&this.length>2*e?this.substr(e,this.length-2*e):""},String.prototype.starts=function(e){return 0==this.indexOf(e)},String.prototype.right=function(e){return 0==e?"":e<0?this.substr(-1*e,this.length+e):this.substr(this.length-e,e)},String.prototype.has=function(e){return this.indexOf(e)>=0},HTMLInputElement.prototype.setCaret=function(e){var t=this;if(t.createTextRange){var n=t.createTextRange();n.move("character",e),n.select()}else e?(t.focus(),t.setSelectionRange(e,e)):t.focus()},HTMLInputElement.prototype.setCaretEnd=function(){this.setCaret(this.value.length)},Element.prototype.uid=function(e){if(e){var t=new Date,n=e.indexOf("-")>=0?e:e+"-"+t.getHours()+t.getMinutes()+t.getSeconds()+t.getMilliseconds()+Math.floor(100*Math.random())+"-"+t.getFullYear()+t.getMonth()+t.getDate();return this.$uid$=n,n}return this.$uid$},Element.prototype.visible=function(){return!(this.astyle("display","none")||this.astyle("visibility","hidden"))},Element.prototype.display=function(e){e?this.addcss("wo-hidden"):this.delcss("wo-hidden")},Element.prototype.astyle=function(e,t){for(var n=null,r=e instanceof Array?e:[e],i=this,o=window.getComputedStyle(i,null),a=0;a<r.length&&null==(n=o.getPropertyValue(r[a]));a++);return void 0!==t?n==t:n},Element.prototype.addcss=function(e){var t=this.className.trim(),n=!1;t.between("{","}")&&(n=!0,t=t.inbetween()),0!=t.indexOf(e)&&t.indexOf(" "+e)<0&&(this.className=n?"{ "+this.className+" "+e+" }":this.className+" "+e)},Element.prototype.delcss=function(e){var t=this.className.trim();(0==t.indexOf(e)||t.indexOf(" "+e)>=0)&&(this.className=this.className.replace(e,""))},Element.prototype.attach=function(e,t,n){var r="$"+e+"$",i=t;return this[r]?(this.detach(e,n),this[r]=i,this.appendChild(i),i):(i=i||document.createElement("div"),this[r]=i,this.appendChild(i),i)},Element.prototype.destroy=function(){var e=window.$destroyer$;e.appendChild(this),e.innerHTML=""},Element.prototype.detach=function(e,t){var n="$"+e+"$";if(this[n]){var r=this[n];t&&t.ondetach&&t.ondetach(r),r.destroy(),this[n]=null}},Element.prototype.set=function(e,t,n){for(var r=e.split("."),i=this,o=0;o<r.length;o++){var a=r[o],u=i[a];if(void 0===u)break;i=u}i&&(n?n.call(i,t):"string"==typeof t?i.innerHTML=t:i.appendChild(t))};var e=window;if(e.d=i.default,e.l=i.log,!e.$destroyer$){var t=document.createElement("div");e.$destroyer$=t}}Object.defineProperty(n,"__esModule",{value:!0});var i=e("./debug");n.definitions=r},{"./debug":4}],6:[function(e,t,n){"use strict";function r(e,t,n){function r(e,t){for(var n in t)e[n]=t[n];return e}var i={HTMLEvents:/^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,MouseEvents:/^(?:click|dblclick|mouse(?:down|up|over|move|out))$/},o={pointerX:100,pointerY:100,button:0,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,bubbles:!0,cancelable:!0};n&&n.pos&&(o.pointerX=n.pos[0],o.pointerY=n.pos[1]);var a,u=r(o,arguments[3]||{}),c=null;for(var s in i)if(i[s].test(t)){c=s;break}if(!c)throw new SyntaxError("Only HTMLEvents and MouseEvents interfaces are supported");if(document.createEvent)a=document.createEvent(c),"HTMLEvents"==c?a.initEvent(t,u.bubbles,u.cancelable):a.initMouseEvent(t,u.bubbles,u.cancelable,document.defaultView,u.button,u.pointerX,u.pointerY,u.pointerX,u.pointerY,u.ctrlKey,u.altKey,u.shiftKey,u.metaKey,u.button,e),e.dispatchEvent(a);else{u.clientX=u.pointerX,u.clientY=u.pointerY;a=r(document.createEventObject(),u),e.fireEvent("on"+t,a)}return e}Object.defineProperty(n,"__esModule",{value:!0});var i=function(){function e(){}return Object.defineProperty(e,"Android",{get:function(){var e=navigator.userAgent.match(/Android/i);return e&&console.log("match Android"),null!=e&&e.length>0},enumerable:!0,configurable:!0}),Object.defineProperty(e,"BlackBerry",{get:function(){var e=navigator.userAgent.match(/BlackBerry/i);return e&&console.log("match Android"),null!=e&&e.length>0},enumerable:!0,configurable:!0}),Object.defineProperty(e,"iOS",{get:function(){var e=navigator.userAgent.match(/iPhone|iPad|iPod/i);return e&&console.log("match Android"),null!=e&&e.length>0},enumerable:!0,configurable:!0}),Object.defineProperty(e,"Opera",{get:function(){var e=navigator.userAgent.match(/Opera Mini/i);return e&&console.log("match Android"),null!=e&&e.length>0},enumerable:!0,configurable:!0}),Object.defineProperty(e,"Windows",{get:function(){var e=navigator.userAgent.match(/IEMobile/i);return e&&console.log("match Android"),null!=e&&e.length>0},enumerable:!0,configurable:!0}),Object.defineProperty(e,"any",{get:function(){return e.Android||e.BlackBerry||e.iOS||e.Opera||e.Windows},enumerable:!0,configurable:!0}),e}();n.MobileDevice=i;var o=window,a=document,u=function(){function e(){}return Object.defineProperty(e,"isOpera",{get:function(){return!!o.opr&&!!o.opr.addons||!!o.opera||navigator.userAgent.indexOf(" OPR/")>=0},enumerable:!0,configurable:!0}),Object.defineProperty(e,"isFirefox",{get:function(){return void 0!==o.InstallTrigger},enumerable:!0,configurable:!0}),Object.defineProperty(e,"isSafari",{get:function(){return Object.prototype.toString.call(HTMLElement).indexOf("Constructor")>0},enumerable:!0,configurable:!0}),Object.defineProperty(e,"isIE",{get:function(){return!!a.documentMode},enumerable:!0,configurable:!0}),Object.defineProperty(e,"isEdge",{get:function(){return!e.isIE&&!!o.StyleMedia},enumerable:!0,configurable:!0}),Object.defineProperty(e,"isChrome",{get:function(){return!!o.chrome&&!!o.chrome.webstore},enumerable:!0,configurable:!0}),Object.defineProperty(e,"isBlink",{get:function(){return(e.isChrome||e.isOpera)&&!!o.CSS},enumerable:!0,configurable:!0}),e}();n.Browser=u,n.fire=r},{}],7:[function(e,t,n){"use strict";function r(e){console.log(e)}Object.defineProperty(n,"__esModule",{value:!0});var i=e("../../common"),o=function(){function e(e){this.target=e,this.actions=[],this.onetimes=[],e.actions||(e.actions=this)}return e.check=function(t){return new e(t)},e.parse=function(t,n,r){var o=void 0,a=t.indexOf("~");a>0&&(o=t.substr(0,a),t=t.substr(a+1,t.length-a-1));var u=new Function("self","unit","arg","\n            "+(r?t:"return "+t)+";\n        "),c=null;o&&(c=o.split(","));var s=function(t,n,r){i.all(c,function(o,a){if(i.starts(o,"_")){var u=t.$filters[o]||e.filters[o];u&&(console.log("Filter "+o+" triggered."),u.call(n,r))}})},l=function(t,n,r,o){return i.all(c,function(a,u){if(!i.starts(a,"$")&&!i.starts(a,"_")){var c=t.$filters[a]||e.filters[a];if(c){console.log("Filter "+a+" triggered.");var s=c.call(n,r,o);void 0!==s&&(r=s)}}}),r},f=function(t,n,r,o){i.all(c,function(a,u){if(i.starts(a,"$")){var c=t.$filters[a]||e.filters[a];c&&(console.log("Filter "+a+" triggered."),c.call(n,r,o))}})},d=function(e,t,r){s(this,e,r);var i=u.call(this,e,function(t){return e.unit(t)},r);return i=l(this,e,i,r),n&&n.call(e,i,r),f(this,e,i,r),i};return o&&0==o.indexOf("$once")?{action:d,once:!0}:{action:d}},e.prototype.run=function(){i.all(this.onetimes,function(e,t){e.func.call(e.scope.call(e.target),e.target,e.unit,e.arg)}),this.onetimes=[],i.all(this.actions,function(e,t){e.func.call(e.scope.call(e.target),e.target,e.unit,e.arg)})},e.prototype.register=function(t,n,r,o){var a=e.parse(t,n,o),u=a.action,c=this.target;a.once?i.add(this.onetimes,{func:u,arg:r,target:c,scope:c.scope,unit:function(e){return c.unit(e)}}):i.add(this.actions,{func:u,arg:r,target:c,scope:c.scope,unit:function(e){return c.unit(e)}})},e}();o.filters={$ui:function(e){this.render()},$once:function(e,t){console.log(this)},d:r,$d:r,_d:r},n.Action=o;!function(){function e(){}}()},{"../../common":3}],8:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(){}return Object.defineProperty(e.prototype,"childunit",{get:function(){return this.target.getAttribute("alias")?this.target:this.unit||this.target},enumerable:!0,configurable:!0}),e.check=function(t){if(!t.cs){var n=new e;n.target=t,t.cs=n}},e}();n.Cursor=r},{}],9:[function(e,t,n){"use strict";function r(e,t){var n=this;e instanceof Array&&(e={$:e});var r=new c(n);t&&r.setparent(t);var i=n.getAttribute("scope");r.setscope(e,i),a.Action.check(n),r.prepareAttrs();var u=null;return o.Widget.has(n.tagName)?u=o.Widget.use(n):n.prepareChildren(e),u&&(n.trigger("link"),u.link(n),n.trigger("linked")),r.refresh(),n}Object.defineProperty(n,"__esModule",{value:!0});var i=e("../../common"),o=e("./widget"),a=e("./action"),u=e("./cursor");n.PrepareElement=r;var c=function(){function e(e,t){this.target=e,e.isready&&e.isready()||(u.Cursor.check(e),e.slots={default:[]},e.unit=function(e){return this.cs.unit},e.root=function(){return this.cs.root},e.detach=function(){var e=document.body;return e.$detach$||(e.$detach$=document.createElement("div")),e.$detach$.appendChild(this),this},e.trigger=function(e,t){var n=this.scope();if(n.on||(n.on={}),n=n.on,n[e]&&"function"==typeof n[e]){var r=n[e].call(this,t);return void 0===r?t:r}return t},e.appendto=function(e){var t=this;e&&(e.appendChild(t),t.trigger("mounted",t))},e.prepareChildren=function(e){var t=this;t.onpreparechildren?t.onpreparechildren(e):t.childNodes.length>0&&i.all(t.childNodes,function(n,i){if(n instanceof Element){var o=n,a=e;r.call(o,a,t)}})},e.isready=function(){return 2==this.state},e.refresh=function(e){var t=this;t.onrefresh&&t.onrefresh(t.scope()),this.actions.run(),e&&i.all(this.childNodes,function(t,n){t instanceof Element&&t.refresh(e)})},e.act=function(e,t,n,r){this.actions.register(e,t,n,r)},e.render=function(){var e=this,t=e.scope(),n=t.$factory,r=n.render(e);r=e.trigger("render",r),void 0!==r&&(e.innerHTML=r),e.trigger("rendered",r),e.prepareChildren(t)},e.state=1)}return e.prototype.prepareAttrs=function(){var e=this,t=this.target,n=(t.cs.parent,t.attributes);return i.all(n,function(n,r){if("alias"==n.name)e.setalias(n.value);else if(i.starts(n.name,"html"))t.act(n.value,function(e,t){this.innerHTML=void 0===e?"":e},void 0);else if(i.starts(n.name,"if")){var o=n.name.substr(2),u=t.scope("on");if(u&&u[o])t.addEventListener(o,u[o]);else{var c=n.value,s=a.Action.parse(c,null,!0);t["on"+o]=function(e){s.call(u,t,t.unit,e)}}}else if(i.starts(n.name,":"))t.act(n.value,function(e,t){this[t]=e},n.name.substr(1));else if(i.between(n.value,"{","}")){var c=i.inbetween(n.value);t.act(c,function(e,t){e?this.setAttribute(t,e):this.removeAttribute(t)},n.name)}}),this},e.prototype.setalias=function(e){var t=this.target,n=t.cs.parent;if(n){n.cs.childunit["$"+e]=t}return this},e.prototype.setparent=function(e){return this.target.cs.parent=e,e.cs.root?this.target.cs.root=e.cs.root:this.target.cs.root=e,this.target.cs.unit=e.cs.childunit,this},e.prototype.setscope=function(e,t){var n=this.target;t&&(e=e[t]||{},this.setalias(t)),n.$scope=e,n.scope=function(e){var t=this.$scope,n=t;return e&&(n=t[e]),n.$filters||(n.$filters={}),n},n.setscope=function(e){this.$scope=e}},e.prototype.refresh=function(){this.target.state=2,this.target.refresh()},e}();n.ElementProcessor=c},{"../../common":3,"./action":7,"./cursor":8,"./widget":10}],10:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e("../../common"),i=e("./processor"),o=function(){function e(){}return e.parsehtml=function(e){var t=null,n=document.createElement("div");return n.className="w-wrap",n.innerHTML=e,t=n.childElementCount>1?n:n.firstElementChild,t.prepare=i.PrepareElement,t},e.regist=function(t,n){e.widgets[t]=n},e.has=function(t){var n;return n="string"==typeof t?t.toLowerCase():t.tagName.toLowerCase(),e.widgets[n]},e.prepare=function(e,t,n){e&&(e.prepare||(e.prepare=i.PrepareElement),e.prepare(t,n))},e.use=function(t){var n=t.tagName.toLowerCase(),i=e.widgets[n];return i?(r.all(t.childNodes,function(e,n){var i=e.attributes;if(i&&i.slot){var o=i.slot;t.slots[o]||(t.slots[o]=[]),r.add(t.slots[o],e)}}),t.scope().$factory=i,i.init(t),t.render(),i):null},e.init=function(t){window.w=e,r.all(t,function(t,n){e.regist(n,t)})},e}();o.widgets={},n.Widget=o;var a=function(){function e(){}return e.prototype.init=function(e){},e.prototype.render=function(e){return this.renderWidget(e)},e.prototype.link=function(e){this.linkWidget(e)},e}();n.WidgetFactory=a},{"../../common":3,"./processor":9}]},{},[1]);