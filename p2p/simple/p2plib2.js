class p2plib{
    constructor() {
        !function (t, e) {
            "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.io = e() : t.io = e()
            window.io=t.io
            console.log("test")
        }(this, function () {
            return function (t) {
                function e(r) {
                    if (n[r]) return n[r].exports;
                    var o = n[r] = {exports: {}, id: r, loaded: !1};
                    return t[r].call(o.exports, o, o.exports, e), o.loaded = !0, o.exports
                }

                var n = {};
                return e.m = t, e.c = n, e.p = "", e(0)
            }([function (t, e, n) {
                "use strict";

                function r(t, e) {
                    "object" === ("undefined" == typeof t ? "undefined" : o(t)) && (e = t, t = void 0), e = e || {};
                    var n, r = i(t), s = r.source, u = r.id, h = r.path, f = p[u] && h in p[u].nsps,
                        l = e.forceNew || e["force new connection"] || !1 === e.multiplex || f;
                    return l ? (c("ignoring socket cache for %s", s), n = a(s, e)) : (p[u] || (c("new io instance for %s", s), p[u] = a(s, e)), n = p[u]), r.query && !e.query && (e.query = r.query), n.socket(r.path, e)
                }

                var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                    return typeof t
                } : function (t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }, i = n(1), s = n(7), a = n(12), c = n(3)("socket.io-client");
                t.exports = e = r;
                var p = e.managers = {};
                e.protocol = s.protocol, e.connect = r, e.Manager = n(12), e.Socket = n(36)
            }, function (t, e, n) {
                "use strict";

                function r(t, e) {
                    var n = t;
                    e = e || "undefined" != typeof location && location, null == t && (t = e.protocol + "//" + e.host), "string" == typeof t && ("/" === t.charAt(0) && (t = "/" === t.charAt(1) ? e.protocol + t : e.host + t), /^(https?|wss?):\/\//.test(t) || (i("protocol-less url %s", t), t = "undefined" != typeof e ? e.protocol + "//" + t : "https://" + t), i("parse %s", t), n = o(t)), n.port || (/^(http|ws)$/.test(n.protocol) ? n.port = "80" : /^(http|ws)s$/.test(n.protocol) && (n.port = "443")), n.path = n.path || "/";
                    var r = n.host.indexOf(":") !== -1, s = r ? "[" + n.host + "]" : n.host;
                    return n.id = n.protocol + "://" + s + ":" + n.port, n.href = n.protocol + "://" + s + (e && e.port === n.port ? "" : ":" + n.port), n
                }

                var o = n(2), i = n(3)("socket.io-client:url");
                t.exports = r
            }, function (t, e) {
                var n = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
                    r = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
                t.exports = function (t) {
                    var e = t, o = t.indexOf("["), i = t.indexOf("]");
                    o != -1 && i != -1 && (t = t.substring(0, o) + t.substring(o, i).replace(/:/g, ";") + t.substring(i, t.length));
                    for (var s = n.exec(t || ""), a = {}, c = 14; c--;) a[r[c]] = s[c] || "";
                    return o != -1 && i != -1 && (a.source = e, a.host = a.host.substring(1, a.host.length - 1).replace(/;/g, ":"), a.authority = a.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), a.ipv6uri = !0), a
                }
            }, function (t, e, n) {
                (function (r) {
                    function o() {
                        return !("undefined" == typeof window || !window.process || "renderer" !== window.process.type) || ("undefined" == typeof navigator || !navigator.userAgent || !navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) && ("undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
                    }

                    function i(t) {
                        var n = this.useColors;
                        if (t[0] = (n ? "%c" : "") + this.namespace + (n ? " %c" : " ") + t[0] + (n ? "%c " : " ") + "+" + e.humanize(this.diff), n) {
                            var r = "color: " + this.color;
                            t.splice(1, 0, r, "color: inherit");
                            var o = 0, i = 0;
                            t[0].replace(/%[a-zA-Z%]/g, function (t) {
                                "%%" !== t && (o++, "%c" === t && (i = o))
                            }), t.splice(i, 0, r)
                        }
                    }

                    function s() {
                        return "object" == typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments)
                    }

                    function a(t) {
                        try {
                            null == t ? e.storage.removeItem("debug") : e.storage.debug = t
                        } catch (n) {
                        }
                    }

                    function c() {
                        var t;
                        try {
                            t = e.storage.debug
                        } catch (n) {
                        }
                        return !t && "undefined" != typeof r && "env" in r && (t = r.env.DEBUG), t
                    }

                    function p() {
                        try {
                            return window.localStorage
                        } catch (t) {
                        }
                    }

                    e = t.exports = n(5), e.log = s, e.formatArgs = i, e.save = a, e.load = c, e.useColors = o, e.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : p(), e.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"], e.formatters.j = function (t) {
                        try {
                            return JSON.stringify(t)
                        } catch (e) {
                            return "[UnexpectedJSONParseError]: " + e.message
                        }
                    }, e.enable(c())
                }).call(e, n(4))
            }, function (t, e) {
                function n() {
                    throw new Error("setTimeout has not been defined")
                }

                function r() {
                    throw new Error("clearTimeout has not been defined")
                }

                function o(t) {
                    if (u === setTimeout) return setTimeout(t, 0);
                    if ((u === n || !u) && setTimeout) return u = setTimeout, setTimeout(t, 0);
                    try {
                        return u(t, 0)
                    } catch (e) {
                        try {
                            return u.call(null, t, 0)
                        } catch (e) {
                            return u.call(this, t, 0)
                        }
                    }
                }

                function i(t) {
                    if (h === clearTimeout) return clearTimeout(t);
                    if ((h === r || !h) && clearTimeout) return h = clearTimeout, clearTimeout(t);
                    try {
                        return h(t)
                    } catch (e) {
                        try {
                            return h.call(null, t)
                        } catch (e) {
                            return h.call(this, t)
                        }
                    }
                }

                function s() {
                    y && l && (y = !1, l.length ? d = l.concat(d) : m = -1, d.length && a())
                }

                function a() {
                    if (!y) {
                        var t = o(s);
                        y = !0;
                        for (var e = d.length; e;) {
                            for (l = d, d = []; ++m < e;) l && l[m].run();
                            m = -1, e = d.length
                        }
                        l = null, y = !1, i(t)
                    }
                }

                function c(t, e) {
                    this.fun = t, this.array = e
                }

                function p() {
                }

                var u, h, f = t.exports = {};
                !function () {
                    try {
                        u = "function" == typeof setTimeout ? setTimeout : n
                    } catch (t) {
                        u = n
                    }
                    try {
                        h = "function" == typeof clearTimeout ? clearTimeout : r
                    } catch (t) {
                        h = r
                    }
                }();
                var l, d = [], y = !1, m = -1;
                f.nextTick = function (t) {
                    var e = new Array(arguments.length - 1);
                    if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                    d.push(new c(t, e)), 1 !== d.length || y || o(a)
                }, c.prototype.run = function () {
                    this.fun.apply(null, this.array)
                }, f.title = "browser", f.browser = !0, f.env = {}, f.argv = [], f.version = "", f.versions = {}, f.on = p, f.addListener = p, f.once = p, f.off = p, f.removeListener = p, f.removeAllListeners = p, f.emit = p, f.prependListener = p, f.prependOnceListener = p, f.listeners = function (t) {
                    return []
                }, f.binding = function (t) {
                    throw new Error("process.binding is not supported")
                }, f.cwd = function () {
                    return "/"
                }, f.chdir = function (t) {
                    throw new Error("process.chdir is not supported")
                }, f.umask = function () {
                    return 0
                }
            }, function (t, e, n) {
                function r(t) {
                    var n, r = 0;
                    for (n in t) r = (r << 5) - r + t.charCodeAt(n), r |= 0;
                    return e.colors[Math.abs(r) % e.colors.length]
                }

                function o(t) {
                    function n() {
                        if (n.enabled) {
                            var t = n, r = +new Date, i = r - (o || r);
                            t.diff = i, t.prev = o, t.curr = r, o = r;
                            for (var s = new Array(arguments.length), a = 0; a < s.length; a++) s[a] = arguments[a];
                            s[0] = e.coerce(s[0]), "string" != typeof s[0] && s.unshift("%O");
                            var c = 0;
                            s[0] = s[0].replace(/%([a-zA-Z%])/g, function (n, r) {
                                if ("%%" === n) return n;
                                c++;
                                var o = e.formatters[r];
                                if ("function" == typeof o) {
                                    var i = s[c];
                                    n = o.call(t, i), s.splice(c, 1), c--
                                }
                                return n
                            }), e.formatArgs.call(t, s);
                            var p = n.log || e.log || console.log.bind(console);
                            p.apply(t, s)
                        }
                    }

                    var o;
                    return n.namespace = t, n.enabled = e.enabled(t), n.useColors = e.useColors(), n.color = r(t), n.destroy = i, "function" == typeof e.init && e.init(n), e.instances.push(n), n
                }

                function i() {
                    var t = e.instances.indexOf(this);
                    return t !== -1 && (e.instances.splice(t, 1), !0)
                }

                function s(t) {
                    e.save(t), e.names = [], e.skips = [];
                    var n, r = ("string" == typeof t ? t : "").split(/[\s,]+/), o = r.length;
                    for (n = 0; n < o; n++) r[n] && (t = r[n].replace(/\*/g, ".*?"), "-" === t[0] ? e.skips.push(new RegExp("^" + t.substr(1) + "$")) : e.names.push(new RegExp("^" + t + "$")));
                    for (n = 0; n < e.instances.length; n++) {
                        var i = e.instances[n];
                        i.enabled = e.enabled(i.namespace)
                    }
                }

                function a() {
                    e.enable("")
                }

                function c(t) {
                    if ("*" === t[t.length - 1]) return !0;
                    var n, r;
                    for (n = 0, r = e.skips.length; n < r; n++) if (e.skips[n].test(t)) return !1;
                    for (n = 0, r = e.names.length; n < r; n++) if (e.names[n].test(t)) return !0;
                    return !1
                }

                function p(t) {
                    return t instanceof Error ? t.stack || t.message : t
                }

                e = t.exports = o.debug = o["default"] = o, e.coerce = p, e.disable = a, e.enable = s, e.enabled = c, e.humanize = n(6), e.instances = [], e.names = [], e.skips = [], e.formatters = {}
            }, function (t, e) {
                function n(t) {
                    if (t = String(t), !(t.length > 100)) {
                        var e = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);
                        if (e) {
                            var n = parseFloat(e[1]), r = (e[2] || "ms").toLowerCase();
                            switch (r) {
                                case"years":
                                case"year":
                                case"yrs":
                                case"yr":
                                case"y":
                                    return n * u;
                                case"days":
                                case"day":
                                case"d":
                                    return n * p;
                                case"hours":
                                case"hour":
                                case"hrs":
                                case"hr":
                                case"h":
                                    return n * c;
                                case"minutes":
                                case"minute":
                                case"mins":
                                case"min":
                                case"m":
                                    return n * a;
                                case"seconds":
                                case"second":
                                case"secs":
                                case"sec":
                                case"s":
                                    return n * s;
                                case"milliseconds":
                                case"millisecond":
                                case"msecs":
                                case"msec":
                                case"ms":
                                    return n;
                                default:
                                    return
                            }
                        }
                    }
                }

                function r(t) {
                    return t >= p ? Math.round(t / p) + "d" : t >= c ? Math.round(t / c) + "h" : t >= a ? Math.round(t / a) + "m" : t >= s ? Math.round(t / s) + "s" : t + "ms"
                }

                function o(t) {
                    return i(t, p, "day") || i(t, c, "hour") || i(t, a, "minute") || i(t, s, "second") || t + " ms"
                }

                function i(t, e, n) {
                    if (!(t < e)) return t < 1.5 * e ? Math.floor(t / e) + " " + n : Math.ceil(t / e) + " " + n + "s"
                }

                var s = 1e3, a = 60 * s, c = 60 * a, p = 24 * c, u = 365.25 * p;
                t.exports = function (t, e) {
                    e = e || {};
                    var i = typeof t;
                    if ("string" === i && t.length > 0) return n(t);
                    if ("number" === i && isNaN(t) === !1) return e["long"] ? o(t) : r(t);
                    throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(t))
                }
            }, function (t, e, n) {
                function r() {
                }

                function o(t) {
                    var n = "" + t.type;
                    if (e.BINARY_EVENT !== t.type && e.BINARY_ACK !== t.type || (n += t.attachments + "-"), t.nsp && "/" !== t.nsp && (n += t.nsp + ","), null != t.id && (n += t.id), null != t.data) {
                        var r = i(t.data);
                        if (r === !1) return g;
                        n += r
                    }
                    return f("encoded %j as %s", t, n), n
                }

                function i(t) {
                    try {
                        return JSON.stringify(t)
                    } catch (e) {
                        return !1
                    }
                }

                function s(t, e) {
                    function n(t) {
                        var n = d.deconstructPacket(t), r = o(n.packet), i = n.buffers;
                        i.unshift(r), e(i)
                    }

                    d.removeBlobs(t, n)
                }

                function a() {
                    this.reconstructor = null
                }

                function c(t) {
                    var n = 0, r = {type: Number(t.charAt(0))};
                    if (null == e.types[r.type]) return h("unknown packet type " + r.type);
                    if (e.BINARY_EVENT === r.type || e.BINARY_ACK === r.type) {
                        for (var o = ""; "-" !== t.charAt(++n) && (o += t.charAt(n), n != t.length);) ;
                        if (o != Number(o) || "-" !== t.charAt(n)) throw new Error("Illegal attachments");
                        r.attachments = Number(o)
                    }
                    if ("/" === t.charAt(n + 1)) for (r.nsp = ""; ++n;) {
                        var i = t.charAt(n);
                        if ("," === i) break;
                        if (r.nsp += i, n === t.length) break
                    } else r.nsp = "/";
                    var s = t.charAt(n + 1);
                    if ("" !== s && Number(s) == s) {
                        for (r.id = ""; ++n;) {
                            var i = t.charAt(n);
                            if (null == i || Number(i) != i) {
                                --n;
                                break
                            }
                            if (r.id += t.charAt(n), n === t.length) break
                        }
                        r.id = Number(r.id)
                    }
                    if (t.charAt(++n)) {
                        var a = p(t.substr(n)), c = a !== !1 && (r.type === e.ERROR || y(a));
                        if (!c) return h("invalid payload");
                        r.data = a
                    }
                    return f("decoded %s as %j", t, r), r
                }

                function p(t) {
                    try {
                        return JSON.parse(t)
                    } catch (e) {
                        return !1
                    }
                }

                function u(t) {
                    this.reconPack = t, this.buffers = []
                }

                function h(t) {
                    return {type: e.ERROR, data: "parser error: " + t}
                }

                var f = n(3)("socket.io-parser"), l = n(8), d = n(9), y = n(10), m = n(11);
                e.protocol = 4, e.types = ["CONNECT", "DISCONNECT", "EVENT", "ACK", "ERROR", "BINARY_EVENT", "BINARY_ACK"], e.CONNECT = 0, e.DISCONNECT = 1, e.EVENT = 2, e.ACK = 3, e.ERROR = 4, e.BINARY_EVENT = 5, e.BINARY_ACK = 6, e.Encoder = r, e.Decoder = a;
                var g = e.ERROR + '"encode error"';
                r.prototype.encode = function (t, n) {
                    if (f("encoding packet %j", t), e.BINARY_EVENT === t.type || e.BINARY_ACK === t.type) s(t, n); else {
                        var r = o(t);
                        n([r])
                    }
                }, l(a.prototype), a.prototype.add = function (t) {
                    var n;
                    if ("string" == typeof t) n = c(t), e.BINARY_EVENT === n.type || e.BINARY_ACK === n.type ? (this.reconstructor = new u(n), 0 === this.reconstructor.reconPack.attachments && this.emit("decoded", n)) : this.emit("decoded", n); else {
                        if (!m(t) && !t.base64) throw new Error("Unknown type: " + t);
                        if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
                        n = this.reconstructor.takeBinaryData(t), n && (this.reconstructor = null, this.emit("decoded", n))
                    }
                }, a.prototype.destroy = function () {
                    this.reconstructor && this.reconstructor.finishedReconstruction()
                }, u.prototype.takeBinaryData = function (t) {
                    if (this.buffers.push(t), this.buffers.length === this.reconPack.attachments) {
                        var e = d.reconstructPacket(this.reconPack, this.buffers);
                        return this.finishedReconstruction(), e
                    }
                    return null
                }, u.prototype.finishedReconstruction = function () {
                    this.reconPack = null, this.buffers = []
                }
            }, function (t, e, n) {
                function r(t) {
                    if (t) return o(t)
                }

                function o(t) {
                    for (var e in r.prototype) t[e] = r.prototype[e];
                    return t
                }

                t.exports = r, r.prototype.on = r.prototype.addEventListener = function (t, e) {
                    return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), this
                }, r.prototype.once = function (t, e) {
                    function n() {
                        this.off(t, n), e.apply(this, arguments)
                    }

                    return n.fn = e, this.on(t, n), this
                }, r.prototype.off = r.prototype.removeListener = r.prototype.removeAllListeners = r.prototype.removeEventListener = function (t, e) {
                    if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
                    var n = this._callbacks["$" + t];
                    if (!n) return this;
                    if (1 == arguments.length) return delete this._callbacks["$" + t], this;
                    for (var r, o = 0; o < n.length; o++) if (r = n[o], r === e || r.fn === e) {
                        n.splice(o, 1);
                        break
                    }
                    return this
                }, r.prototype.emit = function (t) {
                    this._callbacks = this._callbacks || {};
                    var e = [].slice.call(arguments, 1), n = this._callbacks["$" + t];
                    if (n) {
                        n = n.slice(0);
                        for (var r = 0, o = n.length; r < o; ++r) n[r].apply(this, e)
                    }
                    return this
                }, r.prototype.listeners = function (t) {
                    return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || []
                }, r.prototype.hasListeners = function (t) {
                    return !!this.listeners(t).length
                }
            }, function (t, e, n) {
                function r(t, e) {
                    if (!t) return t;
                    if (s(t)) {
                        var n = {_placeholder: !0, num: e.length};
                        return e.push(t), n
                    }
                    if (i(t)) {
                        for (var o = new Array(t.length), a = 0; a < t.length; a++) o[a] = r(t[a], e);
                        return o
                    }
                    if ("object" == typeof t && !(t instanceof Date)) {
                        var o = {};
                        for (var c in t) o[c] = r(t[c], e);
                        return o
                    }
                    return t
                }

                function o(t, e) {
                    if (!t) return t;
                    if (t && t._placeholder) return e[t.num];
                    if (i(t)) for (var n = 0; n < t.length; n++) t[n] = o(t[n], e); else if ("object" == typeof t) for (var r in t) t[r] = o(t[r], e);
                    return t
                }

                var i = n(10), s = n(11), a = Object.prototype.toString,
                    c = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === a.call(Blob),
                    p = "function" == typeof File || "undefined" != typeof File && "[object FileConstructor]" === a.call(File);
                e.deconstructPacket = function (t) {
                    var e = [], n = t.data, o = t;
                    return o.data = r(n, e), o.attachments = e.length, {packet: o, buffers: e}
                }, e.reconstructPacket = function (t, e) {
                    return t.data = o(t.data, e), t.attachments = void 0, t
                }, e.removeBlobs = function (t, e) {
                    function n(t, a, u) {
                        if (!t) return t;
                        if (c && t instanceof Blob || p && t instanceof File) {
                            r++;
                            var h = new FileReader;
                            h.onload = function () {
                                u ? u[a] = this.result : o = this.result, --r || e(o)
                            }, h.readAsArrayBuffer(t)
                        } else if (i(t)) for (var f = 0; f < t.length; f++) n(t[f], f, t); else if ("object" == typeof t && !s(t)) for (var l in t) n(t[l], l, t)
                    }

                    var r = 0, o = t;
                    n(o), r || e(o)
                }
            }, function (t, e) {
                var n = {}.toString;
                t.exports = Array.isArray || function (t) {
                    return "[object Array]" == n.call(t)
                }
            }, function (t, e) {
                function n(t) {
                    return r && Buffer.isBuffer(t) || o && (t instanceof ArrayBuffer || i(t))
                }

                t.exports = n;
                var r = "function" == typeof Buffer && "function" == typeof Buffer.isBuffer,
                    o = "function" == typeof ArrayBuffer, i = function (t) {
                        return "function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(t) : t.buffer instanceof ArrayBuffer
                    }
            }, function (t, e, n) {
                "use strict";

                function r(t, e) {
                    if (!(this instanceof r)) return new r(t, e);
                    t && "object" === ("undefined" == typeof t ? "undefined" : o(t)) && (e = t, t = void 0), e = e || {}, e.path = e.path || "/socket.io", this.nsps = {}, this.subs = [], this.opts = e, this.reconnection(e.reconnection !== !1), this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0), this.reconnectionDelay(e.reconnectionDelay || 1e3), this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3), this.randomizationFactor(e.randomizationFactor || .5), this.backoff = new l({
                        min: this.reconnectionDelay(),
                        max: this.reconnectionDelayMax(),
                        jitter: this.randomizationFactor()
                    }), this.timeout(null == e.timeout ? 2e4 : e.timeout), this.readyState = "closed", this.uri = t, this.connecting = [], this.lastPing = null, this.encoding = !1, this.packetBuffer = [];
                    var n = e.parser || c;
                    this.encoder = new n.Encoder, this.decoder = new n.Decoder, this.autoConnect = e.autoConnect !== !1, this.autoConnect && this.open()
                }

                var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                        return typeof t
                    } : function (t) {
                        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                    }, i = n(13), s = n(36), a = n(8), c = n(7), p = n(38), u = n(39), h = n(3)("socket.io-client:manager"),
                    f = n(35), l = n(40), d = Object.prototype.hasOwnProperty;
                t.exports = r, r.prototype.emitAll = function () {
                    this.emit.apply(this, arguments);
                    for (var t in this.nsps) d.call(this.nsps, t) && this.nsps[t].emit.apply(this.nsps[t], arguments)
                }, r.prototype.updateSocketIds = function () {
                    for (var t in this.nsps) d.call(this.nsps, t) && (this.nsps[t].id = this.generateId(t))
                }, r.prototype.generateId = function (t) {
                    return ("/" === t ? "" : t + "#") + this.engine.id
                }, a(r.prototype), r.prototype.reconnection = function (t) {
                    return arguments.length ? (this._reconnection = !!t, this) : this._reconnection
                }, r.prototype.reconnectionAttempts = function (t) {
                    return arguments.length ? (this._reconnectionAttempts = t, this) : this._reconnectionAttempts
                }, r.prototype.reconnectionDelay = function (t) {
                    return arguments.length ? (this._reconnectionDelay = t, this.backoff && this.backoff.setMin(t), this) : this._reconnectionDelay
                }, r.prototype.randomizationFactor = function (t) {
                    return arguments.length ? (this._randomizationFactor = t, this.backoff && this.backoff.setJitter(t), this) : this._randomizationFactor
                }, r.prototype.reconnectionDelayMax = function (t) {
                    return arguments.length ? (this._reconnectionDelayMax = t, this.backoff && this.backoff.setMax(t), this) : this._reconnectionDelayMax
                }, r.prototype.timeout = function (t) {
                    return arguments.length ? (this._timeout = t, this) : this._timeout
                }, r.prototype.maybeReconnectOnOpen = function () {
                    !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect()
                }, r.prototype.open = r.prototype.connect = function (t, e) {
                    if (h("readyState %s", this.readyState), ~this.readyState.indexOf("open")) return this;
                    h("opening %s", this.uri), this.engine = i(this.uri, this.opts);
                    var n = this.engine, r = this;
                    this.readyState = "opening", this.skipReconnect = !1;
                    var o = p(n, "open", function () {
                        r.onopen(), t && t()
                    }), s = p(n, "error", function (e) {
                        if (h("connect_error"), r.cleanup(), r.readyState = "closed", r.emitAll("connect_error", e), t) {
                            var n = new Error("Connection error");
                            n.data = e, t(n)
                        } else r.maybeReconnectOnOpen()
                    });
                    if (!1 !== this._timeout) {
                        var a = this._timeout;
                        h("connect attempt will timeout after %d", a);
                        var c = setTimeout(function () {
                            h("connect attempt timed out after %d", a), o.destroy(), n.close(), n.emit("error", "timeout"), r.emitAll("connect_timeout", a)
                        }, a);
                        this.subs.push({
                            destroy: function () {
                                clearTimeout(c)
                            }
                        })
                    }
                    return this.subs.push(o), this.subs.push(s), this
                }, r.prototype.onopen = function () {
                    h("open"), this.cleanup(), this.readyState = "open", this.emit("open");
                    var t = this.engine;
                    this.subs.push(p(t, "data", u(this, "ondata"))), this.subs.push(p(t, "ping", u(this, "onping"))), this.subs.push(p(t, "pong", u(this, "onpong"))), this.subs.push(p(t, "error", u(this, "onerror"))), this.subs.push(p(t, "close", u(this, "onclose"))), this.subs.push(p(this.decoder, "decoded", u(this, "ondecoded")))
                }, r.prototype.onping = function () {
                    this.lastPing = new Date, this.emitAll("ping")
                }, r.prototype.onpong = function () {
                    this.emitAll("pong", new Date - this.lastPing)
                }, r.prototype.ondata = function (t) {
                    this.decoder.add(t)
                }, r.prototype.ondecoded = function (t) {
                    this.emit("packet", t)
                }, r.prototype.onerror = function (t) {
                    h("error", t), this.emitAll("error", t)
                }, r.prototype.socket = function (t, e) {
                    function n() {
                        ~f(o.connecting, r) || o.connecting.push(r)
                    }

                    var r = this.nsps[t];
                    if (!r) {
                        r = new s(this, t, e), this.nsps[t] = r;
                        var o = this;
                        r.on("connecting", n), r.on("connect", function () {
                            r.id = o.generateId(t)
                        }), this.autoConnect && n()
                    }
                    return r
                }, r.prototype.destroy = function (t) {
                    var e = f(this.connecting, t);
                    ~e && this.connecting.splice(e, 1), this.connecting.length || this.close()
                }, r.prototype.packet = function (t) {
                    h("writing packet %j", t);
                    var e = this;
                    t.query && 0 === t.type && (t.nsp += "?" + t.query), e.encoding ? e.packetBuffer.push(t) : (e.encoding = !0, this.encoder.encode(t, function (n) {
                        for (var r = 0; r < n.length; r++) e.engine.write(n[r], t.options);
                        e.encoding = !1, e.processPacketQueue()
                    }))
                }, r.prototype.processPacketQueue = function () {
                    if (this.packetBuffer.length > 0 && !this.encoding) {
                        var t = this.packetBuffer.shift();
                        this.packet(t)
                    }
                }, r.prototype.cleanup = function () {
                    h("cleanup");
                    for (var t = this.subs.length, e = 0; e < t; e++) {
                        var n = this.subs.shift();
                        n.destroy()
                    }
                    this.packetBuffer = [], this.encoding = !1, this.lastPing = null, this.decoder.destroy()
                }, r.prototype.close = r.prototype.disconnect = function () {
                    h("disconnect"), this.skipReconnect = !0, this.reconnecting = !1, "opening" === this.readyState && this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.engine && this.engine.close()
                }, r.prototype.onclose = function (t) {
                    h("onclose"), this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.emit("close", t), this._reconnection && !this.skipReconnect && this.reconnect()
                }, r.prototype.reconnect = function () {
                    if (this.reconnecting || this.skipReconnect) return this;
                    var t = this;
                    if (this.backoff.attempts >= this._reconnectionAttempts) h("reconnect failed"), this.backoff.reset(), this.emitAll("reconnect_failed"), this.reconnecting = !1; else {
                        var e = this.backoff.duration();
                        h("will wait %dms before reconnect attempt", e), this.reconnecting = !0;
                        var n = setTimeout(function () {
                            t.skipReconnect || (h("attempting reconnect"), t.emitAll("reconnect_attempt", t.backoff.attempts), t.emitAll("reconnecting", t.backoff.attempts), t.skipReconnect || t.open(function (e) {
                                e ? (h("reconnect attempt error"), t.reconnecting = !1, t.reconnect(), t.emitAll("reconnect_error", e.data)) : (h("reconnect success"), t.onreconnect())
                            }))
                        }, e);
                        this.subs.push({
                            destroy: function () {
                                clearTimeout(n)
                            }
                        })
                    }
                }, r.prototype.onreconnect = function () {
                    var t = this.backoff.attempts;
                    this.reconnecting = !1, this.backoff.reset(), this.updateSocketIds(), this.emitAll("reconnect", t)
                }
            }, function (t, e, n) {
                t.exports = n(14), t.exports.parser = n(21)
            }, function (t, e, n) {
                function r(t, e) {
                    return this instanceof r ? (e = e || {}, t && "object" == typeof t && (e = t, t = null), t ? (t = u(t), e.hostname = t.host, e.secure = "https" === t.protocol || "wss" === t.protocol, e.port = t.port, t.query && (e.query = t.query)) : e.host && (e.hostname = u(e.host).host), this.secure = null != e.secure ? e.secure : "undefined" != typeof location && "https:" === location.protocol, e.hostname && !e.port && (e.port = this.secure ? "443" : "80"), this.agent = e.agent || !1, this.hostname = e.hostname || ("undefined" != typeof location ? location.hostname : "localhost"), this.port = e.port || ("undefined" != typeof location && location.port ? location.port : this.secure ? 443 : 80), this.query = e.query || {}, "string" == typeof this.query && (this.query = h.decode(this.query)), this.upgrade = !1 !== e.upgrade, this.path = (e.path || "/engine.io").replace(/\/$/, "") + "/", this.forceJSONP = !!e.forceJSONP, this.jsonp = !1 !== e.jsonp, this.forceBase64 = !!e.forceBase64, this.enablesXDR = !!e.enablesXDR, this.timestampParam = e.timestampParam || "t", this.timestampRequests = e.timestampRequests, this.transports = e.transports || ["polling", "websocket"], this.transportOptions = e.transportOptions || {}, this.readyState = "", this.writeBuffer = [], this.prevBufferLen = 0, this.policyPort = e.policyPort || 843, this.rememberUpgrade = e.rememberUpgrade || !1, this.binaryType = null, this.onlyBinaryUpgrades = e.onlyBinaryUpgrades, this.perMessageDeflate = !1 !== e.perMessageDeflate && (e.perMessageDeflate || {}), !0 === this.perMessageDeflate && (this.perMessageDeflate = {}), this.perMessageDeflate && null == this.perMessageDeflate.threshold && (this.perMessageDeflate.threshold = 1024), this.pfx = e.pfx || null, this.key = e.key || null, this.passphrase = e.passphrase || null, this.cert = e.cert || null, this.ca = e.ca || null, this.ciphers = e.ciphers || null, this.rejectUnauthorized = void 0 === e.rejectUnauthorized || e.rejectUnauthorized, this.forceNode = !!e.forceNode, this.isReactNative = "undefined" != typeof navigator && "string" == typeof navigator.product && "reactnative" === navigator.product.toLowerCase(), ("undefined" == typeof self || this.isReactNative) && (e.extraHeaders && Object.keys(e.extraHeaders).length > 0 && (this.extraHeaders = e.extraHeaders), e.localAddress && (this.localAddress = e.localAddress)), this.id = null, this.upgrades = null, this.pingInterval = null, this.pingTimeout = null, this.pingIntervalTimer = null, this.pingTimeoutTimer = null, void this.open()) : new r(t, e)
                }

                function o(t) {
                    var e = {};
                    for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
                    return e
                }

                var i = n(15), s = n(8), a = n(3)("engine.io-client:socket"), c = n(35), p = n(21), u = n(2), h = n(29);
                t.exports = r, r.priorWebsocketSuccess = !1, s(r.prototype), r.protocol = p.protocol, r.Socket = r, r.Transport = n(20), r.transports = n(15), r.parser = n(21), r.prototype.createTransport = function (t) {
                    a('creating transport "%s"', t);
                    var e = o(this.query);
                    e.EIO = p.protocol, e.transport = t;
                    var n = this.transportOptions[t] || {};
                    this.id && (e.sid = this.id);
                    var r = new i[t]({
                        query: e,
                        socket: this,
                        agent: n.agent || this.agent,
                        hostname: n.hostname || this.hostname,
                        port: n.port || this.port,
                        secure: n.secure || this.secure,
                        path: n.path || this.path,
                        forceJSONP: n.forceJSONP || this.forceJSONP,
                        jsonp: n.jsonp || this.jsonp,
                        forceBase64: n.forceBase64 || this.forceBase64,
                        enablesXDR: n.enablesXDR || this.enablesXDR,
                        timestampRequests: n.timestampRequests || this.timestampRequests,
                        timestampParam: n.timestampParam || this.timestampParam,
                        policyPort: n.policyPort || this.policyPort,
                        pfx: n.pfx || this.pfx,
                        key: n.key || this.key,
                        passphrase: n.passphrase || this.passphrase,
                        cert: n.cert || this.cert,
                        ca: n.ca || this.ca,
                        ciphers: n.ciphers || this.ciphers,
                        rejectUnauthorized: n.rejectUnauthorized || this.rejectUnauthorized,
                        perMessageDeflate: n.perMessageDeflate || this.perMessageDeflate,
                        extraHeaders: n.extraHeaders || this.extraHeaders,
                        forceNode: n.forceNode || this.forceNode,
                        localAddress: n.localAddress || this.localAddress,
                        requestTimeout: n.requestTimeout || this.requestTimeout,
                        protocols: n.protocols || void 0,
                        isReactNative: this.isReactNative
                    });
                    return r
                }, r.prototype.open = function () {
                    var t;
                    if (this.rememberUpgrade && r.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1) t = "websocket"; else {
                        if (0 === this.transports.length) {
                            var e = this;
                            return void setTimeout(function () {
                                e.emit("error", "No transports available")
                            }, 0)
                        }
                        t = this.transports[0]
                    }
                    this.readyState = "opening";
                    try {
                        t = this.createTransport(t)
                    } catch (n) {
                        return this.transports.shift(), void this.open()
                    }
                    t.open(), this.setTransport(t)
                }, r.prototype.setTransport = function (t) {
                    a("setting transport %s", t.name);
                    var e = this;
                    this.transport && (a("clearing existing transport %s", this.transport.name), this.transport.removeAllListeners()), this.transport = t, t.on("drain", function () {
                        e.onDrain()
                    }).on("packet", function (t) {
                        e.onPacket(t)
                    }).on("error", function (t) {
                        e.onError(t)
                    }).on("close", function () {
                        e.onClose("transport close")
                    })
                }, r.prototype.probe = function (t) {
                    function e() {
                        if (f.onlyBinaryUpgrades) {
                            var e = !this.supportsBinary && f.transport.supportsBinary;
                            h = h || e
                        }
                        h || (a('probe transport "%s" opened', t), u.send([{
                            type: "ping",
                            data: "probe"
                        }]), u.once("packet", function (e) {
                            if (!h) if ("pong" === e.type && "probe" === e.data) {
                                if (a('probe transport "%s" pong', t), f.upgrading = !0, f.emit("upgrading", u), !u) return;
                                r.priorWebsocketSuccess = "websocket" === u.name, a('pausing current transport "%s"', f.transport.name), f.transport.pause(function () {
                                    h || "closed" !== f.readyState && (a("changing transport and sending upgrade packet"), p(), f.setTransport(u), u.send([{type: "upgrade"}]), f.emit("upgrade", u), u = null, f.upgrading = !1, f.flush())
                                })
                            } else {
                                a('probe transport "%s" failed', t);
                                var n = new Error("probe error");
                                n.transport = u.name, f.emit("upgradeError", n)
                            }
                        }))
                    }

                    function n() {
                        h || (h = !0, p(), u.close(), u = null)
                    }

                    function o(e) {
                        var r = new Error("probe error: " + e);
                        r.transport = u.name, n(), a('probe transport "%s" failed because of error: %s', t, e), f.emit("upgradeError", r)
                    }

                    function i() {
                        o("transport closed")
                    }

                    function s() {
                        o("socket closed")
                    }

                    function c(t) {
                        u && t.name !== u.name && (a('"%s" works - aborting "%s"', t.name, u.name), n())
                    }

                    function p() {
                        u.removeListener("open", e), u.removeListener("error", o), u.removeListener("close", i), f.removeListener("close", s), f.removeListener("upgrading", c)
                    }

                    a('probing transport "%s"', t);
                    var u = this.createTransport(t, {probe: 1}), h = !1, f = this;
                    r.priorWebsocketSuccess = !1, u.once("open", e), u.once("error", o), u.once("close", i), this.once("close", s), this.once("upgrading", c), u.open()
                }, r.prototype.onOpen = function () {
                    if (a("socket open"), this.readyState = "open", r.priorWebsocketSuccess = "websocket" === this.transport.name, this.emit("open"), this.flush(), "open" === this.readyState && this.upgrade && this.transport.pause) {
                        a("starting upgrade probes");
                        for (var t = 0, e = this.upgrades.length; t < e; t++) this.probe(this.upgrades[t])
                    }
                }, r.prototype.onPacket = function (t) {
                    if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) switch (a('socket receive: type "%s", data "%s"', t.type, t.data), this.emit("packet", t), this.emit("heartbeat"), t.type) {
                        case"open":
                            this.onHandshake(JSON.parse(t.data));
                            break;
                        case"pong":
                            this.setPing(), this.emit("pong");
                            break;
                        case"error":
                            var e = new Error("server error");
                            e.code = t.data, this.onError(e);
                            break;
                        case"message":
                            this.emit("data", t.data), this.emit("message", t.data)
                    } else a('packet received with socket readyState "%s"', this.readyState)
                }, r.prototype.onHandshake = function (t) {
                    this.emit("handshake", t), this.id = t.sid, this.transport.query.sid = t.sid, this.upgrades = this.filterUpgrades(t.upgrades), this.pingInterval = t.pingInterval, this.pingTimeout = t.pingTimeout, this.onOpen(), "closed" !== this.readyState && (this.setPing(), this.removeListener("heartbeat", this.onHeartbeat), this.on("heartbeat", this.onHeartbeat))
                }, r.prototype.onHeartbeat = function (t) {
                    clearTimeout(this.pingTimeoutTimer);
                    var e = this;
                    e.pingTimeoutTimer = setTimeout(function () {
                        "closed" !== e.readyState && e.onClose("ping timeout")
                    }, t || e.pingInterval + e.pingTimeout)
                }, r.prototype.setPing = function () {
                    var t = this;
                    clearTimeout(t.pingIntervalTimer), t.pingIntervalTimer = setTimeout(function () {
                        a("writing ping packet - expecting pong within %sms", t.pingTimeout), t.ping(), t.onHeartbeat(t.pingTimeout)
                    }, t.pingInterval)
                }, r.prototype.ping = function () {
                    var t = this;
                    this.sendPacket("ping", function () {
                        t.emit("ping")
                    })
                }, r.prototype.onDrain = function () {
                    this.writeBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, 0 === this.writeBuffer.length ? this.emit("drain") : this.flush()
                }, r.prototype.flush = function () {
                    "closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (a("flushing %d packets in socket", this.writeBuffer.length), this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, this.emit("flush"))
                }, r.prototype.write = r.prototype.send = function (t, e, n) {
                    return this.sendPacket("message", t, e, n), this
                }, r.prototype.sendPacket = function (t, e, n, r) {
                    if ("function" == typeof e && (r = e, e = void 0), "function" == typeof n && (r = n, n = null), "closing" !== this.readyState && "closed" !== this.readyState) {
                        n = n || {}, n.compress = !1 !== n.compress;
                        var o = {type: t, data: e, options: n};
                        this.emit("packetCreate", o), this.writeBuffer.push(o), r && this.once("flush", r), this.flush()
                    }
                }, r.prototype.close = function () {
                    function t() {
                        r.onClose("forced close"), a("socket closing - telling transport to close"), r.transport.close()
                    }

                    function e() {
                        r.removeListener("upgrade", e), r.removeListener("upgradeError", e), t()
                    }

                    function n() {
                        r.once("upgrade", e), r.once("upgradeError", e)
                    }

                    if ("opening" === this.readyState || "open" === this.readyState) {
                        this.readyState = "closing";
                        var r = this;
                        this.writeBuffer.length ? this.once("drain", function () {
                            this.upgrading ? n() : t()
                        }) : this.upgrading ? n() : t()
                    }
                    return this
                }, r.prototype.onError = function (t) {
                    a("socket error %j", t), r.priorWebsocketSuccess = !1, this.emit("error", t), this.onClose("transport error", t)
                }, r.prototype.onClose = function (t, e) {
                    if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
                        a('socket close with reason: "%s"', t);
                        var n = this;
                        clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), this.readyState = "closed", this.id = null, this.emit("close", t, e), n.writeBuffer = [], n.prevBufferLen = 0
                    }
                }, r.prototype.filterUpgrades = function (t) {
                    for (var e = [], n = 0, r = t.length; n < r; n++) ~c(this.transports, t[n]) && e.push(t[n]);
                    return e
                }
            }, function (t, e, n) {
                function r(t) {
                    var e, n = !1, r = !1, a = !1 !== t.jsonp;
                    if ("undefined" != typeof location) {
                        var c = "https:" === location.protocol, p = location.port;
                        p || (p = c ? 443 : 80), n = t.hostname !== location.hostname || p !== t.port, r = t.secure !== c
                    }
                    if (t.xdomain = n, t.xscheme = r, e = new o(t), "open" in e && !t.forceJSONP) return new i(t);
                    if (!a) throw new Error("JSONP disabled");
                    return new s(t)
                }

                var o = n(16), i = n(18), s = n(32), a = n(33);
                e.polling = r, e.websocket = a
            }, function (t, e, n) {
                var r = n(17);
                t.exports = function (t) {
                    var e = t.xdomain, n = t.xscheme, o = t.enablesXDR;
                    try {
                        if ("undefined" != typeof XMLHttpRequest && (!e || r)) return new XMLHttpRequest
                    } catch (i) {
                    }
                    try {
                        if ("undefined" != typeof XDomainRequest && !n && o) return new XDomainRequest
                    } catch (i) {
                    }
                    if (!e) try {
                        return new (self[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")
                    } catch (i) {
                    }
                }
            }, function (t, e) {
                try {
                    t.exports = "undefined" != typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest
                } catch (n) {
                    t.exports = !1
                }
            }, function (t, e, n) {
                function r() {
                }

                function o(t) {
                    if (c.call(this, t), this.requestTimeout = t.requestTimeout, this.extraHeaders = t.extraHeaders, "undefined" != typeof location) {
                        var e = "https:" === location.protocol, n = location.port;
                        n || (n = e ? 443 : 80), this.xd = "undefined" != typeof location && t.hostname !== location.hostname || n !== t.port, this.xs = t.secure !== e
                    }
                }

                function i(t) {
                    this.method = t.method || "GET", this.uri = t.uri, this.xd = !!t.xd, this.xs = !!t.xs, this.async = !1 !== t.async, this.data = void 0 !== t.data ? t.data : null, this.agent = t.agent, this.isBinary = t.isBinary, this.supportsBinary = t.supportsBinary, this.enablesXDR = t.enablesXDR, this.requestTimeout = t.requestTimeout, this.pfx = t.pfx, this.key = t.key, this.passphrase = t.passphrase, this.cert = t.cert, this.ca = t.ca, this.ciphers = t.ciphers, this.rejectUnauthorized = t.rejectUnauthorized, this.extraHeaders = t.extraHeaders, this.create()
                }

                function s() {
                    for (var t in i.requests) i.requests.hasOwnProperty(t) && i.requests[t].abort()
                }

                var a = n(16), c = n(19), p = n(8), u = n(30), h = n(3)("engine.io-client:polling-xhr");
                if (t.exports = o, t.exports.Request = i, u(o, c), o.prototype.supportsBinary = !0, o.prototype.request = function (t) {
                    return t = t || {}, t.uri = this.uri(), t.xd = this.xd, t.xs = this.xs, t.agent = this.agent || !1, t.supportsBinary = this.supportsBinary, t.enablesXDR = this.enablesXDR, t.pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized, t.requestTimeout = this.requestTimeout, t.extraHeaders = this.extraHeaders, new i(t)
                }, o.prototype.doWrite = function (t, e) {
                    var n = "string" != typeof t && void 0 !== t,
                        r = this.request({method: "POST", data: t, isBinary: n}), o = this;
                    r.on("success", e), r.on("error", function (t) {
                        o.onError("xhr post error", t)
                    }), this.sendXhr = r
                }, o.prototype.doPoll = function () {
                    h("xhr poll");
                    var t = this.request(), e = this;
                    t.on("data", function (t) {
                        e.onData(t)
                    }), t.on("error", function (t) {
                        e.onError("xhr poll error", t)
                    }), this.pollXhr = t
                }, p(i.prototype), i.prototype.create = function () {
                    var t = {agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR};
                    t.pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized;
                    var e = this.xhr = new a(t), n = this;
                    try {
                        h("xhr open %s: %s", this.method, this.uri), e.open(this.method, this.uri, this.async);
                        try {
                            if (this.extraHeaders) {
                                e.setDisableHeaderCheck && e.setDisableHeaderCheck(!0);
                                for (var r in this.extraHeaders) this.extraHeaders.hasOwnProperty(r) && e.setRequestHeader(r, this.extraHeaders[r])
                            }
                        } catch (o) {
                        }
                        if ("POST" === this.method) try {
                            this.isBinary ? e.setRequestHeader("Content-type", "application/octet-stream") : e.setRequestHeader("Content-type", "text/plain;charset=UTF-8")
                        } catch (o) {
                        }
                        try {
                            e.setRequestHeader("Accept", "*/*")
                        } catch (o) {
                        }
                        "withCredentials" in e && (e.withCredentials = !0), this.requestTimeout && (e.timeout = this.requestTimeout), this.hasXDR() ? (e.onload = function () {
                            n.onLoad()
                        }, e.onerror = function () {
                            n.onError(e.responseText)
                        }) : e.onreadystatechange = function () {
                            if (2 === e.readyState) try {
                                var t = e.getResponseHeader("Content-Type");
                                n.supportsBinary && "application/octet-stream" === t && (e.responseType = "arraybuffer")
                            } catch (r) {
                            }
                            4 === e.readyState && (200 === e.status || 1223 === e.status ? n.onLoad() : setTimeout(function () {
                                n.onError(e.status)
                            }, 0))
                        }, h("xhr data %s", this.data), e.send(this.data)
                    } catch (o) {
                        return void setTimeout(function () {
                            n.onError(o)
                        }, 0)
                    }
                    "undefined" != typeof document && (this.index = i.requestsCount++, i.requests[this.index] = this)
                }, i.prototype.onSuccess = function () {
                    this.emit("success"), this.cleanup()
                }, i.prototype.onData = function (t) {
                    this.emit("data", t), this.onSuccess()
                }, i.prototype.onError = function (t) {
                    this.emit("error", t), this.cleanup(!0)
                }, i.prototype.cleanup = function (t) {
                    if ("undefined" != typeof this.xhr && null !== this.xhr) {
                        if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = r : this.xhr.onreadystatechange = r, t) try {
                            this.xhr.abort()
                        } catch (e) {
                        }
                        "undefined" != typeof document && delete i.requests[this.index], this.xhr = null
                    }
                }, i.prototype.onLoad = function () {
                    var t;
                    try {
                        var e;
                        try {
                            e = this.xhr.getResponseHeader("Content-Type")
                        } catch (n) {
                        }
                        t = "application/octet-stream" === e ? this.xhr.response || this.xhr.responseText : this.xhr.responseText
                    } catch (n) {
                        this.onError(n)
                    }
                    null != t && this.onData(t)
                }, i.prototype.hasXDR = function () {
                    return "undefined" != typeof XDomainRequest && !this.xs && this.enablesXDR
                }, i.prototype.abort = function () {
                    this.cleanup()
                }, i.requestsCount = 0, i.requests = {}, "undefined" != typeof document) if ("function" == typeof attachEvent) attachEvent("onunload", s); else if ("function" == typeof addEventListener) {
                    var f = "onpagehide" in self ? "pagehide" : "unload";
                    addEventListener(f, s, !1)
                }
            }, function (t, e, n) {
                function r(t) {
                    var e = t && t.forceBase64;
                    u && !e || (this.supportsBinary = !1), o.call(this, t)
                }

                var o = n(20), i = n(29), s = n(21), a = n(30), c = n(31), p = n(3)("engine.io-client:polling");
                t.exports = r;
                var u = function () {
                    var t = n(16), e = new t({xdomain: !1});
                    return null != e.responseType
                }();
                a(r, o), r.prototype.name = "polling", r.prototype.doOpen = function () {
                    this.poll()
                }, r.prototype.pause = function (t) {
                    function e() {
                        p("paused"), n.readyState = "paused", t()
                    }

                    var n = this;
                    if (this.readyState = "pausing", this.polling || !this.writable) {
                        var r = 0;
                        this.polling && (p("we are currently polling - waiting to pause"), r++, this.once("pollComplete", function () {
                            p("pre-pause polling complete"), --r || e()
                        })), this.writable || (p("we are currently writing - waiting to pause"), r++, this.once("drain", function () {
                            p("pre-pause writing complete"), --r || e()
                        }))
                    } else e()
                }, r.prototype.poll = function () {
                    p("polling"), this.polling = !0, this.doPoll(), this.emit("poll")
                }, r.prototype.onData = function (t) {
                    var e = this;
                    p("polling got data %s", t);
                    var n = function (t, n, r) {
                        return "opening" === e.readyState && e.onOpen(), "close" === t.type ? (e.onClose(), !1) : void e.onPacket(t)
                    };
                    s.decodePayload(t, this.socket.binaryType, n), "closed" !== this.readyState && (this.polling = !1, this.emit("pollComplete"), "open" === this.readyState ? this.poll() : p('ignoring poll - transport state "%s"', this.readyState))
                }, r.prototype.doClose = function () {
                    function t() {
                        p("writing close packet"), e.write([{type: "close"}])
                    }

                    var e = this;
                    "open" === this.readyState ? (p("transport open - closing"), t()) : (p("transport not open - deferring close"), this.once("open", t))
                }, r.prototype.write = function (t) {
                    var e = this;
                    this.writable = !1;
                    var n = function () {
                        e.writable = !0, e.emit("drain")
                    };
                    s.encodePayload(t, this.supportsBinary, function (t) {
                        e.doWrite(t, n)
                    })
                }, r.prototype.uri = function () {
                    var t = this.query || {}, e = this.secure ? "https" : "http", n = "";
                    !1 !== this.timestampRequests && (t[this.timestampParam] = c()), this.supportsBinary || t.sid || (t.b64 = 1), t = i.encode(t), this.port && ("https" === e && 443 !== Number(this.port) || "http" === e && 80 !== Number(this.port)) && (n = ":" + this.port), t.length && (t = "?" + t);
                    var r = this.hostname.indexOf(":") !== -1;
                    return e + "://" + (r ? "[" + this.hostname + "]" : this.hostname) + n + this.path + t
                }
            }, function (t, e, n) {
                function r(t) {
                    this.path = t.path, this.hostname = t.hostname, this.port = t.port, this.secure = t.secure, this.query = t.query, this.timestampParam = t.timestampParam, this.timestampRequests = t.timestampRequests, this.readyState = "", this.agent = t.agent || !1, this.socket = t.socket, this.enablesXDR = t.enablesXDR, this.pfx = t.pfx, this.key = t.key, this.passphrase = t.passphrase, this.cert = t.cert, this.ca = t.ca, this.ciphers = t.ciphers, this.rejectUnauthorized = t.rejectUnauthorized, this.forceNode = t.forceNode, this.isReactNative = t.isReactNative, this.extraHeaders = t.extraHeaders, this.localAddress = t.localAddress
                }

                var o = n(21), i = n(8);
                t.exports = r, i(r.prototype), r.prototype.onError = function (t, e) {
                    var n = new Error(t);
                    return n.type = "TransportError", n.description = e, this.emit("error", n), this
                }, r.prototype.open = function () {
                    return "closed" !== this.readyState && "" !== this.readyState || (this.readyState = "opening", this.doOpen()), this
                }, r.prototype.close = function () {
                    return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(), this.onClose()), this
                }, r.prototype.send = function (t) {
                    if ("open" !== this.readyState) throw new Error("Transport not open");
                    this.write(t)
                }, r.prototype.onOpen = function () {
                    this.readyState = "open", this.writable = !0, this.emit("open")
                }, r.prototype.onData = function (t) {
                    var e = o.decodePacket(t, this.socket.binaryType);
                    this.onPacket(e)
                }, r.prototype.onPacket = function (t) {
                    this.emit("packet", t)
                }, r.prototype.onClose = function () {
                    this.readyState = "closed", this.emit("close")
                }
            }, function (t, e, n) {
                function r(t, n) {
                    var r = "b" + e.packets[t.type] + t.data.data;
                    return n(r)
                }

                function o(t, n, r) {
                    if (!n) return e.encodeBase64Packet(t, r);
                    var o = t.data, i = new Uint8Array(o), s = new Uint8Array(1 + o.byteLength);
                    s[0] = v[t.type];
                    for (var a = 0; a < i.length; a++) s[a + 1] = i[a];
                    return r(s.buffer)
                }

                function i(t, n, r) {
                    if (!n) return e.encodeBase64Packet(t, r);
                    var o = new FileReader;
                    return o.onload = function () {
                        e.encodePacket({type: t.type, data: o.result}, n, !0, r)
                    }, o.readAsArrayBuffer(t.data)
                }

                function s(t, n, r) {
                    if (!n) return e.encodeBase64Packet(t, r);
                    if (g) return i(t, n, r);
                    var o = new Uint8Array(1);
                    o[0] = v[t.type];
                    var s = new k([o.buffer, t.data]);
                    return r(s)
                }

                function a(t) {
                    try {
                        t = d.decode(t, {strict: !1})
                    } catch (e) {
                        return !1
                    }
                    return t
                }

                function c(t, e, n) {
                    for (var r = new Array(t.length), o = l(t.length, n), i = function (t, n, o) {
                        e(n, function (e, n) {
                            r[t] = n, o(e, r)
                        })
                    }, s = 0; s < t.length; s++) i(s, t[s], o)
                }

                var p, u = n(22), h = n(23), f = n(24), l = n(25), d = n(26);
                "undefined" != typeof ArrayBuffer && (p = n(27));
                var y = "undefined" != typeof navigator && /Android/i.test(navigator.userAgent),
                    m = "undefined" != typeof navigator && /PhantomJS/i.test(navigator.userAgent), g = y || m;
                e.protocol = 3;
                var v = e.packets = {open: 0, close: 1, ping: 2, pong: 3, message: 4, upgrade: 5, noop: 6}, b = u(v),
                    w = {type: "error", data: "parser error"}, k = n(28);
                e.encodePacket = function (t, e, n, i) {
                    "function" == typeof e && (i = e, e = !1), "function" == typeof n && (i = n, n = null);
                    var a = void 0 === t.data ? void 0 : t.data.buffer || t.data;
                    if ("undefined" != typeof ArrayBuffer && a instanceof ArrayBuffer) return o(t, e, i);
                    if ("undefined" != typeof k && a instanceof k) return s(t, e, i);
                    if (a && a.base64) return r(t, i);
                    var c = v[t.type];
                    return void 0 !== t.data && (c += n ? d.encode(String(t.data), {strict: !1}) : String(t.data)), i("" + c)
                }, e.encodeBase64Packet = function (t, n) {
                    var r = "b" + e.packets[t.type];
                    if ("undefined" != typeof k && t.data instanceof k) {
                        var o = new FileReader;
                        return o.onload = function () {
                            var t = o.result.split(",")[1];
                            n(r + t)
                        }, o.readAsDataURL(t.data)
                    }
                    var i;
                    try {
                        i = String.fromCharCode.apply(null, new Uint8Array(t.data))
                    } catch (s) {
                        for (var a = new Uint8Array(t.data), c = new Array(a.length), p = 0; p < a.length; p++) c[p] = a[p];
                        i = String.fromCharCode.apply(null, c)
                    }
                    return r += btoa(i), n(r)
                }, e.decodePacket = function (t, n, r) {
                    if (void 0 === t) return w;
                    if ("string" == typeof t) {
                        if ("b" === t.charAt(0)) return e.decodeBase64Packet(t.substr(1), n);
                        if (r && (t = a(t), t === !1)) return w;
                        var o = t.charAt(0);
                        return Number(o) == o && b[o] ? t.length > 1 ? {
                            type: b[o],
                            data: t.substring(1)
                        } : {type: b[o]} : w
                    }
                    var i = new Uint8Array(t), o = i[0], s = f(t, 1);
                    return k && "blob" === n && (s = new k([s])), {type: b[o], data: s}
                }, e.decodeBase64Packet = function (t, e) {
                    var n = b[t.charAt(0)];
                    if (!p) return {type: n, data: {base64: !0, data: t.substr(1)}};
                    var r = p.decode(t.substr(1));
                    return "blob" === e && k && (r = new k([r])), {type: n, data: r}
                }, e.encodePayload = function (t, n, r) {
                    function o(t) {
                        return t.length + ":" + t
                    }

                    function i(t, r) {
                        e.encodePacket(t, !!s && n, !1, function (t) {
                            r(null, o(t))
                        })
                    }

                    "function" == typeof n && (r = n, n = null);
                    var s = h(t);
                    return n && s ? k && !g ? e.encodePayloadAsBlob(t, r) : e.encodePayloadAsArrayBuffer(t, r) : t.length ? void c(t, i, function (t, e) {
                        return r(e.join(""))
                    }) : r("0:")
                }, e.decodePayload = function (t, n, r) {
                    if ("string" != typeof t) return e.decodePayloadAsBinary(t, n, r);
                    "function" == typeof n && (r = n, n = null);
                    var o;
                    if ("" === t) return r(w, 0, 1);
                    for (var i, s, a = "", c = 0, p = t.length; c < p; c++) {
                        var u = t.charAt(c);
                        if (":" === u) {
                            if ("" === a || a != (i = Number(a))) return r(w, 0, 1);
                            if (s = t.substr(c + 1, i), a != s.length) return r(w, 0, 1);
                            if (s.length) {
                                if (o = e.decodePacket(s, n, !1), w.type === o.type && w.data === o.data) return r(w, 0, 1);
                                var h = r(o, c + i, p);
                                if (!1 === h) return
                            }
                            c += i, a = ""
                        } else a += u
                    }
                    return "" !== a ? r(w, 0, 1) : void 0
                }, e.encodePayloadAsArrayBuffer = function (t, n) {
                    function r(t, n) {
                        e.encodePacket(t, !0, !0, function (t) {
                            return n(null, t)
                        })
                    }

                    return t.length ? void c(t, r, function (t, e) {
                        var r = e.reduce(function (t, e) {
                            var n;
                            return n = "string" == typeof e ? e.length : e.byteLength, t + n.toString().length + n + 2
                        }, 0), o = new Uint8Array(r), i = 0;
                        return e.forEach(function (t) {
                            var e = "string" == typeof t, n = t;
                            if (e) {
                                for (var r = new Uint8Array(t.length), s = 0; s < t.length; s++) r[s] = t.charCodeAt(s);
                                n = r.buffer
                            }
                            e ? o[i++] = 0 : o[i++] = 1;
                            for (var a = n.byteLength.toString(), s = 0; s < a.length; s++) o[i++] = parseInt(a[s]);
                            o[i++] = 255;
                            for (var r = new Uint8Array(n), s = 0; s < r.length; s++) o[i++] = r[s]
                        }), n(o.buffer)
                    }) : n(new ArrayBuffer(0))
                }, e.encodePayloadAsBlob = function (t, n) {
                    function r(t, n) {
                        e.encodePacket(t, !0, !0, function (t) {
                            var e = new Uint8Array(1);
                            if (e[0] = 1, "string" == typeof t) {
                                for (var r = new Uint8Array(t.length), o = 0; o < t.length; o++) r[o] = t.charCodeAt(o);
                                t = r.buffer, e[0] = 0
                            }
                            for (var i = t instanceof ArrayBuffer ? t.byteLength : t.size, s = i.toString(), a = new Uint8Array(s.length + 1), o = 0; o < s.length; o++) a[o] = parseInt(s[o]);
                            if (a[s.length] = 255, k) {
                                var c = new k([e.buffer, a.buffer, t]);
                                n(null, c)
                            }
                        })
                    }

                    c(t, r, function (t, e) {
                        return n(new k(e))
                    })
                }, e.decodePayloadAsBinary = function (t, n, r) {
                    "function" == typeof n && (r = n, n = null);
                    for (var o = t, i = []; o.byteLength > 0;) {
                        for (var s = new Uint8Array(o), a = 0 === s[0], c = "", p = 1; 255 !== s[p]; p++) {
                            if (c.length > 310) return r(w, 0, 1);
                            c += s[p]
                        }
                        o = f(o, 2 + c.length), c = parseInt(c);
                        var u = f(o, 0, c);
                        if (a) try {
                            u = String.fromCharCode.apply(null, new Uint8Array(u))
                        } catch (h) {
                            var l = new Uint8Array(u);
                            u = "";
                            for (var p = 0; p < l.length; p++) u += String.fromCharCode(l[p])
                        }
                        i.push(u), o = f(o, c)
                    }
                    var d = i.length;
                    i.forEach(function (t, o) {
                        r(e.decodePacket(t, n, !0), o, d)
                    })
                }
            }, function (t, e) {
                t.exports = Object.keys || function (t) {
                    var e = [], n = Object.prototype.hasOwnProperty;
                    for (var r in t) n.call(t, r) && e.push(r);
                    return e
                }
            }, function (t, e, n) {
                function r(t) {
                    if (!t || "object" != typeof t) return !1;
                    if (o(t)) {
                        for (var e = 0, n = t.length; e < n; e++) if (r(t[e])) return !0;
                        return !1
                    }
                    if ("function" == typeof Buffer && Buffer.isBuffer && Buffer.isBuffer(t) || "function" == typeof ArrayBuffer && t instanceof ArrayBuffer || s && t instanceof Blob || a && t instanceof File) return !0;
                    if (t.toJSON && "function" == typeof t.toJSON && 1 === arguments.length) return r(t.toJSON(), !0);
                    for (var i in t) if (Object.prototype.hasOwnProperty.call(t, i) && r(t[i])) return !0;
                    return !1
                }

                var o = n(10), i = Object.prototype.toString,
                    s = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === i.call(Blob),
                    a = "function" == typeof File || "undefined" != typeof File && "[object FileConstructor]" === i.call(File);
                t.exports = r
            }, function (t, e) {
                t.exports = function (t, e, n) {
                    var r = t.byteLength;
                    if (e = e || 0, n = n || r, t.slice) return t.slice(e, n);
                    if (e < 0 && (e += r), n < 0 && (n += r), n > r && (n = r), e >= r || e >= n || 0 === r) return new ArrayBuffer(0);
                    for (var o = new Uint8Array(t), i = new Uint8Array(n - e), s = e, a = 0; s < n; s++, a++) i[a] = o[s];
                    return i.buffer
                }
            }, function (t, e) {
                function n(t, e, n) {
                    function o(t, r) {
                        if (o.count <= 0) throw new Error("after called too many times");
                        --o.count, t ? (i = !0, e(t), e = n) : 0 !== o.count || i || e(null, r)
                    }

                    var i = !1;
                    return n = n || r, o.count = t, 0 === t ? e() : o
                }

                function r() {
                }

                t.exports = n
            }, function (t, e) {
                function n(t) {
                    for (var e, n, r = [], o = 0, i = t.length; o < i;) e = t.charCodeAt(o++), e >= 55296 && e <= 56319 && o < i ? (n = t.charCodeAt(o++), 56320 == (64512 & n) ? r.push(((1023 & e) << 10) + (1023 & n) + 65536) : (r.push(e), o--)) : r.push(e);
                    return r
                }

                function r(t) {
                    for (var e, n = t.length, r = -1, o = ""; ++r < n;) e = t[r], e > 65535 && (e -= 65536, o += d(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), o += d(e);
                    return o
                }

                function o(t, e) {
                    if (t >= 55296 && t <= 57343) {
                        if (e) throw Error("Lone surrogate U+" + t.toString(16).toUpperCase() + " is not a scalar value");
                        return !1
                    }
                    return !0
                }

                function i(t, e) {
                    return d(t >> e & 63 | 128)
                }

                function s(t, e) {
                    if (0 == (4294967168 & t)) return d(t);
                    var n = "";
                    return 0 == (4294965248 & t) ? n = d(t >> 6 & 31 | 192) : 0 == (4294901760 & t) ? (o(t, e) || (t = 65533), n = d(t >> 12 & 15 | 224), n += i(t, 6)) : 0 == (4292870144 & t) && (n = d(t >> 18 & 7 | 240), n += i(t, 12), n += i(t, 6)), n += d(63 & t | 128)
                }

                function a(t, e) {
                    e = e || {};
                    for (var r, o = !1 !== e.strict, i = n(t), a = i.length, c = -1, p = ""; ++c < a;) r = i[c], p += s(r, o);
                    return p
                }

                function c() {
                    if (l >= f) throw Error("Invalid byte index");
                    var t = 255 & h[l];
                    if (l++, 128 == (192 & t)) return 63 & t;
                    throw Error("Invalid continuation byte")
                }

                function p(t) {
                    var e, n, r, i, s;
                    if (l > f) throw Error("Invalid byte index");
                    if (l == f) return !1;
                    if (e = 255 & h[l], l++, 0 == (128 & e)) return e;
                    if (192 == (224 & e)) {
                        if (n = c(), s = (31 & e) << 6 | n, s >= 128) return s;
                        throw Error("Invalid continuation byte")
                    }
                    if (224 == (240 & e)) {
                        if (n = c(), r = c(), s = (15 & e) << 12 | n << 6 | r, s >= 2048) return o(s, t) ? s : 65533;
                        throw Error("Invalid continuation byte")
                    }
                    if (240 == (248 & e) && (n = c(), r = c(), i = c(), s = (7 & e) << 18 | n << 12 | r << 6 | i, s >= 65536 && s <= 1114111)) return s;
                    throw Error("Invalid UTF-8 detected")
                }

                function u(t, e) {
                    e = e || {};
                    var o = !1 !== e.strict;
                    h = n(t), f = h.length, l = 0;
                    for (var i, s = []; (i = p(o)) !== !1;) s.push(i);
                    return r(s)
                }/*! https://mths.be/utf8js v2.1.2 by @mathias */
                var h, f, l, d = String.fromCharCode;
                t.exports = {version: "2.1.2", encode: a, decode: u}
            }, function (t, e) {
                !function () {
                    "use strict";
                    for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = new Uint8Array(256), r = 0; r < t.length; r++) n[t.charCodeAt(r)] = r;
                    e.encode = function (e) {
                        var n, r = new Uint8Array(e), o = r.length, i = "";
                        for (n = 0; n < o; n += 3) i += t[r[n] >> 2], i += t[(3 & r[n]) << 4 | r[n + 1] >> 4], i += t[(15 & r[n + 1]) << 2 | r[n + 2] >> 6], i += t[63 & r[n + 2]];
                        return o % 3 === 2 ? i = i.substring(0, i.length - 1) + "=" : o % 3 === 1 && (i = i.substring(0, i.length - 2) + "=="), i
                    }, e.decode = function (t) {
                        var e, r, o, i, s, a = .75 * t.length, c = t.length, p = 0;
                        "=" === t[t.length - 1] && (a--, "=" === t[t.length - 2] && a--);
                        var u = new ArrayBuffer(a), h = new Uint8Array(u);
                        for (e = 0; e < c; e += 4) r = n[t.charCodeAt(e)], o = n[t.charCodeAt(e + 1)], i = n[t.charCodeAt(e + 2)], s = n[t.charCodeAt(e + 3)], h[p++] = r << 2 | o >> 4, h[p++] = (15 & o) << 4 | i >> 2, h[p++] = (3 & i) << 6 | 63 & s;
                        return u
                    }
                }()
            }, function (t, e) {
                function n(t) {
                    return t.map(function (t) {
                        if (t.buffer instanceof ArrayBuffer) {
                            var e = t.buffer;
                            if (t.byteLength !== e.byteLength) {
                                var n = new Uint8Array(t.byteLength);
                                n.set(new Uint8Array(e, t.byteOffset, t.byteLength)), e = n.buffer
                            }
                            return e
                        }
                        return t
                    })
                }

                function r(t, e) {
                    e = e || {};
                    var r = new i;
                    return n(t).forEach(function (t) {
                        r.append(t)
                    }), e.type ? r.getBlob(e.type) : r.getBlob()
                }

                function o(t, e) {
                    return new Blob(n(t), e || {})
                }

                var i = "undefined" != typeof i ? i : "undefined" != typeof WebKitBlobBuilder ? WebKitBlobBuilder : "undefined" != typeof MSBlobBuilder ? MSBlobBuilder : "undefined" != typeof MozBlobBuilder && MozBlobBuilder,
                    s = function () {
                        try {
                            var t = new Blob(["hi"]);
                            return 2 === t.size
                        } catch (e) {
                            return !1
                        }
                    }(), a = s && function () {
                        try {
                            var t = new Blob([new Uint8Array([1, 2])]);
                            return 2 === t.size
                        } catch (e) {
                            return !1
                        }
                    }(), c = i && i.prototype.append && i.prototype.getBlob;
                "undefined" != typeof Blob && (r.prototype = Blob.prototype, o.prototype = Blob.prototype), t.exports = function () {
                    return s ? a ? Blob : o : c ? r : void 0
                }()
            }, function (t, e) {
                e.encode = function (t) {
                    var e = "";
                    for (var n in t) t.hasOwnProperty(n) && (e.length && (e += "&"), e += encodeURIComponent(n) + "=" + encodeURIComponent(t[n]));
                    return e
                }, e.decode = function (t) {
                    for (var e = {}, n = t.split("&"), r = 0, o = n.length; r < o; r++) {
                        var i = n[r].split("=");
                        e[decodeURIComponent(i[0])] = decodeURIComponent(i[1])
                    }
                    return e
                }
            }, function (t, e) {
                t.exports = function (t, e) {
                    var n = function () {
                    };
                    n.prototype = e.prototype, t.prototype = new n, t.prototype.constructor = t
                }
            }, function (t, e) {
                "use strict";

                function n(t) {
                    var e = "";
                    do e = s[t % a] + e, t = Math.floor(t / a); while (t > 0);
                    return e
                }

                function r(t) {
                    var e = 0;
                    for (u = 0; u < t.length; u++) e = e * a + c[t.charAt(u)];
                    return e
                }

                function o() {
                    var t = n(+new Date);
                    return t !== i ? (p = 0, i = t) : t + "." + n(p++)
                }

                for (var i, s = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), a = 64, c = {}, p = 0, u = 0; u < a; u++) c[s[u]] = u;
                o.encode = n, o.decode = r, t.exports = o
            }, function (t, e, n) {
                (function (e) {
                    function r() {
                    }

                    function o() {
                        return "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof e ? e : {}
                    }

                    function i(t) {
                        if (s.call(this, t), this.query = this.query || {}, !c) {
                            var e = o();
                            c = e.___eio = e.___eio || []
                        }
                        this.index = c.length;
                        var n = this;
                        c.push(function (t) {
                            n.onData(t)
                        }), this.query.j = this.index, "function" == typeof addEventListener && addEventListener("beforeunload", function () {
                            n.script && (n.script.onerror = r)
                        }, !1)
                    }

                    var s = n(19), a = n(30);
                    t.exports = i;
                    var c, p = /\n/g, u = /\\n/g;
                    a(i, s), i.prototype.supportsBinary = !1, i.prototype.doClose = function () {
                        this.script && (this.script.parentNode.removeChild(this.script), this.script = null), this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), s.prototype.doClose.call(this)
                    }, i.prototype.doPoll = function () {
                        var t = this, e = document.createElement("script");
                        this.script && (this.script.parentNode.removeChild(this.script), this.script = null), e.async = !0, e.src = this.uri(), e.onerror = function (e) {
                            t.onError("jsonp poll error", e)
                        };
                        var n = document.getElementsByTagName("script")[0];
                        n ? n.parentNode.insertBefore(e, n) : (document.head || document.body).appendChild(e), this.script = e;
                        var r = "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent);
                        r && setTimeout(function () {
                            var t = document.createElement("iframe");
                            document.body.appendChild(t), document.body.removeChild(t)
                        }, 100)
                    }, i.prototype.doWrite = function (t, e) {
                        function n() {
                            r(), e()
                        }

                        function r() {
                            if (o.iframe) try {
                                o.form.removeChild(o.iframe)
                            } catch (t) {
                                o.onError("jsonp polling iframe removal error", t)
                            }
                            try {
                                var e = '<iframe src="javascript:0" name="' + o.iframeId + '">';
                                i = document.createElement(e)
                            } catch (t) {
                                i = document.createElement("iframe"), i.name = o.iframeId, i.src = "javascript:0"
                            }
                            i.id = o.iframeId, o.form.appendChild(i), o.iframe = i
                        }

                        var o = this;
                        if (!this.form) {
                            var i, s = document.createElement("form"), a = document.createElement("textarea"),
                                c = this.iframeId = "eio_iframe_" + this.index;
                            s.className = "socketio", s.style.position = "absolute", s.style.top = "-1000px", s.style.left = "-1000px", s.target = c, s.method = "POST", s.setAttribute("accept-charset", "utf-8"), a.name = "d", s.appendChild(a), document.body.appendChild(s), this.form = s, this.area = a
                        }
                        this.form.action = this.uri(), r(), t = t.replace(u, "\\\n"), this.area.value = t.replace(p, "\\n");
                        try {
                            this.form.submit()
                        } catch (h) {
                        }
                        this.iframe.attachEvent ? this.iframe.onreadystatechange = function () {
                            "complete" === o.iframe.readyState && n()
                        } : this.iframe.onload = n
                    }
                }).call(e, function () {
                    return this
                }())
            }, function (t, e, n) {
                function r(t) {
                    var e = t && t.forceBase64;
                    e && (this.supportsBinary = !1), this.perMessageDeflate = t.perMessageDeflate, this.usingBrowserWebSocket = o && !t.forceNode, this.protocols = t.protocols, this.usingBrowserWebSocket || (l = i), s.call(this, t)
                }

                var o, i, s = n(20), a = n(21), c = n(29), p = n(30), u = n(31), h = n(3)("engine.io-client:websocket");
                if ("undefined" == typeof self) try {
                    i = n(34)
                } catch (f) {
                } else o = self.WebSocket || self.MozWebSocket;
                var l = o || i;
                t.exports = r, p(r, s), r.prototype.name = "websocket", r.prototype.supportsBinary = !0, r.prototype.doOpen = function () {
                    if (this.check()) {
                        var t = this.uri(), e = this.protocols,
                            n = {agent: this.agent, perMessageDeflate: this.perMessageDeflate};
                        n.pfx = this.pfx, n.key = this.key, n.passphrase = this.passphrase, n.cert = this.cert, n.ca = this.ca, n.ciphers = this.ciphers, n.rejectUnauthorized = this.rejectUnauthorized, this.extraHeaders && (n.headers = this.extraHeaders), this.localAddress && (n.localAddress = this.localAddress);
                        try {
                            this.ws = this.usingBrowserWebSocket && !this.isReactNative ? e ? new l(t, e) : new l(t) : new l(t, e, n)
                        } catch (r) {
                            return this.emit("error", r)
                        }
                        void 0 === this.ws.binaryType && (this.supportsBinary = !1), this.ws.supports && this.ws.supports.binary ? (this.supportsBinary = !0, this.ws.binaryType = "nodebuffer") : this.ws.binaryType = "arraybuffer", this.addEventListeners()
                    }
                }, r.prototype.addEventListeners = function () {
                    var t = this;
                    this.ws.onopen = function () {
                        t.onOpen()
                    }, this.ws.onclose = function () {
                        t.onClose()
                    }, this.ws.onmessage = function (e) {
                        t.onData(e.data)
                    }, this.ws.onerror = function (e) {
                        t.onError("websocket error", e)
                    }
                }, r.prototype.write = function (t) {
                    function e() {
                        n.emit("flush"), setTimeout(function () {
                            n.writable = !0, n.emit("drain")
                        }, 0)
                    }

                    var n = this;
                    this.writable = !1;
                    for (var r = t.length, o = 0, i = r; o < i; o++) !function (t) {
                        a.encodePacket(t, n.supportsBinary, function (o) {
                            if (!n.usingBrowserWebSocket) {
                                var i = {};
                                if (t.options && (i.compress = t.options.compress), n.perMessageDeflate) {
                                    var s = "string" == typeof o ? Buffer.byteLength(o) : o.length;
                                    s < n.perMessageDeflate.threshold && (i.compress = !1)
                                }
                            }
                            try {
                                n.usingBrowserWebSocket ? n.ws.send(o) : n.ws.send(o, i)
                            } catch (a) {
                                h("websocket closed before onclose event")
                            }
                            --r || e()
                        })
                    }(t[o])
                }, r.prototype.onClose = function () {
                    s.prototype.onClose.call(this)
                }, r.prototype.doClose = function () {
                    "undefined" != typeof this.ws && this.ws.close()
                }, r.prototype.uri = function () {
                    var t = this.query || {}, e = this.secure ? "wss" : "ws", n = "";
                    this.port && ("wss" === e && 443 !== Number(this.port) || "ws" === e && 80 !== Number(this.port)) && (n = ":" + this.port), this.timestampRequests && (t[this.timestampParam] = u()), this.supportsBinary || (t.b64 = 1), t = c.encode(t), t.length && (t = "?" + t);
                    var r = this.hostname.indexOf(":") !== -1;
                    return e + "://" + (r ? "[" + this.hostname + "]" : this.hostname) + n + this.path + t
                }, r.prototype.check = function () {
                    return !(!l || "__initialize" in l && this.name === r.prototype.name)
                }
            }, function (t, e) {
            }, function (t, e) {
                var n = [].indexOf;
                t.exports = function (t, e) {
                    if (n) return t.indexOf(e);
                    for (var r = 0; r < t.length; ++r) if (t[r] === e) return r;
                    return -1
                }
            }, function (t, e, n) {
                "use strict";

                function r(t, e, n) {
                    this.io = t, this.nsp = e, this.json = this, this.ids = 0, this.acks = {}, this.receiveBuffer = [], this.sendBuffer = [], this.connected = !1, this.disconnected = !0, this.flags = {}, n && n.query && (this.query = n.query), this.io.autoConnect && this.open()
                }

                var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                        return typeof t
                    } : function (t) {
                        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                    }, i = n(7), s = n(8), a = n(37), c = n(38), p = n(39), u = n(3)("socket.io-client:socket"), h = n(29),
                    f = n(23);
                t.exports = e = r;
                var l = {
                    connect: 1,
                    connect_error: 1,
                    connect_timeout: 1,
                    connecting: 1,
                    disconnect: 1,
                    error: 1,
                    reconnect: 1,
                    reconnect_attempt: 1,
                    reconnect_failed: 1,
                    reconnect_error: 1,
                    reconnecting: 1,
                    ping: 1,
                    pong: 1
                }, d = s.prototype.emit;
                s(r.prototype), r.prototype.subEvents = function () {
                    if (!this.subs) {
                        var t = this.io;
                        this.subs = [c(t, "open", p(this, "onopen")), c(t, "packet", p(this, "onpacket")), c(t, "close", p(this, "onclose"))]
                    }
                }, r.prototype.open = r.prototype.connect = function () {
                    return this.connected ? this : (this.subEvents(), this.io.open(), "open" === this.io.readyState && this.onopen(), this.emit("connecting"), this)
                }, r.prototype.send = function () {
                    var t = a(arguments);
                    return t.unshift("message"), this.emit.apply(this, t), this
                }, r.prototype.emit = function (t) {
                    if (l.hasOwnProperty(t)) return d.apply(this, arguments), this;
                    var e = a(arguments), n = {
                        type: (void 0 !== this.flags.binary ? this.flags.binary : f(e)) ? i.BINARY_EVENT : i.EVENT,
                        data: e
                    };
                    return n.options = {}, n.options.compress = !this.flags || !1 !== this.flags.compress, "function" == typeof e[e.length - 1] && (u("emitting packet with ack id %d", this.ids), this.acks[this.ids] = e.pop(), n.id = this.ids++), this.connected ? this.packet(n) : this.sendBuffer.push(n), this.flags = {}, this
                }, r.prototype.packet = function (t) {
                    t.nsp = this.nsp, this.io.packet(t)
                }, r.prototype.onopen = function () {
                    if (u("transport is open - connecting"), "/" !== this.nsp) if (this.query) {
                        var t = "object" === o(this.query) ? h.encode(this.query) : this.query;
                        u("sending connect packet with query %s", t), this.packet({type: i.CONNECT, query: t})
                    } else this.packet({type: i.CONNECT})
                }, r.prototype.onclose = function (t) {
                    u("close (%s)", t), this.connected = !1, this.disconnected = !0, delete this.id, this.emit("disconnect", t)
                }, r.prototype.onpacket = function (t) {
                    var e = t.nsp === this.nsp, n = t.type === i.ERROR && "/" === t.nsp;
                    if (e || n) switch (t.type) {
                        case i.CONNECT:
                            this.onconnect();
                            break;
                        case i.EVENT:
                            this.onevent(t);
                            break;
                        case i.BINARY_EVENT:
                            this.onevent(t);
                            break;
                        case i.ACK:
                            this.onack(t);
                            break;
                        case i.BINARY_ACK:
                            this.onack(t);
                            break;
                        case i.DISCONNECT:
                            this.ondisconnect();
                            break;
                        case i.ERROR:
                            this.emit("error", t.data)
                    }
                }, r.prototype.onevent = function (t) {
                    var e = t.data || [];
                    u("emitting event %j", e), null != t.id && (u("attaching ack callback to event"), e.push(this.ack(t.id))), this.connected ? d.apply(this, e) : this.receiveBuffer.push(e)
                }, r.prototype.ack = function (t) {
                    var e = this, n = !1;
                    return function () {
                        if (!n) {
                            n = !0;
                            var r = a(arguments);
                            u("sending ack %j", r), e.packet({type: f(r) ? i.BINARY_ACK : i.ACK, id: t, data: r})
                        }
                    }
                }, r.prototype.onack = function (t) {
                    var e = this.acks[t.id];
                    "function" == typeof e ? (u("calling ack %s with %j", t.id, t.data), e.apply(this, t.data), delete this.acks[t.id]) : u("bad ack %s", t.id)
                }, r.prototype.onconnect = function () {
                    this.connected = !0, this.disconnected = !1, this.emit("connect"), this.emitBuffered()
                }, r.prototype.emitBuffered = function () {
                    var t;
                    for (t = 0; t < this.receiveBuffer.length; t++) d.apply(this, this.receiveBuffer[t]);
                    for (this.receiveBuffer = [], t = 0; t < this.sendBuffer.length; t++) this.packet(this.sendBuffer[t]);
                    this.sendBuffer = []
                }, r.prototype.ondisconnect = function () {
                    u("server disconnect (%s)", this.nsp), this.destroy(), this.onclose("io server disconnect")
                }, r.prototype.destroy = function () {
                    if (this.subs) {
                        for (var t = 0; t < this.subs.length; t++) this.subs[t].destroy();
                        this.subs = null
                    }
                    this.io.destroy(this)
                }, r.prototype.close = r.prototype.disconnect = function () {
                    return this.connected && (u("performing disconnect (%s)", this.nsp), this.packet({type: i.DISCONNECT})), this.destroy(), this.connected && this.onclose("io client disconnect"), this
                }, r.prototype.compress = function (t) {
                    return this.flags.compress = t, this
                }, r.prototype.binary = function (t) {
                    return this.flags.binary = t, this
                }
            }, function (t, e) {
                function n(t, e) {
                    var n = [];
                    e = e || 0;
                    for (var r = e || 0; r < t.length; r++) n[r - e] = t[r];
                    return n
                }

                t.exports = n
            }, function (t, e) {
                "use strict";

                function n(t, e, n) {
                    return t.on(e, n), {
                        destroy: function () {
                            t.removeListener(e, n)
                        }
                    }
                }

                t.exports = n
            }, function (t, e) {
                var n = [].slice;
                t.exports = function (t, e) {
                    if ("string" == typeof e && (e = t[e]), "function" != typeof e) throw new Error("bind() requires a function");
                    var r = n.call(arguments, 2);
                    return function () {
                        return e.apply(t, r.concat(n.call(arguments)))
                    }
                }
            }, function (t, e) {
                function n(t) {
                    t = t || {}, this.ms = t.min || 100, this.max = t.max || 1e4, this.factor = t.factor || 2, this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0, this.attempts = 0
                }

                t.exports = n, n.prototype.duration = function () {
                    var t = this.ms * Math.pow(this.factor, this.attempts++);
                    if (this.jitter) {
                        var e = Math.random(), n = Math.floor(e * this.jitter * t);
                        t = 0 == (1 & Math.floor(10 * e)) ? t - n : t + n
                    }
                    return 0 | Math.min(t, this.max)
                }, n.prototype.reset = function () {
                    this.attempts = 0
                }, n.prototype.setMin = function (t) {
                    this.ms = t
                }, n.prototype.setMax = function (t) {
                    this.max = t
                }, n.prototype.setJitter = function (t) {
                    this.jitter = t
                }
            }])
        });
        //window.io=this.io;
        'use strict';
        "use strict";var RTCMultiConnection=function(roomid,forceOptions){function SocketConnection(connection,connectCallback){function isData(session){return!session.audio&&!session.video&&!session.screen&&session.data}function updateExtraBackup(remoteUserId,extra){connection.peersBackup[remoteUserId]||(connection.peersBackup[remoteUserId]={userid:remoteUserId,extra:{}}),connection.peersBackup[remoteUserId].extra=extra}function onMessageEvent(message){if(message.remoteUserId==connection.userid){if(connection.peers[message.sender]&&connection.peers[message.sender].extra!=message.message.extra&&(connection.peers[message.sender].extra=message.extra,connection.onExtraDataUpdated({userid:message.sender,extra:message.extra}),updateExtraBackup(message.sender,message.extra)),message.message.streamSyncNeeded&&connection.peers[message.sender]){var stream=connection.streamEvents[message.message.streamid];if(!stream||!stream.stream)return;var action=message.message.action;if("ended"===action||"inactive"===action||"stream-removed"===action)return connection.peersBackup[stream.userid]&&(stream.extra=connection.peersBackup[stream.userid].extra),void connection.onstreamended(stream);var type="both"!=message.message.type?message.message.type:null;return void("function"==typeof stream.stream[action]&&stream.stream[action](type))}if("dropPeerConnection"===message.message)return void connection.deletePeer(message.sender);if(message.message.allParticipants)return message.message.allParticipants.indexOf(message.sender)===-1&&message.message.allParticipants.push(message.sender),void message.message.allParticipants.forEach(function(participant){mPeer[connection.peers[participant]?"renegotiatePeer":"createNewPeer"](participant,{localPeerSdpConstraints:{OfferToReceiveAudio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:connection.sdpConstraints.mandatory.OfferToReceiveVideo},remotePeerSdpConstraints:{OfferToReceiveAudio:connection.session.oneway?!!connection.session.audio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:connection.session.oneway?!!connection.session.video||!!connection.session.screen:connection.sdpConstraints.mandatory.OfferToReceiveVideo},isOneWay:!!connection.session.oneway||"one-way"===connection.direction,isDataOnly:isData(connection.session)})});if(message.message.newParticipant){if(message.message.newParticipant==connection.userid)return;if(connection.peers[message.message.newParticipant])return;return void mPeer.createNewPeer(message.message.newParticipant,message.message.userPreferences||{localPeerSdpConstraints:{OfferToReceiveAudio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:connection.sdpConstraints.mandatory.OfferToReceiveVideo},remotePeerSdpConstraints:{OfferToReceiveAudio:connection.session.oneway?!!connection.session.audio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:connection.session.oneway?!!connection.session.video||!!connection.session.screen:connection.sdpConstraints.mandatory.OfferToReceiveVideo},isOneWay:!!connection.session.oneway||"one-way"===connection.direction,isDataOnly:isData(connection.session)})}if(message.message.readyForOffer&&(connection.attachStreams.length&&(connection.waitingForLocalMedia=!1),connection.waitingForLocalMedia))return void setTimeout(function(){onMessageEvent(message)},1);if(message.message.newParticipationRequest&&message.sender!==connection.userid){connection.peers[message.sender]&&connection.deletePeer(message.sender);var userPreferences={extra:message.extra||{},localPeerSdpConstraints:message.message.remotePeerSdpConstraints||{OfferToReceiveAudio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:connection.sdpConstraints.mandatory.OfferToReceiveVideo},remotePeerSdpConstraints:message.message.localPeerSdpConstraints||{OfferToReceiveAudio:connection.session.oneway?!!connection.session.audio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:connection.session.oneway?!!connection.session.video||!!connection.session.screen:connection.sdpConstraints.mandatory.OfferToReceiveVideo},isOneWay:"undefined"!=typeof message.message.isOneWay?message.message.isOneWay:!!connection.session.oneway||"one-way"===connection.direction,isDataOnly:"undefined"!=typeof message.message.isDataOnly?message.message.isDataOnly:isData(connection.session),dontGetRemoteStream:"undefined"!=typeof message.message.isOneWay?message.message.isOneWay:!!connection.session.oneway||"one-way"===connection.direction,dontAttachLocalStream:!!message.message.dontGetRemoteStream,connectionDescription:message,successCallback:function(){}};return void connection.onNewParticipant(message.sender,userPreferences)}return message.message.changedUUID&&connection.peers[message.message.oldUUID]&&(connection.peers[message.message.newUUID]=connection.peers[message.message.oldUUID],delete connection.peers[message.message.oldUUID]),message.message.userLeft?(mPeer.onUserLeft(message.sender),void(message.message.autoCloseEntireSession&&connection.leave())):void mPeer.addNegotiatedMessage(message.message,message.sender)}}var parameters="";parameters+="?userid="+connection.userid,parameters+="&sessionid="+connection.sessionid,parameters+="&msgEvent="+connection.socketMessageEvent,parameters+="&socketCustomEvent="+connection.socketCustomEvent,parameters+="&autoCloseEntireSession="+!!connection.autoCloseEntireSession,connection.session.broadcast===!0&&(parameters+="&oneToMany=true"),parameters+="&maxParticipantsAllowed="+connection.maxParticipantsAllowed,connection.enableScalableBroadcast&&(parameters+="&enableScalableBroadcast=true",parameters+="&maxRelayLimitPerUser="+(connection.maxRelayLimitPerUser||2)),parameters+="&extra="+JSON.stringify(connection.extra||{}),connection.socketCustomParameters&&(parameters+=connection.socketCustomParameters);try{io.sockets={}}catch(e){}if(connection.socketURL||(connection.socketURL="/"),"/"!=connection.socketURL.substr(connection.socketURL.length-1,1))throw'"socketURL" MUST end with a slash.';connection.enableLogs&&("/"==connection.socketURL?console.info("socket.io url is: ",location.origin+"/"):console.info("socket.io url is: ",connection.socketURL));try{connection.socket=io(connection.socketURL+parameters)}catch(e){connection.socket=window.io.connect(connection.socketURL+parameters,connection.socketOptions)}var mPeer=connection.multiPeersHandler;connection.socket.on("extra-data-updated",function(remoteUserId,extra){connection.peers[remoteUserId]&&(connection.peers[remoteUserId].extra=extra,connection.onExtraDataUpdated({userid:remoteUserId,extra:extra}),updateExtraBackup(remoteUserId,extra))}),connection.socket.on(connection.socketMessageEvent,onMessageEvent);var alreadyConnected=!1;connection.socket.resetProps=function(){alreadyConnected=!1},connection.socket.on("connect",function(){alreadyConnected||(alreadyConnected=!0,connection.enableLogs&&console.info("socket.io connection is opened."),setTimeout(function(){connection.socket.emit("extra-data-updated",connection.extra)},1e3),connectCallback&&connectCallback(connection.socket))}),connection.socket.on("disconnect",function(event){connection.onSocketDisconnect(event)}),connection.socket.on("error",function(event){connection.onSocketError(event)}),connection.socket.on("user-disconnected",function(remoteUserId){remoteUserId!==connection.userid&&(connection.onUserStatusChanged({userid:remoteUserId,status:"offline",extra:connection.peers[remoteUserId]?connection.peers[remoteUserId].extra||{}:{}}),connection.deletePeer(remoteUserId))}),connection.socket.on("user-connected",function(userid){userid!==connection.userid&&connection.onUserStatusChanged({userid:userid,status:"online",extra:connection.peers[userid]?connection.peers[userid].extra||{}:{}})}),connection.socket.on("closed-entire-session",function(sessionid,extra){connection.leave(),connection.onEntireSessionClosed({sessionid:sessionid,userid:sessionid,extra:extra})}),connection.socket.on("userid-already-taken",function(useridAlreadyTaken,yourNewUserId){connection.onUserIdAlreadyTaken(useridAlreadyTaken,yourNewUserId)}),connection.socket.on("logs",function(log){connection.enableLogs&&console.debug("server-logs",log)}),connection.socket.on("number-of-broadcast-viewers-updated",function(data){connection.onNumberOfBroadcastViewersUpdated(data)}),connection.socket.on("set-isInitiator-true",function(sessionid){sessionid==connection.sessionid&&(connection.isInitiator=!0)})}function MultiPeers(connection){function initFileBufferReader(){connection.fbr=new FileBufferReader,connection.fbr.onProgress=function(chunk){connection.onFileProgress(chunk)},connection.fbr.onBegin=function(file){connection.onFileStart(file)},connection.fbr.onEnd=function(file){connection.onFileEnd(file)}}var self=this,skipPeers=["getAllParticipants","getLength","selectFirst","streams","send","forEach"];connection.peers={getLength:function(){var numberOfPeers=0;for(var peer in this)skipPeers.indexOf(peer)==-1&&numberOfPeers++;return numberOfPeers},selectFirst:function(){var firstPeer;for(var peer in this)skipPeers.indexOf(peer)==-1&&(firstPeer=this[peer]);return firstPeer},getAllParticipants:function(sender){var allPeers=[];for(var peer in this)skipPeers.indexOf(peer)==-1&&peer!=sender&&allPeers.push(peer);return allPeers},forEach:function(callbcak){this.getAllParticipants().forEach(function(participant){callbcak(connection.peers[participant])})},send:function(data,remoteUserId){var that=this;if(!isNull(data.size)&&!isNull(data.type)){if(connection.enableFileSharing)return void self.shareFile(data,remoteUserId);"string"!=typeof data&&(data=JSON.stringify(data))}if(!("text"===data.type||data instanceof ArrayBuffer||data instanceof DataView))return void TextSender.send({text:data,channel:this,connection:connection,remoteUserId:remoteUserId});if("text"===data.type&&(data=JSON.stringify(data)),remoteUserId){var remoteUser=connection.peers[remoteUserId];if(remoteUser)return remoteUser.channels.length?void remoteUser.channels.forEach(function(channel){channel.send(data)}):(connection.peers[remoteUserId].createDataChannel(),connection.renegotiate(remoteUserId),void setTimeout(function(){that.send(data,remoteUserId)},3e3))}this.getAllParticipants().forEach(function(participant){return that[participant].channels.length?void that[participant].channels.forEach(function(channel){channel.send(data)}):(connection.peers[participant].createDataChannel(),connection.renegotiate(participant),void setTimeout(function(){that[participant].channels.forEach(function(channel){channel.send(data)})},3e3))})}},this.uuid=connection.userid,this.getLocalConfig=function(remoteSdp,remoteUserId,userPreferences){return userPreferences||(userPreferences={}),{streamsToShare:userPreferences.streamsToShare||{},rtcMultiConnection:connection,connectionDescription:userPreferences.connectionDescription,userid:remoteUserId,localPeerSdpConstraints:userPreferences.localPeerSdpConstraints,remotePeerSdpConstraints:userPreferences.remotePeerSdpConstraints,dontGetRemoteStream:!!userPreferences.dontGetRemoteStream,dontAttachLocalStream:!!userPreferences.dontAttachLocalStream,renegotiatingPeer:!!userPreferences.renegotiatingPeer,peerRef:userPreferences.peerRef,channels:userPreferences.channels||[],onLocalSdp:function(localSdp){self.onNegotiationNeeded(localSdp,remoteUserId)},onLocalCandidate:function(localCandidate){localCandidate=OnIceCandidateHandler.processCandidates(connection,localCandidate),localCandidate&&self.onNegotiationNeeded(localCandidate,remoteUserId)},remoteSdp:remoteSdp,onDataChannelMessage:function(message){if(!connection.fbr&&connection.enableFileSharing&&initFileBufferReader(),"string"==typeof message||!connection.enableFileSharing)return void self.onDataChannelMessage(message,remoteUserId);var that=this;return message instanceof ArrayBuffer||message instanceof DataView?void connection.fbr.convertToObject(message,function(object){that.onDataChannelMessage(object)}):message.readyForNextChunk?void connection.fbr.getNextChunk(message,function(nextChunk,isLastChunk){connection.peers[remoteUserId].channels.forEach(function(channel){channel.send(nextChunk)})},remoteUserId):message.chunkMissing?void connection.fbr.chunkMissing(message):void connection.fbr.addChunk(message,function(promptNextChunk){connection.peers[remoteUserId].peer.channel.send(promptNextChunk)})},onDataChannelError:function(error){self.onDataChannelError(error,remoteUserId)},onDataChannelOpened:function(channel){self.onDataChannelOpened(channel,remoteUserId)},onDataChannelClosed:function(event){self.onDataChannelClosed(event,remoteUserId)},onRemoteStream:function(stream){connection.peers[remoteUserId]&&connection.peers[remoteUserId].streams.push(stream),self.onGettingRemoteMedia(stream,remoteUserId)},onRemoteStreamRemoved:function(stream){self.onRemovingRemoteMedia(stream,remoteUserId)},onPeerStateChanged:function(states){self.onPeerStateChanged(states),"new"===states.iceConnectionState&&self.onNegotiationStarted(remoteUserId,states),"connected"===states.iceConnectionState&&self.onNegotiationCompleted(remoteUserId,states),states.iceConnectionState.search(/closed|failed/gi)!==-1&&(self.onUserLeft(remoteUserId),self.disconnectWith(remoteUserId))}}},this.createNewPeer=function(remoteUserId,userPreferences){if(!(connection.maxParticipantsAllowed<=connection.getAllParticipants().length)){if(userPreferences=userPreferences||{},connection.isInitiator&&connection.session.audio&&"two-way"===connection.session.audio&&!userPreferences.streamsToShare&&(userPreferences.isOneWay=!1,userPreferences.isDataOnly=!1,userPreferences.session=connection.session),!userPreferences.isOneWay&&!userPreferences.isDataOnly)return userPreferences.isOneWay=!0,void this.onNegotiationNeeded({enableMedia:!0,userPreferences:userPreferences},remoteUserId);userPreferences=connection.setUserPreferences(userPreferences,remoteUserId);var localConfig=this.getLocalConfig(null,remoteUserId,userPreferences);connection.peers[remoteUserId]=new PeerInitiator(localConfig)}},this.createAnsweringPeer=function(remoteSdp,remoteUserId,userPreferences){userPreferences=connection.setUserPreferences(userPreferences||{},remoteUserId);var localConfig=this.getLocalConfig(remoteSdp,remoteUserId,userPreferences);connection.peers[remoteUserId]=new PeerInitiator(localConfig)},this.renegotiatePeer=function(remoteUserId,userPreferences,remoteSdp){if(!connection.peers[remoteUserId])return void(connection.enableLogs&&console.error("Peer ("+remoteUserId+") does not exist. Renegotiation skipped."));userPreferences||(userPreferences={}),userPreferences.renegotiatingPeer=!0,userPreferences.peerRef=connection.peers[remoteUserId].peer,userPreferences.channels=connection.peers[remoteUserId].channels;var localConfig=this.getLocalConfig(remoteSdp,remoteUserId,userPreferences);connection.peers[remoteUserId]=new PeerInitiator(localConfig)},this.replaceTrack=function(track,remoteUserId,isVideoTrack){if(!connection.peers[remoteUserId])throw"This peer ("+remoteUserId+") does not exist.";var peer=connection.peers[remoteUserId].peer;return peer.getSenders&&"function"==typeof peer.getSenders&&peer.getSenders().length?void peer.getSenders().forEach(function(rtpSender){isVideoTrack&&"video"===rtpSender.track.kind&&(connection.peers[remoteUserId].peer.lastVideoTrack=rtpSender.track,rtpSender.replaceTrack(track)),isVideoTrack||"audio"!==rtpSender.track.kind||(connection.peers[remoteUserId].peer.lastAudioTrack=rtpSender.track,rtpSender.replaceTrack(track))}):(console.warn("RTPSender.replaceTrack is NOT supported."),void this.renegotiatePeer(remoteUserId))},this.onNegotiationNeeded=function(message,remoteUserId){},this.addNegotiatedMessage=function(message,remoteUserId){if(message.type&&message.sdp)return"answer"==message.type&&connection.peers[remoteUserId]&&connection.peers[remoteUserId].addRemoteSdp(message),"offer"==message.type&&(message.renegotiatingPeer?this.renegotiatePeer(remoteUserId,null,message):this.createAnsweringPeer(message,remoteUserId)),void(connection.enableLogs&&console.log("Remote peer's sdp:",message.sdp));if(message.candidate)return connection.peers[remoteUserId]&&connection.peers[remoteUserId].addRemoteCandidate(message),void(connection.enableLogs&&console.log("Remote peer's candidate pairs:",message.candidate));if(message.enableMedia){connection.session=message.userPreferences.session||connection.session,connection.session.oneway&&connection.attachStreams.length&&(connection.attachStreams=[]),message.userPreferences.isDataOnly&&connection.attachStreams.length&&(connection.attachStreams.length=[]);var streamsToShare={};connection.attachStreams.forEach(function(stream){streamsToShare[stream.streamid]={isAudio:!!stream.isAudio,isVideo:!!stream.isVideo,isScreen:!!stream.isScreen}}),message.userPreferences.streamsToShare=streamsToShare,self.onNegotiationNeeded({readyForOffer:!0,userPreferences:message.userPreferences},remoteUserId)}message.readyForOffer&&connection.onReadyForOffer(remoteUserId,message.userPreferences)},this.onGettingRemoteMedia=function(stream,remoteUserId){},this.onRemovingRemoteMedia=function(stream,remoteUserId){},this.onGettingLocalMedia=function(localStream){},this.onLocalMediaError=function(error,constraints){connection.onMediaError(error,constraints)},this.shareFile=function(file,remoteUserId){initFileBufferReader(),connection.fbr.readAsArrayBuffer(file,function(uuid){var arrayOfUsers=connection.getAllParticipants();remoteUserId&&(arrayOfUsers=[remoteUserId]),arrayOfUsers.forEach(function(participant){connection.fbr.getNextChunk(uuid,function(nextChunk){connection.peers[participant].channels.forEach(function(channel){channel.send(nextChunk)})},participant)})},{userid:connection.userid,chunkSize:"Firefox"===DetectRTC.browser.name?15e3:connection.chunkSize||0})};var textReceiver=new TextReceiver(connection);this.onDataChannelMessage=function(message,remoteUserId){textReceiver.receive(JSON.parse(message),remoteUserId,connection.peers[remoteUserId]?connection.peers[remoteUserId].extra:{})},this.onDataChannelClosed=function(event,remoteUserId){event.userid=remoteUserId,event.extra=connection.peers[remoteUserId]?connection.peers[remoteUserId].extra:{},connection.onclose(event)},this.onDataChannelError=function(error,remoteUserId){error.userid=remoteUserId,event.extra=connection.peers[remoteUserId]?connection.peers[remoteUserId].extra:{},connection.onerror(error)},this.onDataChannelOpened=function(channel,remoteUserId){return connection.peers[remoteUserId].channels.length?void(connection.peers[remoteUserId].channels=[channel]):(connection.peers[remoteUserId].channels.push(channel),void connection.onopen({userid:remoteUserId,extra:connection.peers[remoteUserId]?connection.peers[remoteUserId].extra:{},channel:channel}))},this.onPeerStateChanged=function(state){connection.onPeerStateChanged(state)},this.onNegotiationStarted=function(remoteUserId,states){},this.onNegotiationCompleted=function(remoteUserId,states){},this.getRemoteStreams=function(remoteUserId){return remoteUserId=remoteUserId||connection.peers.getAllParticipants()[0],connection.peers[remoteUserId]?connection.peers[remoteUserId].streams:[]}}function fireEvent(obj,eventName,args){if("undefined"!=typeof CustomEvent){var eventDetail={arguments:args,__exposedProps__:args},event=new CustomEvent(eventName,eventDetail);obj.dispatchEvent(event)}}function setHarkEvents(connection,streamEvent){if(streamEvent.stream&&getTracks(streamEvent.stream,"audio").length){if(!connection||!streamEvent)throw"Both arguments are required.";if(connection.onspeaking&&connection.onsilence){if("undefined"==typeof hark)throw"hark.js not found.";hark(streamEvent.stream,{onspeaking:function(){connection.onspeaking(streamEvent)},onsilence:function(){connection.onsilence(streamEvent)},onvolumechange:function(volume,threshold){connection.onvolumechange&&connection.onvolumechange(merge({volume:volume,threshold:threshold},streamEvent))}})}}}function setMuteHandlers(connection,streamEvent){streamEvent.stream&&streamEvent.stream&&streamEvent.stream.addEventListener&&(streamEvent.stream.addEventListener("mute",function(event){event=connection.streamEvents[streamEvent.streamid],event.session={audio:"audio"===event.muteType,video:"video"===event.muteType},connection.onmute(event)},!1),streamEvent.stream.addEventListener("unmute",function(event){event=connection.streamEvents[streamEvent.streamid],event.session={audio:"audio"===event.unmuteType,video:"video"===event.unmuteType},connection.onunmute(event)},!1))}function getRandomString(){if(window.crypto&&window.crypto.getRandomValues&&navigator.userAgent.indexOf("Safari")===-1){for(var a=window.crypto.getRandomValues(new Uint32Array(3)),token="",i=0,l=a.length;i<l;i++)token+=a[i].toString(36);return token}return(Math.random()*(new Date).getTime()).toString(36).replace(/\./g,"")}function getRMCMediaElement(stream,callback,connection){if(!connection.autoCreateMediaElement)return void callback({});var isAudioOnly=!1;getTracks(stream,"video").length||stream.isVideo||stream.isScreen||(isAudioOnly=!0),"Firefox"===DetectRTC.browser.name&&(connection.session.video||connection.session.screen)&&(isAudioOnly=!1);var mediaElement=document.createElement(isAudioOnly?"audio":"video");if(mediaElement.srcObject=stream,mediaElement.setAttribute("autoplay",!0),mediaElement.setAttribute("playsinline",!0),mediaElement.setAttribute("controls",!0),mediaElement.setAttribute("muted",!1),mediaElement.setAttribute("volume",1),"Firefox"===DetectRTC.browser.name){var streamEndedEvent="ended";"oninactive"in mediaElement&&(streamEndedEvent="inactive"),mediaElement.addEventListener(streamEndedEvent,function(){if(currentUserMediaRequest.remove(stream.idInstance),"local"===stream.type){streamEndedEvent="ended","oninactive"in stream&&(streamEndedEvent="inactive"),StreamsHandler.onSyncNeeded(stream.streamid,streamEndedEvent),connection.attachStreams.forEach(function(aStream,idx){stream.streamid===aStream.streamid&&delete connection.attachStreams[idx]});var newStreamsArray=[];connection.attachStreams.forEach(function(aStream){aStream&&newStreamsArray.push(aStream)}),connection.attachStreams=newStreamsArray;var streamEvent=connection.streamEvents[stream.streamid];if(streamEvent)return void connection.onstreamended(streamEvent);this.parentNode&&this.parentNode.removeChild(this)}},!1)}var played=mediaElement.play();if("undefined"!=typeof played){var cbFired=!1;setTimeout(function(){cbFired||(cbFired=!0,callback(mediaElement))},1e3),played.then(function(){cbFired||(cbFired=!0,callback(mediaElement))})["catch"](function(error){cbFired||(cbFired=!0,callback(mediaElement))})}else callback(mediaElement)}function listenEventHandler(eventName,eventHandler){window.removeEventListener(eventName,eventHandler),window.addEventListener(eventName,eventHandler,!1)}function removeNullEntries(array){var newArray=[];return array.forEach(function(item){item&&newArray.push(item)}),newArray}function isData(session){return!session.audio&&!session.video&&!session.screen&&session.data}function isNull(obj){return"undefined"==typeof obj}function isString(obj){return"string"==typeof obj}function isAudioPlusTab(connection,audioPlusTab){return(!connection.session.audio||"two-way"!==connection.session.audio)&&("Firefox"===DetectRTC.browser.name&&audioPlusTab!==!1||!("Chrome"!==DetectRTC.browser.name||DetectRTC.browser.version<50)&&(typeof audioPlusTab===!0||!("undefined"!=typeof audioPlusTab||!connection.session.audio||!connection.session.screen||connection.session.video)&&(audioPlusTab=!0,!0)))}function getTracks(stream,kind){return stream&&stream.getTracks?stream.getTracks().filter(function(t){return t.kind===(kind||"audio")}):[]}function isUnifiedPlanSupportedDefault(){var canAddTransceiver=!1;try{if("undefined"==typeof RTCRtpTransceiver)return!1;if(!("currentDirection"in RTCRtpTransceiver.prototype))return!1;var tempPc=new RTCPeerConnection;try{tempPc.addTransceiver("audio"),canAddTransceiver=!0}catch(e){}tempPc.close()}catch(e){canAddTransceiver=!1}return canAddTransceiver&&isUnifiedPlanSuppored()}function isUnifiedPlanSuppored(){var isUnifiedPlanSupported=!1;try{var pc=new RTCPeerConnection({sdpSemantics:"unified-plan"});try{var config=pc.getConfiguration();isUnifiedPlanSupported="unified-plan"==config.sdpSemantics||("plan-b"==config.sdpSemantics,!1)}catch(e){isUnifiedPlanSupported=!1}}catch(e){isUnifiedPlanSupported=!1}return isUnifiedPlanSupported}function setCordovaAPIs(){if("undefined"!=typeof cordova&&"undefined"!=typeof cordova.plugins&&"undefined"!=typeof cordova.plugins.iosrtc){var iosrtc=cordova.plugins.iosrtc;window.webkitRTCPeerConnection=iosrtc.RTCPeerConnection,window.RTCSessionDescription=iosrtc.RTCSessionDescription,window.RTCIceCandidate=iosrtc.RTCIceCandidate,window.MediaStream=iosrtc.MediaStream,window.MediaStreamTrack=iosrtc.MediaStreamTrack,navigator.getUserMedia=navigator.webkitGetUserMedia=iosrtc.getUserMedia,iosrtc.debug.enable("iosrtc*"),"function"==typeof iosrtc.selectAudioOutput&&iosrtc.selectAudioOutput(window.iOSDefaultAudioOutputDevice||"speaker"),iosrtc.registerGlobals()}}function setSdpConstraints(config){var sdpConstraints={OfferToReceiveAudio:!!config.OfferToReceiveAudio,OfferToReceiveVideo:!!config.OfferToReceiveVideo};return sdpConstraints}function PeerInitiator(config){function setChannelEvents(channel){channel.binaryType="arraybuffer",channel.onmessage=function(event){config.onDataChannelMessage(event.data)},channel.onopen=function(){config.onDataChannelOpened(channel)},channel.onerror=function(error){config.onDataChannelError(error)},channel.onclose=function(event){config.onDataChannelClosed(event)},channel.internalSend=channel.send,channel.send=function(data){"open"===channel.readyState&&channel.internalSend(data)},peer.channel=channel}function createOfferOrAnswer(_method){peer[_method](defaults.sdpConstraints).then(function(localSdp){"Safari"!==DetectRTC.browser.name&&(localSdp.sdp=connection.processSdp(localSdp.sdp)),peer.setLocalDescription(localSdp).then(function(){connection.trickleIce&&(config.onLocalSdp({type:localSdp.type,sdp:localSdp.sdp,remotePeerSdpConstraints:config.remotePeerSdpConstraints||!1,renegotiatingPeer:!!config.renegotiatingPeer||!1,connectionDescription:self.connectionDescription,dontGetRemoteStream:!!config.dontGetRemoteStream,extra:connection?connection.extra:{},streamsToShare:streamsToShare}),connection.onSettingLocalDescription(self))},function(error){connection.enableLogs&&console.error("setLocalDescription error",error)})},function(error){connection.enableLogs&&console.error("sdp-error",error)})}if("undefined"!=typeof window.RTCPeerConnection?RTCPeerConnection=window.RTCPeerConnection:"undefined"!=typeof mozRTCPeerConnection?RTCPeerConnection=mozRTCPeerConnection:"undefined"!=typeof webkitRTCPeerConnection&&(RTCPeerConnection=webkitRTCPeerConnection),RTCSessionDescription=window.RTCSessionDescription||window.mozRTCSessionDescription,RTCIceCandidate=window.RTCIceCandidate||window.mozRTCIceCandidate,MediaStreamTrack=window.MediaStreamTrack,!RTCPeerConnection)throw"WebRTC 1.0 (RTCPeerConnection) API are NOT available in this browser.";var connection=config.rtcMultiConnection;this.extra=config.remoteSdp?config.remoteSdp.extra:connection.extra,this.userid=config.userid,this.streams=[],this.channels=config.channels||[],this.connectionDescription=config.connectionDescription,this.addStream=function(session){connection.addStream(session,self.userid)},this.removeStream=function(streamid){connection.removeStream(streamid,self.userid)};var self=this;config.remoteSdp&&(this.connectionDescription=config.remoteSdp.connectionDescription);var allRemoteStreams={};defaults.sdpConstraints=setSdpConstraints({OfferToReceiveAudio:!0,OfferToReceiveVideo:!0});var peer,renegotiatingPeer=!!config.renegotiatingPeer;config.remoteSdp&&(renegotiatingPeer=!!config.remoteSdp.renegotiatingPeer);var localStreams=[];if(connection.attachStreams.forEach(function(stream){stream&&localStreams.push(stream)}),renegotiatingPeer)peer=config.peerRef;else{var iceTransports="all";(connection.candidates.turn||connection.candidates.relay)&&(connection.candidates.stun||connection.candidates.reflexive||connection.candidates.host||(iceTransports="relay"));try{var params={iceServers:connection.iceServers,iceTransportPolicy:connection.iceTransportPolicy||iceTransports};"undefined"!=typeof connection.iceCandidatePoolSize&&(params.iceCandidatePoolSize=connection.iceCandidatePoolSize),"undefined"!=typeof connection.bundlePolicy&&(params.bundlePolicy=connection.bundlePolicy),"undefined"!=typeof connection.rtcpMuxPolicy&&(params.rtcpMuxPolicy=connection.rtcpMuxPolicy),connection.sdpSemantics&&(params.sdpSemantics=connection.sdpSemantics||"unified-plan"),connection.iceServers&&connection.iceServers.length||(params=null,connection.optionalArgument=null),peer=new RTCPeerConnection(params,connection.optionalArgument)}catch(e){try{var params={iceServers:connection.iceServers};peer=new RTCPeerConnection(params)}catch(e){peer=new RTCPeerConnection}}}!peer.getRemoteStreams&&peer.getReceivers&&(peer.getRemoteStreams=function(){var stream=new MediaStream;return peer.getReceivers().forEach(function(receiver){stream.addTrack(receiver.track)}),[stream]}),!peer.getLocalStreams&&peer.getSenders&&(peer.getLocalStreams=function(){var stream=new MediaStream;return peer.getSenders().forEach(function(sender){stream.addTrack(sender.track)}),[stream]}),peer.onicecandidate=function(event){if(event.candidate)connection.trickleIce&&config.onLocalCandidate({candidate:event.candidate.candidate,sdpMid:event.candidate.sdpMid,sdpMLineIndex:event.candidate.sdpMLineIndex});else if(!connection.trickleIce){var localSdp=peer.localDescription;config.onLocalSdp({type:localSdp.type,sdp:localSdp.sdp,remotePeerSdpConstraints:config.remotePeerSdpConstraints||!1,renegotiatingPeer:!!config.renegotiatingPeer||!1,connectionDescription:self.connectionDescription,dontGetRemoteStream:!!config.dontGetRemoteStream,extra:connection?connection.extra:{},streamsToShare:streamsToShare})}},localStreams.forEach(function(localStream){config.remoteSdp&&config.remoteSdp.remotePeerSdpConstraints&&config.remoteSdp.remotePeerSdpConstraints.dontGetRemoteStream||config.dontAttachLocalStream||(localStream=connection.beforeAddingStream(localStream,self),localStream&&(peer.getLocalStreams().forEach(function(stream){localStream&&stream.id==localStream.id&&(localStream=null)}),localStream&&localStream.getTracks&&localStream.getTracks().forEach(function(track){try{peer.addTrack(track,localStream)}catch(e){}})))}),peer.oniceconnectionstatechange=peer.onsignalingstatechange=function(){var extra=self.extra;connection.peers[self.userid]&&(extra=connection.peers[self.userid].extra||extra),peer&&(config.onPeerStateChanged({iceConnectionState:peer.iceConnectionState,iceGatheringState:peer.iceGatheringState,signalingState:peer.signalingState,extra:extra,userid:self.userid}),peer&&peer.iceConnectionState&&peer.iceConnectionState.search(/closed|failed/gi)!==-1&&self.streams instanceof Array&&self.streams.forEach(function(stream){var streamEvent=connection.streamEvents[stream.id]||{streamid:stream.id,stream:stream,type:"remote"};connection.onstreamended(streamEvent)}))};var sdpConstraints={OfferToReceiveAudio:!!localStreams.length,OfferToReceiveVideo:!!localStreams.length};config.localPeerSdpConstraints&&(sdpConstraints=config.localPeerSdpConstraints),defaults.sdpConstraints=setSdpConstraints(sdpConstraints);var dontDuplicate={};peer.ontrack=function(event){if(event&&"track"===event.type){if(event.stream=event.streams[event.streams.length-1],event.stream.id||(event.stream.id=event.track.id),dontDuplicate[event.stream.id]&&"Safari"!==DetectRTC.browser.name)return void(event.track&&(event.track.onended=function(){peer&&peer.onremovestream(event)}));dontDuplicate[event.stream.id]=event.stream.id;var streamsToShare={};config.remoteSdp&&config.remoteSdp.streamsToShare?streamsToShare=config.remoteSdp.streamsToShare:config.streamsToShare&&(streamsToShare=config.streamsToShare);
            var streamToShare=streamsToShare[event.stream.id];streamToShare?(event.stream.isAudio=streamToShare.isAudio,event.stream.isVideo=streamToShare.isVideo,event.stream.isScreen=streamToShare.isScreen):(event.stream.isVideo=!!getTracks(event.stream,"video").length,event.stream.isAudio=!event.stream.isVideo,event.stream.isScreen=!1),event.stream.streamid=event.stream.id,allRemoteStreams[event.stream.id]=event.stream,config.onRemoteStream(event.stream),event.stream.getTracks().forEach(function(track){track.onended=function(){peer&&peer.onremovestream(event)}}),event.stream.onremovetrack=function(){peer&&peer.onremovestream(event)}}},peer.onremovestream=function(event){event.stream.streamid=event.stream.id,allRemoteStreams[event.stream.id]&&delete allRemoteStreams[event.stream.id],config.onRemoteStreamRemoved(event.stream)},"function"!=typeof peer.removeStream&&(peer.removeStream=function(stream){stream.getTracks().forEach(function(track){peer.removeTrack(track,stream)})}),this.addRemoteCandidate=function(remoteCandidate){peer.addIceCandidate(new RTCIceCandidate(remoteCandidate))},this.addRemoteSdp=function(remoteSdp,cb){cb=cb||function(){},"Safari"!==DetectRTC.browser.name&&(remoteSdp.sdp=connection.processSdp(remoteSdp.sdp)),peer.setRemoteDescription(new RTCSessionDescription(remoteSdp)).then(cb,function(error){connection.enableLogs&&console.error("setRemoteDescription failed","\n",error,"\n",remoteSdp.sdp),cb()})["catch"](function(error){connection.enableLogs&&console.error("setRemoteDescription failed","\n",error,"\n",remoteSdp.sdp),cb()})};var isOfferer=!0;config.remoteSdp&&(isOfferer=!1),this.createDataChannel=function(){var channel=peer.createDataChannel("sctp",{});setChannelEvents(channel)},connection.session.data!==!0||renegotiatingPeer||(isOfferer?this.createDataChannel():peer.ondatachannel=function(event){var channel=event.channel;setChannelEvents(channel)}),this.enableDisableVideoEncoding=function(enable){var rtcp;if(peer.getSenders().forEach(function(sender){rtcp||"video"!==sender.track.kind||(rtcp=sender)}),rtcp&&rtcp.getParameters){var parameters=rtcp.getParameters();parameters.encodings[1]&&(parameters.encodings[1].active=!!enable),parameters.encodings[2]&&(parameters.encodings[2].active=!!enable),rtcp.setParameters(parameters)}},config.remoteSdp&&(config.remoteSdp.remotePeerSdpConstraints&&(sdpConstraints=config.remoteSdp.remotePeerSdpConstraints),defaults.sdpConstraints=setSdpConstraints(sdpConstraints),this.addRemoteSdp(config.remoteSdp,function(){createOfferOrAnswer("createAnswer")})),"two-way"!=connection.session.audio&&"two-way"!=connection.session.video&&"two-way"!=connection.session.screen||(defaults.sdpConstraints=setSdpConstraints({OfferToReceiveAudio:"two-way"==connection.session.audio||config.remoteSdp&&config.remoteSdp.remotePeerSdpConstraints&&config.remoteSdp.remotePeerSdpConstraints.OfferToReceiveAudio,OfferToReceiveVideo:"two-way"==connection.session.video||"two-way"==connection.session.screen||config.remoteSdp&&config.remoteSdp.remotePeerSdpConstraints&&config.remoteSdp.remotePeerSdpConstraints.OfferToReceiveAudio}));var streamsToShare={};peer.getLocalStreams().forEach(function(stream){streamsToShare[stream.streamid]={isAudio:!!stream.isAudio,isVideo:!!stream.isVideo,isScreen:!!stream.isScreen}}),isOfferer&&createOfferOrAnswer("createOffer"),peer.nativeClose=peer.close,peer.close=function(){if(peer){try{peer.nativeClose!==peer.close&&peer.nativeClose()}catch(e){}peer=null,self.peer=null}},this.peer=peer}function setStreamType(constraints,stream){constraints.mandatory&&constraints.mandatory.chromeMediaSource?stream.isScreen=!0:constraints.mozMediaSource||constraints.mediaSource?stream.isScreen=!0:constraints.video?stream.isVideo=!0:constraints.audio&&(stream.isAudio=!0)}function getUserMediaHandler(options){function streaming(stream,returnBack){setStreamType(options.localMediaConstraints,stream);var streamEndedEvent="ended";"oninactive"in stream&&(streamEndedEvent="inactive"),stream.addEventListener(streamEndedEvent,function(){delete currentUserMediaRequest.streams[idInstance],currentUserMediaRequest.mutex=!1,currentUserMediaRequest.queueRequests.indexOf(options)&&(delete currentUserMediaRequest.queueRequests[currentUserMediaRequest.queueRequests.indexOf(options)],currentUserMediaRequest.queueRequests=removeNullEntries(currentUserMediaRequest.queueRequests))},!1),currentUserMediaRequest.streams[idInstance]={stream:stream},currentUserMediaRequest.mutex=!1,currentUserMediaRequest.queueRequests.length&&getUserMediaHandler(currentUserMediaRequest.queueRequests.shift()),options.onGettingLocalMedia(stream,returnBack)}if(currentUserMediaRequest.mutex===!0)return void currentUserMediaRequest.queueRequests.push(options);currentUserMediaRequest.mutex=!0;var idInstance=JSON.stringify(options.localMediaConstraints);if(currentUserMediaRequest.streams[idInstance])streaming(currentUserMediaRequest.streams[idInstance].stream,!0);else{var isBlackBerry=!!/BB10|BlackBerry/i.test(navigator.userAgent||"");if(isBlackBerry||"undefined"==typeof navigator.mediaDevices||"function"!=typeof navigator.mediaDevices.getUserMedia)return navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia,void navigator.getUserMedia(options.localMediaConstraints,function(stream){stream.streamid=stream.streamid||stream.id||getRandomString(),stream.idInstance=idInstance,streaming(stream)},function(error){options.onLocalMediaError(error,options.localMediaConstraints)});if("undefined"==typeof navigator.mediaDevices){navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia;var getUserMediaStream,getUserMediaError,getUserMediaSuccess=function(){},getUserMediaFailure=function(){};navigator.mediaDevices={getUserMedia:function(hints){return navigator.getUserMedia(hints,function(getUserMediaSuccess){getUserMediaSuccess(stream),getUserMediaStream=stream},function(error){getUserMediaFailure(error),getUserMediaError=error}),{then:function(successCB){return getUserMediaStream?void successCB(getUserMediaStream):(getUserMediaSuccess=successCB,{then:function(failureCB){return getUserMediaError?void failureCB(getUserMediaError):void(getUserMediaFailure=failureCB)}})}}}}}if(options.localMediaConstraints.isScreen===!0){if(navigator.mediaDevices.getDisplayMedia)navigator.mediaDevices.getDisplayMedia(options.localMediaConstraints).then(function(stream){stream.streamid=stream.streamid||stream.id||getRandomString(),stream.idInstance=idInstance,streaming(stream)})["catch"](function(error){options.onLocalMediaError(error,options.localMediaConstraints)});else{if(!navigator.getDisplayMedia)throw new Error("getDisplayMedia API is not availabe in this browser.");navigator.getDisplayMedia(options.localMediaConstraints).then(function(stream){stream.streamid=stream.streamid||stream.id||getRandomString(),stream.idInstance=idInstance,streaming(stream)})["catch"](function(error){options.onLocalMediaError(error,options.localMediaConstraints)})}return}navigator.mediaDevices.getUserMedia(options.localMediaConstraints).then(function(stream){stream.streamid=stream.streamid||stream.id||getRandomString(),stream.idInstance=idInstance,streaming(stream)})["catch"](function(error){options.onLocalMediaError(error,options.localMediaConstraints)})}}function TextReceiver(connection){function receive(data,userid,extra){var uuid=data.uuid;if(content[uuid]||(content[uuid]=[]),content[uuid].push(data.message),data.last){var message=content[uuid].join("");data.isobject&&(message=JSON.parse(message));var receivingTime=(new Date).getTime(),latency=receivingTime-data.sendingTime,e={data:message,userid:userid,extra:extra,latency:latency};connection.autoTranslateText?(e.original=e.data,connection.Translator.TranslateText(e.data,function(translatedText){e.data=translatedText,connection.onmessage(e)})):connection.onmessage(e),delete content[uuid]}}var content={};return{receive:receive}}var browserFakeUserAgent="Fake/5.0 (FakeOS) AppleWebKit/123 (KHTML, like Gecko) Fake/12.3.4567.89 Fake/123.45";!function(that){that&&"undefined"==typeof window&&"undefined"!=typeof global&&(global.navigator={userAgent:browserFakeUserAgent,getUserMedia:function(){}},global.console||(global.console={}),"undefined"==typeof global.console.debug&&(global.console.debug=global.console.info=global.console.error=global.console.log=global.console.log||function(){console.log(arguments)}),"undefined"==typeof document&&(that.document={},document.createElement=document.captureStream=document.mozCaptureStream=function(){var obj={getContext:function(){return obj},play:function(){},pause:function(){},drawImage:function(){},toDataURL:function(){return""}};return obj},document.addEventListener=document.removeEventListener=that.addEventListener=that.removeEventListener=function(){},that.HTMLVideoElement=that.HTMLMediaElement=function(){}),"undefined"==typeof io&&(that.io=function(){return{on:function(eventName,callback){callback=callback||function(){},"connect"===eventName&&callback()},emit:function(eventName,data,callback){callback=callback||function(){},"open-room"!==eventName&&"join-room"!==eventName||callback(!0,data.sessionid,null)}}}),"undefined"==typeof location&&(that.location={protocol:"file:",href:"",hash:"",origin:"self"}),"undefined"==typeof screen&&(that.screen={width:0,height:0}),"undefined"==typeof URL&&(that.URL={createObjectURL:function(){return""},revokeObjectURL:function(){return""}}),that.window=global)}("undefined"!=typeof global?global:null),function(){function getBrowserInfo(){var nameOffset,verOffset,ix,nAgt=(navigator.appVersion,navigator.userAgent),browserName=navigator.appName,fullVersion=""+parseFloat(navigator.appVersion),majorVersion=parseInt(navigator.appVersion,10);if(isSafari&&!isChrome&&nAgt.indexOf("CriOS")!==-1&&(isSafari=!1,isChrome=!0),isOpera){browserName="Opera";try{fullVersion=navigator.userAgent.split("OPR/")[1].split(" ")[0],majorVersion=fullVersion.split(".")[0]}catch(e){fullVersion="0.0.0.0",majorVersion=0}}else isIE?(verOffset=nAgt.indexOf("rv:"),verOffset>0?fullVersion=nAgt.substring(verOffset+3):(verOffset=nAgt.indexOf("MSIE"),fullVersion=nAgt.substring(verOffset+5)),browserName="IE"):isChrome?(verOffset=nAgt.indexOf("Chrome"),browserName="Chrome",fullVersion=nAgt.substring(verOffset+7)):isSafari?(verOffset=nAgt.indexOf("Safari"),browserName="Safari",fullVersion=nAgt.substring(verOffset+7),(verOffset=nAgt.indexOf("Version"))!==-1&&(fullVersion=nAgt.substring(verOffset+8)),navigator.userAgent.indexOf("Version/")!==-1&&(fullVersion=navigator.userAgent.split("Version/")[1].split(" ")[0])):isFirefox?(verOffset=nAgt.indexOf("Firefox"),browserName="Firefox",fullVersion=nAgt.substring(verOffset+8)):(nameOffset=nAgt.lastIndexOf(" ")+1)<(verOffset=nAgt.lastIndexOf("/"))&&(browserName=nAgt.substring(nameOffset,verOffset),fullVersion=nAgt.substring(verOffset+1),browserName.toLowerCase()===browserName.toUpperCase()&&(browserName=navigator.appName));return isEdge&&(browserName="Edge",fullVersion=navigator.userAgent.split("Edge/")[1]),(ix=fullVersion.search(/[; \)]/))!==-1&&(fullVersion=fullVersion.substring(0,ix)),majorVersion=parseInt(""+fullVersion,10),isNaN(majorVersion)&&(fullVersion=""+parseFloat(navigator.appVersion),majorVersion=parseInt(navigator.appVersion,10)),{fullVersion:fullVersion,version:majorVersion,name:browserName,isPrivateBrowsing:!1}}function retry(isDone,next){var currentTrial=0,maxRetry=50,isTimeout=!1,id=window.setInterval(function(){isDone()&&(window.clearInterval(id),next(isTimeout)),currentTrial++>maxRetry&&(window.clearInterval(id),isTimeout=!0,next(isTimeout))},10)}function isIE10OrLater(userAgent){var ua=userAgent.toLowerCase();if(0===ua.indexOf("msie")&&0===ua.indexOf("trident"))return!1;var match=/(?:msie|rv:)\s?([\d\.]+)/.exec(ua);return!!(match&&parseInt(match[1],10)>=10)}function detectPrivateMode(callback){var isPrivate;try{if(window.webkitRequestFileSystem)window.webkitRequestFileSystem(window.TEMPORARY,1,function(){isPrivate=!1},function(e){isPrivate=!0});else if(window.indexedDB&&/Firefox/.test(window.navigator.userAgent)){var db;try{db=window.indexedDB.open("test"),db.onerror=function(){return!0}}catch(e){isPrivate=!0}"undefined"==typeof isPrivate&&retry(function(){return"done"===db.readyState},function(isTimeout){isTimeout||(isPrivate=!db.result)})}else if(isIE10OrLater(window.navigator.userAgent)){isPrivate=!1;try{window.indexedDB||(isPrivate=!0)}catch(e){isPrivate=!0}}else if(window.localStorage&&/Safari/.test(window.navigator.userAgent)){try{window.localStorage.setItem("test",1)}catch(e){isPrivate=!0}"undefined"==typeof isPrivate&&(isPrivate=!1,window.localStorage.removeItem("test"))}}catch(e){isPrivate=!1}retry(function(){return"undefined"!=typeof isPrivate},function(isTimeout){callback(isPrivate)})}function detectDesktopOS(){for(var cs,unknown="-",nVer=navigator.appVersion,nAgt=navigator.userAgent,os=unknown,clientStrings=[{s:"Windows 10",r:/(Windows 10.0|Windows NT 10.0)/},{s:"Windows 8.1",r:/(Windows 8.1|Windows NT 6.3)/},{s:"Windows 8",r:/(Windows 8|Windows NT 6.2)/},{s:"Windows 7",r:/(Windows 7|Windows NT 6.1)/},{s:"Windows Vista",r:/Windows NT 6.0/},{s:"Windows Server 2003",r:/Windows NT 5.2/},{s:"Windows XP",r:/(Windows NT 5.1|Windows XP)/},{s:"Windows 2000",r:/(Windows NT 5.0|Windows 2000)/},{s:"Windows ME",r:/(Win 9x 4.90|Windows ME)/},{s:"Windows 98",r:/(Windows 98|Win98)/},{s:"Windows 95",r:/(Windows 95|Win95|Windows_95)/},{s:"Windows NT 4.0",r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},{s:"Windows CE",r:/Windows CE/},{s:"Windows 3.11",r:/Win16/},{s:"Android",r:/Android/},{s:"Open BSD",r:/OpenBSD/},{s:"Sun OS",r:/SunOS/},{s:"Linux",r:/(Linux|X11)/},{s:"iOS",r:/(iPhone|iPad|iPod)/},{s:"Mac OS X",r:/Mac OS X/},{s:"Mac OS",r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},{s:"QNX",r:/QNX/},{s:"UNIX",r:/UNIX/},{s:"BeOS",r:/BeOS/},{s:"OS/2",r:/OS\/2/},{s:"Search Bot",r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}],i=0;cs=clientStrings[i];i++)if(cs.r.test(nAgt)){os=cs.s;break}var osVersion=unknown;switch(/Windows/.test(os)&&(/Windows (.*)/.test(os)&&(osVersion=/Windows (.*)/.exec(os)[1]),os="Windows"),os){case"Mac OS X":/Mac OS X (10[\.\_\d]+)/.test(nAgt)&&(osVersion=/Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1]);break;case"Android":/Android ([\.\_\d]+)/.test(nAgt)&&(osVersion=/Android ([\.\_\d]+)/.exec(nAgt)[1]);break;case"iOS":/OS (\d+)_(\d+)_?(\d+)?/.test(nAgt)&&(osVersion=/OS (\d+)_(\d+)_?(\d+)?/.exec(nVer),osVersion=osVersion[1]+"."+osVersion[2]+"."+(0|osVersion[3]))}return{osName:os,osVersion:osVersion}}function getAndroidVersion(ua){ua=(ua||navigator.userAgent).toLowerCase();var match=ua.match(/android\s([0-9\.]*)/);return!!match&&match[1]}function DetectLocalIPAddress(callback,stream){if(DetectRTC.isWebRTCSupported){var isPublic=!0,isIpv4=!0;getIPs(function(ip){ip?ip.match(regexIpv4Local)?(isPublic=!1,callback("Local: "+ip,isPublic,isIpv4)):ip.match(regexIpv6)?(isIpv4=!1,callback("Public: "+ip,isPublic,isIpv4)):callback("Public: "+ip,isPublic,isIpv4):callback()},stream)}}function getIPs(callback,stream){function handleCandidate(candidate){if(!candidate)return void callback();var match=regexIpv4.exec(candidate);if(match){var ipAddress=match[1],isPublic=candidate.match(regexIpv4Local),isIpv4=!0;void 0===ipDuplicates[ipAddress]&&callback(ipAddress,isPublic,isIpv4),ipDuplicates[ipAddress]=!0}}function afterCreateOffer(){var lines=pc.localDescription.sdp.split("\n");lines.forEach(function(line){line&&0===line.indexOf("a=candidate:")&&handleCandidate(line)})}if("undefined"!=typeof document&&"function"==typeof document.getElementById){var ipDuplicates={},RTCPeerConnection=window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection;if(!RTCPeerConnection){var iframe=document.getElementById("iframe");if(!iframe)return;var win=iframe.contentWindow;RTCPeerConnection=win.RTCPeerConnection||win.mozRTCPeerConnection||win.webkitRTCPeerConnection}if(RTCPeerConnection){var peerConfig=null;"Chrome"===DetectRTC.browser&&DetectRTC.browser.version<58&&(peerConfig={optional:[{RtpDataChannels:!0}]});var servers={iceServers:[{urls:"stun:stun.l.google.com:19302"}]},pc=new RTCPeerConnection(servers,peerConfig);if(stream&&(pc.addStream?pc.addStream(stream):pc.addTrack&&stream.getTracks()[0]&&pc.addTrack(stream.getTracks()[0],stream)),pc.onicecandidate=function(event){event.candidate&&event.candidate.candidate?handleCandidate(event.candidate.candidate):handleCandidate()},!stream)try{pc.createDataChannel("sctp",{})}catch(e){}DetectRTC.isPromisesSupported?pc.createOffer().then(function(result){pc.setLocalDescription(result).then(afterCreateOffer)}):pc.createOffer(function(result){pc.setLocalDescription(result,afterCreateOffer,function(){})},function(){})}}}function checkDeviceSupport(callback){if(!canEnumerate)return void(callback&&callback());if(!navigator.enumerateDevices&&window.MediaStreamTrack&&window.MediaStreamTrack.getSources&&(navigator.enumerateDevices=window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack)),!navigator.enumerateDevices&&navigator.enumerateDevices&&(navigator.enumerateDevices=navigator.enumerateDevices.bind(navigator)),!navigator.enumerateDevices)return void(callback&&callback());MediaDevices=[],audioInputDevices=[],audioOutputDevices=[],videoInputDevices=[],hasMicrophone=!1,hasSpeakers=!1,hasWebcam=!1,isWebsiteHasMicrophonePermissions=!1,isWebsiteHasWebcamPermissions=!1;var alreadyUsedDevices={};navigator.enumerateDevices(function(devices){devices.forEach(function(_device){var device={};for(var d in _device)try{"function"!=typeof _device[d]&&(device[d]=_device[d])}catch(e){}alreadyUsedDevices[device.deviceId+device.label+device.kind]||("audio"===device.kind&&(device.kind="audioinput"),"video"===device.kind&&(device.kind="videoinput"),device.deviceId||(device.deviceId=device.id),device.id||(device.id=device.deviceId),device.label?("videoinput"!==device.kind||isWebsiteHasWebcamPermissions||(isWebsiteHasWebcamPermissions=!0),"audioinput"!==device.kind||isWebsiteHasMicrophonePermissions||(isWebsiteHasMicrophonePermissions=!0)):(device.isCustomLabel=!0,"videoinput"===device.kind?device.label="Camera "+(videoInputDevices.length+1):"audioinput"===device.kind?device.label="Microphone "+(audioInputDevices.length+1):"audiooutput"===device.kind?device.label="Speaker "+(audioOutputDevices.length+1):device.label="Please invoke getUserMedia once.","undefined"!=typeof DetectRTC&&DetectRTC.browser.isChrome&&DetectRTC.browser.version>=46&&!/^(https:|chrome-extension:)$/g.test(location.protocol||"")&&"undefined"!=typeof document&&"string"==typeof document.domain&&document.domain.search&&document.domain.search(/localhost|127.0./g)===-1&&(device.label="HTTPs is required to get label of this "+device.kind+" device.")),"audioinput"===device.kind&&(hasMicrophone=!0,audioInputDevices.indexOf(device)===-1&&audioInputDevices.push(device)),"audiooutput"===device.kind&&(hasSpeakers=!0,audioOutputDevices.indexOf(device)===-1&&audioOutputDevices.push(device)),"videoinput"===device.kind&&(hasWebcam=!0,videoInputDevices.indexOf(device)===-1&&videoInputDevices.push(device)),MediaDevices.push(device),alreadyUsedDevices[device.deviceId+device.label+device.kind]=device)}),"undefined"!=typeof DetectRTC&&(DetectRTC.MediaDevices=MediaDevices,DetectRTC.hasMicrophone=hasMicrophone,DetectRTC.hasSpeakers=hasSpeakers,DetectRTC.hasWebcam=hasWebcam,DetectRTC.isWebsiteHasWebcamPermissions=isWebsiteHasWebcamPermissions,DetectRTC.isWebsiteHasMicrophonePermissions=isWebsiteHasMicrophonePermissions,DetectRTC.audioInputDevices=audioInputDevices,DetectRTC.audioOutputDevices=audioOutputDevices,DetectRTC.videoInputDevices=videoInputDevices),callback&&callback()})}function getAspectRatio(w,h){function gcd(a,b){return 0==b?a:gcd(b,a%b)}var r=gcd(w,h);return w/r/(h/r)}var browserFakeUserAgent="Fake/5.0 (FakeOS) AppleWebKit/123 (KHTML, like Gecko) Fake/12.3.4567.89 Fake/123.45",isNodejs="object"==typeof process&&"object"==typeof process.versions&&process.versions.node&&!process.browser;if(isNodejs){var version=process.versions.node.toString().replace("v","");browserFakeUserAgent="Nodejs/"+version+" (NodeOS) AppleWebKit/"+version+" (KHTML, like Gecko) Nodejs/"+version+" Nodejs/"+version}!function(that){"undefined"==typeof window&&("undefined"==typeof window&&"undefined"!=typeof global?(global.navigator={userAgent:browserFakeUserAgent,getUserMedia:function(){}},that.window=global):"undefined"==typeof window,"undefined"==typeof location&&(that.location={protocol:"file:",href:"",hash:""}),"undefined"==typeof screen&&(that.screen={width:0,height:0}))}("undefined"!=typeof global?global:window);var navigator=window.navigator;"undefined"!=typeof navigator?("undefined"!=typeof navigator.webkitGetUserMedia&&(navigator.getUserMedia=navigator.webkitGetUserMedia),"undefined"!=typeof navigator.mozGetUserMedia&&(navigator.getUserMedia=navigator.mozGetUserMedia)):navigator={getUserMedia:function(){},userAgent:browserFakeUserAgent};var isMobileDevice=!!/Android|webOS|iPhone|iPad|iPod|BB10|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent||""),isEdge=!(navigator.userAgent.indexOf("Edge")===-1||!navigator.msSaveOrOpenBlob&&!navigator.msSaveBlob),isOpera=!!window.opera||navigator.userAgent.indexOf(" OPR/")>=0,isFirefox="undefined"!=typeof window.InstallTrigger,isSafari=/^((?!chrome|android).)*safari/i.test(navigator.userAgent),isChrome=!!window.chrome&&!isOpera,isIE="undefined"!=typeof document&&!!document.documentMode&&!isEdge,isMobile={Android:function(){return navigator.userAgent.match(/Android/i)},BlackBerry:function(){return navigator.userAgent.match(/BlackBerry|BB10/i)},iOS:function(){return navigator.userAgent.match(/iPhone|iPad|iPod/i)},Opera:function(){return navigator.userAgent.match(/Opera Mini/i)},Windows:function(){return navigator.userAgent.match(/IEMobile/i)},any:function(){return isMobile.Android()||isMobile.BlackBerry()||isMobile.iOS()||isMobile.Opera()||isMobile.Windows()},getOsName:function(){var osName="Unknown OS";return isMobile.Android()&&(osName="Android"),isMobile.BlackBerry()&&(osName="BlackBerry"),isMobile.iOS()&&(osName="iOS"),isMobile.Opera()&&(osName="Opera Mini"),isMobile.Windows()&&(osName="Windows"),osName}},osName="Unknown OS",osVersion="Unknown OS Version",osInfo=detectDesktopOS();osInfo&&osInfo.osName&&"-"!=osInfo.osName?(osName=osInfo.osName,osVersion=osInfo.osVersion):isMobile.any()&&(osName=isMobile.getOsName(),"Android"==osName&&(osVersion=getAndroidVersion()));var isNodejs="object"==typeof process&&"object"==typeof process.versions&&process.versions.node;"Unknown OS"===osName&&isNodejs&&(osName="Nodejs",osVersion=process.versions.node.toString().replace("v",""));var isCanvasSupportsStreamCapturing=!1,isVideoSupportsStreamCapturing=!1;["captureStream","mozCaptureStream","webkitCaptureStream"].forEach(function(item){"undefined"!=typeof document&&"function"==typeof document.createElement&&(!isCanvasSupportsStreamCapturing&&item in document.createElement("canvas")&&(isCanvasSupportsStreamCapturing=!0),!isVideoSupportsStreamCapturing&&item in document.createElement("video")&&(isVideoSupportsStreamCapturing=!0))});var regexIpv4Local=/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/,regexIpv4=/([0-9]{1,3}(\.[0-9]{1,3}){3})/,regexIpv6=/[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}/,MediaDevices=[],audioInputDevices=[],audioOutputDevices=[],videoInputDevices=[];navigator.mediaDevices&&navigator.mediaDevices.enumerateDevices&&(navigator.enumerateDevices=function(callback){var enumerateDevices=navigator.mediaDevices.enumerateDevices();enumerateDevices&&enumerateDevices.then?navigator.mediaDevices.enumerateDevices().then(callback)["catch"](function(){callback([])}):callback([])});var canEnumerate=!1;"undefined"!=typeof MediaStreamTrack&&"getSources"in MediaStreamTrack?canEnumerate=!0:navigator.mediaDevices&&navigator.mediaDevices.enumerateDevices&&(canEnumerate=!0);var hasMicrophone=!1,hasSpeakers=!1,hasWebcam=!1,isWebsiteHasMicrophonePermissions=!1,isWebsiteHasWebcamPermissions=!1,DetectRTC=window.DetectRTC||{};DetectRTC.browser=getBrowserInfo(),detectPrivateMode(function(isPrivateBrowsing){DetectRTC.browser.isPrivateBrowsing=!!isPrivateBrowsing}),DetectRTC.browser["is"+DetectRTC.browser.name]=!0,DetectRTC.osName=osName,DetectRTC.osVersion=osVersion;var isWebRTCSupported=("object"==typeof process&&"object"==typeof process.versions&&process.versions["node-webkit"],!1);["RTCPeerConnection","webkitRTCPeerConnection","mozRTCPeerConnection","RTCIceGatherer"].forEach(function(item){isWebRTCSupported||item in window&&(isWebRTCSupported=!0)}),DetectRTC.isWebRTCSupported=isWebRTCSupported,DetectRTC.isORTCSupported="undefined"!=typeof RTCIceGatherer;var isScreenCapturingSupported=!1;if(DetectRTC.browser.isChrome&&DetectRTC.browser.version>=35?isScreenCapturingSupported=!0:DetectRTC.browser.isFirefox&&DetectRTC.browser.version>=34?isScreenCapturingSupported=!0:DetectRTC.browser.isEdge&&DetectRTC.browser.version>=17?isScreenCapturingSupported=!0:"Android"===DetectRTC.osName&&DetectRTC.browser.isChrome&&(isScreenCapturingSupported=!0),!/^(https:|chrome-extension:)$/g.test(location.protocol||"")){var isNonLocalHost="undefined"!=typeof document&&"string"==typeof document.domain&&document.domain.search&&document.domain.search(/localhost|127.0./g)===-1;isNonLocalHost&&(DetectRTC.browser.isChrome||DetectRTC.browser.isEdge||DetectRTC.browser.isOpera)?isScreenCapturingSupported=!1:DetectRTC.browser.isFirefox&&(isScreenCapturingSupported=!1)}DetectRTC.isScreenCapturingSupported=isScreenCapturingSupported;var webAudio={isSupported:!1,isCreateMediaStreamSourceSupported:!1};["AudioContext","webkitAudioContext","mozAudioContext","msAudioContext"].forEach(function(item){webAudio.isSupported||item in window&&(webAudio.isSupported=!0,window[item]&&"createMediaStreamSource"in window[item].prototype&&(webAudio.isCreateMediaStreamSourceSupported=!0))}),DetectRTC.isAudioContextSupported=webAudio.isSupported,DetectRTC.isCreateMediaStreamSourceSupported=webAudio.isCreateMediaStreamSourceSupported;var isRtpDataChannelsSupported=!1;DetectRTC.browser.isChrome&&DetectRTC.browser.version>31&&(isRtpDataChannelsSupported=!0),DetectRTC.isRtpDataChannelsSupported=isRtpDataChannelsSupported;var isSCTPSupportd=!1;DetectRTC.browser.isFirefox&&DetectRTC.browser.version>28?isSCTPSupportd=!0:DetectRTC.browser.isChrome&&DetectRTC.browser.version>25?isSCTPSupportd=!0:DetectRTC.browser.isOpera&&DetectRTC.browser.version>=11&&(isSCTPSupportd=!0),DetectRTC.isSctpDataChannelsSupported=isSCTPSupportd,DetectRTC.isMobileDevice=isMobileDevice;var isGetUserMediaSupported=!1;navigator.getUserMedia?isGetUserMediaSupported=!0:navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&(isGetUserMediaSupported=!0),DetectRTC.browser.isChrome&&DetectRTC.browser.version>=46&&!/^(https:|chrome-extension:)$/g.test(location.protocol||"")&&"undefined"!=typeof document&&"string"==typeof document.domain&&document.domain.search&&document.domain.search(/localhost|127.0./g)===-1&&(isGetUserMediaSupported="Requires HTTPs"),"Nodejs"===DetectRTC.osName&&(isGetUserMediaSupported=!1),DetectRTC.isGetUserMediaSupported=isGetUserMediaSupported;var displayResolution="";if(screen.width){var width=screen.width?screen.width:"",height=screen.height?screen.height:"";displayResolution+=""+width+" x "+height}DetectRTC.displayResolution=displayResolution,DetectRTC.displayAspectRatio=getAspectRatio(screen.width,screen.height).toFixed(2),DetectRTC.isCanvasSupportsStreamCapturing=isCanvasSupportsStreamCapturing,DetectRTC.isVideoSupportsStreamCapturing=isVideoSupportsStreamCapturing,"Chrome"==DetectRTC.browser.name&&DetectRTC.browser.version>=53&&(DetectRTC.isCanvasSupportsStreamCapturing||(DetectRTC.isCanvasSupportsStreamCapturing="Requires chrome flag: enable-experimental-web-platform-features"),DetectRTC.isVideoSupportsStreamCapturing||(DetectRTC.isVideoSupportsStreamCapturing="Requires chrome flag: enable-experimental-web-platform-features")),DetectRTC.DetectLocalIPAddress=DetectLocalIPAddress,DetectRTC.isWebSocketsSupported="WebSocket"in window&&2===window.WebSocket.CLOSING,DetectRTC.isWebSocketsBlocked=!DetectRTC.isWebSocketsSupported,"Nodejs"===DetectRTC.osName&&(DetectRTC.isWebSocketsSupported=!0,DetectRTC.isWebSocketsBlocked=!1),DetectRTC.checkWebSocketsSupport=function(callback){callback=callback||function(){};try{var starttime,websocket=new WebSocket("wss://echo.websocket.org:443/");websocket.onopen=function(){DetectRTC.isWebSocketsBlocked=!1,starttime=(new Date).getTime(),websocket.send("ping")},websocket.onmessage=function(){DetectRTC.WebsocketLatency=(new Date).getTime()-starttime+"ms",callback(),websocket.close(),websocket=null},websocket.onerror=function(){DetectRTC.isWebSocketsBlocked=!0,callback()}}catch(e){DetectRTC.isWebSocketsBlocked=!0,callback()}},DetectRTC.load=function(callback){callback=callback||function(){},checkDeviceSupport(callback)},"undefined"!=typeof MediaDevices?DetectRTC.MediaDevices=MediaDevices:DetectRTC.MediaDevices=[],DetectRTC.hasMicrophone=hasMicrophone,DetectRTC.hasSpeakers=hasSpeakers,DetectRTC.hasWebcam=hasWebcam,DetectRTC.isWebsiteHasWebcamPermissions=isWebsiteHasWebcamPermissions,DetectRTC.isWebsiteHasMicrophonePermissions=isWebsiteHasMicrophonePermissions,DetectRTC.audioInputDevices=audioInputDevices,DetectRTC.audioOutputDevices=audioOutputDevices,DetectRTC.videoInputDevices=videoInputDevices;var isSetSinkIdSupported=!1;"undefined"!=typeof document&&"function"==typeof document.createElement&&"setSinkId"in document.createElement("video")&&(isSetSinkIdSupported=!0),DetectRTC.isSetSinkIdSupported=isSetSinkIdSupported;var isRTPSenderReplaceTracksSupported=!1;DetectRTC.browser.isFirefox&&"undefined"!=typeof mozRTCPeerConnection?"getSenders"in mozRTCPeerConnection.prototype&&(isRTPSenderReplaceTracksSupported=!0):DetectRTC.browser.isChrome&&"undefined"!=typeof webkitRTCPeerConnection&&"getSenders"in webkitRTCPeerConnection.prototype&&(isRTPSenderReplaceTracksSupported=!0),DetectRTC.isRTPSenderReplaceTracksSupported=isRTPSenderReplaceTracksSupported;var isRemoteStreamProcessingSupported=!1;DetectRTC.browser.isFirefox&&DetectRTC.browser.version>38&&(isRemoteStreamProcessingSupported=!0),DetectRTC.isRemoteStreamProcessingSupported=isRemoteStreamProcessingSupported;var isApplyConstraintsSupported=!1;"undefined"!=typeof MediaStreamTrack&&"applyConstraints"in MediaStreamTrack.prototype&&(isApplyConstraintsSupported=!0),DetectRTC.isApplyConstraintsSupported=isApplyConstraintsSupported;var isMultiMonitorScreenCapturingSupported=!1;DetectRTC.browser.isFirefox&&DetectRTC.browser.version>=43&&(isMultiMonitorScreenCapturingSupported=!0),DetectRTC.isMultiMonitorScreenCapturingSupported=isMultiMonitorScreenCapturingSupported,DetectRTC.isPromisesSupported=!!("Promise"in window),DetectRTC.version="1.3.9","undefined"==typeof DetectRTC&&(window.DetectRTC={});var MediaStream=window.MediaStream;"undefined"==typeof MediaStream&&"undefined"!=typeof webkitMediaStream&&(MediaStream=webkitMediaStream),"undefined"!=typeof MediaStream&&"function"==typeof MediaStream?DetectRTC.MediaStream=Object.keys(MediaStream.prototype):DetectRTC.MediaStream=!1,"undefined"!=typeof MediaStreamTrack?DetectRTC.MediaStreamTrack=Object.keys(MediaStreamTrack.prototype):DetectRTC.MediaStreamTrack=!1;var RTCPeerConnection=window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection;"undefined"!=typeof RTCPeerConnection?DetectRTC.RTCPeerConnection=Object.keys(RTCPeerConnection.prototype):DetectRTC.RTCPeerConnection=!1,window.DetectRTC=DetectRTC,"undefined"!=typeof module&&(module.exports=DetectRTC),"function"==typeof define&&define.amd&&define("DetectRTC",[],function(){return DetectRTC})}(),"undefined"!=typeof cordova&&(DetectRTC.isMobileDevice=!0,DetectRTC.browser.name="Chrome"),navigator&&navigator.userAgent&&navigator.userAgent.indexOf("Crosswalk")!==-1&&(DetectRTC.isMobileDevice=!0,DetectRTC.browser.name="Chrome"),window.addEventListener||(window.addEventListener=function(el,eventName,eventHandler){
            el.attachEvent&&el.attachEvent("on"+eventName,eventHandler)}),window.attachEventListener=function(video,type,listener,useCapture){video.addEventListener(type,listener,useCapture)};var MediaStream=window.MediaStream;"undefined"==typeof MediaStream&&"undefined"!=typeof webkitMediaStream&&(MediaStream=webkitMediaStream),"undefined"!=typeof MediaStream&&("stop"in MediaStream.prototype||(MediaStream.prototype.stop=function(){this.getTracks().forEach(function(track){track.stop()})})),window.iOSDefaultAudioOutputDevice=window.iOSDefaultAudioOutputDevice||"speaker",document.addEventListener("deviceready",setCordovaAPIs,!1),setCordovaAPIs();var RTCPeerConnection,defaults={};"undefined"!=typeof window.RTCPeerConnection?RTCPeerConnection=window.RTCPeerConnection:"undefined"!=typeof mozRTCPeerConnection?RTCPeerConnection=mozRTCPeerConnection:"undefined"!=typeof webkitRTCPeerConnection&&(RTCPeerConnection=webkitRTCPeerConnection);var RTCSessionDescription=window.RTCSessionDescription||window.mozRTCSessionDescription,RTCIceCandidate=window.RTCIceCandidate||window.mozRTCIceCandidate,MediaStreamTrack=window.MediaStreamTrack,CodecsHandler=function(){function preferCodec(sdp,codecName){var info=splitLines(sdp);return info.videoCodecNumbers?"vp8"===codecName&&info.vp8LineNumber===info.videoCodecNumbers[0]?sdp:"vp9"===codecName&&info.vp9LineNumber===info.videoCodecNumbers[0]?sdp:"h264"===codecName&&info.h264LineNumber===info.videoCodecNumbers[0]?sdp:sdp=preferCodecHelper(sdp,codecName,info):sdp}function preferCodecHelper(sdp,codec,info,ignore){var preferCodecNumber="";if("vp8"===codec){if(!info.vp8LineNumber)return sdp;preferCodecNumber=info.vp8LineNumber}if("vp9"===codec){if(!info.vp9LineNumber)return sdp;preferCodecNumber=info.vp9LineNumber}if("h264"===codec){if(!info.h264LineNumber)return sdp;preferCodecNumber=info.h264LineNumber}var newLine=info.videoCodecNumbersOriginal.split("SAVPF")[0]+"SAVPF ",newOrder=[preferCodecNumber];return ignore&&(newOrder=[]),info.videoCodecNumbers.forEach(function(codecNumber){codecNumber!==preferCodecNumber&&newOrder.push(codecNumber)}),newLine+=newOrder.join(" "),sdp=sdp.replace(info.videoCodecNumbersOriginal,newLine)}function splitLines(sdp){var info={};return sdp.split("\n").forEach(function(line){0===line.indexOf("m=video")&&(info.videoCodecNumbers=[],line.split("SAVPF")[1].split(" ").forEach(function(codecNumber){codecNumber=codecNumber.trim(),codecNumber&&codecNumber.length&&(info.videoCodecNumbers.push(codecNumber),info.videoCodecNumbersOriginal=line)})),line.indexOf("VP8/90000")===-1||info.vp8LineNumber||(info.vp8LineNumber=line.replace("a=rtpmap:","").split(" ")[0]),line.indexOf("VP9/90000")===-1||info.vp9LineNumber||(info.vp9LineNumber=line.replace("a=rtpmap:","").split(" ")[0]),line.indexOf("H264/90000")===-1||info.h264LineNumber||(info.h264LineNumber=line.replace("a=rtpmap:","").split(" ")[0])}),info}function removeVPX(sdp){var info=splitLines(sdp);return sdp=preferCodecHelper(sdp,"vp9",info,!0),sdp=preferCodecHelper(sdp,"vp8",info,!0)}function disableNACK(sdp){if(!sdp||"string"!=typeof sdp)throw"Invalid arguments.";return sdp=sdp.replace("a=rtcp-fb:126 nack\r\n",""),sdp=sdp.replace("a=rtcp-fb:126 nack pli\r\n","a=rtcp-fb:126 pli\r\n"),sdp=sdp.replace("a=rtcp-fb:97 nack\r\n",""),sdp=sdp.replace("a=rtcp-fb:97 nack pli\r\n","a=rtcp-fb:97 pli\r\n")}function prioritize(codecMimeType,peer){if(peer&&peer.getSenders&&peer.getSenders().length){if(!codecMimeType||"string"!=typeof codecMimeType)throw"Invalid arguments.";peer.getSenders().forEach(function(sender){for(var params=sender.getParameters(),i=0;i<params.codecs.length;i++)if(params.codecs[i].mimeType==codecMimeType){params.codecs.unshift(params.codecs.splice(i,1));break}sender.setParameters(params)})}}function removeNonG722(sdp){return sdp.replace(/m=audio ([0-9]+) RTP\/SAVPF ([0-9 ]*)/g,"m=audio $1 RTP/SAVPF 9")}function setBAS(sdp,bandwidth,isScreen){return bandwidth?"undefined"!=typeof isFirefox&&isFirefox?sdp:(isScreen&&(bandwidth.screen?bandwidth.screen<300&&console.warn("It seems that you are using wrong bandwidth value for screen. Screen sharing is expected to fail."):console.warn("It seems that you are not using bandwidth for screen. Screen sharing is expected to fail.")),bandwidth.screen&&isScreen&&(sdp=sdp.replace(/b=AS([^\r\n]+\r\n)/g,""),sdp=sdp.replace(/a=mid:video\r\n/g,"a=mid:video\r\nb=AS:"+bandwidth.screen+"\r\n")),(bandwidth.audio||bandwidth.video)&&(sdp=sdp.replace(/b=AS([^\r\n]+\r\n)/g,"")),bandwidth.audio&&(sdp=sdp.replace(/a=mid:audio\r\n/g,"a=mid:audio\r\nb=AS:"+bandwidth.audio+"\r\n")),bandwidth.screen?sdp=sdp.replace(/a=mid:video\r\n/g,"a=mid:video\r\nb=AS:"+bandwidth.screen+"\r\n"):bandwidth.video&&(sdp=sdp.replace(/a=mid:video\r\n/g,"a=mid:video\r\nb=AS:"+bandwidth.video+"\r\n")),sdp):sdp}function findLine(sdpLines,prefix,substr){return findLineInRange(sdpLines,0,-1,prefix,substr)}function findLineInRange(sdpLines,startLine,endLine,prefix,substr){for(var realEndLine=endLine!==-1?endLine:sdpLines.length,i=startLine;i<realEndLine;++i)if(0===sdpLines[i].indexOf(prefix)&&(!substr||sdpLines[i].toLowerCase().indexOf(substr.toLowerCase())!==-1))return i;return null}function getCodecPayloadType(sdpLine){var pattern=new RegExp("a=rtpmap:(\\d+) \\w+\\/\\d+"),result=sdpLine.match(pattern);return result&&2===result.length?result[1]:null}function setVideoBitrates(sdp,params){params=params||{};var vp8Payload,xgoogle_min_bitrate=params.min,xgoogle_max_bitrate=params.max,sdpLines=sdp.split("\r\n"),vp8Index=findLine(sdpLines,"a=rtpmap","VP8/90000");if(vp8Index&&(vp8Payload=getCodecPayloadType(sdpLines[vp8Index])),!vp8Payload)return sdp;var rtxPayload,rtxIndex=findLine(sdpLines,"a=rtpmap","rtx/90000");if(rtxIndex&&(rtxPayload=getCodecPayloadType(sdpLines[rtxIndex])),!rtxIndex)return sdp;var rtxFmtpLineIndex=findLine(sdpLines,"a=fmtp:"+rtxPayload.toString());if(null!==rtxFmtpLineIndex){var appendrtxNext="\r\n";appendrtxNext+="a=fmtp:"+vp8Payload+" x-google-min-bitrate="+(xgoogle_min_bitrate||"228")+"; x-google-max-bitrate="+(xgoogle_max_bitrate||"228"),sdpLines[rtxFmtpLineIndex]=sdpLines[rtxFmtpLineIndex].concat(appendrtxNext),sdp=sdpLines.join("\r\n")}return sdp}function setOpusAttributes(sdp,params){params=params||{};var opusPayload,sdpLines=sdp.split("\r\n"),opusIndex=findLine(sdpLines,"a=rtpmap","opus/48000");if(opusIndex&&(opusPayload=getCodecPayloadType(sdpLines[opusIndex])),!opusPayload)return sdp;var opusFmtpLineIndex=findLine(sdpLines,"a=fmtp:"+opusPayload.toString());if(null===opusFmtpLineIndex)return sdp;var appendOpusNext="";return appendOpusNext+="; stereo="+("undefined"!=typeof params.stereo?params.stereo:"1"),appendOpusNext+="; sprop-stereo="+("undefined"!=typeof params["sprop-stereo"]?params["sprop-stereo"]:"1"),"undefined"!=typeof params.maxaveragebitrate&&(appendOpusNext+="; maxaveragebitrate="+(params.maxaveragebitrate||1048576)),"undefined"!=typeof params.maxplaybackrate&&(appendOpusNext+="; maxplaybackrate="+(params.maxplaybackrate||1048576)),"undefined"!=typeof params.cbr&&(appendOpusNext+="; cbr="+("undefined"!=typeof params.cbr?params.cbr:"1")),"undefined"!=typeof params.useinbandfec&&(appendOpusNext+="; useinbandfec="+params.useinbandfec),"undefined"!=typeof params.usedtx&&(appendOpusNext+="; usedtx="+params.usedtx),"undefined"!=typeof params.maxptime&&(appendOpusNext+="\r\na=maxptime:"+params.maxptime),sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].concat(appendOpusNext),sdp=sdpLines.join("\r\n")}function forceStereoAudio(sdp){for(var sdpLines=sdp.split("\r\n"),fmtpLineIndex=null,i=0;i<sdpLines.length;i++)if(sdpLines[i].search("opus/48000")!==-1){var opusPayload=extractSdp(sdpLines[i],/:(\d+) opus\/48000/i);break}for(var i=0;i<sdpLines.length;i++)if(sdpLines[i].search("a=fmtp")!==-1){var payload=extractSdp(sdpLines[i],/a=fmtp:(\d+)/);if(payload===opusPayload){fmtpLineIndex=i;break}}return null===fmtpLineIndex?sdp:(sdpLines[fmtpLineIndex]=sdpLines[fmtpLineIndex].concat("; stereo=1; sprop-stereo=1"),sdp=sdpLines.join("\r\n"))}return{removeVPX:removeVPX,disableNACK:disableNACK,prioritize:prioritize,removeNonG722:removeNonG722,setApplicationSpecificBandwidth:function(sdp,bandwidth,isScreen){return setBAS(sdp,bandwidth,isScreen)},setVideoBitrates:function(sdp,params){return setVideoBitrates(sdp,params)},setOpusAttributes:function(sdp,params){return setOpusAttributes(sdp,params)},preferVP9:function(sdp){return preferCodec(sdp,"vp9")},preferCodec:preferCodec,forceStereoAudio:forceStereoAudio}}();window.BandwidthHandler=CodecsHandler;var OnIceCandidateHandler=function(){function processCandidates(connection,icePair){var candidate=icePair.candidate,iceRestrictions=connection.candidates,stun=iceRestrictions.stun,turn=iceRestrictions.turn;if(isNull(iceRestrictions.reflexive)||(stun=iceRestrictions.reflexive),isNull(iceRestrictions.relay)||(turn=iceRestrictions.relay),(iceRestrictions.host||!candidate.match(/typ host/g))&&(turn||!candidate.match(/typ relay/g))&&(stun||!candidate.match(/typ srflx/g))){var protocol=connection.iceProtocols;if((protocol.udp||!candidate.match(/ udp /g))&&(protocol.tcp||!candidate.match(/ tcp /g)))return connection.enableLogs&&console.debug("Your candidate pairs:",candidate),{candidate:candidate,sdpMid:icePair.sdpMid,sdpMLineIndex:icePair.sdpMLineIndex}}}return{processCandidates:processCandidates}}(),IceServersHandler=function(){function getIceServers(connection){var iceServers=[{urls:["stun:stun.l.google.com:19302","stun:stun1.l.google.com:19302","stun:stun2.l.google.com:19302","stun:stun.l.google.com:19302?transport=udp"]}];return iceServers}return{getIceServers:getIceServers}}();window.currentUserMediaRequest={streams:[],mutex:!1,queueRequests:[],remove:function(idInstance){this.mutex=!1;var stream=this.streams[idInstance];if(stream){stream=stream.stream;var options=stream.currentUserMediaRequestOptions;this.queueRequests.indexOf(options)&&(delete this.queueRequests[this.queueRequests.indexOf(options)],this.queueRequests=removeNullEntries(this.queueRequests)),this.streams[idInstance].stream=null,delete this.streams[idInstance]}}};var StreamsHandler=function(){function handleType(type){if(type)return"string"==typeof type||"undefined"==typeof type?type:type.audio&&type.video?null:type.audio?"audio":type.video?"video":void 0}function setHandlers(stream,syncAction,connection){function graduallyIncreaseVolume(){if(connection.streamEvents[stream.streamid].mediaElement){var mediaElement=connection.streamEvents[stream.streamid].mediaElement;mediaElement.volume=0,afterEach(200,5,function(){try{mediaElement.volume+=.2}catch(e){mediaElement.volume=1}})}}if(stream&&stream.addEventListener){if("undefined"==typeof syncAction||1==syncAction){var streamEndedEvent="ended";"oninactive"in stream&&(streamEndedEvent="inactive"),stream.addEventListener(streamEndedEvent,function(){StreamsHandler.onSyncNeeded(this.streamid,streamEndedEvent)},!1)}stream.mute=function(type,isSyncAction){type=handleType(type),"undefined"!=typeof isSyncAction&&(syncAction=isSyncAction),"undefined"!=typeof type&&"audio"!=type||getTracks(stream,"audio").forEach(function(track){track.enabled=!1,connection.streamEvents[stream.streamid].isAudioMuted=!0}),"undefined"!=typeof type&&"video"!=type||getTracks(stream,"video").forEach(function(track){track.enabled=!1}),"undefined"!=typeof syncAction&&1!=syncAction||StreamsHandler.onSyncNeeded(stream.streamid,"mute",type),connection.streamEvents[stream.streamid].muteType=type||"both",fireEvent(stream,"mute",type)},stream.unmute=function(type,isSyncAction){type=handleType(type),"undefined"!=typeof isSyncAction&&(syncAction=isSyncAction),graduallyIncreaseVolume(),"undefined"!=typeof type&&"audio"!=type||getTracks(stream,"audio").forEach(function(track){track.enabled=!0,connection.streamEvents[stream.streamid].isAudioMuted=!1}),"undefined"!=typeof type&&"video"!=type||(getTracks(stream,"video").forEach(function(track){track.enabled=!0}),"undefined"!=typeof type&&"video"==type&&connection.streamEvents[stream.streamid].isAudioMuted&&!function looper(times){times||(times=0),times++,times<100&&connection.streamEvents[stream.streamid].isAudioMuted&&(stream.mute("audio"),setTimeout(function(){looper(times)},50))}()),"undefined"!=typeof syncAction&&1!=syncAction||StreamsHandler.onSyncNeeded(stream.streamid,"unmute",type),connection.streamEvents[stream.streamid].unmuteType=type||"both",fireEvent(stream,"unmute",type)}}}function afterEach(setTimeoutInteval,numberOfTimes,callback,startedTimes){startedTimes=(startedTimes||0)+1,startedTimes>=numberOfTimes||setTimeout(function(){callback(),afterEach(setTimeoutInteval,numberOfTimes,callback,startedTimes)},setTimeoutInteval)}return{setHandlers:setHandlers,onSyncNeeded:function(streamid,action,type){}}}(),TextSender={send:function(config){function sendText(textMessage,text){var data={type:"text",uuid:uuid,sendingTime:sendingTime};textMessage&&(text=textMessage,data.packets=parseInt(text.length/packetSize)),text.length>packetSize?data.message=text.slice(0,packetSize):(data.message=text,data.last=!0,data.isobject=isobject),channel.send(data,remoteUserId),textToTransfer=text.slice(data.message.length),textToTransfer.length&&setTimeout(function(){sendText(null,textToTransfer)},connection.chunkInterval||100)}var connection=config.connection,channel=config.channel,remoteUserId=config.remoteUserId,initialText=config.text,packetSize=connection.chunkSize||1e3,textToTransfer="",isobject=!1;isString(initialText)||(isobject=!0,initialText=JSON.stringify(initialText));var uuid=getRandomString(),sendingTime=(new Date).getTime();sendText(initialText)}},FileProgressBarHandler=function(){function handle(connection){function updateLabel(progress,label){if(progress.position!==-1){var position=+progress.position.toFixed(2).split(".")[1]||100;label.innerHTML=position+"%"}}var progressHelper={};connection.onFileStart=function(file){var div=document.createElement("div");return div.title=file.name,div.innerHTML="<label>0%</label> <progress></progress>",file.remoteUserId&&(div.innerHTML+=" (Sharing with:"+file.remoteUserId+")"),connection.filesContainer||(connection.filesContainer=document.body||document.documentElement),connection.filesContainer.insertBefore(div,connection.filesContainer.firstChild),file.remoteUserId?(progressHelper[file.uuid]||(progressHelper[file.uuid]={}),progressHelper[file.uuid][file.remoteUserId]={div:div,progress:div.querySelector("progress"),label:div.querySelector("label")},void(progressHelper[file.uuid][file.remoteUserId].progress.max=file.maxChunks)):(progressHelper[file.uuid]={div:div,progress:div.querySelector("progress"),label:div.querySelector("label")},void(progressHelper[file.uuid].progress.max=file.maxChunks))},connection.onFileProgress=function(chunk){var helper=progressHelper[chunk.uuid];helper&&(chunk.remoteUserId&&!(helper=progressHelper[chunk.uuid][chunk.remoteUserId])||(helper.progress.value=chunk.currentPosition||chunk.maxChunks||helper.progress.max,updateLabel(helper.progress,helper.label)))},connection.onFileEnd=function(file){var helper=progressHelper[file.uuid];if(!helper)return void console.error("No such progress-helper element exist.",file);if(!file.remoteUserId||(helper=progressHelper[file.uuid][file.remoteUserId])){var div=helper.div;file.type.indexOf("image")!=-1?div.innerHTML='<a href="'+file.url+'" download="'+file.name+'">Download <strong style="color:red;">'+file.name+'</strong> </a><br /><img src="'+file.url+'" title="'+file.name+'" style="max-width: 80%;">':div.innerHTML='<a href="'+file.url+'" download="'+file.name+'">Download <strong style="color:#ff0000;">'+file.name+'</strong> </a><br /><iframe src="'+file.url+'" title="'+file.name+'" style="width: 80%;border: 0;height: inherit;margin-top:1em;"></iframe>'}}}return{handle:handle}}(),TranslationHandler=function(){function handle(connection){connection.autoTranslateText=!1,connection.language="en",connection.googKey="AIzaSyCgB5hmFY74WYB-EoWkhr9cAGr6TiTHrEE",connection.Translator={TranslateText:function(text,callback){var newScript=document.createElement("script");newScript.type="text/javascript";var sourceText=encodeURIComponent(text),randomNumber="method"+connection.token();window[randomNumber]=function(response){return response.data&&response.data.translations[0]&&callback?void callback(response.data.translations[0].translatedText):response.error&&"Daily Limit Exceeded"===response.error.message?void console.error('Text translation failed. Error message: "Daily Limit Exceeded."'):response.error?void console.error(response.error.message):void console.error(response)};var source="https://www.googleapis.com/language/translate/v2?key="+connection.googKey+"&target="+(connection.language||"en-US")+"&callback=window."+randomNumber+"&q="+sourceText;newScript.src=source,document.getElementsByTagName("head")[0].appendChild(newScript)},getListOfLanguages:function(callback){var xhr=new XMLHttpRequest;xhr.onreadystatechange=function(){if(xhr.readyState==XMLHttpRequest.DONE){var response=JSON.parse(xhr.responseText);if(response&&response.data&&response.data.languages)return void callback(response.data.languages);if(response.error&&"Daily Limit Exceeded"===response.error.message)return void console.error('Text translation failed. Error message: "Daily Limit Exceeded."');if(response.error)return void console.error(response.error.message);console.error(response)}};var url="https://www.googleapis.com/language/translate/v2/languages?key="+connection.googKey+"&target=en";xhr.open("GET",url,!0),xhr.send(null)}}}return{handle:handle}}();!function(connection){function onUserLeft(remoteUserId){connection.deletePeer(remoteUserId)}function connectSocket(connectCallback){if(connection.socketAutoReConnect=!0,connection.socket)return void(connectCallback&&connectCallback(connection.socket));if("undefined"==typeof SocketConnection)if("undefined"!=typeof FirebaseConnection)window.SocketConnection=FirebaseConnection;else{if("undefined"==typeof PubNubConnection)throw"SocketConnection.js seems missed.";window.SocketConnection=PubNubConnection}new SocketConnection(connection,function(s){connectCallback&&connectCallback(connection.socket)})}function joinRoom(connectionDescription,cb){connection.socket.emit("join-room",{sessionid:connection.sessionid,session:connection.session,mediaConstraints:connection.mediaConstraints,sdpConstraints:connection.sdpConstraints,streams:getStreamInfoForAdmin(),extra:connection.extra,password:"undefined"!=typeof connection.password&&"object"!=typeof connection.password?connection.password:""},function(isRoomJoined,error){if(isRoomJoined===!0){if(connection.enableLogs&&console.log("isRoomJoined: ",isRoomJoined," roomid: ",connection.sessionid),connection.peers[connection.sessionid])return;mPeer.onNegotiationNeeded(connectionDescription)}isRoomJoined===!1&&connection.enableLogs&&console.warn("isRoomJoined: ",error," roomid: ",connection.sessionid),cb(isRoomJoined,connection.sessionid,error)})}function openRoom(callback){connection.enableLogs&&console.log("Sending open-room signal to socket.io"),connection.waitingForLocalMedia=!1,connection.socket.emit("open-room",{sessionid:connection.sessionid,session:connection.session,mediaConstraints:connection.mediaConstraints,sdpConstraints:connection.sdpConstraints,streams:getStreamInfoForAdmin(),extra:connection.extra,identifier:connection.publicRoomIdentifier,password:"undefined"!=typeof connection.password&&"object"!=typeof connection.password?connection.password:""},function(isRoomOpened,error){isRoomOpened===!0&&(connection.enableLogs&&console.log("isRoomOpened: ",isRoomOpened," roomid: ",connection.sessionid),callback(isRoomOpened,connection.sessionid)),isRoomOpened===!1&&(connection.enableLogs&&console.warn("isRoomOpened: ",error," roomid: ",connection.sessionid),callback(isRoomOpened,connection.sessionid,error))})}function getStreamInfoForAdmin(){try{return connection.streamEvents.selectAll("local").map(function(event){return{streamid:event.streamid,tracks:event.stream.getTracks().length}})}catch(e){return[]}}function beforeJoin(userPreferences,callback){if(connection.dontCaptureUserMedia||userPreferences.isDataOnly)return void callback();var localMediaConstraints={};userPreferences.localPeerSdpConstraints.OfferToReceiveAudio&&(localMediaConstraints.audio=connection.mediaConstraints.audio),userPreferences.localPeerSdpConstraints.OfferToReceiveVideo&&(localMediaConstraints.video=connection.mediaConstraints.video);var session=userPreferences.session||connection.session;return session.oneway&&"two-way"!==session.audio&&"two-way"!==session.video&&"two-way"!==session.screen?void callback():(session.oneway&&session.audio&&"two-way"===session.audio&&(session={audio:!0}),void((session.audio||session.video||session.screen)&&(session.screen?"Edge"===DetectRTC.browser.name?navigator.getDisplayMedia({video:!0,audio:isAudioPlusTab(connection)}).then(function(screen){screen.isScreen=!0,mPeer.onGettingLocalMedia(screen),!session.audio&&!session.video||isAudioPlusTab(connection)?callback(screen):connection.invokeGetUserMedia(null,callback)},function(error){console.error("Unable to capture screen on Edge. HTTPs and version 17+ is required.")}):connection.invokeGetUserMedia({audio:isAudioPlusTab(connection),video:!0,isScreen:!0},!session.audio&&!session.video||isAudioPlusTab(connection)?callback:connection.invokeGetUserMedia(null,callback)):(session.audio||session.video)&&connection.invokeGetUserMedia(null,callback,session))))}function applyConstraints(stream,mediaConstraints){return stream?(mediaConstraints.audio&&getTracks(stream,"audio").forEach(function(track){track.applyConstraints(mediaConstraints.audio)}),void(mediaConstraints.video&&getTracks(stream,"video").forEach(function(track){track.applyConstraints(mediaConstraints.video)}))):void(connection.enableLogs&&console.error("No stream to applyConstraints."))}function replaceTrack(track,remoteUserId,isVideoTrack){return remoteUserId?void mPeer.replaceTrack(track,remoteUserId,isVideoTrack):void connection.peers.getAllParticipants().forEach(function(participant){mPeer.replaceTrack(track,participant,isVideoTrack)})}forceOptions=forceOptions||{useDefaultDevices:!0},connection.channel=connection.sessionid=(roomid||location.href.replace(/\/|:|#|\?|\$|\^|%|\.|`|~|!|\+|@|\[|\||]|\|*. /g,"").split("\n").join("").split("\r").join(""))+"";var mPeer=new MultiPeers(connection),preventDuplicateOnStreamEvents={};mPeer.onGettingLocalMedia=function(stream,callback){if(callback=callback||function(){},preventDuplicateOnStreamEvents[stream.streamid])return void callback();preventDuplicateOnStreamEvents[stream.streamid]=!0;try{stream.type="local"}catch(e){}connection.setStreamEndHandler(stream),getRMCMediaElement(stream,function(mediaElement){mediaElement.id=stream.streamid,mediaElement.muted=!0,mediaElement.volume=0,connection.attachStreams.indexOf(stream)===-1&&connection.attachStreams.push(stream),"undefined"!=typeof StreamsHandler&&StreamsHandler.setHandlers(stream,!0,connection),connection.streamEvents[stream.streamid]={stream:stream,type:"local",mediaElement:mediaElement,userid:connection.userid,extra:connection.extra,streamid:stream.streamid,isAudioMuted:!0};try{setHarkEvents(connection,connection.streamEvents[stream.streamid]),setMuteHandlers(connection,connection.streamEvents[stream.streamid]),connection.onstream(connection.streamEvents[stream.streamid])}catch(e){}callback()},connection)},mPeer.onGettingRemoteMedia=function(stream,remoteUserId){try{stream.type="remote"}catch(e){}connection.setStreamEndHandler(stream,"remote-stream"),getRMCMediaElement(stream,function(mediaElement){mediaElement.id=stream.streamid,"undefined"!=typeof StreamsHandler&&StreamsHandler.setHandlers(stream,!1,connection),connection.streamEvents[stream.streamid]={stream:stream,type:"remote",userid:remoteUserId,extra:connection.peers[remoteUserId]?connection.peers[remoteUserId].extra:{},mediaElement:mediaElement,streamid:stream.streamid},setMuteHandlers(connection,connection.streamEvents[stream.streamid]),connection.onstream(connection.streamEvents[stream.streamid])},connection)},mPeer.onRemovingRemoteMedia=function(stream,remoteUserId){var streamEvent=connection.streamEvents[stream.streamid];streamEvent||(streamEvent={stream:stream,type:"remote",userid:remoteUserId,extra:connection.peers[remoteUserId]?connection.peers[remoteUserId].extra:{},streamid:stream.streamid,mediaElement:connection.streamEvents[stream.streamid]?connection.streamEvents[stream.streamid].mediaElement:null}),connection.peersBackup[streamEvent.userid]&&(streamEvent.extra=connection.peersBackup[streamEvent.userid].extra),connection.onstreamended(streamEvent),delete connection.streamEvents[stream.streamid]},mPeer.onNegotiationNeeded=function(message,remoteUserId,callback){callback=callback||function(){},remoteUserId=remoteUserId||message.remoteUserId,message=message||"";var messageToDeliver={remoteUserId:remoteUserId,message:message,sender:connection.userid};message.remoteUserId&&message.message&&message.sender&&(messageToDeliver=message),connectSocket(function(){connection.socket.emit(connection.socketMessageEvent,messageToDeliver,callback)})},mPeer.onUserLeft=onUserLeft,mPeer.disconnectWith=function(remoteUserId,callback){connection.socket&&connection.socket.emit("disconnect-with",remoteUserId,callback||function(){}),connection.deletePeer(remoteUserId)},connection.socketOptions={transport:"polling"},connection.openOrJoin=function(roomid,callback){callback=callback||function(){},connection.checkPresence(roomid,function(isRoomExist,roomid){if(isRoomExist){connection.sessionid=roomid;var localPeerSdpConstraints=!1,remotePeerSdpConstraints=!1,isOneWay=!!connection.session.oneway,isDataOnly=isData(connection.session);remotePeerSdpConstraints={OfferToReceiveAudio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:connection.sdpConstraints.mandatory.OfferToReceiveVideo},localPeerSdpConstraints={OfferToReceiveAudio:isOneWay?!!connection.session.audio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:isOneWay?!!connection.session.video||!!connection.session.screen:connection.sdpConstraints.mandatory.OfferToReceiveVideo};var connectionDescription={remoteUserId:connection.sessionid,message:{newParticipationRequest:!0,isOneWay:isOneWay,isDataOnly:isDataOnly,localPeerSdpConstraints:localPeerSdpConstraints,remotePeerSdpConstraints:remotePeerSdpConstraints},sender:connection.userid};return void beforeJoin(connectionDescription.message,function(){joinRoom(connectionDescription,callback)})}return connection.waitingForLocalMedia=!0,connection.isInitiator=!0,connection.sessionid=roomid||connection.sessionid,isData(connection.session)?void openRoom(callback):void connection.captureUserMedia(function(){openRoom(callback)})})},connection.waitingForLocalMedia=!1,connection.open=function(roomid,callback){callback=callback||function(){},connection.waitingForLocalMedia=!0,connection.isInitiator=!0,connection.sessionid=roomid||connection.sessionid,connectSocket(function(){return isData(connection.session)?void openRoom(callback):void connection.captureUserMedia(function(){openRoom(callback)})})},connection.peersBackup={},connection.deletePeer=function(remoteUserId){if(remoteUserId&&connection.peers[remoteUserId]){var eventObject={userid:remoteUserId,extra:connection.peers[remoteUserId]?connection.peers[remoteUserId].extra:{}};if(connection.peersBackup[eventObject.userid]&&(eventObject.extra=connection.peersBackup[eventObject.userid].extra),connection.onleave(eventObject),connection.peers[remoteUserId]){connection.peers[remoteUserId].streams.forEach(function(stream){stream.stop()});var peer=connection.peers[remoteUserId].peer;if(peer&&"closed"!==peer.iceConnectionState)try{peer.close()}catch(e){}connection.peers[remoteUserId]&&(connection.peers[remoteUserId].peer=null,delete connection.peers[remoteUserId])}}},connection.rejoin=function(connectionDescription){if(!connection.isInitiator&&connectionDescription&&Object.keys(connectionDescription).length){var extra={};connection.peers[connectionDescription.remoteUserId]&&(extra=connection.peers[connectionDescription.remoteUserId].extra,connection.deletePeer(connectionDescription.remoteUserId)),connectionDescription&&connectionDescription.remoteUserId&&(connection.join(connectionDescription.remoteUserId),connection.onReConnecting({userid:connectionDescription.remoteUserId,extra:extra}))}},connection.join=function(remoteUserId,options){connection.sessionid=!!remoteUserId&&(remoteUserId.sessionid||remoteUserId.remoteUserId||remoteUserId)||connection.sessionid,connection.sessionid+="";var localPeerSdpConstraints=!1,remotePeerSdpConstraints=!1,isOneWay=!1,isDataOnly=!1;if(remoteUserId&&remoteUserId.session||!remoteUserId||"string"==typeof remoteUserId){var session=remoteUserId?remoteUserId.session||connection.session:connection.session;isOneWay=!!session.oneway,isDataOnly=isData(session),remotePeerSdpConstraints={OfferToReceiveAudio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:connection.sdpConstraints.mandatory.OfferToReceiveVideo},localPeerSdpConstraints={OfferToReceiveAudio:isOneWay?!!connection.session.audio:connection.sdpConstraints.mandatory.OfferToReceiveAudio,OfferToReceiveVideo:isOneWay?!!connection.session.video||!!connection.session.screen:connection.sdpConstraints.mandatory.OfferToReceiveVideo}}options=options||{};var cb=function(){};"function"==typeof options&&(cb=options,options={}),"undefined"!=typeof options.localPeerSdpConstraints&&(localPeerSdpConstraints=options.localPeerSdpConstraints),"undefined"!=typeof options.remotePeerSdpConstraints&&(remotePeerSdpConstraints=options.remotePeerSdpConstraints),"undefined"!=typeof options.isOneWay&&(isOneWay=options.isOneWay),"undefined"!=typeof options.isDataOnly&&(isDataOnly=options.isDataOnly);var connectionDescription={remoteUserId:connection.sessionid,message:{newParticipationRequest:!0,isOneWay:isOneWay,isDataOnly:isDataOnly,localPeerSdpConstraints:localPeerSdpConstraints,remotePeerSdpConstraints:remotePeerSdpConstraints},sender:connection.userid};return beforeJoin(connectionDescription.message,function(){connectSocket(function(){joinRoom(connectionDescription,cb)})}),connectionDescription},connection.publicRoomIdentifier="",connection.getUserMedia=connection.captureUserMedia=function(callback,sessionForced){callback=callback||function(){};var session=sessionForced||connection.session;return connection.dontCaptureUserMedia||isData(session)?void callback():void((session.audio||session.video||session.screen)&&(session.screen?"Edge"===DetectRTC.browser.name?navigator.getDisplayMedia({video:!0,audio:isAudioPlusTab(connection)}).then(function(screen){if(screen.isScreen=!0,mPeer.onGettingLocalMedia(screen),(session.audio||session.video)&&!isAudioPlusTab(connection)){var nonScreenSession={};for(var s in session)"screen"!==s&&(nonScreenSession[s]=session[s]);return void connection.invokeGetUserMedia(sessionForced,callback,nonScreenSession)}callback(screen)},function(error){console.error("Unable to capture screen on Edge. HTTPs and version 17+ is required.")}):connection.invokeGetUserMedia({audio:isAudioPlusTab(connection),video:!0,isScreen:!0},function(stream){if((session.audio||session.video)&&!isAudioPlusTab(connection)){var nonScreenSession={};for(var s in session)"screen"!==s&&(nonScreenSession[s]=session[s]);return void connection.invokeGetUserMedia(sessionForced,callback,nonScreenSession)}callback(stream)}):(session.audio||session.video)&&connection.invokeGetUserMedia(sessionForced,callback,session)))},connection.onbeforeunload=function(arg1,dontCloseSocket){connection.closeBeforeUnload&&(connection.peers.getAllParticipants().forEach(function(participant){mPeer.onNegotiationNeeded({userLeft:!0},participant),connection.peers[participant]&&connection.peers[participant].peer&&connection.peers[participant].peer.close(),delete connection.peers[participant]}),dontCloseSocket||connection.closeSocket(),connection.isInitiator=!1)},window.ignoreBeforeUnload?connection.closeBeforeUnload=!1:(connection.closeBeforeUnload=!0,
            window.addEventListener("beforeunload",connection.onbeforeunload,!1)),connection.userid=getRandomString(),connection.changeUserId=function(newUserId,callback){callback=callback||function(){},connection.userid=newUserId||getRandomString(),connection.socket.emit("changed-uuid",connection.userid,callback)},connection.extra={},connection.attachStreams=[],connection.session={audio:!0,video:!0},connection.enableFileSharing=!1,connection.bandwidth={screen:!1,audio:!1,video:!1},connection.codecs={audio:"opus",video:"VP9"},connection.processSdp=function(sdp){return isUnifiedPlanSupportedDefault()?sdp:"Safari"===DetectRTC.browser.name?sdp:("VP8"===connection.codecs.video.toUpperCase()&&(sdp=CodecsHandler.preferCodec(sdp,"vp8")),"VP9"===connection.codecs.video.toUpperCase()&&(sdp=CodecsHandler.preferCodec(sdp,"vp9")),"H264"===connection.codecs.video.toUpperCase()&&(sdp=CodecsHandler.preferCodec(sdp,"h264")),"G722"===connection.codecs.audio&&(sdp=CodecsHandler.removeNonG722(sdp)),"Firefox"===DetectRTC.browser.name?sdp:((connection.bandwidth.video||connection.bandwidth.screen)&&(sdp=CodecsHandler.setApplicationSpecificBandwidth(sdp,connection.bandwidth,!!connection.session.screen)),connection.bandwidth.video&&(sdp=CodecsHandler.setVideoBitrates(sdp,{min:8*connection.bandwidth.video*1024,max:8*connection.bandwidth.video*1024})),connection.bandwidth.audio&&(sdp=CodecsHandler.setOpusAttributes(sdp,{maxaveragebitrate:8*connection.bandwidth.audio*1024,maxplaybackrate:8*connection.bandwidth.audio*1024,stereo:1,maxptime:3})),sdp))},"undefined"!=typeof CodecsHandler&&(connection.BandwidthHandler=connection.CodecsHandler=CodecsHandler),connection.mediaConstraints={audio:{mandatory:{},optional:connection.bandwidth.audio?[{bandwidth:8*connection.bandwidth.audio*1024||1048576}]:[]},video:{mandatory:{},optional:connection.bandwidth.video?[{bandwidth:8*connection.bandwidth.video*1024||1048576},{facingMode:"user"}]:[{facingMode:"user"}]}},"Firefox"===DetectRTC.browser.name&&(connection.mediaConstraints={audio:!0,video:!0}),forceOptions.useDefaultDevices||DetectRTC.isMobileDevice||DetectRTC.load(function(){var lastAudioDevice,lastVideoDevice;if(DetectRTC.MediaDevices.forEach(function(device){"audioinput"===device.kind&&connection.mediaConstraints.audio!==!1&&(lastAudioDevice=device),"videoinput"===device.kind&&connection.mediaConstraints.video!==!1&&(lastVideoDevice=device)}),lastAudioDevice){if("Firefox"===DetectRTC.browser.name)return void(connection.mediaConstraints.audio!==!0?connection.mediaConstraints.audio.deviceId=lastAudioDevice.id:connection.mediaConstraints.audio={deviceId:lastAudioDevice.id});1==connection.mediaConstraints.audio&&(connection.mediaConstraints.audio={mandatory:{},optional:[]}),connection.mediaConstraints.audio.optional||(connection.mediaConstraints.audio.optional=[]);var optional=[{sourceId:lastAudioDevice.id}];connection.mediaConstraints.audio.optional=optional.concat(connection.mediaConstraints.audio.optional)}if(lastVideoDevice){if("Firefox"===DetectRTC.browser.name)return void(connection.mediaConstraints.video!==!0?connection.mediaConstraints.video.deviceId=lastVideoDevice.id:connection.mediaConstraints.video={deviceId:lastVideoDevice.id});1==connection.mediaConstraints.video&&(connection.mediaConstraints.video={mandatory:{},optional:[]}),connection.mediaConstraints.video.optional||(connection.mediaConstraints.video.optional=[]);var optional=[{sourceId:lastVideoDevice.id}];connection.mediaConstraints.video.optional=optional.concat(connection.mediaConstraints.video.optional)}}),connection.sdpConstraints={mandatory:{OfferToReceiveAudio:!0,OfferToReceiveVideo:!0},optional:[{VoiceActivityDetection:!1}]},connection.sdpSemantics=null,connection.iceCandidatePoolSize=null,connection.bundlePolicy=null,connection.rtcpMuxPolicy=null,connection.iceTransportPolicy=null,connection.optionalArgument={optional:[{DtlsSrtpKeyAgreement:!0},{googImprovedWifiBwe:!0},{googScreencastMinBitrate:300},{googIPv6:!0},{googDscp:!0},{googCpuUnderuseThreshold:55},{googCpuOveruseThreshold:85},{googSuspendBelowMinBitrate:!0},{googCpuOveruseDetection:!0}],mandatory:{}},connection.iceServers=IceServersHandler.getIceServers(connection),connection.candidates={host:!0,stun:!0,turn:!0},connection.iceProtocols={tcp:!0,udp:!0},connection.onopen=function(event){connection.enableLogs&&console.info("Data connection has been opened between you & ",event.userid)},connection.onclose=function(event){connection.enableLogs&&console.warn("Data connection has been closed between you & ",event.userid)},connection.onerror=function(error){connection.enableLogs&&console.error(error.userid,"data-error",error)},connection.onmessage=function(event){connection.enableLogs&&console.debug("data-message",event.userid,event.data)},connection.send=function(data,remoteUserId){connection.peers.send(data,remoteUserId)},connection.close=connection.disconnect=connection.leave=function(){connection.onbeforeunload(!1,!0)},connection.closeEntireSession=function(callback){callback=callback||function(){},connection.socket.emit("close-entire-session",function looper(){return connection.getAllParticipants().length?void setTimeout(looper,100):(connection.onEntireSessionClosed({sessionid:connection.sessionid,userid:connection.userid,extra:connection.extra}),void connection.changeUserId(null,function(){connection.close(),callback()}))})},connection.onEntireSessionClosed=function(event){connection.enableLogs&&console.info("Entire session is closed: ",event.sessionid,event.extra)},connection.onstream=function(e){var parentNode=connection.videosContainer;parentNode.insertBefore(e.mediaElement,parentNode.firstChild);var played=e.mediaElement.play();return"undefined"!=typeof played?void played["catch"](function(){}).then(function(){setTimeout(function(){e.mediaElement.play()},2e3)}):void setTimeout(function(){e.mediaElement.play()},2e3)},connection.onstreamended=function(e){e.mediaElement||(e.mediaElement=document.getElementById(e.streamid)),e.mediaElement&&e.mediaElement.parentNode&&e.mediaElement.parentNode.removeChild(e.mediaElement)},connection.direction="many-to-many",connection.removeStream=function(streamid,remoteUserId){var stream;return connection.attachStreams.forEach(function(localStream){localStream.id===streamid&&(stream=localStream)}),stream?(connection.peers.getAllParticipants().forEach(function(participant){if(!remoteUserId||participant===remoteUserId){var user=connection.peers[participant];try{user.peer.removeStream(stream)}catch(e){}}}),void connection.renegotiate()):void console.warn("No such stream exist.",streamid)},connection.addStream=function(session,remoteUserId){function gumCallback(stream){session.streamCallback&&session.streamCallback(stream),connection.renegotiate(remoteUserId)}return session.getTracks?(connection.attachStreams.indexOf(session)===-1&&(session.streamid||(session.streamid=session.id),connection.attachStreams.push(session)),void connection.renegotiate(remoteUserId)):isData(session)?void connection.renegotiate(remoteUserId):void((session.audio||session.video||session.screen)&&(session.screen?"Edge"===DetectRTC.browser.name?navigator.getDisplayMedia({video:!0,audio:isAudioPlusTab(connection)}).then(function(screen){screen.isScreen=!0,mPeer.onGettingLocalMedia(screen),!session.audio&&!session.video||isAudioPlusTab(connection)?gumCallback(screen):connection.invokeGetUserMedia(null,function(stream){gumCallback(stream)})},function(error){console.error("Unable to capture screen on Edge. HTTPs and version 17+ is required.")}):connection.invokeGetUserMedia({audio:isAudioPlusTab(connection),video:!0,isScreen:!0},function(stream){!session.audio&&!session.video||isAudioPlusTab(connection)?gumCallback(stream):connection.invokeGetUserMedia(null,function(stream){gumCallback(stream)})}):(session.audio||session.video)&&connection.invokeGetUserMedia(null,gumCallback)))},connection.invokeGetUserMedia=function(localMediaConstraints,callback,session){session||(session=connection.session),localMediaConstraints||(localMediaConstraints=connection.mediaConstraints),getUserMediaHandler({onGettingLocalMedia:function(stream){var videoConstraints=localMediaConstraints.video;videoConstraints&&(videoConstraints.mediaSource||videoConstraints.mozMediaSource?stream.isScreen=!0:videoConstraints.mandatory&&videoConstraints.mandatory.chromeMediaSource&&(stream.isScreen=!0)),stream.isScreen||(stream.isVideo=!!getTracks(stream,"video").length,stream.isAudio=!stream.isVideo&&getTracks(stream,"audio").length),mPeer.onGettingLocalMedia(stream,function(){"function"==typeof callback&&callback(stream)})},onLocalMediaError:function(error,constraints){mPeer.onLocalMediaError(error,constraints)},localMediaConstraints:localMediaConstraints||{audio:!!session.audio&&localMediaConstraints.audio,video:!!session.video&&localMediaConstraints.video}})},connection.applyConstraints=function(mediaConstraints,streamid){if(!MediaStreamTrack||!MediaStreamTrack.prototype.applyConstraints)return void alert("track.applyConstraints is NOT supported in your browser.");if(streamid){var stream;return connection.streamEvents[streamid]&&(stream=connection.streamEvents[streamid].stream),void applyConstraints(stream,mediaConstraints)}connection.attachStreams.forEach(function(stream){applyConstraints(stream,mediaConstraints)})},connection.replaceTrack=function(session,remoteUserId,isVideoTrack){function gumCallback(stream){connection.replaceTrack(stream,remoteUserId,isVideoTrack||session.video||session.screen)}if(session=session||{},!RTCPeerConnection.prototype.getSenders)return void connection.addStream(session);if(session instanceof MediaStreamTrack)return void replaceTrack(session,remoteUserId,isVideoTrack);if(session instanceof MediaStream)return getTracks(session,"video").length&&replaceTrack(getTracks(session,"video")[0],remoteUserId,!0),void(getTracks(session,"audio").length&&replaceTrack(getTracks(session,"audio")[0],remoteUserId,!1));if(isData(session))throw"connection.replaceTrack requires audio and/or video and/or screen.";(session.audio||session.video||session.screen)&&(session.screen?"Edge"===DetectRTC.browser.name?navigator.getDisplayMedia({video:!0,audio:isAudioPlusTab(connection)}).then(function(screen){screen.isScreen=!0,mPeer.onGettingLocalMedia(screen),!session.audio&&!session.video||isAudioPlusTab(connection)?gumCallback(screen):connection.invokeGetUserMedia(null,gumCallback)},function(error){console.error("Unable to capture screen on Edge. HTTPs and version 17+ is required.")}):connection.invokeGetUserMedia({audio:isAudioPlusTab(connection),video:!0,isScreen:!0},!session.audio&&!session.video||isAudioPlusTab(connection)?gumCallback:connection.invokeGetUserMedia(null,gumCallback)):(session.audio||session.video)&&connection.invokeGetUserMedia(null,gumCallback))},connection.resetTrack=function(remoteUsersIds,isVideoTrack){remoteUsersIds||(remoteUsersIds=connection.getAllParticipants()),"string"==typeof remoteUsersIds&&(remoteUsersIds=[remoteUsersIds]),remoteUsersIds.forEach(function(participant){var peer=connection.peers[participant].peer;"undefined"!=typeof isVideoTrack&&isVideoTrack!==!0||!peer.lastVideoTrack||connection.replaceTrack(peer.lastVideoTrack,participant,!0),"undefined"!=typeof isVideoTrack&&isVideoTrack!==!1||!peer.lastAudioTrack||connection.replaceTrack(peer.lastAudioTrack,participant,!1)})},connection.renegotiate=function(remoteUserId){return remoteUserId?void mPeer.renegotiatePeer(remoteUserId):void connection.peers.getAllParticipants().forEach(function(participant){mPeer.renegotiatePeer(participant)})},connection.setStreamEndHandler=function(stream,isRemote){if(stream&&stream.addEventListener&&(isRemote=!!isRemote,!stream.alreadySetEndHandler)){stream.alreadySetEndHandler=!0;var streamEndedEvent="ended";"oninactive"in stream&&(streamEndedEvent="inactive"),stream.addEventListener(streamEndedEvent,function(){if(stream.idInstance&&currentUserMediaRequest.remove(stream.idInstance),!isRemote){var streams=[];connection.attachStreams.forEach(function(s){s.id!=stream.id&&streams.push(s)}),connection.attachStreams=streams}var streamEvent=connection.streamEvents[stream.streamid];if(streamEvent||(streamEvent={stream:stream,streamid:stream.streamid,type:isRemote?"remote":"local",userid:connection.userid,extra:connection.extra,mediaElement:connection.streamEvents[stream.streamid]?connection.streamEvents[stream.streamid].mediaElement:null}),isRemote&&connection.peers[streamEvent.userid]){var peer=connection.peers[streamEvent.userid].peer,streams=[];peer.getRemoteStreams().forEach(function(s){s.id!=stream.id&&streams.push(s)}),connection.peers[streamEvent.userid].streams=streams}streamEvent.userid===connection.userid&&"remote"===streamEvent.type||(connection.peersBackup[streamEvent.userid]&&(streamEvent.extra=connection.peersBackup[streamEvent.userid].extra),connection.onstreamended(streamEvent),delete connection.streamEvents[stream.streamid])},!1)}},connection.onMediaError=function(error,constraints){connection.enableLogs&&console.error(error,constraints)},connection.autoCloseEntireSession=!1,connection.filesContainer=connection.videosContainer=document.body||document.documentElement,connection.isInitiator=!1,connection.shareFile=mPeer.shareFile,"undefined"!=typeof FileProgressBarHandler&&FileProgressBarHandler.handle(connection),"undefined"!=typeof TranslationHandler&&TranslationHandler.handle(connection),connection.token=getRandomString,connection.onNewParticipant=function(participantId,userPreferences){connection.acceptParticipationRequest(participantId,userPreferences)},connection.acceptParticipationRequest=function(participantId,userPreferences){userPreferences.successCallback&&(userPreferences.successCallback(),delete userPreferences.successCallback),mPeer.createNewPeer(participantId,userPreferences)},"undefined"!=typeof StreamsHandler&&(connection.StreamsHandler=StreamsHandler),connection.onleave=function(userid){},connection.invokeSelectFileDialog=function(callback){var selector=new FileSelector;selector.accept="*.*",selector.selectSingleFile(callback)},connection.onmute=function(e){if(e&&e.mediaElement)if("both"===e.muteType||"video"===e.muteType){e.mediaElement.src=null;var paused=e.mediaElement.pause();"undefined"!=typeof paused?paused.then(function(){e.mediaElement.poster=e.snapshot||"https://cdn.webrtc-experiment.com/images/muted.png"}):e.mediaElement.poster=e.snapshot||"https://cdn.webrtc-experiment.com/images/muted.png"}else"audio"===e.muteType&&(e.mediaElement.muted=!0)},connection.onunmute=function(e){e&&e.mediaElement&&e.stream&&("both"===e.unmuteType||"video"===e.unmuteType?(e.mediaElement.poster=null,e.mediaElement.srcObject=e.stream,e.mediaElement.play()):"audio"===e.unmuteType&&(e.mediaElement.muted=!1))},connection.onExtraDataUpdated=function(event){event.status="online",connection.onUserStatusChanged(event,!0)},connection.getAllParticipants=function(sender){return connection.peers.getAllParticipants(sender)},"undefined"!=typeof StreamsHandler&&(StreamsHandler.onSyncNeeded=function(streamid,action,type){connection.peers.getAllParticipants().forEach(function(participant){mPeer.onNegotiationNeeded({streamid:streamid,action:action,streamSyncNeeded:!0,type:type||"both"},participant)})}),connection.connectSocket=function(callback){connectSocket(callback)},connection.closeSocket=function(){try{io.sockets={}}catch(e){}connection.socket&&("function"==typeof connection.socket.disconnect&&connection.socket.disconnect(),"function"==typeof connection.socket.resetProps&&connection.socket.resetProps(),connection.socket=null)},connection.getSocket=function(callback){return!callback&&connection.enableLogs&&console.warn("getSocket.callback paramter is required."),callback=callback||function(){},connection.socket?callback(connection.socket):connectSocket(function(){callback(connection.socket)}),connection.socket},connection.getRemoteStreams=mPeer.getRemoteStreams;var skipStreams=["selectFirst","selectAll","forEach"];if(connection.streamEvents={selectFirst:function(options){return connection.streamEvents.selectAll(options)[0]},selectAll:function(options){options||(options={local:!0,remote:!0,isScreen:!0,isAudio:!0,isVideo:!0}),"local"==options&&(options={local:!0}),"remote"==options&&(options={remote:!0}),"screen"==options&&(options={isScreen:!0}),"audio"==options&&(options={isAudio:!0}),"video"==options&&(options={isVideo:!0});var streams=[];return Object.keys(connection.streamEvents).forEach(function(key){var event=connection.streamEvents[key];if(skipStreams.indexOf(key)===-1){var ignore=!0;options.local&&"local"===event.type&&(ignore=!1),options.remote&&"remote"===event.type&&(ignore=!1),options.isScreen&&event.stream.isScreen&&(ignore=!1),options.isVideo&&event.stream.isVideo&&(ignore=!1),options.isAudio&&event.stream.isAudio&&(ignore=!1),options.userid&&event.userid===options.userid&&(ignore=!1),ignore===!1&&streams.push(event)}}),streams}},connection.socketURL="/",connection.socketMessageEvent="RTCMultiConnection-Message",connection.socketCustomEvent="RTCMultiConnection-Custom-Message",connection.DetectRTC=DetectRTC,connection.setCustomSocketEvent=function(customEvent){customEvent&&(connection.socketCustomEvent=customEvent),connection.socket&&connection.socket.emit("set-custom-socket-event-listener",connection.socketCustomEvent)},connection.getNumberOfBroadcastViewers=function(broadcastId,callback){connection.socket&&broadcastId&&callback&&connection.socket.emit("get-number-of-users-in-specific-broadcast",broadcastId,callback)},connection.onNumberOfBroadcastViewersUpdated=function(event){connection.enableLogs&&connection.isInitiator&&console.info("Number of broadcast (",event.broadcastId,") viewers",event.numberOfBroadcastViewers)},connection.onUserStatusChanged=function(event,dontWriteLogs){connection.enableLogs&&!dontWriteLogs&&console.info(event.userid,event.status)},connection.getUserMediaHandler=getUserMediaHandler,connection.multiPeersHandler=mPeer,connection.enableLogs=!0,connection.setCustomSocketHandler=function(customSocketHandler){"undefined"!=typeof SocketConnection&&(SocketConnection=customSocketHandler)},connection.chunkSize=4e4,connection.maxParticipantsAllowed=1e3,connection.disconnectWith=mPeer.disconnectWith,connection.checkPresence=function(roomid,callback){return roomid=roomid||connection.sessionid,"SSEConnection"===SocketConnection.name?void SSEConnection.checkPresence(roomid,function(isRoomExist,_roomid,extra){return connection.socket?void callback(isRoomExist,_roomid):(isRoomExist||(connection.userid=_roomid),void connection.connectSocket(function(){callback(isRoomExist,_roomid,extra)}))}):connection.socket?void connection.socket.emit("check-presence",roomid+"",function(isRoomExist,_roomid,extra){connection.enableLogs&&console.log("checkPresence.isRoomExist: ",isRoomExist," roomid: ",_roomid),callback(isRoomExist,_roomid,extra)}):void connection.connectSocket(function(){connection.checkPresence(roomid,callback)})},connection.onReadyForOffer=function(remoteUserId,userPreferences){connection.multiPeersHandler.createNewPeer(remoteUserId,userPreferences)},connection.setUserPreferences=function(userPreferences){return connection.dontAttachStream&&(userPreferences.dontAttachLocalStream=!0),connection.dontGetRemoteStream&&(userPreferences.dontGetRemoteStream=!0),userPreferences},connection.updateExtraData=function(){connection.socket.emit("extra-data-updated",connection.extra)},connection.enableScalableBroadcast=!1,connection.maxRelayLimitPerUser=3,connection.dontCaptureUserMedia=!1,connection.dontAttachStream=!1,connection.dontGetRemoteStream=!1,connection.onReConnecting=function(event){connection.enableLogs&&console.info("ReConnecting with",event.userid,"...")},connection.beforeAddingStream=function(stream){return stream},connection.beforeRemovingStream=function(stream){return stream},"undefined"!=typeof isChromeExtensionAvailable&&(connection.checkIfChromeExtensionAvailable=isChromeExtensionAvailable),"undefined"!=typeof isFirefoxExtensionAvailable&&(connection.checkIfChromeExtensionAvailable=isFirefoxExtensionAvailable),"undefined"!=typeof getChromeExtensionStatus&&(connection.getChromeExtensionStatus=getChromeExtensionStatus),connection.modifyScreenConstraints=function(screen_constraints){return screen_constraints},connection.onPeerStateChanged=function(state){connection.enableLogs&&state.iceConnectionState.search(/closed|failed/gi)!==-1&&console.error("Peer connection is closed between you & ",state.userid,state.extra,"state:",state.iceConnectionState)},connection.isOnline=!0,listenEventHandler("online",function(){connection.isOnline=!0}),listenEventHandler("offline",function(){connection.isOnline=!1}),connection.isLowBandwidth=!1,navigator&&navigator.connection&&navigator.connection.type&&(connection.isLowBandwidth=navigator.connection.type.toString().toLowerCase().search(/wifi|cell/g)!==-1,connection.isLowBandwidth)){if(connection.bandwidth={audio:!1,video:!1,screen:!1},connection.mediaConstraints.audio&&connection.mediaConstraints.audio.optional&&connection.mediaConstraints.audio.optional.length){var newArray=[];connection.mediaConstraints.audio.optional.forEach(function(opt){"undefined"==typeof opt.bandwidth&&newArray.push(opt)}),connection.mediaConstraints.audio.optional=newArray}if(connection.mediaConstraints.video&&connection.mediaConstraints.video.optional&&connection.mediaConstraints.video.optional.length){var newArray=[];connection.mediaConstraints.video.optional.forEach(function(opt){"undefined"==typeof opt.bandwidth&&newArray.push(opt)}),connection.mediaConstraints.video.optional=newArray}}connection.getExtraData=function(remoteUserId,callback){if(!remoteUserId)throw"remoteUserId is required.";return"function"==typeof callback?void connection.socket.emit("get-remote-user-extra-data",remoteUserId,function(extra,remoteUserId,error){callback(extra,remoteUserId,error)}):connection.peers[remoteUserId]?connection.peers[remoteUserId].extra:connection.peersBackup[remoteUserId]?connection.peersBackup[remoteUserId].extra:{}},forceOptions.autoOpenOrJoin&&connection.openOrJoin(connection.sessionid),connection.onUserIdAlreadyTaken=function(useridAlreadyTaken,yourNewUserId){connection.close(),connection.closeSocket(),connection.isInitiator=!1,connection.userid=connection.token(),connection.join(connection.sessionid),connection.enableLogs&&console.warn("Userid already taken.",useridAlreadyTaken,"Your new userid:",connection.userid)},connection.trickleIce=!0,connection.version="3.6.9",connection.onSettingLocalDescription=function(event){connection.enableLogs&&console.info("Set local description for remote user",event.userid)},connection.resetScreen=function(){sourceId=null,DetectRTC&&DetectRTC.screen&&delete DetectRTC.screen.sourceId,currentUserMediaRequest={streams:[],mutex:!1,queueRequests:[]}},connection.autoCreateMediaElement=!0,connection.password=null,connection.setPassword=function(password,callback){callback=callback||function(){},connection.socket?connection.socket.emit("set-password",password,callback):(connection.password=password,callback(!0,connection.sessionid,null))},connection.onSocketDisconnect=function(event){connection.enableLogs&&console.warn("socket.io connection is closed")},connection.onSocketError=function(event){connection.enableLogs&&console.warn("socket.io connection is failed")},connection.errors={ROOM_NOT_AVAILABLE:"Room not available",INVALID_PASSWORD:"Invalid password",USERID_NOT_AVAILABLE:"User ID does not exist",ROOM_PERMISSION_DENIED:"Room permission denied",ROOM_FULL:"Room full",DID_NOT_JOIN_ANY_ROOM:"Did not join any room yet",INVALID_SOCKET:"Invalid socket",PUBLIC_IDENTIFIER_MISSING:"publicRoomIdentifier is required",INVALID_ADMIN_CREDENTIAL:"Invalid username or password attempted"}}(this)};"undefined"!=typeof module&&(module.exports=exports=RTCMultiConnection),"function"==typeof define&&define.amd&&define("RTCMultiConnection",[],function(){return RTCMultiConnection});
this.RTCMultiConnection=RTCMultiConnection;
    }
}
export {p2plib}

