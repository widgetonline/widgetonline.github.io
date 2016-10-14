/// <reference path="../../foundation/src/script/definitions.ts" />
var fingers;
(function (fingers) {
    var MobileDevice = (function () {
        function MobileDevice() {
        }
        Object.defineProperty(MobileDevice, "Android", {
            get: function () {
                var r = navigator.userAgent.match(/Android/i);
                if (r) {
                    console.log('match Android');
                }
                return r != null && r.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MobileDevice, "BlackBerry", {
            get: function () {
                var r = navigator.userAgent.match(/BlackBerry/i);
                if (r) {
                    console.log('match Android');
                }
                return r != null && r.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MobileDevice, "iOS", {
            get: function () {
                var r = navigator.userAgent.match(/iPhone|iPad|iPod/i);
                if (r) {
                    console.log('match Android');
                }
                return r != null && r.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MobileDevice, "Opera", {
            get: function () {
                var r = navigator.userAgent.match(/Opera Mini/i);
                if (r) {
                    console.log('match Android');
                }
                return r != null && r.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MobileDevice, "Windows", {
            get: function () {
                var r = navigator.userAgent.match(/IEMobile/i);
                if (r) {
                    console.log('match Android');
                }
                return r != null && r.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MobileDevice, "any", {
            get: function () {
                return (MobileDevice.Android || MobileDevice.BlackBerry || MobileDevice.iOS || MobileDevice.Opera || MobileDevice.Windows);
            },
            enumerable: true,
            configurable: true
        });
        return MobileDevice;
    }());
    fingers.MobileDevice = MobileDevice;
    var Browser = (function () {
        function Browser() {
        }
        Object.defineProperty(Browser, "isOpera", {
            // Opera 8.0+
            get: function () {
                return (!!window.opr && !!window.opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isFirefox", {
            // Firefox 1.0+
            get: function () {
                return typeof window.InstallTrigger !== 'undefined';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isSafari", {
            // At least Safari 3+: "[object HTMLElementConstructor]"
            get: function () {
                return Object.prototype.toString.call(HTMLElement).indexOf('Constructor') > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isIE", {
            // Internet Explorer 6-11
            get: function () {
                return false || !!document.documentMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isEdge", {
            // Edge 20+
            get: function () {
                return !Browser.isIE && !!window.StyleMedia;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isChrome", {
            // Chrome 1+
            get: function () {
                return !!window.chrome && !!window.chrome.webstore;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isBlink", {
            // Blink engine detection
            get: function () {
                return (Browser.isChrome || Browser.isOpera) && !!window.CSS;
            },
            enumerable: true,
            configurable: true
        });
        return Browser;
    }());
    fingers.Browser = Browser;
})(fingers || (fingers = {}));

var fingers;
(function (fingers) {
    fingers.Patterns = {};
    var TouchedPattern = (function () {
        function TouchedPattern() {
        }
        TouchedPattern.prototype.verify = function (acts, queue, outq) {
            var rlt = acts.length == 1 && acts[0].act == "touchend" && queue.length > 0;
            return rlt;
        };
        TouchedPattern.prototype.recognize = function (queue, outq) {
            var prev = queue[1];
            //debugger;
            if (prev && prev.length == 1) {
                var act = prev[0];
                var drag = false;
                if (outq != null && outq.length > 0) {
                    var pact = outq[0];
                    if (pact && (pact.act == "dragging" || pact.act == "dragstart")) {
                        drag = true;
                    }
                }
                if (!drag) {
                    for (var i = 0; i < 3; i++) {
                        var q = queue[i];
                        if (q[0].act == "touchstart") {
                            return {
                                act: "touched",
                                cpos: [act.cpos[0], act.cpos[1]],
                                time: act.time
                            };
                        }
                    }
                }
            }
            return null;
        };
        return TouchedPattern;
    }());
    var DraggingPattern = (function () {
        function DraggingPattern() {
        }
        DraggingPattern.prototype.verify = function (acts, queue) {
            var rlt = acts.length == 1
                && acts[0].act == "touchmove"
                && queue.length > 2;
            if (rlt) {
                rlt = false;
                var s1 = queue[2];
                var s2 = queue[1];
                if (s1.length == 1 && s2.length == 1) {
                    var a1 = s1[0];
                    var a2 = s2[0];
                    if (a1.act == "touchstart") {
                    }
                    if (a1.act == "touchstart" && a2.act == "touchmove") {
                        rlt = true;
                    }
                    else if (a1.act == "touchmove" && a2.act == "touchmove") {
                        rlt = true;
                    }
                }
            }
            return rlt;
        };
        DraggingPattern.prototype.recognize = function (queue, outq) {
            var prev = queue[2];
            if (prev.length == 1) {
                var act = prev[0];
                if (act.act == "touchstart") {
                    return {
                        act: "dragstart",
                        cpos: [act.cpos[0], act.cpos[1]],
                        time: act.time
                    };
                }
                else if (act.act == "touchmove" && outq.length > 0) {
                    var ract = outq[0];
                    if (ract.act == "dragstart" || ract.act == "dragging") {
                        return {
                            act: "dragging",
                            cpos: [act.cpos[0], act.cpos[1]],
                            time: act.time
                        };
                    }
                }
            }
            return null;
        };
        return DraggingPattern;
    }());
    var DropPattern = (function () {
        function DropPattern() {
        }
        DropPattern.prototype.verify = function (acts, queue, outq) {
            var rlt = acts.length == 1 && acts[0].act == "touchend" && queue.length > 0 && outq.length > 0;
            return rlt;
        };
        DropPattern.prototype.recognize = function (queue, outq) {
            //let prev = queue[1];
            var act = outq[0];
            if (act.act == "dragging" || act.act == "dragstart") {
                return {
                    act: "dropped",
                    cpos: [act.cpos[0], act.cpos[1]],
                    time: act.time
                };
            }
            return null;
        };
        return DropPattern;
    }());
    var DblTouchedPattern = (function () {
        function DblTouchedPattern() {
        }
        DblTouchedPattern.prototype.verify = function (acts, queue) {
            var rlt = acts.length == 1 && acts[0].act == "touchend" && queue.length > 0;
            return rlt;
        };
        DblTouchedPattern.prototype.recognize = function (queue, outq) {
            var prev = queue[1];
            if (prev && prev.length == 1) {
                var act = prev[0];
                if (outq != null && outq.length > 0) {
                    var pact = outq[0];
                    if (pact && pact.act == "touched") {
                        if (act.act == "touchstart" || act.act == "touchmove") {
                            if (act.time - pact.time < 500) {
                                return {
                                    act: "dbltouched",
                                    cpos: [act.cpos[0], act.cpos[1]],
                                    time: act.time
                                };
                            }
                            else {
                                return {
                                    act: "touched",
                                    cpos: [act.cpos[0], act.cpos[1]],
                                    time: act.time
                                };
                            }
                        }
                    }
                }
            }
            return null;
        };
        return DblTouchedPattern;
    }());
    function calcAngle(a, b, len) {
        var ag = Math.acos((b.cpos[0] - a.cpos[0]) / len) / Math.PI * 180;
        if (b.cpos[1] < a.cpos[1]) {
            ag *= -1;
        }
        return ag;
    }
    var ZoomStartPattern = (function () {
        function ZoomStartPattern() {
        }
        ZoomStartPattern.prototype.verify = function (acts, queue, outq) {
            var rlt = acts.length == 2
                && ((acts[0].act == "touchstart" || acts[1].act == "touchstart")
                    || (outq.length > 0
                        && acts[0].act == "touchmove"
                        && acts[1].act == "touchmove"
                        && outq[0].act != "zooming"
                        && outq[0].act != "zoomstart"));
            return rlt;
        };
        ZoomStartPattern.prototype.recognize = function (queue, outq) {
            var acts = queue[0];
            var a = acts[0];
            var b = acts[1];
            var len = Math.sqrt((b.cpos[0] - a.cpos[0]) * (b.cpos[0] - a.cpos[0]) + (b.cpos[1] - a.cpos[1]) * (b.cpos[1] - a.cpos[1]));
            var owidth = Math.abs(b.cpos[0] - a.cpos[0]);
            var oheight = Math.abs(b.cpos[1] - a.cpos[1]);
            var ag = calcAngle(a, b, len); //Math.acos((b.cpos[0] - a.cpos[0])/len) / Math.PI * 180;
            var r = {
                act: "zoomstart",
                cpos: [(a.cpos[0] + b.cpos[0]) / 2, (a.cpos[1] + b.cpos[1]) / 2],
                len: len,
                angle: ag,
                owidth: owidth,
                oheight: oheight,
                time: a.time
            };
            return r;
        };
        return ZoomStartPattern;
    }());
    var ZoomPattern = (function () {
        function ZoomPattern() {
        }
        ZoomPattern.prototype.verify = function (acts, queue, outq) {
            var rlt = acts.length == 2
                && (acts[0].act != "touchend" && acts[1].act != "touchend")
                && (acts[0].act == "touchmove" || acts[1].act == "touchmove")
                && outq.length > 0
                && (outq[0].act == "zoomstart" || outq[0].act == "zooming");
            return rlt;
        };
        ZoomPattern.prototype.recognize = function (queue, outq) {
            var acts = queue[0];
            var a = acts[0];
            var b = acts[1];
            var len = Math.sqrt((b.cpos[0] - a.cpos[0]) * (b.cpos[0] - a.cpos[0]) + (b.cpos[1] - a.cpos[1]) * (b.cpos[1] - a.cpos[1]));
            var ag = calcAngle(a, b, len); //Math.acos((b.cpos[0] - a.cpos[0])/len) / Math.PI * 180;
            var owidth = Math.abs(b.cpos[0] - a.cpos[0]);
            var oheight = Math.abs(b.cpos[1] - a.cpos[1]);
            var r = {
                act: "zooming",
                cpos: [(a.cpos[0] + b.cpos[0]) / 2, (a.cpos[1] + b.cpos[1]) / 2],
                len: len,
                angle: ag,
                owidth: owidth,
                oheight: oheight,
                time: a.time
            };
            return r;
        };
        return ZoomPattern;
    }());
    var ZoomEndPattern = (function () {
        function ZoomEndPattern() {
        }
        ZoomEndPattern.prototype.verify = function (acts, queue, outq) {
            var rlt = outq.length > 0
                && (outq[0].act == "zoomstart" || outq[0].act == "zooming")
                && acts.length <= 2;
            if (rlt) {
                //console.dir(acts);
                if (acts.length < 2) {
                    return true;
                }
                else {
                    for (var _i = 0, acts_1 = acts; _i < acts_1.length; _i++) {
                        var i = acts_1[_i];
                        if (i.act == "touchend") {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        ZoomEndPattern.prototype.recognize = function (queue, outq) {
            var r = {
                act: "zoomend",
                cpos: [0, 0],
                len: 0,
                angle: 0,
                owidth: 0,
                oheight: 0,
                time: new Date().getTime()
            };
            return r;
        };
        return ZoomEndPattern;
    }());
    fingers.Patterns.zoomend = new ZoomEndPattern();
    fingers.Patterns.zooming = new ZoomPattern();
    fingers.Patterns.zoomstart = new ZoomStartPattern();
    fingers.Patterns.dragging = new DraggingPattern();
    fingers.Patterns.dropped = new DropPattern();
    fingers.Patterns.touched = new TouchedPattern();
    fingers.Patterns.dbltouched = new DblTouchedPattern();
})(fingers || (fingers = {}));

/// <reference path="../../foundation/src/script/definitions.ts" />
/// <reference path="./patterns.ts" />
var fingers;
(function (fingers) {
    var Recognizer = (function () {
        function Recognizer(cfg) {
            this.inqueue = [];
            this.outqueue = [];
            this.patterns = [];
            var defpatterns = ["zoomend", "zoomstart", "zooming", "dbltouched", "touched", "dropped", "dragging"];
            if (!cfg) {
                cfg = { patterns: defpatterns };
            }
            if (!cfg.patterns) {
                cfg.patterns = defpatterns;
            }
            this.cfg = cfg;
            for (var _i = 0, _a = cfg.patterns; _i < _a.length; _i++) {
                var i = _a[_i];
                if (fingers.Patterns[i]) {
                    this.patterns.add(fingers.Patterns[i]);
                }
            }
        }
        Recognizer.prototype.parse = function (acts) {
            if (!this.cfg.qlen) {
                this.cfg.qlen = 12;
            }
            this.inqueue.splice(0, 0, acts);
            if (this.inqueue.length > this.cfg.qlen) {
                this.inqueue.splice(this.inqueue.length - 1, 1);
            }
            if (this.cfg.on && this.cfg.on.tap) {
                for (var _i = 0, acts_1 = acts; _i < acts_1.length; _i++) {
                    var i = acts_1[_i];
                    //acts.length >= 1 && acts[0].act == "touchstart" &&
                    if (i.act == "touchstart") {
                        this.cfg.on.tap(acts[0]);
                        break;
                    }
                }
            }
            for (var _a = 0, _b = this.patterns; _a < _b.length; _a++) {
                var pattern = _b[_a];
                if (pattern.verify(acts, this.inqueue, this.outqueue)) {
                    var rlt = pattern.recognize(this.inqueue, this.outqueue);
                    if (rlt) {
                        this.outqueue.splice(0, 0, rlt);
                        if (this.outqueue.length > this.cfg.qlen) {
                            this.outqueue.splice(this.outqueue.length - 1, 1);
                        }
                        var q = this.inqueue;
                        this.inqueue = [];
                        q.clear();
                        if (this.cfg.on && this.cfg.on[rlt.act]) {
                            this.cfg.on[rlt.act](rlt);
                        }
                        if (this.cfg.onrecognized) {
                            this.cfg.onrecognized(rlt);
                        }
                        break;
                    }
                }
            }
        };
        return Recognizer;
    }());
    fingers.Recognizer = Recognizer;
})(fingers || (fingers = {}));

/// <reference path="recognizer.ts" />
/// <reference path="device.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fingers;
(function (fingers) {
    var inited = false;
    var zoomsim = (function () {
        function zoomsim() {
        }
        zoomsim.prototype.create = function (act) {
            var m = [document.documentElement.clientWidth / 2, document.documentElement.clientHeight / 2];
            this.oppo = { act: act.act, cpos: [2 * m[0] - act.cpos[0], 2 * m[1] - act.cpos[1]], time: act.time };
            //console.log(act.cpos[1], m[1], this.oppo.cpos[1]);
        };
        zoomsim.prototype.start = function (act) {
            this.create(act);
            return [act, this.oppo];
        };
        zoomsim.prototype.zoom = function (act) {
            this.create(act);
            return [act, this.oppo];
        };
        zoomsim.prototype.end = function (act) {
            this.create(act);
            return [act, this.oppo];
        };
        return zoomsim;
    }());
    var offsetsim = (function (_super) {
        __extends(offsetsim, _super);
        function offsetsim() {
            _super.apply(this, arguments);
        }
        offsetsim.prototype.create = function (act) {
            this.oppo = { act: act.act, cpos: [act.cpos[0] + 100, act.cpos[1] + 100], time: act.time };
        };
        return offsetsim;
    }(zoomsim));
    var zs = null;
    var os = null;
    function getouches(event, isend) {
        if (isend) {
            return event.changedTouches;
        }
        else {
            return event.touches;
        }
    }
    function touch(cfg) {
        var rg = new fingers.Recognizer(cfg);
        var shiftdown = false;
        var ctrldown = false;
        function createAct(name, x, y) {
            return { act: name, cpos: [x, y], time: new Date().getTime() };
        }
        function handle(cfg, acts) {
            if (!cfg || !cfg.enabled) {
                return;
            }
            if (cfg.onact) {
                cfg.onact(rg.inqueue);
            }
            rg.parse(acts);
        }
        if (!inited) {
            document.oncontextmenu = function () {
                return false;
            };
            if (!fingers.MobileDevice.any) {
                zs = new zoomsim();
                os = new offsetsim();
                document.addEventListener("keydown", function (event) {
                    shiftdown = event.shiftKey;
                    ctrldown = event.ctrlKey;
                });
                document.addEventListener("keyup", function (event) {
                    shiftdown = event.shiftKey;
                    ctrldown = event.ctrlKey;
                });
                document.addEventListener("mousedown", function (event) {
                    var act = createAct("touchstart", event.clientX, event.clientY);
                    if (event.button == 0 && !shiftdown && !ctrldown) {
                        handle(cfg, [act]);
                    }
                    else if (event.button == 2 || (shiftdown && ctrldown)) {
                        zs.start(act);
                        handle(cfg, [act, zs.oppo]);
                    }
                    else if (event.button == 1) {
                        os.start(act);
                        handle(cfg, [act, os.oppo]);
                    }
                }, true);
                document.addEventListener("mousemove", function (event) {
                    var act = createAct("touchmove", event.clientX, event.clientY);
                    if (event.button == 0 && !shiftdown && !ctrldown) {
                        handle(cfg, [act]);
                    }
                    else if (event.button == 2 || (shiftdown && ctrldown)) {
                        zs.start(act);
                        handle(cfg, [act, zs.oppo]);
                    }
                    else if (event.button == 1 || ctrldown) {
                        os.start(act);
                        handle(cfg, [act, os.oppo]);
                    }
                }, true);
                document.addEventListener("mouseup", function (event) {
                    var act = createAct("touchend", event.clientX, event.clientY);
                    if (event.button == 0 && !shiftdown && !ctrldown) {
                        handle(cfg, [act]);
                    }
                    else if (event.button == 1) {
                        os.start(act);
                        handle(cfg, [act, os.oppo]);
                    }
                    else if (event.button == 2 || shiftdown || ctrldown) {
                        zs.start(act);
                        handle(cfg, [act, zs.oppo]);
                    }
                }, true);
            }
            else {
                document.addEventListener("touchstart", function (event) {
                    var acts = [];
                    var touches = getouches(event);
                    for (var i = 0; i < touches.length; i++) {
                        var item = event.changedTouches[i];
                        var act = createAct("touchstart", item.clientX, item.clientY);
                        acts.add(act);
                    }
                    handle(cfg, acts);
                    event.stopPropagation();
                }, true);
                document.addEventListener("touchmove", function (event) {
                    var acts = [];
                    var touches = getouches(event);
                    for (var i = 0; i < touches.length; i++) {
                        var item = event.changedTouches[i];
                        var act = createAct("touchmove", item.clientX, item.clientY);
                        acts.add(act);
                    }
                    handle(cfg, acts);
                    event.stopPropagation();
                    if (fingers.Browser.isSafari) {
                        event.preventDefault();
                    }
                }, true);
                document.addEventListener("touchend", function (event) {
                    var acts = [];
                    var touches = getouches(event, true);
                    for (var i = 0; i < touches.length; i++) {
                        var item = event.changedTouches[i];
                        var act = createAct("touchend", item.clientX, item.clientY);
                        acts.add(act);
                    }
                    handle(cfg, acts);
                    event.stopPropagation();
                }, true);
            }
            inited = true;
        }
        return cfg;
    }
    fingers.touch = touch;
})(fingers || (fingers = {}));
var touch = fingers.touch;

var fingers;
(function (fingers) {
    var Rot = (function () {
        function Rot(el) {
            if (!el) {
                return;
            }
            this.target = el;
            el.$rot$ = this;
            var pos = [el.astyle(["left"]), el.astyle(["top"])];
            el.style.left = pos[0];
            el.style.top = pos[1];
            var rc = el.getBoundingClientRect();
            this.origin = {
                center: [rc.width / 2, rc.height / 2],
                angle: 0,
                scale: [1, 1],
                pos: [parseFloat(pos[0]), parseFloat(pos[1])],
                size: [rc.width, rc.height]
            };
            this.cmt = {
                center: [rc.width / 2, rc.height / 2],
                angle: 0,
                scale: [1, 1],
                pos: [parseFloat(pos[0]), parseFloat(pos[1])],
                size: [rc.width, rc.height]
            };
            this.cache = {
                center: [rc.width / 2, rc.height / 2],
                angle: 0,
                scale: [1, 1],
                pos: [parseFloat(pos[0]), parseFloat(pos[1])],
                size: [rc.width, rc.height]
            };
            this.status = [];
            this.center = document.createElement("div");
            this.center.style.position = 'absolute';
            this.center.style.left = '50%';
            this.center.style.top = '50%';
            this.center.style.width = '0px';
            this.center.style.height = '0px';
            this.center.style.border = 'solid 0px blue';
            el.appendChild(this.center);
            this.setOrigin(this.origin.center);
            el.style.transform = "rotate(0deg)";
            this.pushStatus();
        }
        Rot.prototype.rotate = function (arg, undef) {
            if (!arg) {
                return this;
            }
            var cache = this.cache;
            var origin = this.cmt;
            var offset = this.offset;
            var angle = arg.angle, center = arg.center, scale = arg.scale, pos = arg.pos, resize = arg.resize;
            if (!offset) {
                offset = [0, 0];
            }
            if (center !== undef) {
                this.pushStatus();
                this.setOrigin(center);
                var cstatus = this.pushStatus();
                offset = this.correct(cstatus, offset);
            }
            if (angle || angle === 0) {
                cache.angle = origin.angle + angle;
                cache.angle = cache.angle % 360;
            }
            if (resize) {
                cache.size = [origin.size[0] + resize[0], origin.size[1] + resize[1]];
                if (cache.size[0] < 10) {
                    cache.size[0] = 10;
                }
                if (cache.size[1] < 10) {
                    cache.size[1] = 10;
                }
            }
            if (scale) {
                if (!(scale instanceof Array)) {
                    var n = parseFloat(scale);
                    scale = [n, n];
                }
                cache.scale = [origin.scale[0] * scale[0], origin.scale[1] * scale[1]];
            }
            if (pos) {
                cache.pos = [origin.pos[0] + pos[0] - offset[0], origin.pos[1] + pos[1] - offset[1]];
            }
            this.target.style.transform = 'rotateZ(' + cache.angle + 'deg) scale(' + cache.scale[0] + ',' + cache.scale[1] + ')';
            this.target.style.left = cache.pos[0] + 'px';
            this.target.style.top = cache.pos[1] + 'px';
            if (resize) {
                this.target.style.width = cache.size[0] + 'px';
                this.target.style.height = cache.size[1] + 'px';
            }
            this.pushStatus();
            return this;
        };
        Rot.prototype.getCenter = function () {
            var rc = this.center.getBoundingClientRect();
            return [rc.left, rc.top];
        };
        Rot.prototype.setOrigin = function (p) {
            this.target.style.transformOrigin = p[0] + "px " + p[1] + "px";
        };
        Rot.prototype.correct = function (status, poffset) {
            if (!poffset) {
                poffset = [0, 0];
            }
            var d = status.delta;
            var x = parseFloat(this.target.astyle["left"]) - d.center[0];
            var y = parseFloat(this.target.astyle["top"]) - d.center[1];
            this.offset = [poffset[0] + d.center[0], poffset[1] + d.center[1]];
            this.target.style.left = x + "px";
            this.target.style.top = y + "px";
            return this.offset;
        };
        Rot.prototype.commitStatus = function () {
            this.cmt = this.cache;
            this.cmt.pos = [parseFloat(this.target.style.left), parseFloat(this.target.style.top)];
            this.cmt.size = [parseFloat(this.target.style.width), parseFloat(this.target.style.height)];
            this.cache = { angle: 0, scale: [1, 1], pos: [0, 0], size: [0, 0] };
            this.offset = [0, 0];
        };
        Rot.prototype.pushStatus = function () {
            var c = this.getCenter();
            var l = [parseFloat(this.target.astyle(["left"])), parseFloat(this.target.astyle(["top"]))];
            var s = { center: [c[0], c[1]], pos: l };
            var q = this.status;
            var p = q.length > 0 ? q[q.length - 1] : s;
            s.delta = { center: [s.center[0] - p.center[0], s.center[1] - p.center[1]],
                pos: [s.pos[0] - p.pos[0], s.pos[1] - p.pos[1]] };
            q[q.length] = s;
            if (q.length > 6) {
                q.splice(0, 1);
            }
            return s;
        };
        return Rot;
    }());
    function Rotator(el) {
        var r = el.$rot$ || new Rot(el);
        return r;
    }
    fingers.Rotator = Rotator;
})(fingers || (fingers = {}));

/// <reference path="rotator.ts" />
/// <reference path="recognizer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fingers;
(function (fingers) {
    var Zoomer = (function () {
        function Zoomer(el) {
            this.mapping = {};
            el.$$rot = el.$$rot || fingers.Rotator(el);
            //this.rot = Rotator(el);
            if (!el.$zoomer$) {
                el.$zoomer$ = {};
            }
        }
        Object.defineProperty(Zoomer.prototype, "Name", {
            get: function () {
                return this.name;
            },
            enumerable: true,
            configurable: true
        });
        Zoomer.prototype.init = function (name, el) {
            this.name = name;
            el.$zoomer$[name] = this;
        };
        Zoomer.prototype.trigger = function (name, act, el) {
            if (this.mapping[name]) {
                this.mapping[name](act, el);
            }
        };
        return Zoomer;
    }());
    fingers.Zoomer = Zoomer;
    var OnAct = (function (_super) {
        __extends(OnAct, _super);
        function OnAct(el) {
            _super.call(this, el);
            this.mapping = {};
            this.init("OnAct", el);
        }
        return OnAct;
    }(Zoomer));
    fingers.OnAct = OnAct;
    var Drag = (function (_super) {
        __extends(Drag, _super);
        function Drag(el) {
            _super.call(this, el);
            var zoomer = this;
            this.mapping = {
                dragstart: function (act, el) {
                    el.$$sact = act;
                    el.$$pact = act;
                    // zoomer.sact = act;
                    // zoomer.pact = act;
                    zoomer.started = true;
                }, dragging: function (act, el) {
                    if (zoomer.started) {
                        //let p = zoomer.pact;
                        var p = el.$$sact;
                        var offset = [act.cpos[0] - p.cpos[0], act.cpos[1] - p.cpos[1]];
                        //let center = pointOnElement(el, "mouseover", act.cpos);
                        el.$$rot.rotate({
                            pos: offset,
                            angle: 0,
                            center: [0, 0],
                            scale: 1
                        });
                        el.$$pact = act;
                    }
                }, dropped: function (act, el) {
                    zoomer.started = false;
                    el.$$rot.commitStatus();
                    if (el.$proxyof) {
                        el.reset();
                    }
                    var target = fingers.elAtPos(act.cpos);
                    if (target && target.ondrop) {
                        target.ondrop(el.$proxyof || el);
                    }
                    if (el.ondrop) {
                        el.ondrop(act, target);
                    }
                }
            };
            this.init("Drag", el);
        }
        return Drag;
    }(Zoomer));
    fingers.Drag = Drag;
    function pointOnElement(el, evt, pos) {
        var rlt = [0, 0];
        el.onmouseover = function (event) {
            rlt = [event.offsetX, event.offsetY];
        };
        simulate(el, "mouseover", pos);
        return rlt;
    }
    fingers.pointOnElement = pointOnElement;
    var Zoom = (function (_super) {
        __extends(Zoom, _super);
        function Zoom(el) {
            _super.call(this, el);
            var zoomer = this;
            this.mapping = {
                zoomstart: function (act, el) {
                    el.$$sact = act;
                    el.$$pact = act;
                    // zoomer.sact = act;
                    // zoomer.pact = act;
                    zoomer.started = true;
                }, zooming: function (act, el) {
                    if (zoomer.started) {
                        //let p = zoomer.sact;
                        var p = el.$$sact;
                        var offset = [act.cpos[0] - p.cpos[0], act.cpos[1] - p.cpos[1]];
                        var rot = act.angle - p.angle;
                        var scale = act.len / p.len;
                        var delta = { offset: offset, angle: rot, scale: scale };
                        var center = pointOnElement(el, "mouseover", act.cpos);
                        el.$$rot.rotate({
                            pos: offset,
                            angle: rot,
                            center: center,
                            scale: scale
                        });
                        el.$$pact = act;
                    }
                }, zoomend: function (act, el) {
                    zoomer.started = false;
                    el.$$rot.commitStatus();
                }
            };
            this.init("Zoom", el);
        }
        return Zoom;
    }(Zoomer));
    fingers.Zoom = Zoom;
    var Zsize = (function (_super) {
        __extends(Zsize, _super);
        function Zsize(el) {
            _super.call(this, el);
            var zoomer = this;
            this.mapping = {
                zoomstart: function (act, el) {
                    // zoomer.sact = act;
                    // zoomer.pact = act;
                    el.$$sact = act;
                    el.$$pact = act;
                    var w = el.astyle(["width"]);
                    var h = el.astyle(["height"]);
                    el.$$initState = { w: parseFloat(w), h: parseFloat(h) };
                    zoomer.started = true;
                }, zooming: function (act, el) {
                    if (zoomer.started) {
                        //let p = zoomer.sact;
                        var p = el.$$sact;
                        var offset = [act.cpos[0] - p.cpos[0], act.cpos[1] - p.cpos[1]];
                        var resize = [act.owidth - p.owidth, act.oheight - p.oheight];
                        el.$$rot.rotate({
                            pos: offset,
                            angle: 0,
                            center: [0, 0],
                            scale: 1
                        });
                        var w = el.astyle(["width"]);
                        var h = el.astyle(["height"]);
                        el.style.width = el.$$initState.w + resize[0] + "px";
                        el.style.height = el.$$initState.h + resize[1] + "px";
                        el.$$pact = act;
                    }
                }, zoomend: function (act, el) {
                    zoomer.started = false;
                    el.$$rot.commitStatus();
                }
            };
            this.init("Zsize", el);
        }
        return Zsize;
    }(Zoomer));
    fingers.Zsize = Zsize;
    function simulate(element, eventName, pos) {
        function extend(destination, source) {
            for (var property in source)
                destination[property] = source[property];
            return destination;
        }
        var eventMatchers = {
            'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
            'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
        };
        var defaultOptions = {
            pointerX: 100,
            pointerY: 100,
            button: 0,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            bubbles: true,
            cancelable: true
        };
        if (pos) {
            defaultOptions.pointerX = pos[0];
            defaultOptions.pointerY = pos[1];
        }
        var options = extend(defaultOptions, arguments[3] || {});
        var oEvent, eventType = null;
        for (var name_1 in eventMatchers) {
            if (eventMatchers[name_1].test(eventName)) {
                eventType = name_1;
                break;
            }
        }
        if (!eventType)
            throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
        if (document.createEvent) {
            oEvent = document.createEvent(eventType);
            if (eventType == 'HTMLEvents') {
                oEvent.initEvent(eventName, options.bubbles, options.cancelable);
            }
            else {
                oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView, options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
            }
            element.dispatchEvent(oEvent);
        }
        else {
            options.clientX = options.pointerX;
            options.clientY = options.pointerY;
            var evt = document.createEventObject();
            oEvent = extend(evt, options);
            element.fireEvent('on' + eventName, oEvent);
        }
        return element;
    }
})(fingers || (fingers = {}));

/// <reference path="touch.ts" />
/// <reference path="zoomer.ts" />
/// <reference path="../../foundation/src/script/elements.ts" />
var fingers;
(function (fingers) {
    function elAtPos(pos) {
        var rlt = null;
        var cache = [];
        while (true) {
            var el = document.elementFromPoint(pos[0], pos[1]);
            if (!el) {
                break;
            }
            var ps = el.astyle(['position']);
            if (el == document.body || el.tagName.toLowerCase() == "html" || el == window) {
                rlt = null;
                break;
            }
            else if (el.$evtrap$) {
                rlt = null;
                break;
            }
            else if (el.$touchable$) {
                rlt = el.getarget ? el.getarget() : el;
                rlt.$touchel$ = el;
                break;
            }
            else {
                if (el.$evtignore$ || ps == 'absolute' || ps == 'fixed') {
                    el.style.display = "none";
                    cache.add(el);
                }
                else {
                    break;
                }
            }
        }
        for (var _i = 0, cache_1 = cache; _i < cache_1.length; _i++) {
            var i = cache_1[_i];
            i.style.display = "";
        }
        return rlt;
    }
    fingers.elAtPos = elAtPos;
    var cfg = null;
    function all(node, settings, result) {
        var rlt = result || [];
        if (!node || !settings) {
            return rlt;
        }
        var cb = settings.callback;
        var ft = settings.filter;
        cb(node);
        if (!node.childNodes) {
            console.error("Unexpected target node:", node);
            debugger;
            return;
        }
        for (var i = 0; i < node.childNodes.length; i++) {
            var cnode = node.childNodes[i];
            if (!ft || ft(cnode)) {
                if (cb) {
                    cb(cnode);
                }
                else {
                    rlt.add(cnode);
                }
            }
            all(cnode, settings, rlt);
        }
        return rlt;
    }
    var ctx;
    function finger(els, settings, undef) {
        var el = null;
        var typ = typeof (els);
        if (typ == 'string') {
            if (window.$) {
                els = window.$(els);
            }
            else {
                els = document.querySelectorAll(els);
            }
        }
        if (els.length === undef) {
            els = [els];
        }
        if (!cfg) {
            cfg = fingers.touch({
                on: {
                    tap: function (act) {
                        var activeEls = elAtPos(act.cpos) || ctx.activeEls;
                        ctx.select(activeEls);
                    }, touched: function (act) {
                        var activeEl = elAtPos(act.cpos);
                        ctx.select(activeEl);
                    }
                }, onact: function (inq) {
                }, onrecognized: function (act) {
                    ctx.each(function (activeEl) {
                        if (activeEl && activeEl.$zoomer$) {
                            var zm = activeEl.$zoomer$;
                            for (var i in zm) {
                                var item = zm[i];
                                if (item.mapping[act.act]) {
                                    item.mapping[act.act](act, activeEl);
                                }
                            }
                        }
                    });
                }
            });
            cfg.enabled = true;
        }
        if (!ctx) {
            ctx = new fingers.FingerContext(cfg);
        }
        for (var _i = 0, els_1 = els; _i < els_1.length; _i++) {
            var el_1 = els_1[_i];
            if (!el_1.$touchable$) {
                el_1.$touchable$ = true;
                all(el_1, { callback: function (nd) { nd.$evtignore$ = true; } });
            }
        }
        return {
            zoomable: function () {
                for (var _i = 0, els_2 = els; _i < els_2.length; _i++) {
                    var el_2 = els_2[_i];
                    var zoomer = new fingers.Zoom(el_2);
                }
                return this;
            }, zsizable: function () {
                for (var _i = 0, els_3 = els; _i < els_3.length; _i++) {
                    var el_3 = els_3[_i];
                    var zsize = new fingers.Zsize(el_3);
                }
                return this;
            }, draggable: function () {
                for (var _i = 0, els_4 = els; _i < els_4.length; _i++) {
                    var el_4 = els_4[_i];
                    var csspos = el_4.astyle(["position"]);
                    if (csspos != 'absolute' && csspos != 'fixed') {
                        buildproxy(el_4);
                    }
                    else {
                        new fingers.Drag(el_4);
                    }
                }
                return this;
            }, droppable: function (drophandler) {
                for (var _i = 0, els_5 = els; _i < els_5.length; _i++) {
                    var el_5 = els_5[_i];
                    el_5.ondrop = drophandler;
                }
                return this;
            }, on: function (action, handler) {
                if (action && handler) {
                    for (var _i = 0, els_6 = els; _i < els_6.length; _i++) {
                        var el_6 = els_6[_i];
                        var onact = el_6.$$onact || new fingers.OnAct(el_6);
                        if (!onact.mapping[action]) {
                            onact.mapping[action] = handler;
                        }
                        el_6.$$onact = onact;
                    }
                }
                return this;
            }, activate: function () {
                for (var _i = 0, els_7 = els; _i < els_7.length; _i++) {
                    var el_7 = els_7[_i];
                    ctx.select(el_7);
                }
            }
        };
    }
    fingers.finger = finger;
    function buildproxy(el) {
        var proxy = document.createElement("div");
        proxy.className = "proxy";
        proxy.style.zIndex = '9999';
        proxy.reset = function () {
            var rect = el.getBoundingClientRect();
            this.style.display = 'none';
            this.style.left = rect.left + 'px';
            this.style.top = rect.top + 'px';
            this.style.width = rect.width + 'px';
            this.style.height = rect.height + 'px';
            if (this.$$rot) {
                this.$$rot.commitStatus();
            }
        };
        proxy.reset();
        proxy.$proxyof = el;
        proxy.$touchable$ = true;
        all(proxy, { callback: function (nd) { nd.$evtignore$ = true; } });
        document.body.appendChild(proxy);
        new fingers.Drag(proxy);
        el.$proxy = proxy;
        return proxy;
    }
})(fingers || (fingers = {}));
var finger = fingers.finger;

/// <reference path="touch.ts" />
/// <reference path="zoomer.ts" />
/// <reference path="../../foundation/src/script/elements.ts" />
var fingers;
(function (fingers) {
    var FingerContext = (function () {
        function FingerContext(settings) {
            this.settings = settings;
            this.multiactive = false;
            this.activeEl = [];
        }
        Object.defineProperty(FingerContext.prototype, "activeEls", {
            get: function () {
                return this.activeEl;
            },
            enumerable: true,
            configurable: true
        });
        FingerContext.prototype.select = function (target) {
            if (!this.multiactive) {
                this.activeEl.clear();
            }
            this.activeEl.add(target);
        };
        FingerContext.prototype.each = function (callback) {
            if (callback && this.activeEl && this.activeEl.length > 0) {
                for (var _i = 0, _a = this.activeEl; _i < _a.length; _i++) {
                    var i = _a[_i];
                    callback(i);
                }
            }
        };
        return FingerContext;
    }());
    fingers.FingerContext = FingerContext;
})(fingers || (fingers = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbmdlcnMvc3JjL2RldmljZS50cyIsImZpbmdlcnMvc3JjL3BhdHRlcm5zLnRzIiwiZmluZ2Vycy9zcmMvcmVjb2duaXplci50cyIsImZpbmdlcnMvc3JjL3RvdWNoLnRzIiwiZmluZ2Vycy9zcmMvcm90YXRvci50cyIsImZpbmdlcnMvc3JjL3pvb21lci50cyIsImZpbmdlcnMvc3JjL2Zpbmdlci50cyIsImZpbmdlcnMvc3JjL2ZpbmdlcmNvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsbUVBQW1FO0FBRW5FLElBQVUsT0FBTyxDQXlFaEI7QUF6RUQsV0FBVSxPQUFPLEVBQUEsQ0FBQztJQUNqQjtRQUFBO1FBdUNBLENBQUM7UUF0Q0Esc0JBQVcsdUJBQU87aUJBQWxCO2dCQUNDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUM5QyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQzlCLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLENBQUMsSUFBRyxJQUFJLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUM7WUFDL0IsQ0FBQzs7O1dBQUE7UUFDRCxzQkFBVywwQkFBVTtpQkFBckI7Z0JBQ0MsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2pELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztnQkFDRCxNQUFNLENBQUMsQ0FBQyxJQUFFLElBQUksSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNoQyxDQUFDOzs7V0FBQTtRQUNELHNCQUFXLG1CQUFHO2lCQUFkO2dC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QUNELEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNFLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxDQUFDO2dCQUNMLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekYsQ0FBQztZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxhQUFhLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDOUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzdDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNuQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQSxDQUFDO2dCQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3BELENBQUM7WUFDRCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRVMsdUJBQVMsR0FBbkI7WUFDSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDN0MsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0IsQ0FBQztRQUNTLHVCQUFTLEdBQW5CLFVBQW9CLENBQVU7WUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNuRSxDQUFDO1FBQ1MscUJBQU8sR0FBakIsVUFBa0IsTUFBVSxFQUFFLE9BQWlCO1lBQzNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUEsQ0FBQztnQkFDVixPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDckIsQ0FBQztZQUNELElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDckIsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RCxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLENBQUM7UUFDUywwQkFBWSxHQUF0QjtZQUNJLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN0QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN2RixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM1RixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUMsS0FBSyxFQUFDLENBQUMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUNTLHdCQUFVLEdBQXBCO1lBQ0ksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNGLElBQUksQ0FBQyxHQUFPLEVBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBQyxDQUFDLEVBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FB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Q0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDZjtZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0wsb0JBQUM7SUFBRCxDQXZCQSxBQXVCQyxJQUFBO0lBdkJZLHFCQUFhLGdCQXVCekIsQ0FBQTtBQUNMLENBQUMsRUF6QlMsT0FBTyxLQUFQLE9BQU8sUUF5QmhCIiwiZmlsZSI6ImZpbmdlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZm91bmRhdGlvbi9zcmMvc2NyaXB0L2RlZmluaXRpb25zLnRzXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBmaW5nZXJze1xyXG5cdGV4cG9ydCBjbGFzcyBNb2JpbGVEZXZpY2V7XHJcblx0XHRzdGF0aWMgZ2V0IEFuZHJvaWQgKCk6Ym9vbGVhbiB7XHJcblx0XHRcdHZhciByID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZC9pKTtcclxuXHRcdFx0aWYgKHIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnbWF0Y2ggQW5kcm9pZCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiByIT0gbnVsbCAmJiByLmxlbmd0aD4wO1xyXG5cdFx0fVxyXG5cdFx0c3RhdGljIGdldCBCbGFja0JlcnJ5KCk6Ym9vbGVhbiB7XHJcblx0XHRcdHZhciByID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQmxhY2tCZXJyeS9pKTtcclxuXHRcdFx0aWYgKHIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnbWF0Y2ggQW5kcm9pZCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiByIT1udWxsICYmIHIubGVuZ3RoID4gMDtcclxuXHRcdH1cclxuXHRcdHN0YXRpYyBnZXQgaU9TKCk6Ym9vbGVhbiB7XHJcblx0XHRcdHZhciByID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBob25lfGlQYWR8aVBvZC9pKTtcclxuXHRcdFx0aWYgKHIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnbWF0Y2ggQW5kcm9pZCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiByICE9IG51bGwgJiYgci5sZW5ndGggPiAwO1xyXG5cdFx0fVxyXG5cdFx0c3RhdGljIGdldCBPcGVyYSgpOmJvb2xlYW4ge1xyXG5cdFx0XHR2YXIgciA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL09wZXJhIE1pbmkvaSk7XHJcblx0XHRcdGlmIChyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ21hdGNoIEFuZHJvaWQnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gciAhPSBudWxsICYmIHIubGVuZ3RoID4gMDtcclxuXHRcdH1cclxuXHRcdHN0YXRpYyBnZXQgV2luZG93cygpOmJvb2xlYW4ge1xyXG5cdFx0XHR2YXIgciA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0lFTW9iaWxlL2kpO1xyXG5cdFx0XHRpZiAocikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdtYXRjaCBBbmRyb2lkJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHIhPSBudWxsICYmIHIubGVuZ3RoID4wO1xyXG5cdFx0fVxyXG5cdFx0c3RhdGljIGdldCBhbnkoKTpib29sZWFuIHtcclxuXHRcdFx0cmV0dXJuIChNb2JpbGVEZXZpY2UuQW5kcm9pZCB8fCBNb2JpbGVEZXZpY2UuQmxhY2tCZXJyeSB8fCBNb2JpbGVEZXZpY2UuaU9TIHx8IE1vYmlsZURldmljZS5PcGVyYSB8fCBNb2JpbGVEZXZpY2UuV2luZG93cyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRleHBvcnQgY2xhc3MgQnJvd3NlcntcclxuXHRcdC8vIE9wZXJhIDguMCtcclxuXHRcdHN0YXRpYyBnZXQgaXNPcGVyYSgpOmJvb2xlYW57XHJcblx0XHRcdHJldHVybiAoISF3aW5kb3cub3ByICYmICEhd2luZG93Lm9wci5hZGRvbnMpIHx8ICEhd2luZG93Lm9wZXJhIHx8IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignIE9QUi8nKSA+PSAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBGaXJlZm94IDEuMCtcclxuXHRcdHN0YXRpYyBnZXQgaXNGaXJlZm94KCk6Ym9vbGVhbntcclxuXHRcdFx0cmV0dXJuIHR5cGVvZiB3aW5kb3cuSW5zdGFsbFRyaWdnZXIgIT09ICd1bmRlZmluZWQnO1xyXG5cdFx0fVxyXG5cdFx0Ly8gQXQgbGVhc3QgU2FmYXJpIDMrOiBcIltvYmplY3QgSFRNTEVsZW1lbnRDb25zdHJ1Y3Rvcl1cIlxyXG5cdFx0c3RhdGljIGdldCBpc1NhZmFyaSgpOmJvb2xlYW57XHJcblx0XHRcdHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoSFRNTEVsZW1lbnQpLmluZGV4T2YoJ0NvbnN0cnVjdG9yJykgPiAwO1xyXG5cdFx0fSBcclxuXHRcdC8vIEludGVybmV0IEV4cGxvcmVyIDYtMTFcclxuXHRcdHN0YXRpYyBnZXQgaXNJRSgpOmJvb2xlYW57XHJcblx0XHRcdHJldHVybiAvKkBjY19vbiFAKi9mYWxzZSB8fCAhIWRvY3VtZW50LmRvY3VtZW50TW9kZTtcclxuXHRcdH1cclxuXHRcdC8vIEVkZ2UgMjArXHJcblx0XHRzdGF0aWMgZ2V0IGlzRWRnZSgpOmJvb2xlYW57XHJcblx0XHRcdHJldHVybiAhQnJvd3Nlci5pc0lFICYmICEhd2luZG93LlN0eWxlTWVkaWE7XHJcblx0XHR9XHJcblx0XHQvLyBDaHJvbWUgMStcclxuXHRcdHN0YXRpYyBnZXQgaXNDaHJvbWUoKTpib29sZWFue1xyXG5cdFx0XHRyZXR1cm4gISF3aW5kb3cuY2hyb21lICYmICEhd2luZG93LmNocm9tZS53ZWJzdG9yZTtcclxuXHRcdH1cclxuXHRcdC8vIEJsaW5rIGVuZ2luZSBkZXRlY3Rpb25cclxuXHRcdHN0YXRpYyBnZXQgaXNCbGluaygpOmJvb2xlYW57XHJcblx0XHRcdHJldHVybiAoQnJvd3Nlci5pc0Nocm9tZSB8fCBCcm93c2VyLmlzT3BlcmEpICYmICEhd2luZG93LkNTUztcclxuXHRcdH1cclxuXHR9XHJcbn0iLCJcclxubmFtZXNwYWNlIGZpbmdlcnN7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIGlwYXR0ZXJue1xyXG4gICAgICAgIHZlcmlmeShhY3RzOmlhY3RbXSwgcXVldWU6YW55W10sIG91dHE/OmlhY3RbXSk6Ym9vbGVhbjtcclxuICAgICAgICByZWNvZ25pemUocXVldWU6YW55W10sIG91dHE/OmlhY3RbXSk6YW55O1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgUGF0dGVybnM6YW55ID0ge307XHJcbiAgICBcclxuICAgIGNsYXNzIFRvdWNoZWRQYXR0ZXJuIGltcGxlbWVudHMgaXBhdHRlcm57XHJcbiAgICAgICAgdmVyaWZ5KGFjdHM6aWFjdFtdLCBxdWV1ZTphbnlbXSwgb3V0cT86aWFjdFtdKTpib29sZWFue1xyXG4gICAgICAgICAgICBsZXQgcmx0ID0gYWN0cy5sZW5ndGggPT0gMSAmJiBhY3RzWzBdLmFjdCA9PSBcInRvdWNoZW5kXCIgJiYgcXVldWUubGVuZ3RoID4gMDtcclxuICAgICAgICAgICAgcmV0dXJuIHJsdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlY29nbml6ZShxdWV1ZTphbnlbXSwgb3V0cTppYWN0W10pOmFueXtcclxuICAgICAgICAgICAgbGV0IHByZXYgPSBxdWV1ZVsxXTtcclxuICAgICAgICAgICAgLy9kZWJ1Z2dlcjtcclxuICAgICAgICAgICAgaWYgKHByZXYgJiYgcHJldi5sZW5ndGggPT0gMSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYWN0ID0gcHJldlswXTtcclxuICAgICAgICAgICAgICAgIGxldCBkcmFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAob3V0cSAhPSBudWxsICYmIG91dHEubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhY3Q6YW55ID0gb3V0cVswXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFjdCAmJiAocGFjdC5hY3QgPT0gXCJkcmFnZ2luZ1wiIHx8IHBhY3QuYWN0ID09IFwiZHJhZ3N0YXJ0XCIpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHJhZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFkcmFnKXsgXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBpPTA7IGk8MzsgaSsrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHEgPSBxdWV1ZVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHFbMF0uYWN0ID09IFwidG91Y2hzdGFydFwiKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0OlwidG91Y2hlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNwb3M6W2FjdC5jcG9zWzBdLCBhY3QuY3Bvc1sxXV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZTphY3QudGltZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgY2xhc3MgRHJhZ2dpbmdQYXR0ZXJuIGltcGxlbWVudHMgaXBhdHRlcm57XHJcbiAgICAgICAgdmVyaWZ5KGFjdHM6aWFjdFtdLCBxdWV1ZTphbnlbXSk6Ym9vbGVhbntcclxuICAgICAgICAgICAgbGV0IHJsdCA9IGFjdHMubGVuZ3RoID09IDEgXHJcbiAgICAgICAgICAgICAgICAmJiBhY3RzWzBdLmFjdCA9PSBcInRvdWNobW92ZVwiIFxyXG4gICAgICAgICAgICAgICAgJiYgcXVldWUubGVuZ3RoID4gMjtcclxuICAgICAgICAgICAgaWYgKHJsdCl7XHJcbiAgICAgICAgICAgICAgICBybHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGxldCBzMSA9IHF1ZXVlWzJdO1xyXG4gICAgICAgICAgICAgICAgbGV0IHMyID0gcXVldWVbMV07XHJcbiAgICAgICAgICAgICAgICBpZiAoczEubGVuZ3RoID09IDEgJiYgczIubGVuZ3RoID09IDEpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhMSA9IHMxWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhMiA9IHMyWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhMS5hY3QgPT0gXCJ0b3VjaHN0YXJ0XCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2RlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYTEuYWN0ID09IFwidG91Y2hzdGFydFwiICYmIGEyLmFjdCA9PSBcInRvdWNobW92ZVwiKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZiAoYTEuYWN0ID09IFwidG91Y2htb3ZlXCIgJiYgYTIuYWN0ID09IFwidG91Y2htb3ZlXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBybHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJsdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlY29nbml6ZShxdWV1ZTphbnlbXSxvdXRxOmlhY3RbXSk6YW55e1xyXG4gICAgICAgICAgICBsZXQgcHJldiA9IHF1ZXVlWzJdO1xyXG4gICAgICAgICAgICBpZiAocHJldi5sZW5ndGggPT0gMSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYWN0ID0gcHJldlswXTtcclxuICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChhY3QuYWN0ID09IFwidG91Y2hzdGFydFwiKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Q6XCJkcmFnc3RhcnRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3BvczpbYWN0LmNwb3NbMF0sIGFjdC5jcG9zWzFdXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZTphY3QudGltZVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZiAoYWN0LmFjdCA9PSBcInRvdWNobW92ZVwiICYmIG91dHEubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJhY3QgPSBvdXRxWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyYWN0LmFjdCA9PSBcImRyYWdzdGFydFwiIHx8IHJhY3QuYWN0ID09IFwiZHJhZ2dpbmdcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Q6XCJkcmFnZ2luZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3BvczpbYWN0LmNwb3NbMF0sIGFjdC5jcG9zWzFdXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6YWN0LnRpbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIERyb3BQYXR0ZXJuIGltcGxlbWVudHMgaXBhdHRlcm57XHJcbiAgICAgICAgdmVyaWZ5KGFjdHM6aWFjdFtdLCBxdWV1ZTphbnlbXSwgb3V0cT86aWFjdFtdKTpib29sZWFue1xyXG4gICAgICAgICAgICBsZXQgcmx0ID0gYWN0cy5sZW5ndGggPT0gMSAmJiBhY3RzWzBdLmFjdCA9PSBcInRvdWNoZW5kXCIgJiYgcXVldWUubGVuZ3RoID4gMCAmJiBvdXRxLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgICAgIHJldHVybiBybHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWNvZ25pemUocXVldWU6YW55W10sb3V0cTppYWN0W10pOmFueXtcclxuICAgICAgICAgICAgLy9sZXQgcHJldiA9IHF1ZXVlWzFdO1xyXG4gICAgICAgICAgICBsZXQgYWN0ID0gb3V0cVswXTtcclxuICAgICAgICAgICAgaWYgKGFjdC5hY3QgPT0gXCJkcmFnZ2luZ1wiIHx8IGFjdC5hY3QgPT0gXCJkcmFnc3RhcnRcIil7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdDpcImRyb3BwZWRcIixcclxuICAgICAgICAgICAgICAgICAgICBjcG9zOlthY3QuY3Bvc1swXSwgYWN0LmNwb3NbMV1dLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWU6YWN0LnRpbWVcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIERibFRvdWNoZWRQYXR0ZXJuIGltcGxlbWVudHMgaXBhdHRlcm57XHJcbiAgICAgICAgdmVyaWZ5KGFjdHM6aWFjdFtdLCBxdWV1ZTphbnlbXSk6Ym9vbGVhbntcclxuICAgICAgICAgICAgbGV0IHJsdCA9IGFjdHMubGVuZ3RoID09IDEgJiYgYWN0c1swXS5hY3QgPT0gXCJ0b3VjaGVuZFwiICYmIHF1ZXVlLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgICAgIHJldHVybiBybHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWNvZ25pemUocXVldWU6YW55W10sIG91dHE6aWFjdFtdKTphbnl7XHJcbiAgICAgICAgICAgIGxldCBwcmV2ID0gcXVldWVbMV07XHJcbiAgICAgICAgICAgIGlmIChwcmV2ICYmIHByZXYubGVuZ3RoID09IDEpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGFjdCA9IHByZXZbMF07XHJcbiAgICAgICAgICAgICAgICBpZiAob3V0cSAhPSBudWxsICYmIG91dHEubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhY3Q6YW55ID0gb3V0cVswXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFjdCAmJiBwYWN0LmFjdCA9PSBcInRvdWNoZWRcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3QuYWN0ID09IFwidG91Y2hzdGFydFwiIHx8IGFjdC5hY3QgPT0gXCJ0b3VjaG1vdmVcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0LnRpbWUgLSBwYWN0LnRpbWUgPCA1MDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdDpcImRibHRvdWNoZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3BvczpbYWN0LmNwb3NbMF0sIGFjdC5jcG9zWzFdXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZTphY3QudGltZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Q6XCJ0b3VjaGVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNwb3M6W2FjdC5jcG9zWzBdLCBhY3QuY3Bvc1sxXV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6YWN0LnRpbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjYWxjQW5nbGUoYTppYWN0LCBiOmlhY3QsIGxlbjpudW1iZXIpOm51bWJlcntcclxuICAgICAgICBsZXQgYWcgPSBNYXRoLmFjb3MoKGIuY3Bvc1swXSAtIGEuY3Bvc1swXSkvbGVuKSAvIE1hdGguUEkgKiAxODA7XHJcbiAgICAgICAgaWYgKGIuY3Bvc1sxXSA8IGEuY3Bvc1sxXSl7XHJcbiAgICAgICAgICAgIGFnKj0tMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFnO1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIFpvb21TdGFydFBhdHRlcm4gaW1wbGVtZW50cyBpcGF0dGVybntcclxuICAgICAgICB2ZXJpZnkoYWN0czppYWN0W10sIHF1ZXVlOmFueVtdLCBvdXRxPzppYWN0W10pOmJvb2xlYW57XHJcbiAgICAgICAgICAgIGxldCBybHQgPSBhY3RzLmxlbmd0aCA9PSAyIFxyXG4gICAgICAgICAgICAgICAgJiYgKChhY3RzWzBdLmFjdCA9PSBcInRvdWNoc3RhcnRcIiB8fCBhY3RzWzFdLmFjdCA9PSBcInRvdWNoc3RhcnRcIilcclxuICAgICAgICAgICAgICAgICAgICB8fChvdXRxLmxlbmd0aCA+IDAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIGFjdHNbMF0uYWN0ID09IFwidG91Y2htb3ZlXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIGFjdHNbMV0uYWN0ID09IFwidG91Y2htb3ZlXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIG91dHFbMF0uYWN0ICE9IFwiem9vbWluZ1wiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBvdXRxWzBdLmFjdCAhPSBcInpvb21zdGFydFwiICkpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmx0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVjb2duaXplKHF1ZXVlOmFueVtdLCBvdXRxOmlhY3RbXSk6YW55e1xyXG4gICAgICAgICAgICBsZXQgYWN0cyA9IHF1ZXVlWzBdO1xyXG4gICAgICAgICAgICBsZXQgYTppYWN0ID0gYWN0c1swXTtcclxuICAgICAgICAgICAgbGV0IGI6aWFjdCA9IGFjdHNbMV07XHJcbiAgICAgICAgICAgIGxldCBsZW4gPSBNYXRoLnNxcnQoKGIuY3Bvc1swXSAtIGEuY3Bvc1swXSkqKGIuY3Bvc1swXSAtIGEuY3Bvc1swXSkgKyAoYi5jcG9zWzFdIC0gYS5jcG9zWzFdKSooYi5jcG9zWzFdIC0gYS5jcG9zWzFdKSk7XHJcbiAgICAgICAgICAgIGxldCBvd2lkdGggPSBNYXRoLmFicyhiLmNwb3NbMF0gLSBhLmNwb3NbMF0pO1xyXG4gICAgICAgICAgICBsZXQgb2hlaWdodCA9IE1hdGguYWJzKGIuY3Bvc1sxXSAtIGEuY3Bvc1sxXSk7XHJcbiAgICAgICAgICAgIGxldCBhZyA9IGNhbGNBbmdsZShhLCBiLCBsZW4pOyAvL01hdGguYWNvcygoYi5jcG9zWzBdIC0gYS5jcG9zWzBdKS9sZW4pIC8gTWF0aC5QSSAqIDE4MDtcclxuICAgICAgICAgICAgbGV0IHI6aWFjdCA9IHtcclxuICAgICAgICAgICAgICAgIGFjdDpcInpvb21zdGFydFwiLFxyXG4gICAgICAgICAgICAgICAgY3BvczpbKGEuY3Bvc1swXSArIGIuY3Bvc1swXSkvMiwgKGEuY3Bvc1sxXSArIGIuY3Bvc1sxXSkvMl0sXHJcbiAgICAgICAgICAgICAgICBsZW46bGVuLFxyXG4gICAgICAgICAgICAgICAgYW5nbGU6YWcsXHJcbiAgICAgICAgICAgICAgICBvd2lkdGg6b3dpZHRoLFxyXG4gICAgICAgICAgICAgICAgb2hlaWdodDpvaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgdGltZTphLnRpbWVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIFpvb21QYXR0ZXJuIGltcGxlbWVudHMgaXBhdHRlcm57XHJcbiAgICAgICAgdmVyaWZ5KGFjdHM6aWFjdFtdLCBxdWV1ZTphbnlbXSwgb3V0cT86aWFjdFtdKTpib29sZWFue1xyXG4gICAgICAgICAgICBsZXQgcmx0ID0gYWN0cy5sZW5ndGggPT0gMiBcclxuICAgICAgICAgICAgICAgICYmIChhY3RzWzBdLmFjdCAhPSBcInRvdWNoZW5kXCIgJiYgYWN0c1sxXS5hY3QgIT0gXCJ0b3VjaGVuZFwiKVxyXG4gICAgICAgICAgICAgICAgJiYgKGFjdHNbMF0uYWN0ID09IFwidG91Y2htb3ZlXCIgfHwgYWN0c1sxXS5hY3QgPT0gXCJ0b3VjaG1vdmVcIilcclxuICAgICAgICAgICAgICAgICYmIG91dHEubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICAgJiYgKG91dHFbMF0uYWN0ID09IFwiem9vbXN0YXJ0XCIgfHwgb3V0cVswXS5hY3QgPT0gXCJ6b29taW5nXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmx0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVjb2duaXplKHF1ZXVlOmFueVtdLCBvdXRxOmlhY3RbXSk6YW55e1xyXG4gICAgICAgICAgICBsZXQgYWN0cyA9IHF1ZXVlWzBdO1xyXG4gICAgICAgICAgICBsZXQgYTppYWN0ID0gYWN0c1swXTtcclxuICAgICAgICAgICAgbGV0IGI6aWFjdCA9IGFjdHNbMV07XHJcbiAgICAgICAgICAgIGxldCBsZW4gPSBNYXRoLnNxcnQoKGIuY3Bvc1swXSAtIGEuY3Bvc1swXSkqKGIuY3Bvc1swXSAtIGEuY3Bvc1swXSkgKyAoYi5jcG9zWzFdIC0gYS5jcG9zWzFdKSooYi5jcG9zWzFdIC0gYS5jcG9zWzFdKSk7XHJcbiAgICAgICAgICAgIGxldCBhZyA9IGNhbGNBbmdsZShhLCBiLCBsZW4pOyAvL01hdGguYWNvcygoYi5jcG9zWzBdIC0gYS5jcG9zWzBdKS9sZW4pIC8gTWF0aC5QSSAqIDE4MDtcclxuICAgICAgICAgICAgbGV0IG93aWR0aCA9IE1hdGguYWJzKGIuY3Bvc1swXSAtIGEuY3Bvc1swXSk7XHJcbiAgICAgICAgICAgIGxldCBvaGVpZ2h0ID0gTWF0aC5hYnMoYi5jcG9zWzFdIC0gYS5jcG9zWzFdKTtcclxuICAgICAgICAgICAgbGV0IHI6aWFjdCA9IHtcclxuICAgICAgICAgICAgICAgIGFjdDpcInpvb21pbmdcIixcclxuICAgICAgICAgICAgICAgIGNwb3M6WyhhLmNwb3NbMF0gKyBiLmNwb3NbMF0pLzIsIChhLmNwb3NbMV0gKyBiLmNwb3NbMV0pLzJdLFxyXG4gICAgICAgICAgICAgICAgbGVuOmxlbixcclxuICAgICAgICAgICAgICAgIGFuZ2xlOmFnLFxyXG4gICAgICAgICAgICAgICAgb3dpZHRoOm93aWR0aCxcclxuICAgICAgICAgICAgICAgIG9oZWlnaHQ6b2hlaWdodCxcclxuICAgICAgICAgICAgICAgIHRpbWU6YS50aW1lXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiByO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBab29tRW5kUGF0dGVybiBpbXBsZW1lbnRzIGlwYXR0ZXJue1xyXG4gICAgICAgIHZlcmlmeShhY3RzOmlhY3RbXSwgcXVldWU6YW55W10sIG91dHE/OmlhY3RbXSk6Ym9vbGVhbntcclxuICAgICAgICAgICAgbGV0IHJsdCA9IG91dHEubGVuZ3RoID4gMCBcclxuICAgICAgICAgICAgICAgICYmIChvdXRxWzBdLmFjdCA9PSBcInpvb21zdGFydFwiIHx8IG91dHFbMF0uYWN0ID09IFwiem9vbWluZ1wiKVxyXG4gICAgICAgICAgICAgICAgJiYgYWN0cy5sZW5ndGggPD0yO1xyXG4gICAgICAgICAgICBpZiAocmx0KXtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5kaXIoYWN0cyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0cy5sZW5ndGggPCAyKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaSBvZiBhY3RzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkuYWN0ID09IFwidG91Y2hlbmRcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWNvZ25pemUocXVldWU6YW55W10sIG91dHE6aWFjdFtdKTphbnl7XHJcbiAgICAgICAgICAgIGxldCByOmlhY3QgPSB7XHJcbiAgICAgICAgICAgICAgICBhY3Q6XCJ6b29tZW5kXCIsXHJcbiAgICAgICAgICAgICAgICBjcG9zOlswLCAwXSxcclxuICAgICAgICAgICAgICAgIGxlbjowLFxyXG4gICAgICAgICAgICAgICAgYW5nbGU6MCxcclxuICAgICAgICAgICAgICAgIG93aWR0aDowLFxyXG4gICAgICAgICAgICAgICAgb2hlaWdodDowLFxyXG4gICAgICAgICAgICAgICAgdGltZTpuZXcgRGF0ZSgpLmdldFRpbWUoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFBhdHRlcm5zLnpvb21lbmQgPSBuZXcgWm9vbUVuZFBhdHRlcm4oKTtcclxuICAgIFBhdHRlcm5zLnpvb21pbmcgPSBuZXcgWm9vbVBhdHRlcm4oKTtcclxuICAgIFBhdHRlcm5zLnpvb21zdGFydCA9IG5ldyBab29tU3RhcnRQYXR0ZXJuKCk7XHJcbiAgICBQYXR0ZXJucy5kcmFnZ2luZyA9IG5ldyBEcmFnZ2luZ1BhdHRlcm4oKTtcclxuICAgIFBhdHRlcm5zLmRyb3BwZWQgPSBuZXcgRHJvcFBhdHRlcm4oKTtcclxuICAgIFBhdHRlcm5zLnRvdWNoZWQgPSBuZXcgVG91Y2hlZFBhdHRlcm4oKTtcclxuICAgIFBhdHRlcm5zLmRibHRvdWNoZWQgPSBuZXcgRGJsVG91Y2hlZFBhdHRlcm4oKTtcclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZm91bmRhdGlvbi9zcmMvc2NyaXB0L2RlZmluaXRpb25zLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vcGF0dGVybnMudHNcIiAvPlxyXG5cclxubmFtZXNwYWNlIGZpbmdlcnN7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIGlhY3R7XHJcbiAgICAgICAgYWN0OnN0cmluZyxcclxuICAgICAgICBjcG9zOm51bWJlcltdLFxyXG4gICAgICAgIHJwb3M/Om51bWJlcltdLFxyXG4gICAgICAgIG9oZWlnaHQ/Om51bWJlcixcclxuICAgICAgICBvd2lkdGg/Om51bWJlcixcclxuICAgICAgICBsZW4/Om51bWJlcixcclxuICAgICAgICBhbmdsZT86bnVtYmVyLFxyXG4gICAgICAgIHRpbWU/Om51bWJlclxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBSZWNvZ25pemVye1xyXG4gICAgICAgIGlucXVldWU6YW55W10gPSBbXTtcclxuICAgICAgICBvdXRxdWV1ZTppYWN0W10gPSBbXTtcclxuICAgICAgICBwYXR0ZXJuczppcGF0dGVybltdID0gW107XHJcbiAgICAgICAgY2ZnOmFueTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY2ZnOmFueSl7XHJcbiAgICAgICAgICAgIGxldCBkZWZwYXR0ZXJucyA9IFtcInpvb21lbmRcIiwgXCJ6b29tc3RhcnRcIiwgXCJ6b29taW5nXCIsIFwiZGJsdG91Y2hlZFwiLCBcInRvdWNoZWRcIiwgXCJkcm9wcGVkXCIsIFwiZHJhZ2dpbmdcIl07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoIWNmZyl7XHJcbiAgICAgICAgICAgICAgICBjZmcgPSB7cGF0dGVybnM6ZGVmcGF0dGVybnN9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWNmZy5wYXR0ZXJucyl7XHJcbiAgICAgICAgICAgICAgICBjZmcucGF0dGVybnMgPSBkZWZwYXR0ZXJucztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5jZmcgPSBjZmc7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSBvZiBjZmcucGF0dGVybnMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKFBhdHRlcm5zW2ldKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhdHRlcm5zLmFkZChQYXR0ZXJuc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwYXJzZShhY3RzOmlhY3RbXSk6dm9pZHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNmZy5xbGVuKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2ZnLnFsZW4gPSAxMjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5pbnF1ZXVlLnNwbGljZSgwLCAwLCBhY3RzKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaW5xdWV1ZS5sZW5ndGggPiB0aGlzLmNmZy5xbGVuKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5xdWV1ZS5zcGxpY2UodGhpcy5pbnF1ZXVlLmxlbmd0aCAtIDEsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAodGhpcy5jZmcub24gJiYgdGhpcy5jZmcub24udGFwKXtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaSBvZiBhY3RzKXtcclxuICAgICAgICAgICAgICAgICAgICAvL2FjdHMubGVuZ3RoID49IDEgJiYgYWN0c1swXS5hY3QgPT0gXCJ0b3VjaHN0YXJ0XCIgJiZcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaS5hY3QgPT0gXCJ0b3VjaHN0YXJ0XCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNmZy5vbi50YXAoYWN0c1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yKGxldCBwYXR0ZXJuIG9mIHRoaXMucGF0dGVybnMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhdHRlcm4udmVyaWZ5KGFjdHMsIHRoaXMuaW5xdWV1ZSwgdGhpcy5vdXRxdWV1ZSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBybHQgPSBwYXR0ZXJuLnJlY29nbml6ZSh0aGlzLmlucXVldWUsIHRoaXMub3V0cXVldWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChybHQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHF1ZXVlLnNwbGljZSgwLCAwLCBybHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vdXRxdWV1ZS5sZW5ndGggPiB0aGlzLmNmZy5xbGVuKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cXVldWUuc3BsaWNlKHRoaXMub3V0cXVldWUubGVuZ3RoIC0gMSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHEgPSB0aGlzLmlucXVldWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5xdWV1ZSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBxLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNmZy5vbiAmJiB0aGlzLmNmZy5vbltybHQuYWN0XSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNmZy5vbltybHQuYWN0XShybHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNmZy5vbnJlY29nbml6ZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jZmcub25yZWNvZ25pemVkKHJsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInJlY29nbml6ZXIudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiZGV2aWNlLnRzXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBmaW5nZXJze1xyXG4gICAgbGV0IGluaXRlZDpib29sZWFuID0gZmFsc2U7XHJcbiAgICBcclxuICAgIGNsYXNzIHpvb21zaW17XHJcbiAgICAgICAgb3BwbzppYWN0O1xyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGUoYWN0OmlhY3QpOnZvaWR7XHJcbiAgICAgICAgICAgIGxldCBtID0gW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aC8yLCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LzJdO1xyXG4gICAgICAgICAgICB0aGlzLm9wcG8gPSB7YWN0OmFjdC5hY3QsIGNwb3M6WzIqbVswXSAtIGFjdC5jcG9zWzBdLCAyKm1bMV0gLSBhY3QuY3Bvc1sxXV0sIHRpbWU6YWN0LnRpbWV9O1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGFjdC5jcG9zWzFdLCBtWzFdLCB0aGlzLm9wcG8uY3Bvc1sxXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0YXJ0KGFjdDppYWN0KTppYWN0W117XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlKGFjdCk7XHJcbiAgICAgICAgICAgIHJldHVybiBbYWN0LCB0aGlzLm9wcG9dO1xyXG4gICAgICAgIH1cclxuICAgICAgICB6b29tKGFjdDppYWN0KTppYWN0W117XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlKGFjdCk7XHJcbiAgICAgICAgICAgIHJldHVybiBbYWN0LCB0aGlzLm9wcG9dO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbmQoYWN0OmlhY3QpOmlhY3RbXXtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGUoYWN0KTtcclxuICAgICAgICAgICAgcmV0dXJuIFthY3QsIHRoaXMub3Bwb107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjbGFzcyBvZmZzZXRzaW0gZXh0ZW5kcyB6b29tc2lte1xyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGUoYWN0OmlhY3QpOnZvaWR7XHJcbiAgICAgICAgICAgIHRoaXMub3BwbyA9IHthY3Q6YWN0LmFjdCwgY3BvczpbYWN0LmNwb3NbMF0gKyAxMDAsIGFjdC5jcG9zWzFdICsgMTAwXSwgdGltZTphY3QudGltZX07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCB6czp6b29tc2ltID0gbnVsbDtcclxuICAgIGxldCBvczpvZmZzZXRzaW0gPSBudWxsO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldG91Y2hlcyhldmVudDphbnksIGlzZW5kPzpib29sZWFuKTphbnl7XHJcbiAgICAgICAgaWYgKGlzZW5kKXtcclxuICAgICAgICAgICAgcmV0dXJuIGV2ZW50LmNoYW5nZWRUb3VjaGVzO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZXZlbnQudG91Y2hlcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHRvdWNoKGNmZzphbnkpOmFueXtcclxuICAgICAgICBsZXQgcmc6UmVjb2duaXplciA9IG5ldyBSZWNvZ25pemVyKGNmZyk7XHJcbiAgICAgICAgbGV0IHNoaWZ0ZG93biA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBjdHJsZG93biA9IGZhbHNlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVBY3QobmFtZTpzdHJpbmcsIHg6bnVtYmVyLCB5Om51bWJlcik6aWFjdHtcclxuICAgICAgICAgICAgcmV0dXJuIHthY3Q6bmFtZSwgY3BvczpbeCwgeV0sIHRpbWU6bmV3IERhdGUoKS5nZXRUaW1lKCl9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlKGNmZzphbnksIGFjdHM6aWFjdFtdKTp2b2lke1xyXG4gICAgICAgICAgICBpZiAoIWNmZyB8fCAhY2ZnLmVuYWJsZWQpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoY2ZnLm9uYWN0KXtcclxuICAgICAgICAgICAgICAgIGNmZy5vbmFjdChyZy5pbnF1ZXVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmcucGFyc2UoYWN0cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWluaXRlZCl7XHJcbiAgICAgICAgICAgIGRvY3VtZW50Lm9uY29udGV4dG1lbnUgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKCFmaW5nZXJzLk1vYmlsZURldmljZS5hbnkpe1xyXG4gICAgICAgICAgICAgICAgenMgPSBuZXcgem9vbXNpbSgpO1xyXG4gICAgICAgICAgICAgICAgb3MgPSBuZXcgb2Zmc2V0c2ltKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgICAgICAgICAgICBzaGlmdGRvd24gPSBldmVudC5zaGlmdEtleTtcclxuICAgICAgICAgICAgICAgICAgICBjdHJsZG93biA9IGV2ZW50LmN0cmxLZXk7XHJcbiAgICAgICAgICAgICAgICB9KTsgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpZnRkb3duID0gZXZlbnQuc2hpZnRLZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybGRvd24gPSBldmVudC5jdHJsS2V5O1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFjdDppYWN0ID0gY3JlYXRlQWN0KFwidG91Y2hzdGFydFwiLCBldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQuYnV0dG9uID09IDAgJiYgIXNoaWZ0ZG93biAmJiAhY3RybGRvd24pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGUoY2ZnLCBbYWN0XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5idXR0b24gPT0gMiB8fCAoc2hpZnRkb3duICYmIGN0cmxkb3duKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHpzLnN0YXJ0KGFjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZShjZmcsIFthY3QsIHpzLm9wcG9dKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmJ1dHRvbiA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9zLnN0YXJ0KGFjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZShjZmcsIFthY3QsIG9zLm9wcG9dKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYWN0OmlhY3QgPSBjcmVhdGVBY3QoXCJ0b3VjaG1vdmVcIiwgZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiA9PSAwICYmICFzaGlmdGRvd24gJiYgIWN0cmxkb3duKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlKGNmZywgW2FjdF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuYnV0dG9uID09IDIgfHwgKHNoaWZ0ZG93biAmJiBjdHJsZG93bikpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB6cy5zdGFydChhY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGUoY2ZnLCBbYWN0LCB6cy5vcHBvXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5idXR0b24gPT0gMSB8fCBjdHJsZG93bikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcy5zdGFydChhY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGUoY2ZnLCBbYWN0LCBvcy5vcHBvXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhY3Q6aWFjdCA9IGNyZWF0ZUFjdChcInRvdWNoZW5kXCIsIGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5idXR0b24gPT0gMCAmJiAhc2hpZnRkb3duICYmICFjdHJsZG93bil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZShjZmcsIFthY3RdKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmJ1dHRvbiA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9zLnN0YXJ0KGFjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZShjZmcsIFthY3QsIG9zLm9wcG9dKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmJ1dHRvbiA9PSAyIHx8IHNoaWZ0ZG93biB8fCBjdHJsZG93bil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHpzLnN0YXJ0KGFjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZShjZmcsIFthY3QsIHpzLm9wcG9dKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFjdHM6aWFjdFtdID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRvdWNoZXMgPSBnZXRvdWNoZXMoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaT0wOyBpPHRvdWNoZXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWN0OmlhY3QgPSBjcmVhdGVBY3QoXCJ0b3VjaHN0YXJ0XCIsIGl0ZW0uY2xpZW50WCwgaXRlbS5jbGllbnRZKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0cy5hZGQoYWN0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlKGNmZywgYWN0cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhY3RzOmlhY3RbXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0b3VjaGVzID0gZ2V0b3VjaGVzKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDsgaSA8IHRvdWNoZXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWN0OmlhY3QgPSBjcmVhdGVBY3QoXCJ0b3VjaG1vdmVcIiwgaXRlbS5jbGllbnRYLCBpdGVtLmNsaWVudFkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RzLmFkZChhY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGUoY2ZnLCBhY3RzKTtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoQnJvd3Nlci5pc1NhZmFyaSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhY3RzOmlhY3RbXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0b3VjaGVzID0gZ2V0b3VjaGVzKGV2ZW50LCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDsgaSA8IHRvdWNoZXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWN0OmlhY3QgPSBjcmVhdGVBY3QoXCJ0b3VjaGVuZFwiLCBpdGVtLmNsaWVudFgsIGl0ZW0uY2xpZW50WSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdHMuYWRkKGFjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZShjZmcsIGFjdHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluaXRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjZmc7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCB0b3VjaCA9IGZpbmdlcnMudG91Y2g7IiwiXHJcbm5hbWVzcGFjZSBmaW5nZXJze1xyXG4gICAgY2xhc3MgUm90e1xyXG4gICAgICAgIHByb3RlY3RlZCBvcmlnaW46YW55O1xyXG4gICAgICAgIHByb3RlY3RlZCBjbXQ6YW55O1xyXG4gICAgICAgIHByb3RlY3RlZCBjYWNoZTphbnk7XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBzdGF0dXM6YW55W107XHJcblxyXG4gICAgICAgIHRhcmdldDphbnk7XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBjZW50ZXI6YW55O1xyXG4gICAgICAgIHByb3RlY3RlZCBvZmZzZXQ6bnVtYmVyW107XHJcbiAgICAgICAgY29uc3RydWN0b3IoZWw6YW55KXtcclxuICAgICAgICAgICAgaWYgKCFlbCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy50YXJnZXQgPSBlbDtcclxuICAgICAgICAgICAgZWwuJHJvdCQgPSB0aGlzO1xyXG4gICAgICAgICAgICBsZXQgcG9zID0gW2VsLmFzdHlsZShbXCJsZWZ0XCJdKSwgZWwuYXN0eWxlKFtcInRvcFwiXSldO1xyXG4gICAgICAgICAgICBlbC5zdHlsZS5sZWZ0ID0gcG9zWzBdO1xyXG4gICAgICAgICAgICBlbC5zdHlsZS50b3AgPSBwb3NbMV07XHJcbiAgICAgICAgICAgIGxldCByYyA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IHtcclxuICAgICAgICAgICAgICAgIGNlbnRlcjpbcmMud2lkdGgvMiwgcmMuaGVpZ2h0LzJdLCBcclxuICAgICAgICAgICAgICAgIGFuZ2xlOjAsIFxyXG4gICAgICAgICAgICAgICAgc2NhbGU6WzEsMV0sIFxyXG4gICAgICAgICAgICAgICAgcG9zOltwYXJzZUZsb2F0KHBvc1swXSksIHBhcnNlRmxvYXQocG9zWzFdKV0sXHJcbiAgICAgICAgICAgICAgICBzaXplOltyYy53aWR0aCwgcmMuaGVpZ2h0XVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLmNtdCA9IHtcclxuICAgICAgICAgICAgICAgIGNlbnRlcjpbcmMud2lkdGgvMiwgcmMuaGVpZ2h0LzJdLCBcclxuICAgICAgICAgICAgICAgIGFuZ2xlOjAsIFxyXG4gICAgICAgICAgICAgICAgc2NhbGU6WzEsMV0sIFxyXG4gICAgICAgICAgICAgICAgcG9zOltwYXJzZUZsb2F0KHBvc1swXSksIHBhcnNlRmxvYXQocG9zWzFdKV0sXHJcbiAgICAgICAgICAgICAgICBzaXplOltyYy53aWR0aCwgcmMuaGVpZ2h0XVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLmNhY2hlID0ge1xyXG4gICAgICAgICAgICAgICAgY2VudGVyOltyYy53aWR0aC8yLCByYy5oZWlnaHQvMl0sIFxyXG4gICAgICAgICAgICAgICAgYW5nbGU6MCwgXHJcbiAgICAgICAgICAgICAgICBzY2FsZTpbMSwxXSwgXHJcbiAgICAgICAgICAgICAgICBwb3M6W3BhcnNlRmxvYXQocG9zWzBdKSwgcGFyc2VGbG9hdChwb3NbMV0pXSxcclxuICAgICAgICAgICAgICAgIHNpemU6W3JjLndpZHRoLCByYy5oZWlnaHRdXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jZW50ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICB0aGlzLmNlbnRlci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICAgICAgICAgIHRoaXMuY2VudGVyLnN0eWxlLmxlZnQgPSAnNTAlJztcclxuICAgICAgICAgICAgdGhpcy5jZW50ZXIuc3R5bGUudG9wID0gJzUwJSc7XHJcbiAgICAgICAgICAgIHRoaXMuY2VudGVyLnN0eWxlLndpZHRoID0gJzBweCc7XHJcbiAgICAgICAgICAgIHRoaXMuY2VudGVyLnN0eWxlLmhlaWdodCA9ICcwcHgnO1xyXG4gICAgICAgICAgICB0aGlzLmNlbnRlci5zdHlsZS5ib3JkZXIgPSAnc29saWQgMHB4IGJsdWUnO1xyXG5cclxuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQodGhpcy5jZW50ZXIpO1xyXG4gICAgICAgICAgICB0aGlzLnNldE9yaWdpbih0aGlzLm9yaWdpbi5jZW50ZXIpO1xyXG4gICAgICAgICAgICBlbC5zdHlsZS50cmFuc2Zvcm0gPSBcInJvdGF0ZSgwZGVnKVwiO1xyXG4gICAgICAgICAgICB0aGlzLnB1c2hTdGF0dXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdGF0ZShhcmc6YW55LCB1bmRlZj86YW55KXtcclxuICAgICAgICAgICAgaWYgKCFhcmcpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICBcdFx0XHRsZXQgY2FjaGUgPSB0aGlzLmNhY2hlO1xyXG5cdFx0XHRsZXQgb3JpZ2luID0gdGhpcy5jbXQ7XHJcblx0XHRcdGxldCBvZmZzZXQgPSB0aGlzLm9mZnNldDtcclxuXHRcdFx0bGV0IGFuZ2xlID0gYXJnLmFuZ2xlLCBcclxuICAgICAgICAgICAgICAgIGNlbnRlciA9IGFyZy5jZW50ZXIsIFxyXG4gICAgICAgICAgICAgICAgc2NhbGUgPSBhcmcuc2NhbGUsIFxyXG4gICAgICAgICAgICAgICAgcG9zID0gYXJnLnBvcywgXHJcbiAgICAgICAgICAgICAgICByZXNpemUgPSBhcmcucmVzaXplO1xyXG4gICAgICAgICAgICBpZiAoIW9mZnNldCl7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSBbMCwgMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNlbnRlciAhPT0gdW5kZWYpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoU3RhdHVzKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldE9yaWdpbihjZW50ZXIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNzdGF0dXMgPSB0aGlzLnB1c2hTdGF0dXMoKTtcclxuICAgICAgICAgICAgICAgIG9mZnNldCA9IHRoaXMuY29ycmVjdChjc3RhdHVzLCBvZmZzZXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChhbmdsZSB8fCBhbmdsZSA9PT0gMCl7XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5hbmdsZSA9IG9yaWdpbi5hbmdsZSArIGFuZ2xlO1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuYW5nbGUgPSBjYWNoZS5hbmdsZSAlIDM2MDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmVzaXplKXtcclxuICAgICAgICAgICAgICAgIGNhY2hlLnNpemUgPSBbb3JpZ2luLnNpemVbMF0gKyByZXNpemVbMF0sIG9yaWdpbi5zaXplWzFdICsgcmVzaXplWzFdXTtcclxuICAgICAgICAgICAgICAgIGlmIChjYWNoZS5zaXplWzBdIDwgMTApe1xyXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlLnNpemVbMF0gPSAxMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjYWNoZS5zaXplWzFdIDwgMTApe1xyXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlLnNpemVbMV0gPSAxMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2NhbGUpe1xyXG4gICAgICAgICAgICAgICAgaWYgKCEoc2NhbGUgaW5zdGFuY2VvZiBBcnJheSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuID0gcGFyc2VGbG9hdChzY2FsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NhbGUgPSBbbiwgbl07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5zY2FsZSA9IFtvcmlnaW4uc2NhbGVbMF0gKiBzY2FsZVswXSwgb3JpZ2luLnNjYWxlWzFdICogc2NhbGVbMV1dO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwb3Mpe1xyXG4gICAgICAgICAgICAgICAgY2FjaGUucG9zID0gW29yaWdpbi5wb3NbMF0gKyBwb3NbMF0gLSBvZmZzZXRbMF0sIG9yaWdpbi5wb3NbMV0gKyBwb3NbMV0gLSBvZmZzZXRbMV1dO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LnN0eWxlLnRyYW5zZm9ybSA9ICdyb3RhdGVaKCcgKyBjYWNoZS5hbmdsZSArICdkZWcpIHNjYWxlKCcgKyBjYWNoZS5zY2FsZVswXSArICcsJyArIGNhY2hlLnNjYWxlWzFdICsgJyknO1xyXG5cdFx0XHR0aGlzLnRhcmdldC5zdHlsZS5sZWZ0ID0gY2FjaGUucG9zWzBdICsgJ3B4JztcclxuXHRcdFx0dGhpcy50YXJnZXQuc3R5bGUudG9wID0gY2FjaGUucG9zWzFdICsgJ3B4JztcclxuICAgICAgICAgICAgaWYgKHJlc2l6ZSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS53aWR0aCA9IGNhY2hlLnNpemVbMF0gKyAncHgnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQuc3R5bGUuaGVpZ2h0ID0gY2FjaGUuc2l6ZVsxXSArICdweCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5wdXNoU3RhdHVzKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIGdldENlbnRlcigpOm51bWJlcltde1xyXG4gICAgICAgICAgICBsZXQgcmMgPSB0aGlzLmNlbnRlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgcmV0dXJuIFtyYy5sZWZ0LCByYy50b3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgc2V0T3JpZ2luKHA6bnVtYmVyW10pOnZvaWR7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IHBbMF0gKyBcInB4IFwiICsgcFsxXSArIFwicHhcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNvcnJlY3Qoc3RhdHVzOmFueSwgcG9mZnNldD86bnVtYmVyW10pOm51bWJlcltde1xyXG4gICAgICAgICAgICBpZiAoIXBvZmZzZXQpe1xyXG4gICAgICAgICAgICAgICAgcG9mZnNldCA9IFswLCAwXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgZCA9IHN0YXR1cy5kZWx0YTtcclxuICAgICAgICAgICAgbGV0IHggPSBwYXJzZUZsb2F0KHRoaXMudGFyZ2V0LmFzdHlsZVtcImxlZnRcIl0pIC0gZC5jZW50ZXJbMF07XHJcbiAgICAgICAgICAgIGxldCB5ID0gcGFyc2VGbG9hdCh0aGlzLnRhcmdldC5hc3R5bGVbXCJ0b3BcIl0pIC0gZC5jZW50ZXJbMV07XHJcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gW3BvZmZzZXRbMF0gKyBkLmNlbnRlclswXSwgcG9mZnNldFsxXSArIGQuY2VudGVyWzFdXTtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXQuc3R5bGUubGVmdCA9IHggKyBcInB4XCI7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LnN0eWxlLnRvcCA9IHkgKyBcInB4XCI7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9mZnNldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNvbW1pdFN0YXR1cygpOnZvaWR7XHJcbiAgICAgICAgICAgIHRoaXMuY210ID0gdGhpcy5jYWNoZTtcclxuICAgICAgICAgICAgdGhpcy5jbXQucG9zID0gW3BhcnNlRmxvYXQodGhpcy50YXJnZXQuc3R5bGUubGVmdCksIHBhcnNlRmxvYXQodGhpcy50YXJnZXQuc3R5bGUudG9wKV07XHJcbiAgICAgICAgICAgIHRoaXMuY210LnNpemUgPSBbcGFyc2VGbG9hdCh0aGlzLnRhcmdldC5zdHlsZS53aWR0aCksIHBhcnNlRmxvYXQodGhpcy50YXJnZXQuc3R5bGUuaGVpZ2h0KV07XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGUgPSB7YW5nbGU6MCwgc2NhbGU6WzEsMV0sIHBvczpbMCwwXSwgc2l6ZTpbMCwwXX07XHJcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gWzAsIDBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgcHVzaFN0YXR1cygpOnZvaWR7XHJcbiAgICAgICAgICAgIGxldCBjID0gdGhpcy5nZXRDZW50ZXIoKTtcclxuICAgICAgICAgICAgbGV0IGwgPSBbcGFyc2VGbG9hdCh0aGlzLnRhcmdldC5hc3R5bGUoW1wibGVmdFwiXSkpLHBhcnNlRmxvYXQodGhpcy50YXJnZXQuYXN0eWxlKFtcInRvcFwiXSkpXTtcclxuICAgICAgICAgICAgbGV0IHM6YW55ID0ge2NlbnRlcjpbY1swXSwgY1sxXV0sIHBvczpsfTtcclxuICAgICAgICAgICAgbGV0IHEgPSB0aGlzLnN0YXR1cztcclxuICAgICAgICAgICAgbGV0IHAgPSBxLmxlbmd0aCA+IDA/cVtxLmxlbmd0aCAtIDFdIDogcztcclxuICAgICAgICAgICAgcy5kZWx0YSA9IHsgY2VudGVyOltzLmNlbnRlclswXSAtIHAuY2VudGVyWzBdLCBzLmNlbnRlclsxXSAtIHAuY2VudGVyWzFdXSxcclxuICAgICAgICAgICAgICAgIHBvczogW3MucG9zWzBdIC0gcC5wb3NbMF0sIHMucG9zWzFdIC0gcC5wb3NbMV1dfTtcclxuICAgICAgICAgICAgcVtxLmxlbmd0aF0gPSBzO1xyXG4gICAgICAgICAgICBpZiAocS5sZW5ndGggPiA2KXtcclxuICAgICAgICAgICAgICAgIHEuc3BsaWNlKDAsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBSb3RhdG9yKGVsOmFueSk6YW55e1xyXG4gICAgICAgIGxldCByID0gZWwuJHJvdCQgfHwgbmV3IFJvdChlbCk7XHJcbiAgICAgICAgcmV0dXJuIHI7XHJcbiAgICB9XHJcbn1cclxuXHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJyb3RhdG9yLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInJlY29nbml6ZXIudHNcIiAvPlxyXG5cclxubmFtZXNwYWNlIGZpbmdlcnN7XHJcbiAgICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgWm9vbWVye1xyXG4gICAgICAgIHByb3RlY3RlZCBuYW1lOnN0cmluZztcclxuICAgICAgICBnZXQgTmFtZSgpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgc2FjdDppYWN0O1xyXG4gICAgICAgIHByb3RlY3RlZCBwYWN0OmlhY3Q7XHJcbiAgICAgICAgcHJvdGVjdGVkIHN0YXJ0ZWQ6Ym9vbGVhbjtcclxuICAgICAgICBtYXBwaW5nOmFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihlbDphbnkpe1xyXG4gICAgICAgICAgICB0aGlzLm1hcHBpbmcgPSB7fTtcclxuICAgICAgICAgICAgZWwuJCRyb3QgPSBlbC4kJHJvdCB8fCBSb3RhdG9yKGVsKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vdGhpcy5yb3QgPSBSb3RhdG9yKGVsKTtcclxuICAgICAgICAgICAgaWYgKCFlbC4kem9vbWVyJCl7XHJcbiAgICAgICAgICAgICAgICBlbC4kem9vbWVyJCA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBpbml0KG5hbWU6c3RyaW5nLCBlbDphbnkpe1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgICAgICBlbC4kem9vbWVyJFtuYW1lXSA9IHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyaWdnZXIobmFtZTpzdHJpbmcsIGFjdDppYWN0LCBlbDphbnkpe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXBwaW5nW25hbWVdKXtcclxuICAgICAgICAgICAgICAgIHRoaXMubWFwcGluZ1tuYW1lXShhY3QsIGVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgT25BY3QgZXh0ZW5kcyBab29tZXJ7XHJcbiAgICAgICAgY29uc3RydWN0b3IoZWw6YW55KXtcclxuICAgICAgICAgICAgc3VwZXIoZWwpO1xyXG4gICAgICAgICAgICB0aGlzLm1hcHBpbmcgPSB7fTtcclxuICAgICAgICAgICAgdGhpcy5pbml0KFwiT25BY3RcIiwgZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRHJhZyBleHRlbmRzIFpvb21lcntcclxuICAgICAgICBjb25zdHJ1Y3RvcihlbDphbnkpe1xyXG4gICAgICAgICAgICBzdXBlcihlbCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgem9vbWVyID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5tYXBwaW5nID0ge1xyXG4gICAgICAgICAgICAgICAgZHJhZ3N0YXJ0OmZ1bmN0aW9uKGFjdDppYWN0LCBlbDphbnkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGVsLiQkc2FjdCA9IGFjdDtcclxuICAgICAgICAgICAgICAgICAgICBlbC4kJHBhY3QgPSBhY3Q7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHpvb21lci5zYWN0ID0gYWN0O1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHpvb21lci5wYWN0ID0gYWN0O1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHpvb21lci5zdGFydGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0sIGRyYWdnaW5nOmZ1bmN0aW9uKGFjdDppYWN0LCBlbDphbnkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh6b29tZXIuc3RhcnRlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vbGV0IHAgPSB6b29tZXIucGFjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHAgPSBlbC4kJHNhY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXQgPSBbYWN0LmNwb3NbMF0gLSBwLmNwb3NbMF0sIGFjdC5jcG9zWzFdIC0gcC5jcG9zWzFdXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9sZXQgY2VudGVyID0gcG9pbnRPbkVsZW1lbnQoZWwsIFwibW91c2VvdmVyXCIsIGFjdC5jcG9zKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLiQkcm90LnJvdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3M6b2Zmc2V0LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ2xlOjAsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyOlswLCAwXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOjFcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLiQkcGFjdCA9IGFjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy96b29tZXIucGFjdCA9IGFjdDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCBkcm9wcGVkOmZ1bmN0aW9uKGFjdDppYWN0LCBlbDphbnkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHpvb21lci5zdGFydGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwuJCRyb3QuY29tbWl0U3RhdHVzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsLiRwcm94eW9mKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWwucmVzZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9lbC4kJHJvdC5jb21taXRTdGF0dXMoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0YXJnZXQgPSBlbEF0UG9zKGFjdC5jcG9zKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ICYmIHRhcmdldC5vbmRyb3Ape1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQub25kcm9wKGVsLiRwcm94eW9mIHx8IGVsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsLm9uZHJvcCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLm9uZHJvcChhY3QsIHRhcmdldCk7ICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdChcIkRyYWdcIiwgZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcG9pbnRPbkVsZW1lbnQoZWw6YW55LCBldnQ6c3RyaW5nLCBwb3M6bnVtYmVyW10pe1xyXG4gICAgICAgIGxldCBybHQgPSBbMCwgMF07XHJcbiAgICAgICAgZWwub25tb3VzZW92ZXIgPSBmdW5jdGlvbihldmVudDphbnkpe1xyXG4gICAgICAgICAgICBybHQgPSBbZXZlbnQub2Zmc2V0WCwgZXZlbnQub2Zmc2V0WV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNpbXVsYXRlKGVsLCBcIm1vdXNlb3ZlclwiLCBwb3MpO1xyXG4gICAgICAgIHJldHVybiBybHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFpvb20gZXh0ZW5kcyBab29tZXJ7XHJcbiAgICAgICAgY29uc3RydWN0b3IoZWw6YW55KXtcclxuICAgICAgICAgICAgc3VwZXIoZWwpO1xyXG4gICAgICAgICAgICBsZXQgem9vbWVyID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5tYXBwaW5nID0ge1xyXG4gICAgICAgICAgICAgICAgem9vbXN0YXJ0OmZ1bmN0aW9uKGFjdDppYWN0LCBlbDphbnkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGVsLiQkc2FjdCA9IGFjdDtcclxuICAgICAgICAgICAgICAgICAgICBlbC4kJHBhY3QgPSBhY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gem9vbWVyLnNhY3QgPSBhY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gem9vbWVyLnBhY3QgPSBhY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgem9vbWVyLnN0YXJ0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSwgem9vbWluZzpmdW5jdGlvbihhY3Q6aWFjdCwgZWw6YW55KXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoem9vbWVyLnN0YXJ0ZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2xldCBwID0gem9vbWVyLnNhY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwID0gZWwuJCRzYWN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0ID0gW2FjdC5jcG9zWzBdIC0gcC5jcG9zWzBdLCBhY3QuY3Bvc1sxXSAtIHAuY3Bvc1sxXV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByb3QgPSBhY3QuYW5nbGUgLSBwLmFuZ2xlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2NhbGUgPSBhY3QubGVuIC8gcC5sZW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkZWx0YSA9IHtvZmZzZXQ6IG9mZnNldCwgYW5nbGU6cm90LCBzY2FsZTpzY2FsZX07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjZW50ZXIgPSBwb2ludE9uRWxlbWVudChlbCwgXCJtb3VzZW92ZXJcIiwgYWN0LmNwb3MpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWwuJCRyb3Qucm90YXRlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvczpvZmZzZXQsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5nbGU6cm90LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbnRlcjpjZW50ZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTpzY2FsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWwuJCRwYWN0ID0gYWN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3pvb21lci5wYWN0ID0gYWN0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIHpvb21lbmQ6ZnVuY3Rpb24oYWN0OmlhY3QsIGVsOmFueSl7XHJcbiAgICAgICAgICAgICAgICAgICAgem9vbWVyLnN0YXJ0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBlbC4kJHJvdC5jb21taXRTdGF0dXMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmluaXQoXCJab29tXCIsIGVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBjbGFzcyBac2l6ZSBleHRlbmRzIFpvb21lcntcclxuICAgICAgICBjb25zdHJ1Y3RvcihlbDphbnkpe1xyXG4gICAgICAgICAgICBzdXBlcihlbCk7XHJcbiAgICAgICAgICAgIGxldCB6b29tZXIgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLm1hcHBpbmcgPSB7XHJcbiAgICAgICAgICAgICAgICB6b29tc3RhcnQ6ZnVuY3Rpb24oYWN0OmlhY3QsIGVsOmFueSl7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gem9vbWVyLnNhY3QgPSBhY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gem9vbWVyLnBhY3QgPSBhY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwuJCRzYWN0ID0gYWN0O1xyXG4gICAgICAgICAgICAgICAgICAgIGVsLiQkcGFjdCA9IGFjdDtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdyA9IGVsLmFzdHlsZShbXCJ3aWR0aFwiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGggPSBlbC5hc3R5bGUoW1wiaGVpZ2h0XCJdKTtcclxuICAgICAgICAgICAgICAgICAgICBlbC4kJGluaXRTdGF0ZSA9IHt3OnBhcnNlRmxvYXQodyksIGg6cGFyc2VGbG9hdChoKX07XHJcbiAgICAgICAgICAgICAgICAgICAgem9vbWVyLnN0YXJ0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSx6b29taW5nOmZ1bmN0aW9uKGFjdDppYWN0LCBlbDphbnkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh6b29tZXIuc3RhcnRlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vbGV0IHAgPSB6b29tZXIuc2FjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHAgPSBlbC4kJHNhY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXQgPSBbYWN0LmNwb3NbMF0gLSBwLmNwb3NbMF0sIGFjdC5jcG9zWzFdIC0gcC5jcG9zWzFdXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc2l6ZSA9IFthY3Qub3dpZHRoIC0gcC5vd2lkdGgsIGFjdC5vaGVpZ2h0IC0gcC5vaGVpZ2h0XTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLiQkcm90LnJvdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3M6b2Zmc2V0LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ2xlOjAsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyOlswLCAwXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOjFcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdyA9IGVsLmFzdHlsZShbXCJ3aWR0aFwiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBoID0gZWwuYXN0eWxlKFtcImhlaWdodFwiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS53aWR0aCA9IGVsLiQkaW5pdFN0YXRlLncgKyByZXNpemVbMF0gKyBcInB4XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLmhlaWdodCA9IGVsLiQkaW5pdFN0YXRlLmggKyByZXNpemVbMV0gKyBcInB4XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLiQkcGFjdCA9IGFjdDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSx6b29tZW5kOmZ1bmN0aW9uKGFjdDppYWN0LCBlbDphbnkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHpvb21lci5zdGFydGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwuJCRyb3QuY29tbWl0U3RhdHVzKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5pbml0KFwiWnNpemVcIiwgZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzaW11bGF0ZShlbGVtZW50OmFueSwgZXZlbnROYW1lOnN0cmluZywgcG9zOmFueSkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGV4dGVuZChkZXN0aW5hdGlvbjphbnksIHNvdXJjZTphbnkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gc291cmNlKVxyXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb25bcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGV2ZW50TWF0Y2hlcnM6YW55ID0ge1xyXG4gICAgICAgICAgICAnSFRNTEV2ZW50cyc6IC9eKD86bG9hZHx1bmxvYWR8YWJvcnR8ZXJyb3J8c2VsZWN0fGNoYW5nZXxzdWJtaXR8cmVzZXR8Zm9jdXN8Ymx1cnxyZXNpemV8c2Nyb2xsKSQvLFxyXG4gICAgICAgICAgICAnTW91c2VFdmVudHMnOiAvXig/OmNsaWNrfGRibGNsaWNrfG1vdXNlKD86ZG93bnx1cHxvdmVyfG1vdmV8b3V0KSkkL1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRlZmF1bHRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBwb2ludGVyWDogMTAwLFxyXG4gICAgICAgICAgICBwb2ludGVyWTogMTAwLFxyXG4gICAgICAgICAgICBidXR0b246IDAsXHJcbiAgICAgICAgICAgIGN0cmxLZXk6IGZhbHNlLFxyXG4gICAgICAgICAgICBhbHRLZXk6IGZhbHNlLFxyXG4gICAgICAgICAgICBzaGlmdEtleTogZmFsc2UsXHJcbiAgICAgICAgICAgIG1ldGFLZXk6IGZhbHNlLFxyXG4gICAgICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwb3MpIHtcclxuICAgICAgICAgICAgZGVmYXVsdE9wdGlvbnMucG9pbnRlclggPSBwb3NbMF07XHJcbiAgICAgICAgICAgIGRlZmF1bHRPcHRpb25zLnBvaW50ZXJZID0gcG9zWzFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgb3B0aW9ucyA9IGV4dGVuZChkZWZhdWx0T3B0aW9ucywgYXJndW1lbnRzWzNdIHx8IHt9KTtcclxuICAgICAgICBsZXQgb0V2ZW50OmFueSwgZXZlbnRUeXBlOmFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gZXZlbnRNYXRjaGVycykge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnRNYXRjaGVyc1tuYW1lXS50ZXN0KGV2ZW50TmFtZSkpIHsgZXZlbnRUeXBlID0gbmFtZTsgYnJlYWs7IH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZXZlbnRUeXBlKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ09ubHkgSFRNTEV2ZW50cyBhbmQgTW91c2VFdmVudHMgaW50ZXJmYWNlcyBhcmUgc3VwcG9ydGVkJyk7XHJcblxyXG4gICAgICAgIGlmIChkb2N1bWVudC5jcmVhdGVFdmVudCkge1xyXG4gICAgICAgICAgICBvRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudChldmVudFR5cGUpO1xyXG4gICAgICAgICAgICBpZiAoZXZlbnRUeXBlID09ICdIVE1MRXZlbnRzJykge1xyXG4gICAgICAgICAgICAgICAgb0V2ZW50LmluaXRFdmVudChldmVudE5hbWUsIG9wdGlvbnMuYnViYmxlcywgb3B0aW9ucy5jYW5jZWxhYmxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG9FdmVudC5pbml0TW91c2VFdmVudChldmVudE5hbWUsIG9wdGlvbnMuYnViYmxlcywgb3B0aW9ucy5jYW5jZWxhYmxlLCBkb2N1bWVudC5kZWZhdWx0VmlldyxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMuYnV0dG9uLCBvcHRpb25zLnBvaW50ZXJYLCBvcHRpb25zLnBvaW50ZXJZLCBvcHRpb25zLnBvaW50ZXJYLCBvcHRpb25zLnBvaW50ZXJZLFxyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jdHJsS2V5LCBvcHRpb25zLmFsdEtleSwgb3B0aW9ucy5zaGlmdEtleSwgb3B0aW9ucy5tZXRhS2V5LCBvcHRpb25zLmJ1dHRvbiwgZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG9FdmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBvcHRpb25zLmNsaWVudFggPSBvcHRpb25zLnBvaW50ZXJYO1xyXG4gICAgICAgICAgICBvcHRpb25zLmNsaWVudFkgPSBvcHRpb25zLnBvaW50ZXJZO1xyXG4gICAgICAgICAgICB2YXIgZXZ0ID0gKGRvY3VtZW50IGFzIGFueSkuY3JlYXRlRXZlbnRPYmplY3QoKTtcclxuICAgICAgICAgICAgb0V2ZW50ID0gZXh0ZW5kKGV2dCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuZmlyZUV2ZW50KCdvbicgKyBldmVudE5hbWUsIG9FdmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwidG91Y2gudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiem9vbWVyLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2ZvdW5kYXRpb24vc3JjL3NjcmlwdC9lbGVtZW50cy50c1wiIC8+XHJcblxyXG5uYW1lc3BhY2UgZmluZ2Vyc3tcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBlbEF0UG9zKHBvczpudW1iZXJbXSk6YW55e1xyXG4gICAgICAgIGxldCBybHQ6YW55ID0gbnVsbDtcclxuICAgICAgICBsZXQgY2FjaGU6YW55W10gPSBbXTtcclxuICAgICAgICB3aGlsZSh0cnVlKXtcclxuICAgICAgICAgICAgbGV0IGVsOmFueSA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQocG9zWzBdLCBwb3NbMV0pO1xyXG4gICAgICAgICAgICBpZiAoIWVsKXtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBwcyA9IGVsLmFzdHlsZShbJ3Bvc2l0aW9uJ10pO1xyXG4gICAgICAgICAgICBpZiAoZWwgPT0gZG9jdW1lbnQuYm9keSB8fCBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJodG1sXCIgfHwgZWwgPT0gd2luZG93KXtcclxuICAgICAgICAgICAgICAgIHJsdCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfWVsc2UgaWYgKGVsLiRldnRyYXAkKXtcclxuICAgICAgICAgICAgICAgIHJsdCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfWVsc2UgaWYgKGVsLiR0b3VjaGFibGUkKXtcclxuICAgICAgICAgICAgICAgIHJsdCA9IGVsLmdldGFyZ2V0P2VsLmdldGFyZ2V0KCk6ZWxcclxuICAgICAgICAgICAgICAgIHJsdC4kdG91Y2hlbCQgPSBlbDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGlmIChlbC4kZXZ0aWdub3JlJCB8fCBwcyA9PSAnYWJzb2x1dGUnIHx8IHBzID09ICdmaXhlZCcpe1xyXG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgICAgICAgICBjYWNoZS5hZGQoZWwpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGxldCBpIG9mIGNhY2hlKXtcclxuICAgICAgICAgICAgaS5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJsdDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgY2ZnOmFueSA9IG51bGw7XHJcblxyXG4gICAgZnVuY3Rpb24gYWxsKG5vZGU6Tm9kZSwgc2V0dGluZ3M6YW55LCByZXN1bHQ/OmFueVtdKTphbnlbXXtcclxuICAgICAgICBsZXQgcmx0OmFueVtdID0gcmVzdWx0IHx8IFtdO1xyXG4gICAgICAgIGlmICghbm9kZSB8fCAhc2V0dGluZ3Mpe1xyXG4gICAgICAgICAgICByZXR1cm4gcmx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY2IgPSBzZXR0aW5ncy5jYWxsYmFjaztcclxuICAgICAgICB2YXIgZnQgPSBzZXR0aW5ncy5maWx0ZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY2Iobm9kZSk7XHJcbiAgICAgICAgaWYgKCFub2RlLmNoaWxkTm9kZXMpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5leHBlY3RlZCB0YXJnZXQgbm9kZTpcIiwgbm9kZSk7XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCBjbm9kZSA9IG5vZGUuY2hpbGROb2Rlc1tpXTtcclxuICAgICAgICAgICAgaWYgKCFmdCB8fCBmdChjbm9kZSkpe1xyXG4gICAgICAgICAgICAgICAgaWYgKGNiKXtcclxuICAgICAgICAgICAgICAgICAgICBjYihjbm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBybHQuYWRkKGNub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhbGwoY25vZGUsIHNldHRpbmdzLCBybHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmx0O1xyXG4gICAgfVxyXG4gICAgbGV0IGN0eDpGaW5nZXJDb250ZXh0O1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGZpbmdlcihlbHM6YW55LCBzZXR0aW5ncz86YW55LCB1bmRlZj86YW55KTphbnl7XHJcbiAgICAgICAgbGV0IGVsOmFueSA9IG51bGw7XHJcbiAgICAgICAgbGV0IHR5cCA9IHR5cGVvZihlbHMpO1xyXG4gICAgICAgIGlmICh0eXAgPT0gJ3N0cmluZycpe1xyXG4gICAgICAgICAgICBpZiAoKHdpbmRvdyBhcyBhbnkpLiQpe1xyXG4gICAgICAgICAgICAgICAgZWxzID0gKHdpbmRvdyBhcyBhbnkpLiQoZWxzKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBlbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGVscyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVscy5sZW5ndGggPT09IHVuZGVmKXtcclxuICAgICAgICAgICAgZWxzID0gW2Vsc107XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgaWYgKCFjZmcpe1xyXG4gICAgICAgICAgICBjZmcgPSB0b3VjaCh7XHJcbiAgICAgICAgICAgICAgICBvbjp7IFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcDpmdW5jdGlvbihhY3Q6aWFjdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhY3RpdmVFbHMgPSBlbEF0UG9zKGFjdC5jcG9zKSB8fCBjdHguYWN0aXZlRWxzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc2VsZWN0KGFjdGl2ZUVscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSx0b3VjaGVkOmZ1bmN0aW9uKGFjdDppYWN0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFjdGl2ZUVsID0gZWxBdFBvcyhhY3QuY3Bvcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zZWxlY3QoYWN0aXZlRWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sb25hY3Q6ZnVuY3Rpb24oaW5xOmFueSl7XHJcbiAgICAgICAgICAgICAgICB9LG9ucmVjb2duaXplZDpmdW5jdGlvbihhY3Q6aWFjdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmVhY2goZnVuY3Rpb24oYWN0aXZlRWw6YW55KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUVsICYmIGFjdGl2ZUVsLiR6b29tZXIkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB6bSA9IGFjdGl2ZUVsLiR6b29tZXIkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBpIGluIHptKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IHptW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLm1hcHBpbmdbYWN0LmFjdF0pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLm1hcHBpbmdbYWN0LmFjdF0oYWN0LCBhY3RpdmVFbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjZmcuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghY3R4KXtcclxuICAgICAgICAgICAgY3R4ID0gbmV3IEZpbmdlckNvbnRleHQoY2ZnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGxldCBlbCBvZiBlbHMpe1xyXG4gICAgICAgICAgICBpZiAoIWVsLiR0b3VjaGFibGUkKXtcclxuICAgICAgICAgICAgICAgIGVsLiR0b3VjaGFibGUkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGFsbChlbCwge2NhbGxiYWNrOmZ1bmN0aW9uKG5kOmFueSl7bmQuJGV2dGlnbm9yZSQgPSB0cnVlO319KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB6b29tYWJsZTpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBlbCBvZiBlbHMpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB6b29tZXIgPSBuZXcgWm9vbShlbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfSx6c2l6YWJsZTpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBlbCBvZiBlbHMpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB6c2l6ZSA9IG5ldyBac2l6ZShlbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfSxkcmFnZ2FibGU6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgZWwgb2YgZWxzKXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY3NzcG9zID0gZWwuYXN0eWxlKFtcInBvc2l0aW9uXCJdKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3NzcG9zICE9ICdhYnNvbHV0ZScgJiYgY3NzcG9zICE9ICdmaXhlZCcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWlsZHByb3h5KGVsKTtcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IERyYWcoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB9LGRyb3BwYWJsZTpmdW5jdGlvbihkcm9waGFuZGxlcjpGdW5jdGlvbil7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGVsIG9mIGVscyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwub25kcm9wID0gZHJvcGhhbmRsZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfSxvbjpmdW5jdGlvbihhY3Rpb246c3RyaW5nLCBoYW5kbGVyOkZ1bmN0aW9uKXtcclxuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24gJiYgaGFuZGxlcil7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBlbCBvZiBlbHMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb25hY3QgPSBlbC4kJG9uYWN0IHx8IG5ldyBPbkFjdChlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb25hY3QubWFwcGluZ1thY3Rpb25dKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uYWN0Lm1hcHBpbmdbYWN0aW9uXSA9IGhhbmRsZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWwuJCRvbmFjdCA9IG9uYWN0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB9LGFjdGl2YXRlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGVsIG9mIGVscyl7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LnNlbGVjdChlbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJ1aWxkcHJveHkoZWw6YW55KXtcclxuICAgICAgICBsZXQgcHJveHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpIGFzIGFueTtcclxuXHJcbiAgICAgICAgcHJveHkuY2xhc3NOYW1lID0gXCJwcm94eVwiO1xyXG4gICAgICAgIHByb3h5LnN0eWxlLnpJbmRleCA9ICc5OTk5JztcclxuXHJcbiAgICAgICAgcHJveHkucmVzZXQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBsZXQgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUubGVmdCA9IHJlY3QubGVmdCArICdweCc7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUudG9wID0gcmVjdC50b3AgKyAncHgnO1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlLndpZHRoID0gcmVjdC53aWR0aCArICdweCc7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuaGVpZ2h0ID0gcmVjdC5oZWlnaHQgKyAncHgnO1xyXG4gICAgICAgICAgICBpZiAodGhpcy4kJHJvdCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiQkcm90LmNvbW1pdFN0YXR1cygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBwcm94eS5yZXNldCgpO1xyXG4gICAgICAgIHByb3h5LiRwcm94eW9mID0gZWw7XHJcbiAgICAgICAgcHJveHkuJHRvdWNoYWJsZSQgPSB0cnVlO1xyXG4gICAgICAgIGFsbChwcm94eSwge2NhbGxiYWNrOmZ1bmN0aW9uKG5kOmFueSl7bmQuJGV2dGlnbm9yZSQgPSB0cnVlO319KTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHByb3h5KTtcclxuICAgICAgICBuZXcgRHJhZyhwcm94eSk7XHJcbiAgICAgICAgZWwuJHByb3h5ID0gcHJveHk7XHJcbiAgICAgICAgcmV0dXJuIHByb3h5O1xyXG4gICAgfVxyXG59XHJcblxyXG5sZXQgZmluZ2VyID0gZmluZ2Vycy5maW5nZXI7IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRvdWNoLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInpvb21lci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9mb3VuZGF0aW9uL3NyYy9zY3JpcHQvZWxlbWVudHMudHNcIiAvPlxyXG5cclxubmFtZXNwYWNlIGZpbmdlcnN7XHJcbiAgICBleHBvcnQgY2xhc3MgRmluZ2VyQ29udGV4dHtcclxuICAgICAgICBwcm90ZWN0ZWQgYWN0aXZlRWw6YW55W107XHJcbiAgICAgICAgcHJvdGVjdGVkIG11bHRpYWN0aXZlOmJvb2xlYW47XHJcbiAgICAgICAgZ2V0IGFjdGl2ZUVscygpOmFueVtde1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmVFbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNldHRpbmdzOmFueSl7XHJcbiAgICAgICAgICAgIHRoaXMubXVsdGlhY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVFbCA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZWxlY3QodGFyZ2V0OmFueSl7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5tdWx0aWFjdGl2ZSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZUVsLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVFbC5hZGQodGFyZ2V0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWFjaChjYWxsYmFjazpGdW5jdGlvbik6dm9pZHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrICYmIHRoaXMuYWN0aXZlRWwgJiYgdGhpcy5hY3RpdmVFbC5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaSBvZiB0aGlzLmFjdGl2ZUVsKXtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
