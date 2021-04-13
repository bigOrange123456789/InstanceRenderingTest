 var t, r, i, n, o, s, a, u, h, l, p, c, f, d, g;
        i = Math.floor
        l = Math.min
        r = function (t, e) {
            return e > t ? -1 : t > e ? 1 : 0
        }
        h = function (t, e, n, o, s) {
            var a;
        if (null == n && (n = 0), null == s && (s = r), 0 > n) throw new Error("lo must be non-negative");
        for (null == o && (o = t.length); o > n;) a = i((n + o) / 2), s(e, t[a]) < 0 ? o = a : n = a + 1;
        return [].splice.apply(t, [n, n - n].concat(e)), e
    }, s = function (t, e, i) {
        return null == i && (i = r), t.push(e), d(t, 0, t.length - 1, i)
    },
            o = function (t, e) {//pop
                var i, n;
                return null == e && (e = r), i = t.pop(), t.length ? (n = t[0], t[0] = i, g(t, 0, e)) : n = i, n
            }, u = function (t, e, i) {
        var n;
        return null == i && (i = r), n = t[0], t[0] = e, g(t, 0, i), n
    }, a = function (t, e, i) {
        var n;
        return null == i && (i = r), t.length && i(t[0], e) < 0 && (n = [t[0], e], e = n[0], t[0] = n[1], g(t, 0, i)), e
    }, n = function (t, e) {
        var n, o, s, a, u, h;
        for (null == e && (e = r), a = function () {
            h = [];
            for (var e = 0, r = i(t.length / 2); r >= 0 ? r > e : e > r; r >= 0 ? e++ : e--) h.push(e);
            return h
        }.apply(this).reverse(), u = [], o = 0, s = a.length; s > o; o++) n = a[o], u.push(g(t, n, e));
        return u
    }, f = function (t, e, i) {
        var n;
        return null == i && (i = r), n = t.indexOf(e), -1 !== n ? (d(t, 0, n, i), g(t, n, i)) : void 0
    }, p = function (t, e, i) {
        var o, s, u, h, l;
        if (null == i && (i = r), s = t.slice(0, e), !s.length) return s;
        for (n(s, i), l = t.slice(e), u = 0, h = l.length; h > u; u++) o = l[u], a(s, o, i);
        return s.sort(i).reverse()
    }, c = function (t, e, i) {
        var s, a, u, p, c, f, d, g, b, y;
        if (null == i && (i = r), 10 * e <= t.length) {
            if (p = t.slice(0, e).sort(i), !p.length) return p;
            for (u = p[p.length - 1], g = t.slice(e), c = 0, d = g.length; d > c; c++) s = g[c], i(s, u) < 0 && (h(p, s, 0, null, i), p.pop(), u = p[p.length - 1]);
            return p
        }
        for (n(t, i), y = [], a = f = 0, b = l(e, t.length); b >= 0 ? b > f : f > b; a = b >= 0 ? ++f : --f) y.push(o(t, i));
        return y
    }, d = function (t, e, i, n) {
        var o, s, a;
        for (null == n && (n = r), o = t[i]; i > e && (a = i - 1 >> 1, s = t[a], n(o, s) < 0);) t[i] = s, i = a;
        return t[i] = o
    }, g = function (t, e, i) {
        var n, o, s, a, u;
        for (null == i && (i = r), o = t.length, u = e, s = t[e], n = 2 * e + 1; o > n;) a = n + 1, o > a && !(i(t[n], t[a]) < 0) && (n = a), t[e] = t[n], e = n, n = 2 * e + 1;
        return t[e] = s, d(t, u, e, i)
    }

    t = function () {
        function t(t) {
            this.cmp = null != t ? t : r, this.nodes = []
        }

        return t.push = s, t.pop = o, t.replace = u, t.pushpop = a, t.heapify = n, t.nlargest = p, t.nsmallest = c,
            t.prototype.push = function (t) {
            return s(this.nodes, t, this.cmp)
        },
            t.prototype.pop = function () {
            return o(this.nodes, this.cmp)
        },
            t.prototype.peek = function () {
            return this.nodes[0]
        },
            t.prototype.contains = function (t) {
            return -1 !== this.nodes.indexOf(t)
        },
            t.prototype.replace = function (t) {
            return u(this.nodes, t, this.cmp)
        }, t.prototype.pushpop = function (t) {
            return a(this.nodes, t, this.cmp)
        }, t.prototype.heapify = function () {
            return n(this.nodes, this.cmp)
        }, t.prototype.updateItem = function (t) {
            return f(this.nodes, t, this.cmp)
        }, t.prototype.clear = function () {
            return this.nodes = []
        }, t.prototype.empty = function () {
            return 0 === this.nodes.length
        }, t.prototype.size = function () {
            return this.nodes.length
        }, t.prototype.clone = function () {
            var e;
            return e = new t, e.nodes = this.nodes.slice(0), e
        }, t.prototype.toArray = function () {
            return this.nodes.slice(0)
        },
            t.prototype.insert = t.prototype.push,
            t.prototype.remove = t.prototype.pop,
            t.prototype.top = t.prototype.peek,
            t.prototype.front = t.prototype.peek,
            t.prototype.has = t.prototype.contains,
            t.prototype.copy = t.prototype.clone,
            t
    }(), ("undefined" != typeof e && null !== e ? e.exports : void 0) ? e.exports = t : window.Heap = t

    module.exports=t;
