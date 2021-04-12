module.exports = function () {
    function t(t) {
        this.cmp = null != t ? t : r, this.nodes = []
    }

    return t.push = s, t.pop = o, t.replace = u, t.pushpop = a, t.heapify = n, t.nlargest = p, t.nsmallest = c, t.prototype.push = function (t) {
        return s(this.nodes, t, this.cmp)
    }, t.prototype.pop = function () {
        return o(this.nodes, this.cmp)
    }, t.prototype.peek = function () {
        return this.nodes[0]
    }, t.prototype.contains = function (t) {
        return -1 !== this.nodes.indexOf(t)
    }, t.prototype.replace = function (t) {
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
    }, t.prototype.insert = t.prototype.push, t.prototype.remove = t.prototype.pop, t.prototype.top = t.prototype.peek, t.prototype.front = t.prototype.peek, t.prototype.has = t.prototype.contains, t.prototype.copy = t.prototype.clone, t
}(), ("undefined" != typeof e && null !== e ? e.exports : void 0) ? e.exports = t : window.Heap = t
