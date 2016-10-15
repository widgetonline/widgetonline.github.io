var fingers;!function(t){var e=function(){function t(){}return Object.defineProperty(t,"Android",{get:function(){var t=navigator.userAgent.match(/Android/i);return t&&console.log("match Android"),null!=t&&t.length>0},enumerable:!0,configurable:!0}),Object.defineProperty(t,"BlackBerry",{get:function(){var t=navigator.userAgent.match(/BlackBerry/i);return t&&console.log("match Android"),null!=t&&t.length>0},enumerable:!0,configurable:!0}),Object.defineProperty(t,"iOS",{get:function(){var t=navigator.userAgent.match(/iPhone|iPad|iPod/i);return t&&console.log("match Android"),null!=t&&t.length>0},enumerable:!0,configurable:!0}),Object.defineProperty(t,"Opera",{get:function(){var t=navigator.userAgent.match(/Opera Mini/i);return t&&console.log("match Android"),null!=t&&t.length>0},enumerable:!0,configurable:!0}),Object.defineProperty(t,"Windows",{get:function(){var t=navigator.userAgent.match(/IEMobile/i);return t&&console.log("match Android"),null!=t&&t.length>0},enumerable:!0,configurable:!0}),Object.defineProperty(t,"any",{get:function(){return t.Android||t.BlackBerry||t.iOS||t.Opera||t.Windows},enumerable:!0,configurable:!0}),t}();t.MobileDevice=e;var n=function(){function t(){}return Object.defineProperty(t,"isOpera",{get:function(){return!!window.opr&&!!window.opr.addons||!!window.opera||navigator.userAgent.indexOf(" OPR/")>=0},enumerable:!0,configurable:!0}),Object.defineProperty(t,"isFirefox",{get:function(){return"undefined"!=typeof window.InstallTrigger},enumerable:!0,configurable:!0}),Object.defineProperty(t,"isSafari",{get:function(){return Object.prototype.toString.call(HTMLElement).indexOf("Constructor")>0},enumerable:!0,configurable:!0}),Object.defineProperty(t,"isIE",{get:function(){return!!document.documentMode},enumerable:!0,configurable:!0}),Object.defineProperty(t,"isEdge",{get:function(){return!t.isIE&&!!window.StyleMedia},enumerable:!0,configurable:!0}),Object.defineProperty(t,"isChrome",{get:function(){return!!window.chrome&&!!window.chrome.webstore},enumerable:!0,configurable:!0}),Object.defineProperty(t,"isBlink",{get:function(){return(t.isChrome||t.isOpera)&&!!window.CSS},enumerable:!0,configurable:!0}),t}();t.Browser=n}(fingers||(fingers={}));var fingers;!function(t){function e(t,e,n){var o=Math.acos((e.cpos[0]-t.cpos[0])/n)/Math.PI*180;return e.cpos[1]<t.cpos[1]&&(o*=-1),o}t.Patterns={};var n=function(){function t(){}return t.prototype.verify=function(t,e,n){var o=1==t.length&&"touchend"==t[0].act&&e.length>0;return o},t.prototype.recognize=function(t,e){var n=t[1];if(n&&1==n.length){var o=n[0],r=!1;if(null!=e&&e.length>0){var i=e[0];!i||"dragging"!=i.act&&"dragstart"!=i.act||(r=!0)}if(!r)for(var a=0;a<3;a++){var c=t[a];if("touchstart"==c[0].act)return{act:"touched",cpos:[o.cpos[0],o.cpos[1]],time:o.time}}}return null},t}(),o=function(){function t(){}return t.prototype.verify=function(t,e){var n=1==t.length&&"touchmove"==t[0].act&&e.length>2;if(n){n=!1;var o=e[2],r=e[1];if(1==o.length&&1==r.length){var i=o[0],a=r[0];"touchstart"==i.act,"touchstart"==i.act&&"touchmove"==a.act?n=!0:"touchmove"==i.act&&"touchmove"==a.act&&(n=!0)}}return n},t.prototype.recognize=function(t,e){var n=t[2];if(1==n.length){var o=n[0];if("touchstart"==o.act)return{act:"dragstart",cpos:[o.cpos[0],o.cpos[1]],time:o.time};if("touchmove"==o.act&&e.length>0){var r=e[0];if("dragstart"==r.act||"dragging"==r.act)return{act:"dragging",cpos:[o.cpos[0],o.cpos[1]],time:o.time}}}return null},t}(),r=function(){function t(){}return t.prototype.verify=function(t,e,n){var o=1==t.length&&"touchend"==t[0].act&&e.length>0&&n.length>0;return o},t.prototype.recognize=function(t,e){var n=e[0];return"dragging"==n.act||"dragstart"==n.act?{act:"dropped",cpos:[n.cpos[0],n.cpos[1]],time:n.time}:null},t}(),i=function(){function t(){}return t.prototype.verify=function(t,e){var n=1==t.length&&"touchend"==t[0].act&&e.length>0;return n},t.prototype.recognize=function(t,e){var n=t[1];if(n&&1==n.length){var o=n[0];if(null!=e&&e.length>0){var r=e[0];if(r&&"touched"==r.act&&("touchstart"==o.act||"touchmove"==o.act))return o.time-r.time<500?{act:"dbltouched",cpos:[o.cpos[0],o.cpos[1]],time:o.time}:{act:"touched",cpos:[o.cpos[0],o.cpos[1]],time:o.time}}}return null},t}(),a=function(){function t(){}return t.prototype.verify=function(t,e,n){var o=2==t.length&&("touchstart"==t[0].act||"touchstart"==t[1].act||n.length>0&&"touchmove"==t[0].act&&"touchmove"==t[1].act&&"zooming"!=n[0].act&&"zoomstart"!=n[0].act);return o},t.prototype.recognize=function(t,n){var o=t[0],r=o[0],i=o[1],a=Math.sqrt((i.cpos[0]-r.cpos[0])*(i.cpos[0]-r.cpos[0])+(i.cpos[1]-r.cpos[1])*(i.cpos[1]-r.cpos[1])),c=Math.abs(i.cpos[0]-r.cpos[0]),s=Math.abs(i.cpos[1]-r.cpos[1]),u=e(r,i,a),l={act:"zoomstart",cpos:[(r.cpos[0]+i.cpos[0])/2,(r.cpos[1]+i.cpos[1])/2],len:a,angle:u,owidth:c,oheight:s,time:r.time};return l},t}(),c=function(){function t(){}return t.prototype.verify=function(t,e,n){var o=2==t.length&&"touchend"!=t[0].act&&"touchend"!=t[1].act&&("touchmove"==t[0].act||"touchmove"==t[1].act)&&n.length>0&&("zoomstart"==n[0].act||"zooming"==n[0].act);return o},t.prototype.recognize=function(t,n){var o=t[0],r=o[0],i=o[1],a=Math.sqrt((i.cpos[0]-r.cpos[0])*(i.cpos[0]-r.cpos[0])+(i.cpos[1]-r.cpos[1])*(i.cpos[1]-r.cpos[1])),c=e(r,i,a),s=Math.abs(i.cpos[0]-r.cpos[0]),u=Math.abs(i.cpos[1]-r.cpos[1]),l={act:"zooming",cpos:[(r.cpos[0]+i.cpos[0])/2,(r.cpos[1]+i.cpos[1])/2],len:a,angle:c,owidth:s,oheight:u,time:r.time};return l},t}(),s=function(){function t(){}return t.prototype.verify=function(t,e,n){var o=n.length>0&&("zoomstart"==n[0].act||"zooming"==n[0].act)&&t.length<=2;if(o){if(t.length<2)return!0;for(var r=0,i=t;r<i.length;r++){var a=i[r];if("touchend"==a.act)return!0}}return!1},t.prototype.recognize=function(t,e){var n={act:"zoomend",cpos:[0,0],len:0,angle:0,owidth:0,oheight:0,time:(new Date).getTime()};return n},t}();t.Patterns.zoomend=new s,t.Patterns.zooming=new c,t.Patterns.zoomstart=new a,t.Patterns.dragging=new o,t.Patterns.dropped=new r,t.Patterns.touched=new n,t.Patterns.dbltouched=new i}(fingers||(fingers={}));var fingers;!function(t){var e=function(){function e(e){this.inqueue=[],this.outqueue=[],this.patterns=[];var n=["zoomend","zoomstart","zooming","dbltouched","touched","dropped","dragging"];e||(e={patterns:n}),e.patterns||(e.patterns=n),this.cfg=e;for(var o=0,r=e.patterns;o<r.length;o++){var i=r[o];t.Patterns[i]&&this.patterns.add(t.Patterns[i])}}return e.prototype.parse=function(t){if(this.cfg.qlen||(this.cfg.qlen=12),this.inqueue.splice(0,0,t),this.inqueue.length>this.cfg.qlen&&this.inqueue.splice(this.inqueue.length-1,1),this.cfg.on&&this.cfg.on.tap)for(var e=0,n=t;e<n.length;e++){var o=n[e];if("touchstart"==o.act){this.cfg.on.tap(t[0]);break}}for(var r=0,i=this.patterns;r<i.length;r++){var a=i[r];if(a.verify(t,this.inqueue,this.outqueue)){var c=a.recognize(this.inqueue,this.outqueue);if(c){this.outqueue.splice(0,0,c),this.outqueue.length>this.cfg.qlen&&this.outqueue.splice(this.outqueue.length-1,1);var s=this.inqueue;this.inqueue=[],s.clear(),this.cfg.on&&this.cfg.on[c.act]&&this.cfg.on[c.act](c),this.cfg.onrecognized&&this.cfg.onrecognized(c);break}}}},e}();t.Recognizer=e}(fingers||(fingers={}));var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},fingers;!function(t){function e(t,e){return e?t.changedTouches:t.touches}function n(n){function s(t,e,n){return{act:t,cpos:[e,n],time:(new Date).getTime()}}function u(t,e){t&&t.enabled&&(t.onact&&t.onact(l.inqueue),l.parse(e))}var l=new t.Recognizer(n),p=!1,h=!1;return o||(document.oncontextmenu=function(){return!1},t.MobileDevice.any?(document.addEventListener("touchstart",function(t){for(var o=[],r=e(t),i=0;i<r.length;i++){var a=t.changedTouches[i],c=s("touchstart",a.clientX,a.clientY);o.add(c)}u(n,o),t.stopPropagation()},!0),document.addEventListener("touchmove",function(o){for(var r=[],i=e(o),a=0;a<i.length;a++){var c=o.changedTouches[a],l=s("touchmove",c.clientX,c.clientY);r.add(l)}u(n,r),o.stopPropagation(),t.Browser.isSafari&&o.preventDefault()},!0),document.addEventListener("touchend",function(t){for(var o=[],r=e(t,!0),i=0;i<r.length;i++){var a=t.changedTouches[i],c=s("touchend",a.clientX,a.clientY);o.add(c)}u(n,o),t.stopPropagation()},!0)):(a=new r,c=new i,document.addEventListener("keydown",function(t){p=t.shiftKey,h=t.ctrlKey}),document.addEventListener("keyup",function(t){p=t.shiftKey,h=t.ctrlKey}),document.addEventListener("mousedown",function(t){var e=s("touchstart",t.clientX,t.clientY);0!=t.button||p||h?2==t.button||p&&h?(a.start(e),u(n,[e,a.oppo])):1==t.button&&(c.start(e),u(n,[e,c.oppo])):u(n,[e])},!0),document.addEventListener("mousemove",function(t){var e=s("touchmove",t.clientX,t.clientY);0!=t.button||p||h?2==t.button||p&&h?(a.start(e),u(n,[e,a.oppo])):(1==t.button||h)&&(c.start(e),u(n,[e,c.oppo])):u(n,[e])},!0),document.addEventListener("mouseup",function(t){var e=s("touchend",t.clientX,t.clientY);0!=t.button||p||h?1==t.button?(c.start(e),u(n,[e,c.oppo])):(2==t.button||p||h)&&(a.start(e),u(n,[e,a.oppo])):u(n,[e])},!0)),o=!0),n}var o=!1,r=function(){function t(){}return t.prototype.create=function(t){var e=[document.documentElement.clientWidth/2,document.documentElement.clientHeight/2];this.oppo={act:t.act,cpos:[2*e[0]-t.cpos[0],2*e[1]-t.cpos[1]],time:t.time}},t.prototype.start=function(t){return this.create(t),[t,this.oppo]},t.prototype.zoom=function(t){return this.create(t),[t,this.oppo]},t.prototype.end=function(t){return this.create(t),[t,this.oppo]},t}(),i=function(t){function e(){t.apply(this,arguments)}return __extends(e,t),e.prototype.create=function(t){this.oppo={act:t.act,cpos:[t.cpos[0]+100,t.cpos[1]+100],time:t.time}},e}(r),a=null,c=null;t.touch=n}(fingers||(fingers={}));var touch=fingers.touch,fingers;!function(t){function e(t){var e=t.$rot$||new n(t);return e}var n=function(){function t(t){if(t){this.target=t,t.$rot$=this;var e=[t.astyle(["left"]),t.astyle(["top"])];t.style.left=e[0],t.style.top=e[1];var n=t.getBoundingClientRect();this.origin={center:[n.width/2,n.height/2],angle:0,scale:[1,1],pos:[parseFloat(e[0]),parseFloat(e[1])],size:[n.width,n.height]},this.cmt={center:[n.width/2,n.height/2],angle:0,scale:[1,1],pos:[parseFloat(e[0]),parseFloat(e[1])],size:[n.width,n.height]},this.cache={center:[n.width/2,n.height/2],angle:0,scale:[1,1],pos:[parseFloat(e[0]),parseFloat(e[1])],size:[n.width,n.height]},this.status=[],this.center=document.createElement("div"),this.center.style.position="absolute",this.center.style.left="50%",this.center.style.top="50%",this.center.style.width="0px",this.center.style.height="0px",this.center.style.border="solid 0px blue",t.appendChild(this.center),this.setOrigin(this.origin.center),t.style.transform="rotate(0deg)",this.pushStatus()}}return t.prototype.rotate=function(t,e){if(!t)return this;var n=this.cache,o=this.cmt,r=this.offset,i=t.angle,a=t.center,c=t.scale,s=t.pos,u=t.resize;if(r||(r=[0,0]),a!==e){this.pushStatus(),this.setOrigin(a);var l=this.pushStatus();r=this.correct(l,r)}if((i||0===i)&&(n.angle=o.angle+i,n.angle=n.angle%360),u&&(n.size=[o.size[0]+u[0],o.size[1]+u[1]],n.size[0]<10&&(n.size[0]=10),n.size[1]<10&&(n.size[1]=10)),c){if(!(c instanceof Array)){var p=parseFloat(c);c=[p,p]}n.scale=[o.scale[0]*c[0],o.scale[1]*c[1]]}return s&&(n.pos=[o.pos[0]+s[0]-r[0],o.pos[1]+s[1]-r[1]]),this.target.style.transform="rotateZ("+n.angle+"deg) scale("+n.scale[0]+","+n.scale[1]+")",this.target.style.left=n.pos[0]+"px",this.target.style.top=n.pos[1]+"px",u&&(this.target.style.width=n.size[0]+"px",this.target.style.height=n.size[1]+"px"),this.pushStatus(),this},t.prototype.getCenter=function(){var t=this.center.getBoundingClientRect();return[t.left,t.top]},t.prototype.setOrigin=function(t){this.target.style.transformOrigin=t[0]+"px "+t[1]+"px"},t.prototype.correct=function(t,e){e||(e=[0,0]);var n=t.delta,o=parseFloat(this.target.astyle.left)-n.center[0],r=parseFloat(this.target.astyle.top)-n.center[1];return this.offset=[e[0]+n.center[0],e[1]+n.center[1]],this.target.style.left=o+"px",this.target.style.top=r+"px",this.offset},t.prototype.commitStatus=function(){this.cmt=this.cache,this.cmt.pos=[parseFloat(this.target.style.left),parseFloat(this.target.style.top)],this.cmt.size=[parseFloat(this.target.style.width),parseFloat(this.target.style.height)],this.cache={angle:0,scale:[1,1],pos:[0,0],size:[0,0]},this.offset=[0,0]},t.prototype.pushStatus=function(){var t=this.getCenter(),e=[parseFloat(this.target.astyle(["left"])),parseFloat(this.target.astyle(["top"]))],n={center:[t[0],t[1]],pos:e},o=this.status,r=o.length>0?o[o.length-1]:n;return n.delta={center:[n.center[0]-r.center[0],n.center[1]-r.center[1]],pos:[n.pos[0]-r.pos[0],n.pos[1]-r.pos[1]]},o[o.length]=n,o.length>6&&o.splice(0,1),n},t}();t.Rotator=e}(fingers||(fingers={}));var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},fingers;!function(t){function e(t,e,o){var r=[0,0];return t.onmouseover=function(t){r=[t.offsetX,t.offsetY]},n(t,"mouseover",o),r}function n(t,e,n){function o(t,e){for(var n in e)t[n]=e[n];return t}var r={HTMLEvents:/^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,MouseEvents:/^(?:click|dblclick|mouse(?:down|up|over|move|out))$/},i={pointerX:100,pointerY:100,button:0,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,bubbles:!0,cancelable:!0};n&&(i.pointerX=n[0],i.pointerY=n[1]);var a,c=o(i,arguments[3]||{}),s=null;for(var u in r)if(r[u].test(e)){s=u;break}if(!s)throw new SyntaxError("Only HTMLEvents and MouseEvents interfaces are supported");if(document.createEvent)a=document.createEvent(s),"HTMLEvents"==s?a.initEvent(e,c.bubbles,c.cancelable):a.initMouseEvent(e,c.bubbles,c.cancelable,document.defaultView,c.button,c.pointerX,c.pointerY,c.pointerX,c.pointerY,c.ctrlKey,c.altKey,c.shiftKey,c.metaKey,c.button,t),t.dispatchEvent(a);else{c.clientX=c.pointerX,c.clientY=c.pointerY;var l=document.createEventObject();a=o(l,c),t.fireEvent("on"+e,a)}return t}var o=function(){function e(e){this.mapping={},e.$$rot=e.$$rot||t.Rotator(e),e.$zoomer$||(e.$zoomer$={})}return Object.defineProperty(e.prototype,"Name",{get:function(){return this.name},enumerable:!0,configurable:!0}),e.prototype.init=function(t,e){this.name=t,e.$zoomer$[t]=this},e.prototype.trigger=function(t,e,n){this.mapping[t]&&this.mapping[t](e,n)},e}();t.Zoomer=o;var r=function(t){function e(e){t.call(this,e),this.mapping={},this.init("OnAct",e)}return __extends(e,t),e}(o);t.OnAct=r;var i=function(e){function n(n){e.call(this,n);var o=this;this.mapping={dragstart:function(t,e){e.$$sact=t,e.$$pact=t,o.started=!0},dragging:function(t,e){if(o.started){var n=e.$$sact,r=[t.cpos[0]-n.cpos[0],t.cpos[1]-n.cpos[1]];e.$$rot.rotate({pos:r,angle:0,center:[0,0],scale:1}),e.$$pact=t}},dropped:function(e,n){o.started=!1,n.$$rot.commitStatus(),n.$proxyof&&n.reset();var r=t.elAtPos(e.cpos);r&&r.ondrop&&r.ondrop(n.$proxyof||n),n.ondrop&&n.ondrop(e,r)}},this.init("Drag",n)}return __extends(n,e),n}(o);t.Drag=i,t.pointOnElement=e;var a=function(t){function n(n){t.call(this,n);var o=this;this.mapping={zoomstart:function(t,e){e.$$sact=t,e.$$pact=t,o.started=!0},zooming:function(t,n){if(o.started){var r=n.$$sact,i=[t.cpos[0]-r.cpos[0],t.cpos[1]-r.cpos[1]],a=t.angle-r.angle,c=t.len/r.len,s=e(n,"mouseover",t.cpos);n.$$rot.rotate({pos:i,angle:a,center:s,scale:c}),n.$$pact=t}},zoomend:function(t,e){o.started=!1,e.$$rot.commitStatus()}},this.init("Zoom",n)}return __extends(n,t),n}(o);t.Zoom=a;var c=function(t){function e(e){t.call(this,e);var n=this;this.mapping={zoomstart:function(t,e){e.$$sact=t,e.$$pact=t;var o=e.astyle(["width"]),r=e.astyle(["height"]);e.$$initState={w:parseFloat(o),h:parseFloat(r)},n.started=!0},zooming:function(t,e){if(n.started){var o=e.$$sact,r=[t.cpos[0]-o.cpos[0],t.cpos[1]-o.cpos[1]],i=[t.owidth-o.owidth,t.oheight-o.oheight];e.$$rot.rotate({pos:r,angle:0,center:[0,0],scale:1});e.astyle(["width"]),e.astyle(["height"]);e.style.width=e.$$initState.w+i[0]+"px",e.style.height=e.$$initState.h+i[1]+"px",e.$$pact=t}},zoomend:function(t,e){n.started=!1,e.$$rot.commitStatus()}},this.init("Zsize",e)}return __extends(e,t),e}(o);t.Zsize=c}(fingers||(fingers={}));var fingers;!function(t){function e(t){for(var e=null,n=[];;){var o=document.elementFromPoint(t[0],t[1]);if(!o)break;var r=o.astyle(["position"]);if(o==document.body||"html"==o.tagName.toLowerCase()||o==window){e=null;break}if(o.$evtrap$){e=null;break}if(o.$touchable$){e=o.getarget?o.getarget():o,e.$touchel$=o;break}if(!o.$evtignore$&&"absolute"!=r&&"fixed"!=r)break;o.style.display="none",n.add(o)}for(var i=0,a=n;i<a.length;i++){var c=a[i];c.style.display=""}return e}function n(t,e,o){var r=o||[];if(!t||!e)return r;var i=e.callback,a=e.filter;if(i(t),!t.childNodes)return void console.error("Unexpected target node:",t);for(var c=0;c<t.childNodes.length;c++){var s=t.childNodes[c];a&&!a(s)||(i?i(s):r.add(s)),n(s,e,r)}return r}function o(o,c,s){var u=typeof o;document.body.style.touchAction="none","string"==u&&(o=window.$?window.$(o):document.querySelectorAll(o)),o.length===s&&(o=[o]),a||(a=t.touch({on:{tap:function(t){var n=e(t.cpos)||i.activeEls;i.select(n)},touched:function(t){var n=e(t.cpos);i.select(n)}},onact:function(t){},onrecognized:function(t){i.each(function(e){if(e&&e.$zoomer$){var n=e.$zoomer$;for(var o in n){var r=n[o];r.mapping[t.act]&&r.mapping[t.act](t,e)}}})}}),a.enabled=!0),i||(i=new t.FingerContext(a));for(var l=0,p=o;l<p.length;l++){var h=p[l];h.$touchable$||(h.$touchable$=!0,n(h,{callback:function(t){t.$evtignore$=!0}}))}return{zoomable:function(){for(var e=0,n=o;e<n.length;e++){var r=n[e];new t.Zoom(r)}return this},zsizable:function(){for(var e=0,n=o;e<n.length;e++){var r=n[e];new t.Zsize(r)}return this},draggable:function(){for(var e=0,n=o;e<n.length;e++){var i=n[e],a=i.astyle(["position"]);"absolute"!=a&&"fixed"!=a?r(i):new t.Drag(i)}return this},droppable:function(t){for(var e=0,n=o;e<n.length;e++){var r=n[e];r.ondrop=t}return this},on:function(e,n){if(e&&n)for(var r=0,i=o;r<i.length;r++){var a=i[r],c=a.$$onact||new t.OnAct(a);c.mapping[e]||(c.mapping[e]=n),a.$$onact=c}return this},activate:function(){for(var t=0,e=o;t<e.length;t++){var n=e[t];i.select(n)}}}}function r(e){var o=document.createElement("div");return o.className="proxy",o.style.zIndex="9999",o.reset=function(){var t=e.getBoundingClientRect();this.style.display="none",this.style.left=t.left+"px",this.style.top=t.top+"px",this.style.width=t.width+"px",this.style.height=t.height+"px",this.$$rot&&this.$$rot.commitStatus()},o.reset(),o.$proxyof=e,o.$touchable$=!0,n(o,{callback:function(t){t.$evtignore$=!0}}),document.body.appendChild(o),new t.Drag(o),e.$proxy=o,o}t.elAtPos=e;var i,a=null;t.finger=o}(fingers||(fingers={}));var finger=fingers.finger,fingers;!function(t){var e=function(){function t(t){this.settings=t,this.multiactive=!1,this.activeEl=[]}return Object.defineProperty(t.prototype,"activeEls",{get:function(){return this.activeEl},enumerable:!0,configurable:!0}),t.prototype.select=function(t){this.multiactive||this.activeEl.clear(),this.activeEl.add(t)},t.prototype.each=function(t){if(t&&this.activeEl&&this.activeEl.length>0)for(var e=0,n=this.activeEl;e<n.length;e++){var o=n[e];t(o)}},t}();t.FingerContext=e}(fingers||(fingers={}));