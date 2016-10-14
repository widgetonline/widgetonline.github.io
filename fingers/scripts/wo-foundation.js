function d(msg) {
    console.log(msg);
    var div = document.body.$debug$;
    if (!div) {
        div = document.createElement('div');
        document.body.$debug$ = div;
        document.body.appendChild(div);
    }
    div.innerHTML = msg + '<br/>' + div.innerHTML;
}

Array.prototype.add = function (item) {
    this[this.length] = item;
};
Array.prototype.clear = function (keepalive) {
    var n = this.length;
    for (var i = n - 1; i >= 0; i--) {
        //delete this[i];
        var tmp = this.pop();
        tmp = null;
    }
};

/// <reference path="definitions.ts" />
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

/// <reference path="definitions.ts" />
Element.prototype.astyle = function actualStyle(props) {
    var el = this;
    var compStyle = window.getComputedStyle(el, null);
    for (var i = 0; i < props.length; i++) {
        var style = compStyle.getPropertyValue(props[i]);
        if (style != null) {
            return style;
        }
    }
    return null;
};
Element.prototype.visible = function () {
    return this.style.display != 'none' && this.style.visibility != 'hidden';
};
Element.prototype.hide = function () {
    this.style.display = 'none';
};
Element.prototype.show = function () {
    this.style.display = '';
};
Element.prototype.ondispose = function () {
    var d = this._disposers;
    if (!d) {
        d = [];
        this._disposers = d;
    }
    return d;
};
var wo;
(function (wo) {
    var Destroyer = (function () {
        function Destroyer() {
        }
        Destroyer.destroy = function (target) {
            if (!target.destroyStatus) {
                target.destroyStatus = new Destroyer();
            }
            if (!target.destroyStatus.disposing) {
                if (target.ondispose() && target.ondispose().length > 0) {
                    target.destroyStatus.disposing = true;
                    for (var _i = 0, _a = target.ondispose(); _i < _a.length; _i++) {
                        var i = _a[_i];
                        i.call(target);
                    }
                }
                if (target.dispose) {
                    target.destroyStatus.disposing = true;
                    target.dispose();
                }
            }
            if (!target.destroyStatus.destroying) {
                target.destroyStatus.destroying = true;
                Destroyer.container.appendChild(target);
                for (var i in target) {
                    if (i.indexOf('$') == 0) {
                        var tmp = target[i];
                        if (tmp instanceof HTMLElement) {
                            target[i] = null;
                            tmp = null;
                        }
                        else {
                            delete target[i];
                        }
                    }
                }
                Destroyer.container.innerHTML = '';
            }
        };
        Destroyer.container = document.createElement("div");
        return Destroyer;
    }());
    function destroy(target) {
        if (target.length > 0 || target instanceof Array) {
            for (var _i = 0, target_1 = target; _i < target_1.length; _i++) {
                var i = target_1[_i];
                Destroyer.destroy(i);
            }
        }
        else if (target instanceof Element) {
            Destroyer.destroy(target);
        }
    }
    wo.destroy = destroy;
    function centerScreen(target) {
        var rect = target.getBoundingClientRect();
        target.style.position = "fixed";
        target.style.left = "50%";
        target.style.top = "50%";
        target.style.marginTop = -rect.height / 2 + "px";
        target.style.marginLeft = -rect.width / 2 + "px";
    }
    wo.centerScreen = centerScreen;
})(wo || (wo = {}));

String.prototype.startsWith = function (str) {
    return this.indexOf(str) == 0;
};
String.prototype.format = function () {
    var args = arguments;
    var s = this;
    if (!args || args.length < 1) {
        return s;
    }
    var r = s;
    for (var i = 0; i < args.length; i++) {
        var reg = new RegExp('\\{' + i + '\\}');
        r = r.replace(reg, args[i]);
    }
    return r;
};
String.prototype.fill = function (arg) {
    if (!arg || typeof (arg) != 'object') {
        return this;
    }
    var rlt = this;
    for (var i in arg) {
        var regex = new RegExp('\{' + i + '\}', 'ig');
        rlt = rlt.replace(regex, arg[i]);
    }
    return rlt;
};

