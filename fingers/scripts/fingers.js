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
            get: function () {
                return (!!window.opr && !!window.opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isFirefox", {
            get: function () {
                return typeof window.InstallTrigger !== 'undefined';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isSafari", {
            get: function () {
                return Object.prototype.toString.call(HTMLElement).indexOf('Constructor') > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isIE", {
            get: function () {
                return false || !!document.documentMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isEdge", {
            get: function () {
                return !Browser.isIE && !!window.StyleMedia;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isChrome", {
            get: function () {
                return !!window.chrome && !!window.chrome.webstore;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isBlink", {
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
            var ag = calcAngle(a, b, len); 
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
            var ag = calcAngle(a, b, len); 
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
                    zoomer.started = true;
                }, dragging: function (act, el) {
                    if (zoomer.started) {
                        var p = el.$$sact;
                        var offset = [act.cpos[0] - p.cpos[0], act.cpos[1] - p.cpos[1]];
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
                    zoomer.started = true;
                }, zooming: function (act, el) {
                    if (zoomer.started) {
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
                    el.$$sact = act;
                    el.$$pact = act;
                    var w = el.astyle(["width"]);
                    var h = el.astyle(["height"]);
                    el.$$initState = { w: parseFloat(w), h: parseFloat(h) };
                    zoomer.started = true;
                }, zooming: function (act, el) {
                    if (zoomer.started) {
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
        document.body.style.touchAction = "none";
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
