(()=>{var t={191:(t,e,n)=>{n(925)},925:(t,e,n)=>{PF={Heap:n(353),Node:n(561),Grid:n(481),Util:n(902),DiagonalMovement:n(911),Heuristic:n(223),AStarFinder:n(878),BestFirstFinder:n(174),BreadthFirstFinder:n(634),DijkstraFinder:n(929),BiAStarFinder:n(534),BiBestFirstFinder:n(57),BiBreadthFirstFinder:n(764),BiDijkstraFinder:n(738),IDAStarFinder:n(807),JumpPointFinder:n(544)},t.exports=PF},911:t=>{t.exports={Always:1,Never:2,IfAtMostOneObstacle:3,OnlyWhenNoObstacles:4}},481:(t,e,n)=>{var r=n(561),o=n(911);function i(t,e,n){var r;"object"!=typeof t?r=t:(e=t.length,r=t[0].length,n=t),this.width=r,this.height=e,this.nodes=this._buildNodes(r,e,n)}i.prototype._buildNodes=function(t,e,n){var o,i,a=new Array(e);for(o=0;o<e;++o)for(a[o]=new Array(t),i=0;i<t;++i)a[o][i]=new r(i,o);if(void 0===n)return a;if(n.length!==e||n[0].length!==t)throw new Error("Matrix size does not fit");for(o=0;o<e;++o)for(i=0;i<t;++i)n[o][i]&&(a[o][i].walkable=!1);return a},i.prototype.getNodeAt=function(t,e){return this.nodes[e][t]},i.prototype.isWalkableAt=function(t,e){return this.isInside(t,e)&&this.nodes[e][t].walkable},i.prototype.isInside=function(t,e){return t>=0&&t<this.width&&e>=0&&e<this.height},i.prototype.setWalkableAt=function(t,e,n){this.nodes[e][t].walkable=n},i.prototype.getNeighbors=function(t,e){var n=t.x,r=t.y,i=[],a=!1,s=!1,h=!1,l=!1,u=!1,p=!1,f=!1,d=!1,c=this.nodes;if(this.isWalkableAt(n,r-1)&&(i.push(c[r-1][n]),a=!0),this.isWalkableAt(n+1,r)&&(i.push(c[r][n+1]),h=!0),this.isWalkableAt(n,r+1)&&(i.push(c[r+1][n]),u=!0),this.isWalkableAt(n-1,r)&&(i.push(c[r][n-1]),f=!0),e===o.Never)return i;if(e===o.OnlyWhenNoObstacles)s=f&&a,l=a&&h,p=h&&u,d=u&&f;else if(e===o.IfAtMostOneObstacle)s=f||a,l=a||h,p=h||u,d=u||f;else{if(e!==o.Always)throw new Error("Incorrect value of diagonalMovement");s=!0,l=!0,p=!0,d=!0}return s&&this.isWalkableAt(n-1,r-1)&&i.push(c[r-1][n-1]),l&&this.isWalkableAt(n+1,r-1)&&i.push(c[r-1][n+1]),p&&this.isWalkableAt(n+1,r+1)&&i.push(c[r+1][n+1]),d&&this.isWalkableAt(n-1,r+1)&&i.push(c[r+1][n-1]),i},i.prototype.clone=function(){var t,e,n=this.width,o=this.height,a=this.nodes,s=new i(n,o),h=new Array(o);for(t=0;t<o;++t)for(h[t]=new Array(n),e=0;e<n;++e)h[t][e]=new r(e,t,a[t][e].walkable);return s.nodes=h,s},t.exports=i},223:t=>{t.exports={manhattan:function(t,e){return t+e},euclidean:function(t,e){return Math.sqrt(t*t+e*e)},octile:function(t,e){var n=Math.SQRT2-1;return t<e?n*t+e:n*e+t},chebyshev:function(t,e){return Math.max(t,e)}}},561:t=>{t.exports=function(t,e,n){this.x=t,this.y=e,this.walkable=void 0===n||n}},902:(t,e)=>{function n(t){for(var e=[[t.x,t.y]];t.parent;)t=t.parent,e.push([t.x,t.y]);return e.reverse()}function r(t,e,n,r){var o,i,a,s,h,l,u=Math.abs,p=[];for(o=t<n?1:-1,i=e<r?1:-1,h=(a=u(n-t))-(s=u(r-e));p.push([t,e]),t!==n||e!==r;)(l=2*h)>-s&&(h-=s,t+=o),l<a&&(h+=a,e+=i);return p}e.backtrace=n,e.biBacktrace=function(t,e){var r=n(t),o=n(e);return r.concat(o.reverse())},e.pathLength=function(t){var e,n,r,o,i,a=0;for(e=1;e<t.length;++e)n=t[e-1],r=t[e],o=n[0]-r[0],i=n[1]-r[1],a+=Math.sqrt(o*o+i*i);return a},e.interpolate=r,e.expandPath=function(t){var e,n,o,i,a,s,h=[],l=t.length;if(l<2)return h;for(a=0;a<l-1;++a)for(e=t[a],n=t[a+1],i=(o=r(e[0],e[1],n[0],n[1])).length,s=0;s<i-1;++s)h.push(o[s]);return h.push(t[l-1]),h},e.smoothenPath=function(t,e){var n,o,i,a,s,h,l,u,p,f=e.length,d=e[0][0],c=e[0][1],g=e[f-1][0],b=e[f-1][1];for(i=[[n=d,o=c]],a=2;a<f;++a){for(l=r(n,o,(h=e[a])[0],h[1]),p=!1,s=1;s<l.length;++s)if(u=l[s],!t.isWalkableAt(u[0],u[1])){p=!0;break}p&&(lastValidCoord=e[a-1],i.push(lastValidCoord),n=lastValidCoord[0],o=lastValidCoord[1])}return i.push([g,b]),i},e.compressPath=function(t){if(t.length<3)return t;var e,n,r,o,i,a,s=[],h=t[0][0],l=t[0][1],u=t[1][0],p=t[1][1],f=u-h,d=p-l;for(f/=i=Math.sqrt(f*f+d*d),d/=i,s.push([h,l]),a=2;a<t.length;a++)e=u,n=p,r=f,o=d,f=(u=t[a][0])-e,d=(p=t[a][1])-n,d/=i=Math.sqrt(f*f+d*d),(f/=i)===r&&d===o||s.push([e,n]);return s.push([u,p]),s}},878:(t,e,n)=>{var r=n(353),o=n(902),i=n(223),a=n(911);function s(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.heuristic=t.heuristic||i.manhattan,this.weight=t.weight||1,this.diagonalMovement=t.diagonalMovement,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=a.OnlyWhenNoObstacles:this.diagonalMovement=a.IfAtMostOneObstacle:this.diagonalMovement=a.Never),this.diagonalMovement===a.Never?this.heuristic=t.heuristic||i.manhattan:this.heuristic=t.heuristic||i.octile,this.boards,this.disScope}s.prototype={computeDisScope:function(t,e,n,r){for(var o=[],i=l(t,n,e,r),a=0;a<this.boards.length;a++){o.push(i);for(var s=0;s<this.boards.length;s++)if(a!==s){var h=l(this.boards[a][0],this.boards[s][0],this.boards[a][1],this.boards[s][1]);h<o[a]&&(o[a]=h/2)}}return o;function l(t,e,n,r){return Math.pow(Math.pow(t-e,2)+Math.pow(n-r,2),.5)}},computeBoards:function(t,e,n){if(void 0!==n.boards)boards=n.boards;else{boards=[];for(var r=0;r<n.nodes.length;r++)for(var o=0;o<n.nodes.length;o++){var i=n.nodes[r][o].boardAngle;void 0!==i&&boards.push([r,o,i])}}return boards.push([t,e]),boards},computeWeight:function(t,e){var n,r,o,i=this;[n,r,o]=function(t,e){var n=this.boards;if(0===n.length)return null;for(var r=l(n[0][0],t,n[0][1],e),o=0,a=1;a<n.length;a++){var s=l(n[a][0],t,n[a][1],e);s<r&&(r=s,o=a)}return[n[o],i.disScope[o],o]}(e.x,e.y);var a=l(n[0],e.x,n[1],e.y);e.h=function(){var r,o=t.x,i=t.y,s=e.x,h=e.y;if(3===n.length){var l=function(t,e,n,r,o){for(;o>2*Math.PI;)o-=2*Math.PI;var i=n-t,a=r-e,s=Math.atan2(a,i),h=Math.abs(s-o);return h>Math.PI&&(h=Math.abs(2*Math.PI-h)),h}(o,i,s,h,n[2]);e.da=180*l/Math.PI,r=l>Math.PI/2?a:40*l}else r=a;return r}();var s,h=((s=a/r)>1&&(s=1),s);function l(t,e,n,r){return Math.pow(Math.pow(t-e,2)+Math.pow(n-r,2),.5)}e.f=h*e.g+(1-h)*e.h},computeWeight1:function(t,e){var n,r,o=this;[n,r]=function(t,e){var n=this.boards;if(0===n.length)return null;for(var r=h(n[0][0],t,n[0][1],e),i=0,a=1;a<n.length;a++){var s=h(n[a][0],t,n[a][1],e);s<r&&(r=s,i=a)}return[n[i],o.disScope[i]]}(e.x,e.y);var i=h(n[0],e.x,n[1],e.y);e.h=function(){var r,o=t.x,a=t.y,s=e.x,h=e.y;if(3===n.length){var l=function(t,e,n,r,o){for(;o>2*Math.PI;)o-=2*Math.PI;var i=n-t,a=r-e,s=Math.atan2(a,i),h=Math.abs(s-o);return h>Math.PI&&(h=Math.abs(2*Math.PI-h)),h}(o,a,s,h,n[2]);e.da=180*l/Math.PI,r=l>Math.PI/2?i:40*l}else r=i;return r}();var a,s=((a=i/r)>1&&(a=1),a);function h(t,e,n,r){return Math.pow(Math.pow(t-e,2)+Math.pow(n-r,2),.5)}e.f=s*e.g+(1-s)*e.h},computeWeight0:function(t,e){var n,r,o=this;[n,r]=function(t,e){var n=this.boards;if(0===n.length)return null;for(var r=h(n[0][0],t,n[0][1],e),i=0,a=1;a<n.length;a++){var s=h(n[a][0],t,n[a][1],e);s<r&&(r=s,i=a)}return[n[i],o.disScope[i]]}(e.x,e.y);var i=h(n[0],e.x,n[1],e.y);e.h=function(){var r,o=t.x,a=t.y,s=e.x,h=e.y;3===n.length?r=40*function(t,e,n,r,o){for(;o>2*Math.PI;)o-=2*Math.PI;var i=n-t,a=r-e,s=Math.atan2(a,i),h=Math.abs(s-o);return h>Math.PI&&(h=Math.abs(2*Math.PI-h)),h}(o,a,s,h,n[2]):r=i;return r}();var a,s=((a=i/r)>1&&(a=1),a);function h(t,e,n,r){return Math.pow(Math.pow(t-e,2)+Math.pow(n-r,2),.5)}e.f=s*e.g+(1-s)*e.h},findPath3:function(t,e,n,i,a){this.boards=this.computeBoards(n,i,a),this.disScope=this.computeDisScope(t,e,n,i);var s,h,l,u,p,f,d,c,g=new r((function(t,e){return t.f-e.f})),b=a.getNodeAt(t,e),v=a.getNodeAt(n,i),y=this.heuristic,M=this.diagonalMovement,A=this.weight,m=Math.abs,k=Math.SQRT2;for(b.g=0,b.f=0,g.push(b),b.opened=!0;!g.empty();){if((s=g.pop()).closed=!0,s===v)return o.backtrace(v);for(u=0,p=(h=a.getNeighbors(s,M)).length;u<p;++u)(l=h[u]).closed||(f=l.x,d=l.y,c=s.g+(f-s.x==0||d-s.y==0?1:k),(!l.opened||c<l.g)&&(l.g=c,l.h=l.h||A*y(m(f-n),m(d-i)),this.computeWeight(s,l),l.parent=s,l.opened?g.updateItem(l):(g.push(l),l.opened=!0)))}return[]}},s.prototype.findPath=function(t,e,n,i,a){var s;if(void 0!==a.boards)s=a.boards;else{s=[];for(var h=0;h<a.nodes.length;h++)for(var l=0;l<a.nodes.length;l++){var u=a.nodes[h][l].boardAngle;void 0!==u&&s.push([h,l,u])}}var p,f,d,c,g,b,v,y,M,A,m,k,W=new r((function(t,e){return t.f-e.f})),w=a.getNodeAt(t,e),x=a.getNodeAt(n,i),N=this.heuristic,I=this.diagonalMovement,P=this.weight,C=Math.abs,O=Math.SQRT2;for(w.g=0,w.f=0,W.push(w),w.opened=!0;!W.empty();){if((p=W.pop()).closed=!0,p===x)return o.backtrace(x);for(h=0,c=(f=a.getNeighbors(p,I)).length;h<c;++h)if(!(d=f[h]).closed&&(g=d.x,b=d.y,v=p.g+(g-p.x==0||b-p.y==0?1:O),!d.opened||v<d.g)){if(d.g=v,d.h=d.h||P*N(C(g-n),C(b-i)),s.length>0){var _=(y=p.x,M=p.y,k=void 0,k=function(t,e){if(0===s.length)return null;for(var n=S(s[0][0],t,s[0][1],e),r=0,o=1;o<s.length;o++){var i=S(s[o][0],t,s[o][1],e);i<n&&(n=i,r=o)}return s[r]}(A=g,m=b),[function(t,e,n,r,o){for(;o>2*Math.PI;)o-=2*Math.PI;var i=n-t,a=r-e,s=Math.atan2(a,i),h=Math.abs(s-o);return h>Math.PI&&(h=Math.abs(2*Math.PI-h)),h}(y,M,A,m,k[2]),S(k[0],A,k[1],m)]);d.l=40*_[0];var D=S(w.x,x.x,w.y,x.y),j=_[1]/(D/(s.length+1));j<0?j=0:j>1&&(j=1),d.k=j,d.distance_board=_[1],d.f=j*(d.g+d.h)+(1-j)*d.l}else d.f=d.g+d.h;function S(t,e,n,r){return Math.pow(Math.pow(t-e,2)+Math.pow(n-r,2),.5)}d.parent=p,d.opened?W.updateItem(d):(W.push(d),d.opened=!0)}}return[]},s.prototype.findPath1=function(t,e,n,i,a){for(var s=[],h=0;h<a.nodes.length;h++)for(var l=0;l<a.nodes.length;l++){var u=a.nodes[h][l].boardAngle;void 0!==u&&s.push([h,l,u])}var p,f,d,c,g,b,v,y,M,A,m,k,W=new r((function(t,e){return t.f-e.f})),w=a.getNodeAt(t,e),x=a.getNodeAt(n,i),N=this.heuristic,I=this.diagonalMovement,P=this.weight,C=Math.abs,O=Math.SQRT2;for(w.g=0,w.f=0,W.push(w),w.opened=!0;!W.empty();){if((p=W.pop()).closed=!0,p===x)return o.backtrace(x);for(h=0,c=(f=a.getNeighbors(p,I)).length;h<c;++h)if(!(d=f[h]).closed&&(g=d.x,b=d.y,v=p.g+(g-p.x==0||b-p.y==0?1:O),!d.opened||v<d.g)){if(d.g=v,d.h=d.h||P*N(C(g-n),C(b-i)),s.length>0){var _=(y=p.x,M=p.y,k=void 0,k=function(t,e){if(0===s.length)return null;for(var n=S(s[0][0],t,s[0][1],e),r=0,o=1;o<s.length;o++){var i=S(s[o][0],t,s[o][1],e);i<n&&(n=i,r=o)}return s[r]}(A=g,m=b),[function(t,e,n,r,o){for(;o>2*Math.PI;)o-=2*Math.PI;var i=n-t,a=r-e,s=Math.atan2(a,i),h=Math.abs(s-o);return h>Math.PI&&(h=Math.abs(2*Math.PI-h)),h}(y,M,A,m,k[2]),S(k[0],A,k[1],m)]);d.l=40*_[0];var D=S(w.x,x.x,w.y,x.y),j=_[1]/(D/(s.length+1));j<0?j=0:j>1&&(j=1),d.k=j,d.distance_board=_[1],d.f=j*(d.g+d.h)+(1-j)*d.l}else d.f=d.g+d.h;function S(t,e,n,r){return Math.pow(Math.pow(t-e,2)+Math.pow(n-r,2),.5)}d.parent=p,d.opened?W.updateItem(d):(W.push(d),d.opened=!0)}}return[]},s.prototype.findPath0=function(t,e,n,i,a){var s,h,l,u,p,f,d,c,g=new r((function(t,e){return t.f-e.f})),b=a.getNodeAt(t,e),v=a.getNodeAt(n,i),y=this.heuristic,M=this.diagonalMovement,A=this.weight,m=Math.abs,k=Math.SQRT2;for(b.g=0,b.f=0,g.push(b),b.opened=!0;!g.empty();){if((s=g.pop()).closed=!0,s===v)return o.backtrace(v);for(u=0,p=(h=a.getNeighbors(s,M)).length;u<p;++u)(l=h[u]).closed||(f=l.x,d=l.y,c=s.g+(f-s.x==0||d-s.y==0?1:k),(!l.opened||c<l.g)&&(l.g=c,l.h=l.h||A*y(m(f-n),m(d-i)),l.f=l.g+l.h,l.parent=s,l.opened?g.updateItem(l):(g.push(l),l.opened=!0)))}return[]},t.exports=s},174:(t,e,n)=>{var r=n(878);function o(t){r.call(this,t);var e=this.heuristic;this.heuristic=function(t,n){return 1e6*e(t,n)}}o.prototype=new r,o.prototype.constructor=o,t.exports=o},534:(t,e,n)=>{var r=n(353),o=n(902),i=n(223),a=n(911);function s(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.diagonalMovement=t.diagonalMovement,this.heuristic=t.heuristic||i.manhattan,this.weight=t.weight||1,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=a.OnlyWhenNoObstacles:this.diagonalMovement=a.IfAtMostOneObstacle:this.diagonalMovement=a.Never),this.diagonalMovement===a.Never?this.heuristic=t.heuristic||i.manhattan:this.heuristic=t.heuristic||i.octile}s.prototype.findPath=function(t,e,n,i,a){var s,h,l,u,p,f,d,c,g=function(t,e){return t.f-e.f},b=new r(g),v=new r(g),y=a.getNodeAt(t,e),M=a.getNodeAt(n,i),A=this.heuristic,m=this.diagonalMovement,k=this.weight,W=Math.abs,w=Math.SQRT2;for(y.g=0,y.f=0,b.push(y),y.opened=1,M.g=0,M.f=0,v.push(M),M.opened=2;!b.empty()&&!v.empty();){for((s=b.pop()).closed=!0,u=0,p=(h=a.getNeighbors(s,m)).length;u<p;++u)if(!(l=h[u]).closed){if(2===l.opened)return o.biBacktrace(s,l);f=l.x,d=l.y,c=s.g+(f-s.x==0||d-s.y==0?1:w),(!l.opened||c<l.g)&&(l.g=c,l.h=l.h||k*A(W(f-n),W(d-i)),l.f=l.g+l.h,l.parent=s,l.opened?b.updateItem(l):(b.push(l),l.opened=1))}for((s=v.pop()).closed=!0,u=0,p=(h=a.getNeighbors(s,m)).length;u<p;++u)if(!(l=h[u]).closed){if(1===l.opened)return o.biBacktrace(l,s);f=l.x,d=l.y,c=s.g+(f-s.x==0||d-s.y==0?1:w),(!l.opened||c<l.g)&&(l.g=c,l.h=l.h||k*A(W(f-t),W(d-e)),l.f=l.g+l.h,l.parent=s,l.opened?v.updateItem(l):(v.push(l),l.opened=2))}}return[]},t.exports=s},57:(t,e,n)=>{var r=n(534);function o(t){r.call(this,t);var e=this.heuristic;this.heuristic=function(t,n){return 1e6*e(t,n)}}o.prototype=new r,o.prototype.constructor=o,t.exports=o},764:(t,e,n)=>{var r=n(902),o=n(911);function i(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.diagonalMovement=t.diagonalMovement,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=o.OnlyWhenNoObstacles:this.diagonalMovement=o.IfAtMostOneObstacle:this.diagonalMovement=o.Never)}i.prototype.findPath=function(t,e,n,o,i){var a,s,h,l,u,p=i.getNodeAt(t,e),f=i.getNodeAt(n,o),d=[],c=[],g=this.diagonalMovement;for(d.push(p),p.opened=!0,p.by=0,c.push(f),f.opened=!0,f.by=1;d.length&&c.length;){for((h=d.shift()).closed=!0,l=0,u=(a=i.getNeighbors(h,g)).length;l<u;++l)if(!(s=a[l]).closed)if(s.opened){if(1===s.by)return r.biBacktrace(h,s)}else d.push(s),s.parent=h,s.opened=!0,s.by=0;for((h=c.shift()).closed=!0,l=0,u=(a=i.getNeighbors(h,g)).length;l<u;++l)if(!(s=a[l]).closed)if(s.opened){if(0===s.by)return r.biBacktrace(s,h)}else c.push(s),s.parent=h,s.opened=!0,s.by=1}return[]},t.exports=i},738:(t,e,n)=>{var r=n(534);function o(t){r.call(this,t),this.heuristic=function(t,e){return 0}}o.prototype=new r,o.prototype.constructor=o,t.exports=o},634:(t,e,n)=>{var r=n(902),o=n(911);function i(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.diagonalMovement=t.diagonalMovement,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=o.OnlyWhenNoObstacles:this.diagonalMovement=o.IfAtMostOneObstacle:this.diagonalMovement=o.Never)}i.prototype.findPath=function(t,e,n,o,i){var a,s,h,l,u,p=[],f=this.diagonalMovement,d=i.getNodeAt(t,e),c=i.getNodeAt(n,o);for(p.push(d),d.opened=!0;p.length;){if((h=p.shift()).closed=!0,h===c)return r.backtrace(c);for(l=0,u=(a=i.getNeighbors(h,f)).length;l<u;++l)(s=a[l]).closed||s.opened||(p.push(s),s.opened=!0,s.parent=h)}return[]},t.exports=i},929:(t,e,n)=>{var r=n(878);function o(t){r.call(this,t),this.heuristic=function(t,e){return 0}}o.prototype=new r,o.prototype.constructor=o,t.exports=o},807:(t,e,n)=>{n(902);var r=n(223),o=n(561),i=n(911);function a(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.diagonalMovement=t.diagonalMovement,this.heuristic=t.heuristic||r.manhattan,this.weight=t.weight||1,this.trackRecursion=t.trackRecursion||!1,this.timeLimit=t.timeLimit||1/0,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=i.OnlyWhenNoObstacles:this.diagonalMovement=i.IfAtMostOneObstacle:this.diagonalMovement=i.Never),this.diagonalMovement===i.Never?this.heuristic=t.heuristic||r.manhattan:this.heuristic=t.heuristic||r.octile}a.prototype.findPath=function(t,e,n,r,i){var a,s,h,l=(new Date).getTime(),u=function(t,e){return this.heuristic(Math.abs(e.x-t.x),Math.abs(e.y-t.y))}.bind(this),p=function(t,e,n,r,a){if(this.timeLimit>0&&(new Date).getTime()-l>1e3*this.timeLimit)return 1/0;var s,h,f,c,g=e+u(t,d)*this.weight;if(g>n)return g;if(t==d)return r[a]=[t.x,t.y],t;var b,v,y=i.getNeighbors(t,this.diagonalMovement);for(f=0,s=1/0;c=y[f];++f){if(this.trackRecursion&&(c.retainCount=c.retainCount+1||1,!0!==c.tested&&(c.tested=!0)),(h=p(c,e+(v=c,(b=t).x===v.x||b.y===v.y?1:Math.SQRT2),n,r,a+1))instanceof o)return r[a]=[t.x,t.y],h;this.trackRecursion&&0==--c.retainCount&&(c.tested=!1),h<s&&(s=h)}return s}.bind(this),f=i.getNodeAt(t,e),d=i.getNodeAt(n,r),c=u(f,d);for(a=0;;++a){if((h=p(f,0,c,s=[],0))===1/0)return[];if(h instanceof o)return s;c=h}return[]},t.exports=a},227:(t,e,n)=>{var r=n(150),o=n(911);function i(t){r.call(this,t)}i.prototype=new r,i.prototype.constructor=i,i.prototype._jump=function(t,e,n,r){var o=this.grid,i=t-n,a=e-r;if(!o.isWalkableAt(t,e))return null;if(!0===this.trackJumpRecursion&&(o.getNodeAt(t,e).tested=!0),o.getNodeAt(t,e)===this.endNode)return[t,e];if(0!==i&&0!==a){if(o.isWalkableAt(t-i,e+a)&&!o.isWalkableAt(t-i,e)||o.isWalkableAt(t+i,e-a)&&!o.isWalkableAt(t,e-a))return[t,e];if(this._jump(t+i,e,t,e)||this._jump(t,e+a,t,e))return[t,e]}else if(0!==i){if(o.isWalkableAt(t+i,e+1)&&!o.isWalkableAt(t,e+1)||o.isWalkableAt(t+i,e-1)&&!o.isWalkableAt(t,e-1))return[t,e]}else if(o.isWalkableAt(t+1,e+a)&&!o.isWalkableAt(t+1,e)||o.isWalkableAt(t-1,e+a)&&!o.isWalkableAt(t-1,e))return[t,e];return this._jump(t+i,e+a,t,e)},i.prototype._findNeighbors=function(t){var e,n,r,i,a,s,h,l,u=t.parent,p=t.x,f=t.y,d=this.grid,c=[];if(u)e=u.x,n=u.y,r=(p-e)/Math.max(Math.abs(p-e),1),i=(f-n)/Math.max(Math.abs(f-n),1),0!==r&&0!==i?(d.isWalkableAt(p,f+i)&&c.push([p,f+i]),d.isWalkableAt(p+r,f)&&c.push([p+r,f]),d.isWalkableAt(p+r,f+i)&&c.push([p+r,f+i]),d.isWalkableAt(p-r,f)||c.push([p-r,f+i]),d.isWalkableAt(p,f-i)||c.push([p+r,f-i])):0===r?(d.isWalkableAt(p,f+i)&&c.push([p,f+i]),d.isWalkableAt(p+1,f)||c.push([p+1,f+i]),d.isWalkableAt(p-1,f)||c.push([p-1,f+i])):(d.isWalkableAt(p+r,f)&&c.push([p+r,f]),d.isWalkableAt(p,f+1)||c.push([p+r,f+1]),d.isWalkableAt(p,f-1)||c.push([p+r,f-1]));else for(h=0,l=(a=d.getNeighbors(t,o.Always)).length;h<l;++h)s=a[h],c.push([s.x,s.y]);return c},t.exports=i},169:(t,e,n)=>{var r=n(150),o=n(911);function i(t){r.call(this,t)}i.prototype=new r,i.prototype.constructor=i,i.prototype._jump=function(t,e,n,r){var o=this.grid,i=t-n,a=e-r;if(!o.isWalkableAt(t,e))return null;if(!0===this.trackJumpRecursion&&(o.getNodeAt(t,e).tested=!0),o.getNodeAt(t,e)===this.endNode)return[t,e];if(0!==i&&0!==a){if(o.isWalkableAt(t-i,e+a)&&!o.isWalkableAt(t-i,e)||o.isWalkableAt(t+i,e-a)&&!o.isWalkableAt(t,e-a))return[t,e];if(this._jump(t+i,e,t,e)||this._jump(t,e+a,t,e))return[t,e]}else if(0!==i){if(o.isWalkableAt(t+i,e+1)&&!o.isWalkableAt(t,e+1)||o.isWalkableAt(t+i,e-1)&&!o.isWalkableAt(t,e-1))return[t,e]}else if(o.isWalkableAt(t+1,e+a)&&!o.isWalkableAt(t+1,e)||o.isWalkableAt(t-1,e+a)&&!o.isWalkableAt(t-1,e))return[t,e];return o.isWalkableAt(t+i,e)||o.isWalkableAt(t,e+a)?this._jump(t+i,e+a,t,e):null},i.prototype._findNeighbors=function(t){var e,n,r,i,a,s,h,l,u=t.parent,p=t.x,f=t.y,d=this.grid,c=[];if(u)e=u.x,n=u.y,r=(p-e)/Math.max(Math.abs(p-e),1),i=(f-n)/Math.max(Math.abs(f-n),1),0!==r&&0!==i?(d.isWalkableAt(p,f+i)&&c.push([p,f+i]),d.isWalkableAt(p+r,f)&&c.push([p+r,f]),(d.isWalkableAt(p,f+i)||d.isWalkableAt(p+r,f))&&c.push([p+r,f+i]),!d.isWalkableAt(p-r,f)&&d.isWalkableAt(p,f+i)&&c.push([p-r,f+i]),!d.isWalkableAt(p,f-i)&&d.isWalkableAt(p+r,f)&&c.push([p+r,f-i])):0===r?d.isWalkableAt(p,f+i)&&(c.push([p,f+i]),d.isWalkableAt(p+1,f)||c.push([p+1,f+i]),d.isWalkableAt(p-1,f)||c.push([p-1,f+i])):d.isWalkableAt(p+r,f)&&(c.push([p+r,f]),d.isWalkableAt(p,f+1)||c.push([p+r,f+1]),d.isWalkableAt(p,f-1)||c.push([p+r,f-1]));else for(h=0,l=(a=d.getNeighbors(t,o.IfAtMostOneObstacle)).length;h<l;++h)s=a[h],c.push([s.x,s.y]);return c},t.exports=i},410:(t,e,n)=>{var r=n(150),o=n(911);function i(t){r.call(this,t)}i.prototype=new r,i.prototype.constructor=i,i.prototype._jump=function(t,e,n,r){var o=this.grid,i=t-n,a=e-r;if(!o.isWalkableAt(t,e))return null;if(!0===this.trackJumpRecursion&&(o.getNodeAt(t,e).tested=!0),o.getNodeAt(t,e)===this.endNode)return[t,e];if(0!==i&&0!==a){if(this._jump(t+i,e,t,e)||this._jump(t,e+a,t,e))return[t,e]}else if(0!==i){if(o.isWalkableAt(t,e-1)&&!o.isWalkableAt(t-i,e-1)||o.isWalkableAt(t,e+1)&&!o.isWalkableAt(t-i,e+1))return[t,e]}else if(0!==a&&(o.isWalkableAt(t-1,e)&&!o.isWalkableAt(t-1,e-a)||o.isWalkableAt(t+1,e)&&!o.isWalkableAt(t+1,e-a)))return[t,e];return o.isWalkableAt(t+i,e)&&o.isWalkableAt(t,e+a)?this._jump(t+i,e+a,t,e):null},i.prototype._findNeighbors=function(t){var e,n,r,i,a,s,h,l,u,p=t.parent,f=t.x,d=t.y,c=this.grid,g=[];if(p){if(e=p.x,n=p.y,r=(f-e)/Math.max(Math.abs(f-e),1),i=(d-n)/Math.max(Math.abs(d-n),1),0!==r&&0!==i)c.isWalkableAt(f,d+i)&&g.push([f,d+i]),c.isWalkableAt(f+r,d)&&g.push([f+r,d]),c.isWalkableAt(f,d+i)&&c.isWalkableAt(f+r,d)&&g.push([f+r,d+i]);else if(0!==r){u=c.isWalkableAt(f+r,d);var b=c.isWalkableAt(f,d+1),v=c.isWalkableAt(f,d-1);u&&(g.push([f+r,d]),b&&g.push([f+r,d+1]),v&&g.push([f+r,d-1])),b&&g.push([f,d+1]),v&&g.push([f,d-1])}else if(0!==i){u=c.isWalkableAt(f,d+i);var y=c.isWalkableAt(f+1,d),M=c.isWalkableAt(f-1,d);u&&(g.push([f,d+i]),y&&g.push([f+1,d+i]),M&&g.push([f-1,d+i])),y&&g.push([f+1,d]),M&&g.push([f-1,d])}}else for(h=0,l=(a=c.getNeighbors(t,o.OnlyWhenNoObstacles)).length;h<l;++h)s=a[h],g.push([s.x,s.y]);return g},t.exports=i},427:(t,e,n)=>{var r=n(150),o=n(911);function i(t){r.call(this,t)}i.prototype=new r,i.prototype.constructor=i,i.prototype._jump=function(t,e,n,r){var o=this.grid,i=t-n,a=e-r;if(!o.isWalkableAt(t,e))return null;if(!0===this.trackJumpRecursion&&(o.getNodeAt(t,e).tested=!0),o.getNodeAt(t,e)===this.endNode)return[t,e];if(0!==i){if(o.isWalkableAt(t,e-1)&&!o.isWalkableAt(t-i,e-1)||o.isWalkableAt(t,e+1)&&!o.isWalkableAt(t-i,e+1))return[t,e]}else{if(0===a)throw new Error("Only horizontal and vertical movements are allowed");if(o.isWalkableAt(t-1,e)&&!o.isWalkableAt(t-1,e-a)||o.isWalkableAt(t+1,e)&&!o.isWalkableAt(t+1,e-a))return[t,e];if(this._jump(t+1,e,t,e)||this._jump(t-1,e,t,e))return[t,e]}return this._jump(t+i,e+a,t,e)},i.prototype._findNeighbors=function(t){var e,n,r,i,a,s,h,l,u=t.parent,p=t.x,f=t.y,d=this.grid,c=[];if(u)e=u.x,n=u.y,r=(p-e)/Math.max(Math.abs(p-e),1),i=(f-n)/Math.max(Math.abs(f-n),1),0!==r?(d.isWalkableAt(p,f-1)&&c.push([p,f-1]),d.isWalkableAt(p,f+1)&&c.push([p,f+1]),d.isWalkableAt(p+r,f)&&c.push([p+r,f])):0!==i&&(d.isWalkableAt(p-1,f)&&c.push([p-1,f]),d.isWalkableAt(p+1,f)&&c.push([p+1,f]),d.isWalkableAt(p,f+i)&&c.push([p,f+i]));else for(h=0,l=(a=d.getNeighbors(t,o.Never)).length;h<l;++h)s=a[h],c.push([s.x,s.y]);return c},t.exports=i},544:(t,e,n)=>{var r=n(911),o=n(427),i=n(227),a=n(410),s=n(169);t.exports=function(t){return(t=t||{}).diagonalMovement===r.Never?new o(t):t.diagonalMovement===r.Always?new i(t):t.diagonalMovement===r.OnlyWhenNoObstacles?new a(t):new s(t)}},150:(t,e,n)=>{var r=n(353),o=n(902),i=n(223);function a(t){t=t||{},this.heuristic=t.heuristic||i.manhattan,this.trackJumpRecursion=t.trackJumpRecursion||!1}n(911),a.prototype.findPath=function(t,e,n,i,a){var s,h=this.openList=new r((function(t,e){return t.f-e.f})),l=this.startNode=a.getNodeAt(t,e),u=this.endNode=a.getNodeAt(n,i);for(this.grid=a,l.g=0,l.f=0,h.push(l),l.opened=!0;!h.empty();){if((s=h.pop()).closed=!0,s===u)return o.expandPath(o.backtrace(u));this._identifySuccessors(s)}return[]},a.prototype._identifySuccessors=function(t){var e,n,r,o,a,s,h,l,u,p,f=this.grid,d=this.heuristic,c=this.openList,g=this.endNode.x,b=this.endNode.y,v=t.x,y=t.y,M=Math.abs;for(Math.max,o=0,a=(e=this._findNeighbors(t)).length;o<a;++o)if(n=e[o],r=this._jump(n[0],n[1],v,y)){if(s=r[0],h=r[1],(p=f.getNodeAt(s,h)).closed)continue;l=i.octile(M(s-v),M(h-y)),u=t.g+l,(!p.opened||u<p.g)&&(p.g=u,p.h=p.h||d(M(s-g),M(h-b)),p.f=p.g+p.h,p.parent=t,p.opened?c.updateItem(p):(c.push(p),p.opened=!0))}},t.exports=a},353:t=>{var n,r,o,i,a,s,h,l,u,p,f,d,c,g,b;o=Math.floor,p=Math.min,r=function(t,e){return e>t?-1:t>e?1:0},u=function(t,e,n,i,a){var s;if(null==n&&(n=0),null==a&&(a=r),0>n)throw new Error("lo must be non-negative");for(null==i&&(i=t.length);i>n;)a(e,t[s=o((n+i)/2)])<0?i=s:n=s+1;return[].splice.apply(t,[n,n-n].concat(e)),e},s=function(t,e,n){return null==n&&(n=r),t.push(e),g(t,0,t.length-1,n)},a=function(t,e){var n,o;return null==e&&(e=r),n=t.pop(),t.length?(o=t[0],t[0]=n,b(t,0,e)):o=n,o},l=function(t,e,n){var o;return null==n&&(n=r),o=t[0],t[0]=e,b(t,0,n),o},h=function(t,e,n){var o;return null==n&&(n=r),t.length&&n(t[0],e)<0&&(e=(o=[t[0],e])[0],t[0]=o[1],b(t,0,n)),e},i=function(t,e){var n,i,a,s,h,l;for(null==e&&(e=r),h=[],i=0,a=(s=function(){l=[];for(var e=0,n=o(t.length/2);n>=0?n>e:e>n;n>=0?e++:e--)l.push(e);return l}.apply(this).reverse()).length;a>i;i++)n=s[i],h.push(b(t,n,e));return h},c=function(t,e,n){var o;return null==n&&(n=r),-1!==(o=t.indexOf(e))?(g(t,0,o,n),b(t,o,n)):void 0},f=function(t,e,n){var o,a,s,l,u;if(null==n&&(n=r),!(a=t.slice(0,e)).length)return a;for(i(a,n),s=0,l=(u=t.slice(e)).length;l>s;s++)o=u[s],h(a,o,n);return a.sort(n).reverse()},d=function(t,e,n){var o,s,h,l,f,d,c,g,b;if(null==n&&(n=r),10*e<=t.length){if(!(h=t.slice(0,e).sort(n)).length)return h;for(s=h[h.length-1],l=0,d=(c=t.slice(e)).length;d>l;l++)n(o=c[l],s)<0&&(u(h,o,0,null,n),h.pop(),s=h[h.length-1]);return h}for(i(t,n),b=[],f=0,g=p(e,t.length);g>=0?g>f:f>g;g>=0?++f:--f)b.push(a(t,n));return b},g=function(t,e,n,o){var i,a,s;for(null==o&&(o=r),i=t[n];n>e&&o(i,a=t[s=n-1>>1])<0;)t[n]=a,n=s;return t[n]=i},b=function(t,e,n){var o,i,a,s,h;for(null==n&&(n=r),i=t.length,h=e,a=t[e],o=2*e+1;i>o;)i>(s=o+1)&&!(n(t[o],t[s])<0)&&(o=s),t[e]=t[o],o=2*(e=o)+1;return t[e]=a,g(t,h,e,n)},n=function(){function t(t){this.cmp=null!=t?t:r,this.nodes=[]}return t.push=s,t.pop=a,t.replace=l,t.pushpop=h,t.heapify=i,t.nlargest=f,t.nsmallest=d,t.prototype.push=function(t){return s(this.nodes,t,this.cmp)},t.prototype.pop=function(){return a(this.nodes,this.cmp)},t.prototype.peek=function(){return this.nodes[0]},t.prototype.contains=function(t){return-1!==this.nodes.indexOf(t)},t.prototype.replace=function(t){return l(this.nodes,t,this.cmp)},t.prototype.pushpop=function(t){return h(this.nodes,t,this.cmp)},t.prototype.heapify=function(){return i(this.nodes,this.cmp)},t.prototype.updateItem=function(t){return c(this.nodes,t,this.cmp)},t.prototype.clear=function(){return this.nodes=[]},t.prototype.empty=function(){return 0===this.nodes.length},t.prototype.size=function(){return this.nodes.length},t.prototype.clone=function(){var e;return(e=new t).nodes=this.nodes.slice(0),e},t.prototype.toArray=function(){return this.nodes.slice(0)},t.prototype.insert=t.prototype.push,t.prototype.remove=t.prototype.pop,t.prototype.top=t.prototype.peek,t.prototype.front=t.prototype.peek,t.prototype.has=t.prototype.contains,t.prototype.copy=t.prototype.clone,t}(),("undefined"!=typeof e&&null!==e?e.exports:void 0)?e.exports=n:window.Heap=n,t.exports=n}},n={};!function e(r){var o=n[r];if(void 0!==o)return o.exports;var i=n[r]={exports:{}};return t[r](i,i.exports,e),i.exports}(191)})();