var wo;
(function (wo) {
    var monitor = (function () {
        function monitor() {
            this.val = null;
            this.undo = [];
            this.origin = null;
            this.fwd = [];
        }
        monitor.prototype.watch = function (target, prop, callback, mode) {
            var self = this;
            if (mode == '>') {
                target[prop] = this.val;
            }
            else if (mode == '<') {
                this.val = target[prop];
            }
            if (!self.origin) {
                self.origin = target;
                this.val = target[prop];
            }
            Object.defineProperty(target, prop, {
                get: function () {
                    return self.val;
                },
                set: function (newValue) {
                    var oldval = self.val;
                    self.val = newValue;
                    if (callback) {
                        callback(newValue, oldval);
                    }
                    if (oldval != newValue && self.origin.onchange) {
                        self.origin.onchange(newValue, oldval, prop);
                    }
                    for (var _i = 0, _a = self.fwd; _i < _a.length; _i++) {
                        var i = _a[_i];
                        i();
                    }
                },
                configurable: true,
                enumerable: true
            });
            self.undo.add(function () {
                Object.defineProperty(target, prop, {
                    get: function () {
                        return target['_' + prop];
                    },
                    set: function (newValue) {
                        target['_' + prop] = newValue;
                    },
                    configurable: true,
                    enumerable: true
                });
            });
            return this;
        };
        monitor.prototype.forward = function (target, prop, isattr) {
            var self = this;
            if (isattr) {
                self.fwd.add(function () {
                    target.setAttribute(prop, self.val);
                });
            }
            else {
                self.fwd.add(function () {
                    target[prop] = self.val;
                });
                target[prop] = self.val;
            }
        };
        monitor.prototype.cancel = function () {
            for (var _i = 0, _a = this.undo; _i < _a.length; _i++) {
                var i = _a[_i];
                i();
            }
            this.undo.clear();
            this.fwd.clear();
        };
        monitor.prototype.observe = function (el, attr, callback) {
            var self = this;
            if (!self.origin) {
                self.origin = el;
                self.val = el.getAttribute(attr);
            }
            var obs = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.attributeName == attr) {
                        self.val = el.getAttribute(mutation.attributeName);
                        if (callback) {
                            callback(self.val, mutation.oldValue, attr);
                        }
                    }
                });
            });
            obs.observe(el, { attributes: true, childList: false, characterData: false, attributeOldValue: true, attributeFilter: [attr] });
            self.undo.add(function () {
                obs.disconnect();
            });
            return this;
        };
        return monitor;
    }());
    wo.monitor = monitor;
})(wo || (wo = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjcmlwdC9kZWJ1Zy50cyIsInNjcmlwdC9kZWZpbml0aW9ucy50cyIsInNjcmlwdC9kZXZpY2UudHMiLCJzY3JpcHQvZWxlbWVudHMudHMiLCJzY3JpcHQvc3RyaW5nLnRzIiwic2NyaXB0L3dhdGNoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxHQUFVO0lBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakIsSUFBSSxHQUFHLEdBQUksUUFBUSxDQUFDLElBQVksQ0FBQyxPQUFPLENBQUM7SUFDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxDQUFDO1FBQ04sR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsUUFBUSxDQUFDLElBQVksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ3JDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFDRCxHQUFHLENBQUMsU0FBUyxHQUFHLEdBQUcsR0FBRyxPQUFPLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztBQUNsRCxDQUFDOztBQ2tDRCxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxVQUFVLElBQVE7SUFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDMUIsQ0FBQyxDQUFBO0FBRUQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsVUFBVSxTQUFrQjtJQUNuRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3BCLEdBQUcsQ0FBQSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBQyxDQUFDO1FBQy9CLGlCQUFpQjtRQUNqQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FB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Q0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO3dCQUNuRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQSxDQUFDOzRCQUNWLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ2hELENBQUM7b0JBQ0wsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1lBQ0gsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBQyxVQUFVLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxLQUFLLEVBQUUsYUFBYSxFQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBQyxJQUFJLEVBQUUsZUFBZSxFQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ3pILElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2dCQUNWLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNyQixDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNMLGNBQUM7SUFBRCxDQWpHQSxBQWlHQyxJQUFBO0lBakdZLFVBQU8sVUFpR25CLENBQUE7QUFDTCxDQUFDLEVBcEdTLEVBQUUsS0FBRixFQUFFLFFBb0dYIiwiZmlsZSI6IndvLWZvdW5kYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBkKG1zZzpzdHJpbmcpe1xyXG4gICAgY29uc29sZS5sb2cobXNnKTtcclxuICAgIGxldCBkaXYgPSAoZG9jdW1lbnQuYm9keSBhcyBhbnkpLiRkZWJ1ZyQ7XHJcbiAgICBpZiAoIWRpdil7XHJcbiAgICAgICAgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgKGRvY3VtZW50LmJvZHkgYXMgYW55KS4kZGVidWckID0gZGl2O1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcclxuICAgIH1cclxuICAgIGRpdi5pbm5lckhUTUwgPSBtc2cgKyAnPGJyLz4nICsgZGl2LmlubmVySFRNTDtcclxufSIsImludGVyZmFjZSBXaW5kb3d7XHJcblx0b3ByOmFueTtcclxuXHRvcGVyYTphbnk7XHJcblx0Y2hyb21lOmFueTtcclxuXHRTdHlsZU1lZGlhOmFueTtcclxuXHRJbnN0YWxsVHJpZ2dlcjphbnk7XHJcblx0Q1NTOmFueTtcclxufVxyXG5cclxuaW50ZXJmYWNlIERvY3VtZW50e1xyXG5cdGRvY3VtZW50TW9kZTphbnk7XHJcbn1cclxuaW50ZXJmYWNlIE9iamVjdHtcclxuXHRyZWFkKGtleXM6c3RyaW5nW10pOmFueTtcclxuXHR3cml0ZShrZXlzOnN0cmluZ1tdLCB2YWw6YW55KTp2b2lkO1xyXG59XHJcbi8vIEVsZW1lbnQudHNcclxuaW50ZXJmYWNlIEVsZW1lbnR7XHJcblx0W25hbWU6c3RyaW5nXTphbnk7XHJcblx0YXN0eWxlKHN0eWxlczpzdHJpbmdbXSk6c3RyaW5nO1xyXG5cdHNldCh2YWw6YW55KTp2b2lkO1xyXG5cdGdldChrZXlzOnN0cmluZ1tdKTphbnk7XHJcblx0ZGVzdHJveVN0YXR1czphbnk7XHJcblx0b25kaXNwb3NlOkZ1bmN0aW9uO1xyXG5cdGRpc3Bvc2UoKTphbnk7XHJcblx0dmlzaWJsZSgpOmJvb2xlYW47XHJcblx0aGlkZSgpOnZvaWQ7XHJcblx0c2hvdygpOnZvaWQ7XHJcbn1cclxuXHJcbmludGVyZmFjZSBOb2Rle1xyXG5cdGN1cnNvcjphbnk7XHJcbn1cclxuXHJcbmludGVyZmFjZSBTdHJpbmd7XHJcblx0c3RhcnRzV2l0aChzdHI6c3RyaW5nKTpib29sZWFuO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgQXJyYXk8VD57XHJcblx0YWRkKGl0ZW06VCk6dm9pZDtcclxuXHRjbGVhcihkZWw/OmJvb2xlYW4pOnZvaWQ7XHJcbn1cclxuXHJcbkFycmF5LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoaXRlbTphbnkpIHtcclxuXHR0aGlzW3RoaXMubGVuZ3RoXSA9IGl0ZW07XHJcbn1cclxuXHJcbkFycmF5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uIChrZWVwYWxpdmU/OmJvb2xlYW4pIHtcclxuXHRsZXQgbiA9IHRoaXMubGVuZ3RoO1xyXG5cdGZvcihsZXQgaSA9IG4gLSAxOyBpID49IDA7IGktLSl7XHJcblx0XHQvL2RlbGV0ZSB0aGlzW2ldO1xyXG5cdFx0bGV0IHRtcCA9IHRoaXMucG9wKCk7XHJcblx0XHR0bXAgPSBudWxsO1xyXG5cdH1cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiZGVmaW5pdGlvbnMudHNcIiAvPlxyXG5jbGFzcyBNb2JpbGVEZXZpY2V7XHJcblx0c3RhdGljIGdldCBBbmRyb2lkICgpOmJvb2xlYW4ge1xyXG5cdFx0dmFyIHIgPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpO1xyXG5cdFx0aWYgKHIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ21hdGNoIEFuZHJvaWQnKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByIT0gbnVsbCAmJiByLmxlbmd0aD4wO1xyXG5cdH1cclxuXHRzdGF0aWMgZ2V0IEJsYWNrQmVycnkoKTpib29sZWFuIHtcclxuXHRcdHZhciByID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQmxhY2tCZXJyeS9pKTtcclxuXHRcdGlmIChyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdtYXRjaCBBbmRyb2lkJyk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gciE9bnVsbCAmJiByLmxlbmd0aCA+IDA7XHJcblx0fVxyXG5cdHN0YXRpYyBnZXQgaU9TKCk6Ym9vbGVhbiB7XHJcblx0XHR2YXIgciA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQaG9uZXxpUGFkfGlQb2QvaSk7XHJcblx0XHRpZiAocikge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnbWF0Y2ggQW5kcm9pZCcpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHIgIT0gbnVsbCAmJiByLmxlbmd0aCA+IDA7XHJcblx0fVxyXG5cdHN0YXRpYyBnZXQgT3BlcmEoKTpib29sZWFuIHtcclxuXHRcdHZhciByID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvT3BlcmEgTWluaS9pKTtcclxuXHRcdGlmIChyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdtYXRjaCBBbmRyb2lkJyk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gciAhPSBudWxsICYmIHIubGVuZ3RoID4gMDtcclxuXHR9XHJcblx0c3RhdGljIGdldCBXaW5kb3dzKCk6Ym9vbGVhbiB7XHJcblx0XHR2YXIgciA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0lFTW9iaWxlL2kpO1xyXG5cdFx0aWYgKHIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ21hdGNoIEFuZHJvaWQnKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByIT0gbnVsbCAmJiByLmxlbmd0aCA+MDtcclxuXHR9XHJcblx0c3RhdGljIGdldCBhbnkoKTpib29sZWFuIHtcclxuXHRcdHJldHVybiAoTW9iaWxlRGV2aWNlLkFuZHJvaWQgfHwgTW9iaWxlRGV2aWNlLkJsYWNrQmVycnkgfHwgTW9iaWxlRGV2aWNlLmlPUyB8fCBNb2JpbGVEZXZpY2UuT3BlcmEgfHwgTW9iaWxlRGV2aWNlLldpbmRvd3MpO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgQnJvd3NlcntcclxuXHQvLyBPcGVyYSA4LjArXHJcblx0c3RhdGljIGdldCBpc09wZXJhKCk6Ym9vbGVhbntcclxuXHRcdHJldHVybiAoISF3aW5kb3cub3ByICYmICEhd2luZG93Lm9wci5hZGRvbnMpIHx8ICEhd2luZG93Lm9wZXJhIHx8IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignIE9QUi8nKSA+PSAwO1xyXG5cdH1cclxuXHRcclxuXHQvLyBGaXJlZm94IDEuMCtcclxuXHRzdGF0aWMgZ2V0IGlzRmlyZWZveCgpOmJvb2xlYW57XHJcblx0XHRyZXR1cm4gdHlwZW9mIHdpbmRvdy5JbnN0YWxsVHJpZ2dlciAhPT0gJ3VuZGVmaW5lZCc7XHJcblx0fVxyXG5cdC8vIEF0IGxlYXN0IFNhZmFyaSAzKzogXCJbb2JqZWN0IEhUTUxFbGVtZW50Q29uc3RydWN0b3JdXCJcclxuXHRzdGF0aWMgZ2V0IGlzU2FmYXJpKCk6Ym9vbGVhbntcclxuXHRcdHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoSFRNTEVsZW1lbnQpLmluZGV4T2YoJ0NvbnN0cnVjdG9yJykgPiAwO1xyXG5cdH0gXHJcblx0Ly8gSW50ZXJuZXQgRXhwbG9yZXIgNi0xMVxyXG5cdHN0YXRpYyBnZXQgaXNJRSgpOmJvb2xlYW57XHJcblx0XHRyZXR1cm4gLypAY2Nfb24hQCovZmFsc2UgfHwgISFkb2N1bWVudC5kb2N1bWVudE1vZGU7XHJcblx0fVxyXG5cdC8vIEVkZ2UgMjArXHJcblx0c3RhdGljIGdldCBpc0VkZ2UoKTpib29sZWFue1xyXG5cdFx0cmV0dXJuICFCcm93c2VyLmlzSUUgJiYgISF3aW5kb3cuU3R5bGVNZWRpYTtcclxuXHR9XHJcblx0Ly8gQ2hyb21lIDErXHJcblx0c3RhdGljIGdldCBpc0Nocm9tZSgpOmJvb2xlYW57XHJcblx0XHRyZXR1cm4gISF3aW5kb3cuY2hyb21lICYmICEhd2luZG93LmNocm9tZS53ZWJzdG9yZTtcclxuXHR9XHJcblx0Ly8gQmxpbmsgZW5naW5lIGRldGVjdGlvblxyXG5cdHN0YXRpYyBnZXQgaXNCbGluaygpOmJvb2xlYW57XHJcblx0XHRyZXR1cm4gKEJyb3dzZXIuaXNDaHJvbWUgfHwgQnJvd3Nlci5pc09wZXJhKSAmJiAhIXdpbmRvdy5DU1M7XHJcblx0fVxyXG59XHJcblxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiZGVmaW5pdGlvbnMudHNcIiAvPlxyXG5cclxuRWxlbWVudC5wcm90b3R5cGUuYXN0eWxlID0gZnVuY3Rpb24gYWN0dWFsU3R5bGUocHJvcHM6c3RyaW5nW10pIHtcclxuXHRsZXQgZWw6RWxlbWVudCA9IHRoaXM7XHJcblx0bGV0IGNvbXBTdHlsZTpDU1NTdHlsZURlY2xhcmF0aW9uID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwsIG51bGwpO1xyXG5cdGZvciAobGV0IGk6bnVtYmVyID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRsZXQgc3R5bGU6c3RyaW5nID0gY29tcFN0eWxlLmdldFByb3BlcnR5VmFsdWUocHJvcHNbaV0pO1xyXG5cdFx0aWYgKHN0eWxlICE9IG51bGwpIHtcclxuXHRcdFx0cmV0dXJuIHN0eWxlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLnZpc2libGUgPSBmdW5jdGlvbiAoKTpib29sZWFue1xyXG5cdHJldHVybiB0aGlzLnN0eWxlLmRpc3BsYXkgIT0gJ25vbmUnICYmIHRoaXMuc3R5bGUudmlzaWJpbGl0eSAhPSAnaGlkZGVuJzsgXHJcbn07XHJcblxyXG5FbGVtZW50LnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oKTp2b2lke1xyXG5cdHRoaXMuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxufTtcclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpOnZvaWR7XHJcblx0dGhpcy5zdHlsZS5kaXNwbGF5ID0gJyc7XHJcbn1cclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLm9uZGlzcG9zZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGQgPSB0aGlzLl9kaXNwb3NlcnM7XHJcblx0aWYgKCFkKXtcclxuXHRcdGQgPSBbXTtcclxuXHRcdHRoaXMuX2Rpc3Bvc2VycyA9IGQ7XHJcblx0fVxyXG5cdHJldHVybiBkO1xyXG59O1xyXG5cclxubmFtZXNwYWNlIHdve1xyXG5cdGNsYXNzIERlc3Ryb3llcntcclxuXHRcdGRpc3Bvc2luZzpib29sZWFuO1xyXG5cdFx0ZGVzdHJveWluZzpib29sZWFuO1xyXG5cdFx0c3RhdGljIGNvbnRhaW5lcjpIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblx0XHRzdGF0aWMgZGVzdHJveSh0YXJnZXQ6RWxlbWVudCl7XHJcblx0XHRcdGlmICghdGFyZ2V0LmRlc3Ryb3lTdGF0dXMpe1xyXG5cdFx0XHRcdHRhcmdldC5kZXN0cm95U3RhdHVzID0gbmV3IERlc3Ryb3llcigpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghdGFyZ2V0LmRlc3Ryb3lTdGF0dXMuZGlzcG9zaW5nKXtcclxuXHRcdFx0XHRpZiAodGFyZ2V0Lm9uZGlzcG9zZSgpICYmIHRhcmdldC5vbmRpc3Bvc2UoKS5sZW5ndGggPiAwKXtcclxuXHRcdFx0XHRcdHRhcmdldC5kZXN0cm95U3RhdHVzLmRpc3Bvc2luZyA9IHRydWU7XHJcblx0XHRcdFx0XHRmb3IobGV0IGkgb2YgdGFyZ2V0Lm9uZGlzcG9zZSgpKXtcclxuXHRcdFx0XHRcdFx0aS5jYWxsKHRhcmdldCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0YXJnZXQuZGlzcG9zZSl7XHJcblx0XHRcdFx0XHR0YXJnZXQuZGVzdHJveVN0YXR1cy5kaXNwb3NpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdFx0dGFyZ2V0LmRpc3Bvc2UoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCF0YXJnZXQuZGVzdHJveVN0YXR1cy5kZXN0cm95aW5nKXtcclxuXHRcdFx0XHR0YXJnZXQuZGVzdHJveVN0YXR1cy5kZXN0cm95aW5nID0gdHJ1ZTtcclxuXHRcdFx0XHREZXN0cm95ZXIuY29udGFpbmVyLmFwcGVuZENoaWxkKHRhcmdldCk7XHJcblx0XHRcdFx0Zm9yKGxldCBpIGluIHRhcmdldCl7XHJcblx0XHRcdFx0XHRpZiAoaS5pbmRleE9mKCckJykgPT0gMCl7XHJcblx0XHRcdFx0XHRcdGxldCB0bXA6YW55ID0gdGFyZ2V0W2ldO1xyXG5cdFx0XHRcdFx0XHRpZiAodG1wIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpe1xyXG5cdFx0XHRcdFx0XHRcdHRhcmdldFtpXSA9IG51bGw7XHJcblx0XHRcdFx0XHRcdFx0dG1wID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIHRhcmdldFtpXTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHREZXN0cm95ZXIuY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gZGVzdHJveSh0YXJnZXQ6YW55KTp2b2lke1xyXG5cdFx0aWYgKHRhcmdldC5sZW5ndGggPiAwIHx8IHRhcmdldCBpbnN0YW5jZW9mIEFycmF5KXtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIHRhcmdldCl7XHJcblx0XHRcdFx0RGVzdHJveWVyLmRlc3Ryb3koaSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAodGFyZ2V0IGluc3RhbmNlb2YgRWxlbWVudCl7XHJcblx0XHRcdFx0RGVzdHJveWVyLmRlc3Ryb3kodGFyZ2V0KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGV4cG9ydCBmdW5jdGlvbiBjZW50ZXJTY3JlZW4odGFyZ2V0OmFueSl7XHJcblx0XHRsZXQgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHRcdHRhcmdldC5zdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIjtcclxuXHRcdHRhcmdldC5zdHlsZS5sZWZ0ID0gXCI1MCVcIjtcclxuXHRcdHRhcmdldC5zdHlsZS50b3AgPSBcIjUwJVwiO1xyXG5cdFx0dGFyZ2V0LnN0eWxlLm1hcmdpblRvcCA9IC1yZWN0LmhlaWdodCAvIDIgKyBcInB4XCI7XHJcblx0XHR0YXJnZXQuc3R5bGUubWFyZ2luTGVmdCA9IC1yZWN0LndpZHRoIC8gMiArIFwicHhcIjtcclxuXHR9XHJcbn0iLCJpbnRlcmZhY2UgU3RyaW5ne1xyXG5cdHN0YXJ0c1dpdGgoc3RyOnN0cmluZyk6Ym9vbGVhbjtcclxuXHRmb3JtYXQoLi4ucmVzdEFyZ3M6YW55W10pOnN0cmluZztcclxuXHRmaWxsKGFyZ3M6YW55KTpzdHJpbmc7XHJcbn1cclxuXHJcblN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCA9IGZ1bmN0aW9uKHN0cjpzdHJpbmcpOmJvb2xlYW57XHJcblx0cmV0dXJuIHRoaXMuaW5kZXhPZihzdHIpPT0wO1xyXG59XHJcblN0cmluZy5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKCkge1xyXG5cdGxldCBhcmdzID0gYXJndW1lbnRzO1xyXG5cdGxldCBzID0gdGhpcztcclxuXHRpZiAoIWFyZ3MgfHwgYXJncy5sZW5ndGggPCAxKSB7XHJcblx0XHRyZXR1cm4gcztcclxuXHR9XHJcblx0bGV0IHIgPSBzO1xyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xyXG5cdFx0bGV0IHJlZyA9IG5ldyBSZWdFeHAoJ1xcXFx7JyArIGkgKyAnXFxcXH0nKTtcclxuXHRcdHIgPSByLnJlcGxhY2UocmVnLCBhcmdzW2ldKTtcclxuXHR9XHJcblx0cmV0dXJuIHI7XHJcbn07XHJcblN0cmluZy5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uKGFyZzphbnkpOnN0cmluZ3tcclxuXHRpZiAoIWFyZyB8fCB0eXBlb2YoYXJnKSAhPSAnb2JqZWN0Jyl7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0dmFyIHJsdCA9IHRoaXM7XHJcblx0Zm9yKGxldCBpIGluIGFyZyl7XHJcblx0XHR2YXIgcmVnZXggPSBuZXcgUmVnRXhwKCdcXHsnK2krJ1xcfScsICdpZycpO1xyXG5cdFx0cmx0ID0gcmx0LnJlcGxhY2UocmVnZXgsIGFyZ1tpXSk7XHJcblx0fVxyXG5cdHJldHVybiBybHQ7XHJcbn0iLCJuYW1lc3BhY2Ugd297XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIG1vbml0b3J7XHJcbiAgICAgICAgcHJpdmF0ZSB2YWw6YW55ID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIHVuZG86RnVuY3Rpb25bXSA9IFtdO1xyXG4gICAgICAgIHByaXZhdGUgb3JpZ2luOmFueSA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBmd2Q6RnVuY3Rpb25bXSA9IFtdO1xyXG5cclxuICAgICAgICB3YXRjaCh0YXJnZXQ6YW55LCBwcm9wOnN0cmluZywgY2FsbGJhY2s/OkZ1bmN0aW9uLCBtb2RlPzpzdHJpbmcpe1xyXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmIChtb2RlID09ICc+Jyl7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB0aGlzLnZhbDtcclxuICAgICAgICAgICAgfWVsc2UgaWYgKG1vZGUgPT0gJzwnKXtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsID0gdGFyZ2V0W3Byb3BdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghc2VsZi5vcmlnaW4pe1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vcmlnaW4gPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbCA9IHRhcmdldFtwcm9wXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYudmFsO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24obmV3VmFsdWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBvbGR2YWwgPSBzZWxmLnZhbDtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnZhbCA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjayl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG5ld1ZhbHVlLCBvbGR2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob2xkdmFsICE9IG5ld1ZhbHVlICYmIHNlbGYub3JpZ2luLm9uY2hhbmdlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5vcmlnaW4ub25jaGFuZ2UobmV3VmFsdWUsIG9sZHZhbCwgcHJvcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaSBvZiBzZWxmLmZ3ZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOnRydWUsXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOnRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzZWxmLnVuZG8uYWRkKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0WydfJyArIHByb3BdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbihuZXdWYWx1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFsnXycgKyBwcm9wXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOnRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTp0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yd2FyZCh0YXJnZXQ6YW55LCBwcm9wOnN0cmluZywgaXNhdHRyPzpib29sZWFuKXtcclxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAoaXNhdHRyKXtcclxuICAgICAgICAgICAgICAgIHNlbGYuZndkLmFkZChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUocHJvcCwgc2VsZi52YWwpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgc2VsZi5md2QuYWRkKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gc2VsZi52YWw7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRhcmdldFtwcm9wXSA9IHNlbGYudmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYW5jZWwoKXtcclxuICAgICAgICAgICAgZm9yKGxldCBpIG9mIHRoaXMudW5kbyl7XHJcbiAgICAgICAgICAgICAgICBpKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy51bmRvLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZndkLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvYnNlcnZlKGVsOmFueSwgYXR0cjpzdHJpbmcsIGNhbGxiYWNrPzpGdW5jdGlvbil7XHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgaWYgKCFzZWxmLm9yaWdpbil7XHJcbiAgICAgICAgICAgICAgICBzZWxmLm9yaWdpbiA9IGVsO1xyXG4gICAgICAgICAgICAgICAgc2VsZi52YWwgPSBlbC5nZXRBdHRyaWJ1dGUoYXR0cik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IG9icyA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uKG11dGF0aW9ucyl7XHJcbiAgICAgICAgICAgICAgICBtdXRhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihtdXRhdGlvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgPT0gYXR0cil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudmFsID0gZWwuZ2V0QXR0cmlidXRlKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soc2VsZi52YWwsIG11dGF0aW9uLm9sZFZhbHVlLCBhdHRyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgb2JzLm9ic2VydmUoZWwsIHthdHRyaWJ1dGVzOnRydWUsIGNoaWxkTGlzdDpmYWxzZSwgY2hhcmFjdGVyRGF0YTpmYWxzZSwgYXR0cmlidXRlT2xkVmFsdWU6dHJ1ZSwgYXR0cmlidXRlRmlsdGVyOlthdHRyXX0pO1xyXG4gICAgICAgICAgICBzZWxmLnVuZG8uYWRkKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBvYnMuZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
