function d(t){console.log(t);var e=document.body.$debug$;e||(e=document.createElement("div"),document.body.$debug$=e,document.body.appendChild(e)),e.innerHTML=t+"<br/>"+e.innerHTML}function read(t,e,n,o,r){if(!t)return null;for(var i,s=t,a=null,c=0,u=e;c<u.length;c++){var l=u[c];if(i=l,a=s,s=s[l],s===r){if(!n)return null;s={},a[i]=s}}return o&&o(a,i,s),s}function use(t,e,n){e||(e=document.body);var o=wo.use(t,n);return o.$ctx=e,o}Array.prototype.add=function(t){this[this.length]=t},Array.prototype.clear=function(t){for(var e=this.length,n=e-1;n>=0;n--){var o=this.pop();o=null}};var fingers;!function(t){function e(t,e,n){var o=Math.acos((e.cpos[0]-t.cpos[0])/n)/Math.PI*180;return e.cpos[1]<t.cpos[1]&&(o*=-1),o}t.Patterns={};var n=function(){function t(){}return t.prototype.verify=function(t,e,n){var o=1==t.length&&"touchend"==t[0].act&&e.length>0;return o},t.prototype.recognize=function(t,e){var n=t[1];if(n&&1==n.length){var o=n[0],r=!1;if(null!=e&&e.length>0){var i=e[0];!i||"dragging"!=i.act&&"dragstart"!=i.act||(r=!0)}if(!r)for(var s=0;s<3;s++){var a=t[s];if("touchstart"==a[0].act)return{act:"touched",cpos:[o.cpos[0],o.cpos[1]],time:o.time}}}return null},t}(),o=function(){function t(){}return t.prototype.verify=function(t,e){var n=1==t.length&&"touchmove"==t[0].act&&e.length>2;if(n){n=!1;var o=e[2],r=e[1];if(1==o.length&&1==r.length){var i=o[0],s=r[0];"touchstart"==i.act,"touchstart"==i.act&&"touchmove"==s.act?n=!0:"touchmove"==i.act&&"touchmove"==s.act&&(n=!0)}}return n},t.prototype.recognize=function(t,e){var n=t[2];if(1==n.length){var o=n[0];if("touchstart"==o.act)return{act:"dragstart",cpos:[o.cpos[0],o.cpos[1]],time:o.time};if("touchmove"==o.act&&e.length>0){var r=e[0];if("dragstart"==r.act||"dragging"==r.act)return{act:"dragging",cpos:[o.cpos[0],o.cpos[1]],time:o.time}}}return null},t}(),r=function(){function t(){}return t.prototype.verify=function(t,e,n){var o=1==t.length&&"touchend"==t[0].act&&e.length>0&&n.length>0;return o},t.prototype.recognize=function(t,e){var n=e[0];return"dragging"==n.act||"dragstart"==n.act?{act:"dropped",cpos:[n.cpos[0],n.cpos[1]],time:n.time}:null},t}(),i=function(){function t(){}return t.prototype.verify=function(t,e){var n=1==t.length&&"touchend"==t[0].act&&e.length>0;return n},t.prototype.recognize=function(t,e){var n=t[1];if(n&&1==n.length){var o=n[0];if(null!=e&&e.length>0){var r=e[0];if(r&&"touched"==r.act&&("touchstart"==o.act||"touchmove"==o.act))return o.time-r.time<500?{act:"dbltouched",cpos:[o.cpos[0],o.cpos[1]],time:o.time}:{act:"touched",cpos:[o.cpos[0],o.cpos[1]],time:o.time}}}return null},t}(),s=function(){function t(){}return t.prototype.verify=function(t,e,n){var o=2==t.length&&("touchstart"==t[0].act||"touchstart"==t[1].act||n.length>0&&"touchmove"==t[0].act&&"touchmove"==t[1].act&&"zooming"!=n[0].act&&"zoomstart"!=n[0].act);return o},t.prototype.recognize=function(t,n){var o=t[0],r=o[0],i=o[1],s=Math.sqrt((i.cpos[0]-r.cpos[0])*(i.cpos[0]-r.cpos[0])+(i.cpos[1]-r.cpos[1])*(i.cpos[1]-r.cpos[1])),a=Math.abs(i.cpos[0]-r.cpos[0]),c=Math.abs(i.cpos[1]-r.cpos[1]),u=e(r,i,s),l={act:"zoomstart",cpos:[(r.cpos[0]+i.cpos[0])/2,(r.cpos[1]+i.cpos[1])/2],len:s,angle:u,owidth:a,oheight:c,time:r.time};return l},t}(),a=function(){function t(){}return t.prototype.verify=function(t,e,n){var o=2==t.length&&"touchend"!=t[0].act&&"touchend"!=t[1].act&&("touchmove"==t[0].act||"touchmove"==t[1].act)&&n.length>0&&("zoomstart"==n[0].act||"zooming"==n[0].act);return o},t.prototype.recognize=function(t,n){var o=t[0],r=o[0],i=o[1],s=Math.sqrt((i.cpos[0]-r.cpos[0])*(i.cpos[0]-r.cpos[0])+(i.cpos[1]-r.cpos[1])*(i.cpos[1]-r.cpos[1])),a=e(r,i,s),c=Math.abs(i.cpos[0]-r.cpos[0]),u=Math.abs(i.cpos[1]-r.cpos[1]),l={act:"zooming",cpos:[(r.cpos[0]+i.cpos[0])/2,(r.cpos[1]+i.cpos[1])/2],len:s,angle:a,owidth:c,oheight:u,time:r.time};return l},t}(),c=function(){function t(){}return t.prototype.verify=function(t,e,n){var o=n.length>0&&("zoomstart"==n[0].act||"zooming"==n[0].act)&&t.length<=2;if(o){if(t.length<2)return!0;for(var r=0,i=t;r<i.length;r++){var s=i[r];if("touchend"==s.act)return!0}}return!1},t.prototype.recognize=function(t,e){var n={act:"zoomend",cpos:[0,0],len:0,angle:0,owidth:0,oheight:0,time:(new Date).getTime()};return n},t}();t.Patterns.zoomend=new c,t.Patterns.zooming=new a,t.Patterns.zoomstart=new s,t.Patterns.dragging=new o,t.Patterns.dropped=new r,t.Patterns.touched=new n,t.Patterns.dbltouched=new i}(fingers||(fingers={}));var fingers;!function(t){var e=function(){function e(e){this.inqueue=[],this.outqueue=[],this.patterns=[];var n=["zoomend","zoomstart","zooming","dbltouched","touched","dropped","dragging"];e||(e={patterns:n}),e.patterns||(e.patterns=n),this.cfg=e;for(var o=0,r=e.patterns;o<r.length;o++){var i=r[o];t.Patterns[i]&&this.patterns.add(t.Patterns[i])}}return e.prototype.parse=function(t){if(this.cfg.qlen||(this.cfg.qlen=12),this.inqueue.splice(0,0,t),this.inqueue.length>this.cfg.qlen&&this.inqueue.splice(this.inqueue.length-1,1),this.cfg.on&&this.cfg.on.tap)for(var e=0,n=t;e<n.length;e++){var o=n[e];if("touchstart"==o.act){this.cfg.on.tap(t[0]);break}}for(var r=0,i=this.patterns;r<i.length;r++){var s=i[r];if(s.verify(t,this.inqueue,this.outqueue)){var a=s.recognize(this.inqueue,this.outqueue);if(a){this.outqueue.splice(0,0,a),this.outqueue.length>this.cfg.qlen&&this.outqueue.splice(this.outqueue.length-1,1);var c=this.inqueue;this.inqueue=[],c.clear(),this.cfg.on&&this.cfg.on[a.act]&&this.cfg.on[a.act](a),this.cfg.onrecognized&&this.cfg.onrecognized(a);break}}}},e}();t.Recognizer=e}(fingers||(fingers={}));var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},fingers;!function(t){function e(t,e){return e?t.changedTouches:t.touches}function n(n){function c(t,e,n){return{act:t,cpos:[e,n],time:(new Date).getTime()}}function u(t,e){t&&t.enabled&&(t.onact&&t.onact(l.inqueue),l.parse(e))}var l=new t.Recognizer(n);return o||(document.oncontextmenu=function(){return!1},MobileDevice.any?(document.addEventListener("touchstart",function(t){for(var o=[],r=e(t),i=0;i<r.length;i++){var s=t.changedTouches[i],a=c("touchstart",s.clientX,s.clientY);o.add(a)}u(n,o),t.stopPropagation()},!0),document.addEventListener("touchmove",function(t){for(var o=[],r=e(t),i=0;i<r.length;i++){var s=t.changedTouches[i],a=c("touchmove",s.clientX,s.clientY);o.add(a)}u(n,o),t.stopPropagation(),Browser.isSafari&&t.preventDefault()},!0),document.addEventListener("touchend",function(t){for(var o=[],r=e(t,!0),i=0;i<r.length;i++){var s=t.changedTouches[i],a=c("touchend",s.clientX,s.clientY);o.add(a)}u(n,o),t.stopPropagation()},!0)):(s=new r,a=new i,document.addEventListener("mousedown",function(t){var e=c("touchstart",t.clientX,t.clientY);0==t.button?u(n,[e]):1==t.button?(a.start(e),u(n,[e,a.oppo])):2==t.button&&(s.start(e),u(n,[e,s.oppo]))},!0),document.addEventListener("mousemove",function(t){var e=c("touchmove",t.clientX,t.clientY);0==t.button?u(n,[e]):1==t.button?(a.start(e),u(n,[e,a.oppo])):2==t.button&&(s.start(e),u(n,[e,s.oppo]))},!0),document.addEventListener("mouseup",function(t){var e=c("touchend",t.clientX,t.clientY);0==t.button?u(n,[e]):1==t.button?(a.start(e),u(n,[e,a.oppo])):2==t.button&&(s.start(e),u(n,[e,s.oppo]))},!0)),o=!0),n}var o=!1,r=function(){function t(){}return t.prototype.create=function(t){var e=[document.documentElement.clientWidth/2,document.documentElement.clientHeight/2];this.oppo={act:t.act,cpos:[2*e[0]-t.cpos[0],2*e[1]-t.cpos[1]],time:t.time}},t.prototype.start=function(t){return this.create(t),[t,this.oppo]},t.prototype.zoom=function(t){return this.create(t),[t,this.oppo]},t.prototype.end=function(t){return this.create(t),[t,this.oppo]},t}(),i=function(t){function e(){t.apply(this,arguments)}return __extends(e,t),e.prototype.create=function(t){this.oppo={act:t.act,cpos:[t.cpos[0]+100,t.cpos[1]+100],time:t.time}},e}(r),s=null,a=null;t.touch=n}(fingers||(fingers={}));var touch=fingers.touch,__extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},fingers;!function(t){function e(t,e,o){var r=[0,0];return t.onmouseover=function(t){r=[t.offsetX,t.offsetY]},n(t,"mouseover",o),r}function n(t,e,n){function o(t,e){for(var n in e)t[n]=e[n];return t}var r={HTMLEvents:/^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,MouseEvents:/^(?:click|dblclick|mouse(?:down|up|over|move|out))$/},i={pointerX:100,pointerY:100,button:0,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,bubbles:!0,cancelable:!0};n&&(i.pointerX=n[0],i.pointerY=n[1]);var s,a=o(i,arguments[3]||{}),c=null;for(var u in r)if(r[u].test(e)){c=u;break}if(!c)throw new SyntaxError("Only HTMLEvents and MouseEvents interfaces are supported");if(document.createEvent)s=document.createEvent(c),"HTMLEvents"==c?s.initEvent(e,a.bubbles,a.cancelable):s.initMouseEvent(e,a.bubbles,a.cancelable,document.defaultView,a.button,a.pointerX,a.pointerY,a.pointerX,a.pointerY,a.ctrlKey,a.altKey,a.shiftKey,a.metaKey,a.button,t),t.dispatchEvent(s);else{a.clientX=a.pointerX,a.clientY=a.pointerY;var l=document.createEventObject();s=o(l,a),t.fireEvent("on"+e,s)}return t}var o=function(){function t(t){t.$zoomer$?t.$zoomer$[t.$zoomer$.length]=this:t.$zoomer$=[this]}return t}();t.Zoomer=o;var r=function(t){function e(e){t.call(this,e);var n=this;this.mapping={dragstart:function(t,e){n.sact=t,n.pact=t,n.started=!0},dragging:function(t,e){if(n.started){var o=n.pact,r=[t.cpos[0]-o.cpos[0],t.cpos[1]-o.cpos[1]],i={offset:r},s=e.astyle(["left"]),a=e.astyle(["top"]);e.style.left=parseInt(s)+i.offset[0]+"px",e.style.top=parseInt(a)+i.offset[1]+"px",n.pact=t}},dragend:function(t,e){n.started=!1}}}return __extends(e,t),e}(o);t.Drag=r,t.pointOnElement=e;var i=function(n){function o(o){n.call(this,o);var r=this;this.mapping={zoomstart:function(e,n){r.sact=e,r.pact=e,r.started=!0,r.rot=t.Rotator(n)},zooming:function(t,n){if(r.started){var o=r.sact,i=[t.cpos[0]-o.cpos[0],t.cpos[1]-o.cpos[1]],s=t.angle-o.angle,a=t.len/o.len,c=e(n,"mouseover",t.cpos);r.rot.rotate({pos:i,angle:s,center:c,scale:a}),r.pact=t}},zoomend:function(t,e){r.started=!1,r.rot.commitStatus()}}}return __extends(o,n),o}(o);t.Zoom=i;var s=function(t){function e(e){t.call(this,e);var n=this;this.mapping={zoomstart:function(t,e){n.sact=t,n.pact=t,n.started=!0},zooming:function(t,e){if(n.started){var o=n.pact,r=[t.cpos[0]-o.cpos[0],t.cpos[1]-o.cpos[1]],i=[t.owidth-o.owidth,t.oheight-o.oheight],s={offset:r,resize:i},a=e.astyle(["width"]),c=e.astyle(["height"]),u=e.astyle(["left"]),l=e.astyle(["top"]);e.style.width=parseInt(a)+s.resize[0]+"px",e.style.height=parseInt(c)+s.resize[1]+"px",e.style.left=parseInt(u)+s.offset[0]+"px",e.style.top=parseInt(l)+s.offset[1]+"px",n.pact=t}},zoomend:function(t,e){n.started=!1}}}return __extends(e,t),e}(o);t.Zsize=s}(fingers||(fingers={}));var fingers;!function(t){function e(t){for(var e=null,n=[];;){var o=document.elementFromPoint(t[0],t[1]);if(o==document.body||"html"==o.tagName.toLowerCase()||o==window){e=null;break}if(o.$evtrap$){e=null;break}if(o.$touchable$){e=o.getarget?o.getarget():o,e.$touchel$=o;break}o.style.display="none",n.add(o)}for(var r=0,i=n;r<i.length;r++){var s=i[r];s.style.display=""}return e}function n(n){return r||(r=t.touch({on:{tap:function(t){o=e(t.cpos)}},onact:function(t){},onrecognized:function(t){if(o&&o.$zoomer$)for(var e=o.$zoomer$,n=0,r=e;n<r.length;n++){var i=r[n];i.mapping[t.act]&&i.mapping[t.act](t,o)}}}),r.enabled=!0),n.$touchable$=!0,{zoomable:function(){new t.Zoom(n);return this},zsizable:function(){new t.Zsize(n);return this},draggable:function(){new t.Drag(n);return this}}}var o,r=null;t.finger=n}(fingers||(fingers={}));var finger=fingers.finger,fingers;!function(t){function e(t){var e=t.$rot$||new n(t);return e}var n=function(){function t(t){if(t){this.target=t,t.$rot$=this;var e=[t.astyle(["left"]),t.astyle(["top"])];t.style.left=e[0],t.style.top=e[1];var n=t.getBoundingClientRect();this.origin={center:[n.width/2,n.height/2],angle:0,scale:[1,1],pos:[parseFloat(e[0]),parseFloat(e[1])],size:[n.width,n.height]},this.cmt={center:[n.width/2,n.height/2],angle:0,scale:[1,1],pos:[parseFloat(e[0]),parseFloat(e[1])],size:[n.width,n.height]},this.cache={center:[n.width/2,n.height/2],angle:0,scale:[1,1],pos:[parseFloat(e[0]),parseFloat(e[1])],size:[n.width,n.height]},this.status=[],this.center=document.createElement("div"),this.center.style.position="absolute",this.center.style.left="50%",this.center.style.top="50%",this.center.style.width="0px",this.center.style.height="0px",this.center.style.border="solid 0px blue",t.appendChild(this.center),this.setOrigin(this.origin.center),t.style.transform="rotate(0deg)",this.pushStatus()}}return t.prototype.rotate=function(t,e){if(!t)return this;var n=this.cache,o=this.cmt,r=this.offset,i=t.angle,s=t.center,a=t.scale,c=t.pos,u=t.resize;if(r||(r=[0,0]),s!==e){this.pushStatus(),this.setOrigin(s);var l=this.pushStatus();r=this.correct(l,r)}if((i||0===i)&&(n.angle=o.angle+i,n.angle=n.angle%360),u&&(n.size=[o.size[0]+u[0],o.size[1]+u[1]],n.size[0]<10&&(n.size[0]=10),n.size[1]<10&&(n.size[1]=10)),a){if(!(a instanceof Array)){var p=parseFloat(a);a=[p,p]}n.scale=[o.scale[0]*a[0],o.scale[1]*a[1]]}return c&&(n.pos=[o.pos[0]+c[0]-r[0],o.pos[1]+c[1]-r[1]]),this.target.style.transform="rotateZ("+n.angle+"deg) scale("+n.scale[0]+","+n.scale[1]+")",this.target.style.left=n.pos[0]+"px",this.target.style.top=n.pos[1]+"px",u&&(this.target.style.width=n.size[0]+"px",this.target.style.height=n.size[1]+"px"),this.pushStatus(),this},t.prototype.getCenter=function(){var t=this.center.getBoundingClientRect();return[t.left,t.top]},t.prototype.setOrigin=function(t){this.target.style.transformOrigin=t[0]+"px "+t[1]+"px"},t.prototype.correct=function(t,e){e||(e=[0,0]);var n=t.delta,o=parseFloat(this.target.astyle.left)-n.center[0],r=parseFloat(this.target.astyle.top)-n.center[1];return this.offset=[e[0]+n.center[0],e[1]+n.center[1]],this.target.style.left=o+"px",this.target.style.top=r+"px",this.offset},t.prototype.commitStatus=function(){this.cmt=this.cache,this.cmt.pos=[parseFloat(this.target.style.left),parseFloat(this.target.style.top)],this.cmt.size=[parseFloat(this.target.style.width),parseFloat(this.target.style.height)],this.cache={angle:0,scale:[1,1],pos:[0,0],size:[0,0]},this.offset=[0,0]},t.prototype.pushStatus=function(){var t=this.getCenter(),e=[parseFloat(this.target.astyle(["left"])),parseFloat(this.target.astyle(["top"]))],n={center:[t[0],t[1]],pos:e},o=this.status,r=o.length>0?o[o.length-1]:n;return n.delta={center:[n.center[0]-r.center[0],n.center[1]-r.center[1]],pos:[n.pos[0]-r.pos[0],n.pos[1]-r.pos[1]]},o[o.length]=n,o.length>6&&o.splice(0,1),n},t}();t.Rotator=e}(fingers||(fingers={})),String.prototype.startsWith=function(t){return 0==this.indexOf(t)},String.prototype.format=function(){var t=arguments,e=this;if(!t||t.length<1)return e;for(var n=e,o=0;o<t.length;o++){var r=new RegExp("\\{"+o+"\\}");n=n.replace(r,t[o])}return n};var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)};Object.prototype.read=function(t,e,n){return read(this,t,e,n)},Object.prototype.write=function(t,e){read(this,t,!0,function(t,n,o){t[n]=e})},Element.prototype.set=function(t,e,n){function o(t,e,n){wo.usable(e)&&(e=wo.use(e)),"prepend"==n?t.insertBefore(e,t.childNodes[0]):t.appendChild(e)}function r(t,e,i){if(t){if(e===n)return t.innerHTML="",!0;if(e instanceof Array)for(var s=0,a=e;s<a.length;s++){var c=a[s];r(t,c)}else if("object"==typeof e)if(e.target){(!e.mode||"prepend"==e.mode&&t.childNodes.length<1)&&(e.mode="append"),"replace"==e.mode&&(t.innerHTML="",e.mode="append");var u=e.target;if(u.length)for(var l=0,p=u;l<p.length;l++){var f=p[l];o(t,f,e.mode)}else o(t,u,e.mode)}else o(t,e,"append");else i?t.innerHTML=e:$(t).text(e)}return!1}if(t!==n){wo.usable(t)&&r(this,t,e);for(var i in t){var s=t[i],a=this["$"+i];r(a,s,e)}}},Element.prototype.get=function(t,e){var n=this;if(!t||t.length<1)return this.innerHTML;for(var o=0,r=t;o<r.length;o++){var i=r[o];if("="==i)return n;if(n="$"==i?n.childNodes:"function"==typeof i?i(n):n[i],!n)return null}return n.getval?n.getval():n.value?n.value:n.innerHTML};var wo;!function(t){function e(t){var e=[];if(t)try{e=document.querySelectorAll(t)}catch(t){console.log(t)}return e}function n(t,e){t.append&&"function"==typeof t.append?t.append(e):t.appendChild(e)}function o(e){for(var n=0,o=t.Creators;n<o.length;n++){var r=o[n];if(e[r.Id])return!0}return!1}function r(n,o){var r=null;if(!n||n instanceof Element)return r;var i=null;n.$container$&&(i=n.$container$,delete n.$container$),"string"==typeof n&&(r=e(n));for(var s=0,a=t.Creators;s<a.length;s++){var c=a[s];if(n[c.Id]){r=c.Create(n,o);break}}return i&&i.appendChild(r),r}t.Creators=[];var i=function(){function t(){}return t}();t.Cursor=i;var s=function(){function e(){}return Object.defineProperty(e.prototype,"Id",{get:function(){return this.id},enumerable:!0,configurable:!0}),e.prototype.Create=function(t,e){if(!t)return null;var n=this.create(t);if(e){var o=new i;o.root=e.root,o.parent=e.curt,o.border=e.border,o.curt=n,n.cursor=o,e=o}else e=new i,e.root=n,e.parent=null,e.border=n,e.curt=n,n.cursor=e;if(t.alias){var r=t.alias;t.alias.startsWith("$")&&(r=t.alias.substr(1,t.alias.length-1)),e.border["$"+r]=n,t.alias.startsWith("$")&&(e.border=n)}return delete t[this.Id],this.extend(n,t),t.made&&t.made.call(n),n.$root=e.root,n.$border=e.border,n},e.prototype.applyattr=function(e,n,o,r){var i=e[o];if(i){var s=typeof i;if("object"==s){var a=typeof n[o];"object"==a?t.jextend.call(this,i,n[o],this):e[o]=n[o]}else e[o]=n[o]}else e[o]=n[o]},e.prototype.applychild=function(t,e,o,i){var s=typeof e[o];if(e[o]instanceof Array)for(var a=0,c=e[o];a<c.length;a++){var u=c[a],l=r(u,i);null!=l&&n(t,l)}else if("object"==s){var l=r(e[o],i);null!=l&&n(t,l)}else t.innerHTML=e[o]},e.prototype.applyprop=function(e,n,o,r){var i=typeof n[o];"function"==i?e[o]=n[o]:e[o]&&"object"==typeof e[o]&&"object"==i?t.objextend(e[o],n[o]):"object"==i?e[o]=n[o]:this.setattr(e,n,o)},e.prototype.setattr=function(t,e,n){t.setAttribute(n,e[n])},e}();t.Creator=s;var a=function(t){function e(){t.apply(this,arguments)}return __extends(e,t),e.prototype.create=function(t){if(null==t)return null;for(var e=null,n=t[this.id],o=n.split("."),i=this.getrepo(),s=i,a=0,c=o;a<c.length;a++){var u=c[a];if(!s[u])return console.log("Cannot find "+n+" from repo: ",i),null;s=s[u]}if(e=s,!e)return null;var l=r(e());return l},e}(s);t.RepoCreator=a,t.append=n,t.usable=o,t.use=r}(wo||(wo={}));var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},wo;!function(t){var e=function(e){function n(){e.call(this),this.id="tag"}return __extends(n,e),n.prototype.create=function(t){if(null==t)return null;var e,n=t[this.id];return e="#text"==n?document.createTextNode(n):document.createElement(n)},n.prototype.verify=function(e,n){return e.startsWith("$$")?this.applyattr:"$"==e?this.applychild:e.startsWith("$")?t.objextend:this.applyprop},n.prototype.extend=function(e,n){n instanceof Node||n instanceof Element||(e instanceof HTMLElement?t.jextend.call(this,e,n,this):n.$&&e instanceof Node?e.nodeValue=n.$:e.extend&&e.extend(n))},n}(t.Creator);t.DomCreator=e}(wo||(wo={}));var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},wo;!function(t){var e=function(e){function n(){e.call(this),this.id="sg"}return __extends(n,e),n.prototype.verify=function(e,n){return e.startsWith("$$")?this.applyattr:"$"==e?this.applychild:e.startsWith("$")?t.objextend:this.applyprop},n.prototype.create=function(t){if(null==t)return null;var e,n=t[this.id],o="http://www.w3.org/2000/svg";return e="svg"==n?document.createElementNS(o,n):document.createElementNS(o,n)},n.prototype.extend=function(e,n){n instanceof Node||n instanceof Element||(e instanceof SVGElement?t.jextend.call(this,e,n,this):n.$&&e instanceof Node?e.nodeValue=n.$:e.extend&&e.extend(n))},n.prototype.setattr=function(t,e,n){return t instanceof SVGElement?t.setAttributeNS(null,n,e[n]):(console.dir(t),t.setAttribute(n,e[n]))},n}(t.Creator);t.SvgCreator=e}(wo||(wo={}));var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},wo;!function(t){function e(e){if(!e||!e.ui)return!1;for(var n in t.Widgets)if(n==e.ui)return!0;return!1}t.Widgets={};var n=function(e){function n(){e.call(this),this.id="ui"}return __extends(n,e),n.prototype.getrepo=function(){return t.Widgets},n.prototype.verify=function(e,n){return e.startsWith("$$")?this.applyattr:"$"==e?this.applychild:"style"==e?t.objextend:this.applyprop},n.prototype.extend=function(e,n){n instanceof Node||n instanceof Element||(e instanceof HTMLElement?t.jextend.call(this,e,n,this):n.$&&e instanceof Node?e.nodeValue=n.$:e.extend&&e.extend(n))},n.prototype.applychild=function(e,n,o,r){var i=typeof n[o],s=n[o];if("object"!=i||s instanceof Array||(s=[s]),s instanceof Array)for(var a=e.childNodes,c=0;c<s.length;c++){var u=s[c];if(t.iswidget(u))if(e.use)e.use(u,r);else{var l=t.use(u,r);null!=l&&t.append(e,l)}else if(c<a.length)t.jextend.call(this,a[c],u,this);else if(e.use)e.use(u,r);else{var l=t.use(u,r);null!=l&&t.append(e,l)}}else e.innerHTML=n[o]},n}(t.RepoCreator);t.UiCreator=n,t.iswidget=e}(wo||(wo={})),wo.Creators.add(new wo.DomCreator),wo.Creators.add(new wo.SvgCreator),wo.Creators.add(new wo.UiCreator);var MobileDevice=function(){function t(){}return Object.defineProperty(t,"Android",{get:function(){var t=navigator.userAgent.match(/Android/i);return t&&console.log("match Android"),null!=t&&t.length>0},enumerable:!0,configurable:!0}),Object.defineProperty(t,"BlackBerry",{get:function(){var t=navigator.userAgent.match(/BlackBerry/i);return t&&console.log("match Android"),null!=t&&t.length>0},enumerable:!0,configurable:!0}),Object.defineProperty(t,"iOS",{get:function(){var t=navigator.userAgent.match(/iPhone|iPad|iPod/i);return t&&console.log("match Android"),null!=t&&t.length>0},enumerable:!0,configurable:!0}),Object.defineProperty(t,"Opera",{get:function(){var t=navigator.userAgent.match(/Opera Mini/i);return t&&console.log("match Android"),null!=t&&t.length>0},enumerable:!0,configurable:!0}),Object.defineProperty(t,"Windows",{get:function(){var t=navigator.userAgent.match(/IEMobile/i);return t&&console.log("match Android"),null!=t&&t.length>0},enumerable:!0,configurable:!0}),Object.defineProperty(t,"any",{get:function(){return t.Android||t.BlackBerry||t.iOS||t.Opera||t.Windows},enumerable:!0,configurable:!0}),t}(),Browser=function(){function t(){}return Object.defineProperty(t,"isOpera",{get:function(){return!!window.opr&&!!window.opr.addons||!!window.opera||navigator.userAgent.indexOf(" OPR/")>=0},enumerable:!0,configurable:!0}),Object.defineProperty(t,"isFirefox",{get:function(){return"undefined"!=typeof window.InstallTrigger},enumerable:!0,configurable:!0}),Object.defineProperty(t,"isSafari",{get:function(){return Object.prototype.toString.call(HTMLElement).indexOf("Constructor")>0},enumerable:!0,configurable:!0}),Object.defineProperty(t,"isIE",{get:function(){return!!document.documentMode},enumerable:!0,configurable:!0}),Object.defineProperty(t,"isEdge",{get:function(){return!t.isIE&&!!window.StyleMedia},enumerable:!0,configurable:!0}),Object.defineProperty(t,"isChrome",{get:function(){return!!window.chrome&&!!window.chrome.webstore},enumerable:!0,configurable:!0}),Object.defineProperty(t,"isBlink",{get:function(){return(t.isChrome||t.isOpera)&&!!window.CSS},enumerable:!0,configurable:!0}),t}();Element.prototype.astyle=function(t){for(var e=this,n=window.getComputedStyle(e,null),o=0;o<t.length;o++){var r=n.getPropertyValue(t[o]);if(null!=r)return r}return null},Element.prototype.visible=function(){return"none"!=this.style.display&&"hidden"!=this.style.visibility};var wo;!function(t){function e(t){if(t.length>0||t instanceof Array)for(var e=0,n=t;e<n.length;e++){var r=n[e];o.destroy(r)}else t instanceof Element&&o.destroy(t)}function n(t){var e=t.getBoundingClientRect();t.style.position="fixed",t.style.left="50%",t.style.top="50%",t.style.marginTop=-e.height/2+"px",t.style.marginLeft=-e.width/2+"px"}var o=function(){function t(){}return t.destroy=function(e){if(e.destroyStatus||(e.destroyStatus=new t),e.dispose&&!e.destroyStatus.disposing&&(e.destroyStatus.disposing=!0,e.dispose()),!e.destroyStatus.destroying){e.destroyStatus.destroying=!0,t.container.appendChild(e);for(var n in e)if(0==n.indexOf("$")){var o=e[n];o instanceof HTMLElement?(e[n]=null,o=null):delete e[n]}t.container.innerHTML=""}},t.container=document.createElement("div"),t}();t.destroy=e,t.centerScreen=n}(wo||(wo={}));var wo;!function(t){var e=function(){function t(){this.val=null,this.undo=[],this.origin=null,this.fwd=[]}return t.prototype.watch=function(t,e,n,o){var r=this;return o&&(t[e]=this.val),r.origin||(r.origin=t,this.val=t[e]),Object.defineProperty(t,e,{get:function(){return r.val},set:function(t){var o=r.val;r.val=t,n&&n(t,o),o!=t&&r.origin.onchange&&r.origin.onchange(t,o,e);for(var i=0,s=r.fwd;i<s.length;i++){var a=s[i];a()}},configurable:!0,enumerable:!0}),r.undo.add(function(){Object.defineProperty(t,e,{get:function(){return t["_"+e]},set:function(n){t["_"+e]=n},configurable:!0,enumerable:!0})}),this},t.prototype.forward=function(t,e,n){var o=this;n?o.fwd.add(function(){t.setAttribute(e,o.val)}):o.fwd.add(function(){t[e]=o.val})},t.prototype.cancel=function(){for(var t=0,e=this.undo;t<e.length;t++){var n=e[t];n()}this.undo.clear(),this.fwd.clear()},t.prototype.observe=function(t,e,n){var o=this;o.origin||(o.origin=t,o.val=t.getAttribute(e));var r=new MutationObserver(function(r){r.forEach(function(r){r.attributeName==e&&(o.val=t.getAttribute(r.attributeName),n&&n(o.val,r.oldValue,e))})});return r.observe(t,{attributes:!0,childList:!1,characterData:!1,attributeOldValue:!0,attributeFilter:[e]}),o.undo.add(function(){r.disconnect()}),this},t}();t.monitor=e}(wo||(wo={}));var wo;!function(t){var e=function(){function e(t){this.name=t}return e.prototype.use=function(e,n){var o=t.use(e,n);return o.$ctx=this,o},e.new=function(t,n){var o=e.ctxes[t]||new e(t);e.ctxes[t]||(e.ctxes[t]=o),n(o)},e.ctxes={},e}();t.WidgetContext=e}(wo||(wo={}));var WidgetContext=wo.WidgetContext,wo;!function(t){function e(t,n){for(var o in n)"object"==typeof n[o]&&t[o]&&"object"==typeof t[o]?e(t[o],n[o]):t[o]=n[o]}t.objextend=e}(wo||(wo={}));var wo;!function(t){function e(e,n,o){var r=e.cursor;for(var i in n){var s=o.verify(i,n);s||(s=t.objextend),s.call(this,e,n,i,r)}}t.jextend=e}(wo||(wo={}));var wo;!function(t){t.Widgets.card=function(){return{tag:"div",class:"card",use:function(e){var n=t.use(e);this.$body&&this.$body.appendChild(n)},$:[{tag:"div",class:"title noselect",$:[{tag:"div",class:"txt",alias:"title"},{tag:"div",class:"ctrls",$:[{tag:"div",class:"wbtn",onclick:function(e){t.destroy(this.$border)},$:"X"}]}]},{tag:"div",class:"body",alias:"body"}]}}}(wo||(wo={}));var wo;!function(t){function e(e){var n=t.use({ui:"cover",$$touchclose:!0,$:e});n.show(function(e){t.centerScreen(e.$box||e.$child)}),n.onhide=e.onhide}t.Widgets.cover=function(){return{tag:"div",class:"cover",style:{display:"none"},show:function(t){this.style.display="",this.$child&&(this.$child.style.display=""),t&&t(this)},hide:function(){this.$child&&(t.destroy(this.$child),delete this.$child),this.style.display="none",this.onhide&&this.onhide()},made:function(){var e=document.body.$gcv$;e&&t.destroy(e),document.body.appendChild(this),document.body.$gcv$=this},onclick:function(t){this.$$touchclose&&this.hide()},append:function(t){this.$child=t,document.body.appendChild(t)}}},t.cover=e}(wo||(wo={}));var wo;!function(t){function e(t,e,n){n||(n=2);var o=t.getBoundingClientRect();2==n&&(e.style.left=o.left+"px",e.style.top=o.bottom-1+"px",e.style.width=o.width+"px")}t.Widgets.dropdown=function(){function e(t,e){t.value=e}var n;return{tag:"div",class:"dropdown",watcher:function(){return n},bind:function(t){if(t){var e=this.$menu;e.bind(t)}},onclick:function(){this.$menu.attach(this),this.$menu.visible()?this.$menu.hide():this.$menu.show()},selectAt:function(t){this.$menu.selectAt(t),this.$menu.hide()},select:function(t){this.$menu.select(t),this.$menu.hide()},model:function(t){var e=this;e.$model=t,e.$ctx.read(t,!0,function(t,o,r){n.watch(t,o,function(t){e.select(t)})})},made:function(){var o=this.getAttribute("menu-template");o||(o="simplemenu");var r=t.use({ui:o}),i=this;i.$menu=r,n=(new t.monitor).watch(this,"value"),r.onselect=function(t,n){if(t!==n){var o=t.get();i.set({box:o}),this.hide(),e(i,o)}else i.set({box:"&nbsp;"},!0),e(i)}},dispose:function(){n.cancel()},$:[{tag:"div",class:"area",$:[{tag:"div",class:"box",alias:"box",$:"&nbsp;"},{tag:"div",class:"toggle",alias:"toggle",$:{sg:"svg",class:"icon-dropdown-toggle",$:{sg:"use",href:{baseVal:"svg-symbols.svg#icon-dropdown-toggle"}}}}]}]}},t.Widgets.simplemenu=function(){return{tag:"div",class:"simple-menu",bind:function(e){if(e){for(var n=this,o=this.getAttribute("item-template"),r=[],i=0,s=e;i<s.length;i++){var a=s[i],c=t.use({ui:o||"simpleitem"});c&&(c.bind(a),c.onclick=function(){n.onselect&&n.onselect(this)},r.add(c))}this.$items=r,this.set({body:{target:r}})}},selectAt:function(t){if(this.onselect){if(t>=0&&t<this.$items.length){var e=this.$items[t];return void this.onselect(e)}this.onselect()}},select:function(t){if(this.onselect){for(var e=0,n=this.$items;e<n.length;e++){var o=n[e];if(o.getval()==t)return void this.onselect(o)}this.onselect()}},attach:function(t,n){e(t,this,n)},show:function(){$(this).show()},hide:function(){$(this).hide()},made:function(){document.body.appendChild(this),$(this).hide()},$:[{tag:"div",class:"body",alias:"body"}]}},t.Widgets.simpleitem=function(){return{tag:"div",class:"simple-item",getval:function(){return this.innerHTML},bind:function(t){$(this).text(t)}}}}(wo||(wo={}));var wo;!function(t){function e(t,e,n,o){var r=o*Math.PI/180,i=t+n*Math.cos(r),s=e+n*Math.sin(r);return[i,s]}t.Widgets.loading=function(){return{tag:"div",class:"loading",made:function(){var e=t.use({sg:"circle",class:"rd"});e.setAttributeNS(null,"cx",32),e.setAttributeNS(null,"cy",32),e.setAttributeNS(null,"r",16),this.$sbox.appendChild(e);var n=t.use({ui:"arc"});n.setAttributeNS(null,"class","arc p1"),n.update([16,48],16,270),this.$sbox.appendChild(n);var o=t.use({ui:"arc"});o.setAttributeNS(null,"class","arc p1"),o.update([16,48],16,270),this.$sbox.appendChild(o),n.style.transformOrigin="32px 32px",o.style.transformOrigin="50% 50%";var r=2e3,i=1400;$(n).velocity({rotateZ:"-=360deg"},{duration:r,easing:"linear"}),this.$handle1=window.setInterval(function(){$(n).velocity({rotateZ:"-=360deg"},{duration:r,easing:"linear"})},r),$(o).velocity({rotateZ:"+=360deg"},{duration:i,easing:"linear",loop:!0})},$:{sg:"svg",alias:"sbox",style:{width:64,height:64}}}},t.Widgets.arc=function(){return{sg:"path",update:function(t,n,o){var r=e(t[0],t[1],n,o),i=[t[0]+n,t[1]],s=["M"+i[0],i[1],"A"+n,n,"0 1 0",r[0],r[1]];this.setAttributeNS(null,"d",s.join(" "))}}}}(wo||(wo={}));