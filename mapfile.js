! function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = "function" == typeof require && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }
    for (var i = "function" == typeof require && require, o = 0; o < r.length; o++) s(r[o]);
    return s
}({
    1: [function(require, module) {
        ! function(window, document, undefined) {
            var oldL = window.L,
                L = {};
            L.version = "0.7.7", "object" == typeof module && "object" == typeof module.exports ? module.exports = L : "function" == typeof define && define.amd && define(L), L.noConflict = function() {
                    return window.L = oldL, this
                }, window.L = L, L.Util = {
                    extend: function(dest) {
                        var i, j, len, src, sources = Array.prototype.slice.call(arguments, 1);
                        for (j = 0, len = sources.length; len > j; j++) {
                            src = sources[j] || {};
                            for (i in src) src.hasOwnProperty(i) && (dest[i] = src[i])
                        }
                        return dest
                    },
                    bind: function(fn, obj) {
                        var args = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null;
                        return function() {
                            return fn.apply(obj, args || arguments)
                        }
                    },
                    stamp: function() {
                        var lastId = 0,
                            key = "_leaflet_id";
                        return function(obj) {
                            return obj[key] = obj[key] || ++lastId, obj[key]
                        }
                    }(),
                    invokeEach: function(obj, method, context) {
                        var i, args;
                        if ("object" == typeof obj) {
                            args = Array.prototype.slice.call(arguments, 3);
                            for (i in obj) method.apply(context, [i, obj[i]].concat(args));
                            return !0
                        }
                        return !1
                    },
                    limitExecByInterval: function(fn, time, context) {
                        var lock, execOnUnlock;
                        return function wrapperFn() {
                            var args = arguments;
                            return lock ? void(execOnUnlock = !0) : (lock = !0, setTimeout(function() {
                                lock = !1, execOnUnlock && (wrapperFn.apply(context, args), execOnUnlock = !1)
                            }, time), void fn.apply(context, args))
                        }
                    },
                    falseFn: function() {
                        return !1
                    },
                    formatNum: function(num, digits) {
                        var pow = Math.pow(10, digits || 5);
                        return Math.round(num * pow) / pow
                    },
                    trim: function(str) {
                        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "")
                    },
                    splitWords: function(str) {
                        return L.Util.trim(str).split(/\s+/)
                    },
                    setOptions: function(obj, options) {
                        return obj.options = L.extend({}, obj.options, options), obj.options
                    },
                    getParamString: function(obj, existingUrl, uppercase) {
                        var params = [];
                        for (var i in obj) params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + "=" + encodeURIComponent(obj[i]));
                        return (existingUrl && -1 !== existingUrl.indexOf("?") ? "&" : "?") + params.join("&")
                    },
                    template: function(str, data) {
                        return str.replace(/\{ *([\w_]+) *\}/g, function(str, key) {
                            var value = data[key];
                            if (value === undefined) throw new Error("No value provided for variable " + str);
                            return "function" == typeof value && (value = value(data)), value
                        })
                    },
                    isArray: Array.isArray || function(obj) {
                        return "[object Array]" === Object.prototype.toString.call(obj)
                    },
                    emptyImageUrl: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                },
                function() {
                    function getPrefixed(name) {
                        var i, fn, prefixes = ["webkit", "moz", "o", "ms"];
                        for (i = 0; i < prefixes.length && !fn; i++) fn = window[prefixes[i] + name];
                        return fn
                    }

                    function timeoutDefer(fn) {
                        var time = +new Date,
                            timeToCall = Math.max(0, 16 - (time - lastTime));
                        return lastTime = time + timeToCall, window.setTimeout(fn, timeToCall)
                    }
                    var lastTime = 0,
                        requestFn = window.requestAnimationFrame || getPrefixed("RequestAnimationFrame") || timeoutDefer,
                        cancelFn = window.cancelAnimationFrame || getPrefixed("CancelAnimationFrame") || getPrefixed("CancelRequestAnimationFrame") || function(id) {
                            window.clearTimeout(id)
                        };
                    L.Util.requestAnimFrame = function(fn, context, immediate, element) {
                        return fn = L.bind(fn, context), immediate && requestFn === timeoutDefer ? void fn() : requestFn.call(window, fn, element)
                    }, L.Util.cancelAnimFrame = function(id) {
                        id && cancelFn.call(window, id)
                    }
                }(), L.extend = L.Util.extend, L.bind = L.Util.bind, L.stamp = L.Util.stamp, L.setOptions = L.Util.setOptions, L.Class = function() {}, L.Class.extend = function(props) {
                    var NewClass = function() {
                            this.initialize && this.initialize.apply(this, arguments), this._initHooks && this.callInitHooks()
                        },
                        F = function() {};
                    F.prototype = this.prototype;
                    var proto = new F;
                    proto.constructor = NewClass, NewClass.prototype = proto;
                    for (var i in this) this.hasOwnProperty(i) && "prototype" !== i && (NewClass[i] = this[i]);
                    props.statics && (L.extend(NewClass, props.statics), delete props.statics), props.includes && (L.Util.extend.apply(null, [proto].concat(props.includes)), delete props.includes), props.options && proto.options && (props.options = L.extend({}, proto.options, props.options)), L.extend(proto, props), proto._initHooks = [];
                    var parent = this;
                    return NewClass.__super__ = parent.prototype, proto.callInitHooks = function() {
                        if (!this._initHooksCalled) {
                            parent.prototype.callInitHooks && parent.prototype.callInitHooks.call(this), this._initHooksCalled = !0;
                            for (var i = 0, len = proto._initHooks.length; len > i; i++) proto._initHooks[i].call(this)
                        }
                    }, NewClass
                }, L.Class.include = function(props) {
                    L.extend(this.prototype, props)
                }, L.Class.mergeOptions = function(options) {
                    L.extend(this.prototype.options, options)
                }, L.Class.addInitHook = function(fn) {
                    var args = Array.prototype.slice.call(arguments, 1),
                        init = "function" == typeof fn ? fn : function() {
                            this[fn].apply(this, args)
                        };
                    this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(init)
                };
            var eventsKey = "_leaflet_events";
            L.Mixin = {}, L.Mixin.Events = {
                    addEventListener: function(types, fn, context) {
                        if (L.Util.invokeEach(types, this.addEventListener, this, fn, context)) return this;
                        var i, len, event, type, indexKey, indexLenKey, typeIndex, events = this[eventsKey] = this[eventsKey] || {},
                            contextId = context && context !== this && L.stamp(context);
                        for (types = L.Util.splitWords(types), i = 0, len = types.length; len > i; i++) event = {
                            action: fn,
                            context: context || this
                        }, type = types[i], contextId ? (indexKey = type + "_idx", indexLenKey = indexKey + "_len", typeIndex = events[indexKey] = events[indexKey] || {}, typeIndex[contextId] || (typeIndex[contextId] = [], events[indexLenKey] = (events[indexLenKey] || 0) + 1), typeIndex[contextId].push(event)) : (events[type] = events[type] || [], events[type].push(event));
                        return this
                    },
                    hasEventListeners: function(type) {
                        var events = this[eventsKey];
                        return !!events && (type in events && events[type].length > 0 || type + "_idx" in events && events[type + "_idx_len"] > 0)
                    },
                    removeEventListener: function(types, fn, context) {
                        if (!this[eventsKey]) return this;
                        if (!types) return this.clearAllEventListeners();
                        if (L.Util.invokeEach(types, this.removeEventListener, this, fn, context)) return this;
                        var i, len, type, listeners, j, indexKey, indexLenKey, typeIndex, removed, events = this[eventsKey],
                            contextId = context && context !== this && L.stamp(context);
                        for (types = L.Util.splitWords(types), i = 0, len = types.length; len > i; i++)
                            if (type = types[i], indexKey = type + "_idx", indexLenKey = indexKey + "_len", typeIndex = events[indexKey], fn) {
                                if (listeners = contextId && typeIndex ? typeIndex[contextId] : events[type]) {
                                    for (j = listeners.length - 1; j >= 0; j--) listeners[j].action !== fn || context && listeners[j].context !== context || (removed = listeners.splice(j, 1), removed[0].action = L.Util.falseFn);
                                    context && typeIndex && 0 === listeners.length && (delete typeIndex[contextId], events[indexLenKey]--)
                                }
                            } else delete events[type], delete events[indexKey], delete events[indexLenKey];
                        return this
                    },
                    clearAllEventListeners: function() {
                        return delete this[eventsKey], this
                    },
                    fireEvent: function(type, data) {
                        if (!this.hasEventListeners(type)) return this;
                        var listeners, i, len, typeIndex, contextId, event = L.Util.extend({}, data, {
                                type: type,
                                target: this
                            }),
                            events = this[eventsKey];
                        if (events[type])
                            for (listeners = events[type].slice(), i = 0, len = listeners.length; len > i; i++) listeners[i].action.call(listeners[i].context, event);
                        typeIndex = events[type + "_idx"];
                        for (contextId in typeIndex)
                            if (listeners = typeIndex[contextId].slice())
                                for (i = 0, len = listeners.length; len > i; i++) listeners[i].action.call(listeners[i].context, event);
                        return this
                    },
                    addOneTimeEventListener: function(types, fn, context) {
                        if (L.Util.invokeEach(types, this.addOneTimeEventListener, this, fn, context)) return this;
                        var handler = L.bind(function() {
                            this.removeEventListener(types, fn, context).removeEventListener(types, handler, context)
                        }, this);
                        return this.addEventListener(types, fn, context).addEventListener(types, handler, context)
                    }
                }, L.Mixin.Events.on = L.Mixin.Events.addEventListener, L.Mixin.Events.off = L.Mixin.Events.removeEventListener, L.Mixin.Events.once = L.Mixin.Events.addOneTimeEventListener, L.Mixin.Events.fire = L.Mixin.Events.fireEvent,
                function() {
                    var ie = "ActiveXObject" in window,
                        ielt9 = ie && !document.addEventListener,
                        ua = navigator.userAgent.toLowerCase(),
                        webkit = -1 !== ua.indexOf("webkit"),
                        chrome = -1 !== ua.indexOf("chrome"),
                        phantomjs = -1 !== ua.indexOf("phantom"),
                        android = -1 !== ua.indexOf("android"),
                        android23 = -1 !== ua.search("android [23]"),
                        gecko = -1 !== ua.indexOf("gecko"),
                        mobile = typeof orientation != undefined + "",
                        msPointer = !window.PointerEvent && window.MSPointerEvent,
                        pointer = window.PointerEvent && window.navigator.pointerEnabled || msPointer,
                        retina = "devicePixelRatio" in window && window.devicePixelRatio > 1 || "matchMedia" in window && window.matchMedia("(min-resolution:144dpi)") && window.matchMedia("(min-resolution:144dpi)").matches,
                        doc = document.documentElement,
                        ie3d = ie && "transition" in doc.style,
                        webkit3d = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix && !android23,
                        gecko3d = "MozPerspective" in doc.style,
                        opera3d = "OTransition" in doc.style,
                        any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d || opera3d) && !phantomjs,
                        touch = !window.L_NO_TOUCH && !phantomjs && (pointer || "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch);
                    L.Browser = {
                        ie: ie,
                        ielt9: ielt9,
                        webkit: webkit,
                        gecko: gecko && !webkit && !window.opera && !ie,
                        android: android,
                        android23: android23,
                        chrome: chrome,
                        ie3d: ie3d,
                        webkit3d: webkit3d,
                        gecko3d: gecko3d,
                        opera3d: opera3d,
                        any3d: any3d,
                        mobile: mobile,
                        mobileWebkit: mobile && webkit,
                        mobileWebkit3d: mobile && webkit3d,
                        mobileOpera: mobile && window.opera,
                        touch: touch,
                        msPointer: msPointer,
                        pointer: pointer,
                        retina: retina
                    }
                }(), L.Point = function(x, y, round) {
                    this.x = round ? Math.round(x) : x, this.y = round ? Math.round(y) : y
                }, L.Point.prototype = {
                    clone: function() {
                        return new L.Point(this.x, this.y)
                    },
                    add: function(point) {
                        return this.clone()._add(L.point(point))
                    },
                    _add: function(point) {
                        return this.x += point.x, this.y += point.y, this
                    },
                    subtract: function(point) {
                        return this.clone()._subtract(L.point(point))
                    },
                    _subtract: function(point) {
                        return this.x -= point.x, this.y -= point.y, this
                    },
                    divideBy: function(num) {
                        return this.clone()._divideBy(num)
                    },
                    _divideBy: function(num) {
                        return this.x /= num, this.y /= num, this
                    },
                    multiplyBy: function(num) {
                        return this.clone()._multiplyBy(num)
                    },
                    _multiplyBy: function(num) {
                        return this.x *= num, this.y *= num, this
                    },
                    round: function() {
                        return this.clone()._round()
                    },
                    _round: function() {
                        return this.x = Math.round(this.x), this.y = Math.round(this.y), this
                    },
                    floor: function() {
                        return this.clone()._floor()
                    },
                    _floor: function() {
                        return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this
                    },
                    distanceTo: function(point) {
                        point = L.point(point);
                        var x = point.x - this.x,
                            y = point.y - this.y;
                        return Math.sqrt(x * x + y * y)
                    },
                    equals: function(point) {
                        return point = L.point(point), point.x === this.x && point.y === this.y
                    },
                    contains: function(point) {
                        return point = L.point(point), Math.abs(point.x) <= Math.abs(this.x) && Math.abs(point.y) <= Math.abs(this.y)
                    },
                    toString: function() {
                        return "Point(" + L.Util.formatNum(this.x) + ", " + L.Util.formatNum(this.y) + ")"
                    }
                }, L.point = function(x, y, round) {
                    return x instanceof L.Point ? x : L.Util.isArray(x) ? new L.Point(x[0], x[1]) : x === undefined || null === x ? x : new L.Point(x, y, round)
                }, L.Bounds = function(a, b) {
                    if (a)
                        for (var points = b ? [a, b] : a, i = 0, len = points.length; len > i; i++) this.extend(points[i])
                }, L.Bounds.prototype = {
                    extend: function(point) {
                        return point = L.point(point), this.min || this.max ? (this.min.x = Math.min(point.x, this.min.x), this.max.x = Math.max(point.x, this.max.x), this.min.y = Math.min(point.y, this.min.y), this.max.y = Math.max(point.y, this.max.y)) : (this.min = point.clone(), this.max = point.clone()), this
                    },
                    getCenter: function(round) {
                        return new L.Point((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, round)
                    },
                    getBottomLeft: function() {
                        return new L.Point(this.min.x, this.max.y)
                    },
                    getTopRight: function() {
                        return new L.Point(this.max.x, this.min.y)
                    },
                    getSize: function() {
                        return this.max.subtract(this.min)
                    },
                    contains: function(obj) {
                        var min, max;
                        return obj = "number" == typeof obj[0] || obj instanceof L.Point ? L.point(obj) : L.bounds(obj), obj instanceof L.Bounds ? (min = obj.min, max = obj.max) : min = max = obj, min.x >= this.min.x && max.x <= this.max.x && min.y >= this.min.y && max.y <= this.max.y
                    },
                    intersects: function(bounds) {
                        bounds = L.bounds(bounds);
                        var min = this.min,
                            max = this.max,
                            min2 = bounds.min,
                            max2 = bounds.max,
                            xIntersects = max2.x >= min.x && min2.x <= max.x,
                            yIntersects = max2.y >= min.y && min2.y <= max.y;
                        return xIntersects && yIntersects
                    },
                    isValid: function() {
                        return !(!this.min || !this.max)
                    }
                }, L.bounds = function(a, b) {
                    return !a || a instanceof L.Bounds ? a : new L.Bounds(a, b)
                }, L.Transformation = function(a, b, c, d) {
                    this._a = a, this._b = b, this._c = c, this._d = d
                }, L.Transformation.prototype = {
                    transform: function(point, scale) {
                        return this._transform(point.clone(), scale)
                    },
                    _transform: function(point, scale) {
                        return scale = scale || 1, point.x = scale * (this._a * point.x + this._b), point.y = scale * (this._c * point.y + this._d), point
                    },
                    untransform: function(point, scale) {
                        return scale = scale || 1, new L.Point((point.x / scale - this._b) / this._a, (point.y / scale - this._d) / this._c)
                    }
                }, L.DomUtil = {
                    get: function(id) {
                        return "string" == typeof id ? document.getElementById(id) : id
                    },
                    getStyle: function(el, style) {
                        var value = el.style[style];
                        if (!value && el.currentStyle && (value = el.currentStyle[style]), (!value || "auto" === value) && document.defaultView) {
                            var css = document.defaultView.getComputedStyle(el, null);
                            value = css ? css[style] : null
                        }
                        return "auto" === value ? null : value
                    },
                    getViewportOffset: function(element) {
                        var pos, top = 0,
                            left = 0,
                            el = element,
                            docBody = document.body,
                            docEl = document.documentElement;
                        do {
                            if (top += el.offsetTop || 0, left += el.offsetLeft || 0, top += parseInt(L.DomUtil.getStyle(el, "borderTopWidth"), 10) || 0, left += parseInt(L.DomUtil.getStyle(el, "borderLeftWidth"), 10) || 0, pos = L.DomUtil.getStyle(el, "position"), el.offsetParent === docBody && "absolute" === pos) break;
                            if ("fixed" === pos) {
                                top += docBody.scrollTop || docEl.scrollTop || 0, left += docBody.scrollLeft || docEl.scrollLeft || 0;
                                break
                            }
                            if ("relative" === pos && !el.offsetLeft) {
                                var width = L.DomUtil.getStyle(el, "width"),
                                    maxWidth = L.DomUtil.getStyle(el, "max-width"),
                                    r = el.getBoundingClientRect();
                                ("none" !== width || "none" !== maxWidth) && (left += r.left + el.clientLeft), top += r.top + (docBody.scrollTop || docEl.scrollTop || 0);
                                break
                            }
                            el = el.offsetParent
                        } while (el);
                        el = element;
                        do {
                            if (el === docBody) break;
                            top -= el.scrollTop || 0, left -= el.scrollLeft || 0, el = el.parentNode
                        } while (el);
                        return new L.Point(left, top)
                    },
                    documentIsLtr: function() {
                        return L.DomUtil._docIsLtrCached || (L.DomUtil._docIsLtrCached = !0, L.DomUtil._docIsLtr = "ltr" === L.DomUtil.getStyle(document.body, "direction")), L.DomUtil._docIsLtr
                    },
                    create: function(tagName, className, container) {
                        var el = document.createElement(tagName);
                        return el.className = className, container && container.appendChild(el), el
                    },
                    hasClass: function(el, name) {
                        if (el.classList !== undefined) return el.classList.contains(name);
                        var className = L.DomUtil._getClass(el);
                        return className.length > 0 && new RegExp("(^|\\s)" + name + "(\\s|$)").test(className)
                    },
                    addClass: function(el, name) {
                        if (el.classList !== undefined)
                            for (var classes = L.Util.splitWords(name), i = 0, len = classes.length; len > i; i++) el.classList.add(classes[i]);
                        else if (!L.DomUtil.hasClass(el, name)) {
                            var className = L.DomUtil._getClass(el);
                            L.DomUtil._setClass(el, (className ? className + " " : "") + name)
                        }
                    },
                    removeClass: function(el, name) {
                        el.classList !== undefined ? el.classList.remove(name) : L.DomUtil._setClass(el, L.Util.trim((" " + L.DomUtil._getClass(el) + " ").replace(" " + name + " ", " ")))
                    },
                    _setClass: function(el, name) {
                        el.className.baseVal === undefined ? el.className = name : el.className.baseVal = name
                    },
                    _getClass: function(el) {
                        return el.className.baseVal === undefined ? el.className : el.className.baseVal
                    },
                    setOpacity: function(el, value) {
                        if ("opacity" in el.style) el.style.opacity = value;
                        else if ("filter" in el.style) {
                            var filter = !1,
                                filterName = "DXImageTransform.Microsoft.Alpha";
                            try {
                                filter = el.filters.item(filterName)
                            } catch (e) {
                                if (1 === value) return
                            }
                            value = Math.round(100 * value), filter ? (filter.Enabled = 100 !== value, filter.Opacity = value) : el.style.filter += " progid:" + filterName + "(opacity=" + value + ")"
                        }
                    },
                    testProp: function(props) {
                        for (var style = document.documentElement.style, i = 0; i < props.length; i++)
                            if (props[i] in style) return props[i];
                        return !1
                    },
                    getTranslateString: function(point) {
                        var is3d = L.Browser.webkit3d,
                            open = "translate" + (is3d ? "3d" : "") + "(",
                            close = (is3d ? ",0" : "") + ")";
                        return open + point.x + "px," + point.y + "px" + close
                    },
                    getScaleString: function(scale, origin) {
                        var preTranslateStr = L.DomUtil.getTranslateString(origin.add(origin.multiplyBy(-1 * scale))),
                            scaleStr = " scale(" + scale + ") ";
                        return preTranslateStr + scaleStr
                    },
                    setPosition: function(el, point, disable3D) {
                        el._leaflet_pos = point, !disable3D && L.Browser.any3d ? el.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(point) : (el.style.left = point.x + "px", el.style.top = point.y + "px")
                    },
                    getPosition: function(el) {
                        return el._leaflet_pos
                    }
                }, L.DomUtil.TRANSFORM = L.DomUtil.testProp(["transform", "WebkitTransform", "OTransform", "MozTransform", "msTransform"]), L.DomUtil.TRANSITION = L.DomUtil.testProp(["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]), L.DomUtil.TRANSITION_END = "webkitTransition" === L.DomUtil.TRANSITION || "OTransition" === L.DomUtil.TRANSITION ? L.DomUtil.TRANSITION + "End" : "transitionend",
                function() {
                    if ("onselectstart" in document) L.extend(L.DomUtil, {
                        disableTextSelection: function() {
                            L.DomEvent.on(window, "selectstart", L.DomEvent.preventDefault)
                        },
                        enableTextSelection: function() {
                            L.DomEvent.off(window, "selectstart", L.DomEvent.preventDefault)
                        }
                    });
                    else {
                        var userSelectProperty = L.DomUtil.testProp(["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]);
                        L.extend(L.DomUtil, {
                            disableTextSelection: function() {
                                if (userSelectProperty) {
                                    var style = document.documentElement.style;
                                    this._userSelect = style[userSelectProperty], style[userSelectProperty] = "none"
                                }
                            },
                            enableTextSelection: function() {
                                userSelectProperty && (document.documentElement.style[userSelectProperty] = this._userSelect, delete this._userSelect)
                            }
                        })
                    }
                    L.extend(L.DomUtil, {
                        disableImageDrag: function() {
                            L.DomEvent.on(window, "dragstart", L.DomEvent.preventDefault)
                        },
                        enableImageDrag: function() {
                            L.DomEvent.off(window, "dragstart", L.DomEvent.preventDefault)
                        }
                    })
                }(), L.LatLng = function(lat, lng, alt) {
                    if (lat = parseFloat(lat), lng = parseFloat(lng), isNaN(lat) || isNaN(lng)) throw new Error("Invalid LatLng object: (" + lat + ", " + lng + ")");
                    this.lat = lat, this.lng = lng, alt !== undefined && (this.alt = parseFloat(alt))
                }, L.extend(L.LatLng, {
                    DEG_TO_RAD: Math.PI / 180,
                    RAD_TO_DEG: 180 / Math.PI,
                    MAX_MARGIN: 1e-9
                }), L.LatLng.prototype = {
                    equals: function(obj) {
                        if (!obj) return !1;
                        obj = L.latLng(obj);
                        var margin = Math.max(Math.abs(this.lat - obj.lat), Math.abs(this.lng - obj.lng));
                        return margin <= L.LatLng.MAX_MARGIN
                    },
                    toString: function(precision) {
                        return "LatLng(" + L.Util.formatNum(this.lat, precision) + ", " + L.Util.formatNum(this.lng, precision) + ")"
                    },
                    distanceTo: function(other) {
                        other = L.latLng(other);
                        var R = 6378137,
                            d2r = L.LatLng.DEG_TO_RAD,
                            dLat = (other.lat - this.lat) * d2r,
                            dLon = (other.lng - this.lng) * d2r,
                            lat1 = this.lat * d2r,
                            lat2 = other.lat * d2r,
                            sin1 = Math.sin(dLat / 2),
                            sin2 = Math.sin(dLon / 2),
                            a = sin1 * sin1 + sin2 * sin2 * Math.cos(lat1) * Math.cos(lat2);
                        return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
                    },
                    wrap: function(a, b) {
                        var lng = this.lng;
                        return a = a || -180, b = b || 180, lng = (lng + b) % (b - a) + (a > lng || lng === b ? b : a), new L.LatLng(this.lat, lng)
                    }
                }, L.latLng = function(a, b) {
                    return a instanceof L.LatLng ? a : L.Util.isArray(a) ? "number" == typeof a[0] || "string" == typeof a[0] ? new L.LatLng(a[0], a[1], a[2]) : null : a === undefined || null === a ? a : "object" == typeof a && "lat" in a ? new L.LatLng(a.lat, "lng" in a ? a.lng : a.lon) : b === undefined ? null : new L.LatLng(a, b)
                }, L.LatLngBounds = function(southWest, northEast) {
                    if (southWest)
                        for (var latlngs = northEast ? [southWest, northEast] : southWest, i = 0, len = latlngs.length; len > i; i++) this.extend(latlngs[i])
                }, L.LatLngBounds.prototype = {
                    extend: function(obj) {
                        if (!obj) return this;
                        var latLng = L.latLng(obj);
                        return obj = null !== latLng ? latLng : L.latLngBounds(obj), obj instanceof L.LatLng ? this._southWest || this._northEast ? (this._southWest.lat = Math.min(obj.lat, this._southWest.lat), this._southWest.lng = Math.min(obj.lng, this._southWest.lng), this._northEast.lat = Math.max(obj.lat, this._northEast.lat), this._northEast.lng = Math.max(obj.lng, this._northEast.lng)) : (this._southWest = new L.LatLng(obj.lat, obj.lng), this._northEast = new L.LatLng(obj.lat, obj.lng)) : obj instanceof L.LatLngBounds && (this.extend(obj._southWest), this.extend(obj._northEast)), this
                    },
                    pad: function(bufferRatio) {
                        var sw = this._southWest,
                            ne = this._northEast,
                            heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
                            widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;
                        return new L.LatLngBounds(new L.LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer), new L.LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer))
                    },
                    getCenter: function() {
                        return new L.LatLng((this._southWest.lat + this._northEast.lat) / 2, (this._southWest.lng + this._northEast.lng) / 2)
                    },
                    getSouthWest: function() {
                        return this._southWest
                    },
                    getNorthEast: function() {
                        return this._northEast
                    },
                    getNorthWest: function() {
                        return new L.LatLng(this.getNorth(), this.getWest())
                    },
                    getSouthEast: function() {
                        return new L.LatLng(this.getSouth(), this.getEast())
                    },
                    getWest: function() {
                        return this._southWest.lng
                    },
                    getSouth: function() {
                        return this._southWest.lat
                    },
                    getEast: function() {
                        return this._northEast.lng
                    },
                    getNorth: function() {
                        return this._northEast.lat
                    },
                    contains: function(obj) {
                        obj = "number" == typeof obj[0] || obj instanceof L.LatLng ? L.latLng(obj) : L.latLngBounds(obj);
                        var sw2, ne2, sw = this._southWest,
                            ne = this._northEast;
                        return obj instanceof L.LatLngBounds ? (sw2 = obj.getSouthWest(), ne2 = obj.getNorthEast()) : sw2 = ne2 = obj, sw2.lat >= sw.lat && ne2.lat <= ne.lat && sw2.lng >= sw.lng && ne2.lng <= ne.lng
                    },
                    intersects: function(bounds) {
                        bounds = L.latLngBounds(bounds);
                        var sw = this._southWest,
                            ne = this._northEast,
                            sw2 = bounds.getSouthWest(),
                            ne2 = bounds.getNorthEast(),
                            latIntersects = ne2.lat >= sw.lat && sw2.lat <= ne.lat,
                            lngIntersects = ne2.lng >= sw.lng && sw2.lng <= ne.lng;
                        return latIntersects && lngIntersects
                    },
                    toBBoxString: function() {
                        return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",")
                    },
                    equals: function(bounds) {
                        return bounds ? (bounds = L.latLngBounds(bounds), this._southWest.equals(bounds.getSouthWest()) && this._northEast.equals(bounds.getNorthEast())) : !1
                    },
                    isValid: function() {
                        return !(!this._southWest || !this._northEast)
                    }
                }, L.latLngBounds = function(a, b) {
                    return !a || a instanceof L.LatLngBounds ? a : new L.LatLngBounds(a, b)
                }, L.Projection = {}, L.Projection.SphericalMercator = {
                    MAX_LATITUDE: 85.0511287798,
                    project: function(latlng) {
                        var d = L.LatLng.DEG_TO_RAD,
                            max = this.MAX_LATITUDE,
                            lat = Math.max(Math.min(max, latlng.lat), -max),
                            x = latlng.lng * d,
                            y = lat * d;
                        return y = Math.log(Math.tan(Math.PI / 4 + y / 2)), new L.Point(x, y)
                    },
                    unproject: function(point) {
                        var d = L.LatLng.RAD_TO_DEG,
                            lng = point.x * d,
                            lat = (2 * Math.atan(Math.exp(point.y)) - Math.PI / 2) * d;
                        return new L.LatLng(lat, lng)
                    }
                }, L.Projection.LonLat = {
                    project: function(latlng) {
                        return new L.Point(latlng.lng, latlng.lat)
                    },
                    unproject: function(point) {
                        return new L.LatLng(point.y, point.x)
                    }
                }, L.CRS = {
                    latLngToPoint: function(latlng, zoom) {
                        var projectedPoint = this.projection.project(latlng),
                            scale = this.scale(zoom);
                        return this.transformation._transform(projectedPoint, scale)
                    },
                    pointToLatLng: function(point, zoom) {
                        var scale = this.scale(zoom),
                            untransformedPoint = this.transformation.untransform(point, scale);
                        return this.projection.unproject(untransformedPoint)
                    },
                    project: function(latlng) {
                        return this.projection.project(latlng)
                    },
                    scale: function(zoom) {
                        return 256 * Math.pow(2, zoom)
                    },
                    getSize: function(zoom) {
                        var s = this.scale(zoom);
                        return L.point(s, s)
                    }
                }, L.CRS.Simple = L.extend({}, L.CRS, {
                    projection: L.Projection.LonLat,
                    transformation: new L.Transformation(1, 0, -1, 0),
                    scale: function(zoom) {
                        return Math.pow(2, zoom)
                    }
                }), L.CRS.EPSG3857 = L.extend({}, L.CRS, {
                    code: "EPSG:3857",
                    projection: L.Projection.SphericalMercator,
                    transformation: new L.Transformation(.5 / Math.PI, .5, -.5 / Math.PI, .5),
                    project: function(latlng) {
                        var projectedPoint = this.projection.project(latlng),
                            earthRadius = 6378137;
                        return projectedPoint.multiplyBy(earthRadius)
                    }
                }), L.CRS.EPSG900913 = L.extend({}, L.CRS.EPSG3857, {
                    code: "EPSG:900913"
                }), L.CRS.EPSG4326 = L.extend({}, L.CRS, {
                    code: "EPSG:4326",
                    projection: L.Projection.LonLat,
                    transformation: new L.Transformation(1 / 360, .5, -1 / 360, .5)
                }), L.Map = L.Class.extend({
                    includes: L.Mixin.Events,
                    options: {
                        crs: L.CRS.EPSG3857,
                        fadeAnimation: L.DomUtil.TRANSITION && !L.Browser.android23,
                        trackResize: !0,
                        markerZoomAnimation: L.DomUtil.TRANSITION && L.Browser.any3d
                    },
                    initialize: function(id, options) {
                        options = L.setOptions(this, options), this._initContainer(id), this._initLayout(), this._onResize = L.bind(this._onResize, this), this._initEvents(), options.maxBounds && this.setMaxBounds(options.maxBounds), options.center && options.zoom !== undefined && this.setView(L.latLng(options.center), options.zoom, {
                            reset: !0
                        }), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._tileLayersNum = 0, this.callInitHooks(), this._addLayers(options.layers)
                    },
                    setView: function(center, zoom) {
                        return zoom = zoom === undefined ? this.getZoom() : zoom, this._resetView(L.latLng(center), this._limitZoom(zoom)), this
                    },
                    setZoom: function(zoom, options) {
                        return this._loaded ? this.setView(this.getCenter(), zoom, {
                            zoom: options
                        }) : (this._zoom = this._limitZoom(zoom), this)
                    },
                    zoomIn: function(delta, options) {
                        return this.setZoom(this._zoom + (delta || 1), options)
                    },
                    zoomOut: function(delta, options) {
                        return this.setZoom(this._zoom - (delta || 1), options)
                    },
                    setZoomAround: function(latlng, zoom, options) {
                        var scale = this.getZoomScale(zoom),
                            viewHalf = this.getSize().divideBy(2),
                            containerPoint = latlng instanceof L.Point ? latlng : this.latLngToContainerPoint(latlng),
                            centerOffset = containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale),
                            newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));
                        return this.setView(newCenter, zoom, {
                            zoom: options
                        })
                    },
                    fitBounds: function(bounds, options) {
                        options = options || {}, bounds = bounds.getBounds ? bounds.getBounds() : L.latLngBounds(bounds);
                        var paddingTL = L.point(options.paddingTopLeft || options.padding || [0, 0]),
                            paddingBR = L.point(options.paddingBottomRight || options.padding || [0, 0]),
                            zoom = this.getBoundsZoom(bounds, !1, paddingTL.add(paddingBR));
                        zoom = options.maxZoom ? Math.min(options.maxZoom, zoom) : zoom;
                        var paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),
                            swPoint = this.project(bounds.getSouthWest(), zoom),
                            nePoint = this.project(bounds.getNorthEast(), zoom),
                            center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);
                        return this.setView(center, zoom, options)
                    },
                    fitWorld: function(options) {
                        return this.fitBounds([
                            [-90, -180],
                            [90, 180]
                        ], options)
                    },
                    panTo: function(center, options) {
                        return this.setView(center, this._zoom, {
                            pan: options
                        })
                    },
                    panBy: function(offset) {
                        return this.fire("movestart"), this._rawPanBy(L.point(offset)), this.fire("move"), this.fire("moveend")
                    },
                    setMaxBounds: function(bounds) {
                        return bounds = L.latLngBounds(bounds), this.options.maxBounds = bounds, bounds ? (this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds, this)) : this.off("moveend", this._panInsideMaxBounds, this)
                    },
                    panInsideBounds: function(bounds, options) {
                        var center = this.getCenter(),
                            newCenter = this._limitCenter(center, this._zoom, bounds);
                        return center.equals(newCenter) ? this : this.panTo(newCenter, options)
                    },
                    addLayer: function(layer) {
                        var id = L.stamp(layer);
                        return this._layers[id] ? this : (this._layers[id] = layer, !layer.options || isNaN(layer.options.maxZoom) && isNaN(layer.options.minZoom) || (this._zoomBoundLayers[id] = layer, this._updateZoomLevels()), this.options.zoomAnimation && L.TileLayer && layer instanceof L.TileLayer && (this._tileLayersNum++, this._tileLayersToLoad++, layer.on("load", this._onTileLayerLoad, this)), this._loaded && this._layerAdd(layer), this)
                    },
                    removeLayer: function(layer) {
                        var id = L.stamp(layer);
                        return this._layers[id] ? (this._loaded && layer.onRemove(this), delete this._layers[id], this._loaded && this.fire("layerremove", {
                            layer: layer
                        }), this._zoomBoundLayers[id] && (delete this._zoomBoundLayers[id], this._updateZoomLevels()), this.options.zoomAnimation && L.TileLayer && layer instanceof L.TileLayer && (this._tileLayersNum--, this._tileLayersToLoad--, layer.off("load", this._onTileLayerLoad, this)), this) : this
                    },
                    hasLayer: function(layer) {
                        return layer ? L.stamp(layer) in this._layers : !1
                    },
                    eachLayer: function(method, context) {
                        for (var i in this._layers) method.call(context, this._layers[i]);
                        return this
                    },
                    invalidateSize: function(options) {
                        if (!this._loaded) return this;
                        options = L.extend({
                            animate: !1,
                            pan: !0
                        }, options === !0 ? {
                            animate: !0
                        } : options);
                        var oldSize = this.getSize();
                        this._sizeChanged = !0, this._initialCenter = null;
                        var newSize = this.getSize(),
                            oldCenter = oldSize.divideBy(2).round(),
                            newCenter = newSize.divideBy(2).round(),
                            offset = oldCenter.subtract(newCenter);
                        return offset.x || offset.y ? (options.animate && options.pan ? this.panBy(offset) : (options.pan && this._rawPanBy(offset), this.fire("move"), options.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(L.bind(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", {
                            oldSize: oldSize,
                            newSize: newSize
                        })) : this
                    },
                    addHandler: function(name, HandlerClass) {
                        if (!HandlerClass) return this;
                        var handler = this[name] = new HandlerClass(this);
                        return this._handlers.push(handler), this.options[name] && handler.enable(), this
                    },
                    remove: function() {
                        this._loaded && this.fire("unload"), this._initEvents("off");
                        try {
                            delete this._container._leaflet
                        } catch (e) {
                            this._container._leaflet = undefined
                        }
                        return this._clearPanes(), this._clearControlPos && this._clearControlPos(), this._clearHandlers(), this
                    },
                    getCenter: function() {
                        return this._checkIfLoaded(), this._initialCenter && !this._moved() ? this._initialCenter : this.layerPointToLatLng(this._getCenterLayerPoint())
                    },
                    getZoom: function() {
                        return this._zoom
                    },
                    getBounds: function() {
                        var bounds = this.getPixelBounds(),
                            sw = this.unproject(bounds.getBottomLeft()),
                            ne = this.unproject(bounds.getTopRight());
                        return new L.LatLngBounds(sw, ne)
                    },
                    getMinZoom: function() {
                        return this.options.minZoom === undefined ? this._layersMinZoom === undefined ? 0 : this._layersMinZoom : this.options.minZoom
                    },
                    getMaxZoom: function() {
                        return this.options.maxZoom === undefined ? this._layersMaxZoom === undefined ? 1 / 0 : this._layersMaxZoom : this.options.maxZoom
                    },
                    getBoundsZoom: function(bounds, inside, padding) {
                        bounds = L.latLngBounds(bounds);
                        var boundsSize, zoom = this.getMinZoom() - (inside ? 1 : 0),
                            maxZoom = this.getMaxZoom(),
                            size = this.getSize(),
                            nw = bounds.getNorthWest(),
                            se = bounds.getSouthEast(),
                            zoomNotFound = !0;
                        padding = L.point(padding || [0, 0]);
                        do zoom++, boundsSize = this.project(se, zoom).subtract(this.project(nw, zoom)).add(padding), zoomNotFound = inside ? boundsSize.x < size.x || boundsSize.y < size.y : size.contains(boundsSize); while (zoomNotFound && maxZoom >= zoom);
                        return zoomNotFound && inside ? null : inside ? zoom : zoom - 1
                    },
                    getSize: function() {
                        return (!this._size || this._sizeChanged) && (this._size = new L.Point(this._container.clientWidth, this._container.clientHeight), this._sizeChanged = !1), this._size.clone()
                    },
                    getPixelBounds: function() {
                        var topLeftPoint = this._getTopLeftPoint();
                        return new L.Bounds(topLeftPoint, topLeftPoint.add(this.getSize()))
                    },
                    getPixelOrigin: function() {
                        return this._checkIfLoaded(), this._initialTopLeftPoint
                    },
                    getPanes: function() {
                        return this._panes
                    },
                    getContainer: function() {
                        return this._container
                    },
                    getZoomScale: function(toZoom) {
                        var crs = this.options.crs;
                        return crs.scale(toZoom) / crs.scale(this._zoom)
                    },
                    getScaleZoom: function(scale) {
                        return this._zoom + Math.log(scale) / Math.LN2
                    },
                    project: function(latlng, zoom) {
                        return zoom = zoom === undefined ? this._zoom : zoom, this.options.crs.latLngToPoint(L.latLng(latlng), zoom)
                    },
                    unproject: function(point, zoom) {
                        return zoom = zoom === undefined ? this._zoom : zoom, this.options.crs.pointToLatLng(L.point(point), zoom)
                    },
                    layerPointToLatLng: function(point) {
                        var projectedPoint = L.point(point).add(this.getPixelOrigin());
                        return this.unproject(projectedPoint)
                    },
                    latLngToLayerPoint: function(latlng) {
                        var projectedPoint = this.project(L.latLng(latlng))._round();
                        return projectedPoint._subtract(this.getPixelOrigin())
                    },
                    containerPointToLayerPoint: function(point) {
                        return L.point(point).subtract(this._getMapPanePos())
                    },
                    layerPointToContainerPoint: function(point) {
                        return L.point(point).add(this._getMapPanePos())
                    },
                    containerPointToLatLng: function(point) {
                        var layerPoint = this.containerPointToLayerPoint(L.point(point));
                        return this.layerPointToLatLng(layerPoint)
                    },
                    latLngToContainerPoint: function(latlng) {
                        return this.layerPointToContainerPoint(this.latLngToLayerPoint(L.latLng(latlng)))
                    },
                    mouseEventToContainerPoint: function(e) {
                        return L.DomEvent.getMousePosition(e, this._container)
                    },
                    mouseEventToLayerPoint: function(e) {
                        return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e))
                    },
                    mouseEventToLatLng: function(e) {
                        return this.layerPointToLatLng(this.mouseEventToLayerPoint(e))
                    },
                    _initContainer: function(id) {
                        var container = this._container = L.DomUtil.get(id);
                        if (!container) throw new Error("Map container not found.");

                        if (container._leaflet) throw new Error("Map container is already initialized.");
                        container._leaflet = !0
                    },
                    _initLayout: function() {
                        var container = this._container;
                        L.DomUtil.addClass(container, "leaflet-container" + (L.Browser.touch ? " leaflet-touch" : "") + (L.Browser.retina ? " leaflet-retina" : "") + (L.Browser.ielt9 ? " leaflet-oldie" : "") + (this.options.fadeAnimation ? " leaflet-fade-anim" : ""));
                        var position = L.DomUtil.getStyle(container, "position");
                        "absolute" !== position && "relative" !== position && "fixed" !== position && (container.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos()
                    },
                    _initPanes: function() {
                        var panes = this._panes = {};
                        this._mapPane = panes.mapPane = this._createPane("leaflet-map-pane", this._container), this._tilePane = panes.tilePane = this._createPane("leaflet-tile-pane", this._mapPane), panes.objectsPane = this._createPane("leaflet-objects-pane", this._mapPane), panes.shadowPane = this._createPane("leaflet-shadow-pane"), panes.overlayPane = this._createPane("leaflet-overlay-pane"), panes.markerPane = this._createPane("leaflet-marker-pane"), panes.popupPane = this._createPane("leaflet-popup-pane");
                        var zoomHide = " leaflet-zoom-hide";
                        this.options.markerZoomAnimation || (L.DomUtil.addClass(panes.markerPane, zoomHide), L.DomUtil.addClass(panes.shadowPane, zoomHide), L.DomUtil.addClass(panes.popupPane, zoomHide))
                    },
                    _createPane: function(className, container) {
                        return L.DomUtil.create("div", className, container || this._panes.objectsPane)
                    },
                    _clearPanes: function() {
                        this._container.removeChild(this._mapPane)
                    },
                    _addLayers: function(layers) {
                        layers = layers ? L.Util.isArray(layers) ? layers : [layers] : [];
                        for (var i = 0, len = layers.length; len > i; i++) this.addLayer(layers[i])
                    },
                    _resetView: function(center, zoom, preserveMapOffset, afterZoomAnim) {
                        var zoomChanged = this._zoom !== zoom;
                        afterZoomAnim || (this.fire("movestart"), zoomChanged && this.fire("zoomstart")), this._zoom = zoom, this._initialCenter = center, this._initialTopLeftPoint = this._getNewTopLeftPoint(center), preserveMapOffset ? this._initialTopLeftPoint._add(this._getMapPanePos()) : L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0)), this._tileLayersToLoad = this._tileLayersNum;
                        var loading = !this._loaded;
                        this._loaded = !0, this.fire("viewreset", {
                            hard: !preserveMapOffset
                        }), loading && (this.fire("load"), this.eachLayer(this._layerAdd, this)), this.fire("move"), (zoomChanged || afterZoomAnim) && this.fire("zoomend"), this.fire("moveend", {
                            hard: !preserveMapOffset
                        })
                    },
                    _rawPanBy: function(offset) {
                        L.DomUtil.setPosition(this._mapPane, this._getMapPanePos().subtract(offset))
                    },
                    _getZoomSpan: function() {
                        return this.getMaxZoom() - this.getMinZoom()
                    },
                    _updateZoomLevels: function() {
                        var i, minZoom = 1 / 0,
                            maxZoom = -(1 / 0),
                            oldZoomSpan = this._getZoomSpan();
                        for (i in this._zoomBoundLayers) {
                            var layer = this._zoomBoundLayers[i];
                            isNaN(layer.options.minZoom) || (minZoom = Math.min(minZoom, layer.options.minZoom)), isNaN(layer.options.maxZoom) || (maxZoom = Math.max(maxZoom, layer.options.maxZoom))
                        }
                        i === undefined ? this._layersMaxZoom = this._layersMinZoom = undefined : (this._layersMaxZoom = maxZoom, this._layersMinZoom = minZoom), oldZoomSpan !== this._getZoomSpan() && this.fire("zoomlevelschange")
                    },
                    _panInsideMaxBounds: function() {
                        this.panInsideBounds(this.options.maxBounds)
                    },
                    _checkIfLoaded: function() {
                        if (!this._loaded) throw new Error("Set map center and zoom first.")
                    },
                    _initEvents: function(onOff) {
                        if (L.DomEvent) {
                            onOff = onOff || "on", L.DomEvent[onOff](this._container, "click", this._onMouseClick, this);
                            var i, len, events = ["dblclick", "mousedown", "mouseup", "mouseenter", "mouseleave", "mousemove", "contextmenu"];
                            for (i = 0, len = events.length; len > i; i++) L.DomEvent[onOff](this._container, events[i], this._fireMouseEvent, this);
                            this.options.trackResize && L.DomEvent[onOff](window, "resize", this._onResize, this)
                        }
                    },
                    _onResize: function() {
                        L.Util.cancelAnimFrame(this._resizeRequest), this._resizeRequest = L.Util.requestAnimFrame(function() {
                            this.invalidateSize({
                                debounceMoveend: !0
                            })
                        }, this, !1, this._container)
                    },
                    _onMouseClick: function(e) {
                        !this._loaded || !e._simulated && (this.dragging && this.dragging.moved() || this.boxZoom && this.boxZoom.moved()) || L.DomEvent._skipped(e) || (this.fire("preclick"), this._fireMouseEvent(e))
                    },
                    _fireMouseEvent: function(e) {
                        if (this._loaded && !L.DomEvent._skipped(e)) {
                            var type = e.type;
                            if (type = "mouseenter" === type ? "mouseover" : "mouseleave" === type ? "mouseout" : type, this.hasEventListeners(type)) {
                                "contextmenu" === type && L.DomEvent.preventDefault(e);
                                var containerPoint = this.mouseEventToContainerPoint(e),
                                    layerPoint = this.containerPointToLayerPoint(containerPoint),
                                    latlng = this.layerPointToLatLng(layerPoint);
                                this.fire(type, {
                                    latlng: latlng,
                                    layerPoint: layerPoint,
                                    containerPoint: containerPoint,
                                    originalEvent: e
                                })
                            }
                        }
                    },
                    _onTileLayerLoad: function() {
                        this._tileLayersToLoad--, this._tileLayersNum && !this._tileLayersToLoad && this.fire("tilelayersload")
                    },
                    _clearHandlers: function() {
                        for (var i = 0, len = this._handlers.length; len > i; i++) this._handlers[i].disable()
                    },
                    whenReady: function(callback, context) {
                        return this._loaded ? callback.call(context || this, this) : this.on("load", callback, context), this
                    },
                    _layerAdd: function(layer) {
                        layer.onAdd(this), this.fire("layeradd", {
                            layer: layer
                        })
                    },
                    _getMapPanePos: function() {
                        return L.DomUtil.getPosition(this._mapPane)
                    },
                    _moved: function() {
                        var pos = this._getMapPanePos();
                        return pos && !pos.equals([0, 0])
                    },
                    _getTopLeftPoint: function() {
                        return this.getPixelOrigin().subtract(this._getMapPanePos())
                    },
                    _getNewTopLeftPoint: function(center, zoom) {
                        var viewHalf = this.getSize()._divideBy(2);
                        return this.project(center, zoom)._subtract(viewHalf)._round()
                    },
                    _latLngToNewLayerPoint: function(latlng, newZoom, newCenter) {
                        var topLeft = this._getNewTopLeftPoint(newCenter, newZoom).add(this._getMapPanePos());
                        return this.project(latlng, newZoom)._subtract(topLeft)
                    },
                    _getCenterLayerPoint: function() {
                        return this.containerPointToLayerPoint(this.getSize()._divideBy(2))
                    },
                    _getCenterOffset: function(latlng) {
                        return this.latLngToLayerPoint(latlng).subtract(this._getCenterLayerPoint())
                    },
                    _limitCenter: function(center, zoom, bounds) {
                        if (!bounds) return center;
                        var centerPoint = this.project(center, zoom),
                            viewHalf = this.getSize().divideBy(2),
                            viewBounds = new L.Bounds(centerPoint.subtract(viewHalf), centerPoint.add(viewHalf)),
                            offset = this._getBoundsOffset(viewBounds, bounds, zoom);
                        return this.unproject(centerPoint.add(offset), zoom)
                    },
                    _limitOffset: function(offset, bounds) {
                        if (!bounds) return offset;
                        var viewBounds = this.getPixelBounds(),
                            newBounds = new L.Bounds(viewBounds.min.add(offset), viewBounds.max.add(offset));
                        return offset.add(this._getBoundsOffset(newBounds, bounds))
                    },
                    _getBoundsOffset: function(pxBounds, maxBounds, zoom) {
                        var nwOffset = this.project(maxBounds.getNorthWest(), zoom).subtract(pxBounds.min),
                            seOffset = this.project(maxBounds.getSouthEast(), zoom).subtract(pxBounds.max),
                            dx = this._rebound(nwOffset.x, -seOffset.x),
                            dy = this._rebound(nwOffset.y, -seOffset.y);
                        return new L.Point(dx, dy)
                    },
                    _rebound: function(left, right) {
                        return left + right > 0 ? Math.round(left - right) / 2 : Math.max(0, Math.ceil(left)) - Math.max(0, Math.floor(right))
                    },
                    _limitZoom: function(zoom) {
                        var min = this.getMinZoom(),
                            max = this.getMaxZoom();
                        return Math.max(min, Math.min(max, zoom))
                    }
                }), L.map = function(id, options) {
                    return new L.Map(id, options)
                }, L.Projection.Mercator = {
                    MAX_LATITUDE: 85.0840591556,
                    R_MINOR: 6356752.314245179,
                    R_MAJOR: 6378137,
                    project: function(latlng) {
                        var d = L.LatLng.DEG_TO_RAD,
                            max = this.MAX_LATITUDE,
                            lat = Math.max(Math.min(max, latlng.lat), -max),
                            r = this.R_MAJOR,
                            r2 = this.R_MINOR,
                            x = latlng.lng * d * r,
                            y = lat * d,
                            tmp = r2 / r,
                            eccent = Math.sqrt(1 - tmp * tmp),
                            con = eccent * Math.sin(y);
                        con = Math.pow((1 - con) / (1 + con), .5 * eccent);
                        var ts = Math.tan(.5 * (.5 * Math.PI - y)) / con;
                        return y = -r * Math.log(ts), new L.Point(x, y)
                    },
                    unproject: function(point) {
                        for (var con, d = L.LatLng.RAD_TO_DEG, r = this.R_MAJOR, r2 = this.R_MINOR, lng = point.x * d / r, tmp = r2 / r, eccent = Math.sqrt(1 - tmp * tmp), ts = Math.exp(-point.y / r), phi = Math.PI / 2 - 2 * Math.atan(ts), numIter = 15, tol = 1e-7, i = numIter, dphi = .1; Math.abs(dphi) > tol && --i > 0;) con = eccent * Math.sin(phi), dphi = Math.PI / 2 - 2 * Math.atan(ts * Math.pow((1 - con) / (1 + con), .5 * eccent)) - phi, phi += dphi;
                        return new L.LatLng(phi * d, lng)
                    }
                }, L.CRS.EPSG3395 = L.extend({}, L.CRS, {
                    code: "EPSG:3395",
                    projection: L.Projection.Mercator,
                    transformation: function() {
                        var m = L.Projection.Mercator,
                            r = m.R_MAJOR,
                            scale = .5 / (Math.PI * r);
                        return new L.Transformation(scale, .5, -scale, .5)
                    }()
                }), L.TileLayer = L.Class.extend({
                    includes: L.Mixin.Events,
                    options: {
                        minZoom: 0,
                        maxZoom: 18,
                        tileSize: 256,
                        subdomains: "abc",
                        errorTileUrl: "",
                        attribution: "",
                        zoomOffset: 0,
                        opacity: 1,
                        unloadInvisibleTiles: L.Browser.mobile,
                        updateWhenIdle: L.Browser.mobile
                    },
                    initialize: function(url, options) {
                        options = L.setOptions(this, options), options.detectRetina && L.Browser.retina && options.maxZoom > 0 && (options.tileSize = Math.floor(options.tileSize / 2), options.zoomOffset++, options.minZoom > 0 && options.minZoom--, this.options.maxZoom--), options.bounds && (options.bounds = L.latLngBounds(options.bounds)), this._url = url;
                        var subdomains = this.options.subdomains;
                        "string" == typeof subdomains && (this.options.subdomains = subdomains.split(""))
                    },
                    onAdd: function(map) {
                        this._map = map, this._animated = map._zoomAnimated, this._initContainer(), map.on({
                            viewreset: this._reset,
                            moveend: this._update
                        }, this), this._animated && map.on({
                            zoomanim: this._animateZoom,
                            zoomend: this._endZoomAnim
                        }, this), this.options.updateWhenIdle || (this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this), map.on("move", this._limitedUpdate, this)), this._reset(), this._update()
                    },
                    addTo: function(map) {
                        return map.addLayer(this), this
                    },
                    onRemove: function(map) {
                        this._container.parentNode.removeChild(this._container), map.off({
                            viewreset: this._reset,
                            moveend: this._update
                        }, this), this._animated && map.off({
                            zoomanim: this._animateZoom,
                            zoomend: this._endZoomAnim
                        }, this), this.options.updateWhenIdle || map.off("move", this._limitedUpdate, this), this._container = null, this._map = null
                    },
                    bringToFront: function() {
                        var pane = this._map._panes.tilePane;
                        return this._container && (pane.appendChild(this._container), this._setAutoZIndex(pane, Math.max)), this
                    },
                    bringToBack: function() {
                        var pane = this._map._panes.tilePane;
                        return this._container && (pane.insertBefore(this._container, pane.firstChild), this._setAutoZIndex(pane, Math.min)), this
                    },
                    getAttribution: function() {
                        return this.options.attribution
                    },
                    getContainer: function() {
                        return this._container
                    },
                    setOpacity: function(opacity) {
                        return this.options.opacity = opacity, this._map && this._updateOpacity(), this
                    },
                    setZIndex: function(zIndex) {
                        return this.options.zIndex = zIndex, this._updateZIndex(), this
                    },
                    setUrl: function(url, noRedraw) {
                        return this._url = url, noRedraw || this.redraw(), this
                    },
                    redraw: function() {
                        return this._map && (this._reset({
                            hard: !0
                        }), this._update()), this
                    },
                    _updateZIndex: function() {
                        this._container && this.options.zIndex !== undefined && (this._container.style.zIndex = this.options.zIndex)
                    },
                    _setAutoZIndex: function(pane, compare) {
                        var zIndex, i, len, layers = pane.children,
                            edgeZIndex = -compare(1 / 0, -(1 / 0));
                        for (i = 0, len = layers.length; len > i; i++) layers[i] !== this._container && (zIndex = parseInt(layers[i].style.zIndex, 10), isNaN(zIndex) || (edgeZIndex = compare(edgeZIndex, zIndex)));
                        this.options.zIndex = this._container.style.zIndex = (isFinite(edgeZIndex) ? edgeZIndex : 0) + compare(1, -1)
                    },
                    _updateOpacity: function() {
                        var i, tiles = this._tiles;
                        if (L.Browser.ielt9)
                            for (i in tiles) L.DomUtil.setOpacity(tiles[i], this.options.opacity);
                        else L.DomUtil.setOpacity(this._container, this.options.opacity)
                    },
                    _initContainer: function() {
                        var tilePane = this._map._panes.tilePane;
                        if (!this._container) {
                            if (this._container = L.DomUtil.create("div", "leaflet-layer"), this._updateZIndex(), this._animated) {
                                var className = "leaflet-tile-container";
                                this._bgBuffer = L.DomUtil.create("div", className, this._container), this._tileContainer = L.DomUtil.create("div", className, this._container)
                            } else this._tileContainer = this._container;
                            tilePane.appendChild(this._container), this.options.opacity < 1 && this._updateOpacity()
                        }
                    },
                    _reset: function(e) {
                        for (var key in this._tiles) this.fire("tileunload", {
                            tile: this._tiles[key]
                        });
                        this._tiles = {}, this._tilesToLoad = 0, this.options.reuseTiles && (this._unusedTiles = []), this._tileContainer.innerHTML = "", this._animated && e && e.hard && this._clearBgBuffer(), this._initContainer()
                    },
                    _getTileSize: function() {
                        var map = this._map,
                            zoom = map.getZoom() + this.options.zoomOffset,
                            zoomN = this.options.maxNativeZoom,
                            tileSize = this.options.tileSize;
                        return zoomN && zoom > zoomN && (tileSize = Math.round(map.getZoomScale(zoom) / map.getZoomScale(zoomN) * tileSize)), tileSize
                    },
                    _update: function() {
                        if (this._map) {
                            var map = this._map,
                                bounds = map.getPixelBounds(),
                                zoom = map.getZoom(),
                                tileSize = this._getTileSize();
                            if (!(zoom > this.options.maxZoom || zoom < this.options.minZoom)) {
                                var tileBounds = L.bounds(bounds.min.divideBy(tileSize)._floor(), bounds.max.divideBy(tileSize)._floor());
                                this._addTilesFromCenterOut(tileBounds), (this.options.unloadInvisibleTiles || this.options.reuseTiles) && this._removeOtherTiles(tileBounds)
                            }
                        }
                    },
                    _addTilesFromCenterOut: function(bounds) {
                        var j, i, point, queue = [],
                            center = bounds.getCenter();
                        for (j = bounds.min.y; j <= bounds.max.y; j++)
                            for (i = bounds.min.x; i <= bounds.max.x; i++) point = new L.Point(i, j), this._tileShouldBeLoaded(point) && queue.push(point);
                        var tilesToLoad = queue.length;
                        if (0 !== tilesToLoad) {
                            queue.sort(function(a, b) {
                                return a.distanceTo(center) - b.distanceTo(center)
                            });
                            var fragment = document.createDocumentFragment();
                            for (this._tilesToLoad || this.fire("loading"), this._tilesToLoad += tilesToLoad, i = 0; tilesToLoad > i; i++) this._addTile(queue[i], fragment);
                            this._tileContainer.appendChild(fragment)
                        }
                    },
                    _tileShouldBeLoaded: function(tilePoint) {
                        if (tilePoint.x + ":" + tilePoint.y in this._tiles) return !1;
                        var options = this.options;
                        if (!options.continuousWorld) {
                            var limit = this._getWrapTileNum();
                            if (options.noWrap && (tilePoint.x < 0 || tilePoint.x >= limit.x) || tilePoint.y < 0 || tilePoint.y >= limit.y) return !1
                        }
                        if (options.bounds) {
                            var tileSize = this._getTileSize(),
                                nwPoint = tilePoint.multiplyBy(tileSize),
                                sePoint = nwPoint.add([tileSize, tileSize]),
                                nw = this._map.unproject(nwPoint),
                                se = this._map.unproject(sePoint);
                            if (options.continuousWorld || options.noWrap || (nw = nw.wrap(), se = se.wrap()), !options.bounds.intersects([nw, se])) return !1
                        }
                        return !0
                    },
                    _removeOtherTiles: function(bounds) {
                        var kArr, x, y, key;
                        for (key in this._tiles) kArr = key.split(":"), x = parseInt(kArr[0], 10), y = parseInt(kArr[1], 10), (x < bounds.min.x || x > bounds.max.x || y < bounds.min.y || y > bounds.max.y) && this._removeTile(key)
                    },
                    _removeTile: function(key) {
                        var tile = this._tiles[key];
                        this.fire("tileunload", {
                            tile: tile,
                            url: tile.src
                        }), this.options.reuseTiles ? (L.DomUtil.removeClass(tile, "leaflet-tile-loaded"), this._unusedTiles.push(tile)) : tile.parentNode === this._tileContainer && this._tileContainer.removeChild(tile), L.Browser.android || (tile.onload = null, tile.src = L.Util.emptyImageUrl), delete this._tiles[key]
                    },
                    _addTile: function(tilePoint, container) {
                        var tilePos = this._getTilePos(tilePoint),
                            tile = this._getTile();
                        L.DomUtil.setPosition(tile, tilePos, L.Browser.chrome), this._tiles[tilePoint.x + ":" + tilePoint.y] = tile, this._loadTile(tile, tilePoint), tile.parentNode !== this._tileContainer && container.appendChild(tile)
                    },
                    _getZoomForUrl: function() {
                        var options = this.options,
                            zoom = this._map.getZoom();
                        return options.zoomReverse && (zoom = options.maxZoom - zoom), zoom += options.zoomOffset, options.maxNativeZoom ? Math.min(zoom, options.maxNativeZoom) : zoom
                    },
                    _getTilePos: function(tilePoint) {
                        var origin = this._map.getPixelOrigin(),
                            tileSize = this._getTileSize();
                        return tilePoint.multiplyBy(tileSize).subtract(origin)
                    },
                    getTileUrl: function(tilePoint) {
                        return L.Util.template(this._url, L.extend({
                            s: this._getSubdomain(tilePoint),
                            z: tilePoint.z,
                            x: tilePoint.x,
                            y: tilePoint.y
                        }, this.options))
                    },
                    _getWrapTileNum: function() {
                        var crs = this._map.options.crs,
                            size = crs.getSize(this._map.getZoom());
                        return size.divideBy(this._getTileSize())._floor()
                    },
                    _adjustTilePoint: function(tilePoint) {
                        var limit = this._getWrapTileNum();
                        this.options.continuousWorld || this.options.noWrap || (tilePoint.x = (tilePoint.x % limit.x + limit.x) % limit.x), this.options.tms && (tilePoint.y = limit.y - tilePoint.y - 1), tilePoint.z = this._getZoomForUrl()
                    },
                    _getSubdomain: function(tilePoint) {
                        var index = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
                        return this.options.subdomains[index]
                    },
                    _getTile: function() {
                        if (this.options.reuseTiles && this._unusedTiles.length > 0) {
                            var tile = this._unusedTiles.pop();
                            return this._resetTile(tile), tile
                        }
                        return this._createTile()
                    },
                    _resetTile: function() {},
                    _createTile: function() {
                        var tile = L.DomUtil.create("img", "leaflet-tile");
                        return tile.style.width = tile.style.height = this._getTileSize() + "px", tile.galleryimg = "no", tile.onselectstart = tile.onmousemove = L.Util.falseFn, L.Browser.ielt9 && this.options.opacity !== undefined && L.DomUtil.setOpacity(tile, this.options.opacity), L.Browser.mobileWebkit3d && (tile.style.WebkitBackfaceVisibility = "hidden"), tile
                    },
                    _loadTile: function(tile, tilePoint) {
                        tile._layer = this, tile.onload = this._tileOnLoad, tile.onerror = this._tileOnError, this._adjustTilePoint(tilePoint), tile.src = this.getTileUrl(tilePoint), this.fire("tileloadstart", {
                            tile: tile,
                            url: tile.src
                        })
                    },
                    _tileLoaded: function() {
                        this._tilesToLoad--, this._animated && L.DomUtil.addClass(this._tileContainer, "leaflet-zoom-animated"), this._tilesToLoad || (this.fire("load"), this._animated && (clearTimeout(this._clearBgBufferTimer), this._clearBgBufferTimer = setTimeout(L.bind(this._clearBgBuffer, this), 500)))
                    },
                    _tileOnLoad: function() {
                        var layer = this._layer;
                        this.src !== L.Util.emptyImageUrl && (L.DomUtil.addClass(this, "leaflet-tile-loaded"), layer.fire("tileload", {
                            tile: this,
                            url: this.src
                        })), layer._tileLoaded()
                    },
                    _tileOnError: function() {
                        var layer = this._layer;
                        layer.fire("tileerror", {
                            tile: this,
                            url: this.src
                        });
                        var newUrl = layer.options.errorTileUrl;
                        newUrl && (this.src = newUrl), layer._tileLoaded()
                    }
                }), L.tileLayer = function(url, options) {
                    return new L.TileLayer(url, options)
                }, L.TileLayer.WMS = L.TileLayer.extend({
                    defaultWmsParams: {
                        service: "WMS",
                        request: "GetMap",
                        version: "1.1.1",
                        layers: "",
                        styles: "",
                        format: "image/jpeg",
                        transparent: !1
                    },
                    initialize: function(url, options) {
                        this._url = url;
                        var wmsParams = L.extend({}, this.defaultWmsParams),
                            tileSize = options.tileSize || this.options.tileSize;
                        wmsParams.width = wmsParams.height = options.detectRetina && L.Browser.retina ? 2 * tileSize : tileSize;
                        for (var i in options) this.options.hasOwnProperty(i) || "crs" === i || (wmsParams[i] = options[i]);
                        this.wmsParams = wmsParams, L.setOptions(this, options)
                    },
                    onAdd: function(map) {
                        this._crs = this.options.crs || map.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
                        var projectionKey = this._wmsVersion >= 1.3 ? "crs" : "srs";
                        this.wmsParams[projectionKey] = this._crs.code, L.TileLayer.prototype.onAdd.call(this, map)
                    },
                    getTileUrl: function(tilePoint) {
                        var map = this._map,
                            tileSize = this.options.tileSize,
                            nwPoint = tilePoint.multiplyBy(tileSize),
                            sePoint = nwPoint.add([tileSize, tileSize]),
                            nw = this._crs.project(map.unproject(nwPoint, tilePoint.z)),
                            se = this._crs.project(map.unproject(sePoint, tilePoint.z)),
                            bbox = this._wmsVersion >= 1.3 && this._crs === L.CRS.EPSG4326 ? [se.y, nw.x, nw.y, se.x].join(",") : [nw.x, se.y, se.x, nw.y].join(","),
                            url = L.Util.template(this._url, {
                                s: this._getSubdomain(tilePoint)
                            });
                        return url + L.Util.getParamString(this.wmsParams, url, !0) + "&BBOX=" + bbox
                    },
                    setParams: function(params, noRedraw) {
                        return L.extend(this.wmsParams, params), noRedraw || this.redraw(), this
                    }
                }), L.tileLayer.wms = function(url, options) {
                    return new L.TileLayer.WMS(url, options)
                }, L.TileLayer.Canvas = L.TileLayer.extend({
                    options: {
                        async: !1
                    },
                    initialize: function(options) {
                        L.setOptions(this, options)
                    },
                    redraw: function() {
                        this._map && (this._reset({
                            hard: !0
                        }), this._update());
                        for (var i in this._tiles) this._redrawTile(this._tiles[i]);
                        return this
                    },
                    _redrawTile: function(tile) {
                        this.drawTile(tile, tile._tilePoint, this._map._zoom)
                    },
                    _createTile: function() {
                        var tile = L.DomUtil.create("canvas", "leaflet-tile");
                        return tile.width = tile.height = this.options.tileSize, tile.onselectstart = tile.onmousemove = L.Util.falseFn, tile
                    },
                    _loadTile: function(tile, tilePoint) {
                        tile._layer = this, tile._tilePoint = tilePoint, this._redrawTile(tile), this.options.async || this.tileDrawn(tile)
                    },
                    drawTile: function() {},
                    tileDrawn: function(tile) {
                        this._tileOnLoad.call(tile)
                    }
                }), L.tileLayer.canvas = function(options) {
                    return new L.TileLayer.Canvas(options)
                }, L.ImageOverlay = L.Class.extend({
                    includes: L.Mixin.Events,
                    options: {
                        opacity: 1
                    },
                    initialize: function(url, bounds, options) {
                        this._url = url, this._bounds = L.latLngBounds(bounds), L.setOptions(this, options)
                    },
                    onAdd: function(map) {
                        this._map = map, this._image || this._initImage(), map._panes.overlayPane.appendChild(this._image), map.on("viewreset", this._reset, this), map.options.zoomAnimation && L.Browser.any3d && map.on("zoomanim", this._animateZoom, this), this._reset()
                    },
                    onRemove: function(map) {
                        map.getPanes().overlayPane.removeChild(this._image), map.off("viewreset", this._reset, this), map.options.zoomAnimation && map.off("zoomanim", this._animateZoom, this)
                    },
                    addTo: function(map) {
                        return map.addLayer(this), this
                    },
                    setOpacity: function(opacity) {
                        return this.options.opacity = opacity, this._updateOpacity(), this
                    },
                    bringToFront: function() {
                        return this._image && this._map._panes.overlayPane.appendChild(this._image), this
                    },
                    bringToBack: function() {
                        var pane = this._map._panes.overlayPane;
                        return this._image && pane.insertBefore(this._image, pane.firstChild), this
                    },
                    setUrl: function(url) {
                        this._url = url, this._image.src = this._url
                    },
                    getAttribution: function() {
                        return this.options.attribution
                    },
                    _initImage: function() {
                        this._image = L.DomUtil.create("img", "leaflet-image-layer"), this._map.options.zoomAnimation && L.Browser.any3d ? L.DomUtil.addClass(this._image, "leaflet-zoom-animated") : L.DomUtil.addClass(this._image, "leaflet-zoom-hide"), this._updateOpacity(), L.extend(this._image, {
                            galleryimg: "no",
                            onselectstart: L.Util.falseFn,
                            onmousemove: L.Util.falseFn,
                            onload: L.bind(this._onImageLoad, this),
                            src: this._url
                        })
                    },
                    _animateZoom: function(e) {
                        var map = this._map,
                            image = this._image,
                            scale = map.getZoomScale(e.zoom),
                            nw = this._bounds.getNorthWest(),
                            se = this._bounds.getSouthEast(),
                            topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center),
                            size = map._latLngToNewLayerPoint(se, e.zoom, e.center)._subtract(topLeft),
                            origin = topLeft._add(size._multiplyBy(.5 * (1 - 1 / scale)));
                        image.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(origin) + " scale(" + scale + ") "
                    },
                    _reset: function() {
                        var image = this._image,
                            topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
                            size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);
                        L.DomUtil.setPosition(image, topLeft), image.style.width = size.x + "px", image.style.height = size.y + "px"
                    },
                    _onImageLoad: function() {
                        this.fire("load")
                    },
                    _updateOpacity: function() {
                        L.DomUtil.setOpacity(this._image, this.options.opacity)
                    }
                }), L.imageOverlay = function(url, bounds, options) {
                    return new L.ImageOverlay(url, bounds, options)
                }, L.Icon = L.Class.extend({
                    options: {
                        className: ""
                    },
                    initialize: function(options) {
                        L.setOptions(this, options)
                    },
                    createIcon: function(oldIcon) {
                        return this._createIcon("icon", oldIcon)
                    },
                    createShadow: function(oldIcon) {
                        return this._createIcon("shadow", oldIcon)
                    },
                    _createIcon: function(name, oldIcon) {
                        var src = this._getIconUrl(name);
                        if (!src) {
                            if ("icon" === name) throw new Error("iconUrl not set in Icon options (see the docs).");
                            return null
                        }
                        var img;
                        return img = oldIcon && "IMG" === oldIcon.tagName ? this._createImg(src, oldIcon) : this._createImg(src), this._setIconStyles(img, name), img
                    },
                    _setIconStyles: function(img, name) {
                        var anchor, options = this.options,
                            size = L.point(options[name + "Size"]);
                        anchor = L.point("shadow" === name ? options.shadowAnchor || options.iconAnchor : options.iconAnchor), !anchor && size && (anchor = size.divideBy(2, !0)), img.className = "leaflet-marker-" + name + " " + options.className, anchor && (img.style.marginLeft = -anchor.x + "px", img.style.marginTop = -anchor.y + "px"), size && (img.style.width = size.x + "px", img.style.height = size.y + "px")
                    },
                    _createImg: function(src, el) {
                        return el = el || document.createElement("img"), el.src = src, el
                    },
                    _getIconUrl: function(name) {
                        return L.Browser.retina && this.options[name + "RetinaUrl"] ? this.options[name + "RetinaUrl"] : this.options[name + "Url"]
                    }
                }), L.icon = function(options) {
                    return new L.Icon(options)
                }, L.Icon.Default = L.Icon.extend({
                    options: {
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    },
                    _getIconUrl: function(name) {
                        var key = name + "Url";
                        if (this.options[key]) return this.options[key];
                        L.Browser.retina && "icon" === name && (name += "-2x");
                        var path = L.Icon.Default.imagePath;
                        if (!path) throw new Error("Couldn't autodetect L.Icon.Default.imagePath, set it manually.");
                        return path + "/marker-" + name + ".png"
                    }
                }), L.Icon.Default.imagePath = function() {
                    var i, len, src, matches, path, scripts = document.getElementsByTagName("script"),
                        leafletRe = /[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/;
                    for (i = 0, len = scripts.length; len > i; i++)
                        if (src = scripts[i].src, matches = src.match(leafletRe)) return path = src.split(leafletRe)[0], (path ? path + "/" : "") + "images"
                }(), L.Marker = L.Class.extend({
                    includes: L.Mixin.Events,
                    options: {
                        icon: new L.Icon.Default,
                        title: "",
                        alt: "",
                        clickable: !0,
                        draggable: !1,
                        keyboard: !0,
                        zIndexOffset: 0,
                        opacity: 1,
                        riseOnHover: !1,
                        riseOffset: 250
                    },
                    initialize: function(latlng, options) {
                        L.setOptions(this, options), this._latlng = L.latLng(latlng)
                    },
                    onAdd: function(map) {
                        this._map = map, map.on("viewreset", this.update, this), this._initIcon(), this.update(), this.fire("add"), map.options.zoomAnimation && map.options.markerZoomAnimation && map.on("zoomanim", this._animateZoom, this)
                    },
                    addTo: function(map) {
                        return map.addLayer(this), this
                    },
                    onRemove: function(map) {
                        this.dragging && this.dragging.disable(), this._removeIcon(), this._removeShadow(), this.fire("remove"), map.off({
                            viewreset: this.update,
                            zoomanim: this._animateZoom
                        }, this), this._map = null
                    },
                    getLatLng: function() {
                        return this._latlng
                    },
                    setLatLng: function(latlng) {
                        return this._latlng = L.latLng(latlng), this.update(), this.fire("move", {
                            latlng: this._latlng
                        })
                    },
                    setZIndexOffset: function(offset) {
                        return this.options.zIndexOffset = offset, this.update(), this
                    },
                    setIcon: function(icon) {
                        return this.options.icon = icon, this._map && (this._initIcon(), this.update()), this._popup && this.bindPopup(this._popup), this
                    },
                    update: function() {
                        return this._icon && this._setPos(this._map.latLngToLayerPoint(this._latlng).round()), this
                    },
                    _initIcon: function() {
                        var options = this.options,
                            map = this._map,
                            animation = map.options.zoomAnimation && map.options.markerZoomAnimation,
                            classToAdd = animation ? "leaflet-zoom-animated" : "leaflet-zoom-hide",
                            icon = options.icon.createIcon(this._icon),
                            addIcon = !1;
                        icon !== this._icon && (this._icon && this._removeIcon(), addIcon = !0, options.title && (icon.title = options.title), options.alt && (icon.alt = options.alt)), L.DomUtil.addClass(icon, classToAdd), options.keyboard && (icon.tabIndex = "0"), this._icon = icon, this._initInteraction(), options.riseOnHover && L.DomEvent.on(icon, "mouseover", this._bringToFront, this).on(icon, "mouseout", this._resetZIndex, this);
                        var newShadow = options.icon.createShadow(this._shadow),
                            addShadow = !1;
                        newShadow !== this._shadow && (this._removeShadow(), addShadow = !0), newShadow && L.DomUtil.addClass(newShadow, classToAdd), this._shadow = newShadow, options.opacity < 1 && this._updateOpacity();
                        var panes = this._map._panes;
                        addIcon && panes.markerPane.appendChild(this._icon), newShadow && addShadow && panes.shadowPane.appendChild(this._shadow)
                    },
                    _removeIcon: function() {
                        this.options.riseOnHover && L.DomEvent.off(this._icon, "mouseover", this._bringToFront).off(this._icon, "mouseout", this._resetZIndex), this._map._panes.markerPane.removeChild(this._icon), this._icon = null
                    },
                    _removeShadow: function() {
                        this._shadow && this._map._panes.shadowPane.removeChild(this._shadow), this._shadow = null
                    },
                    _setPos: function(pos) {
                        L.DomUtil.setPosition(this._icon, pos), this._shadow && L.DomUtil.setPosition(this._shadow, pos), this._zIndex = pos.y + this.options.zIndexOffset, this._resetZIndex()
                    },
                    _updateZIndex: function(offset) {
                        this._icon.style.zIndex = this._zIndex + offset
                    },
                    _animateZoom: function(opt) {
                        var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();
                        this._setPos(pos)
                    },
                    _initInteraction: function() {
                        if (this.options.clickable) {
                            var icon = this._icon,
                                events = ["dblclick", "mousedown", "mouseover", "mouseout", "contextmenu"];
                            L.DomUtil.addClass(icon, "leaflet-clickable"), L.DomEvent.on(icon, "click", this._onMouseClick, this), L.DomEvent.on(icon, "keypress", this._onKeyPress, this);
                            for (var i = 0; i < events.length; i++) L.DomEvent.on(icon, events[i], this._fireMouseEvent, this);
                            L.Handler.MarkerDrag && (this.dragging = new L.Handler.MarkerDrag(this), this.options.draggable && this.dragging.enable())
                        }
                    },
                    _onMouseClick: function(e) {
                        var wasDragged = this.dragging && this.dragging.moved();
                        (this.hasEventListeners(e.type) || wasDragged) && L.DomEvent.stopPropagation(e), wasDragged || (this.dragging && this.dragging._enabled || !this._map.dragging || !this._map.dragging.moved()) && this.fire(e.type, {
                            originalEvent: e,
                            latlng: this._latlng
                        })
                    },
                    _onKeyPress: function(e) {
                        13 === e.keyCode && this.fire("click", {
                            originalEvent: e,
                            latlng: this._latlng
                        })
                    },
                    _fireMouseEvent: function(e) {
                        this.fire(e.type, {
                            originalEvent: e,
                            latlng: this._latlng
                        }), "contextmenu" === e.type && this.hasEventListeners(e.type) && L.DomEvent.preventDefault(e), "mousedown" !== e.type ? L.DomEvent.stopPropagation(e) : L.DomEvent.preventDefault(e)
                    },
                    setOpacity: function(opacity) {
                        return this.options.opacity = opacity, this._map && this._updateOpacity(), this
                    },
                    _updateOpacity: function() {
                        L.DomUtil.setOpacity(this._icon, this.options.opacity), this._shadow && L.DomUtil.setOpacity(this._shadow, this.options.opacity)
                    },
                    _bringToFront: function() {
                        this._updateZIndex(this.options.riseOffset)
                    },
                    _resetZIndex: function() {
                        this._updateZIndex(0)
                    }
                }), L.marker = function(latlng, options) {
                    return new L.Marker(latlng, options)
                }, L.DivIcon = L.Icon.extend({
                    options: {
                        iconSize: [12, 12],
                        className: "leaflet-div-icon",
                        html: !1
                    },
                    createIcon: function(oldIcon) {
                        var div = oldIcon && "DIV" === oldIcon.tagName ? oldIcon : document.createElement("div"),
                            options = this.options;
                        return div.innerHTML = options.html !== !1 ? options.html : "", options.bgPos && (div.style.backgroundPosition = -options.bgPos.x + "px " + -options.bgPos.y + "px"), this._setIconStyles(div, "icon"), div
                    },
                    createShadow: function() {
                        return null
                    }
                }), L.divIcon = function(options) {
                    return new L.DivIcon(options)
                }, L.Map.mergeOptions({
                    closePopupOnClick: !0
                }), L.Popup = L.Class.extend({
                    includes: L.Mixin.Events,
                    options: {
                        minWidth: 50,
                        maxWidth: 300,
                        autoPan: !0,
                        closeButton: !0,
                        offset: [0, 7],
                        autoPanPadding: [5, 5],
                        keepInView: !1,
                        className: "",
                        zoomAnimation: !0
                    },
                    initialize: function(options, source) {
                        L.setOptions(this, options), this._source = source, this._animated = L.Browser.any3d && this.options.zoomAnimation, this._isOpen = !1
                    },
                    onAdd: function(map) {
                        this._map = map, this._container || this._initLayout();
                        var animFade = map.options.fadeAnimation;
                        animFade && L.DomUtil.setOpacity(this._container, 0), map._panes.popupPane.appendChild(this._container), map.on(this._getEvents(), this), this.update(), animFade && L.DomUtil.setOpacity(this._container, 1), this.fire("open"), map.fire("popupopen", {
                            popup: this
                        }), this._source && this._source.fire("popupopen", {
                            popup: this
                        })
                    },
                    addTo: function(map) {
                        return map.addLayer(this), this
                    },
                    openOn: function(map) {
                        return map.openPopup(this), this
                    },
                    onRemove: function(map) {
                        map._panes.popupPane.removeChild(this._container), L.Util.falseFn(this._container.offsetWidth), map.off(this._getEvents(), this), map.options.fadeAnimation && L.DomUtil.setOpacity(this._container, 0), this._map = null, this.fire("close"), map.fire("popupclose", {
                            popup: this
                        }), this._source && this._source.fire("popupclose", {
                            popup: this
                        })
                    },
                    getLatLng: function() {
                        return this._latlng
                    },
                    setLatLng: function(latlng) {
                        return this._latlng = L.latLng(latlng), this._map && (this._updatePosition(), this._adjustPan()), this
                    },
                    getContent: function() {
                        return this._content
                    },
                    setContent: function(content) {
                        return this._content = content, this.update(), this
                    },
                    update: function() {
                        this._map && (this._container.style.visibility = "hidden", this._updateContent(), this._updateLayout(), this._updatePosition(), this._container.style.visibility = "", this._adjustPan())
                    },
                    _getEvents: function() {
                        var events = {
                            viewreset: this._updatePosition
                        };
                        return this._animated && (events.zoomanim = this._zoomAnimation), ("closeOnClick" in this.options ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (events.preclick = this._close), this.options.keepInView && (events.moveend = this._adjustPan), events
                    },
                    _close: function() {
                        this._map && this._map.closePopup(this)
                    },
                    _initLayout: function() {
                        var closeButton, prefix = "leaflet-popup",
                            containerClass = prefix + " " + this.options.className + " leaflet-zoom-" + (this._animated ? "animated" : "hide"),
                            container = this._container = L.DomUtil.create("div", containerClass);
                        this.options.closeButton && (closeButton = this._closeButton = L.DomUtil.create("a", prefix + "-close-button", container), closeButton.href = "#close", closeButton.innerHTML = "&#215;", L.DomEvent.disableClickPropagation(closeButton), L.DomEvent.on(closeButton, "click", this._onCloseButtonClick, this));
                        var wrapper = this._wrapper = L.DomUtil.create("div", prefix + "-content-wrapper", container);
                        L.DomEvent.disableClickPropagation(wrapper), this._contentNode = L.DomUtil.create("div", prefix + "-content", wrapper), L.DomEvent.disableScrollPropagation(this._contentNode),
                            L.DomEvent.on(wrapper, "contextmenu", L.DomEvent.stopPropagation), this._tipContainer = L.DomUtil.create("div", prefix + "-tip-container", container), this._tip = L.DomUtil.create("div", prefix + "-tip", this._tipContainer)
                    },
                    _updateContent: function() {
                        if (this._content) {
                            if ("string" == typeof this._content) this._contentNode.innerHTML = this._content;
                            else {
                                for (; this._contentNode.hasChildNodes();) this._contentNode.removeChild(this._contentNode.firstChild);
                                this._contentNode.appendChild(this._content)
                            }
                            this.fire("contentupdate")
                        }
                    },
                    _updateLayout: function() {
                        var container = this._contentNode,
                            style = container.style;
                        style.width = "", style.whiteSpace = "nowrap";
                        var width = container.offsetWidth;
                        width = Math.min(width, this.options.maxWidth), width = Math.max(width, this.options.minWidth), style.width = width + 1 + "px", style.whiteSpace = "", style.height = "";
                        var height = container.offsetHeight,
                            maxHeight = this.options.maxHeight,
                            scrolledClass = "leaflet-popup-scrolled";
                        maxHeight && height > maxHeight ? (style.height = maxHeight + "px", L.DomUtil.addClass(container, scrolledClass)) : L.DomUtil.removeClass(container, scrolledClass), this._containerWidth = this._container.offsetWidth
                    },
                    _updatePosition: function() {
                        if (this._map) {
                            var pos = this._map.latLngToLayerPoint(this._latlng),
                                animated = this._animated,
                                offset = L.point(this.options.offset);
                            animated && L.DomUtil.setPosition(this._container, pos), this._containerBottom = -offset.y - (animated ? 0 : pos.y), this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x + (animated ? 0 : pos.x), this._container.style.bottom = this._containerBottom + "px", this._container.style.left = this._containerLeft + "px"
                        }
                    },
                    _zoomAnimation: function(opt) {
                        var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center);
                        L.DomUtil.setPosition(this._container, pos)
                    },
                    _adjustPan: function() {
                        if (this.options.autoPan) {
                            var map = this._map,
                                containerHeight = this._container.offsetHeight,
                                containerWidth = this._containerWidth,
                                layerPos = new L.Point(this._containerLeft, -containerHeight - this._containerBottom);
                            this._animated && layerPos._add(L.DomUtil.getPosition(this._container));
                            var containerPos = map.layerPointToContainerPoint(layerPos),
                                padding = L.point(this.options.autoPanPadding),
                                paddingTL = L.point(this.options.autoPanPaddingTopLeft || padding),
                                paddingBR = L.point(this.options.autoPanPaddingBottomRight || padding),
                                size = map.getSize(),
                                dx = 0,
                                dy = 0;
                            containerPos.x + containerWidth + paddingBR.x > size.x && (dx = containerPos.x + containerWidth - size.x + paddingBR.x), containerPos.x - dx - paddingTL.x < 0 && (dx = containerPos.x - paddingTL.x), containerPos.y + containerHeight + paddingBR.y > size.y && (dy = containerPos.y + containerHeight - size.y + paddingBR.y), containerPos.y - dy - paddingTL.y < 0 && (dy = containerPos.y - paddingTL.y), (dx || dy) && map.fire("autopanstart").panBy([dx, dy])
                        }
                    },
                    _onCloseButtonClick: function(e) {
                        this._close(), L.DomEvent.stop(e)
                    }
                }), L.popup = function(options, source) {
                    return new L.Popup(options, source)
                }, L.Map.include({
                    openPopup: function(popup, latlng, options) {
                        if (this.closePopup(), !(popup instanceof L.Popup)) {
                            var content = popup;
                            popup = new L.Popup(options).setLatLng(latlng).setContent(content)
                        }
                        return popup._isOpen = !0, this._popup = popup, this.addLayer(popup)
                    },
                    closePopup: function(popup) {
                        return popup && popup !== this._popup || (popup = this._popup, this._popup = null), popup && (this.removeLayer(popup), popup._isOpen = !1), this
                    }
                }), L.Marker.include({
                    openPopup: function() {
                        return this._popup && this._map && !this._map.hasLayer(this._popup) && (this._popup.setLatLng(this._latlng), this._map.openPopup(this._popup)), this
                    },
                    closePopup: function() {
                        return this._popup && this._popup._close(), this
                    },
                    togglePopup: function() {
                        return this._popup && (this._popup._isOpen ? this.closePopup() : this.openPopup()), this
                    },
                    bindPopup: function(content, options) {
                        var anchor = L.point(this.options.icon.options.popupAnchor || [0, 0]);
                        return anchor = anchor.add(L.Popup.prototype.options.offset), options && options.offset && (anchor = anchor.add(options.offset)), options = L.extend({
                            offset: anchor
                        }, options), this._popupHandlersAdded || (this.on("click", this.togglePopup, this).on("remove", this.closePopup, this).on("move", this._movePopup, this), this._popupHandlersAdded = !0), content instanceof L.Popup ? (L.setOptions(content, options), this._popup = content, content._source = this) : this._popup = new L.Popup(options, this).setContent(content), this
                    },
                    setPopupContent: function(content) {
                        return this._popup && this._popup.setContent(content), this
                    },
                    unbindPopup: function() {
                        return this._popup && (this._popup = null, this.off("click", this.togglePopup, this).off("remove", this.closePopup, this).off("move", this._movePopup, this), this._popupHandlersAdded = !1), this
                    },
                    getPopup: function() {
                        return this._popup
                    },
                    _movePopup: function(e) {
                        this._popup.setLatLng(e.latlng)
                    }
                }), L.LayerGroup = L.Class.extend({
                    initialize: function(layers) {
                        this._layers = {};
                        var i, len;
                        if (layers)
                            for (i = 0, len = layers.length; len > i; i++) this.addLayer(layers[i])
                    },
                    addLayer: function(layer) {
                        var id = this.getLayerId(layer);
                        return this._layers[id] = layer, this._map && this._map.addLayer(layer), this
                    },
                    removeLayer: function(layer) {
                        var id = layer in this._layers ? layer : this.getLayerId(layer);
                        return this._map && this._layers[id] && this._map.removeLayer(this._layers[id]), delete this._layers[id], this
                    },
                    hasLayer: function(layer) {
                        return layer ? layer in this._layers || this.getLayerId(layer) in this._layers : !1
                    },
                    clearLayers: function() {
                        return this.eachLayer(this.removeLayer, this), this
                    },
                    invoke: function(methodName) {
                        var i, layer, args = Array.prototype.slice.call(arguments, 1);
                        for (i in this._layers) layer = this._layers[i], layer[methodName] && layer[methodName].apply(layer, args);
                        return this
                    },
                    onAdd: function(map) {
                        this._map = map, this.eachLayer(map.addLayer, map)
                    },
                    onRemove: function(map) {
                        this.eachLayer(map.removeLayer, map), this._map = null
                    },
                    addTo: function(map) {
                        return map.addLayer(this), this
                    },
                    eachLayer: function(method, context) {
                        for (var i in this._layers) method.call(context, this._layers[i]);
                        return this
                    },
                    getLayer: function(id) {
                        return this._layers[id]
                    },
                    getLayers: function() {
                        var layers = [];
                        for (var i in this._layers) layers.push(this._layers[i]);
                        return layers
                    },
                    setZIndex: function(zIndex) {
                        return this.invoke("setZIndex", zIndex)
                    },
                    getLayerId: function(layer) {
                        return L.stamp(layer)
                    }
                }), L.layerGroup = function(layers) {
                    return new L.LayerGroup(layers)
                }, L.FeatureGroup = L.LayerGroup.extend({
                    includes: L.Mixin.Events,
                    statics: {
                        EVENTS: "click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose"
                    },
                    addLayer: function(layer) {
                        return this.hasLayer(layer) ? this : ("on" in layer && layer.on(L.FeatureGroup.EVENTS, this._propagateEvent, this), L.LayerGroup.prototype.addLayer.call(this, layer), this._popupContent && layer.bindPopup && layer.bindPopup(this._popupContent, this._popupOptions), this.fire("layeradd", {
                            layer: layer
                        }))
                    },
                    removeLayer: function(layer) {
                        return this.hasLayer(layer) ? (layer in this._layers && (layer = this._layers[layer]), "off" in layer && layer.off(L.FeatureGroup.EVENTS, this._propagateEvent, this), L.LayerGroup.prototype.removeLayer.call(this, layer), this._popupContent && this.invoke("unbindPopup"), this.fire("layerremove", {
                            layer: layer
                        })) : this
                    },
                    bindPopup: function(content, options) {
                        return this._popupContent = content, this._popupOptions = options, this.invoke("bindPopup", content, options)
                    },
                    openPopup: function(latlng) {
                        for (var id in this._layers) {
                            this._layers[id].openPopup(latlng);
                            break
                        }
                        return this
                    },
                    setStyle: function(style) {
                        return this.invoke("setStyle", style)
                    },
                    bringToFront: function() {
                        return this.invoke("bringToFront")
                    },
                    bringToBack: function() {
                        return this.invoke("bringToBack")
                    },
                    getBounds: function() {
                        var bounds = new L.LatLngBounds;
                        return this.eachLayer(function(layer) {
                            bounds.extend(layer instanceof L.Marker ? layer.getLatLng() : layer.getBounds())
                        }), bounds
                    },
                    _propagateEvent: function(e) {
                        e = L.extend({
                            layer: e.target,
                            target: this
                        }, e), this.fire(e.type, e)
                    }
                }), L.featureGroup = function(layers) {
                    return new L.FeatureGroup(layers)
                }, L.Path = L.Class.extend({
                    includes: [L.Mixin.Events],
                    statics: {
                        CLIP_PADDING: function() {
                            var max = L.Browser.mobile ? 1280 : 2e3,
                                target = (max / Math.max(window.outerWidth, window.outerHeight) - 1) / 2;
                            return Math.max(0, Math.min(.5, target))
                        }()
                    },
                    options: {
                        stroke: !0,
                        color: "#0033ff",
                        dashArray: null,
                        lineCap: null,
                        lineJoin: null,
                        weight: 5,
                        opacity: .5,
                        fill: !1,
                        fillColor: null,
                        fillOpacity: .2,
                        clickable: !0
                    },
                    initialize: function(options) {
                        L.setOptions(this, options)
                    },
                    onAdd: function(map) {
                        this._map = map, this._container || (this._initElements(), this._initEvents()), this.projectLatlngs(), this._updatePath(), this._container && this._map._pathRoot.appendChild(this._container), this.fire("add"), map.on({
                            viewreset: this.projectLatlngs,
                            moveend: this._updatePath
                        }, this)
                    },
                    addTo: function(map) {
                        return map.addLayer(this), this
                    },
                    onRemove: function(map) {
                        map._pathRoot.removeChild(this._container), this.fire("remove"), this._map = null, L.Browser.vml && (this._container = null, this._stroke = null, this._fill = null), map.off({
                            viewreset: this.projectLatlngs,
                            moveend: this._updatePath
                        }, this)
                    },
                    projectLatlngs: function() {},
                    setStyle: function(style) {
                        return L.setOptions(this, style), this._container && this._updateStyle(), this
                    },
                    redraw: function() {
                        return this._map && (this.projectLatlngs(), this._updatePath()), this
                    }
                }), L.Map.include({
                    _updatePathViewport: function() {
                        var p = L.Path.CLIP_PADDING,
                            size = this.getSize(),
                            panePos = L.DomUtil.getPosition(this._mapPane),
                            min = panePos.multiplyBy(-1)._subtract(size.multiplyBy(p)._round()),
                            max = min.add(size.multiplyBy(1 + 2 * p)._round());
                        this._pathViewport = new L.Bounds(min, max)
                    }
                }), L.Path.SVG_NS = "http://www.w3.org/2000/svg", L.Browser.svg = !(!document.createElementNS || !document.createElementNS(L.Path.SVG_NS, "svg").createSVGRect), L.Path = L.Path.extend({
                    statics: {
                        SVG: L.Browser.svg
                    },
                    bringToFront: function() {
                        var root = this._map._pathRoot,
                            path = this._container;
                        return path && root.lastChild !== path && root.appendChild(path), this
                    },
                    bringToBack: function() {
                        var root = this._map._pathRoot,
                            path = this._container,
                            first = root.firstChild;
                        return path && first !== path && root.insertBefore(path, first), this
                    },
                    getPathString: function() {},
                    _createElement: function(name) {
                        return document.createElementNS(L.Path.SVG_NS, name)
                    },
                    _initElements: function() {
                        this._map._initPathRoot(), this._initPath(), this._initStyle()
                    },
                    _initPath: function() {
                        this._container = this._createElement("g"), this._path = this._createElement("path"), this.options.className && L.DomUtil.addClass(this._path, this.options.className), this._container.appendChild(this._path)
                    },
                    _initStyle: function() {
                        this.options.stroke && (this._path.setAttribute("stroke-linejoin", "round"), this._path.setAttribute("stroke-linecap", "round")), this.options.fill && this._path.setAttribute("fill-rule", "evenodd"), this.options.pointerEvents && this._path.setAttribute("pointer-events", this.options.pointerEvents), this.options.clickable || this.options.pointerEvents || this._path.setAttribute("pointer-events", "none"), this._updateStyle()
                    },
                    _updateStyle: function() {
                        this.options.stroke ? (this._path.setAttribute("stroke", this.options.color), this._path.setAttribute("stroke-opacity", this.options.opacity), this._path.setAttribute("stroke-width", this.options.weight), this.options.dashArray ? this._path.setAttribute("stroke-dasharray", this.options.dashArray) : this._path.removeAttribute("stroke-dasharray"), this.options.lineCap && this._path.setAttribute("stroke-linecap", this.options.lineCap), this.options.lineJoin && this._path.setAttribute("stroke-linejoin", this.options.lineJoin)) : this._path.setAttribute("stroke", "none"), this.options.fill ? (this._path.setAttribute("fill", this.options.fillColor || this.options.color), this._path.setAttribute("fill-opacity", this.options.fillOpacity)) : this._path.setAttribute("fill", "none")
                    },
                    _updatePath: function() {
                        var str = this.getPathString();
                        str || (str = "M0 0"), this._path.setAttribute("d", str)
                    },
                    _initEvents: function() {
                        if (this.options.clickable) {
                            (L.Browser.svg || !L.Browser.vml) && L.DomUtil.addClass(this._path, "leaflet-clickable"), L.DomEvent.on(this._container, "click", this._onMouseClick, this);
                            for (var events = ["dblclick", "mousedown", "mouseover", "mouseout", "mousemove", "contextmenu"], i = 0; i < events.length; i++) L.DomEvent.on(this._container, events[i], this._fireMouseEvent, this)
                        }
                    },
                    _onMouseClick: function(e) {
                        this._map.dragging && this._map.dragging.moved() || this._fireMouseEvent(e)
                    },
                    _fireMouseEvent: function(e) {
                        if (this._map && this.hasEventListeners(e.type)) {
                            var map = this._map,
                                containerPoint = map.mouseEventToContainerPoint(e),
                                layerPoint = map.containerPointToLayerPoint(containerPoint),
                                latlng = map.layerPointToLatLng(layerPoint);
                            this.fire(e.type, {
                                latlng: latlng,
                                layerPoint: layerPoint,
                                containerPoint: containerPoint,
                                originalEvent: e
                            }), "contextmenu" === e.type && L.DomEvent.preventDefault(e), "mousemove" !== e.type && L.DomEvent.stopPropagation(e)
                        }
                    }
                }), L.Map.include({
                    _initPathRoot: function() {
                        this._pathRoot || (this._pathRoot = L.Path.prototype._createElement("svg"), this._panes.overlayPane.appendChild(this._pathRoot), this.options.zoomAnimation && L.Browser.any3d ? (L.DomUtil.addClass(this._pathRoot, "leaflet-zoom-animated"), this.on({
                            zoomanim: this._animatePathZoom,
                            zoomend: this._endPathZoom
                        })) : L.DomUtil.addClass(this._pathRoot, "leaflet-zoom-hide"), this.on("moveend", this._updateSvgViewport), this._updateSvgViewport())
                    },
                    _animatePathZoom: function(e) {
                        var scale = this.getZoomScale(e.zoom),
                            offset = this._getCenterOffset(e.center)._multiplyBy(-scale)._add(this._pathViewport.min);
                        this._pathRoot.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(offset) + " scale(" + scale + ") ", this._pathZooming = !0
                    },
                    _endPathZoom: function() {
                        this._pathZooming = !1
                    },
                    _updateSvgViewport: function() {
                        if (!this._pathZooming) {
                            this._updatePathViewport();
                            var vp = this._pathViewport,
                                min = vp.min,
                                max = vp.max,
                                width = max.x - min.x,
                                height = max.y - min.y,
                                root = this._pathRoot,
                                pane = this._panes.overlayPane;
                            L.Browser.mobileWebkit && pane.removeChild(root), L.DomUtil.setPosition(root, min), root.setAttribute("width", width), root.setAttribute("height", height), root.setAttribute("viewBox", [min.x, min.y, width, height].join(" ")), L.Browser.mobileWebkit && pane.appendChild(root)
                        }
                    }
                }), L.Path.include({
                    bindPopup: function(content, options) {
                        return content instanceof L.Popup ? this._popup = content : ((!this._popup || options) && (this._popup = new L.Popup(options, this)), this._popup.setContent(content)), this._popupHandlersAdded || (this.on("click", this._openPopup, this).on("remove", this.closePopup, this), this._popupHandlersAdded = !0), this
                    },
                    unbindPopup: function() {
                        return this._popup && (this._popup = null, this.off("click", this._openPopup).off("remove", this.closePopup), this._popupHandlersAdded = !1), this
                    },
                    openPopup: function(latlng) {
                        return this._popup && (latlng = latlng || this._latlng || this._latlngs[Math.floor(this._latlngs.length / 2)], this._openPopup({
                            latlng: latlng
                        })), this
                    },
                    closePopup: function() {
                        return this._popup && this._popup._close(), this
                    },
                    _openPopup: function(e) {
                        this._popup.setLatLng(e.latlng), this._map.openPopup(this._popup)
                    }
                }), L.Browser.vml = !L.Browser.svg && function() {
                    try {
                        var div = document.createElement("div");
                        div.innerHTML = '<v:shape adj="1"/>';
                        var shape = div.firstChild;
                        return shape.style.behavior = "url(#default#VML)", shape && "object" == typeof shape.adj
                    } catch (e) {
                        return !1
                    }
                }(), L.Path = L.Browser.svg || !L.Browser.vml ? L.Path : L.Path.extend({
                    statics: {
                        VML: !0,
                        CLIP_PADDING: .02
                    },
                    _createElement: function() {
                        try {
                            return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"),
                                function(name) {
                                    return document.createElement("<lvml:" + name + ' class="lvml">')
                                }
                        } catch (e) {
                            return function(name) {
                                return document.createElement("<" + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')
                            }
                        }
                    }(),
                    _initPath: function() {
                        var container = this._container = this._createElement("shape");
                        L.DomUtil.addClass(container, "leaflet-vml-shape" + (this.options.className ? " " + this.options.className : "")), this.options.clickable && L.DomUtil.addClass(container, "leaflet-clickable"), container.coordsize = "1 1", this._path = this._createElement("path"), container.appendChild(this._path), this._map._pathRoot.appendChild(container)
                    },
                    _initStyle: function() {
                        this._updateStyle()
                    },
                    _updateStyle: function() {
                        var stroke = this._stroke,
                            fill = this._fill,
                            options = this.options,
                            container = this._container;
                        container.stroked = options.stroke, container.filled = options.fill, options.stroke ? (stroke || (stroke = this._stroke = this._createElement("stroke"), stroke.endcap = "round", container.appendChild(stroke)), stroke.weight = options.weight + "px", stroke.color = options.color, stroke.opacity = options.opacity, stroke.dashStyle = options.dashArray ? L.Util.isArray(options.dashArray) ? options.dashArray.join(" ") : options.dashArray.replace(/( *, *)/g, " ") : "", options.lineCap && (stroke.endcap = options.lineCap.replace("butt", "flat")), options.lineJoin && (stroke.joinstyle = options.lineJoin)) : stroke && (container.removeChild(stroke), this._stroke = null), options.fill ? (fill || (fill = this._fill = this._createElement("fill"), container.appendChild(fill)), fill.color = options.fillColor || options.color, fill.opacity = options.fillOpacity) : fill && (container.removeChild(fill), this._fill = null)
                    },
                    _updatePath: function() {
                        var style = this._container.style;
                        style.display = "none", this._path.v = this.getPathString() + " ", style.display = ""
                    }
                }), L.Map.include(L.Browser.svg || !L.Browser.vml ? {} : {
                    _initPathRoot: function() {
                        if (!this._pathRoot) {
                            var root = this._pathRoot = document.createElement("div");
                            root.className = "leaflet-vml-container", this._panes.overlayPane.appendChild(root), this.on("moveend", this._updatePathViewport), this._updatePathViewport()
                        }
                    }
                }), L.Browser.canvas = function() {
                    return !!document.createElement("canvas").getContext
                }(), L.Path = L.Path.SVG && !window.L_PREFER_CANVAS || !L.Browser.canvas ? L.Path : L.Path.extend({
                    statics: {
                        CANVAS: !0,
                        SVG: !1
                    },
                    redraw: function() {
                        return this._map && (this.projectLatlngs(), this._requestUpdate()), this
                    },
                    setStyle: function(style) {
                        return L.setOptions(this, style), this._map && (this._updateStyle(), this._requestUpdate()), this
                    },
                    onRemove: function(map) {
                        map.off("viewreset", this.projectLatlngs, this).off("moveend", this._updatePath, this), this.options.clickable && (this._map.off("click", this._onClick, this), this._map.off("mousemove", this._onMouseMove, this)), this._requestUpdate(), this.fire("remove"), this._map = null
                    },
                    _requestUpdate: function() {
                        this._map && !L.Path._updateRequest && (L.Path._updateRequest = L.Util.requestAnimFrame(this._fireMapMoveEnd, this._map))
                    },
                    _fireMapMoveEnd: function() {
                        L.Path._updateRequest = null, this.fire("moveend")
                    },
                    _initElements: function() {
                        this._map._initPathRoot(), this._ctx = this._map._canvasCtx
                    },
                    _updateStyle: function() {
                        var options = this.options;
                        options.stroke && (this._ctx.lineWidth = options.weight, this._ctx.strokeStyle = options.color), options.fill && (this._ctx.fillStyle = options.fillColor || options.color), options.lineCap && (this._ctx.lineCap = options.lineCap), options.lineJoin && (this._ctx.lineJoin = options.lineJoin)
                    },
                    _drawPath: function() {
                        var i, j, len, len2, point, drawMethod;
                        for (this._ctx.beginPath(), i = 0, len = this._parts.length; len > i; i++) {
                            for (j = 0, len2 = this._parts[i].length; len2 > j; j++) point = this._parts[i][j], drawMethod = (0 === j ? "move" : "line") + "To", this._ctx[drawMethod](point.x, point.y);
                            this instanceof L.Polygon && this._ctx.closePath()
                        }
                    },
                    _checkIfEmpty: function() {
                        return !this._parts.length
                    },
                    _updatePath: function() {
                        if (!this._checkIfEmpty()) {
                            var ctx = this._ctx,
                                options = this.options;
                            this._drawPath(), ctx.save(), this._updateStyle(), options.fill && (ctx.globalAlpha = options.fillOpacity, ctx.fill(options.fillRule || "evenodd")), options.stroke && (ctx.globalAlpha = options.opacity, ctx.stroke()), ctx.restore()
                        }
                    },
                    _initEvents: function() {
                        this.options.clickable && (this._map.on("mousemove", this._onMouseMove, this), this._map.on("click dblclick contextmenu", this._fireMouseEvent, this))
                    },
                    _fireMouseEvent: function(e) {
                        this._containsPoint(e.layerPoint) && this.fire(e.type, e)
                    },
                    _onMouseMove: function(e) {
                        this._map && !this._map._animatingZoom && (this._containsPoint(e.layerPoint) ? (this._ctx.canvas.style.cursor = "pointer", this._mouseInside = !0, this.fire("mouseover", e)) : this._mouseInside && (this._ctx.canvas.style.cursor = "", this._mouseInside = !1, this.fire("mouseout", e)))
                    }
                }), L.Map.include(L.Path.SVG && !window.L_PREFER_CANVAS || !L.Browser.canvas ? {} : {
                    _initPathRoot: function() {
                        var ctx, root = this._pathRoot;
                        root || (root = this._pathRoot = document.createElement("canvas"), root.style.position = "absolute", ctx = this._canvasCtx = root.getContext("2d"), ctx.lineCap = "round", ctx.lineJoin = "round", this._panes.overlayPane.appendChild(root), this.options.zoomAnimation && (this._pathRoot.className = "leaflet-zoom-animated", this.on("zoomanim", this._animatePathZoom), this.on("zoomend", this._endPathZoom)), this.on("moveend", this._updateCanvasViewport), this._updateCanvasViewport())
                    },
                    _updateCanvasViewport: function() {
                        if (!this._pathZooming) {
                            this._updatePathViewport();
                            var vp = this._pathViewport,
                                min = vp.min,
                                size = vp.max.subtract(min),
                                root = this._pathRoot;
                            L.DomUtil.setPosition(root, min), root.width = size.x, root.height = size.y, root.getContext("2d").translate(-min.x, -min.y)
                        }
                    }
                }), L.LineUtil = {
                    simplify: function(points, tolerance) {
                        if (!tolerance || !points.length) return points.slice();
                        var sqTolerance = tolerance * tolerance;
                        return points = this._reducePoints(points, sqTolerance), points = this._simplifyDP(points, sqTolerance)
                    },
                    pointToSegmentDistance: function(p, p1, p2) {
                        return Math.sqrt(this._sqClosestPointOnSegment(p, p1, p2, !0))
                    },
                    closestPointOnSegment: function(p, p1, p2) {
                        return this._sqClosestPointOnSegment(p, p1, p2)
                    },
                    _simplifyDP: function(points, sqTolerance) {
                        var len = points.length,
                            ArrayConstructor = typeof Uint8Array != undefined + "" ? Uint8Array : Array,
                            markers = new ArrayConstructor(len);
                        markers[0] = markers[len - 1] = 1, this._simplifyDPStep(points, markers, sqTolerance, 0, len - 1);
                        var i, newPoints = [];
                        for (i = 0; len > i; i++) markers[i] && newPoints.push(points[i]);
                        return newPoints
                    },
                    _simplifyDPStep: function(points, markers, sqTolerance, first, last) {
                        var index, i, sqDist, maxSqDist = 0;
                        for (i = first + 1; last - 1 >= i; i++) sqDist = this._sqClosestPointOnSegment(points[i], points[first], points[last], !0), sqDist > maxSqDist && (index = i, maxSqDist = sqDist);
                        maxSqDist > sqTolerance && (markers[index] = 1, this._simplifyDPStep(points, markers, sqTolerance, first, index), this._simplifyDPStep(points, markers, sqTolerance, index, last))
                    },
                    _reducePoints: function(points, sqTolerance) {
                        for (var reducedPoints = [points[0]], i = 1, prev = 0, len = points.length; len > i; i++) this._sqDist(points[i], points[prev]) > sqTolerance && (reducedPoints.push(points[i]), prev = i);
                        return len - 1 > prev && reducedPoints.push(points[len - 1]), reducedPoints
                    },
                    clipSegment: function(a, b, bounds, useLastCode) {
                        var codeOut, p, newCode, codeA = useLastCode ? this._lastCode : this._getBitCode(a, bounds),
                            codeB = this._getBitCode(b, bounds);
                        for (this._lastCode = codeB;;) {
                            if (!(codeA | codeB)) return [a, b];
                            if (codeA & codeB) return !1;
                            codeOut = codeA || codeB, p = this._getEdgeIntersection(a, b, codeOut, bounds), newCode = this._getBitCode(p, bounds), codeOut === codeA ? (a = p, codeA = newCode) : (b = p, codeB = newCode)
                        }
                    },
                    _getEdgeIntersection: function(a, b, code, bounds) {
                        var dx = b.x - a.x,
                            dy = b.y - a.y,
                            min = bounds.min,
                            max = bounds.max;
                        return 8 & code ? new L.Point(a.x + dx * (max.y - a.y) / dy, max.y) : 4 & code ? new L.Point(a.x + dx * (min.y - a.y) / dy, min.y) : 2 & code ? new L.Point(max.x, a.y + dy * (max.x - a.x) / dx) : 1 & code ? new L.Point(min.x, a.y + dy * (min.x - a.x) / dx) : void 0
                    },
                    _getBitCode: function(p, bounds) {
                        var code = 0;
                        return p.x < bounds.min.x ? code |= 1 : p.x > bounds.max.x && (code |= 2), p.y < bounds.min.y ? code |= 4 : p.y > bounds.max.y && (code |= 8), code
                    },
                    _sqDist: function(p1, p2) {
                        var dx = p2.x - p1.x,
                            dy = p2.y - p1.y;
                        return dx * dx + dy * dy
                    },
                    _sqClosestPointOnSegment: function(p, p1, p2, sqDist) {
                        var t, x = p1.x,
                            y = p1.y,
                            dx = p2.x - x,
                            dy = p2.y - y,
                            dot = dx * dx + dy * dy;
                        return dot > 0 && (t = ((p.x - x) * dx + (p.y - y) * dy) / dot, t > 1 ? (x = p2.x, y = p2.y) : t > 0 && (x += dx * t, y += dy * t)), dx = p.x - x, dy = p.y - y, sqDist ? dx * dx + dy * dy : new L.Point(x, y)
                    }
                }, L.Polyline = L.Path.extend({
                    initialize: function(latlngs, options) {
                        L.Path.prototype.initialize.call(this, options), this._latlngs = this._convertLatLngs(latlngs)
                    },
                    options: {
                        smoothFactor: 1,
                        noClip: !1
                    },
                    projectLatlngs: function() {
                        this._originalPoints = [];
                        for (var i = 0, len = this._latlngs.length; len > i; i++) this._originalPoints[i] = this._map.latLngToLayerPoint(this._latlngs[i])
                    },
                    getPathString: function() {
                        for (var i = 0, len = this._parts.length, str = ""; len > i; i++) str += this._getPathPartStr(this._parts[i]);
                        return str
                    },
                    getLatLngs: function() {
                        return this._latlngs
                    },
                    setLatLngs: function(latlngs) {
                        return this._latlngs = this._convertLatLngs(latlngs), this.redraw()
                    },
                    addLatLng: function(latlng) {
                        return this._latlngs.push(L.latLng(latlng)), this.redraw()
                    },
                    spliceLatLngs: function() {
                        var removed = [].splice.apply(this._latlngs, arguments);
                        return this._convertLatLngs(this._latlngs, !0), this.redraw(), removed
                    },
                    closestLayerPoint: function(p) {
                        for (var p1, p2, minDistance = 1 / 0, parts = this._parts, minPoint = null, j = 0, jLen = parts.length; jLen > j; j++)
                            for (var points = parts[j], i = 1, len = points.length; len > i; i++) {
                                p1 = points[i - 1], p2 = points[i];
                                var sqDist = L.LineUtil._sqClosestPointOnSegment(p, p1, p2, !0);
                                minDistance > sqDist && (minDistance = sqDist, minPoint = L.LineUtil._sqClosestPointOnSegment(p, p1, p2))
                            }
                        return minPoint && (minPoint.distance = Math.sqrt(minDistance)), minPoint
                    },
                    getBounds: function() {
                        return new L.LatLngBounds(this.getLatLngs())
                    },
                    _convertLatLngs: function(latlngs, overwrite) {
                        var i, len, target = overwrite ? latlngs : [];
                        for (i = 0, len = latlngs.length; len > i; i++) {
                            if (L.Util.isArray(latlngs[i]) && "number" != typeof latlngs[i][0]) return;
                            target[i] = L.latLng(latlngs[i])
                        }
                        return target
                    },
                    _initEvents: function() {
                        L.Path.prototype._initEvents.call(this)
                    },
                    _getPathPartStr: function(points) {
                        for (var p, round = L.Path.VML, j = 0, len2 = points.length, str = ""; len2 > j; j++) p = points[j], round && p._round(), str += (j ? "L" : "M") + p.x + " " + p.y;
                        return str
                    },
                    _clipPoints: function() {
                        var i, k, segment, points = this._originalPoints,
                            len = points.length;
                        if (this.options.noClip) return void(this._parts = [points]);
                        this._parts = [];
                        var parts = this._parts,
                            vp = this._map._pathViewport,
                            lu = L.LineUtil;
                        for (i = 0, k = 0; len - 1 > i; i++) segment = lu.clipSegment(points[i], points[i + 1], vp, i), segment && (parts[k] = parts[k] || [], parts[k].push(segment[0]), (segment[1] !== points[i + 1] || i === len - 2) && (parts[k].push(segment[1]), k++))
                    },
                    _simplifyPoints: function() {
                        for (var parts = this._parts, lu = L.LineUtil, i = 0, len = parts.length; len > i; i++) parts[i] = lu.simplify(parts[i], this.options.smoothFactor)
                    },
                    _updatePath: function() {
                        this._map && (this._clipPoints(), this._simplifyPoints(), L.Path.prototype._updatePath.call(this))
                    }
                }), L.polyline = function(latlngs, options) {
                    return new L.Polyline(latlngs, options)
                }, L.PolyUtil = {}, L.PolyUtil.clipPolygon = function(points, bounds) {
                    var clippedPoints, i, j, k, a, b, len, edge, p, edges = [1, 4, 2, 8],
                        lu = L.LineUtil;
                    for (i = 0, len = points.length; len > i; i++) points[i]._code = lu._getBitCode(points[i], bounds);
                    for (k = 0; 4 > k; k++) {
                        for (edge = edges[k], clippedPoints = [], i = 0, len = points.length, j = len - 1; len > i; j = i++) a = points[i], b = points[j], a._code & edge ? b._code & edge || (p = lu._getEdgeIntersection(b, a, edge, bounds), p._code = lu._getBitCode(p, bounds), clippedPoints.push(p)) : (b._code & edge && (p = lu._getEdgeIntersection(b, a, edge, bounds), p._code = lu._getBitCode(p, bounds), clippedPoints.push(p)), clippedPoints.push(a));
                        points = clippedPoints
                    }
                    return points
                }, L.Polygon = L.Polyline.extend({
                    options: {
                        fill: !0
                    },
                    initialize: function(latlngs, options) {
                        L.Polyline.prototype.initialize.call(this, latlngs, options), this._initWithHoles(latlngs)
                    },
                    _initWithHoles: function(latlngs) {
                        var i, len, hole;
                        if (latlngs && L.Util.isArray(latlngs[0]) && "number" != typeof latlngs[0][0])
                            for (this._latlngs = this._convertLatLngs(latlngs[0]), this._holes = latlngs.slice(1), i = 0, len = this._holes.length; len > i; i++) hole = this._holes[i] = this._convertLatLngs(this._holes[i]), hole[0].equals(hole[hole.length - 1]) && hole.pop();
                        latlngs = this._latlngs, latlngs.length >= 2 && latlngs[0].equals(latlngs[latlngs.length - 1]) && latlngs.pop()
                    },
                    projectLatlngs: function() {
                        if (L.Polyline.prototype.projectLatlngs.call(this), this._holePoints = [], this._holes) {
                            var i, j, len, len2;
                            for (i = 0, len = this._holes.length; len > i; i++)
                                for (this._holePoints[i] = [], j = 0, len2 = this._holes[i].length; len2 > j; j++) this._holePoints[i][j] = this._map.latLngToLayerPoint(this._holes[i][j])
                        }
                    },
                    setLatLngs: function(latlngs) {
                        return latlngs && L.Util.isArray(latlngs[0]) && "number" != typeof latlngs[0][0] ? (this._initWithHoles(latlngs), this.redraw()) : L.Polyline.prototype.setLatLngs.call(this, latlngs)
                    },
                    _clipPoints: function() {
                        var points = this._originalPoints,
                            newParts = [];
                        if (this._parts = [points].concat(this._holePoints), !this.options.noClip) {
                            for (var i = 0, len = this._parts.length; len > i; i++) {
                                var clipped = L.PolyUtil.clipPolygon(this._parts[i], this._map._pathViewport);
                                clipped.length && newParts.push(clipped)
                            }
                            this._parts = newParts
                        }
                    },
                    _getPathPartStr: function(points) {
                        var str = L.Polyline.prototype._getPathPartStr.call(this, points);
                        return str + (L.Browser.svg ? "z" : "x")
                    }
                }), L.polygon = function(latlngs, options) {
                    return new L.Polygon(latlngs, options)
                },
                function() {
                    function createMulti(Klass) {
                        return L.FeatureGroup.extend({
                            initialize: function(latlngs, options) {
                                this._layers = {}, this._options = options, this.setLatLngs(latlngs)
                            },
                            setLatLngs: function(latlngs) {
                                var i = 0,
                                    len = latlngs.length;
                                for (this.eachLayer(function(layer) {
                                        len > i ? layer.setLatLngs(latlngs[i++]) : this.removeLayer(layer)
                                    }, this); len > i;) this.addLayer(new Klass(latlngs[i++], this._options));
                                return this
                            },
                            getLatLngs: function() {
                                var latlngs = [];
                                return this.eachLayer(function(layer) {
                                    latlngs.push(layer.getLatLngs())
                                }), latlngs
                            }
                        })
                    }
                    L.MultiPolyline = createMulti(L.Polyline), L.MultiPolygon = createMulti(L.Polygon), L.multiPolyline = function(latlngs, options) {
                        return new L.MultiPolyline(latlngs, options)
                    }, L.multiPolygon = function(latlngs, options) {
                        return new L.MultiPolygon(latlngs, options)
                    }
                }(), L.Rectangle = L.Polygon.extend({
                    initialize: function(latLngBounds, options) {
                        L.Polygon.prototype.initialize.call(this, this._boundsToLatLngs(latLngBounds), options)
                    },
                    setBounds: function(latLngBounds) {
                        this.setLatLngs(this._boundsToLatLngs(latLngBounds))
                    },
                    _boundsToLatLngs: function(latLngBounds) {
                        return latLngBounds = L.latLngBounds(latLngBounds), [latLngBounds.getSouthWest(), latLngBounds.getNorthWest(), latLngBounds.getNorthEast(), latLngBounds.getSouthEast()]
                    }
                }), L.rectangle = function(latLngBounds, options) {
                    return new L.Rectangle(latLngBounds, options)
                }, L.Circle = L.Path.extend({
                    initialize: function(latlng, radius, options) {
                        L.Path.prototype.initialize.call(this, options), this._latlng = L.latLng(latlng), this._mRadius = radius
                    },
                    options: {
                        fill: !0
                    },
                    setLatLng: function(latlng) {
                        return this._latlng = L.latLng(latlng), this.redraw()
                    },
                    setRadius: function(radius) {
                        return this._mRadius = radius, this.redraw()
                    },
                    projectLatlngs: function() {
                        var lngRadius = this._getLngRadius(),
                            latlng = this._latlng,
                            pointLeft = this._map.latLngToLayerPoint([latlng.lat, latlng.lng - lngRadius]);
                        this._point = this._map.latLngToLayerPoint(latlng), this._radius = Math.max(this._point.x - pointLeft.x, 1)
                    },
                    getBounds: function() {
                        var lngRadius = this._getLngRadius(),
                            latRadius = this._mRadius / 40075017 * 360,
                            latlng = this._latlng;
                        return new L.LatLngBounds([latlng.lat - latRadius, latlng.lng - lngRadius], [latlng.lat + latRadius, latlng.lng + lngRadius])
                    },
                    getLatLng: function() {
                        return this._latlng
                    },
                    getPathString: function() {
                        var p = this._point,
                            r = this._radius;
                        return this._checkIfEmpty() ? "" : L.Browser.svg ? "M" + p.x + "," + (p.y - r) + "A" + r + "," + r + ",0,1,1," + (p.x - .1) + "," + (p.y - r) + " z" : (p._round(), r = Math.round(r), "AL " + p.x + "," + p.y + " " + r + "," + r + " 0,23592600")
                    },
                    getRadius: function() {
                        return this._mRadius
                    },
                    _getLatRadius: function() {
                        return this._mRadius / 40075017 * 360
                    },
                    _getLngRadius: function() {
                        return this._getLatRadius() / Math.cos(L.LatLng.DEG_TO_RAD * this._latlng.lat)
                    },
                    _checkIfEmpty: function() {
                        if (!this._map) return !1;
                        var vp = this._map._pathViewport,
                            r = this._radius,
                            p = this._point;
                        return p.x - r > vp.max.x || p.y - r > vp.max.y || p.x + r < vp.min.x || p.y + r < vp.min.y
                    }
                }), L.circle = function(latlng, radius, options) {
                    return new L.Circle(latlng, radius, options)
                }, L.CircleMarker = L.Circle.extend({
                    options: {
                        radius: 10,
                        weight: 2
                    },
                    initialize: function(latlng, options) {
                        L.Circle.prototype.initialize.call(this, latlng, null, options), this._radius = this.options.radius
                    },
                    projectLatlngs: function() {
                        this._point = this._map.latLngToLayerPoint(this._latlng)
                    },
                    _updateStyle: function() {
                        L.Circle.prototype._updateStyle.call(this), this.setRadius(this.options.radius)
                    },
                    setLatLng: function(latlng) {
                        return L.Circle.prototype.setLatLng.call(this, latlng), this._popup && this._popup._isOpen && this._popup.setLatLng(latlng), this
                    },
                    setRadius: function(radius) {
                        return this.options.radius = this._radius = radius, this.redraw()
                    },
                    getRadius: function() {
                        return this._radius
                    }
                }), L.circleMarker = function(latlng, options) {
                    return new L.CircleMarker(latlng, options)
                }, L.Polyline.include(L.Path.CANVAS ? {
                    _containsPoint: function(p, closed) {
                        var i, j, k, len, len2, dist, part, w = this.options.weight / 2;
                        for (L.Browser.touch && (w += 10), i = 0, len = this._parts.length; len > i; i++)
                            for (part = this._parts[i], j = 0, len2 = part.length, k = len2 - 1; len2 > j; k = j++)
                                if ((closed || 0 !== j) && (dist = L.LineUtil.pointToSegmentDistance(p, part[k], part[j]), w >= dist)) return !0;
                        return !1
                    }
                } : {}), L.Polygon.include(L.Path.CANVAS ? {
                    _containsPoint: function(p) {
                        var part, p1, p2, i, j, k, len, len2, inside = !1;
                        if (L.Polyline.prototype._containsPoint.call(this, p, !0)) return !0;
                        for (i = 0, len = this._parts.length; len > i; i++)
                            for (part = this._parts[i], j = 0, len2 = part.length,
                                k = len2 - 1; len2 > j; k = j++) p1 = part[j], p2 = part[k], p1.y > p.y != p2.y > p.y && p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x && (inside = !inside);
                        return inside
                    }
                } : {}), L.Circle.include(L.Path.CANVAS ? {
                    _drawPath: function() {
                        var p = this._point;
                        this._ctx.beginPath(), this._ctx.arc(p.x, p.y, this._radius, 0, 2 * Math.PI, !1)
                    },
                    _containsPoint: function(p) {
                        var center = this._point,
                            w2 = this.options.stroke ? this.options.weight / 2 : 0;
                        return p.distanceTo(center) <= this._radius + w2
                    }
                } : {}), L.CircleMarker.include(L.Path.CANVAS ? {
                    _updateStyle: function() {
                        L.Path.prototype._updateStyle.call(this)
                    }
                } : {}), L.GeoJSON = L.FeatureGroup.extend({
                    initialize: function(geojson, options) {
                        L.setOptions(this, options), this._layers = {}, geojson && this.addData(geojson)
                    },
                    addData: function(geojson) {
                        var i, len, feature, features = L.Util.isArray(geojson) ? geojson : geojson.features;
                        if (features) {
                            for (i = 0, len = features.length; len > i; i++) feature = features[i], (feature.geometries || feature.geometry || feature.features || feature.coordinates) && this.addData(features[i]);
                            return this
                        }
                        var options = this.options;
                        if (!options.filter || options.filter(geojson)) {
                            var layer = L.GeoJSON.geometryToLayer(geojson, options.pointToLayer, options.coordsToLatLng, options);
                            return layer.feature = L.GeoJSON.asFeature(geojson), layer.defaultOptions = layer.options, this.resetStyle(layer), options.onEachFeature && options.onEachFeature(geojson, layer), this.addLayer(layer)
                        }
                    },
                    resetStyle: function(layer) {
                        var style = this.options.style;
                        style && (L.Util.extend(layer.options, layer.defaultOptions), this._setLayerStyle(layer, style))
                    },
                    setStyle: function(style) {
                        this.eachLayer(function(layer) {
                            this._setLayerStyle(layer, style)
                        }, this)
                    },
                    _setLayerStyle: function(layer, style) {
                        "function" == typeof style && (style = style(layer.feature)), layer.setStyle && layer.setStyle(style)
                    }
                }), L.extend(L.GeoJSON, {
                    geometryToLayer: function(geojson, pointToLayer, coordsToLatLng, vectorOptions) {
                        var latlng, latlngs, i, len, geometry = "Feature" === geojson.type ? geojson.geometry : geojson,
                            coords = geometry.coordinates,
                            layers = [];
                        switch (coordsToLatLng = coordsToLatLng || this.coordsToLatLng, geometry.type) {
                            case "Point":
                                return latlng = coordsToLatLng(coords), pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng);
                            case "MultiPoint":
                                for (i = 0, len = coords.length; len > i; i++) latlng = coordsToLatLng(coords[i]), layers.push(pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng));
                                return new L.FeatureGroup(layers);
                            case "LineString":
                                return latlngs = this.coordsToLatLngs(coords, 0, coordsToLatLng), new L.Polyline(latlngs, vectorOptions);
                            case "Polygon":
                                if (2 === coords.length && !coords[1].length) throw new Error("Invalid GeoJSON object.");
                                return latlngs = this.coordsToLatLngs(coords, 1, coordsToLatLng), new L.Polygon(latlngs, vectorOptions);
                            case "MultiLineString":
                                return latlngs = this.coordsToLatLngs(coords, 1, coordsToLatLng), new L.MultiPolyline(latlngs, vectorOptions);
                            case "MultiPolygon":
                                return latlngs = this.coordsToLatLngs(coords, 2, coordsToLatLng), new L.MultiPolygon(latlngs, vectorOptions);
                            case "GeometryCollection":
                                for (i = 0, len = geometry.geometries.length; len > i; i++) layers.push(this.geometryToLayer({
                                    geometry: geometry.geometries[i],
                                    type: "Feature",
                                    properties: geojson.properties
                                }, pointToLayer, coordsToLatLng, vectorOptions));
                                return new L.FeatureGroup(layers);
                            default:
                                throw new Error("Invalid GeoJSON object.")
                        }
                    },
                    coordsToLatLng: function(coords) {
                        return new L.LatLng(coords[1], coords[0], coords[2])
                    },
                    coordsToLatLngs: function(coords, levelsDeep, coordsToLatLng) {
                        var latlng, i, len, latlngs = [];
                        for (i = 0, len = coords.length; len > i; i++) latlng = levelsDeep ? this.coordsToLatLngs(coords[i], levelsDeep - 1, coordsToLatLng) : (coordsToLatLng || this.coordsToLatLng)(coords[i]), latlngs.push(latlng);
                        return latlngs
                    },
                    latLngToCoords: function(latlng) {
                        var coords = [latlng.lng, latlng.lat];
                        return latlng.alt !== undefined && coords.push(latlng.alt), coords
                    },
                    latLngsToCoords: function(latLngs) {
                        for (var coords = [], i = 0, len = latLngs.length; len > i; i++) coords.push(L.GeoJSON.latLngToCoords(latLngs[i]));
                        return coords
                    },
                    getFeature: function(layer, newGeometry) {
                        return layer.feature ? L.extend({}, layer.feature, {
                            geometry: newGeometry
                        }) : L.GeoJSON.asFeature(newGeometry)
                    },
                    asFeature: function(geoJSON) {
                        return "Feature" === geoJSON.type ? geoJSON : {
                            type: "Feature",
                            properties: {},
                            geometry: geoJSON
                        }
                    }
                });
            var PointToGeoJSON = {
                toGeoJSON: function() {
                    return L.GeoJSON.getFeature(this, {
                        type: "Point",
                        coordinates: L.GeoJSON.latLngToCoords(this.getLatLng())
                    })
                }
            };
            L.Marker.include(PointToGeoJSON), L.Circle.include(PointToGeoJSON), L.CircleMarker.include(PointToGeoJSON), L.Polyline.include({
                    toGeoJSON: function() {
                        return L.GeoJSON.getFeature(this, {
                            type: "LineString",
                            coordinates: L.GeoJSON.latLngsToCoords(this.getLatLngs())
                        })
                    }
                }), L.Polygon.include({
                    toGeoJSON: function() {
                        var i, len, hole, coords = [L.GeoJSON.latLngsToCoords(this.getLatLngs())];
                        if (coords[0].push(coords[0][0]), this._holes)
                            for (i = 0, len = this._holes.length; len > i; i++) hole = L.GeoJSON.latLngsToCoords(this._holes[i]), hole.push(hole[0]), coords.push(hole);
                        return L.GeoJSON.getFeature(this, {
                            type: "Polygon",
                            coordinates: coords
                        })
                    }
                }),
                function() {
                    function multiToGeoJSON(type) {
                        return function() {
                            var coords = [];
                            return this.eachLayer(function(layer) {
                                coords.push(layer.toGeoJSON().geometry.coordinates)
                            }), L.GeoJSON.getFeature(this, {
                                type: type,
                                coordinates: coords
                            })
                        }
                    }
                    L.MultiPolyline.include({
                        toGeoJSON: multiToGeoJSON("MultiLineString")
                    }), L.MultiPolygon.include({
                        toGeoJSON: multiToGeoJSON("MultiPolygon")
                    }), L.LayerGroup.include({
                        toGeoJSON: function() {
                            var json, geometry = this.feature && this.feature.geometry,
                                jsons = [];
                            if (geometry && "MultiPoint" === geometry.type) return multiToGeoJSON("MultiPoint").call(this);
                            var isGeometryCollection = geometry && "GeometryCollection" === geometry.type;
                            return this.eachLayer(function(layer) {
                                layer.toGeoJSON && (json = layer.toGeoJSON(), jsons.push(isGeometryCollection ? json.geometry : L.GeoJSON.asFeature(json)))
                            }), isGeometryCollection ? L.GeoJSON.getFeature(this, {
                                geometries: jsons,
                                type: "GeometryCollection"
                            }) : {
                                type: "FeatureCollection",
                                features: jsons
                            }
                        }
                    })
                }(), L.geoJson = function(geojson, options) {
                    return new L.GeoJSON(geojson, options)
                }, L.DomEvent = {
                    addListener: function(obj, type, fn, context) {
                        var handler, originalHandler, newType, id = L.stamp(fn),
                            key = "_leaflet_" + type + id;
                        return obj[key] ? this : (handler = function(e) {
                            return fn.call(context || obj, e || L.DomEvent._getEvent())
                        }, L.Browser.pointer && 0 === type.indexOf("touch") ? this.addPointerListener(obj, type, handler, id) : (L.Browser.touch && "dblclick" === type && this.addDoubleTapListener && this.addDoubleTapListener(obj, handler, id), "addEventListener" in obj ? "mousewheel" === type ? (obj.addEventListener("DOMMouseScroll", handler, !1), obj.addEventListener(type, handler, !1)) : "mouseenter" === type || "mouseleave" === type ? (originalHandler = handler, newType = "mouseenter" === type ? "mouseover" : "mouseout", handler = function(e) {
                            return L.DomEvent._checkMouse(obj, e) ? originalHandler(e) : void 0
                        }, obj.addEventListener(newType, handler, !1)) : "click" === type && L.Browser.android ? (originalHandler = handler, handler = function(e) {
                            return L.DomEvent._filterClick(e, originalHandler)
                        }, obj.addEventListener(type, handler, !1)) : obj.addEventListener(type, handler, !1) : "attachEvent" in obj && obj.attachEvent("on" + type, handler), obj[key] = handler, this))
                    },
                    removeListener: function(obj, type, fn) {
                        var id = L.stamp(fn),
                            key = "_leaflet_" + type + id,
                            handler = obj[key];
                        return handler ? (L.Browser.pointer && 0 === type.indexOf("touch") ? this.removePointerListener(obj, type, id) : L.Browser.touch && "dblclick" === type && this.removeDoubleTapListener ? this.removeDoubleTapListener(obj, id) : "removeEventListener" in obj ? "mousewheel" === type ? (obj.removeEventListener("DOMMouseScroll", handler, !1), obj.removeEventListener(type, handler, !1)) : "mouseenter" === type || "mouseleave" === type ? obj.removeEventListener("mouseenter" === type ? "mouseover" : "mouseout", handler, !1) : obj.removeEventListener(type, handler, !1) : "detachEvent" in obj && obj.detachEvent("on" + type, handler), obj[key] = null, this) : this
                    },
                    stopPropagation: function(e) {
                        return e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0, L.DomEvent._skipped(e), this
                    },
                    disableScrollPropagation: function(el) {
                        var stop = L.DomEvent.stopPropagation;
                        return L.DomEvent.on(el, "mousewheel", stop).on(el, "MozMousePixelScroll", stop)
                    },
                    disableClickPropagation: function(el) {
                        for (var stop = L.DomEvent.stopPropagation, i = L.Draggable.START.length - 1; i >= 0; i--) L.DomEvent.on(el, L.Draggable.START[i], stop);
                        return L.DomEvent.on(el, "click", L.DomEvent._fakeStop).on(el, "dblclick", stop)
                    },
                    preventDefault: function(e) {
                        return e.preventDefault ? e.preventDefault() : e.returnValue = !1, this
                    },
                    stop: function(e) {
                        return L.DomEvent.preventDefault(e).stopPropagation(e)
                    },
                    getMousePosition: function(e, container) {
                        if (!container) return new L.Point(e.clientX, e.clientY);
                        var rect = container.getBoundingClientRect();
                        return new L.Point(e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop)
                    },
                    getWheelDelta: function(e) {
                        var delta = 0;
                        return e.wheelDelta && (delta = e.wheelDelta / 120), e.detail && (delta = -e.detail / 3), delta
                    },
                    _skipEvents: {},
                    _fakeStop: function(e) {
                        L.DomEvent._skipEvents[e.type] = !0
                    },
                    _skipped: function(e) {
                        var skipped = this._skipEvents[e.type];
                        return this._skipEvents[e.type] = !1, skipped
                    },
                    _checkMouse: function(el, e) {
                        var related = e.relatedTarget;
                        if (!related) return !0;
                        try {
                            for (; related && related !== el;) related = related.parentNode
                        } catch (err) {
                            return !1
                        }
                        return related !== el
                    },
                    _getEvent: function() {
                        var e = window.event;
                        if (!e)
                            for (var caller = arguments.callee.caller; caller && (e = caller.arguments[0], !e || window.Event !== e.constructor);) caller = caller.caller;
                        return e
                    },
                    _filterClick: function(e, handler) {
                        var timeStamp = e.timeStamp || e.originalEvent.timeStamp,
                            elapsed = L.DomEvent._lastClick && timeStamp - L.DomEvent._lastClick;
                        return elapsed && elapsed > 100 && 500 > elapsed || e.target._simulatedClick && !e._simulated ? void L.DomEvent.stop(e) : (L.DomEvent._lastClick = timeStamp, handler(e))
                    }
                }, L.DomEvent.on = L.DomEvent.addListener, L.DomEvent.off = L.DomEvent.removeListener, L.Draggable = L.Class.extend({
                    includes: L.Mixin.Events,
                    statics: {
                        START: L.Browser.touch ? ["touchstart", "mousedown"] : ["mousedown"],
                        END: {
                            mousedown: "mouseup",
                            touchstart: "touchend",
                            pointerdown: "touchend",
                            MSPointerDown: "touchend"
                        },
                        MOVE: {
                            mousedown: "mousemove",
                            touchstart: "touchmove",
                            pointerdown: "touchmove",
                            MSPointerDown: "touchmove"
                        }
                    },
                    initialize: function(element, dragStartTarget) {
                        this._element = element, this._dragStartTarget = dragStartTarget || element
                    },
                    enable: function() {
                        if (!this._enabled) {
                            for (var i = L.Draggable.START.length - 1; i >= 0; i--) L.DomEvent.on(this._dragStartTarget, L.Draggable.START[i], this._onDown, this);
                            this._enabled = !0
                        }
                    },
                    disable: function() {
                        if (this._enabled) {
                            for (var i = L.Draggable.START.length - 1; i >= 0; i--) L.DomEvent.off(this._dragStartTarget, L.Draggable.START[i], this._onDown, this);
                            this._enabled = !1, this._moved = !1
                        }
                    },
                    _onDown: function(e) {
                        if (this._moved = !1, !(e.shiftKey || 1 !== e.which && 1 !== e.button && !e.touches || (L.DomEvent.stopPropagation(e), L.Draggable._disabled || (L.DomUtil.disableImageDrag(), L.DomUtil.disableTextSelection(), this._moving)))) {
                            var first = e.touches ? e.touches[0] : e;
                            this._startPoint = new L.Point(first.clientX, first.clientY), this._startPos = this._newPos = L.DomUtil.getPosition(this._element), L.DomEvent.on(document, L.Draggable.MOVE[e.type], this._onMove, this).on(document, L.Draggable.END[e.type], this._onUp, this)
                        }
                    },
                    _onMove: function(e) {
                        if (e.touches && e.touches.length > 1) return void(this._moved = !0);
                        var first = e.touches && 1 === e.touches.length ? e.touches[0] : e,
                            newPoint = new L.Point(first.clientX, first.clientY),
                            offset = newPoint.subtract(this._startPoint);
                        (offset.x || offset.y) && (L.Browser.touch && Math.abs(offset.x) + Math.abs(offset.y) < 3 || (L.DomEvent.preventDefault(e), this._moved || (this.fire("dragstart"), this._moved = !0, this._startPos = L.DomUtil.getPosition(this._element).subtract(offset), L.DomUtil.addClass(document.body, "leaflet-dragging"), this._lastTarget = e.target || e.srcElement, L.DomUtil.addClass(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(offset), this._moving = !0, L.Util.cancelAnimFrame(this._animRequest), this._animRequest = L.Util.requestAnimFrame(this._updatePosition, this, !0, this._dragStartTarget)))
                    },
                    _updatePosition: function() {
                        this.fire("predrag"), L.DomUtil.setPosition(this._element, this._newPos), this.fire("drag")
                    },
                    _onUp: function() {
                        L.DomUtil.removeClass(document.body, "leaflet-dragging"), this._lastTarget && (L.DomUtil.removeClass(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null);
                        for (var i in L.Draggable.MOVE) L.DomEvent.off(document, L.Draggable.MOVE[i], this._onMove).off(document, L.Draggable.END[i], this._onUp);
                        L.DomUtil.enableImageDrag(), L.DomUtil.enableTextSelection(), this._moved && this._moving && (L.Util.cancelAnimFrame(this._animRequest), this.fire("dragend", {
                            distance: this._newPos.distanceTo(this._startPos)
                        })), this._moving = !1
                    }
                }), L.Handler = L.Class.extend({
                    initialize: function(map) {
                        this._map = map
                    },
                    enable: function() {
                        this._enabled || (this._enabled = !0, this.addHooks())
                    },
                    disable: function() {
                        this._enabled && (this._enabled = !1, this.removeHooks())
                    },
                    enabled: function() {
                        return !!this._enabled
                    }
                }), L.Map.mergeOptions({
                    dragging: !0,
                    inertia: !L.Browser.android23,
                    inertiaDeceleration: 3400,
                    inertiaMaxSpeed: 1 / 0,
                    inertiaThreshold: L.Browser.touch ? 32 : 18,
                    easeLinearity: .25,
                    worldCopyJump: !1
                }), L.Map.Drag = L.Handler.extend({
                    addHooks: function() {
                        if (!this._draggable) {
                            var map = this._map;
                            this._draggable = new L.Draggable(map._mapPane, map._container), this._draggable.on({
                                dragstart: this._onDragStart,
                                drag: this._onDrag,
                                dragend: this._onDragEnd
                            }, this), map.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDrag, this), map.on("viewreset", this._onViewReset, this), map.whenReady(this._onViewReset, this))
                        }
                        this._draggable.enable()
                    },
                    removeHooks: function() {
                        this._draggable.disable()
                    },
                    moved: function() {
                        return this._draggable && this._draggable._moved
                    },
                    _onDragStart: function() {
                        var map = this._map;
                        map._panAnim && map._panAnim.stop(), map.fire("movestart").fire("dragstart"), map.options.inertia && (this._positions = [], this._times = [])
                    },
                    _onDrag: function() {
                        if (this._map.options.inertia) {
                            var time = this._lastTime = +new Date,
                                pos = this._lastPos = this._draggable._newPos;
                            this._positions.push(pos), this._times.push(time), time - this._times[0] > 200 && (this._positions.shift(), this._times.shift())
                        }
                        this._map.fire("move").fire("drag")
                    },
                    _onViewReset: function() {
                        var pxCenter = this._map.getSize()._divideBy(2),
                            pxWorldCenter = this._map.latLngToLayerPoint([0, 0]);
                        this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x, this._worldWidth = this._map.project([0, 180]).x
                    },
                    _onPreDrag: function() {
                        var worldWidth = this._worldWidth,
                            halfWidth = Math.round(worldWidth / 2),
                            dx = this._initialWorldOffset,
                            x = this._draggable._newPos.x,
                            newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx,
                            newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx,
                            newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;
                        this._draggable._newPos.x = newX
                    },
                    _onDragEnd: function(e) {
                        var map = this._map,
                            options = map.options,
                            delay = +new Date - this._lastTime,
                            noInertia = !options.inertia || delay > options.inertiaThreshold || !this._positions[0];
                        if (map.fire("dragend", e), noInertia) map.fire("moveend");
                        else {
                            var direction = this._lastPos.subtract(this._positions[0]),
                                duration = (this._lastTime + delay - this._times[0]) / 1e3,
                                ease = options.easeLinearity,
                                speedVector = direction.multiplyBy(ease / duration),
                                speed = speedVector.distanceTo([0, 0]),
                                limitedSpeed = Math.min(options.inertiaMaxSpeed, speed),
                                limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed),
                                decelerationDuration = limitedSpeed / (options.inertiaDeceleration * ease),
                                offset = limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();
                            offset.x && offset.y ? (offset = map._limitOffset(offset, map.options.maxBounds), L.Util.requestAnimFrame(function() {
                                map.panBy(offset, {
                                    duration: decelerationDuration,
                                    easeLinearity: ease,
                                    noMoveStart: !0
                                })
                            })) : map.fire("moveend")
                        }
                    }
                }), L.Map.addInitHook("addHandler", "dragging", L.Map.Drag), L.Map.mergeOptions({
                    doubleClickZoom: !0
                }), L.Map.DoubleClickZoom = L.Handler.extend({
                    addHooks: function() {
                        this._map.on("dblclick", this._onDoubleClick, this)
                    },
                    removeHooks: function() {
                        this._map.off("dblclick", this._onDoubleClick, this)
                    },
                    _onDoubleClick: function(e) {
                        var map = this._map,
                            zoom = map.getZoom() + (e.originalEvent.shiftKey ? -1 : 1);
                        "center" === map.options.doubleClickZoom ? map.setZoom(zoom) : map.setZoomAround(e.containerPoint, zoom)
                    }
                }), L.Map.addInitHook("addHandler", "doubleClickZoom", L.Map.DoubleClickZoom), L.Map.mergeOptions({
                    scrollWheelZoom: !0
                }), L.Map.ScrollWheelZoom = L.Handler.extend({
                    addHooks: function() {
                        L.DomEvent.on(this._map._container, "mousewheel", this._onWheelScroll, this), L.DomEvent.on(this._map._container, "MozMousePixelScroll", L.DomEvent.preventDefault), this._delta = 0
                    },
                    removeHooks: function() {
                        L.DomEvent.off(this._map._container, "mousewheel", this._onWheelScroll), L.DomEvent.off(this._map._container, "MozMousePixelScroll", L.DomEvent.preventDefault)
                    },
                    _onWheelScroll: function(e) {
                        var delta = L.DomEvent.getWheelDelta(e);
                        this._delta += delta, this._lastMousePos = this._map.mouseEventToContainerPoint(e), this._startTime || (this._startTime = +new Date);
                        var left = Math.max(40 - (+new Date - this._startTime), 0);
                        clearTimeout(this._timer), this._timer = setTimeout(L.bind(this._performZoom, this), left), L.DomEvent.preventDefault(e), L.DomEvent.stopPropagation(e)
                    },
                    _performZoom: function() {
                        var map = this._map,
                            delta = this._delta,
                            zoom = map.getZoom();
                        delta = delta > 0 ? Math.ceil(delta) : Math.floor(delta), delta = Math.max(Math.min(delta, 4), -4), delta = map._limitZoom(zoom + delta) - zoom, this._delta = 0, this._startTime = null, delta && ("center" === map.options.scrollWheelZoom ? map.setZoom(zoom + delta) : map.setZoomAround(this._lastMousePos, zoom + delta))
                    }
                }), L.Map.addInitHook("addHandler", "scrollWheelZoom", L.Map.ScrollWheelZoom), L.extend(L.DomEvent, {
                    _touchstart: L.Browser.msPointer ? "MSPointerDown" : L.Browser.pointer ? "pointerdown" : "touchstart",
                    _touchend: L.Browser.msPointer ? "MSPointerUp" : L.Browser.pointer ? "pointerup" : "touchend",
                    addDoubleTapListener: function(obj, handler, id) {
                        function onTouchStart(e) {
                            var count;
                            if (L.Browser.pointer ? (trackedTouches.push(e.pointerId), count = trackedTouches.length) : count = e.touches.length, !(count > 1)) {
                                var now = Date.now(),
                                    delta = now - (last || now);
                                touch = e.touches ? e.touches[0] : e, doubleTap = delta > 0 && delay >= delta, last = now
                            }
                        }

                        function onTouchEnd(e) {
                            if (L.Browser.pointer) {
                                var idx = trackedTouches.indexOf(e.pointerId);
                                if (-1 === idx) return;
                                trackedTouches.splice(idx, 1)
                            }
                            if (doubleTap) {
                                if (L.Browser.pointer) {
                                    var prop, newTouch = {};
                                    for (var i in touch) prop = touch[i], newTouch[i] = "function" == typeof prop ? prop.bind(touch) : prop;
                                    touch = newTouch
                                }
                                touch.type = "dblclick", handler(touch), last = null
                            }
                        }
                        var last, touch, doubleTap = !1,
                            delay = 250,
                            pre = "_leaflet_",
                            touchstart = this._touchstart,
                            touchend = this._touchend,
                            trackedTouches = [];
                        obj[pre + touchstart + id] = onTouchStart, obj[pre + touchend + id] = onTouchEnd;
                        var endElement = L.Browser.pointer ? document.documentElement : obj;
                        return obj.addEventListener(touchstart, onTouchStart, !1), endElement.addEventListener(touchend, onTouchEnd, !1), L.Browser.pointer && endElement.addEventListener(L.DomEvent.POINTER_CANCEL, onTouchEnd, !1), this
                    },
                    removeDoubleTapListener: function(obj, id) {
                        var pre = "_leaflet_";
                        return obj.removeEventListener(this._touchstart, obj[pre + this._touchstart + id], !1), (L.Browser.pointer ? document.documentElement : obj).removeEventListener(this._touchend, obj[pre + this._touchend + id], !1), L.Browser.pointer && document.documentElement.removeEventListener(L.DomEvent.POINTER_CANCEL, obj[pre + this._touchend + id], !1), this
                    }
                }), L.extend(L.DomEvent, {
                    POINTER_DOWN: L.Browser.msPointer ? "MSPointerDown" : "pointerdown",
                    POINTER_MOVE: L.Browser.msPointer ? "MSPointerMove" : "pointermove",
                    POINTER_UP: L.Browser.msPointer ? "MSPointerUp" : "pointerup",
                    POINTER_CANCEL: L.Browser.msPointer ? "MSPointerCancel" : "pointercancel",
                    _pointers: [],
                    _pointerDocumentListener: !1,
                    addPointerListener: function(obj, type, handler, id) {
                        switch (type) {
                            case "touchstart":
                                return this.addPointerListenerStart(obj, type, handler, id);
                            case "touchend":
                                return this.addPointerListenerEnd(obj, type, handler, id);
                            case "touchmove":
                                return this.addPointerListenerMove(obj, type, handler, id);
                            default:
                                throw "Unknown touch event type"
                        }
                    },
                    addPointerListenerStart: function(obj, type, handler, id) {
                        var pre = "_leaflet_",
                            pointers = this._pointers,
                            cb = function(e) {
                                "mouse" !== e.pointerType && e.pointerType !== e.MSPOINTER_TYPE_MOUSE && L.DomEvent.preventDefault(e);
                                for (var alreadyInArray = !1, i = 0; i < pointers.length; i++)
                                    if (pointers[i].pointerId === e.pointerId) {
                                        alreadyInArray = !0;
                                        break
                                    }
                                alreadyInArray || pointers.push(e), e.touches = pointers.slice(), e.changedTouches = [e], handler(e)
                            };
                        if (obj[pre + "touchstart" + id] = cb, obj.addEventListener(this.POINTER_DOWN, cb, !1), !this._pointerDocumentListener) {
                            var internalCb = function(e) {
                                for (var i = 0; i < pointers.length; i++)
                                    if (pointers[i].pointerId === e.pointerId) {
                                        pointers.splice(i, 1);
                                        break
                                    }
                            };
                            document.documentElement.addEventListener(this.POINTER_UP, internalCb, !1), document.documentElement.addEventListener(this.POINTER_CANCEL, internalCb, !1), this._pointerDocumentListener = !0
                        }
                        return this
                    },
                    addPointerListenerMove: function(obj, type, handler, id) {
                        function cb(e) {
                            if (e.pointerType !== e.MSPOINTER_TYPE_MOUSE && "mouse" !== e.pointerType || 0 !== e.buttons) {
                                for (var i = 0; i < touches.length; i++)
                                    if (touches[i].pointerId === e.pointerId) {
                                        touches[i] = e;
                                        break
                                    }
                                e.touches = touches.slice(), e.changedTouches = [e], handler(e)
                            }
                        }
                        var pre = "_leaflet_",
                            touches = this._pointers;
                        return obj[pre + "touchmove" + id] = cb, obj.addEventListener(this.POINTER_MOVE, cb, !1), this
                    },
                    addPointerListenerEnd: function(obj, type, handler, id) {
                        var pre = "_leaflet_",
                            touches = this._pointers,
                            cb = function(e) {
                                for (var i = 0; i < touches.length; i++)
                                    if (touches[i].pointerId === e.pointerId) {
                                        touches.splice(i, 1);
                                        break
                                    }
                                e.touches = touches.slice(), e.changedTouches = [e], handler(e)
                            };
                        return obj[pre + "touchend" + id] = cb, obj.addEventListener(this.POINTER_UP, cb, !1), obj.addEventListener(this.POINTER_CANCEL, cb, !1), this
                    },
                    removePointerListener: function(obj, type, id) {
                        var pre = "_leaflet_",
                            cb = obj[pre + type + id];
                        switch (type) {
                            case "touchstart":
                                obj.removeEventListener(this.POINTER_DOWN, cb, !1);
                                break;
                            case "touchmove":
                                obj.removeEventListener(this.POINTER_MOVE, cb, !1);
                                break;
                            case "touchend":
                                obj.removeEventListener(this.POINTER_UP, cb, !1), obj.removeEventListener(this.POINTER_CANCEL, cb, !1)
                        }
                        return this
                    }
                }), L.Map.mergeOptions({
                    touchZoom: L.Browser.touch && !L.Browser.android23,
                    bounceAtZoomLimits: !0
                }), L.Map.TouchZoom = L.Handler.extend({
                    addHooks: function() {
                        L.DomEvent.on(this._map._container, "touchstart", this._onTouchStart, this)
                    },
                    removeHooks: function() {
                        L.DomEvent.off(this._map._container, "touchstart", this._onTouchStart, this)
                    },
                    _onTouchStart: function(e) {
                        var map = this._map;
                        if (e.touches && 2 === e.touches.length && !map._animatingZoom && !this._zooming) {
                            var p1 = map.mouseEventToLayerPoint(e.touches[0]),
                                p2 = map.mouseEventToLayerPoint(e.touches[1]),
                                viewCenter = map._getCenterLayerPoint();
                            this._startCenter = p1.add(p2)._divideBy(2), this._startDist = p1.distanceTo(p2), this._moved = !1, this._zooming = !0, this._centerOffset = viewCenter.subtract(this._startCenter), map._panAnim && map._panAnim.stop(), L.DomEvent.on(document, "touchmove", this._onTouchMove, this).on(document, "touchend", this._onTouchEnd, this), L.DomEvent.preventDefault(e)
                        }
                    },
                    _onTouchMove: function(e) {
                        var map = this._map;
                        if (e.touches && 2 === e.touches.length && this._zooming) {
                            var p1 = map.mouseEventToLayerPoint(e.touches[0]),
                                p2 = map.mouseEventToLayerPoint(e.touches[1]);
                            this._scale = p1.distanceTo(p2) / this._startDist, this._delta = p1._add(p2)._divideBy(2)._subtract(this._startCenter), 1 !== this._scale && (map.options.bounceAtZoomLimits || !(map.getZoom() === map.getMinZoom() && this._scale < 1 || map.getZoom() === map.getMaxZoom() && this._scale > 1)) && (this._moved || (L.DomUtil.addClass(map._mapPane, "leaflet-touching"), map.fire("movestart").fire("zoomstart"), this._moved = !0), L.Util.cancelAnimFrame(this._animRequest), this._animRequest = L.Util.requestAnimFrame(this._updateOnMove, this, !0, this._map._container), L.DomEvent.preventDefault(e))
                        }
                    },
                    _updateOnMove: function() {
                        var map = this._map,
                            origin = this._getScaleOrigin(),
                            center = map.layerPointToLatLng(origin),
                            zoom = map.getScaleZoom(this._scale);
                        map._animateZoom(center, zoom, this._startCenter, this._scale, this._delta, !1, !0)
                    },
                    _onTouchEnd: function() {
                        if (!this._moved || !this._zooming) return void(this._zooming = !1);
                        var map = this._map;
                        this._zooming = !1, L.DomUtil.removeClass(map._mapPane, "leaflet-touching"), L.Util.cancelAnimFrame(this._animRequest), L.DomEvent.off(document, "touchmove", this._onTouchMove).off(document, "touchend", this._onTouchEnd);
                        var origin = this._getScaleOrigin(),
                            center = map.layerPointToLatLng(origin),
                            oldZoom = map.getZoom(),
                            floatZoomDelta = map.getScaleZoom(this._scale) - oldZoom,
                            roundZoomDelta = floatZoomDelta > 0 ? Math.ceil(floatZoomDelta) : Math.floor(floatZoomDelta),
                            zoom = map._limitZoom(oldZoom + roundZoomDelta),
                            scale = map.getZoomScale(zoom) / this._scale;
                        map._animateZoom(center, zoom, origin, scale)
                    },
                    _getScaleOrigin: function() {
                        var centerOffset = this._centerOffset.subtract(this._delta).divideBy(this._scale);
                        return this._startCenter.add(centerOffset)
                    }
                }), L.Map.addInitHook("addHandler", "touchZoom", L.Map.TouchZoom), L.Map.mergeOptions({
                    tap: !0,
                    tapTolerance: 15
                }), L.Map.Tap = L.Handler.extend({
                    addHooks: function() {
                        L.DomEvent.on(this._map._container, "touchstart", this._onDown, this)
                    },
                    removeHooks: function() {
                        L.DomEvent.off(this._map._container, "touchstart", this._onDown, this)
                    },
                    _onDown: function(e) {
                        if (e.touches) {
                            if (L.DomEvent.preventDefault(e), this._fireClick = !0, e.touches.length > 1) return this._fireClick = !1, void clearTimeout(this._holdTimeout);
                            var first = e.touches[0],
                                el = first.target;
                            this._startPos = this._newPos = new L.Point(first.clientX, first.clientY), el.tagName && "a" === el.tagName.toLowerCase() && L.DomUtil.addClass(el, "leaflet-active"), this._holdTimeout = setTimeout(L.bind(function() {
                                this._isTapValid() && (this._fireClick = !1, this._onUp(), this._simulateEvent("contextmenu", first))
                            }, this), 1e3), L.DomEvent.on(document, "touchmove", this._onMove, this).on(document, "touchend", this._onUp, this)
                        }
                    },
                    _onUp: function(e) {
                        if (clearTimeout(this._holdTimeout), L.DomEvent.off(document, "touchmove", this._onMove, this).off(document, "touchend", this._onUp, this), this._fireClick && e && e.changedTouches) {
                            var first = e.changedTouches[0],
                                el = first.target;
                            el && el.tagName && "a" === el.tagName.toLowerCase() && L.DomUtil.removeClass(el, "leaflet-active"), this._isTapValid() && this._simulateEvent("click", first)
                        }
                    },
                    _isTapValid: function() {
                        return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance
                    },
                    _onMove: function(e) {
                        var first = e.touches[0];
                        this._newPos = new L.Point(first.clientX, first.clientY)
                    },
                    _simulateEvent: function(type, e) {
                        var simulatedEvent = document.createEvent("MouseEvents");
                        simulatedEvent._simulated = !0, e.target._simulatedClick = !0, simulatedEvent.initMouseEvent(type, !0, !0, window, 1, e.screenX, e.screenY, e.clientX, e.clientY, !1, !1, !1, !1, 0, null), e.target.dispatchEvent(simulatedEvent)
                    }
                }), L.Browser.touch && !L.Browser.pointer && L.Map.addInitHook("addHandler", "tap", L.Map.Tap), L.Map.mergeOptions({
                    boxZoom: !0
                }), L.Map.BoxZoom = L.Handler.extend({
                    initialize: function(map) {
                        this._map = map, this._container = map._container, this._pane = map._panes.overlayPane, this._moved = !1
                    },
                    addHooks: function() {
                        L.DomEvent.on(this._container, "mousedown", this._onMouseDown, this)
                    },
                    removeHooks: function() {
                        L.DomEvent.off(this._container, "mousedown", this._onMouseDown), this._moved = !1
                    },
                    moved: function() {
                        return this._moved
                    },
                    _onMouseDown: function(e) {
                        return this._moved = !1, !e.shiftKey || 1 !== e.which && 1 !== e.button ? !1 : (L.DomUtil.disableTextSelection(), L.DomUtil.disableImageDrag(), this._startLayerPoint = this._map.mouseEventToLayerPoint(e), void L.DomEvent.on(document, "mousemove", this._onMouseMove, this).on(document, "mouseup", this._onMouseUp, this).on(document, "keydown", this._onKeyDown, this))
                    },
                    _onMouseMove: function(e) {
                        this._moved || (this._box = L.DomUtil.create("div", "leaflet-zoom-box", this._pane), L.DomUtil.setPosition(this._box, this._startLayerPoint), this._container.style.cursor = "crosshair", this._map.fire("boxzoomstart"));
                        var startPoint = this._startLayerPoint,
                            box = this._box,
                            layerPoint = this._map.mouseEventToLayerPoint(e),
                            offset = layerPoint.subtract(startPoint),
                            newPos = new L.Point(Math.min(layerPoint.x, startPoint.x), Math.min(layerPoint.y, startPoint.y));
                        L.DomUtil.setPosition(box, newPos), this._moved = !0, box.style.width = Math.max(0, Math.abs(offset.x) - 4) + "px", box.style.height = Math.max(0, Math.abs(offset.y) - 4) + "px"
                    },
                    _finish: function() {
                        this._moved && (this._pane.removeChild(this._box), this._container.style.cursor = ""), L.DomUtil.enableTextSelection(), L.DomUtil.enableImageDrag(), L.DomEvent.off(document, "mousemove", this._onMouseMove).off(document, "mouseup", this._onMouseUp).off(document, "keydown", this._onKeyDown)
                    },
                    _onMouseUp: function(e) {
                        this._finish();
                        var map = this._map,
                            layerPoint = map.mouseEventToLayerPoint(e);
                        if (!this._startLayerPoint.equals(layerPoint)) {
                            var bounds = new L.LatLngBounds(map.layerPointToLatLng(this._startLayerPoint), map.layerPointToLatLng(layerPoint));
                            map.fitBounds(bounds), map.fire("boxzoomend", {
                                boxZoomBounds: bounds
                            })
                        }
                    },
                    _onKeyDown: function(e) {
                        27 === e.keyCode && this._finish()
                    }
                }), L.Map.addInitHook("addHandler", "boxZoom", L.Map.BoxZoom), L.Map.mergeOptions({
                    keyboard: !0,
                    keyboardPanOffset: 80,
                    keyboardZoomOffset: 1
                }), L.Map.Keyboard = L.Handler.extend({
                    keyCodes: {
                        left: [37],
                        right: [39],
                        down: [40],
                        up: [38],
                        zoomIn: [187, 107, 61, 171],
                        zoomOut: [189, 109, 173]
                    },
                    initialize: function(map) {
                        this._map = map, this._setPanOffset(map.options.keyboardPanOffset), this._setZoomOffset(map.options.keyboardZoomOffset)
                    },
                    addHooks: function() {
                        var container = this._map._container; - 1 === container.tabIndex && (container.tabIndex = "0"), L.DomEvent.on(container, "focus", this._onFocus, this).on(container, "blur", this._onBlur, this).on(container, "mousedown", this._onMouseDown, this), this._map.on("focus", this._addHooks, this).on("blur", this._removeHooks, this)
                    },
                    removeHooks: function() {
                        this._removeHooks();
                        var container = this._map._container;
                        L.DomEvent.off(container, "focus", this._onFocus, this).off(container, "blur", this._onBlur, this).off(container, "mousedown", this._onMouseDown, this), this._map.off("focus", this._addHooks, this).off("blur", this._removeHooks, this)
                    },
                    _onMouseDown: function() {
                        if (!this._focused) {
                            var body = document.body,
                                docEl = document.documentElement,
                                top = body.scrollTop || docEl.scrollTop,
                                left = body.scrollLeft || docEl.scrollLeft;
                            this._map._container.focus(), window.scrollTo(left, top)
                        }
                    },
                    _onFocus: function() {
                        this._focused = !0, this._map.fire("focus")
                    },
                    _onBlur: function() {
                        this._focused = !1, this._map.fire("blur")
                    },
                    _setPanOffset: function(pan) {
                        var i, len, keys = this._panKeys = {},
                            codes = this.keyCodes;
                        for (i = 0, len = codes.left.length; len > i; i++) keys[codes.left[i]] = [-1 * pan, 0];
                        for (i = 0, len = codes.right.length; len > i; i++) keys[codes.right[i]] = [pan, 0];
                        for (i = 0, len = codes.down.length; len > i; i++) keys[codes.down[i]] = [0, pan];
                        for (i = 0, len = codes.up.length; len > i; i++) keys[codes.up[i]] = [0, -1 * pan]
                    },
                    _setZoomOffset: function(zoom) {
                        var i, len, keys = this._zoomKeys = {},
                            codes = this.keyCodes;
                        for (i = 0, len = codes.zoomIn.length; len > i; i++) keys[codes.zoomIn[i]] = zoom;
                        for (i = 0, len = codes.zoomOut.length; len > i; i++) keys[codes.zoomOut[i]] = -zoom
                    },
                    _addHooks: function() {
                        L.DomEvent.on(document, "keydown", this._onKeyDown, this)
                    },
                    _removeHooks: function() {
                        L.DomEvent.off(document, "keydown", this._onKeyDown, this)
                    },
                    _onKeyDown: function(e) {
                        var key = e.keyCode,
                            map = this._map;
                        if (key in this._panKeys) {
                            if (map._panAnim && map._panAnim._inProgress) return;
                            map.panBy(this._panKeys[key]), map.options.maxBounds && map.panInsideBounds(map.options.maxBounds)
                        } else {
                            if (!(key in this._zoomKeys)) return;
                            map.setZoom(map.getZoom() + this._zoomKeys[key])
                        }
                        L.DomEvent.stop(e)
                    }
                }), L.Map.addInitHook("addHandler", "keyboard", L.Map.Keyboard), L.Handler.MarkerDrag = L.Handler.extend({
                    initialize: function(marker) {
                        this._marker = marker
                    },
                    addHooks: function() {
                        var icon = this._marker._icon;
                        this._draggable || (this._draggable = new L.Draggable(icon, icon)), this._draggable.on("dragstart", this._onDragStart, this).on("drag", this._onDrag, this).on("dragend", this._onDragEnd, this), this._draggable.enable(), L.DomUtil.addClass(this._marker._icon, "leaflet-marker-draggable")
                    },
                    removeHooks: function() {
                        this._draggable.off("dragstart", this._onDragStart, this).off("drag", this._onDrag, this).off("dragend", this._onDragEnd, this), this._draggable.disable(), L.DomUtil.removeClass(this._marker._icon, "leaflet-marker-draggable")
                    },
                    moved: function() {
                        return this._draggable && this._draggable._moved
                    },
                    _onDragStart: function() {
                        this._marker.closePopup().fire("movestart").fire("dragstart")
                    },
                    _onDrag: function() {
                        var marker = this._marker,
                            shadow = marker._shadow,
                            iconPos = L.DomUtil.getPosition(marker._icon),
                            latlng = marker._map.layerPointToLatLng(iconPos);
                        shadow && L.DomUtil.setPosition(shadow, iconPos), marker._latlng = latlng, marker.fire("move", {
                            latlng: latlng
                        }).fire("drag")
                    },
                    _onDragEnd: function(e) {
                        this._marker.fire("moveend").fire("dragend", e)
                    }
                }), L.Control = L.Class.extend({
                    options: {
                        position: "topright"
                    },
                    initialize: function(options) {
                        L.setOptions(this, options)
                    },
                    getPosition: function() {
                        return this.options.position
                    },
                    setPosition: function(position) {
                        var map = this._map;

                        return map && map.removeControl(this), this.options.position = position, map && map.addControl(this), this
                    },
                    getContainer: function() {
                        return this._container
                    },
                    addTo: function(map) {
                        this._map = map;
                        var container = this._container = this.onAdd(map),
                            pos = this.getPosition(),
                            corner = map._controlCorners[pos];
                        return L.DomUtil.addClass(container, "leaflet-control"), -1 !== pos.indexOf("bottom") ? corner.insertBefore(container, corner.firstChild) : corner.appendChild(container), this
                    },
                    removeFrom: function(map) {
                        var pos = this.getPosition(),
                            corner = map._controlCorners[pos];
                        return corner.removeChild(this._container), this._map = null, this.onRemove && this.onRemove(map), this
                    },
                    _refocusOnMap: function() {
                        this._map && this._map.getContainer().focus()
                    }
                }), L.control = function(options) {
                    return new L.Control(options)
                }, L.Map.include({
                    addControl: function(control) {
                        return control.addTo(this), this
                    },
                    removeControl: function(control) {
                        return control.removeFrom(this), this
                    },
                    _initControlPos: function() {
                        function createCorner(vSide, hSide) {
                            var className = l + vSide + " " + l + hSide;
                            corners[vSide + hSide] = L.DomUtil.create("div", className, container)
                        }
                        var corners = this._controlCorners = {},
                            l = "leaflet-",
                            container = this._controlContainer = L.DomUtil.create("div", l + "control-container", this._container);
                        createCorner("top", "left"), createCorner("top", "right"), createCorner("bottom", "left"), createCorner("bottom", "right")
                    },
                    _clearControlPos: function() {
                        this._container.removeChild(this._controlContainer)
                    }
                }), L.Control.Zoom = L.Control.extend({
                    options: {
                        position: "bottomright",
                        zoomInText: "+",
                        zoomInTitle: "Zoom in",
                        zoomOutText: "-",
                        zoomOutTitle: "Zoom out"
                    },
                    onAdd: function(map) {
                        var zoomName = "leaflet-control-zoom",
                            container = L.DomUtil.create("div", zoomName + " leaflet-bar");
                        return this._map = map, this._zoomInButton = this._createButton(this.options.zoomInText, this.options.zoomInTitle, zoomName + "-in", container, this._zoomIn, this), this._zoomOutButton = this._createButton(this.options.zoomOutText, this.options.zoomOutTitle, zoomName + "-out", container, this._zoomOut, this), this._updateDisabled(), map.on("zoomend zoomlevelschange", this._updateDisabled, this), container
                    },
                    onRemove: function(map) {
                        map.off("zoomend zoomlevelschange", this._updateDisabled, this)
                    },
                    _zoomIn: function(e) {
                        this._map.zoomIn(e.shiftKey ? 3 : 1)
                    },
                    _zoomOut: function(e) {
                        this._map.zoomOut(e.shiftKey ? 3 : 1)
                    },
                    _createButton: function(html, title, className, container, fn, context) {
                        var link = L.DomUtil.create("a", className, container);
                        link.innerHTML = html, link.href = "#", link.title = title;
                        var stop = L.DomEvent.stopPropagation;
                        return L.DomEvent.on(link, "click", stop).on(link, "mousedown", stop).on(link, "dblclick", stop).on(link, "click", L.DomEvent.preventDefault).on(link, "click", fn, context).on(link, "click", this._refocusOnMap, context), link
                    },
                    _updateDisabled: function() {
                        var map = this._map,
                            className = "leaflet-disabled";
                        L.DomUtil.removeClass(this._zoomInButton, className), L.DomUtil.removeClass(this._zoomOutButton, className), map._zoom === map.getMinZoom() && L.DomUtil.addClass(this._zoomOutButton, className), map._zoom === map.getMaxZoom() && L.DomUtil.addClass(this._zoomInButton, className)
                    }
                }), L.Map.mergeOptions({
                    zoomControl: !0
                }), L.Map.addInitHook(function() {
                    this.options.zoomControl && (this.zoomControl = new L.Control.Zoom, this.addControl(this.zoomControl))
                }), L.control.zoom = function(options) {
                    return new L.Control.Zoom(options)
                }, L.Control.Attribution = L.Control.extend({
                    options: {
                        position: "bottomleft",
                        prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
                    },
                    initialize: function(options) {
                        L.setOptions(this, options), this._attributions = {}
                    },
                    onAdd: function(map) {
                        this._container = L.DomUtil.create("div", "leaflet-control-attribution"), L.DomEvent.disableClickPropagation(this._container);
                        for (var i in map._layers) map._layers[i].getAttribution && this.addAttribution(map._layers[i].getAttribution());
                        return map.on("layeradd", this._onLayerAdd, this).on("layerremove", this._onLayerRemove, this), this._update(), this._container
                    },
                    onRemove: function(map) {
                        map.off("layeradd", this._onLayerAdd).off("layerremove", this._onLayerRemove)
                    },
                    setPrefix: function(prefix) {
                        return this.options.prefix = prefix, this._update(), this
                    },
                    addAttribution: function(text) {
                        return text ? (this._attributions[text] || (this._attributions[text] = 0), this._attributions[text]++, this._update(), this) : void 0
                    },
                    removeAttribution: function(text) {
                        return text ? (this._attributions[text] && (this._attributions[text]--, this._update()), this) : void 0
                    },
                    _update: function() {
                        if (this._map) {
                            var attribs = [];
                            for (var i in this._attributions) this._attributions[i] && attribs.push(i);
                            var prefixAndAttribs = [];
                            this.options.prefix && prefixAndAttribs.push(this.options.prefix), attribs.length && prefixAndAttribs.push(attribs.join(", ")), this._container.innerHTML = prefixAndAttribs.join(" | ")
                        }
                    },
                    _onLayerAdd: function(e) {
                        e.layer.getAttribution && this.addAttribution(e.layer.getAttribution())
                    },
                    _onLayerRemove: function(e) {
                        e.layer.getAttribution && this.removeAttribution(e.layer.getAttribution())
                    }
                }), L.Map.mergeOptions({
                    attributionControl: !0
                }), L.Map.addInitHook(function() {
                    this.options.attributionControl && (this.attributionControl = (new L.Control.Attribution).addTo(this))
                }), L.control.attribution = function(options) {
                    return new L.Control.Attribution(options)
                }, L.Control.Scale = L.Control.extend({
                    options: {
                        position: "bottomleft",
                        maxWidth: 100,
                        metric: !0,
                        imperial: !0,
                        updateWhenIdle: !1
                    },
                    onAdd: function(map) {
                        this._map = map;
                        var className = "leaflet-control-scale",
                            container = L.DomUtil.create("div", className),
                            options = this.options;
                        return this._addScales(options, className, container), map.on(options.updateWhenIdle ? "moveend" : "move", this._update, this), map.whenReady(this._update, this), container
                    },
                    onRemove: function(map) {
                        map.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this)
                    },
                    _addScales: function(options, className, container) {
                        options.metric && (this._mScale = L.DomUtil.create("div", className + "-line", container)), options.imperial && (this._iScale = L.DomUtil.create("div", className + "-line", container))
                    },
                    _update: function() {
                        var bounds = this._map.getBounds(),
                            centerLat = bounds.getCenter().lat,
                            halfWorldMeters = 6378137 * Math.PI * Math.cos(centerLat * Math.PI / 180),
                            dist = halfWorldMeters * (bounds.getNorthEast().lng - bounds.getSouthWest().lng) / 180,
                            size = this._map.getSize(),
                            options = this.options,
                            maxMeters = 0;
                        size.x > 0 && (maxMeters = dist * (options.maxWidth / size.x)), this._updateScales(options, maxMeters)
                    },
                    _updateScales: function(options, maxMeters) {
                        options.metric && maxMeters && this._updateMetric(maxMeters), options.imperial && maxMeters && this._updateImperial(maxMeters)
                    },
                    _updateMetric: function(maxMeters) {
                        var meters = this._getRoundNum(maxMeters);
                        this._mScale.style.width = this._getScaleWidth(meters / maxMeters) + "px", this._mScale.innerHTML = 1e3 > meters ? meters + " m" : meters / 1e3 + " km"
                    },
                    _updateImperial: function(maxMeters) {
                        var maxMiles, miles, feet, maxFeet = 3.2808399 * maxMeters,
                            scale = this._iScale;
                        maxFeet > 5280 ? (maxMiles = maxFeet / 5280, miles = this._getRoundNum(maxMiles), scale.style.width = this._getScaleWidth(miles / maxMiles) + "px", scale.innerHTML = miles + " mi") : (feet = this._getRoundNum(maxFeet), scale.style.width = this._getScaleWidth(feet / maxFeet) + "px", scale.innerHTML = feet + " ft")
                    },
                    _getScaleWidth: function(ratio) {
                        return Math.round(this.options.maxWidth * ratio) - 10
                    },
                    _getRoundNum: function(num) {
                        var pow10 = Math.pow(10, (Math.floor(num) + "").length - 1),
                            d = num / pow10;
                        return d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1, pow10 * d
                    }
                }), L.control.scale = function(options) {
                    return new L.Control.Scale(options)
                }, L.Control.Layers = L.Control.extend({
                    options: {
                        collapsed: !0,
                        position: "topright",
                        autoZIndex: !0
                    },
                    initialize: function(baseLayers, overlays, options) {
                        L.setOptions(this, options), this._layers = {}, this._lastZIndex = 0, this._handlingClick = !1;
                        for (var i in baseLayers) this._addLayer(baseLayers[i], i);
                        for (i in overlays) this._addLayer(overlays[i], i, !0)
                    },
                    onAdd: function(map) {
                        return this._initLayout(), this._update(), map.on("layeradd", this._onLayerChange, this).on("layerremove", this._onLayerChange, this), this._container
                    },
                    onRemove: function(map) {
                        map.off("layeradd", this._onLayerChange, this).off("layerremove", this._onLayerChange, this)
                    },
                    addBaseLayer: function(layer, name) {
                        return this._addLayer(layer, name), this._update(), this
                    },
                    addOverlay: function(layer, name) {
                        return this._addLayer(layer, name, !0), this._update(), this
                    },
                    removeLayer: function(layer) {
                        var id = L.stamp(layer);
                        return delete this._layers[id], this._update(), this
                    },
                    _initLayout: function() {
                        var className = "leaflet-control-layers",
                            container = this._container = L.DomUtil.create("div", className);
                        container.setAttribute("aria-haspopup", !0), L.Browser.touch ? L.DomEvent.on(container, "click", L.DomEvent.stopPropagation) : L.DomEvent.disableClickPropagation(container).disableScrollPropagation(container);
                        var form = this._form = L.DomUtil.create("form", className + "-list");
                        if (this.options.collapsed) {
                            L.Browser.android || L.DomEvent.on(container, "mouseover", this._expand, this).on(container, "mouseout", this._collapse, this);
                            var link = this._layersLink = L.DomUtil.create("a", className + "-toggle", container);
                            link.href = "#", link.title = "Layers", L.Browser.touch ? L.DomEvent.on(link, "click", L.DomEvent.stop).on(link, "click", this._expand, this) : L.DomEvent.on(link, "focus", this._expand, this), L.DomEvent.on(form, "click", function() {
                                setTimeout(L.bind(this._onInputClick, this), 0)
                            }, this), this._map.on("click", this._collapse, this)
                        } else this._expand();
                        this._baseLayersList = L.DomUtil.create("div", className + "-base", form), this._separator = L.DomUtil.create("div", className + "-separator", form), this._overlaysList = L.DomUtil.create("div", className + "-overlays", form), container.appendChild(form)
                    },
                    _addLayer: function(layer, name, overlay) {
                        var id = L.stamp(layer);
                        this._layers[id] = {
                            layer: layer,
                            name: name,
                            overlay: overlay
                        }, this.options.autoZIndex && layer.setZIndex && (this._lastZIndex++, layer.setZIndex(this._lastZIndex))
                    },
                    _update: function() {
                        if (this._container) {
                            this._baseLayersList.innerHTML = "", this._overlaysList.innerHTML = "";
                            var i, obj, baseLayersPresent = !1,
                                overlaysPresent = !1;
                            for (i in this._layers) obj = this._layers[i], this._addItem(obj), overlaysPresent = overlaysPresent || obj.overlay, baseLayersPresent = baseLayersPresent || !obj.overlay;
                            this._separator.style.display = overlaysPresent && baseLayersPresent ? "" : "none"
                        }
                    },
                    _onLayerChange: function(e) {
                        var obj = this._layers[L.stamp(e.layer)];
                        if (obj) {
                            this._handlingClick || this._update();
                            var type = obj.overlay ? "layeradd" === e.type ? "overlayadd" : "overlayremove" : "layeradd" === e.type ? "baselayerchange" : null;
                            type && this._map.fire(type, obj)
                        }
                    },
                    _createRadioElement: function(name, checked) {
                        var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' + name + '"';
                        checked && (radioHtml += ' checked="checked"'), radioHtml += "/>";
                        var radioFragment = document.createElement("div");
                        return radioFragment.innerHTML = radioHtml, radioFragment.firstChild
                    },
                    _addItem: function(obj) {
                        var input, label = document.createElement("label"),
                            checked = this._map.hasLayer(obj.layer);
                        obj.overlay ? (input = document.createElement("input"), input.type = "checkbox", input.className = "leaflet-control-layers-selector", input.defaultChecked = checked) : input = this._createRadioElement("leaflet-base-layers", checked), input.layerId = L.stamp(obj.layer), L.DomEvent.on(input, "click", this._onInputClick, this);
                        var name = document.createElement("span");
                        name.innerHTML = " " + obj.name, label.appendChild(input), label.appendChild(name);
                        var container = obj.overlay ? this._overlaysList : this._baseLayersList;
                        return container.appendChild(label), label
                    },
                    _onInputClick: function() {
                        var i, input, obj, inputs = this._form.getElementsByTagName("input"),
                            inputsLen = inputs.length;
                        for (this._handlingClick = !0, i = 0; inputsLen > i; i++) input = inputs[i], obj = this._layers[input.layerId], input.checked && !this._map.hasLayer(obj.layer) ? this._map.addLayer(obj.layer) : !input.checked && this._map.hasLayer(obj.layer) && this._map.removeLayer(obj.layer);
                        this._handlingClick = !1, this._refocusOnMap()
                    },
                    _expand: function() {
                        L.DomUtil.addClass(this._container, "leaflet-control-layers-expanded")
                    },
                    _collapse: function() {
                        this._container.className = this._container.className.replace(" leaflet-control-layers-expanded", "")
                    }
                }), L.control.layers = function(baseLayers, overlays, options) {
                    return new L.Control.Layers(baseLayers, overlays, options)
                }, L.PosAnimation = L.Class.extend({
                    includes: L.Mixin.Events,
                    run: function(el, newPos, duration, easeLinearity) {
                        this.stop(), this._el = el, this._inProgress = !0, this._newPos = newPos, this.fire("start"), el.style[L.DomUtil.TRANSITION] = "all " + (duration || .25) + "s cubic-bezier(0,0," + (easeLinearity || .5) + ",1)", L.DomEvent.on(el, L.DomUtil.TRANSITION_END, this._onTransitionEnd, this), L.DomUtil.setPosition(el, newPos), L.Util.falseFn(el.offsetWidth), this._stepTimer = setInterval(L.bind(this._onStep, this), 50)
                    },
                    stop: function() {
                        this._inProgress && (L.DomUtil.setPosition(this._el, this._getPos()), this._onTransitionEnd(), L.Util.falseFn(this._el.offsetWidth))
                    },
                    _onStep: function() {
                        var stepPos = this._getPos();
                        return stepPos ? (this._el._leaflet_pos = stepPos, void this.fire("step")) : void this._onTransitionEnd()
                    },
                    _transformRe: /([-+]?(?:\d*\.)?\d+)\D*, ([-+]?(?:\d*\.)?\d+)\D*\)/,
                    _getPos: function() {
                        var left, top, matches, el = this._el,
                            style = window.getComputedStyle(el);
                        if (L.Browser.any3d) {
                            if (matches = style[L.DomUtil.TRANSFORM].match(this._transformRe), !matches) return;
                            left = parseFloat(matches[1]), top = parseFloat(matches[2])
                        } else left = parseFloat(style.left), top = parseFloat(style.top);
                        return new L.Point(left, top, !0)
                    },
                    _onTransitionEnd: function() {
                        L.DomEvent.off(this._el, L.DomUtil.TRANSITION_END, this._onTransitionEnd, this), this._inProgress && (this._inProgress = !1, this._el.style[L.DomUtil.TRANSITION] = "", this._el._leaflet_pos = this._newPos, clearInterval(this._stepTimer), this.fire("step").fire("end"))
                    }
                }), L.Map.include({
                    setView: function(center, zoom, options) {
                        if (zoom = zoom === undefined ? this._zoom : this._limitZoom(zoom), center = this._limitCenter(L.latLng(center), zoom, this.options.maxBounds), options = options || {}, this._panAnim && this._panAnim.stop(), this._loaded && !options.reset && options !== !0) {
                            options.animate !== undefined && (options.zoom = L.extend({
                                animate: options.animate
                            }, options.zoom), options.pan = L.extend({
                                animate: options.animate
                            }, options.pan));
                            var animated = this._zoom !== zoom ? this._tryAnimatedZoom && this._tryAnimatedZoom(center, zoom, options.zoom) : this._tryAnimatedPan(center, options.pan);
                            if (animated) return clearTimeout(this._sizeTimer), this
                        }
                        return this._resetView(center, zoom), this
                    },
                    panBy: function(offset, options) {
                        if (offset = L.point(offset).round(), options = options || {}, !offset.x && !offset.y) return this;
                        if (this._panAnim || (this._panAnim = new L.PosAnimation, this._panAnim.on({
                                step: this._onPanTransitionStep,
                                end: this._onPanTransitionEnd
                            }, this)), options.noMoveStart || this.fire("movestart"), options.animate !== !1) {
                            L.DomUtil.addClass(this._mapPane, "leaflet-pan-anim");
                            var newPos = this._getMapPanePos().subtract(offset);
                            this._panAnim.run(this._mapPane, newPos, options.duration || .25, options.easeLinearity)
                        } else this._rawPanBy(offset), this.fire("move").fire("moveend");
                        return this
                    },
                    _onPanTransitionStep: function() {
                        this.fire("move")
                    },
                    _onPanTransitionEnd: function() {
                        L.DomUtil.removeClass(this._mapPane, "leaflet-pan-anim"), this.fire("moveend")
                    },
                    _tryAnimatedPan: function(center, options) {
                        var offset = this._getCenterOffset(center)._floor();
                        return (options && options.animate) === !0 || this.getSize().contains(offset) ? (this.panBy(offset, options), !0) : !1
                    }
                }), L.PosAnimation = L.DomUtil.TRANSITION ? L.PosAnimation : L.PosAnimation.extend({
                    run: function(el, newPos, duration, easeLinearity) {
                        this.stop(), this._el = el, this._inProgress = !0, this._duration = duration || .25, this._easeOutPower = 1 / Math.max(easeLinearity || .5, .2), this._startPos = L.DomUtil.getPosition(el), this._offset = newPos.subtract(this._startPos), this._startTime = +new Date, this.fire("start"), this._animate()
                    },
                    stop: function() {
                        this._inProgress && (this._step(), this._complete())
                    },
                    _animate: function() {
                        this._animId = L.Util.requestAnimFrame(this._animate, this), this._step()
                    },
                    _step: function() {
                        var elapsed = +new Date - this._startTime,
                            duration = 1e3 * this._duration;
                        duration > elapsed ? this._runFrame(this._easeOut(elapsed / duration)) : (this._runFrame(1), this._complete())
                    },
                    _runFrame: function(progress) {
                        var pos = this._startPos.add(this._offset.multiplyBy(progress));
                        L.DomUtil.setPosition(this._el, pos), this.fire("step")
                    },
                    _complete: function() {
                        L.Util.cancelAnimFrame(this._animId), this._inProgress = !1, this.fire("end")
                    },
                    _easeOut: function(t) {
                        return 1 - Math.pow(1 - t, this._easeOutPower)
                    }
                }), L.Map.mergeOptions({
                    zoomAnimation: !0,
                    zoomAnimationThreshold: 4
                }), L.DomUtil.TRANSITION && L.Map.addInitHook(function() {
                    this._zoomAnimated = this.options.zoomAnimation && L.DomUtil.TRANSITION && L.Browser.any3d && !L.Browser.android23 && !L.Browser.mobileOpera, this._zoomAnimated && L.DomEvent.on(this._mapPane, L.DomUtil.TRANSITION_END, this._catchTransitionEnd, this)
                }), L.Map.include(L.DomUtil.TRANSITION ? {
                    _catchTransitionEnd: function(e) {
                        this._animatingZoom && e.propertyName.indexOf("transform") >= 0 && this._onZoomTransitionEnd()
                    },
                    _nothingToAnimate: function() {
                        return !this._container.getElementsByClassName("leaflet-zoom-animated").length
                    },
                    _tryAnimatedZoom: function(center, zoom, options) {
                        if (this._animatingZoom) return !0;
                        if (options = options || {}, !this._zoomAnimated || options.animate === !1 || this._nothingToAnimate() || Math.abs(zoom - this._zoom) > this.options.zoomAnimationThreshold) return !1;
                        var scale = this.getZoomScale(zoom),
                            offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale),
                            origin = this._getCenterLayerPoint()._add(offset);
                        return options.animate === !0 || this.getSize().contains(offset) ? (this.fire("movestart").fire("zoomstart"), this._animateZoom(center, zoom, origin, scale, null, !0), !0) : !1
                    },
                    _animateZoom: function(center, zoom, origin, scale, delta, backwards, forTouchZoom) {
                        forTouchZoom || (this._animatingZoom = !0), L.DomUtil.addClass(this._mapPane, "leaflet-zoom-anim"), this._animateToCenter = center, this._animateToZoom = zoom, L.Draggable && (L.Draggable._disabled = !0), L.Util.requestAnimFrame(function() {
                            this.fire("zoomanim", {
                                center: center,
                                zoom: zoom,
                                origin: origin,
                                scale: scale,
                                delta: delta,
                                backwards: backwards
                            }), setTimeout(L.bind(this._onZoomTransitionEnd, this), 250)
                        }, this)
                    },
                    _onZoomTransitionEnd: function() {
                        this._animatingZoom && (this._animatingZoom = !1, L.DomUtil.removeClass(this._mapPane, "leaflet-zoom-anim"), L.Util.requestAnimFrame(function() {
                            this._resetView(this._animateToCenter, this._animateToZoom, !0, !0), L.Draggable && (L.Draggable._disabled = !1)
                        }, this))
                    }
                } : {}), L.TileLayer.include({
                    _animateZoom: function(e) {
                        this._animating || (this._animating = !0, this._prepareBgBuffer());
                        var bg = this._bgBuffer,
                            transform = L.DomUtil.TRANSFORM,
                            initialTransform = e.delta ? L.DomUtil.getTranslateString(e.delta) : bg.style[transform],
                            scaleStr = L.DomUtil.getScaleString(e.scale, e.origin);
                        bg.style[transform] = e.backwards ? scaleStr + " " + initialTransform : initialTransform + " " + scaleStr
                    },
                    _endZoomAnim: function() {
                        var front = this._tileContainer,
                            bg = this._bgBuffer;
                        front.style.visibility = "", front.parentNode.appendChild(front), L.Util.falseFn(bg.offsetWidth);
                        var zoom = this._map.getZoom();
                        (zoom > this.options.maxZoom || zoom < this.options.minZoom) && this._clearBgBuffer(), this._animating = !1
                    },
                    _clearBgBuffer: function() {
                        var map = this._map;
                        !map || map._animatingZoom || map.touchZoom._zooming || (this._bgBuffer.innerHTML = "", this._bgBuffer.style[L.DomUtil.TRANSFORM] = "")
                    },
                    _prepareBgBuffer: function() {
                        var front = this._tileContainer,
                            bg = this._bgBuffer,
                            bgLoaded = this._getLoadedTilesPercentage(bg),
                            frontLoaded = this._getLoadedTilesPercentage(front);
                        return bg && bgLoaded > .5 && .5 > frontLoaded ? (front.style.visibility = "hidden", void this._stopLoadingImages(front)) : (bg.style.visibility = "hidden", bg.style[L.DomUtil.TRANSFORM] = "", this._tileContainer = bg, bg = this._bgBuffer = front, this._stopLoadingImages(bg), void clearTimeout(this._clearBgBufferTimer))
                    },
                    _getLoadedTilesPercentage: function(container) {
                        var i, len, tiles = container.getElementsByTagName("img"),
                            count = 0;
                        for (i = 0, len = tiles.length; len > i; i++) tiles[i].complete && count++;
                        return count / len
                    },
                    _stopLoadingImages: function(container) {
                        var i, len, tile, tiles = Array.prototype.slice.call(container.getElementsByTagName("img"));
                        for (i = 0, len = tiles.length; len > i; i++) tile = tiles[i], tile.complete || (tile.onload = L.Util.falseFn, tile.onerror = L.Util.falseFn, tile.src = L.Util.emptyImageUrl, tile.parentNode.removeChild(tile))
                    }
                }), L.Map.include({
                    _defaultLocateOptions: {
                        watch: !1,
                        setView: !1,
                        maxZoom: 1 / 0,
                        timeout: 1e4,
                        maximumAge: 0,
                        enableHighAccuracy: !1
                    },
                    locate: function(options) {
                        if (options = this._locateOptions = L.extend(this._defaultLocateOptions, options), !navigator.geolocation) return this._handleGeolocationError({
                            code: 0,
                            message: "Geolocation not supported."
                        }), this;
                        var onResponse = L.bind(this._handleGeolocationResponse, this),
                            onError = L.bind(this._handleGeolocationError, this);
                        return options.watch ? this._locationWatchId = navigator.geolocation.watchPosition(onResponse, onError, options) : navigator.geolocation.getCurrentPosition(onResponse, onError, options), this
                    },
                    stopLocate: function() {
                        return navigator.geolocation && navigator.geolocation.clearWatch(this._locationWatchId), this._locateOptions && (this._locateOptions.setView = !1), this
                    },
                    _handleGeolocationError: function(error) {
                        var c = error.code,
                            message = error.message || (1 === c ? "permission denied" : 2 === c ? "position unavailable" : "timeout");
                        this._locateOptions.setView && !this._loaded && this.fitWorld(), this.fire("locationerror", {
                            code: c,
                            message: "Geolocation error: " + message + "."
                        })
                    },
                    _handleGeolocationResponse: function(pos) {
                        var lat = pos.coords.latitude,
                            lng = pos.coords.longitude,
                            latlng = new L.LatLng(lat, lng),
                            latAccuracy = 180 * pos.coords.accuracy / 40075017,
                            lngAccuracy = latAccuracy / Math.cos(L.LatLng.DEG_TO_RAD * lat),
                            bounds = L.latLngBounds([lat - latAccuracy, lng - lngAccuracy], [lat + latAccuracy, lng + lngAccuracy]),
                            options = this._locateOptions;
                        if (options.setView) {
                            var zoom = Math.min(this.getBoundsZoom(bounds), options.maxZoom);
                            this.setView(latlng, zoom)
                        }
                        var data = {
                            latlng: latlng,
                            bounds: bounds,
                            timestamp: pos.timestamp
                        };
                        for (var i in pos.coords) "number" == typeof pos.coords[i] && (data[i] = pos.coords[i]);
                        this.fire("locationfound", data)
                    }
                })
        }(window, document)
    }, {}],
    2: [function(require, module) {
        var style = {
            BubbleWrap: "https://mapzen.com/carto/bubble-wrap-style/4/bubble-wrap.yaml",
            Cinnabar: "https://mapzen.com/carto/cinnabar-style/3/cinnabar-style.yaml",
            CinnabarMoreLabels: "https://mapzen.com/carto/cinnabar-style-more-labels/3/cinnabar-style-more-labels.yaml",
            CinnabarNoLabels: "https://mapzen.com/carto/cinnabar-style-no-labels/3/cinnabar-style-no-labels.yaml",
            Refill: "https://mapzen.com/carto/refill-style/3/refill-style.yaml",
            RefillMoreLabels: "https://mapzen.com/carto/refill-style-more-labels/3/refill-style-more-labels.yaml",
            RefillNoLabels: "https://mapzen.com/carto/refill-style-no-labels/3/refill-style-no-labels.yaml",
            Zinc: "https://mapzen.com/carto/zinc-style/3/zinc-style.yaml",
            ZincMoreLabels: "https://mapzen.com/carto/zinc-style-more-labels/3/zinc-style-more-labels.yaml",
            ZincNoLabels: "https://mapzen.com/carto/zinc-style-no-labels/3/zinc-style-no-labels.yaml",
            Walkabout: "https://mapzen.com/carto/walkabout-style/1/walkabout-style.yaml",
            WalkaboutMoreLabels: "https://mapzen.com/carto/walkabout-style-more-labels/1/walkabout-style-more-labels.yaml",
            WalkaboutNoLabels: "https://mapzen.com/carto/walkabout-style-no-labels/1/walkabout-style-no-labels.yaml"
        };
        module.exports = style
    }, {}],
    3: [function(require, module) {
        var MapzenBug = function() {
            "use strict";

            function e(e, n, t, o) {
                return p.analytics !== !1 && "undefined" != typeof ga && void ga("send", "event", h, e, n, t, o)
            }

            function n() {
                ! function(e, n, t, o, i, a, c) {
                    e.GoogleAnalyticsObject = i, e[i] = e[i] || function() {
                        (e[i].q = e[i].q || []).push(arguments)
                    }, e[i].l = 1 * new Date, a = n.createElement(t), c = n.getElementsByTagName(t)[0], a.async = 1, a.src = o, c.parentNode.insertBefore(a, c)
                }(window, document, "script", "//www.google-analytics.com/analytics.js", "ga"), ga("create", f, "auto"), ga("send", "pageview")
            }

            function t(e, n, t, o) {
                var i = void 0 !== window.screenLeft ? window.screenLeft : window.screen.left,
                    a = void 0 !== window.screenTop ? window.screenTop : window.screen.top,
                    c = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width,
                    r = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height,
                    l = c / 2 - t / 2 + i,
                    d = r / 3 - o / 3 + a,
                    s = window.open(e, n, "scrollbars=yes, width=" + t + ", height=" + o + ", top=" + d + ", left=" + l);
                window.focus && s.focus()
            }

            function o() {
                var e, n, t = "https://twitter.com/intent/tweet",
                    o = encodeURIComponent(window.location.href);
                return e = encodeURIComponent(p.tweet ? p.tweet : p.name ? p.name + ", powered by @mapzen" : "Check out this project by @mapzen!"), n = "?text=" + e + "&url=" + o, t + n
            }

            function i() {
                var e = "https://www.facebook.com/sharer/sharer.php?u=",
                    n = encodeURIComponent(window.location.href);
                return e + n
            }

            function a() {
                var e = p.link || w,
                    n = p.name ? p.name + " Â· Powered by Mapzen" : "Powered by Mapzen",
                    t = p.repo || m,
                    a = document.createElement("div");
                a.id = "mz-bug", a.className = "mz-bug-container", a.setAttribute("role", "widget");
                var h = r("mapzen", e, n, l),
                    f = r("twitter", o(), "Share this on Twitter", d),
                    g = r("facebook", i(), "Share this on Facebook", s),
                    b = r("github", t, "View source on GitHub", u);
                return a.appendChild(h), a.appendChild(f), a.appendChild(g), a.appendChild(b), c(a), a
            }

            function c(e) {
                if (p.mapID) {
                    var n = document.getElementById(p.mapID),
                        t = window.getComputedStyle(n, null).getPropertyValue("position");
                    "relative" !== t ? console.log("Appending MPZN bug to not relatively positioned element can make display problem.") : n.appendChild(e)
                } else document.body.appendChild(e)
            }

            function r(e, n, t, o) {
                var i = document.createElement("a"),
                    a = document.createElement("div");
                return a.className = "mz-bug-" + e + "-logo", i.href = n, i.target = "_blank", i.className = "mz-bug-" + e + "-link", i.title = t, i.addEventListener("click", o), i.appendChild(a), i
            }

            function l() {
                e("click", "mapzen logo", p.name)
            }

            function d(n) {
                n.preventDefault();
                var i = o();
                t(i, "Twitter", 580, 470), e("click", "twitter", p.name)
            }

            function s(n) {
                n.preventDefault();
                var o = i();
                t(o, "Facebook", 580, 470), e("click", "facebook", p.name)
            }

            function u() {
                e("click", "github", p.name)
            }
            var p, w = window.location.href,
                m = "https://github.com/mapzen/mapzen.js",
                h = "mapzen.js scarab",
                f = "UA-47035811-1",
                g = function(t) {
                    return this instanceof g ? window.self === window.top && (this.setOptions(t), this.el = a(), this.twitterEl = this.el.querySelector(".mz-bug-twitter-link"), this.facebookEl = this.el.querySelector(".mz-bug-facebook-link"), this.rebuildLinks(), window.onhashchange = function() {
                        this.rebuildLinks()
                    }.bind(this), void window.setTimeout(function() {
                        "undefined" == typeof ga && (n(), e("analytics", "fallback", null, !0)), e("bug", "active", p.name, !0)
                    }, 0)) : new g(t)
                };
            return g.prototype.rebuildLinks = function() {
                this.twitterEl.href = o(), this.facebookEl.href = i()
            }, g.prototype.hide = function() {
                this.el.style.display = "none"
            }, g.prototype.show = function() {
                this.el.style.display = "block"
            }, g.prototype.setOptions = function(e) {
                if (p = p || {
                        analytics: !0,
                        name: null
                    }, "object" == typeof e)
                    for (var n in e) p[n] = e[n];
                this.opts = p
            }, g
        }();
        module.exports = MapzenBug
    }, {}],
    4: [function(require, module) {
        "use strict";
        var L = require("leaflet"),
            Hash = L.Class.extend({
                _hashData: {},
                _changing: !1,
                _map: null,
                _geocoder: null,
                initialize: function(t) {
                    t.map && (this._map = t.map, this._startMapEvents()), t.geocoder && (this._geocoder = t.geocoder, this._startGeocoderEvents()), this._setupHash(), L.DomEvent.on(window, "onhashchange", this._setupHash, this)
                },
                _setupHash: function() {
                    var t = Formatter.parseHashToObj(window.location.hash);
                    this._hashData = t, this._hashData ? this._hashData.place ? (this._hashData.place = decodeURIComponent(this._hashData.place), this._geocoder.place(this._hashData.place)) : this._hashData.lat && this._hashData.lng && this._hashData.z && (this._changing = !0, this._map && this._map.setView([this._hashData.lat, this._hashData.lng], this._hashData.z), this._changing = !1) : (this._hashData = {}, this._map && (this._updateLatLng(), this._updateZoom()))
                },
                _startMapEvents: function() {
                    L.DomEvent.on(this._map, "moveend", this._updateLatLng, this), L.DomEvent.on(this._map, "zoomend", this._updateZoom, this)
                },
                _startGeocoderEvents: function() {
                    L.DomEvent.on(this._geocoder, "select", this._updatePlace, this), L.DomEvent.on(this._geocoder, "reset", this._resetPlace, this)
                },
                _updateLatLng: function() {
                    if (!this._changing) {
                        var t = this._map.getCenter(),
                            a = this._map.getZoom(),
                            e = this._precision(a),
                            h = t.lat.toFixed(e),
                            s = t.lng.toFixed(e);
                        this._hashData.lat = h, this._hashData.lng = s, this._updateHash()
                    }
                },
                _updateZoom: function() {
                    if (!this._changing) {
                        var t = this._map.getZoom();
                        this._hashData.z = t, this._updateHash()
                    }
                },
                _updatePlace: function(t) {
                    this._hashData.place = t.feature.properties.gid, this._updateHash()
                },
                _reset: function() {
                    this.hashData = {}, history.replaceState({}, document.title, ".")
                },
                _resetCoords: function() {
                    this._hashData = Formatter.deleteProperty(this._hashData, "lat"), this._hashData = Formatter.deleteProperty(this._hashData, "lng"), this._hashData = Formatter.deleteProperty(this._hashData, "z"), this._updateHash()
                },
                _resetPlace: function() {
                    this._hashData = Formatter.deleteProperty(this._hashData, "place"), this._updateHash()
                },
                _updateHash: function() {
                    var t = Formatter.formatToHash(this._hashData);
                    window.history.replaceState({}, null, "#" + t)
                },
                _precision: function(t) {
                    return Math.max(0, Math.ceil(Math.log(t) / Math.LN2))
                }
            }),
            Formatter = {
                parseHashToObj: function(t) {
                    var a = {};
                    if (this.isEmpty(t)) return null;
                    var e = t.replace("#", ""),
                        h = e.split("&");
                    for (var s in h) {
                        var i = h[s].split("=");
                        a[i[0]] = i[1]
                    }
                    return a
                },
                isEmpty: function(t) {
                    return 0 === t.length || !t
                },
                deleteProperty: function(t, a) {
                    var e = {};
                    for (var h in t) h !== a && (e[h] = t[h]);
                    return e
                },
                formatToHash: function(t) {
                    var a = [];
                    for (var e in t) null !== t[e] && "undefined" != typeof t[e] || (t[e] = ""), t.hasOwnProperty(e) && a.push(encodeURIComponent(e) + "=" + encodeURIComponent(t[e]));
                    return a.join("&")
                }
            };
        module.exports = Hash, module.exports.hash = function(t) {
            return new Hash(t)
        }
    }, {
        leaflet: 1
    }],
    5: [function(require, module) {
        var L = require("leaflet"),
            Locator = L.Control.extend({
                options: {
                    position: "topleft",
                    layer: void 0,
                    setView: "untilPan",
                    keepCurrentZoomLevel: !1,
                    flyTo: !1,
                    clickBehavior: {
                        inView: "stop",
                        outOfView: "setView"
                    },
                    returnToPrevBounds: !1,
                    drawCircle: !0,
                    drawMarker: !0,
                    markerClass: L.CircleMarker,
                    circleStyle: {
                        color: "#136AEC",
                        fillColor: "#136AEC",
                        fillOpacity: .15,
                        weight: 2,
                        opacity: .5
                    },
                    markerStyle: {
                        color: "#136AEC",
                        fillColor: "#2A93EE",
                        fillOpacity: .7,
                        weight: 2,
                        opacity: .9,
                        radius: 5
                    },
                    followCircleStyle: {},
                    followMarkerStyle: {},
                    icon: "fa fa-map-marker",
                    iconLoading: "fa fa-spinner fa-spin",
                    iconElementTag: "span",
                    circlePadding: [0, 0],
                    metric: !0,
                    onLocationError: function(t) {
                        alert(t.message)
                    },
                    onLocationOutsideMapBounds: function(t) {
                        t.stop(), alert(t.options.strings.outsideMapBoundsMsg)
                    },
                    showPopup: !0,
                    strings: {
                        title: "Show me where I am",
                        metersUnit: "meters",
                        feetUnit: "feet",
                        popup: "You are within {distance} {unit} from this point",
                        outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
                    },
                    locateOptions: {
                        maxZoom: 1 / 0,
                        watch: !0,
                        setView: !1
                    }
                },
                initialize: function(t) {
                    for (var i in t) "object" == typeof this.options[i] ? L.extend(this.options[i], t[i]) : this.options[i] = t[i];
                    this.options.followMarkerStyle = L.extend({}, this.options.markerStyle, this.options.followMarkerStyle), this.options.followCircleStyle = L.extend({}, this.options.circleStyle, this.options.followCircleStyle)
                },
                onAdd: function(t) {
                    var i = L.DomUtil.create("div", "leaflet-control-locate leaflet-bar leaflet-control");
                    return this._layer = this.options.layer || new L.LayerGroup, this._layer.addTo(t), this._event = void 0, this._prevBounds = null, this._link = L.DomUtil.create("a", "leaflet-bar-part leaflet-bar-part-single", i), this._link.href = "#", this._link.title = this.options.strings.title, this._icon = L.DomUtil.create(this.options.iconElementTag, this.options.icon, this._link), L.DomEvent.on(this._link, "click", L.DomEvent.stopPropagation).on(this._link, "click", L.DomEvent.preventDefault).on(this._link, "click", this._onClick, this).on(this._link, "dblclick", L.DomEvent.stopPropagation), this._resetVariables(), this._map.on("unload", this._unload, this), i
                },
                _onClick: function() {
                    if (this._justClicked = !0, this._userPanned = !1, this._active && !this._event) this.stop();
                    else if (this._active && void 0 !== this._event) {
                        var t = this._map.getBounds().contains(this._event.latlng) ? this.options.clickBehavior.inView : this.options.clickBehavior.outOfView;
                        switch (t) {
                            case "setView":
                                this.setView();
                                break;
                            case "stop":
                                if (this.stop(), this.options.returnToPrevBounds) {
                                    var i = this.options.flyTo ? this._map.flyToBounds : this._map.fitBounds;
                                    i.bind(this._map)(this._prevBounds)
                                }
                        }
                    } else this.options.returnToPrevBounds && (this._prevBounds = this._map.getBounds()), this.start();
                    this._updateContainerStyle()
                },
                start: function() {
                    this._activate(), this._event && (this._drawMarker(this._map), this.options.setView && this.setView()), this._updateContainerStyle()
                },
                stop: function() {
                    this._deactivate(), this._cleanClasses(), this._resetVariables(), this._removeMarker()
                },
                _activate: function() {
                    this._active || (this._map.locate(this.options.locateOptions), this._active = !0, this._map.on("locationfound", this._onLocationFound, this), this._map.on("locationerror", this._onLocationError, this), this._map.on("dragstart", this._onDrag, this))
                },
                _deactivate: function() {
                    this._map.stopLocate(), this._active = !1, this._map.off("locationfound", this._onLocationFound, this), this._map.off("locationerror", this._onLocationError, this), this._map.off("dragstart", this._onDrag, this)
                },
                setView: function() {
                    if (this._drawMarker(), this._isOutsideMapBounds()) this.options.onLocationOutsideMapBounds(this);
                    else if (this.options.keepCurrentZoomLevel) {
                        var t = this.options.flyTo ? this._map.flyTo : this._map.panTo;
                        t.bind(this._map)([this._event.latitude, this._event.longitude])
                    } else {
                        var t = this.options.flyTo ? this._map.flyToBounds : this._map.fitBounds;
                        t.bind(this._map)(this._event.bounds, {
                            padding: this.options.circlePadding,
                            maxZoom: this.options.locateOptions.maxZoom
                        })
                    }
                },
                _drawMarker: function() {
                    void 0 === this._event.accuracy && (this._event.accuracy = 0);
                    var t = this._event.accuracy,
                        i = this._event.latlng;
                    if (this.options.drawCircle) {
                        var s = this._isFollowing() ? this.options.followCircleStyle : this.options.circleStyle;
                        this._circle ? this._circle.setLatLng(i).setRadius(t).setStyle(s) : this._circle = L.circle(i, t, s).addTo(this._layer)
                    }
                    var o, e;
                    if (this.options.metric ? (o = t.toFixed(0), e = this.options.strings.metersUnit) : (o = (3.2808399 * t).toFixed(0), e = this.options.strings.feetUnit), this.options.drawMarker) {
                        var n = this._isFollowing() ? this.options.followMarkerStyle : this.options.markerStyle;
                        this._marker ? this._marker.setLatLng(i).setStyle(n) : this._marker = new this.options.markerClass(i, n).addTo(this._layer)
                    }
                    var a = this.options.strings.popup;
                    this.options.showPopup && a && this._marker && this._marker.bindPopup(L.Util.template(a, {
                        distance: o,
                        unit: e
                    }))._popup.setLatLng(i)
                },
                _removeMarker: function() {
                    this._layer.clearLayers(), this._marker = void 0, this._circle = void 0
                },
                _unload: function() {
                    this.stop(), this._map.off("unload", this._unload, this)
                },
                _onLocationError: function(t) {
                    3 === t.code && this.options.locateOptions.watch || (this.stop(), this.options.onLocationError(t, this))
                },
                _onLocationFound: function(t) {
                    if ((!this._event || this._event.latlng.lat !== t.latlng.lat || this._event.latlng.lng !== t.latlng.lng || this._event.accuracy !== t.accuracy) && this._active) {
                        switch (this._event = t, this._drawMarker(), this._updateContainerStyle(), this.options.setView) {
                            case "once":
                                this._justClicked && this.setView();
                                break;
                            case "untilPan":
                                this._userPanned || this.setView();
                                break;
                            case "always":
                                this.setView();
                                break;
                            case !1:
                        }
                        this._justClicked = !1
                    }
                },
                _onDrag: function() {
                    this._event && (this._userPanned = !0, this._updateContainerStyle(), this._drawMarker())
                },
                _isFollowing: function() {
                    return !!this._active && ("always" === this.options.setView || ("untilPan" === this.options.setView ? !this._userPanned : void 0))
                },
                _isOutsideMapBounds: function() {
                    return void 0 !== this._event && this._map.options.maxBounds && !this._map.options.maxBounds.contains(this._event.latlng)
                },
                _updateContainerStyle: function() {
                    this._container && (this._active && !this._event ? this._setClasses("requesting") : this._isFollowing() ? this._setClasses("following") : this._active ? this._setClasses("active") : this._cleanClasses())
                },
                _setClasses: function(t) {
                    "requesting" === t ? (L.DomUtil.removeClasses(this._container, "active following"), L.DomUtil.addClasses(this._container, "requesting"), L.DomUtil.removeClasses(this._icon, this.options.icon), L.DomUtil.addClasses(this._icon, this.options.iconLoading)) : "active" === t ? (L.DomUtil.removeClasses(this._container, "requesting following"), L.DomUtil.addClasses(this._container, "active"), L.DomUtil.removeClasses(this._icon, this.options.iconLoading), L.DomUtil.addClasses(this._icon, this.options.icon)) : "following" === t && (L.DomUtil.removeClasses(this._container, "requesting"), L.DomUtil.addClasses(this._container, "active following"), L.DomUtil.removeClasses(this._icon, this.options.iconLoading), L.DomUtil.addClasses(this._icon, this.options.icon))
                },
                _cleanClasses: function() {
                    L.DomUtil.removeClass(this._container, "requesting"), L.DomUtil.removeClass(this._container, "active"), L.DomUtil.removeClass(this._container, "following"), L.DomUtil.removeClasses(this._icon, this.options.iconLoading), L.DomUtil.addClasses(this._icon, this.options.icon)
                },
                _resetVariables: function() {
                    this._active = !1, this._justClicked = !1, this._userPanned = !1
                }
            });
        ! function() {
            var t = function(t, i, s) {
                s = s.split(" "), s.forEach(function(s) {
                    L.DomUtil[t].call(this, i, s)
                })
            };
            L.DomUtil.addClasses = function(i, s) {
                t("addClass", i, s)
            }, L.DomUtil.removeClasses = function(i, s) {
                t("removeClass", i, s)
            }
        }(), module.exports = Locator, module.exports.locator = function() {
            var t = new Locator({
                drawCircle: !1,
                follow: !1,
                showPopup: !1,
                drawMarker: !1,
                markerStyle: {
                    opacity: 0
                },
                strings: {
                    title: "Get current location"
                },
                icon: "mz-geolocator-icon",
                iconLoading: "mz-geolocator-icon mz-geolocator-active leaflet-pelias-search-icon leaflet-pelias-loading"
            });
            return t
        }
    }, {
        leaflet: 1
    }],
    6: [function(require, module) {
        "use strict";
        var L = require("leaflet"),
            MapControl = L.Map.extend({
                includes: L.Mixin.Events,
                options: {
                    attribution: '<a href="https://mapzen.com">Mapzen</a> - <a href="https://www.mapzen.com/rights">Attribution</a>, Data ©<a href="https://openstreetmap.org/copyright">OSM</a> contributors',
                    _useTangram: !0
                },
                initialize: function(t, o) {
                    if (L.Map.prototype.initialize.call(this, t, L.extend({}, L.Map.prototype.options, o)), this.options._useTangram) {
                        var i = L.Mapzen._tangram();
                        i.addTo(this);
                        var n = this;
                        i.on("loaded", function(t) {
                            n.fire("tangramloaded", {
                                tangramLayer: t.layer
                            })
                        })
                    }
                    if (this.attributionControl) {
                        this.attributionControl.setPrefix("");
                        var a = this.options.attributionText || this.options.attribution;
                        this.attributionControl.addAttribution(a), this.attributionControl.addAttribution('<a href="http://leafletjs.com/">Leaflet</a>')
                    }
                    this._checkConditions(!1)
                },
                _checkConditions: function(t) {
                    if (this._isThisIframed()) {
                        this.scrollWheelZoom.disable();
                        for (var o = document.querySelectorAll("a"), i = 0, n = o.length; n > i; i++) {
                            var a = o[i];
                            (!a.target || t === !0 && "_blank" === a.target) && (a.target = "_top")
                        }
                    }
                    "ontouchstart" in window && this._disableZoomControl()
                },
                _isThisIframed: function() {
                    return window.self !== window.top
                },
                _disableZoomControl: function() {
                    this.zoomControl._container.style.display = "none"
                }
            });
        module.exports = MapControl, module.exports.map = function(t, o) {
            return new MapControl(t, o)
        }
    }, {
        leaflet: 1
    }],
    7: [function(require, module) {
        "use strict";

        function throttle(e, t, s) {
            var i, o, a, l = null,
                n = 0;
            s || (s = {});
            var r = function() {
                n = s.leading === !1 ? 0 : (new Date).getTime(), l = null, a = e.apply(i, o), l || (i = o = null)
            };
            return function() {
                var h = (new Date).getTime();
                n || s.leading !== !1 || (n = h);
                var c = t - (h - n);
                return i = this, o = arguments, 0 >= c || c > t ? (l && (clearTimeout(l), l = null), n = h, a = e.apply(i, o), l || (i = o = null)) : l || s.trailing === !1 || (l = setTimeout(r, c)), a
            }
        }

        function escapeRegExp(e) {
            return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
        }
        var L = require("leaflet"),
            MINIMUM_INPUT_LENGTH_FOR_AUTOCOMPLETE = 1,
            FULL_WIDTH_MARGIN = 20,
            FULL_WIDTH_TOUCH_ADJUSTED_MARGIN = 4,
            RESULTS_HEIGHT_MARGIN = 20,
            API_RATE_LIMIT = 250,
            Geocoder = L.Control.extend({
                version: "1.6.2",
                includes: L.Mixin.Events,
                options: {
                    position: "topright",
                    url: "https://search.mapzen.com/v1",
                    placeholder: "Search",
                    title: "Search",
                    bounds: !1,
                    focus: !0,
                    layers: null,
                    panToPoint: !0,
                    pointIcon: !0,
                    polygonIcon: !0,
                    fullWidth: 650,
                    markers: !0,
                    expanded: !0,
                    autocomplete: !0,
                    place: !1,
                    collapsible: !0
                },
                initialize: function(e, t) {
                    window.XDomainRequest && (this.options.url = "//search.mapzen.com/v1"), "object" == typeof e && e ? t = e : this.apiKey = e, t && "undefined" != typeof t.latlng && ("undefined" == typeof t.focus && (t.focus = t.latlng), console.log("[leaflet-geocoder-mapzen] DEPRECATION WARNING:", "As of v1.6.0, the `latlng` option is deprecated. It has been renamed to `focus`. `latlng` will be removed in a future version.")), L.Util.setOptions(this, t), this.marker, this.markers = []
                },
                getLayers: function(e) {
                    var t = this.options.layers;
                    return t ? (e.layers = t, e) : e
                },
                getBoundingBoxParam: function(e) {
                    function t(e, t) {
                        return e["boundary.rect.min_lon"] = t.getWest(), e["boundary.rect.min_lat"] = t.getSouth(), e["boundary.rect.max_lon"] = t.getEast(), e["boundary.rect.max_lat"] = t.getNorth(), e
                    }
                    var s = this.options.bounds;
                    if (!s) return e;
                    if (s === !0) s = this._map.getBounds(), e = t(e, s);
                    else if ("object" == typeof s && s.isValid && s.isValid()) e = t(e, s);
                    else if (L.Util.isArray(s)) {
                        var i = L.latLngBounds(s);
                        i.isValid && i.isValid() && (e = t(e, i))
                    }
                    return e
                },
                getFocusParam: function(e) {
                    var t = this.options.focus;
                    if (!t) return e;
                    if (t === !0) {
                        var s = this._map.getCenter();
                        e["focus.point.lat"] = s.lat, e["focus.point.lon"] = s.lng
                    } else if ("object" == typeof t) {
                        var i = L.latLng(t);
                        e["focus.point.lat"] = i.lat, e["focus.point.lon"] = i.lng
                    }
                    return e
                },
                getParams: function(e) {
                    e = e || {}, e = this.getBoundingBoxParam(e), e = this.getFocusParam(e), e = this.getLayers(e), this.apiKey && (e.api_key = this.apiKey);
                    var t = this.options.params;
                    if (!t) return e;
                    if ("object" == typeof t)
                        for (var s in t) e[s] = t[s];
                    return e
                },
                search: function(e) {
                    if (e) {
                        var t = this.options.url + "/search",
                            s = {
                                text: e
                            };
                        this.callPelias(t, s, "search")
                    }
                },
                autocomplete: throttle(function(e) {
                    if (e) {
                        var t = this.options.url + "/autocomplete",
                            s = {
                                text: e
                            };
                        this.callPelias(t, s, "autocomplete")
                    }
                }, API_RATE_LIMIT),
                place: function(e) {
                    if (e) {
                        var t = this.options.url + "/place",
                            s = {
                                ids: e
                            };
                        this.callPelias(t, s, "place")
                    }
                },
                handlePlaceResponse: function(e) {
                    this._input.value = e.features[0].properties.label, this.showMarker(e.features[0].properties.label, e.features[0].geometry.coordinates.reverse())
                },
                maxReqTimestampRendered: (new Date).getTime(),
                callPelias: function(e, t, s) {
                    t = this.getParams(t), L.DomUtil.addClass(this._search, "leaflet-pelias-loading");
                    var i = (new Date).getTime();
                    AJAX.request(e, t, function(o, a) {
                        if (L.DomUtil.removeClass(this._search, "leaflet-pelias-loading"), o) {
                            var l;
                            switch (o.code) {
                                case 403:
                                    l = "A valid API key is needed for this search feature.";
                                    break;
                                case 404:
                                    l = "The search service cannot be found. :-(";
                                    break;
                                case 408:
                                    l = "The search service took too long to respond. Try again in a second.";
                                    break;
                                case 429:
                                    l = "There were too many requests. Try again in a second.";
                                    break;
                                case 500:
                                    l = "The search service is not working right now. Please try again later.";
                                    break;
                                case 502:
                                    l = "Connection lost. Please try again later.";
                                    break;
                                default:
                                    l = "The search service is having problems :-("
                            }
                            this.showMessage(l), this.fire("error", {
                                results: a,
                                endpoint: e,
                                requestType: s,
                                params: t,
                                errorCode: o.code,
                                errorMessage: l
                            })
                        }
                        if (a && a.geocoding && a.geocoding.errors) return l = a.geocoding.errors[0], this.showMessage(l), void this.fire("error", {
                            results: a,
                            endpoint: e,
                            requestType: s,
                            params: t,
                            errorCode: o.code,
                            errorMessage: l
                        });
                        if (a && a.features) {
                            if ("autocomplete" === s || "search" === s) {
                                if ("" === this._input.value || this.maxReqTimestampRendered >= i) return;
                                this.maxReqTimestampRendered = i
                            }
                            "place" === s && this.handlePlaceResponse(a), "autocomplete" !== s && "search" !== s || this.showResults(a.features, t.text), this.fire("results", {
                                results: a,
                                endpoint: e,
                                requestType: s,
                                params: t
                            })
                        }
                    }, this)
                },
                highlight: function(e, t) {
                    var s = RegExp("(" + escapeRegExp(t) + ")", "gi");
                    return e.replace(s, "<strong>$1</strong>")
                },
                getIconType: function(e) {
                    var t = this.options.pointIcon,
                        s = this.options.polygonIcon,
                        i = "leaflet-pelias-layer-icon-";
                    return e.match("venue") || e.match("address") ? t === !0 ? {
                        type: "class",
                        value: i + "point"
                    } : t !== !1 && {
                        type: "image",
                        value: t
                    } : s === !0 ? {
                        type: "class",
                        value: i + "polygon"
                    } : s !== !1 && {
                        type: "image",
                        value: s
                    }
                },
                showResults: function(e, t) {
                    if (0 === e.length) return void this.showMessage("No results were found.");
                    var s = this._results;
                    s.innerHTML = "", s.style.display = "block", s.style.maxHeight = this._map.getSize().y - s.offsetTop - this._container.offsetTop - RESULTS_HEIGHT_MARGIN + "px";
                    for (var i = L.DomUtil.create("ul", "leaflet-pelias-list", s), o = 0, a = e.length; a > o; o++) {
                        var l = e[o],
                            n = L.DomUtil.create("li", "leaflet-pelias-result", i);
                        n.feature = l, n.layer = l.properties.layer, n.coords = l.geometry.coordinates;
                        var r = this.getIconType(l.properties.layer);
                        if (r) {
                            var h, c = L.DomUtil.create("span", "leaflet-pelias-layer-icon-container", n);
                            "class" === r.type ? h = L.DomUtil.create("div", "leaflet-pelias-layer-icon " + r.value, c) : (h = L.DomUtil.create("img", "leaflet-pelias-layer-icon", c), h.src = r.value), h.title = "layer: " + l.properties.layer
                        }
                        n.innerHTML += this.highlight(l.properties.label, t)
                    }
                },
                showMessage: function(e) {
                    var t = this._results;
                    t.innerHTML = "", t.style.display = "block";
                    var s = L.DomUtil.create("div", "leaflet-pelias-message", t);
                    s.appendChild(document.createTextNode(e))
                },
                removeMarkers: function() {
                    if (this.options.markers) {
                        for (var e = 0; e < this.markers.length; e++) this._map.removeLayer(this.markers[e]);
                        this.markers = []
                    }
                },
                showMarker: function(e, t) {
                    this._map.setView(t, this._map.getZoom() || 8);
                    var s = "object" == typeof this.options.markers ? this.options.markers : {};
                    this.options.markers && (this.marker = new L.marker(t, s).bindPopup(e), this._map.addLayer(this.marker), this.markers.push(this.marker), this.marker.openPopup())
                },
                fitBoundingBox: function(e) {
                    this._map.fitBounds([
                        [e[1], e[0]],
                        [e[3], e[2]]
                    ], {
                        animate: !0,
                        maxZoom: 16
                    })
                },
                setSelectedResult: function(e, t) {
                    var s = L.GeoJSON.coordsToLatLng(e.feature.geometry.coordinates);
                    this._input.value = e.innerText || e.textContent, e.feature.bbox ? (this.removeMarkers(), this.fitBoundingBox(e.feature.bbox)) : (this.removeMarkers(), this.showMarker(e.innerHTML, s)), this.fire("select", {
                        originalEvent: t,
                        latlng: s,
                        feature: e.feature
                    }), this.blur(), this.options.place && this.place(e.feature.properties.gid)
                },
                resetInput: function() {
                    this._input.value = "", L.DomUtil.addClass(this._reset, "leaflet-pelias-hidden"), this.removeMarkers(), this._input.focus(), this.fire("reset")
                },
                focus: function() {
                    L.DomUtil.hasClass(this._container, "leaflet-pelias-expanded") || this.expand(), this._input.focus()
                },
                blur: function() {
                    this._input.blur(), this.clearResults(), "" === this._input.value && "none" !== this._results.style.display && (L.DomUtil.addClass(this._reset, "leaflet-pelias-hidden"), this.options.expanded || this.collapse())
                },
                clearResults: function(e) {
                    this._results.style.display = "none", "" !== this._input.value && e !== !0 || (this._results.innerHTML = "")
                },
                expand: function() {
                    L.DomUtil.addClass(this._container, "leaflet-pelias-expanded"), this.setFullWidth(), this.fire("expand")
                },
                collapse: function() {
                    L.DomUtil.removeClass(this._container, "leaflet-pelias-expanded"), this._input.blur(), this.clearFullWidth(), this.clearResults(), this.fire("collapse")
                },
                setFullWidth: function() {
                    if (this.options.fullWidth) {
                        this._map.invalidateSize();
                        var e = this._map.getSize().x,
                            t = L.Browser.touch ? FULL_WIDTH_TOUCH_ADJUSTED_MARGIN : 0,
                            s = e - FULL_WIDTH_MARGIN - t;
                        if ("number" == typeof this.options.fullWidth && e >= window.parseInt(this.options.fullWidth, 10)) return void this.clearFullWidth();
                        this._container.style.width = s.toString() + "px"
                    }
                },
                clearFullWidth: function() {
                    this.options.fullWidth && (this._container.style.width = "")
                },
                onAdd: function(e) {
                    var t = L.DomUtil.create("div", "leaflet-pelias-control leaflet-bar leaflet-control");
                    return this._body = document.body || document.getElementsByTagName("body")[0], this._container = t, this._input = L.DomUtil.create("input", "leaflet-pelias-input", this._container), this._input.spellcheck = !1, this.options.title && (this._input.title = this.options.title), this.options.placeholder && (this._input.placeholder = this.options.placeholder), this._search = L.DomUtil.create("a", "leaflet-pelias-search-icon", this._container), this._reset = L.DomUtil.create("div", "leaflet-pelias-close leaflet-pelias-hidden", this._container), this._reset.innerHTML = "Ã—", this._reset.title = "Reset", this._results = L.DomUtil.create("div", "leaflet-pelias-results leaflet-bar", this._container), this.options.expanded && this.expand(), this.options.collapsible && this._checkResize(), L.DomEvent.on(window, "resize", function() {
                        this._checkResize()
                    }, this).on(this._container, "click", function() {
                        this._input.focus()
                    }, this).on(this._input, "focus", function() {
                        this._input.value && this._results.children.length && (this._results.style.display = "block")
                    }, this).on(this._map, "click", function() {
                        this.blur()
                    }, this).on(this._search, "click", function(e) {
                        if (L.DomEvent.stopPropagation(e), L.DomUtil.hasClass(this._container, "leaflet-pelias-expanded")) {
                            if (this.options.expanded === !0) return void this._input.focus();
                            L.DomUtil.addClass(this._reset, "leaflet-pelias-hidden"), this.collapse()
                        } else this._input.value.length > 0 && L.DomUtil.removeClass(this._reset, "leaflet-pelias-hidden"), this.expand(), this._input.focus()
                    }, this).on(this._reset, "click", function(e) {
                        this.resetInput(), this.clearResults(), L.DomEvent.stopPropagation(e)
                    }, this).on(this._input, "keydown", function(e) {
                        for (var t, s = this._results.querySelectorAll(".leaflet-pelias-result"), i = this._results.querySelectorAll(".leaflet-pelias-selected")[0], o = this, a = function(e) {
                                var t = o._results.querySelectorAll(".leaflet-pelias-selected")[0];
                                t && e && (t.feature.bbox ? (o.removeMarkers(), o.fitBoundingBox(t.feature.bbox)) : (o.removeMarkers(), o.showMarker(t.innerHTML, L.GeoJSON.coordsToLatLng(t.feature.geometry.coordinates))))
                            }, l = function() {
                                var e = o._results.querySelectorAll(".leaflet-pelias-selected")[0],
                                    t = e.getBoundingClientRect(),
                                    s = o._results.getBoundingClientRect();
                                t.bottom > s.bottom ? o._results.scrollTop = e.offsetTop + e.offsetHeight - o._results.offsetHeight : t.top < s.top && (o._results.scrollTop = e.offsetTop)
                            }, n = 0; n < s.length; n++)
                            if (s[n] === i) {
                                t = n;
                                break
                            }
                        switch (e.keyCode) {
                            case 13:
                                if (i) this.setSelectedResult(i, e);
                                else {
                                    var r = (e.target || e.srcElement).value;
                                    this.search(r)
                                }
                                L.DomEvent.preventDefault(e);
                                break;
                            case 38:
                                if (0 === s.length || "none" === this._results.style.display) return;
                                i && L.DomUtil.removeClass(i, "leaflet-pelias-selected");
                                var h = s[t - 1],
                                    c = i && h ? h : s[s.length - 1];
                                L.DomUtil.addClass(c, "leaflet-pelias-selected"), l(), a(this.options.panToPoint), this.fire("highlight", {
                                    originalEvent: e,
                                    latlng: L.GeoJSON.coordsToLatLng(c.feature.geometry.coordinates),
                                    feature: c.feature
                                }), L.DomEvent.preventDefault(e);
                                break;
                            case 40:
                                if (0 === s.length || "none" === this._results.style.display) return;
                                i && L.DomUtil.removeClass(i, "leaflet-pelias-selected");
                                var u = s[t + 1],
                                    c = i && u ? u : s[0];
                                L.DomUtil.addClass(c, "leaflet-pelias-selected"), l(), a(this.options.panToPoint), this.fire("highlight", {
                                    originalEvent: e,
                                    latlng: L.GeoJSON.coordsToLatLng(c.feature.geometry.coordinates),
                                    feature: c.feature
                                }), L.DomEvent.preventDefault(e)
                        }
                    }, this).on(this._input, "keyup", function(e) {
                        var t = e.which || e.keyCode,
                            s = (e.target || e.srcElement).value;
                        return s.length > 0 ? L.DomUtil.removeClass(this._reset, "leaflet-pelias-hidden") : L.DomUtil.addClass(this._reset, "leaflet-pelias-hidden"), 13 !== t && 38 !== t && 40 !== t ? 27 === t ? (0 !== s.length && "none" !== this._results.style.display || (this._input.blur(), !this.options.expanded && L.DomUtil.hasClass(this._container, "leaflet-pelias-expanded") && this.collapse()), this.clearResults(!0), void L.DomUtil.removeClass(this._search, "leaflet-pelias-loading")) : void(s !== this._lastValue && (this._lastValue = s, s.length >= MINIMUM_INPUT_LENGTH_FOR_AUTOCOMPLETE && this.options.autocomplete === !0 ? this.autocomplete(s) : this.clearResults(!0))) : void 0
                    }, this).on(this._results, "click", function(e) {
                        L.DomEvent.preventDefault(e), L.DomEvent.stopPropagation(e);
                        var t = this._results.querySelectorAll(".leaflet-pelias-selected")[0];
                        t && L.DomUtil.removeClass(t, "leaflet-pelias-selected");
                        var s = e.target || e.srcElement,
                            i = function() {
                                return L.DomUtil.hasClass(s, "leaflet-pelias-result") || (s = s.parentElement, s && i()), s
                            };
                        i(), s && (L.DomUtil.addClass(s, "leaflet-pelias-selected"), this.setSelectedResult(s, e))
                    }, this).on(this._results, "mouseover", function() {
                        this._scrollWheelZoomEnabled = e.scrollWheelZoom, this._scrollWheelZoomEnabled && e.scrollWheelZoom.disable()
                    }, this).on(this._results, "mouseout", function() {
                        this._scrollWheelZoomEnabled && e.scrollWheelZoom.enable()
                    }, this), this.options.fullWidth && L.DomEvent.on(window, "resize", function() {
                        L.DomUtil.hasClass(this._container, "leaflet-pelias-expanded") && this.setFullWidth()
                    }, this), L.DomEvent.on(this._map, "mousedown", this._onMapInteraction, this), L.DomEvent.on(this._map, "touchstart", this._onMapInteraction, this), L.DomEvent.disableClickPropagation(this._container), t
                },
                _onMapInteraction: function() {
                    this.blur(), this.options.expanded || !this._input.value && L.DomUtil.hasClass(this._container, "leaflet-pelias-expanded") && this.collapse()
                },
                _getViewportWidth: function() {
                    return window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width
                },
                _checkResize: function() {
                    var e, t = this._getViewportWidth();
                    t !== e && (900 > t ? L.DomUtil.hasClass(this._container, "leaflet-pelias-expanded") && (this.collapse(), L.DomEvent.on(this._map, "mousedown", this.collapse, this)) : L.DomUtil.hasClass(this._container, "leaflet-pelias-expanded") || (this.expand(), L.DomEvent.off(this._map, "mousedown", this.collapse, this)), e = t)
                }
            }),
            AJAX = {
                serialize: function(e) {
                    var t = "";
                    for (var s in e)
                        if (e.hasOwnProperty(s)) {
                            var i, o = e[s],
                                a = o.toString();
                            switch (t.length && (t += "&"), a) {
                                case "[object Array]":
                                    i = "[object Object]" === o[0].toString() ? JSON.stringify(o) : o.join(",");
                                    break;
                                case "[object Object]":
                                    i = JSON.stringify(o);
                                    break;
                                case "[object Date]":
                                    i = o.valueOf();
                                    break;
                                default:
                                    i = o
                            }
                            t += encodeURIComponent(s) + "=" + encodeURIComponent(i)
                        }
                    return t
                },
                http_request: function(e, t) {
                    return window.XDomainRequest ? this.xdr(e, t) : this.xhr(e, t)
                },
                xhr: function(e, t) {
                    var s = new XMLHttpRequest;
                    return s.onerror = function() {
                        s.onreadystatechange = L.Util.falseFn;
                        var o = {
                            code: s.status,
                            message: s.statusText
                        };
                        e.call(t, o, null)
                    }, s.onreadystatechange = function() {
                        var i, o;
                        try {
                            i = JSON.parse(s.responseText)
                        } catch (e) {
                            i = null, o = {
                                code: 500,
                                message: "Parse Error"
                            }
                        }
                        4 === s.readyState && (200 !== s.status ? (o = {
                            code: s.status,
                            message: s.statusText
                        }, e.call(t, o, i)) : (!o && i.error && (o = i.error), s.onerror = L.Util.falseFn, e.call(t, o, i)))
                    }, s
                },
                xdr: function(e, t) {
                    var s = new window.XDomainRequest;
                    return s.onerror = function() {
                        s.onload = L.Util.falseFn;
                        var o = {
                            code: 500,
                            message: "XMLHttpRequest Error"
                        };
                        e.call(t, o, null)
                    }, s.onload = function() {
                        var i, o;
                        try {
                            i = JSON.parse(s.responseText)
                        } catch (e) {
                            i = null, o = {
                                code: 500,
                                message: "Parse Error"
                            }
                        }!o && i.error && (o = i.error, i = null), s.onerror = L.Util.falseFn, e.call(t, o, i)
                    }, s
                },
                request: function(e, t, s, i) {
                    var o = this.serialize(t),
                        a = this.http_request(s, i);
                    a.open("GET", e + "?" + o), "XMLHttpRequest" === a.constructor.name && a.setRequestHeader("Accept", "application/json"), setTimeout(function() {
                        a.send(null)
                    }, 0)
                }
            };
        module.exports = Geocoder, module.exports.geocoder = function(e, t) {
            return new Geocoder(e, t)
        }
    }, {
        leaflet: 1
    }],
    8: [function(require, module) {
        var tangramLayerInstance, L = require("leaflet"),
            TangramLayer = L.Class.extend({
                includes: L.Mixin.Events,
                options: {
                    fallbackTile: L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {}),
                    tangramURL: "https://mapzen.com/tangram/0.9/tangram.min.js"
                },
                initialize: function() {
                    "undefined" == typeof Tangram && this._importScript(this.options.tangramURL)
                },
                addTo: function(e) {
                    if (this._hasWebGL()) {
                        if ("undefined" == typeof Tangram) return window.setTimeout(this.addTo.bind(this, e), 100);
                        console.log("given scene:", e.options.scene), console.log("using scene:", e.options.scene || L.Mapzen.HouseStyles.BubbleWrap);
                        var n = Tangram.leafletLayer({
                                scene: e.options.scene || L.Mapzen.HouseStyles.BubbleWrap
                            }).addTo(e),
                            t = this;
                        n.on("init", function() {
                            t.fire("loaded", {
                                layer: n
                            })
                        })
                    } else e.options.fallbackTile ? (console.log("WebGL is not available, falling back to fallbackTile option."), e.options.fallbackTile.addTo(e)) : (console.log("WebGL is not available, falling back to OSM default tile."), this.options.fallbackTile.addTo(e))
                },
                _importScript: function(e) {
                    var n = document.createElement("script");
                    n.type = "text/javascript", n.onerror = this._loadError, document.currentScript ? document.currentScript.parentNode.insertBefore(n, document.currentScript) : document.getElementsByTagName("head")[0].appendChild(n), n.src = e
                },
                _loadError: function(e) {
                    throw console.log(e), new URIError("The script " + e.target.src + " is not accessible.")
                },
                _hasWebGL: function() {
                    try {
                        var e = document.createElement("canvas");
                        return !(!window.WebGLRenderingContext || !e.getContext("webgl") && !e.getContext("experimental-webgl"))
                    } catch (e) {
                        return !1
                    }
                }
            });
        module.exports = TangramLayer, module.exports.tangramLayer = function() {
            return tangramLayerInstance || (tangramLayerInstance = new TangramLayer), tangramLayerInstance
        }
    }, {
        leaflet: 1
    }],
    9: [function(require, module) {
        "use strict";
        var L = require("leaflet"),
            MapControl = require("./components/mapControl"),
            Bug = require("./components/bug"),
            Locator = require("./components/locator"),
            Geocoder = require("./components/search"),
            Hash = require("./components/hash"),
            BasemapStyles = require("./components/basemapStyles"),
            TangramLayer = require("./components/tangram");
        L.Mapzen = module.exports = {
            map: MapControl.map,
            geocoder: Geocoder.geocoder,
            locator: Locator.locator,
            bug: Bug,
            hash: Hash.hash,
            HouseStyles: BasemapStyles,
            BasemapStyles: BasemapStyles,
            _tangram: TangramLayer.tangramLayer
        }, L.Icon.Default.imagePath = "https://mapzen.com/js/images"
    }, {
        "./components/basemapStyles": 2,
        "./components/bug": 3,
        "./components/hash": 4,
        "./components/locator": 5,
        "./components/mapControl": 6,
        "./components/search": 7,
        "./components/tangram": 8,
        leaflet: 1
    }]
}, {}, [9]);
