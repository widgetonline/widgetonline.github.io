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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbmdlcnMvc3JjL2RldmljZS50cyIsImZpbmdlcnMvc3JjL3BhdHRlcm5zLnRzIiwiZmluZ2Vycy9zcmMvcmVjb2duaXplci50cyIsImZpbmdlcnMvc3JjL3RvdWNoLnRzIiwiZmluZ2Vycy9zcmMvcm90YXRvci50cyIsImZpbmdlcnMvc3JjL3pvb21lci50cyIsImZpbmdlcnMvc3JjL2Zpbmdlci50cyIsImZpbmdlcnMvc3JjL2ZpbmdlcmNvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsbUVBQW1FO0FBRW5FLElBQVUsT0FBTyxDQXlFaEI7QUF6RUQsV0FBVSxPQUFPLEVBQUEsQ0FBQztJQUNqQjtRQUFBO1FBdUNBLENBQUM7UUF0Q0Esc0JBQVcsdUJBQU87aUJBQWxCO2dCQUNDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUM5QyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQzlCLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLENBQUMsSUFBRyxJQUFJLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUM7WUFDL0IsQ0FBQzs7O1dBQUE7UUFDRCxzQkFBVywwQkFBVTtpQkFBckI7Z0JBQ0MsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2pELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztnQkFDRCxNQUFNLENBQUMsQ0FBQyxJQUFFLElBQUksSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNoQyxDQUFDOzs7V0FBQTtRQUNELHNCQUFXLG1CQUFHO2lCQUFkO2dC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QUNELEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNFLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxDQUFDO2dCQUNMLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekYsQ0FBQztZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxhQUFhLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDOUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzdDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNuQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQSxDQUFDO2dCQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3BELENBQUM7WUFDRCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRVMsdUJBQVMsR0FBbkI7WUFDSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDN0MsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0IsQ0FBQztRQUNTLHVCQUFTLEdBQW5CLFVBQW9CLENBQVU7WUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNuRSxDQUFDO1FBQ1MscUJBQU8sR0FBakIsVUFBa0IsTUFBVSxFQUFFLE9BQWlCO1lBQzNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUEsQ0FBQztnQkFDVixPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDckIsQ0FBQztZQUNELElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDckIsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RCxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLENBQUM7UUFDUywwQkFBWSxHQUF0QjtZQUNJLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN0QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN2RixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM1RixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUMsS0FBSyxFQUFDLENBQUMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUNTLHdCQUFVLEdBQXBCO1lBQ0ksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNGLElBQUksQ0FBQyxHQUFPLEVBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBQyxDQUFDLEVBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FB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Q0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDZjtZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0wsb0JBQUM7SUFBRCxDQXZCQSxBQXVCQyxJQUFBO0lBdkJZLHFCQUFhLGdCQXVCekIsQ0FBQTtBQUNMLENBQUMsRUF6QlMsT0FBTyxLQUFQLE9BQU8sUUF5QmhCIiwiZmlsZSI6ImZpbmdlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZm91bmRhdGlvbi9zcmMvc2NyaXB0L2RlZmluaXRpb25zLnRzXCIgLz5cblxubmFtZXNwYWNlIGZpbmdlcnN7XG5cdGV4cG9ydCBjbGFzcyBNb2JpbGVEZXZpY2V7XG5cdFx0c3RhdGljIGdldCBBbmRyb2lkICgpOmJvb2xlYW4ge1xuXHRcdFx0dmFyIHIgPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpO1xuXHRcdFx0aWYgKHIpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ21hdGNoIEFuZHJvaWQnKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByIT0gbnVsbCAmJiByLmxlbmd0aD4wO1xuXHRcdH1cblx0XHRzdGF0aWMgZ2V0IEJsYWNrQmVycnkoKTpib29sZWFuIHtcblx0XHRcdHZhciByID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQmxhY2tCZXJyeS9pKTtcblx0XHRcdGlmIChyKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdtYXRjaCBBbmRyb2lkJyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gciE9bnVsbCAmJiByLmxlbmd0aCA+IDA7XG5cdFx0fVxuXHRcdHN0YXRpYyBnZXQgaU9TKCk6Ym9vbGVhbiB7XG5cdFx0XHR2YXIgciA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQaG9uZXxpUGFkfGlQb2QvaSk7XG5cdFx0XHRpZiAocikge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnbWF0Y2ggQW5kcm9pZCcpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHIgIT0gbnVsbCAmJiByLmxlbmd0aCA+IDA7XG5cdFx0fVxuXHRcdHN0YXRpYyBnZXQgT3BlcmEoKTpib29sZWFuIHtcblx0XHRcdHZhciByID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvT3BlcmEgTWluaS9pKTtcblx0XHRcdGlmIChyKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdtYXRjaCBBbmRyb2lkJyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gciAhPSBudWxsICYmIHIubGVuZ3RoID4gMDtcblx0XHR9XG5cdFx0c3RhdGljIGdldCBXaW5kb3dzKCk6Ym9vbGVhbiB7XG5cdFx0XHR2YXIgciA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0lFTW9iaWxlL2kpO1xuXHRcdFx0aWYgKHIpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ21hdGNoIEFuZHJvaWQnKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByIT0gbnVsbCAmJiByLmxlbmd0aCA+MDtcblx0XHR9XG5cdFx0c3RhdGljIGdldCBhbnkoKTpib29sZWFuIHtcblx0XHRcdHJldHVybiAoTW9iaWxlRGV2aWNlLkFuZHJvaWQgfHwgTW9iaWxlRGV2aWNlLkJsYWNrQmVycnkgfHwgTW9iaWxlRGV2aWNlLmlPUyB8fCBNb2JpbGVEZXZpY2UuT3BlcmEgfHwgTW9iaWxlRGV2aWNlLldpbmRvd3MpO1xuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBCcm93c2Vye1xuXHRcdC8vIE9wZXJhIDguMCtcblx0XHRzdGF0aWMgZ2V0IGlzT3BlcmEoKTpib29sZWFue1xuXHRcdFx0cmV0dXJuICghIXdpbmRvdy5vcHIgJiYgISF3aW5kb3cub3ByLmFkZG9ucykgfHwgISF3aW5kb3cub3BlcmEgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCcgT1BSLycpID49IDA7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIEZpcmVmb3ggMS4wK1xuXHRcdHN0YXRpYyBnZXQgaXNGaXJlZm94KCk6Ym9vbGVhbntcblx0XHRcdHJldHVybiB0eXBlb2Ygd2luZG93Lkluc3RhbGxUcmlnZ2VyICE9PSAndW5kZWZpbmVkJztcblx0XHR9XG5cdFx0Ly8gQXQgbGVhc3QgU2FmYXJpIDMrOiBcIltvYmplY3QgSFRNTEVsZW1lbnRDb25zdHJ1Y3Rvcl1cIlxuXHRcdHN0YXRpYyBnZXQgaXNTYWZhcmkoKTpib29sZWFue1xuXHRcdFx0cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChIVE1MRWxlbWVudCkuaW5kZXhPZignQ29uc3RydWN0b3InKSA+IDA7XG5cdFx0fSBcblx0XHQvLyBJbnRlcm5ldCBFeHBsb3JlciA2LTExXG5cdFx0c3RhdGljIGdldCBpc0lFKCk6Ym9vbGVhbntcblx0XHRcdHJldHVybiAvKkBjY19vbiFAKi9mYWxzZSB8fCAhIWRvY3VtZW50LmRvY3VtZW50TW9kZTtcblx0XHR9XG5cdFx0Ly8gRWRnZSAyMCtcblx0XHRzdGF0aWMgZ2V0IGlzRWRnZSgpOmJvb2xlYW57XG5cdFx0XHRyZXR1cm4gIUJyb3dzZXIuaXNJRSAmJiAhIXdpbmRvdy5TdHlsZU1lZGlhO1xuXHRcdH1cblx0XHQvLyBDaHJvbWUgMStcblx0XHRzdGF0aWMgZ2V0IGlzQ2hyb21lKCk6Ym9vbGVhbntcblx0XHRcdHJldHVybiAhIXdpbmRvdy5jaHJvbWUgJiYgISF3aW5kb3cuY2hyb21lLndlYnN0b3JlO1xuXHRcdH1cblx0XHQvLyBCbGluayBlbmdpbmUgZGV0ZWN0aW9uXG5cdFx0c3RhdGljIGdldCBpc0JsaW5rKCk6Ym9vbGVhbntcblx0XHRcdHJldHVybiAoQnJvd3Nlci5pc0Nocm9tZSB8fCBCcm93c2VyLmlzT3BlcmEpICYmICEhd2luZG93LkNTUztcblx0XHR9XG5cdH1cbn0iLCJcbm5hbWVzcGFjZSBmaW5nZXJze1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgaXBhdHRlcm57XG4gICAgICAgIHZlcmlmeShhY3RzOmlhY3RbXSwgcXVldWU6YW55W10sIG91dHE/OmlhY3RbXSk6Ym9vbGVhbjtcbiAgICAgICAgcmVjb2duaXplKHF1ZXVlOmFueVtdLCBvdXRxPzppYWN0W10pOmFueTtcbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IFBhdHRlcm5zOmFueSA9IHt9O1xuICAgIFxuICAgIGNsYXNzIFRvdWNoZWRQYXR0ZXJuIGltcGxlbWVudHMgaXBhdHRlcm57XG4gICAgICAgIHZlcmlmeShhY3RzOmlhY3RbXSwgcXVldWU6YW55W10sIG91dHE/OmlhY3RbXSk6Ym9vbGVhbntcbiAgICAgICAgICAgIGxldCBybHQgPSBhY3RzLmxlbmd0aCA9PSAxICYmIGFjdHNbMF0uYWN0ID09IFwidG91Y2hlbmRcIiAmJiBxdWV1ZS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgcmV0dXJuIHJsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlY29nbml6ZShxdWV1ZTphbnlbXSwgb3V0cTppYWN0W10pOmFueXtcbiAgICAgICAgICAgIGxldCBwcmV2ID0gcXVldWVbMV07XG4gICAgICAgICAgICAvL2RlYnVnZ2VyO1xuICAgICAgICAgICAgaWYgKHByZXYgJiYgcHJldi5sZW5ndGggPT0gMSl7XG4gICAgICAgICAgICAgICAgbGV0IGFjdCA9IHByZXZbMF07XG4gICAgICAgICAgICAgICAgbGV0IGRyYWcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAob3V0cSAhPSBudWxsICYmIG91dHEubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYWN0OmFueSA9IG91dHFbMF07XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYWN0ICYmIChwYWN0LmFjdCA9PSBcImRyYWdnaW5nXCIgfHwgcGFjdC5hY3QgPT0gXCJkcmFnc3RhcnRcIikpe1xuICAgICAgICAgICAgICAgICAgICAgICAgZHJhZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFkcmFnKXsgXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaT0wOyBpPDM7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcSA9IHF1ZXVlW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHFbMF0uYWN0ID09IFwidG91Y2hzdGFydFwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Q6XCJ0b3VjaGVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNwb3M6W2FjdC5jcG9zWzBdLCBhY3QuY3Bvc1sxXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6YWN0LnRpbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBjbGFzcyBEcmFnZ2luZ1BhdHRlcm4gaW1wbGVtZW50cyBpcGF0dGVybntcbiAgICAgICAgdmVyaWZ5KGFjdHM6aWFjdFtdLCBxdWV1ZTphbnlbXSk6Ym9vbGVhbntcbiAgICAgICAgICAgIGxldCBybHQgPSBhY3RzLmxlbmd0aCA9PSAxIFxuICAgICAgICAgICAgICAgICYmIGFjdHNbMF0uYWN0ID09IFwidG91Y2htb3ZlXCIgXG4gICAgICAgICAgICAgICAgJiYgcXVldWUubGVuZ3RoID4gMjtcbiAgICAgICAgICAgIGlmIChybHQpe1xuICAgICAgICAgICAgICAgIHJsdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGxldCBzMSA9IHF1ZXVlWzJdO1xuICAgICAgICAgICAgICAgIGxldCBzMiA9IHF1ZXVlWzFdO1xuICAgICAgICAgICAgICAgIGlmIChzMS5sZW5ndGggPT0gMSAmJiBzMi5sZW5ndGggPT0gMSl7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhMSA9IHMxWzBdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYTIgPSBzMlswXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGExLmFjdCA9PSBcInRvdWNoc3RhcnRcIil7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2RlYnVnZ2VyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChhMS5hY3QgPT0gXCJ0b3VjaHN0YXJ0XCIgJiYgYTIuYWN0ID09IFwidG91Y2htb3ZlXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYgKGExLmFjdCA9PSBcInRvdWNobW92ZVwiICYmIGEyLmFjdCA9PSBcInRvdWNobW92ZVwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlY29nbml6ZShxdWV1ZTphbnlbXSxvdXRxOmlhY3RbXSk6YW55e1xuICAgICAgICAgICAgbGV0IHByZXYgPSBxdWV1ZVsyXTtcbiAgICAgICAgICAgIGlmIChwcmV2Lmxlbmd0aCA9PSAxKXtcbiAgICAgICAgICAgICAgICBsZXQgYWN0ID0gcHJldlswXTtcbiAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGFjdC5hY3QgPT0gXCJ0b3VjaHN0YXJ0XCIpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0OlwiZHJhZ3N0YXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcG9zOlthY3QuY3Bvc1swXSwgYWN0LmNwb3NbMV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZTphY3QudGltZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmIChhY3QuYWN0ID09IFwidG91Y2htb3ZlXCIgJiYgb3V0cS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJhY3QgPSBvdXRxWzBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmFjdC5hY3QgPT0gXCJkcmFnc3RhcnRcIiB8fCByYWN0LmFjdCA9PSBcImRyYWdnaW5nXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Q6XCJkcmFnZ2luZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNwb3M6W2FjdC5jcG9zWzBdLCBhY3QuY3Bvc1sxXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZTphY3QudGltZVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgRHJvcFBhdHRlcm4gaW1wbGVtZW50cyBpcGF0dGVybntcbiAgICAgICAgdmVyaWZ5KGFjdHM6aWFjdFtdLCBxdWV1ZTphbnlbXSwgb3V0cT86aWFjdFtdKTpib29sZWFue1xuICAgICAgICAgICAgbGV0IHJsdCA9IGFjdHMubGVuZ3RoID09IDEgJiYgYWN0c1swXS5hY3QgPT0gXCJ0b3VjaGVuZFwiICYmIHF1ZXVlLmxlbmd0aCA+IDAgJiYgb3V0cS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgcmV0dXJuIHJsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlY29nbml6ZShxdWV1ZTphbnlbXSxvdXRxOmlhY3RbXSk6YW55e1xuICAgICAgICAgICAgLy9sZXQgcHJldiA9IHF1ZXVlWzFdO1xuICAgICAgICAgICAgbGV0IGFjdCA9IG91dHFbMF07XG4gICAgICAgICAgICBpZiAoYWN0LmFjdCA9PSBcImRyYWdnaW5nXCIgfHwgYWN0LmFjdCA9PSBcImRyYWdzdGFydFwiKXtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBhY3Q6XCJkcm9wcGVkXCIsXG4gICAgICAgICAgICAgICAgICAgIGNwb3M6W2FjdC5jcG9zWzBdLCBhY3QuY3Bvc1sxXV0sXG4gICAgICAgICAgICAgICAgICAgIHRpbWU6YWN0LnRpbWVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBEYmxUb3VjaGVkUGF0dGVybiBpbXBsZW1lbnRzIGlwYXR0ZXJue1xuICAgICAgICB2ZXJpZnkoYWN0czppYWN0W10sIHF1ZXVlOmFueVtdKTpib29sZWFue1xuICAgICAgICAgICAgbGV0IHJsdCA9IGFjdHMubGVuZ3RoID09IDEgJiYgYWN0c1swXS5hY3QgPT0gXCJ0b3VjaGVuZFwiICYmIHF1ZXVlLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICByZXR1cm4gcmx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmVjb2duaXplKHF1ZXVlOmFueVtdLCBvdXRxOmlhY3RbXSk6YW55e1xuICAgICAgICAgICAgbGV0IHByZXYgPSBxdWV1ZVsxXTtcbiAgICAgICAgICAgIGlmIChwcmV2ICYmIHByZXYubGVuZ3RoID09IDEpe1xuICAgICAgICAgICAgICAgIGxldCBhY3QgPSBwcmV2WzBdO1xuICAgICAgICAgICAgICAgIGlmIChvdXRxICE9IG51bGwgJiYgb3V0cS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhY3Q6YW55ID0gb3V0cVswXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhY3QgJiYgcGFjdC5hY3QgPT0gXCJ0b3VjaGVkXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdC5hY3QgPT0gXCJ0b3VjaHN0YXJ0XCIgfHwgYWN0LmFjdCA9PSBcInRvdWNobW92ZVwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0LnRpbWUgLSBwYWN0LnRpbWUgPCA1MDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0OlwiZGJsdG91Y2hlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3BvczpbYWN0LmNwb3NbMF0sIGFjdC5jcG9zWzFdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6YWN0LnRpbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdDpcInRvdWNoZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNwb3M6W2FjdC5jcG9zWzBdLCBhY3QuY3Bvc1sxXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lOmFjdC50aW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxjQW5nbGUoYTppYWN0LCBiOmlhY3QsIGxlbjpudW1iZXIpOm51bWJlcntcbiAgICAgICAgbGV0IGFnID0gTWF0aC5hY29zKChiLmNwb3NbMF0gLSBhLmNwb3NbMF0pL2xlbikgLyBNYXRoLlBJICogMTgwO1xuICAgICAgICBpZiAoYi5jcG9zWzFdIDwgYS5jcG9zWzFdKXtcbiAgICAgICAgICAgIGFnKj0tMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWc7XG4gICAgfVxuXG4gICAgY2xhc3MgWm9vbVN0YXJ0UGF0dGVybiBpbXBsZW1lbnRzIGlwYXR0ZXJue1xuICAgICAgICB2ZXJpZnkoYWN0czppYWN0W10sIHF1ZXVlOmFueVtdLCBvdXRxPzppYWN0W10pOmJvb2xlYW57XG4gICAgICAgICAgICBsZXQgcmx0ID0gYWN0cy5sZW5ndGggPT0gMiBcbiAgICAgICAgICAgICAgICAmJiAoKGFjdHNbMF0uYWN0ID09IFwidG91Y2hzdGFydFwiIHx8IGFjdHNbMV0uYWN0ID09IFwidG91Y2hzdGFydFwiKVxuICAgICAgICAgICAgICAgICAgICB8fChvdXRxLmxlbmd0aCA+IDAgXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBhY3RzWzBdLmFjdCA9PSBcInRvdWNobW92ZVwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgYWN0c1sxXS5hY3QgPT0gXCJ0b3VjaG1vdmVcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIG91dHFbMF0uYWN0ICE9IFwiem9vbWluZ1wiIFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgb3V0cVswXS5hY3QgIT0gXCJ6b29tc3RhcnRcIiApKTtcbiAgICAgICAgICAgIHJldHVybiBybHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZWNvZ25pemUocXVldWU6YW55W10sIG91dHE6aWFjdFtdKTphbnl7XG4gICAgICAgICAgICBsZXQgYWN0cyA9IHF1ZXVlWzBdO1xuICAgICAgICAgICAgbGV0IGE6aWFjdCA9IGFjdHNbMF07XG4gICAgICAgICAgICBsZXQgYjppYWN0ID0gYWN0c1sxXTtcbiAgICAgICAgICAgIGxldCBsZW4gPSBNYXRoLnNxcnQoKGIuY3Bvc1swXSAtIGEuY3Bvc1swXSkqKGIuY3Bvc1swXSAtIGEuY3Bvc1swXSkgKyAoYi5jcG9zWzFdIC0gYS5jcG9zWzFdKSooYi5jcG9zWzFdIC0gYS5jcG9zWzFdKSk7XG4gICAgICAgICAgICBsZXQgb3dpZHRoID0gTWF0aC5hYnMoYi5jcG9zWzBdIC0gYS5jcG9zWzBdKTtcbiAgICAgICAgICAgIGxldCBvaGVpZ2h0ID0gTWF0aC5hYnMoYi5jcG9zWzFdIC0gYS5jcG9zWzFdKTtcbiAgICAgICAgICAgIGxldCBhZyA9IGNhbGNBbmdsZShhLCBiLCBsZW4pOyAvL01hdGguYWNvcygoYi5jcG9zWzBdIC0gYS5jcG9zWzBdKS9sZW4pIC8gTWF0aC5QSSAqIDE4MDtcbiAgICAgICAgICAgIGxldCByOmlhY3QgPSB7XG4gICAgICAgICAgICAgICAgYWN0Olwiem9vbXN0YXJ0XCIsXG4gICAgICAgICAgICAgICAgY3BvczpbKGEuY3Bvc1swXSArIGIuY3Bvc1swXSkvMiwgKGEuY3Bvc1sxXSArIGIuY3Bvc1sxXSkvMl0sXG4gICAgICAgICAgICAgICAgbGVuOmxlbixcbiAgICAgICAgICAgICAgICBhbmdsZTphZyxcbiAgICAgICAgICAgICAgICBvd2lkdGg6b3dpZHRoLFxuICAgICAgICAgICAgICAgIG9oZWlnaHQ6b2hlaWdodCxcbiAgICAgICAgICAgICAgICB0aW1lOmEudGltZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgWm9vbVBhdHRlcm4gaW1wbGVtZW50cyBpcGF0dGVybntcbiAgICAgICAgdmVyaWZ5KGFjdHM6aWFjdFtdLCBxdWV1ZTphbnlbXSwgb3V0cT86aWFjdFtdKTpib29sZWFue1xuICAgICAgICAgICAgbGV0IHJsdCA9IGFjdHMubGVuZ3RoID09IDIgXG4gICAgICAgICAgICAgICAgJiYgKGFjdHNbMF0uYWN0ICE9IFwidG91Y2hlbmRcIiAmJiBhY3RzWzFdLmFjdCAhPSBcInRvdWNoZW5kXCIpXG4gICAgICAgICAgICAgICAgJiYgKGFjdHNbMF0uYWN0ID09IFwidG91Y2htb3ZlXCIgfHwgYWN0c1sxXS5hY3QgPT0gXCJ0b3VjaG1vdmVcIilcbiAgICAgICAgICAgICAgICAmJiBvdXRxLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAmJiAob3V0cVswXS5hY3QgPT0gXCJ6b29tc3RhcnRcIiB8fCBvdXRxWzBdLmFjdCA9PSBcInpvb21pbmdcIik7XG4gICAgICAgICAgICByZXR1cm4gcmx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmVjb2duaXplKHF1ZXVlOmFueVtdLCBvdXRxOmlhY3RbXSk6YW55e1xuICAgICAgICAgICAgbGV0IGFjdHMgPSBxdWV1ZVswXTtcbiAgICAgICAgICAgIGxldCBhOmlhY3QgPSBhY3RzWzBdO1xuICAgICAgICAgICAgbGV0IGI6aWFjdCA9IGFjdHNbMV07XG4gICAgICAgICAgICBsZXQgbGVuID0gTWF0aC5zcXJ0KChiLmNwb3NbMF0gLSBhLmNwb3NbMF0pKihiLmNwb3NbMF0gLSBhLmNwb3NbMF0pICsgKGIuY3Bvc1sxXSAtIGEuY3Bvc1sxXSkqKGIuY3Bvc1sxXSAtIGEuY3Bvc1sxXSkpO1xuICAgICAgICAgICAgbGV0IGFnID0gY2FsY0FuZ2xlKGEsIGIsIGxlbik7IC8vTWF0aC5hY29zKChiLmNwb3NbMF0gLSBhLmNwb3NbMF0pL2xlbikgLyBNYXRoLlBJICogMTgwO1xuICAgICAgICAgICAgbGV0IG93aWR0aCA9IE1hdGguYWJzKGIuY3Bvc1swXSAtIGEuY3Bvc1swXSk7XG4gICAgICAgICAgICBsZXQgb2hlaWdodCA9IE1hdGguYWJzKGIuY3Bvc1sxXSAtIGEuY3Bvc1sxXSk7XG4gICAgICAgICAgICBsZXQgcjppYWN0ID0ge1xuICAgICAgICAgICAgICAgIGFjdDpcInpvb21pbmdcIixcbiAgICAgICAgICAgICAgICBjcG9zOlsoYS5jcG9zWzBdICsgYi5jcG9zWzBdKS8yLCAoYS5jcG9zWzFdICsgYi5jcG9zWzFdKS8yXSxcbiAgICAgICAgICAgICAgICBsZW46bGVuLFxuICAgICAgICAgICAgICAgIGFuZ2xlOmFnLFxuICAgICAgICAgICAgICAgIG93aWR0aDpvd2lkdGgsXG4gICAgICAgICAgICAgICAgb2hlaWdodDpvaGVpZ2h0LFxuICAgICAgICAgICAgICAgIHRpbWU6YS50aW1lXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBab29tRW5kUGF0dGVybiBpbXBsZW1lbnRzIGlwYXR0ZXJue1xuICAgICAgICB2ZXJpZnkoYWN0czppYWN0W10sIHF1ZXVlOmFueVtdLCBvdXRxPzppYWN0W10pOmJvb2xlYW57XG4gICAgICAgICAgICBsZXQgcmx0ID0gb3V0cS5sZW5ndGggPiAwIFxuICAgICAgICAgICAgICAgICYmIChvdXRxWzBdLmFjdCA9PSBcInpvb21zdGFydFwiIHx8IG91dHFbMF0uYWN0ID09IFwiem9vbWluZ1wiKVxuICAgICAgICAgICAgICAgICYmIGFjdHMubGVuZ3RoIDw9MjtcbiAgICAgICAgICAgIGlmIChybHQpe1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5kaXIoYWN0cyk7XG4gICAgICAgICAgICAgICAgaWYgKGFjdHMubGVuZ3RoIDwgMil7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGkgb2YgYWN0cyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaS5hY3QgPT0gXCJ0b3VjaGVuZFwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlY29nbml6ZShxdWV1ZTphbnlbXSwgb3V0cTppYWN0W10pOmFueXtcbiAgICAgICAgICAgIGxldCByOmlhY3QgPSB7XG4gICAgICAgICAgICAgICAgYWN0Olwiem9vbWVuZFwiLFxuICAgICAgICAgICAgICAgIGNwb3M6WzAsIDBdLFxuICAgICAgICAgICAgICAgIGxlbjowLFxuICAgICAgICAgICAgICAgIGFuZ2xlOjAsXG4gICAgICAgICAgICAgICAgb3dpZHRoOjAsXG4gICAgICAgICAgICAgICAgb2hlaWdodDowLFxuICAgICAgICAgICAgICAgIHRpbWU6bmV3IERhdGUoKS5nZXRUaW1lKClcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgUGF0dGVybnMuem9vbWVuZCA9IG5ldyBab29tRW5kUGF0dGVybigpO1xuICAgIFBhdHRlcm5zLnpvb21pbmcgPSBuZXcgWm9vbVBhdHRlcm4oKTtcbiAgICBQYXR0ZXJucy56b29tc3RhcnQgPSBuZXcgWm9vbVN0YXJ0UGF0dGVybigpO1xuICAgIFBhdHRlcm5zLmRyYWdnaW5nID0gbmV3IERyYWdnaW5nUGF0dGVybigpO1xuICAgIFBhdHRlcm5zLmRyb3BwZWQgPSBuZXcgRHJvcFBhdHRlcm4oKTtcbiAgICBQYXR0ZXJucy50b3VjaGVkID0gbmV3IFRvdWNoZWRQYXR0ZXJuKCk7XG4gICAgUGF0dGVybnMuZGJsdG91Y2hlZCA9IG5ldyBEYmxUb3VjaGVkUGF0dGVybigpO1xufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2ZvdW5kYXRpb24vc3JjL3NjcmlwdC9kZWZpbml0aW9ucy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9wYXR0ZXJucy50c1wiIC8+XG5cbm5hbWVzcGFjZSBmaW5nZXJze1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgaWFjdHtcbiAgICAgICAgYWN0OnN0cmluZyxcbiAgICAgICAgY3BvczpudW1iZXJbXSxcbiAgICAgICAgcnBvcz86bnVtYmVyW10sXG4gICAgICAgIG9oZWlnaHQ/Om51bWJlcixcbiAgICAgICAgb3dpZHRoPzpudW1iZXIsXG4gICAgICAgIGxlbj86bnVtYmVyLFxuICAgICAgICBhbmdsZT86bnVtYmVyLFxuICAgICAgICB0aW1lPzpudW1iZXJcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUmVjb2duaXplcntcbiAgICAgICAgaW5xdWV1ZTphbnlbXSA9IFtdO1xuICAgICAgICBvdXRxdWV1ZTppYWN0W10gPSBbXTtcbiAgICAgICAgcGF0dGVybnM6aXBhdHRlcm5bXSA9IFtdO1xuICAgICAgICBjZmc6YW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNmZzphbnkpe1xuICAgICAgICAgICAgbGV0IGRlZnBhdHRlcm5zID0gW1wiem9vbWVuZFwiLCBcInpvb21zdGFydFwiLCBcInpvb21pbmdcIiwgXCJkYmx0b3VjaGVkXCIsIFwidG91Y2hlZFwiLCBcImRyb3BwZWRcIiwgXCJkcmFnZ2luZ1wiXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFjZmcpe1xuICAgICAgICAgICAgICAgIGNmZyA9IHtwYXR0ZXJuczpkZWZwYXR0ZXJuc307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghY2ZnLnBhdHRlcm5zKXtcbiAgICAgICAgICAgICAgICBjZmcucGF0dGVybnMgPSBkZWZwYXR0ZXJucztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jZmcgPSBjZmc7XG4gICAgICAgICAgICBmb3IobGV0IGkgb2YgY2ZnLnBhdHRlcm5zKXtcbiAgICAgICAgICAgICAgICBpZiAoUGF0dGVybnNbaV0pe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhdHRlcm5zLmFkZChQYXR0ZXJuc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBwYXJzZShhY3RzOmlhY3RbXSk6dm9pZHtcbiAgICAgICAgICAgIGlmICghdGhpcy5jZmcucWxlbil7XG4gICAgICAgICAgICAgICAgdGhpcy5jZmcucWxlbiA9IDEyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmlucXVldWUuc3BsaWNlKDAsIDAsIGFjdHMpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5xdWV1ZS5sZW5ndGggPiB0aGlzLmNmZy5xbGVuKXtcbiAgICAgICAgICAgICAgICB0aGlzLmlucXVldWUuc3BsaWNlKHRoaXMuaW5xdWV1ZS5sZW5ndGggLSAxLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHRoaXMuY2ZnLm9uICYmIHRoaXMuY2ZnLm9uLnRhcCl7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBpIG9mIGFjdHMpe1xuICAgICAgICAgICAgICAgICAgICAvL2FjdHMubGVuZ3RoID49IDEgJiYgYWN0c1swXS5hY3QgPT0gXCJ0b3VjaHN0YXJ0XCIgJiZcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkuYWN0ID09IFwidG91Y2hzdGFydFwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2ZnLm9uLnRhcChhY3RzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IobGV0IHBhdHRlcm4gb2YgdGhpcy5wYXR0ZXJucyl7XG4gICAgICAgICAgICAgICAgaWYgKHBhdHRlcm4udmVyaWZ5KGFjdHMsIHRoaXMuaW5xdWV1ZSwgdGhpcy5vdXRxdWV1ZSkpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmx0ID0gcGF0dGVybi5yZWNvZ25pemUodGhpcy5pbnF1ZXVlLCB0aGlzLm91dHF1ZXVlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJsdCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHF1ZXVlLnNwbGljZSgwLCAwLCBybHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3V0cXVldWUubGVuZ3RoID4gdGhpcy5jZmcucWxlbil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRxdWV1ZS5zcGxpY2UodGhpcy5vdXRxdWV1ZS5sZW5ndGggLSAxLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBxID0gdGhpcy5pbnF1ZXVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnF1ZXVlID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBxLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jZmcub24gJiYgdGhpcy5jZmcub25bcmx0LmFjdF0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2ZnLm9uW3JsdC5hY3RdKHJsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jZmcub25yZWNvZ25pemVkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNmZy5vbnJlY29nbml6ZWQocmx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJyZWNvZ25pemVyLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJkZXZpY2UudHNcIiAvPlxuXG5uYW1lc3BhY2UgZmluZ2Vyc3tcbiAgICBsZXQgaW5pdGVkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICBcbiAgICBjbGFzcyB6b29tc2lte1xuICAgICAgICBvcHBvOmlhY3Q7XG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGUoYWN0OmlhY3QpOnZvaWR7XG4gICAgICAgICAgICBsZXQgbSA9IFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgvMiwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodC8yXTtcbiAgICAgICAgICAgIHRoaXMub3BwbyA9IHthY3Q6YWN0LmFjdCwgY3BvczpbMiptWzBdIC0gYWN0LmNwb3NbMF0sIDIqbVsxXSAtIGFjdC5jcG9zWzFdXSwgdGltZTphY3QudGltZX07XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGFjdC5jcG9zWzFdLCBtWzFdLCB0aGlzLm9wcG8uY3Bvc1sxXSk7XG4gICAgICAgIH1cbiAgICAgICAgc3RhcnQoYWN0OmlhY3QpOmlhY3RbXXtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlKGFjdCk7XG4gICAgICAgICAgICByZXR1cm4gW2FjdCwgdGhpcy5vcHBvXTtcbiAgICAgICAgfVxuICAgICAgICB6b29tKGFjdDppYWN0KTppYWN0W117XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZShhY3QpO1xuICAgICAgICAgICAgcmV0dXJuIFthY3QsIHRoaXMub3Bwb107XG4gICAgICAgIH1cbiAgICAgICAgZW5kKGFjdDppYWN0KTppYWN0W117XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZShhY3QpO1xuICAgICAgICAgICAgcmV0dXJuIFthY3QsIHRoaXMub3Bwb107XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgY2xhc3Mgb2Zmc2V0c2ltIGV4dGVuZHMgem9vbXNpbXtcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZShhY3Q6aWFjdCk6dm9pZHtcbiAgICAgICAgICAgIHRoaXMub3BwbyA9IHthY3Q6YWN0LmFjdCwgY3BvczpbYWN0LmNwb3NbMF0gKyAxMDAsIGFjdC5jcG9zWzFdICsgMTAwXSwgdGltZTphY3QudGltZX07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgenM6em9vbXNpbSA9IG51bGw7XG4gICAgbGV0IG9zOm9mZnNldHNpbSA9IG51bGw7XG5cbiAgICBmdW5jdGlvbiBnZXRvdWNoZXMoZXZlbnQ6YW55LCBpc2VuZD86Ym9vbGVhbik6YW55e1xuICAgICAgICBpZiAoaXNlbmQpe1xuICAgICAgICAgICAgcmV0dXJuIGV2ZW50LmNoYW5nZWRUb3VjaGVzO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJldHVybiBldmVudC50b3VjaGVzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHRvdWNoKGNmZzphbnkpOmFueXtcbiAgICAgICAgbGV0IHJnOlJlY29nbml6ZXIgPSBuZXcgUmVjb2duaXplcihjZmcpO1xuICAgICAgICBsZXQgc2hpZnRkb3duID0gZmFsc2U7XG4gICAgICAgIGxldCBjdHJsZG93biA9IGZhbHNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUFjdChuYW1lOnN0cmluZywgeDpudW1iZXIsIHk6bnVtYmVyKTppYWN0e1xuICAgICAgICAgICAgcmV0dXJuIHthY3Q6bmFtZSwgY3BvczpbeCwgeV0sIHRpbWU6bmV3IERhdGUoKS5nZXRUaW1lKCl9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlKGNmZzphbnksIGFjdHM6aWFjdFtdKTp2b2lke1xuICAgICAgICAgICAgaWYgKCFjZmcgfHwgIWNmZy5lbmFibGVkKXtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjZmcub25hY3Qpe1xuICAgICAgICAgICAgICAgIGNmZy5vbmFjdChyZy5pbnF1ZXVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmcucGFyc2UoYWN0cyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWluaXRlZCl7XG4gICAgICAgICAgICBkb2N1bWVudC5vbmNvbnRleHRtZW51ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoIWZpbmdlcnMuTW9iaWxlRGV2aWNlLmFueSl7XG4gICAgICAgICAgICAgICAgenMgPSBuZXcgem9vbXNpbSgpO1xuICAgICAgICAgICAgICAgIG9zID0gbmV3IG9mZnNldHNpbSgpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICAgICAgc2hpZnRkb3duID0gZXZlbnQuc2hpZnRLZXk7XG4gICAgICAgICAgICAgICAgICAgIGN0cmxkb3duID0gZXZlbnQuY3RybEtleTtcbiAgICAgICAgICAgICAgICB9KTsgICAgIFxuXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICAgICAgc2hpZnRkb3duID0gZXZlbnQuc2hpZnRLZXk7XG4gICAgICAgICAgICAgICAgICAgIGN0cmxkb3duID0gZXZlbnQuY3RybEtleTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgYWN0OmlhY3QgPSBjcmVhdGVBY3QoXCJ0b3VjaHN0YXJ0XCIsIGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQuYnV0dG9uID09IDAgJiYgIXNoaWZ0ZG93biAmJiAhY3RybGRvd24pe1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlKGNmZywgW2FjdF0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmJ1dHRvbiA9PSAyIHx8IChzaGlmdGRvd24gJiYgY3RybGRvd24pKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHpzLnN0YXJ0KGFjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGUoY2ZnLCBbYWN0LCB6cy5vcHBvXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuYnV0dG9uID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9zLnN0YXJ0KGFjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGUoY2ZnLCBbYWN0LCBvcy5vcHBvXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgYWN0OmlhY3QgPSBjcmVhdGVBY3QoXCJ0b3VjaG1vdmVcIiwgZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5idXR0b24gPT0gMCAmJiAhc2hpZnRkb3duICYmICFjdHJsZG93bil7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGUoY2ZnLCBbYWN0XSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuYnV0dG9uID09IDIgfHwgKHNoaWZ0ZG93biAmJiBjdHJsZG93bikpe1xuICAgICAgICAgICAgICAgICAgICAgICAgenMuc3RhcnQoYWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZShjZmcsIFthY3QsIHpzLm9wcG9dKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5idXR0b24gPT0gMSB8fCBjdHJsZG93bikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3Muc3RhcnQoYWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZShjZmcsIFthY3QsIG9zLm9wcG9dKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgYWN0OmlhY3QgPSBjcmVhdGVBY3QoXCJ0b3VjaGVuZFwiLCBldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiA9PSAwICYmICFzaGlmdGRvd24gJiYgIWN0cmxkb3duKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZShjZmcsIFthY3RdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5idXR0b24gPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3Muc3RhcnQoYWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZShjZmcsIFthY3QsIG9zLm9wcG9dKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5idXR0b24gPT0gMiB8fCBzaGlmdGRvd24gfHwgY3RybGRvd24pe1xuICAgICAgICAgICAgICAgICAgICAgICAgenMuc3RhcnQoYWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZShjZmcsIFthY3QsIHpzLm9wcG9dKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgYWN0czppYWN0W10gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRvdWNoZXMgPSBnZXRvdWNoZXMoZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDsgaTx0b3VjaGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpdGVtID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWN0OmlhY3QgPSBjcmVhdGVBY3QoXCJ0b3VjaHN0YXJ0XCIsIGl0ZW0uY2xpZW50WCwgaXRlbS5jbGllbnRZKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdHMuYWRkKGFjdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlKGNmZywgYWN0cyk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgYWN0czppYWN0W10gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRvdWNoZXMgPSBnZXRvdWNoZXMoZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDsgaSA8IHRvdWNoZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSBldmVudC5jaGFuZ2VkVG91Y2hlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhY3Q6aWFjdCA9IGNyZWF0ZUFjdChcInRvdWNobW92ZVwiLCBpdGVtLmNsaWVudFgsIGl0ZW0uY2xpZW50WSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RzLmFkZChhY3QpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZShjZmcsIGFjdHMpO1xuICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEJyb3dzZXIuaXNTYWZhcmkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhY3RzOmlhY3RbXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdG91Y2hlcyA9IGdldG91Y2hlcyhldmVudCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaT0wOyBpIDwgdG91Y2hlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFjdDppYWN0ID0gY3JlYXRlQWN0KFwidG91Y2hlbmRcIiwgaXRlbS5jbGllbnRYLCBpdGVtLmNsaWVudFkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0cy5hZGQoYWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBoYW5kbGUoY2ZnLCBhY3RzKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluaXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNmZztcbiAgICB9XG59XG5cbmxldCB0b3VjaCA9IGZpbmdlcnMudG91Y2g7IiwiXG5uYW1lc3BhY2UgZmluZ2Vyc3tcbiAgICBjbGFzcyBSb3R7XG4gICAgICAgIHByb3RlY3RlZCBvcmlnaW46YW55O1xuICAgICAgICBwcm90ZWN0ZWQgY210OmFueTtcbiAgICAgICAgcHJvdGVjdGVkIGNhY2hlOmFueTtcblxuICAgICAgICBwcm90ZWN0ZWQgc3RhdHVzOmFueVtdO1xuXG4gICAgICAgIHRhcmdldDphbnk7XG5cbiAgICAgICAgcHJvdGVjdGVkIGNlbnRlcjphbnk7XG4gICAgICAgIHByb3RlY3RlZCBvZmZzZXQ6bnVtYmVyW107XG4gICAgICAgIGNvbnN0cnVjdG9yKGVsOmFueSl7XG4gICAgICAgICAgICBpZiAoIWVsKXtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9IGVsO1xuICAgICAgICAgICAgZWwuJHJvdCQgPSB0aGlzO1xuICAgICAgICAgICAgbGV0IHBvcyA9IFtlbC5hc3R5bGUoW1wibGVmdFwiXSksIGVsLmFzdHlsZShbXCJ0b3BcIl0pXTtcbiAgICAgICAgICAgIGVsLnN0eWxlLmxlZnQgPSBwb3NbMF07XG4gICAgICAgICAgICBlbC5zdHlsZS50b3AgPSBwb3NbMV07XG4gICAgICAgICAgICBsZXQgcmMgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0ge1xuICAgICAgICAgICAgICAgIGNlbnRlcjpbcmMud2lkdGgvMiwgcmMuaGVpZ2h0LzJdLCBcbiAgICAgICAgICAgICAgICBhbmdsZTowLCBcbiAgICAgICAgICAgICAgICBzY2FsZTpbMSwxXSwgXG4gICAgICAgICAgICAgICAgcG9zOltwYXJzZUZsb2F0KHBvc1swXSksIHBhcnNlRmxvYXQocG9zWzFdKV0sXG4gICAgICAgICAgICAgICAgc2l6ZTpbcmMud2lkdGgsIHJjLmhlaWdodF1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmNtdCA9IHtcbiAgICAgICAgICAgICAgICBjZW50ZXI6W3JjLndpZHRoLzIsIHJjLmhlaWdodC8yXSwgXG4gICAgICAgICAgICAgICAgYW5nbGU6MCwgXG4gICAgICAgICAgICAgICAgc2NhbGU6WzEsMV0sIFxuICAgICAgICAgICAgICAgIHBvczpbcGFyc2VGbG9hdChwb3NbMF0pLCBwYXJzZUZsb2F0KHBvc1sxXSldLFxuICAgICAgICAgICAgICAgIHNpemU6W3JjLndpZHRoLCByYy5oZWlnaHRdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5jYWNoZSA9IHtcbiAgICAgICAgICAgICAgICBjZW50ZXI6W3JjLndpZHRoLzIsIHJjLmhlaWdodC8yXSwgXG4gICAgICAgICAgICAgICAgYW5nbGU6MCwgXG4gICAgICAgICAgICAgICAgc2NhbGU6WzEsMV0sIFxuICAgICAgICAgICAgICAgIHBvczpbcGFyc2VGbG9hdChwb3NbMF0pLCBwYXJzZUZsb2F0KHBvc1sxXSldLFxuICAgICAgICAgICAgICAgIHNpemU6W3JjLndpZHRoLCByYy5oZWlnaHRdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFtdO1xuXG4gICAgICAgICAgICB0aGlzLmNlbnRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICB0aGlzLmNlbnRlci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICB0aGlzLmNlbnRlci5zdHlsZS5sZWZ0ID0gJzUwJSc7XG4gICAgICAgICAgICB0aGlzLmNlbnRlci5zdHlsZS50b3AgPSAnNTAlJztcbiAgICAgICAgICAgIHRoaXMuY2VudGVyLnN0eWxlLndpZHRoID0gJzBweCc7XG4gICAgICAgICAgICB0aGlzLmNlbnRlci5zdHlsZS5oZWlnaHQgPSAnMHB4JztcbiAgICAgICAgICAgIHRoaXMuY2VudGVyLnN0eWxlLmJvcmRlciA9ICdzb2xpZCAwcHggYmx1ZSc7XG5cbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKHRoaXMuY2VudGVyKTtcbiAgICAgICAgICAgIHRoaXMuc2V0T3JpZ2luKHRoaXMub3JpZ2luLmNlbnRlcik7XG4gICAgICAgICAgICBlbC5zdHlsZS50cmFuc2Zvcm0gPSBcInJvdGF0ZSgwZGVnKVwiO1xuICAgICAgICAgICAgdGhpcy5wdXNoU3RhdHVzKCk7XG4gICAgICAgIH1cblxuICAgICAgICByb3RhdGUoYXJnOmFueSwgdW5kZWY/OmFueSl7XG4gICAgICAgICAgICBpZiAoIWFyZyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gIFx0XHRcdGxldCBjYWNoZSA9IHRoaXMuY2FjaGU7XG5cdFx0XHRsZXQgb3JpZ2luID0gdGhpcy5jbXQ7XG5cdFx0XHRsZXQgb2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG5cdFx0XHRsZXQgYW5nbGUgPSBhcmcuYW5nbGUsIFxuICAgICAgICAgICAgICAgIGNlbnRlciA9IGFyZy5jZW50ZXIsIFxuICAgICAgICAgICAgICAgIHNjYWxlID0gYXJnLnNjYWxlLCBcbiAgICAgICAgICAgICAgICBwb3MgPSBhcmcucG9zLCBcbiAgICAgICAgICAgICAgICByZXNpemUgPSBhcmcucmVzaXplO1xuICAgICAgICAgICAgaWYgKCFvZmZzZXQpe1xuICAgICAgICAgICAgICAgIG9mZnNldCA9IFswLCAwXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZW50ZXIgIT09IHVuZGVmKXtcbiAgICAgICAgICAgICAgICB0aGlzLnB1c2hTdGF0dXMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldE9yaWdpbihjZW50ZXIpO1xuICAgICAgICAgICAgICAgIGxldCBjc3RhdHVzID0gdGhpcy5wdXNoU3RhdHVzKCk7XG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gdGhpcy5jb3JyZWN0KGNzdGF0dXMsIG9mZnNldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYW5nbGUgfHwgYW5nbGUgPT09IDApe1xuICAgICAgICAgICAgICAgIGNhY2hlLmFuZ2xlID0gb3JpZ2luLmFuZ2xlICsgYW5nbGU7XG4gICAgICAgICAgICAgICAgY2FjaGUuYW5nbGUgPSBjYWNoZS5hbmdsZSAlIDM2MDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXNpemUpe1xuICAgICAgICAgICAgICAgIGNhY2hlLnNpemUgPSBbb3JpZ2luLnNpemVbMF0gKyByZXNpemVbMF0sIG9yaWdpbi5zaXplWzFdICsgcmVzaXplWzFdXTtcbiAgICAgICAgICAgICAgICBpZiAoY2FjaGUuc2l6ZVswXSA8IDEwKXtcbiAgICAgICAgICAgICAgICAgICAgY2FjaGUuc2l6ZVswXSA9IDEwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY2FjaGUuc2l6ZVsxXSA8IDEwKXtcbiAgICAgICAgICAgICAgICAgICAgY2FjaGUuc2l6ZVsxXSA9IDEwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzY2FsZSl7XG4gICAgICAgICAgICAgICAgaWYgKCEoc2NhbGUgaW5zdGFuY2VvZiBBcnJheSkpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgbiA9IHBhcnNlRmxvYXQoc2NhbGUpO1xuICAgICAgICAgICAgICAgICAgICBzY2FsZSA9IFtuLCBuXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FjaGUuc2NhbGUgPSBbb3JpZ2luLnNjYWxlWzBdICogc2NhbGVbMF0sIG9yaWdpbi5zY2FsZVsxXSAqIHNjYWxlWzFdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3Mpe1xuICAgICAgICAgICAgICAgIGNhY2hlLnBvcyA9IFtvcmlnaW4ucG9zWzBdICsgcG9zWzBdIC0gb2Zmc2V0WzBdLCBvcmlnaW4ucG9zWzFdICsgcG9zWzFdIC0gb2Zmc2V0WzFdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LnN0eWxlLnRyYW5zZm9ybSA9ICdyb3RhdGVaKCcgKyBjYWNoZS5hbmdsZSArICdkZWcpIHNjYWxlKCcgKyBjYWNoZS5zY2FsZVswXSArICcsJyArIGNhY2hlLnNjYWxlWzFdICsgJyknO1xuXHRcdFx0dGhpcy50YXJnZXQuc3R5bGUubGVmdCA9IGNhY2hlLnBvc1swXSArICdweCc7XG5cdFx0XHR0aGlzLnRhcmdldC5zdHlsZS50b3AgPSBjYWNoZS5wb3NbMV0gKyAncHgnO1xuICAgICAgICAgICAgaWYgKHJlc2l6ZSl7XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQuc3R5bGUud2lkdGggPSBjYWNoZS5zaXplWzBdICsgJ3B4JztcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS5oZWlnaHQgPSBjYWNoZS5zaXplWzFdICsgJ3B4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHVzaFN0YXR1cygpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZ2V0Q2VudGVyKCk6bnVtYmVyW117XG4gICAgICAgICAgICBsZXQgcmMgPSB0aGlzLmNlbnRlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHJldHVybiBbcmMubGVmdCwgcmMudG9wXTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgc2V0T3JpZ2luKHA6bnVtYmVyW10pOnZvaWR7XG4gICAgICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBwWzBdICsgXCJweCBcIiArIHBbMV0gKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGNvcnJlY3Qoc3RhdHVzOmFueSwgcG9mZnNldD86bnVtYmVyW10pOm51bWJlcltde1xuICAgICAgICAgICAgaWYgKCFwb2Zmc2V0KXtcbiAgICAgICAgICAgICAgICBwb2Zmc2V0ID0gWzAsIDBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGQgPSBzdGF0dXMuZGVsdGE7XG4gICAgICAgICAgICBsZXQgeCA9IHBhcnNlRmxvYXQodGhpcy50YXJnZXQuYXN0eWxlW1wibGVmdFwiXSkgLSBkLmNlbnRlclswXTtcbiAgICAgICAgICAgIGxldCB5ID0gcGFyc2VGbG9hdCh0aGlzLnRhcmdldC5hc3R5bGVbXCJ0b3BcIl0pIC0gZC5jZW50ZXJbMV07XG4gICAgICAgICAgICB0aGlzLm9mZnNldCA9IFtwb2Zmc2V0WzBdICsgZC5jZW50ZXJbMF0sIHBvZmZzZXRbMV0gKyBkLmNlbnRlclsxXV07XG4gICAgICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS5sZWZ0ID0geCArIFwicHhcIjtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LnN0eWxlLnRvcCA9IHkgKyBcInB4XCI7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGNvbW1pdFN0YXR1cygpOnZvaWR7XG4gICAgICAgICAgICB0aGlzLmNtdCA9IHRoaXMuY2FjaGU7XG4gICAgICAgICAgICB0aGlzLmNtdC5wb3MgPSBbcGFyc2VGbG9hdCh0aGlzLnRhcmdldC5zdHlsZS5sZWZ0KSwgcGFyc2VGbG9hdCh0aGlzLnRhcmdldC5zdHlsZS50b3ApXTtcbiAgICAgICAgICAgIHRoaXMuY210LnNpemUgPSBbcGFyc2VGbG9hdCh0aGlzLnRhcmdldC5zdHlsZS53aWR0aCksIHBhcnNlRmxvYXQodGhpcy50YXJnZXQuc3R5bGUuaGVpZ2h0KV07XG4gICAgICAgICAgICB0aGlzLmNhY2hlID0ge2FuZ2xlOjAsIHNjYWxlOlsxLDFdLCBwb3M6WzAsMF0sIHNpemU6WzAsMF19O1xuICAgICAgICAgICAgdGhpcy5vZmZzZXQgPSBbMCwgMF07XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHB1c2hTdGF0dXMoKTp2b2lke1xuICAgICAgICAgICAgbGV0IGMgPSB0aGlzLmdldENlbnRlcigpO1xuICAgICAgICAgICAgbGV0IGwgPSBbcGFyc2VGbG9hdCh0aGlzLnRhcmdldC5hc3R5bGUoW1wibGVmdFwiXSkpLHBhcnNlRmxvYXQodGhpcy50YXJnZXQuYXN0eWxlKFtcInRvcFwiXSkpXTtcbiAgICAgICAgICAgIGxldCBzOmFueSA9IHtjZW50ZXI6W2NbMF0sIGNbMV1dLCBwb3M6bH07XG4gICAgICAgICAgICBsZXQgcSA9IHRoaXMuc3RhdHVzO1xuICAgICAgICAgICAgbGV0IHAgPSBxLmxlbmd0aCA+IDA/cVtxLmxlbmd0aCAtIDFdIDogcztcbiAgICAgICAgICAgIHMuZGVsdGEgPSB7IGNlbnRlcjpbcy5jZW50ZXJbMF0gLSBwLmNlbnRlclswXSwgcy5jZW50ZXJbMV0gLSBwLmNlbnRlclsxXV0sXG4gICAgICAgICAgICAgICAgcG9zOiBbcy5wb3NbMF0gLSBwLnBvc1swXSwgcy5wb3NbMV0gLSBwLnBvc1sxXV19O1xuICAgICAgICAgICAgcVtxLmxlbmd0aF0gPSBzO1xuICAgICAgICAgICAgaWYgKHEubGVuZ3RoID4gNil7XG4gICAgICAgICAgICAgICAgcS5zcGxpY2UoMCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfVxuICAgIH1cbiAgICBleHBvcnQgZnVuY3Rpb24gUm90YXRvcihlbDphbnkpOmFueXtcbiAgICAgICAgbGV0IHIgPSBlbC4kcm90JCB8fCBuZXcgUm90KGVsKTtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxufVxuXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwicm90YXRvci50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicmVjb2duaXplci50c1wiIC8+XG5cbm5hbWVzcGFjZSBmaW5nZXJze1xuICAgIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBab29tZXJ7XG4gICAgICAgIHByb3RlY3RlZCBuYW1lOnN0cmluZztcbiAgICAgICAgZ2V0IE5hbWUoKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHNhY3Q6aWFjdDtcbiAgICAgICAgcHJvdGVjdGVkIHBhY3Q6aWFjdDtcbiAgICAgICAgcHJvdGVjdGVkIHN0YXJ0ZWQ6Ym9vbGVhbjtcbiAgICAgICAgbWFwcGluZzphbnk7XG4gICAgICAgIGNvbnN0cnVjdG9yKGVsOmFueSl7XG4gICAgICAgICAgICB0aGlzLm1hcHBpbmcgPSB7fTtcbiAgICAgICAgICAgIGVsLiQkcm90ID0gZWwuJCRyb3QgfHwgUm90YXRvcihlbCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vdGhpcy5yb3QgPSBSb3RhdG9yKGVsKTtcbiAgICAgICAgICAgIGlmICghZWwuJHpvb21lciQpe1xuICAgICAgICAgICAgICAgIGVsLiR6b29tZXIkID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGluaXQobmFtZTpzdHJpbmcsIGVsOmFueSl7XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICAgICAgZWwuJHpvb21lciRbbmFtZV0gPSB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHRyaWdnZXIobmFtZTpzdHJpbmcsIGFjdDppYWN0LCBlbDphbnkpe1xuICAgICAgICAgICAgaWYgKHRoaXMubWFwcGluZ1tuYW1lXSl7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXBwaW5nW25hbWVdKGFjdCwgZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIE9uQWN0IGV4dGVuZHMgWm9vbWVye1xuICAgICAgICBjb25zdHJ1Y3RvcihlbDphbnkpe1xuICAgICAgICAgICAgc3VwZXIoZWwpO1xuICAgICAgICAgICAgdGhpcy5tYXBwaW5nID0ge307XG4gICAgICAgICAgICB0aGlzLmluaXQoXCJPbkFjdFwiLCBlbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRHJhZyBleHRlbmRzIFpvb21lcntcbiAgICAgICAgY29uc3RydWN0b3IoZWw6YW55KXtcbiAgICAgICAgICAgIHN1cGVyKGVsKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IHpvb21lciA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLm1hcHBpbmcgPSB7XG4gICAgICAgICAgICAgICAgZHJhZ3N0YXJ0OmZ1bmN0aW9uKGFjdDppYWN0LCBlbDphbnkpe1xuICAgICAgICAgICAgICAgICAgICBlbC4kJHNhY3QgPSBhY3Q7XG4gICAgICAgICAgICAgICAgICAgIGVsLiQkcGFjdCA9IGFjdDtcblxuICAgICAgICAgICAgICAgICAgICAvLyB6b29tZXIuc2FjdCA9IGFjdDtcbiAgICAgICAgICAgICAgICAgICAgLy8gem9vbWVyLnBhY3QgPSBhY3Q7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB6b29tZXIuc3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSwgZHJhZ2dpbmc6ZnVuY3Rpb24oYWN0OmlhY3QsIGVsOmFueSl7XG4gICAgICAgICAgICAgICAgICAgIGlmICh6b29tZXIuc3RhcnRlZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2xldCBwID0gem9vbWVyLnBhY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IGVsLiQkc2FjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXQgPSBbYWN0LmNwb3NbMF0gLSBwLmNwb3NbMF0sIGFjdC5jcG9zWzFdIC0gcC5jcG9zWzFdXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vbGV0IGNlbnRlciA9IHBvaW50T25FbGVtZW50KGVsLCBcIm1vdXNlb3ZlclwiLCBhY3QuY3Bvcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLiQkcm90LnJvdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zOm9mZnNldCwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5nbGU6MCwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyOlswLCAwXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZToxXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLiQkcGFjdCA9IGFjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vem9vbWVyLnBhY3QgPSBhY3Q7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBkcm9wcGVkOmZ1bmN0aW9uKGFjdDppYWN0LCBlbDphbnkpe1xuICAgICAgICAgICAgICAgICAgICB6b29tZXIuc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBlbC4kJHJvdC5jb21taXRTdGF0dXMoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsLiRwcm94eW9mKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2VsLiQkcm90LmNvbW1pdFN0YXR1cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRhcmdldCA9IGVsQXRQb3MoYWN0LmNwb3MpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ICYmIHRhcmdldC5vbmRyb3Ape1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Lm9uZHJvcChlbC4kcHJveHlvZiB8fCBlbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsLm9uZHJvcCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5vbmRyb3AoYWN0LCB0YXJnZXQpOyAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pbml0KFwiRHJhZ1wiLCBlbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgZnVuY3Rpb24gcG9pbnRPbkVsZW1lbnQoZWw6YW55LCBldnQ6c3RyaW5nLCBwb3M6bnVtYmVyW10pe1xuICAgICAgICBsZXQgcmx0ID0gWzAsIDBdO1xuICAgICAgICBlbC5vbm1vdXNlb3ZlciA9IGZ1bmN0aW9uKGV2ZW50OmFueSl7XG4gICAgICAgICAgICBybHQgPSBbZXZlbnQub2Zmc2V0WCwgZXZlbnQub2Zmc2V0WV07XG4gICAgICAgIH1cbiAgICAgICAgc2ltdWxhdGUoZWwsIFwibW91c2VvdmVyXCIsIHBvcyk7XG4gICAgICAgIHJldHVybiBybHQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFpvb20gZXh0ZW5kcyBab29tZXJ7XG4gICAgICAgIGNvbnN0cnVjdG9yKGVsOmFueSl7XG4gICAgICAgICAgICBzdXBlcihlbCk7XG4gICAgICAgICAgICBsZXQgem9vbWVyID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMubWFwcGluZyA9IHtcbiAgICAgICAgICAgICAgICB6b29tc3RhcnQ6ZnVuY3Rpb24oYWN0OmlhY3QsIGVsOmFueSl7XG4gICAgICAgICAgICAgICAgICAgIGVsLiQkc2FjdCA9IGFjdDtcbiAgICAgICAgICAgICAgICAgICAgZWwuJCRwYWN0ID0gYWN0O1xuICAgICAgICAgICAgICAgICAgICAvLyB6b29tZXIuc2FjdCA9IGFjdDtcbiAgICAgICAgICAgICAgICAgICAgLy8gem9vbWVyLnBhY3QgPSBhY3Q7XG4gICAgICAgICAgICAgICAgICAgIHpvb21lci5zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9LCB6b29taW5nOmZ1bmN0aW9uKGFjdDppYWN0LCBlbDphbnkpe1xuICAgICAgICAgICAgICAgICAgICBpZiAoem9vbWVyLnN0YXJ0ZWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9sZXQgcCA9IHpvb21lci5zYWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHAgPSBlbC4kJHNhY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0ID0gW2FjdC5jcG9zWzBdIC0gcC5jcG9zWzBdLCBhY3QuY3Bvc1sxXSAtIHAuY3Bvc1sxXV07XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcm90ID0gYWN0LmFuZ2xlIC0gcC5hbmdsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzY2FsZSA9IGFjdC5sZW4gLyBwLmxlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkZWx0YSA9IHtvZmZzZXQ6IG9mZnNldCwgYW5nbGU6cm90LCBzY2FsZTpzY2FsZX07XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2VudGVyID0gcG9pbnRPbkVsZW1lbnQoZWwsIFwibW91c2VvdmVyXCIsIGFjdC5jcG9zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZWwuJCRyb3Qucm90YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3M6b2Zmc2V0LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmdsZTpyb3QsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbnRlcjpjZW50ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6c2NhbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWwuJCRwYWN0ID0gYWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgLy96b29tZXIucGFjdCA9IGFjdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIHpvb21lbmQ6ZnVuY3Rpb24oYWN0OmlhY3QsIGVsOmFueSl7XG4gICAgICAgICAgICAgICAgICAgIHpvb21lci5zdGFydGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGVsLiQkcm90LmNvbW1pdFN0YXR1cygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaW5pdChcIlpvb21cIiwgZWwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBac2l6ZSBleHRlbmRzIFpvb21lcntcbiAgICAgICAgY29uc3RydWN0b3IoZWw6YW55KXtcbiAgICAgICAgICAgIHN1cGVyKGVsKTtcbiAgICAgICAgICAgIGxldCB6b29tZXIgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5tYXBwaW5nID0ge1xuICAgICAgICAgICAgICAgIHpvb21zdGFydDpmdW5jdGlvbihhY3Q6aWFjdCwgZWw6YW55KXtcbiAgICAgICAgICAgICAgICAgICAgLy8gem9vbWVyLnNhY3QgPSBhY3Q7XG4gICAgICAgICAgICAgICAgICAgIC8vIHpvb21lci5wYWN0ID0gYWN0O1xuICAgICAgICAgICAgICAgICAgICBlbC4kJHNhY3QgPSBhY3Q7XG4gICAgICAgICAgICAgICAgICAgIGVsLiQkcGFjdCA9IGFjdDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHcgPSBlbC5hc3R5bGUoW1wid2lkdGhcIl0pO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaCA9IGVsLmFzdHlsZShbXCJoZWlnaHRcIl0pO1xuICAgICAgICAgICAgICAgICAgICBlbC4kJGluaXRTdGF0ZSA9IHt3OnBhcnNlRmxvYXQodyksIGg6cGFyc2VGbG9hdChoKX07XG4gICAgICAgICAgICAgICAgICAgIHpvb21lci5zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9LHpvb21pbmc6ZnVuY3Rpb24oYWN0OmlhY3QsIGVsOmFueSl7XG4gICAgICAgICAgICAgICAgICAgIGlmICh6b29tZXIuc3RhcnRlZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2xldCBwID0gem9vbWVyLnNhY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IGVsLiQkc2FjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXQgPSBbYWN0LmNwb3NbMF0gLSBwLmNwb3NbMF0sIGFjdC5jcG9zWzFdIC0gcC5jcG9zWzFdXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNpemUgPSBbYWN0Lm93aWR0aCAtIHAub3dpZHRoLCBhY3Qub2hlaWdodCAtIHAub2hlaWdodF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLiQkcm90LnJvdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zOm9mZnNldCwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5nbGU6MCwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyOlswLCAwXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZToxXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHcgPSBlbC5hc3R5bGUoW1wid2lkdGhcIl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGggPSBlbC5hc3R5bGUoW1wiaGVpZ2h0XCJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUud2lkdGggPSBlbC4kJGluaXRTdGF0ZS53ICsgcmVzaXplWzBdICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUuaGVpZ2h0ID0gZWwuJCRpbml0U3RhdGUuaCArIHJlc2l6ZVsxXSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLiQkcGFjdCA9IGFjdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSx6b29tZW5kOmZ1bmN0aW9uKGFjdDppYWN0LCBlbDphbnkpe1xuICAgICAgICAgICAgICAgICAgICB6b29tZXIuc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBlbC4kJHJvdC5jb21taXRTdGF0dXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmluaXQoXCJac2l6ZVwiLCBlbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaW11bGF0ZShlbGVtZW50OmFueSwgZXZlbnROYW1lOnN0cmluZywgcG9zOmFueSkge1xuICAgICAgICBmdW5jdGlvbiBleHRlbmQoZGVzdGluYXRpb246YW55LCBzb3VyY2U6YW55KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBzb3VyY2UpXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb25bcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBldmVudE1hdGNoZXJzOmFueSA9IHtcbiAgICAgICAgICAgICdIVE1MRXZlbnRzJzogL14oPzpsb2FkfHVubG9hZHxhYm9ydHxlcnJvcnxzZWxlY3R8Y2hhbmdlfHN1Ym1pdHxyZXNldHxmb2N1c3xibHVyfHJlc2l6ZXxzY3JvbGwpJC8sXG4gICAgICAgICAgICAnTW91c2VFdmVudHMnOiAvXig/OmNsaWNrfGRibGNsaWNrfG1vdXNlKD86ZG93bnx1cHxvdmVyfG1vdmV8b3V0KSkkL1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICAgICAgcG9pbnRlclg6IDEwMCxcbiAgICAgICAgICAgIHBvaW50ZXJZOiAxMDAsXG4gICAgICAgICAgICBidXR0b246IDAsXG4gICAgICAgICAgICBjdHJsS2V5OiBmYWxzZSxcbiAgICAgICAgICAgIGFsdEtleTogZmFsc2UsXG4gICAgICAgICAgICBzaGlmdEtleTogZmFsc2UsXG4gICAgICAgICAgICBtZXRhS2V5OiBmYWxzZSxcbiAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvcykge1xuICAgICAgICAgICAgZGVmYXVsdE9wdGlvbnMucG9pbnRlclggPSBwb3NbMF07XG4gICAgICAgICAgICBkZWZhdWx0T3B0aW9ucy5wb2ludGVyWSA9IHBvc1sxXTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgb3B0aW9ucyA9IGV4dGVuZChkZWZhdWx0T3B0aW9ucywgYXJndW1lbnRzWzNdIHx8IHt9KTtcbiAgICAgICAgbGV0IG9FdmVudDphbnksIGV2ZW50VHlwZTphbnkgPSBudWxsO1xuXG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gZXZlbnRNYXRjaGVycykge1xuICAgICAgICAgICAgaWYgKGV2ZW50TWF0Y2hlcnNbbmFtZV0udGVzdChldmVudE5hbWUpKSB7IGV2ZW50VHlwZSA9IG5hbWU7IGJyZWFrOyB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWV2ZW50VHlwZSlcbiAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignT25seSBIVE1MRXZlbnRzIGFuZCBNb3VzZUV2ZW50cyBpbnRlcmZhY2VzIGFyZSBzdXBwb3J0ZWQnKTtcblxuICAgICAgICBpZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnQpIHtcbiAgICAgICAgICAgIG9FdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KGV2ZW50VHlwZSk7XG4gICAgICAgICAgICBpZiAoZXZlbnRUeXBlID09ICdIVE1MRXZlbnRzJykge1xuICAgICAgICAgICAgICAgIG9FdmVudC5pbml0RXZlbnQoZXZlbnROYW1lLCBvcHRpb25zLmJ1YmJsZXMsIG9wdGlvbnMuY2FuY2VsYWJsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBvRXZlbnQuaW5pdE1vdXNlRXZlbnQoZXZlbnROYW1lLCBvcHRpb25zLmJ1YmJsZXMsIG9wdGlvbnMuY2FuY2VsYWJsZSwgZG9jdW1lbnQuZGVmYXVsdFZpZXcsXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5idXR0b24sIG9wdGlvbnMucG9pbnRlclgsIG9wdGlvbnMucG9pbnRlclksIG9wdGlvbnMucG9pbnRlclgsIG9wdGlvbnMucG9pbnRlclksXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jdHJsS2V5LCBvcHRpb25zLmFsdEtleSwgb3B0aW9ucy5zaGlmdEtleSwgb3B0aW9ucy5tZXRhS2V5LCBvcHRpb25zLmJ1dHRvbiwgZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQob0V2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG9wdGlvbnMuY2xpZW50WCA9IG9wdGlvbnMucG9pbnRlclg7XG4gICAgICAgICAgICBvcHRpb25zLmNsaWVudFkgPSBvcHRpb25zLnBvaW50ZXJZO1xuICAgICAgICAgICAgdmFyIGV2dCA9IChkb2N1bWVudCBhcyBhbnkpLmNyZWF0ZUV2ZW50T2JqZWN0KCk7XG4gICAgICAgICAgICBvRXZlbnQgPSBleHRlbmQoZXZ0LCBvcHRpb25zKTtcbiAgICAgICAgICAgIGVsZW1lbnQuZmlyZUV2ZW50KCdvbicgKyBldmVudE5hbWUsIG9FdmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuXG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwidG91Y2gudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInpvb21lci50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZm91bmRhdGlvbi9zcmMvc2NyaXB0L2VsZW1lbnRzLnRzXCIgLz5cblxubmFtZXNwYWNlIGZpbmdlcnN7XG4gICAgZXhwb3J0IGZ1bmN0aW9uIGVsQXRQb3MocG9zOm51bWJlcltdKTphbnl7XG4gICAgICAgIGxldCBybHQ6YW55ID0gbnVsbDtcbiAgICAgICAgbGV0IGNhY2hlOmFueVtdID0gW107XG4gICAgICAgIHdoaWxlKHRydWUpe1xuICAgICAgICAgICAgbGV0IGVsOmFueSA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQocG9zWzBdLCBwb3NbMV0pO1xuICAgICAgICAgICAgaWYgKCFlbCl7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcHMgPSBlbC5hc3R5bGUoWydwb3NpdGlvbiddKTtcbiAgICAgICAgICAgIGlmIChlbCA9PSBkb2N1bWVudC5ib2R5IHx8IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSBcImh0bWxcIiB8fCBlbCA9PSB3aW5kb3cpe1xuICAgICAgICAgICAgICAgIHJsdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9ZWxzZSBpZiAoZWwuJGV2dHJhcCQpe1xuICAgICAgICAgICAgICAgIHJsdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9ZWxzZSBpZiAoZWwuJHRvdWNoYWJsZSQpe1xuICAgICAgICAgICAgICAgIHJsdCA9IGVsLmdldGFyZ2V0P2VsLmdldGFyZ2V0KCk6ZWxcbiAgICAgICAgICAgICAgICBybHQuJHRvdWNoZWwkID0gZWw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBpZiAoZWwuJGV2dGlnbm9yZSQgfHwgcHMgPT0gJ2Fic29sdXRlJyB8fCBwcyA9PSAnZml4ZWQnKXtcbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgICAgICBjYWNoZS5hZGQoZWwpO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBpIG9mIGNhY2hlKXtcbiAgICAgICAgICAgIGkuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJsdDtcbiAgICB9XG5cbiAgICBsZXQgY2ZnOmFueSA9IG51bGw7XG5cbiAgICBmdW5jdGlvbiBhbGwobm9kZTpOb2RlLCBzZXR0aW5nczphbnksIHJlc3VsdD86YW55W10pOmFueVtde1xuICAgICAgICBsZXQgcmx0OmFueVtdID0gcmVzdWx0IHx8IFtdO1xuICAgICAgICBpZiAoIW5vZGUgfHwgIXNldHRpbmdzKXtcbiAgICAgICAgICAgIHJldHVybiBybHQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNiID0gc2V0dGluZ3MuY2FsbGJhY2s7XG4gICAgICAgIHZhciBmdCA9IHNldHRpbmdzLmZpbHRlcjtcbiAgICAgICAgXG4gICAgICAgIGNiKG5vZGUpO1xuICAgICAgICBpZiAoIW5vZGUuY2hpbGROb2Rlcyl7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5leHBlY3RlZCB0YXJnZXQgbm9kZTpcIiwgbm9kZSk7XG4gICAgICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb3IobGV0IGk9MDsgaTxub2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgbGV0IGNub2RlID0gbm9kZS5jaGlsZE5vZGVzW2ldO1xuICAgICAgICAgICAgaWYgKCFmdCB8fCBmdChjbm9kZSkpe1xuICAgICAgICAgICAgICAgIGlmIChjYil7XG4gICAgICAgICAgICAgICAgICAgIGNiKGNub2RlKTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgcmx0LmFkZChjbm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWxsKGNub2RlLCBzZXR0aW5ncywgcmx0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmx0O1xuICAgIH1cbiAgICBsZXQgY3R4OkZpbmdlckNvbnRleHQ7XG4gICAgZXhwb3J0IGZ1bmN0aW9uIGZpbmdlcihlbHM6YW55LCBzZXR0aW5ncz86YW55LCB1bmRlZj86YW55KTphbnl7XG4gICAgICAgIGxldCBlbDphbnkgPSBudWxsO1xuICAgICAgICBsZXQgdHlwID0gdHlwZW9mKGVscyk7XG4gICAgICAgIGlmICh0eXAgPT0gJ3N0cmluZycpe1xuICAgICAgICAgICAgaWYgKCh3aW5kb3cgYXMgYW55KS4kKXtcbiAgICAgICAgICAgICAgICBlbHMgPSAod2luZG93IGFzIGFueSkuJChlbHMpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgZWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChlbHMubGVuZ3RoID09PSB1bmRlZil7XG4gICAgICAgICAgICBlbHMgPSBbZWxzXTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBpZiAoIWNmZyl7XG4gICAgICAgICAgICBjZmcgPSB0b3VjaCh7XG4gICAgICAgICAgICAgICAgb246eyBcbiAgICAgICAgICAgICAgICAgICAgdGFwOmZ1bmN0aW9uKGFjdDppYWN0KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhY3RpdmVFbHMgPSBlbEF0UG9zKGFjdC5jcG9zKSB8fCBjdHguYWN0aXZlRWxzO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnNlbGVjdChhY3RpdmVFbHMpO1xuICAgICAgICAgICAgICAgICAgICB9LHRvdWNoZWQ6ZnVuY3Rpb24oYWN0OmlhY3Qpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFjdGl2ZUVsID0gZWxBdFBvcyhhY3QuY3Bvcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc2VsZWN0KGFjdGl2ZUVsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sb25hY3Q6ZnVuY3Rpb24oaW5xOmFueSl7XG4gICAgICAgICAgICAgICAgfSxvbnJlY29nbml6ZWQ6ZnVuY3Rpb24oYWN0OmlhY3Qpe1xuICAgICAgICAgICAgICAgICAgICBjdHguZWFjaChmdW5jdGlvbihhY3RpdmVFbDphbnkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUVsICYmIGFjdGl2ZUVsLiR6b29tZXIkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgem0gPSBhY3RpdmVFbC4kem9vbWVyJDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGkgaW4gem0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IHptW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5tYXBwaW5nW2FjdC5hY3RdKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ubWFwcGluZ1thY3QuYWN0XShhY3QsIGFjdGl2ZUVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjZmcuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjdHgpe1xuICAgICAgICAgICAgY3R4ID0gbmV3IEZpbmdlckNvbnRleHQoY2ZnKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IobGV0IGVsIG9mIGVscyl7XG4gICAgICAgICAgICBpZiAoIWVsLiR0b3VjaGFibGUkKXtcbiAgICAgICAgICAgICAgICBlbC4kdG91Y2hhYmxlJCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYWxsKGVsLCB7Y2FsbGJhY2s6ZnVuY3Rpb24obmQ6YW55KXtuZC4kZXZ0aWdub3JlJCA9IHRydWU7fX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB6b29tYWJsZTpmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGZvcihsZXQgZWwgb2YgZWxzKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHpvb21lciA9IG5ldyBab29tKGVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9LHpzaXphYmxlOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBlbCBvZiBlbHMpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgenNpemUgPSBuZXcgWnNpemUoZWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0sZHJhZ2dhYmxlOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBlbCBvZiBlbHMpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgY3NzcG9zID0gZWwuYXN0eWxlKFtcInBvc2l0aW9uXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNzc3BvcyAhPSAnYWJzb2x1dGUnICYmIGNzc3BvcyAhPSAnZml4ZWQnKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkcHJveHkoZWwpO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBEcmFnKGVsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0sZHJvcHBhYmxlOmZ1bmN0aW9uKGRyb3BoYW5kbGVyOkZ1bmN0aW9uKXtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGVsIG9mIGVscyl7XG4gICAgICAgICAgICAgICAgICAgIGVsLm9uZHJvcCA9IGRyb3BoYW5kbGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0sb246ZnVuY3Rpb24oYWN0aW9uOnN0cmluZywgaGFuZGxlcjpGdW5jdGlvbil7XG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbiAmJiBoYW5kbGVyKXtcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBlbCBvZiBlbHMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9uYWN0ID0gZWwuJCRvbmFjdCB8fCBuZXcgT25BY3QoZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFvbmFjdC5tYXBwaW5nW2FjdGlvbl0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uYWN0Lm1hcHBpbmdbYWN0aW9uXSA9IGhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC4kJG9uYWN0ID0gb25hY3Q7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9LGFjdGl2YXRlOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBlbCBvZiBlbHMpe1xuICAgICAgICAgICAgICAgICAgICBjdHguc2VsZWN0KGVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYnVpbGRwcm94eShlbDphbnkpe1xuICAgICAgICBsZXQgcHJveHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpIGFzIGFueTtcblxuICAgICAgICBwcm94eS5jbGFzc05hbWUgPSBcInByb3h5XCI7XG4gICAgICAgIHByb3h5LnN0eWxlLnpJbmRleCA9ICc5OTk5JztcblxuICAgICAgICBwcm94eS5yZXNldCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBsZXQgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgdGhpcy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgdGhpcy5zdHlsZS5sZWZ0ID0gcmVjdC5sZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgIHRoaXMuc3R5bGUudG9wID0gcmVjdC50b3AgKyAncHgnO1xuICAgICAgICAgICAgdGhpcy5zdHlsZS53aWR0aCA9IHJlY3Qud2lkdGggKyAncHgnO1xuICAgICAgICAgICAgdGhpcy5zdHlsZS5oZWlnaHQgPSByZWN0LmhlaWdodCArICdweCc7XG4gICAgICAgICAgICBpZiAodGhpcy4kJHJvdCl7XG4gICAgICAgICAgICAgICAgdGhpcy4kJHJvdC5jb21taXRTdGF0dXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcHJveHkucmVzZXQoKTtcbiAgICAgICAgcHJveHkuJHByb3h5b2YgPSBlbDtcbiAgICAgICAgcHJveHkuJHRvdWNoYWJsZSQgPSB0cnVlO1xuICAgICAgICBhbGwocHJveHksIHtjYWxsYmFjazpmdW5jdGlvbihuZDphbnkpe25kLiRldnRpZ25vcmUkID0gdHJ1ZTt9fSk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocHJveHkpO1xuICAgICAgICBuZXcgRHJhZyhwcm94eSk7XG4gICAgICAgIGVsLiRwcm94eSA9IHByb3h5O1xuICAgICAgICByZXR1cm4gcHJveHk7XG4gICAgfVxufVxuXG5sZXQgZmluZ2VyID0gZmluZ2Vycy5maW5nZXI7IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRvdWNoLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ6b29tZXIudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2ZvdW5kYXRpb24vc3JjL3NjcmlwdC9lbGVtZW50cy50c1wiIC8+XG5cbm5hbWVzcGFjZSBmaW5nZXJze1xuICAgIGV4cG9ydCBjbGFzcyBGaW5nZXJDb250ZXh0e1xuICAgICAgICBwcm90ZWN0ZWQgYWN0aXZlRWw6YW55W107XG4gICAgICAgIHByb3RlY3RlZCBtdWx0aWFjdGl2ZTpib29sZWFuO1xuICAgICAgICBnZXQgYWN0aXZlRWxzKCk6YW55W117XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmVFbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2V0dGluZ3M6YW55KXtcbiAgICAgICAgICAgIHRoaXMubXVsdGlhY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlRWwgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBzZWxlY3QodGFyZ2V0OmFueSl7XG4gICAgICAgICAgICBpZiAoIXRoaXMubXVsdGlhY3RpdmUpe1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlRWwuY2xlYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYWN0aXZlRWwuYWRkKHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZWFjaChjYWxsYmFjazpGdW5jdGlvbik6dm9pZHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayAmJiB0aGlzLmFjdGl2ZUVsICYmIHRoaXMuYWN0aXZlRWwubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBpIG9mIHRoaXMuYWN0aXZlRWwpe1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
