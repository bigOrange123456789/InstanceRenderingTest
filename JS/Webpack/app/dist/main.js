(()=>{var t={191:(t,e,n)=>{n(925)},925:(t,e,n)=>{PF={Heap:n(353),Node:n(561),Grid:n(481),Util:n(902),DiagonalMovement:n(911),Heuristic:n(223),AStarFinder:n(878),BestFirstFinder:n(174),BreadthFirstFinder:n(634),DijkstraFinder:n(929),BiAStarFinder:n(534),BiBestFirstFinder:n(57),BiBreadthFirstFinder:n(764),BiDijkstraFinder:n(738),IDAStarFinder:n(807),JumpPointFinder:n(544)},t.exports=PF},911:t=>{t.exports={Always:1,Never:2,IfAtMostOneObstacle:3,OnlyWhenNoObstacles:4}},481:(t,e,n)=>{var o=n(561),r=n(911);function i(t,e,n){var o;"object"!=typeof t?o=t:(e=t.length,o=t[0].length,n=t),this.width=o,this.height=e,this.nodes=this._buildNodes(o,e,n)}i.prototype._buildNodes=function(t,e,n){var r,i,s=new Array(e);for(r=0;r<e;++r)for(s[r]=new Array(t),i=0;i<t;++i)s[r][i]=new o(i,r);if(void 0===n)return s;if(n.length!==e||n[0].length!==t)throw new Error("Matrix size does not fit");for(r=0;r<e;++r)for(i=0;i<t;++i)n[r][i]&&(s[r][i].walkable=!1);return s},i.prototype.getNodeAt=function(t,e){return this.nodes[e][t]},i.prototype.isWalkableAt=function(t,e){return this.isInside(t,e)&&this.nodes[e][t].walkable},i.prototype.isInside=function(t,e){return t>=0&&t<this.width&&e>=0&&e<this.height},i.prototype.setWalkableAt=function(t,e,n){this.nodes[e][t].walkable=n},i.prototype.getNeighbors=function(t,e){var n=t.x,o=t.y,i=[],s=!1,a=!1,h=!1,l=!1,u=!1,p=!1,f=!1,d=!1,c=this.nodes;if(this.isWalkableAt(n,o-1)&&(i.push(c[o-1][n]),s=!0),this.isWalkableAt(n+1,o)&&(i.push(c[o][n+1]),h=!0),this.isWalkableAt(n,o+1)&&(i.push(c[o+1][n]),u=!0),this.isWalkableAt(n-1,o)&&(i.push(c[o][n-1]),f=!0),e===r.Never)return i;if(e===r.OnlyWhenNoObstacles)a=f&&s,l=s&&h,p=h&&u,d=u&&f;else if(e===r.IfAtMostOneObstacle)a=f||s,l=s||h,p=h||u,d=u||f;else{if(e!==r.Always)throw new Error("Incorrect value of diagonalMovement");a=!0,l=!0,p=!0,d=!0}return a&&this.isWalkableAt(n-1,o-1)&&i.push(c[o-1][n-1]),l&&this.isWalkableAt(n+1,o-1)&&i.push(c[o-1][n+1]),p&&this.isWalkableAt(n+1,o+1)&&i.push(c[o+1][n+1]),d&&this.isWalkableAt(n-1,o+1)&&i.push(c[o+1][n-1]),i},i.prototype.clone=function(){var t,e,n=this.width,r=this.height,s=this.nodes,a=new i(n,r),h=new Array(r);for(t=0;t<r;++t)for(h[t]=new Array(n),e=0;e<n;++e)h[t][e]=new o(e,t,s[t][e].walkable);return a.nodes=h,a},t.exports=i},223:t=>{t.exports={manhattan:function(t,e){return t+e},euclidean:function(t,e){return Math.sqrt(t*t+e*e)},octile:function(t,e){var n=Math.SQRT2-1;return t<e?n*t+e:n*e+t},chebyshev:function(t,e){return Math.max(t,e)}}},561:t=>{t.exports=function(t,e,n){this.x=t,this.y=e,this.walkable=void 0===n||n}},902:(t,e)=>{function n(t){for(var e=[[t.x,t.y]];t.parent;)t=t.parent,e.push([t.x,t.y]);return e.reverse()}function o(t,e,n,o){var r,i,s,a,h,l,u=Math.abs,p=[];for(r=t<n?1:-1,i=e<o?1:-1,h=(s=u(n-t))-(a=u(o-e));p.push([t,e]),t!==n||e!==o;)(l=2*h)>-a&&(h-=a,t+=r),l<s&&(h+=s,e+=i);return p}e.backtrace=n,e.biBacktrace=function(t,e){var o=n(t),r=n(e);return o.concat(r.reverse())},e.pathLength=function(t){var e,n,o,r,i,s=0;for(e=1;e<t.length;++e)n=t[e-1],o=t[e],r=n[0]-o[0],i=n[1]-o[1],s+=Math.sqrt(r*r+i*i);return s},e.interpolate=o,e.expandPath=function(t){var e,n,r,i,s,a,h=[],l=t.length;if(l<2)return h;for(s=0;s<l-1;++s)for(e=t[s],n=t[s+1],i=(r=o(e[0],e[1],n[0],n[1])).length,a=0;a<i-1;++a)h.push(r[a]);return h.push(t[l-1]),h},e.smoothenPath=function(t,e){var n,r,i,s,a,h,l,u,p,f=e.length,d=e[0][0],c=e[0][1],g=e[f-1][0],b=e[f-1][1];for(i=[[n=d,r=c]],s=2;s<f;++s){for(l=o(n,r,(h=e[s])[0],h[1]),p=!1,a=1;a<l.length;++a)if(u=l[a],!t.isWalkableAt(u[0],u[1])){p=!0;break}p&&(lastValidCoord=e[s-1],i.push(lastValidCoord),n=lastValidCoord[0],r=lastValidCoord[1])}return i.push([g,b]),i},e.compressPath=function(t){if(t.length<3)return t;var e,n,o,r,i,s,a=[],h=t[0][0],l=t[0][1],u=t[1][0],p=t[1][1],f=u-h,d=p-l;for(f/=i=Math.sqrt(f*f+d*d),d/=i,a.push([h,l]),s=2;s<t.length;s++)e=u,n=p,o=f,r=d,f=(u=t[s][0])-e,d=(p=t[s][1])-n,d/=i=Math.sqrt(f*f+d*d),(f/=i)===o&&d===r||a.push([e,n]);return a.push([u,p]),a}},878:(t,e,n)=>{var o=n(353),r=n(902),i=n(223),s=n(911);function a(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.heuristic=t.heuristic||i.manhattan,this.weight=t.weight||1,this.diagonalMovement=t.diagonalMovement,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=s.OnlyWhenNoObstacles:this.diagonalMovement=s.IfAtMostOneObstacle:this.diagonalMovement=s.Never),this.diagonalMovement===s.Never?this.heuristic=t.heuristic||i.manhattan:this.heuristic=t.heuristic||i.octile,this.boards,this.disScope}a.prototype={computeDisScope:function(t,e,n,o){for(var r=[],i=l(t,n,e,o),s=0;s<this.boards.length;s++){r.push(i);for(var a=0;a<this.boards.length;a++)if(s!==a){var h=l(this.boards[s][0],this.boards[a][0],this.boards[s][1],this.boards[a][1]);h<r[s]&&(r[s]=h)}}return r;function l(t,e,n,o){return Math.pow(Math.pow(t-e,2)+Math.pow(n-o,2),.5)}},computeBoards:function(t,e,n){if(void 0!==n.boards)boards=n.boards;else{boards=[];for(var o=0;o<n.nodes.length;o++)for(var r=0;r<n.nodes.length;r++){var i=n.nodes[o][r].boardAngle;void 0!==i&&boards.push([o,r,i])}}return boards.push([t,e]),boards},computeWeight:function(t,e){var n,o,r=this;[n,o]=function(t,e){var n=this.boards;if(0===n.length)return null;for(var o=h(n[0][0],t,n[0][1],e),i=0,s=1;s<n.length;s++){var a=h(n[s][0],t,n[s][1],e);a<o&&(o=a,i=s)}return[n[i],r.disScope[i]]}(e.x,e.y);var i=h(n[0],e.x,n[1],e.y);e.h=function(){var o,r=t.x,s=t.y,a=e.x,h=e.y;3===n.length?o=40*function(t,e,n,o,r){for(;r>2*Math.PI;)r-=2*Math.PI;var i=n-t,s=o-e,a=Math.atan2(s,i),h=Math.abs(a-r);return h>Math.PI&&(h=Math.abs(2*Math.PI-h)),h}(r,s,a,h,n[2]):o=i;return o}();var s,a=((s=i/o)>1&&(s=1),s);function h(t,e,n,o){return Math.pow(Math.pow(t-e,2)+Math.pow(n-o,2),.5)}e.f=a*e.g+(1-a)*e.h},findPath:function(t,e,n,i,s){this.boards=this.computeBoards(n,i,s),this.disScope=this.computeDisScope(t,e,n,i);var a,h,l,u,p,f,d,c,g=new o((function(t,e){return t.f-e.f})),b=s.getNodeAt(t,e),v=s.getNodeAt(n,i),y=this.heuristic,A=this.diagonalMovement,k=this.weight,m=Math.abs,M=Math.SQRT2;for(b.g=0,b.f=0,g.push(b),b.opened=!0;!g.empty();){if((a=g.pop()).closed=!0,a===v)return r.backtrace(v);for(u=0,p=(h=s.getNeighbors(a,A)).length;u<p;++u)(l=h[u]).closed||(f=l.x,d=l.y,c=a.g+(f-a.x==0||d-a.y==0?1:M),(!l.opened||c<l.g)&&(l.g=c,l.h=l.h||k*y(m(f-n),m(d-i)),this.computeWeight(a,l),l.parent=a,l.opened?g.updateItem(l):(g.push(l),l.opened=!0)))}return[]}},a.prototype.findPath2=function(t,e,n,i,s){var a;if(void 0!==s.boards)a=s.boards;else{a=[];for(var h=0;h<s.nodes.length;h++)for(var l=0;l<s.nodes.length;l++){var u=s.nodes[h][l].boardAngle;void 0!==u&&a.push([h,l,u])}}var p,f,d,c,g,b,v,y,A,k,m,M,W=new o((function(t,e){return t.f-e.f})),w=s.getNodeAt(t,e),x=s.getNodeAt(n,i),N=this.heuristic,C=this.diagonalMovement,O=this.weight,I=Math.abs,P=Math.SQRT2;for(w.g=0,w.f=0,W.push(w),w.opened=!0;!W.empty();){if((p=W.pop()).closed=!0,p===x)return r.backtrace(x);for(h=0,c=(f=s.getNeighbors(p,C)).length;h<c;++h)if(!(d=f[h]).closed&&(g=d.x,b=d.y,v=p.g+(g-p.x==0||b-p.y==0?1:P),!d.opened||v<d.g)){if(d.g=v,d.h=d.h||O*N(I(g-n),I(b-i)),a.length>0){var _=(y=p.x,A=p.y,M=void 0,M=function(t,e){if(0===a.length)return null;for(var n=R(a[0][0],t,a[0][1],e),o=0,r=1;r<a.length;r++){var i=R(a[r][0],t,a[r][1],e);i<n&&(n=i,o=r)}return a[o]}(k=g,m=b),[function(t,e,n,o,r){for(;r>2*Math.PI;)r-=2*Math.PI;var i=n-t,s=o-e,a=Math.atan2(s,i),h=Math.abs(a-r);return h>Math.PI&&(h=Math.abs(2*Math.PI-h)),h}(y,A,k,m,M[2]),R(M[0],k,M[1],m)]);d.l=40*_[0];var D=R(w.x,x.x,w.y,x.y),j=_[1]/(D/(a.length+1));j<0?j=0:j>1&&(j=1),d.k=j,d.distance_board=_[1],d.f=j*(d.g+d.h)+(1-j)*d.l}else d.f=d.g+d.h;function R(t,e,n,o){return Math.pow(Math.pow(t-e,2)+Math.pow(n-o,2),.5)}d.parent=p,d.opened?W.updateItem(d):(W.push(d),d.opened=!0)}}return[]},a.prototype.findPath1=function(t,e,n,i,s){for(var a=[],h=0;h<s.nodes.length;h++)for(var l=0;l<s.nodes.length;l++){var u=s.nodes[h][l].boardAngle;void 0!==u&&a.push([h,l,u])}var p,f,d,c,g,b,v,y,A,k,m,M,W=new o((function(t,e){return t.f-e.f})),w=s.getNodeAt(t,e),x=s.getNodeAt(n,i),N=this.heuristic,C=this.diagonalMovement,O=this.weight,I=Math.abs,P=Math.SQRT2;for(w.g=0,w.f=0,W.push(w),w.opened=!0;!W.empty();){if((p=W.pop()).closed=!0,p===x)return r.backtrace(x);for(h=0,c=(f=s.getNeighbors(p,C)).length;h<c;++h)if(!(d=f[h]).closed&&(g=d.x,b=d.y,v=p.g+(g-p.x==0||b-p.y==0?1:P),!d.opened||v<d.g)){if(d.g=v,d.h=d.h||O*N(I(g-n),I(b-i)),a.length>0){var _=(y=p.x,A=p.y,M=void 0,M=function(t,e){if(0===a.length)return null;for(var n=R(a[0][0],t,a[0][1],e),o=0,r=1;r<a.length;r++){var i=R(a[r][0],t,a[r][1],e);i<n&&(n=i,o=r)}return a[o]}(k=g,m=b),[function(t,e,n,o,r){for(;r>2*Math.PI;)r-=2*Math.PI;var i=n-t,s=o-e,a=Math.atan2(s,i),h=Math.abs(a-r);return h>Math.PI&&(h=Math.abs(2*Math.PI-h)),h}(y,A,k,m,M[2]),R(M[0],k,M[1],m)]);d.l=40*_[0];var D=R(w.x,x.x,w.y,x.y),j=_[1]/(D/(a.length+1));j<0?j=0:j>1&&(j=1),d.k=j,d.distance_board=_[1],d.f=j*(d.g+d.h)+(1-j)*d.l}else d.f=d.g+d.h;function R(t,e,n,o){return Math.pow(Math.pow(t-e,2)+Math.pow(n-o,2),.5)}d.parent=p,d.opened?W.updateItem(d):(W.push(d),d.opened=!0)}}return[]},a.prototype.findPath0=function(t,e,n,i,s){var a,h,l,u,p,f,d,c,g=new o((function(t,e){return t.f-e.f})),b=s.getNodeAt(t,e),v=s.getNodeAt(n,i),y=this.heuristic,A=this.diagonalMovement,k=this.weight,m=Math.abs,M=Math.SQRT2;for(b.g=0,b.f=0,g.push(b),b.opened=!0;!g.empty();){if((a=g.pop()).closed=!0,a===v)return r.backtrace(v);for(u=0,p=(h=s.getNeighbors(a,A)).length;u<p;++u)(l=h[u]).closed||(f=l.x,d=l.y,c=a.g+(f-a.x==0||d-a.y==0?1:M),(!l.opened||c<l.g)&&(l.g=c,l.h=l.h||k*y(m(f-n),m(d-i)),l.f=l.g+l.h,l.parent=a,l.opened?g.updateItem(l):(g.push(l),l.opened=!0)))}return[]},t.exports=a},174:(t,e,n)=>{var o=n(878);function r(t){o.call(this,t);var e=this.heuristic;this.heuristic=function(t,n){return 1e6*e(t,n)}}r.prototype=new o,r.prototype.constructor=r,t.exports=r},534:(t,e,n)=>{var o=n(353),r=n(902),i=n(223),s=n(911);function a(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.diagonalMovement=t.diagonalMovement,this.heuristic=t.heuristic||i.manhattan,this.weight=t.weight||1,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=s.OnlyWhenNoObstacles:this.diagonalMovement=s.IfAtMostOneObstacle:this.diagonalMovement=s.Never),this.diagonalMovement===s.Never?this.heuristic=t.heuristic||i.manhattan:this.heuristic=t.heuristic||i.octile}a.prototype.findPath=function(t,e,n,i,s){var a,h,l,u,p,f,d,c,g=function(t,e){return t.f-e.f},b=new o(g),v=new o(g),y=s.getNodeAt(t,e),A=s.getNodeAt(n,i),k=this.heuristic,m=this.diagonalMovement,M=this.weight,W=Math.abs,w=Math.SQRT2;for(y.g=0,y.f=0,b.push(y),y.opened=1,A.g=0,A.f=0,v.push(A),A.opened=2;!b.empty()&&!v.empty();){for((a=b.pop()).closed=!0,u=0,p=(h=s.getNeighbors(a,m)).length;u<p;++u)if(!(l=h[u]).closed){if(2===l.opened)return r.biBacktrace(a,l);f=l.x,d=l.y,c=a.g+(f-a.x==0||d-a.y==0?1:w),(!l.opened||c<l.g)&&(l.g=c,l.h=l.h||M*k(W(f-n),W(d-i)),l.f=l.g+l.h,l.parent=a,l.opened?b.updateItem(l):(b.push(l),l.opened=1))}for((a=v.pop()).closed=!0,u=0,p=(h=s.getNeighbors(a,m)).length;u<p;++u)if(!(l=h[u]).closed){if(1===l.opened)return r.biBacktrace(l,a);f=l.x,d=l.y,c=a.g+(f-a.x==0||d-a.y==0?1:w),(!l.opened||c<l.g)&&(l.g=c,l.h=l.h||M*k(W(f-t),W(d-e)),l.f=l.g+l.h,l.parent=a,l.opened?v.updateItem(l):(v.push(l),l.opened=2))}}return[]},t.exports=a},57:(t,e,n)=>{var o=n(534);function r(t){o.call(this,t);var e=this.heuristic;this.heuristic=function(t,n){return 1e6*e(t,n)}}r.prototype=new o,r.prototype.constructor=r,t.exports=r},764:(t,e,n)=>{var o=n(902),r=n(911);function i(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.diagonalMovement=t.diagonalMovement,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=r.OnlyWhenNoObstacles:this.diagonalMovement=r.IfAtMostOneObstacle:this.diagonalMovement=r.Never)}i.prototype.findPath=function(t,e,n,r,i){var s,a,h,l,u,p=i.getNodeAt(t,e),f=i.getNodeAt(n,r),d=[],c=[],g=this.diagonalMovement;for(d.push(p),p.opened=!0,p.by=0,c.push(f),f.opened=!0,f.by=1;d.length&&c.length;){for((h=d.shift()).closed=!0,l=0,u=(s=i.getNeighbors(h,g)).length;l<u;++l)if(!(a=s[l]).closed)if(a.opened){if(1===a.by)return o.biBacktrace(h,a)}else d.push(a),a.parent=h,a.opened=!0,a.by=0;for((h=c.shift()).closed=!0,l=0,u=(s=i.getNeighbors(h,g)).length;l<u;++l)if(!(a=s[l]).closed)if(a.opened){if(0===a.by)return o.biBacktrace(a,h)}else c.push(a),a.parent=h,a.opened=!0,a.by=1}return[]},t.exports=i},738:(t,e,n)=>{var o=n(534);function r(t){o.call(this,t),this.heuristic=function(t,e){return 0}}r.prototype=new o,r.prototype.constructor=r,t.exports=r},634:(t,e,n)=>{var o=n(902),r=n(911);function i(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.diagonalMovement=t.diagonalMovement,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=r.OnlyWhenNoObstacles:this.diagonalMovement=r.IfAtMostOneObstacle:this.diagonalMovement=r.Never)}i.prototype.findPath=function(t,e,n,r,i){var s,a,h,l,u,p=[],f=this.diagonalMovement,d=i.getNodeAt(t,e),c=i.getNodeAt(n,r);for(p.push(d),d.opened=!0;p.length;){if((h=p.shift()).closed=!0,h===c)return o.backtrace(c);for(l=0,u=(s=i.getNeighbors(h,f)).length;l<u;++l)(a=s[l]).closed||a.opened||(p.push(a),a.opened=!0,a.parent=h)}return[]},t.exports=i},929:(t,e,n)=>{var o=n(878);function r(t){o.call(this,t),this.heuristic=function(t,e){return 0}}r.prototype=new o,r.prototype.constructor=r,t.exports=r},807:(t,e,n)=>{n(902);var o=n(223),r=n(561),i=n(911);function s(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.diagonalMovement=t.diagonalMovement,this.heuristic=t.heuristic||o.manhattan,this.weight=t.weight||1,this.trackRecursion=t.trackRecursion||!1,this.timeLimit=t.timeLimit||1/0,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=i.OnlyWhenNoObstacles:this.diagonalMovement=i.IfAtMostOneObstacle:this.diagonalMovement=i.Never),this.diagonalMovement===i.Never?this.heuristic=t.heuristic||o.manhattan:this.heuristic=t.heuristic||o.octile}s.prototype.findPath=function(t,e,n,o,i){var s,a,h,l=(new Date).getTime(),u=function(t,e){return this.heuristic(Math.abs(e.x-t.x),Math.abs(e.y-t.y))}.bind(this),p=function(t,e,n,o,s){if(this.timeLimit>0&&(new Date).getTime()-l>1e3*this.timeLimit)return 1/0;var a,h,f,c,g=e+u(t,d)*this.weight;if(g>n)return g;if(t==d)return o[s]=[t.x,t.y],t;var b,v,y=i.getNeighbors(t,this.diagonalMovement);for(f=0,a=1/0;c=y[f];++f){if(this.trackRecursion&&(c.retainCount=c.retainCount+1||1,!0!==c.tested&&(c.tested=!0)),(h=p(c,e+(v=c,(b=t).x===v.x||b.y===v.y?1:Math.SQRT2),n,o,s+1))instanceof r)return o[s]=[t.x,t.y],h;this.trackRecursion&&0==--c.retainCount&&(c.tested=!1),h<a&&(a=h)}return a}.bind(this),f=i.getNodeAt(t,e),d=i.getNodeAt(n,o),c=u(f,d);for(s=0;;++s){if((h=p(f,0,c,a=[],0))===1/0)return[];if(h instanceof r)return a;c=h}return[]},t.exports=s},227:(t,e,n)=>{var o=n(150),r=n(911);function i(t){o.call(this,t)}i.prototype=new o,i.prototype.constructor=i,i.prototype._jump=function(t,e,n,o){var r=this.grid,i=t-n,s=e-o;if(!r.isWalkableAt(t,e))return null;if(!0===this.trackJumpRecursion&&(r.getNodeAt(t,e).tested=!0),r.getNodeAt(t,e)===this.endNode)return[t,e];if(0!==i&&0!==s){if(r.isWalkableAt(t-i,e+s)&&!r.isWalkableAt(t-i,e)||r.isWalkableAt(t+i,e-s)&&!r.isWalkableAt(t,e-s))return[t,e];if(this._jump(t+i,e,t,e)||this._jump(t,e+s,t,e))return[t,e]}else if(0!==i){if(r.isWalkableAt(t+i,e+1)&&!r.isWalkableAt(t,e+1)||r.isWalkableAt(t+i,e-1)&&!r.isWalkableAt(t,e-1))return[t,e]}else if(r.isWalkableAt(t+1,e+s)&&!r.isWalkableAt(t+1,e)||r.isWalkableAt(t-1,e+s)&&!r.isWalkableAt(t-1,e))return[t,e];return this._jump(t+i,e+s,t,e)},i.prototype._findNeighbors=function(t){var e,n,o,i,s,a,h,l,u=t.parent,p=t.x,f=t.y,d=this.grid,c=[];if(u)e=u.x,n=u.y,o=(p-e)/Math.max(Math.abs(p-e),1),i=(f-n)/Math.max(Math.abs(f-n),1),0!==o&&0!==i?(d.isWalkableAt(p,f+i)&&c.push([p,f+i]),d.isWalkableAt(p+o,f)&&c.push([p+o,f]),d.isWalkableAt(p+o,f+i)&&c.push([p+o,f+i]),d.isWalkableAt(p-o,f)||c.push([p-o,f+i]),d.isWalkableAt(p,f-i)||c.push([p+o,f-i])):0===o?(d.isWalkableAt(p,f+i)&&c.push([p,f+i]),d.isWalkableAt(p+1,f)||c.push([p+1,f+i]),d.isWalkableAt(p-1,f)||c.push([p-1,f+i])):(d.isWalkableAt(p+o,f)&&c.push([p+o,f]),d.isWalkableAt(p,f+1)||c.push([p+o,f+1]),d.isWalkableAt(p,f-1)||c.push([p+o,f-1]));else for(h=0,l=(s=d.getNeighbors(t,r.Always)).length;h<l;++h)a=s[h],c.push([a.x,a.y]);return c},t.exports=i},169:(t,e,n)=>{var o=n(150),r=n(911);function i(t){o.call(this,t)}i.prototype=new o,i.prototype.constructor=i,i.prototype._jump=function(t,e,n,o){var r=this.grid,i=t-n,s=e-o;if(!r.isWalkableAt(t,e))return null;if(!0===this.trackJumpRecursion&&(r.getNodeAt(t,e).tested=!0),r.getNodeAt(t,e)===this.endNode)return[t,e];if(0!==i&&0!==s){if(r.isWalkableAt(t-i,e+s)&&!r.isWalkableAt(t-i,e)||r.isWalkableAt(t+i,e-s)&&!r.isWalkableAt(t,e-s))return[t,e];if(this._jump(t+i,e,t,e)||this._jump(t,e+s,t,e))return[t,e]}else if(0!==i){if(r.isWalkableAt(t+i,e+1)&&!r.isWalkableAt(t,e+1)||r.isWalkableAt(t+i,e-1)&&!r.isWalkableAt(t,e-1))return[t,e]}else if(r.isWalkableAt(t+1,e+s)&&!r.isWalkableAt(t+1,e)||r.isWalkableAt(t-1,e+s)&&!r.isWalkableAt(t-1,e))return[t,e];return r.isWalkableAt(t+i,e)||r.isWalkableAt(t,e+s)?this._jump(t+i,e+s,t,e):null},i.prototype._findNeighbors=function(t){var e,n,o,i,s,a,h,l,u=t.parent,p=t.x,f=t.y,d=this.grid,c=[];if(u)e=u.x,n=u.y,o=(p-e)/Math.max(Math.abs(p-e),1),i=(f-n)/Math.max(Math.abs(f-n),1),0!==o&&0!==i?(d.isWalkableAt(p,f+i)&&c.push([p,f+i]),d.isWalkableAt(p+o,f)&&c.push([p+o,f]),(d.isWalkableAt(p,f+i)||d.isWalkableAt(p+o,f))&&c.push([p+o,f+i]),!d.isWalkableAt(p-o,f)&&d.isWalkableAt(p,f+i)&&c.push([p-o,f+i]),!d.isWalkableAt(p,f-i)&&d.isWalkableAt(p+o,f)&&c.push([p+o,f-i])):0===o?d.isWalkableAt(p,f+i)&&(c.push([p,f+i]),d.isWalkableAt(p+1,f)||c.push([p+1,f+i]),d.isWalkableAt(p-1,f)||c.push([p-1,f+i])):d.isWalkableAt(p+o,f)&&(c.push([p+o,f]),d.isWalkableAt(p,f+1)||c.push([p+o,f+1]),d.isWalkableAt(p,f-1)||c.push([p+o,f-1]));else for(h=0,l=(s=d.getNeighbors(t,r.IfAtMostOneObstacle)).length;h<l;++h)a=s[h],c.push([a.x,a.y]);return c},t.exports=i},410:(t,e,n)=>{var o=n(150),r=n(911);function i(t){o.call(this,t)}i.prototype=new o,i.prototype.constructor=i,i.prototype._jump=function(t,e,n,o){var r=this.grid,i=t-n,s=e-o;if(!r.isWalkableAt(t,e))return null;if(!0===this.trackJumpRecursion&&(r.getNodeAt(t,e).tested=!0),r.getNodeAt(t,e)===this.endNode)return[t,e];if(0!==i&&0!==s){if(this._jump(t+i,e,t,e)||this._jump(t,e+s,t,e))return[t,e]}else if(0!==i){if(r.isWalkableAt(t,e-1)&&!r.isWalkableAt(t-i,e-1)||r.isWalkableAt(t,e+1)&&!r.isWalkableAt(t-i,e+1))return[t,e]}else if(0!==s&&(r.isWalkableAt(t-1,e)&&!r.isWalkableAt(t-1,e-s)||r.isWalkableAt(t+1,e)&&!r.isWalkableAt(t+1,e-s)))return[t,e];return r.isWalkableAt(t+i,e)&&r.isWalkableAt(t,e+s)?this._jump(t+i,e+s,t,e):null},i.prototype._findNeighbors=function(t){var e,n,o,i,s,a,h,l,u,p=t.parent,f=t.x,d=t.y,c=this.grid,g=[];if(p){if(e=p.x,n=p.y,o=(f-e)/Math.max(Math.abs(f-e),1),i=(d-n)/Math.max(Math.abs(d-n),1),0!==o&&0!==i)c.isWalkableAt(f,d+i)&&g.push([f,d+i]),c.isWalkableAt(f+o,d)&&g.push([f+o,d]),c.isWalkableAt(f,d+i)&&c.isWalkableAt(f+o,d)&&g.push([f+o,d+i]);else if(0!==o){u=c.isWalkableAt(f+o,d);var b=c.isWalkableAt(f,d+1),v=c.isWalkableAt(f,d-1);u&&(g.push([f+o,d]),b&&g.push([f+o,d+1]),v&&g.push([f+o,d-1])),b&&g.push([f,d+1]),v&&g.push([f,d-1])}else if(0!==i){u=c.isWalkableAt(f,d+i);var y=c.isWalkableAt(f+1,d),A=c.isWalkableAt(f-1,d);u&&(g.push([f,d+i]),y&&g.push([f+1,d+i]),A&&g.push([f-1,d+i])),y&&g.push([f+1,d]),A&&g.push([f-1,d])}}else for(h=0,l=(s=c.getNeighbors(t,r.OnlyWhenNoObstacles)).length;h<l;++h)a=s[h],g.push([a.x,a.y]);return g},t.exports=i},427:(t,e,n)=>{var o=n(150),r=n(911);function i(t){o.call(this,t)}i.prototype=new o,i.prototype.constructor=i,i.prototype._jump=function(t,e,n,o){var r=this.grid,i=t-n,s=e-o;if(!r.isWalkableAt(t,e))return null;if(!0===this.trackJumpRecursion&&(r.getNodeAt(t,e).tested=!0),r.getNodeAt(t,e)===this.endNode)return[t,e];if(0!==i){if(r.isWalkableAt(t,e-1)&&!r.isWalkableAt(t-i,e-1)||r.isWalkableAt(t,e+1)&&!r.isWalkableAt(t-i,e+1))return[t,e]}else{if(0===s)throw new Error("Only horizontal and vertical movements are allowed");if(r.isWalkableAt(t-1,e)&&!r.isWalkableAt(t-1,e-s)||r.isWalkableAt(t+1,e)&&!r.isWalkableAt(t+1,e-s))return[t,e];if(this._jump(t+1,e,t,e)||this._jump(t-1,e,t,e))return[t,e]}return this._jump(t+i,e+s,t,e)},i.prototype._findNeighbors=function(t){var e,n,o,i,s,a,h,l,u=t.parent,p=t.x,f=t.y,d=this.grid,c=[];if(u)e=u.x,n=u.y,o=(p-e)/Math.max(Math.abs(p-e),1),i=(f-n)/Math.max(Math.abs(f-n),1),0!==o?(d.isWalkableAt(p,f-1)&&c.push([p,f-1]),d.isWalkableAt(p,f+1)&&c.push([p,f+1]),d.isWalkableAt(p+o,f)&&c.push([p+o,f])):0!==i&&(d.isWalkableAt(p-1,f)&&c.push([p-1,f]),d.isWalkableAt(p+1,f)&&c.push([p+1,f]),d.isWalkableAt(p,f+i)&&c.push([p,f+i]));else for(h=0,l=(s=d.getNeighbors(t,r.Never)).length;h<l;++h)a=s[h],c.push([a.x,a.y]);return c},t.exports=i},544:(t,e,n)=>{var o=n(911),r=n(427),i=n(227),s=n(410),a=n(169);t.exports=function(t){return(t=t||{}).diagonalMovement===o.Never?new r(t):t.diagonalMovement===o.Always?new i(t):t.diagonalMovement===o.OnlyWhenNoObstacles?new s(t):new a(t)}},150:(t,e,n)=>{var o=n(353),r=n(902),i=n(223);function s(t){t=t||{},this.heuristic=t.heuristic||i.manhattan,this.trackJumpRecursion=t.trackJumpRecursion||!1}n(911),s.prototype.findPath=function(t,e,n,i,s){var a,h=this.openList=new o((function(t,e){return t.f-e.f})),l=this.startNode=s.getNodeAt(t,e),u=this.endNode=s.getNodeAt(n,i);for(this.grid=s,l.g=0,l.f=0,h.push(l),l.opened=!0;!h.empty();){if((a=h.pop()).closed=!0,a===u)return r.expandPath(r.backtrace(u));this._identifySuccessors(a)}return[]},s.prototype._identifySuccessors=function(t){var e,n,o,r,s,a,h,l,u,p,f=this.grid,d=this.heuristic,c=this.openList,g=this.endNode.x,b=this.endNode.y,v=t.x,y=t.y,A=Math.abs;for(Math.max,r=0,s=(e=this._findNeighbors(t)).length;r<s;++r)if(n=e[r],o=this._jump(n[0],n[1],v,y)){if(a=o[0],h=o[1],(p=f.getNodeAt(a,h)).closed)continue;l=i.octile(A(a-v),A(h-y)),u=t.g+l,(!p.opened||u<p.g)&&(p.g=u,p.h=p.h||d(A(a-g),A(h-b)),p.f=p.g+p.h,p.parent=t,p.opened?c.updateItem(p):(c.push(p),p.opened=!0))}},t.exports=s},353:t=>{var n,o,r,i,s,a,h,l,u,p,f,d,c,g,b;r=Math.floor,p=Math.min,o=function(t,e){return e>t?-1:t>e?1:0},u=function(t,e,n,i,s){var a;if(null==n&&(n=0),null==s&&(s=o),0>n)throw new Error("lo must be non-negative");for(null==i&&(i=t.length);i>n;)s(e,t[a=r((n+i)/2)])<0?i=a:n=a+1;return[].splice.apply(t,[n,n-n].concat(e)),e},a=function(t,e,n){return null==n&&(n=o),t.push(e),g(t,0,t.length-1,n)},s=function(t,e){var n,r;return null==e&&(e=o),n=t.pop(),t.length?(r=t[0],t[0]=n,b(t,0,e)):r=n,r},l=function(t,e,n){var r;return null==n&&(n=o),r=t[0],t[0]=e,b(t,0,n),r},h=function(t,e,n){var r;return null==n&&(n=o),t.length&&n(t[0],e)<0&&(e=(r=[t[0],e])[0],t[0]=r[1],b(t,0,n)),e},i=function(t,e){var n,i,s,a,h,l;for(null==e&&(e=o),h=[],i=0,s=(a=function(){l=[];for(var e=0,n=r(t.length/2);n>=0?n>e:e>n;n>=0?e++:e--)l.push(e);return l}.apply(this).reverse()).length;s>i;i++)n=a[i],h.push(b(t,n,e));return h},c=function(t,e,n){var r;return null==n&&(n=o),-1!==(r=t.indexOf(e))?(g(t,0,r,n),b(t,r,n)):void 0},f=function(t,e,n){var r,s,a,l,u;if(null==n&&(n=o),!(s=t.slice(0,e)).length)return s;for(i(s,n),a=0,l=(u=t.slice(e)).length;l>a;a++)r=u[a],h(s,r,n);return s.sort(n).reverse()},d=function(t,e,n){var r,a,h,l,f,d,c,g,b;if(null==n&&(n=o),10*e<=t.length){if(!(h=t.slice(0,e).sort(n)).length)return h;for(a=h[h.length-1],l=0,d=(c=t.slice(e)).length;d>l;l++)n(r=c[l],a)<0&&(u(h,r,0,null,n),h.pop(),a=h[h.length-1]);return h}for(i(t,n),b=[],f=0,g=p(e,t.length);g>=0?g>f:f>g;g>=0?++f:--f)b.push(s(t,n));return b},g=function(t,e,n,r){var i,s,a;for(null==r&&(r=o),i=t[n];n>e&&r(i,s=t[a=n-1>>1])<0;)t[n]=s,n=a;return t[n]=i},b=function(t,e,n){var r,i,s,a,h;for(null==n&&(n=o),i=t.length,h=e,s=t[e],r=2*e+1;i>r;)i>(a=r+1)&&!(n(t[r],t[a])<0)&&(r=a),t[e]=t[r],r=2*(e=r)+1;return t[e]=s,g(t,h,e,n)},n=function(){function t(t){this.cmp=null!=t?t:o,this.nodes=[]}return t.push=a,t.pop=s,t.replace=l,t.pushpop=h,t.heapify=i,t.nlargest=f,t.nsmallest=d,t.prototype.push=function(t){return a(this.nodes,t,this.cmp)},t.prototype.pop=function(){return s(this.nodes,this.cmp)},t.prototype.peek=function(){return this.nodes[0]},t.prototype.contains=function(t){return-1!==this.nodes.indexOf(t)},t.prototype.replace=function(t){return l(this.nodes,t,this.cmp)},t.prototype.pushpop=function(t){return h(this.nodes,t,this.cmp)},t.prototype.heapify=function(){return i(this.nodes,this.cmp)},t.prototype.updateItem=function(t){return c(this.nodes,t,this.cmp)},t.prototype.clear=function(){return this.nodes=[]},t.prototype.empty=function(){return 0===this.nodes.length},t.prototype.size=function(){return this.nodes.length},t.prototype.clone=function(){var e;return(e=new t).nodes=this.nodes.slice(0),e},t.prototype.toArray=function(){return this.nodes.slice(0)},t.prototype.insert=t.prototype.push,t.prototype.remove=t.prototype.pop,t.prototype.top=t.prototype.peek,t.prototype.front=t.prototype.peek,t.prototype.has=t.prototype.contains,t.prototype.copy=t.prototype.clone,t}(),("undefined"!=typeof e&&null!==e?e.exports:void 0)?e.exports=n:window.Heap=n,t.exports=n}},n={};!function e(o){var r=n[o];if(void 0!==r)return r.exports;var i=n[o]={exports:{}};return t[o](i,i.exports,e),i.exports}(191)})();