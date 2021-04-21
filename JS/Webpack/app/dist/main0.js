(()=>{var t={191:(t,e,n)=>{n(925)},925:(t,e,n)=>{PF={Heap:n(353),Node:n(561),Grid:n(481),Util:n(902),DiagonalMovement:n(911),Heuristic:n(223),AStarFinder:n(878),BestFirstFinder:n(174),BreadthFirstFinder:n(634),DijkstraFinder:n(929),BiAStarFinder:n(534),BiBestFirstFinder:n(57),BiBreadthFirstFinder:n(764),BiDijkstraFinder:n(738),IDAStarFinder:n(807),JumpPointFinder:n(544)},t.exports=PF},911:t=>{t.exports={Always:1,Never:2,IfAtMostOneObstacle:3,OnlyWhenNoObstacles:4}},481:(t,e,n)=>{var i=n(561),r=n(911);function o(t,e,n){var i;"object"!=typeof t?i=t:(e=t.length,i=t[0].length,n=t),this.width=i,this.height=e,this.nodes=this._buildNodes(i,e,n)}o.prototype._buildNodes=function(t,e,n){var r,o,s=new Array(e);for(r=0;r<e;++r)for(s[r]=new Array(t),o=0;o<t;++o)s[r][o]=new i(o,r);if(void 0===n)return s;if(n.length!==e||n[0].length!==t)throw new Error("Matrix size does not fit");for(r=0;r<e;++r)for(o=0;o<t;++o)n[r][o]&&(s[r][o].walkable=!1);return s},o.prototype.getNodeAt=function(t,e){return this.nodes[e][t]},o.prototype.isWalkableAt=function(t,e){return this.isInside(t,e)&&this.nodes[e][t].walkable},o.prototype.isInside=function(t,e){return t>=0&&t<this.width&&e>=0&&e<this.height},o.prototype.setWalkableAt=function(t,e,n){this.nodes[e][t].walkable=n},o.prototype.getNeighbors=function(t,e){var n=t.x,i=t.y,o=[],s=!1,a=!1,l=!1,h=!1,u=!1,p=!1,f=!1,d=!1,c=this.nodes;if(this.isWalkableAt(n,i-1)&&(o.push(c[i-1][n]),s=!0),this.isWalkableAt(n+1,i)&&(o.push(c[i][n+1]),l=!0),this.isWalkableAt(n,i+1)&&(o.push(c[i+1][n]),u=!0),this.isWalkableAt(n-1,i)&&(o.push(c[i][n-1]),f=!0),e===r.Never)return o;if(e===r.OnlyWhenNoObstacles)a=f&&s,h=s&&l,p=l&&u,d=u&&f;else if(e===r.IfAtMostOneObstacle)a=f||s,h=s||l,p=l||u,d=u||f;else{if(e!==r.Always)throw new Error("Incorrect value of diagonalMovement");a=!0,h=!0,p=!0,d=!0}return a&&this.isWalkableAt(n-1,i-1)&&o.push(c[i-1][n-1]),h&&this.isWalkableAt(n+1,i-1)&&o.push(c[i-1][n+1]),p&&this.isWalkableAt(n+1,i+1)&&o.push(c[i+1][n+1]),d&&this.isWalkableAt(n-1,i+1)&&o.push(c[i+1][n-1]),o},o.prototype.clone=function(){var t,e,n=this.width,r=this.height,s=this.nodes,a=new o(n,r),l=new Array(r);for(t=0;t<r;++t)for(l[t]=new Array(n),e=0;e<n;++e)l[t][e]=new i(e,t,s[t][e].walkable);return a.nodes=l,a},t.exports=o},223:t=>{t.exports={manhattan:function(t,e){return t+e},euclidean:function(t,e){return Math.sqrt(t*t+e*e)},octile:function(t,e){var n=Math.SQRT2-1;return t<e?n*t+e:n*e+t},chebyshev:function(t,e){return Math.max(t,e)}}},561:t=>{t.exports=function(t,e,n){this.x=t,this.y=e,this.walkable=void 0===n||n}},902:(t,e)=>{function n(t){for(var e=[[t.x,t.y]];t.parent;)t=t.parent,e.push([t.x,t.y]);return e.reverse()}function i(t,e,n,i){var r,o,s,a,l,h,u=Math.abs,p=[];for(r=t<n?1:-1,o=e<i?1:-1,l=(s=u(n-t))-(a=u(i-e));p.push([t,e]),t!==n||e!==i;)(h=2*l)>-a&&(l-=a,t+=r),h<s&&(l+=s,e+=o);return p}e.backtrace=n,e.biBacktrace=function(t,e){var i=n(t),r=n(e);return i.concat(r.reverse())},e.pathLength=function(t){var e,n,i,r,o,s=0;for(e=1;e<t.length;++e)n=t[e-1],i=t[e],r=n[0]-i[0],o=n[1]-i[1],s+=Math.sqrt(r*r+o*o);return s},e.interpolate=i,e.expandPath=function(t){var e,n,r,o,s,a,l=[],h=t.length;if(h<2)return l;for(s=0;s<h-1;++s)for(e=t[s],n=t[s+1],o=(r=i(e[0],e[1],n[0],n[1])).length,a=0;a<o-1;++a)l.push(r[a]);return l.push(t[h-1]),l},e.smoothenPath=function(t,e){var n,r,o,s,a,l,h,u,p,f=e.length,d=e[0][0],c=e[0][1],g=e[f-1][0],b=e[f-1][1];for(o=[[n=d,r=c]],s=2;s<f;++s){for(h=i(n,r,(l=e[s])[0],l[1]),p=!1,a=1;a<h.length;++a)if(u=h[a],!t.isWalkableAt(u[0],u[1])){p=!0;break}p&&(lastValidCoord=e[s-1],o.push(lastValidCoord),n=lastValidCoord[0],r=lastValidCoord[1])}return o.push([g,b]),o},e.compressPath=function(t){if(t.length<3)return t;var e,n,i,r,o,s,a=[],l=t[0][0],h=t[0][1],u=t[1][0],p=t[1][1],f=u-l,d=p-h;for(f/=o=Math.sqrt(f*f+d*d),d/=o,a.push([l,h]),s=2;s<t.length;s++)e=u,n=p,i=f,r=d,f=(u=t[s][0])-e,d=(p=t[s][1])-n,d/=o=Math.sqrt(f*f+d*d),(f/=o)===i&&d===r||a.push([e,n]);return a.push([u,p]),a}},878:(t,e,n)=>{var i=n(353),r=n(902),o=n(223),s=n(911);function a(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.heuristic=t.heuristic||o.manhattan,this.weight=t.weight||1,this.diagonalMovement=t.diagonalMovement,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=s.OnlyWhenNoObstacles:this.diagonalMovement=s.IfAtMostOneObstacle:this.diagonalMovement=s.Never),this.diagonalMovement===s.Never?this.heuristic=t.heuristic||o.manhattan:this.heuristic=t.heuristic||o.octile}a.prototype.findPath=function(t,e,n,o,s){var a;if(void 0!==s.boards)a=s.boards;else{a=[];for(var l=0;l<s.nodes.length;l++)for(var h=0;h<s.nodes.length;h++){var u=s.nodes[l][h].boardAngle;void 0!==u&&a.push([l,h,u])}}var p,f,d,c,g,b,v,A,y,k,m,M,W=new i((function(t,e){return t.f-e.f})),w=s.getNodeAt(t,e),x=s.getNodeAt(n,o),N=this.heuristic,C=this.diagonalMovement,O=this.weight,_=Math.abs,I=Math.SQRT2;for(w.g=0,w.f=0,W.push(w),w.opened=!0;!W.empty();){if((p=W.pop()).closed=!0,p===x)return r.backtrace(x);for(l=0,c=(f=s.getNeighbors(p,C)).length;l<c;++l)if(!(d=f[l]).closed&&(g=d.x,b=d.y,v=p.g+(g-p.x==0||b-p.y==0?1:I),!d.opened||v<d.g)){if(d.g=v,d.h=d.h||O*N(_(g-n),_(b-o)),a.length>0){var P=(A=p.x,y=p.y,M=void 0,M=function(t,e){if(0===a.length)return null;for(var n=F(a[0][0],t,a[0][1],e),i=0,r=1;r<a.length;r++){var o=F(a[r][0],t,a[r][1],e);o<n&&(n=o,i=r)}return a[i]}(k=g,m=b),[function(t,e,n,i,r){for(;r>2*Math.PI;)r-=2*Math.PI;var o=n-t,s=i-e,a=Math.atan2(s,o),l=Math.abs(a-r);return l>Math.PI&&(l=Math.abs(2*Math.PI-l)),l}(A,y,k,m,M[2]),F(M[0],k,M[1],m)]);d.l=40*P[0];var D=F(w.x,x.x,w.y,x.y),j=P[1]/(D/(a.length+1));j<0?j=0:j>1&&(j=1),d.k=j,d.distance_board=P[1],d.f=j*(d.g+d.h)+(1-j)*d.l}else d.f=d.g+d.h;function F(t,e,n,i){return Math.pow(Math.pow(t-e,2)+Math.pow(n-i,2),.5)}d.parent=p,d.opened?W.updateItem(d):(W.push(d),d.opened=!0)}}return[]},a.prototype.findPath1=function(t,e,n,o,s){for(var a=[],l=0;l<s.nodes.length;l++)for(var h=0;h<s.nodes.length;h++){var u=s.nodes[l][h].boardAngle;void 0!==u&&a.push([l,h,u])}var p,f,d,c,g,b,v,A,y,k,m,M,W=new i((function(t,e){return t.f-e.f})),w=s.getNodeAt(t,e),x=s.getNodeAt(n,o),N=this.heuristic,C=this.diagonalMovement,O=this.weight,_=Math.abs,I=Math.SQRT2;for(w.g=0,w.f=0,W.push(w),w.opened=!0;!W.empty();){if((p=W.pop()).closed=!0,p===x)return r.backtrace(x);for(l=0,c=(f=s.getNeighbors(p,C)).length;l<c;++l)if(!(d=f[l]).closed&&(g=d.x,b=d.y,v=p.g+(g-p.x==0||b-p.y==0?1:I),!d.opened||v<d.g)){if(d.g=v,d.h=d.h||O*N(_(g-n),_(b-o)),a.length>0){var P=(A=p.x,y=p.y,M=void 0,M=function(t,e){if(0===a.length)return null;for(var n=F(a[0][0],t,a[0][1],e),i=0,r=1;r<a.length;r++){var o=F(a[r][0],t,a[r][1],e);o<n&&(n=o,i=r)}return a[i]}(k=g,m=b),[function(t,e,n,i,r){for(;r>2*Math.PI;)r-=2*Math.PI;var o=n-t,s=i-e,a=Math.atan2(s,o),l=Math.abs(a-r);return l>Math.PI&&(l=Math.abs(2*Math.PI-l)),l}(A,y,k,m,M[2]),F(M[0],k,M[1],m)]);d.l=40*P[0];var D=F(w.x,x.x,w.y,x.y),j=P[1]/(D/(a.length+1));j<0?j=0:j>1&&(j=1),d.k=j,d.distance_board=P[1],d.f=j*(d.g+d.h)+(1-j)*d.l}else d.f=d.g+d.h;function F(t,e,n,i){return Math.pow(Math.pow(t-e,2)+Math.pow(n-i,2),.5)}d.parent=p,d.opened?W.updateItem(d):(W.push(d),d.opened=!0)}}return[]},a.prototype.findPath0=function(t,e,n,o,s){var a,l,h,u,p,f,d,c,g=new i((function(t,e){return t.f-e.f})),b=s.getNodeAt(t,e),v=s.getNodeAt(n,o),A=this.heuristic,y=this.diagonalMovement,k=this.weight,m=Math.abs,M=Math.SQRT2;for(b.g=0,b.f=0,g.push(b),b.opened=!0;!g.empty();){if((a=g.pop()).closed=!0,a===v)return r.backtrace(v);for(u=0,p=(l=s.getNeighbors(a,y)).length;u<p;++u)(h=l[u]).closed||(f=h.x,d=h.y,c=a.g+(f-a.x==0||d-a.y==0?1:M),(!h.opened||c<h.g)&&(h.g=c,h.h=h.h||k*A(m(f-n),m(d-o)),h.f=h.g+h.h,h.parent=a,h.opened?g.updateItem(h):(g.push(h),h.opened=!0)))}return[]},t.exports=a},174:(t,e,n)=>{var i=n(878);function r(t){i.call(this,t);var e=this.heuristic;this.heuristic=function(t,n){return 1e6*e(t,n)}}r.prototype=new i,r.prototype.constructor=r,t.exports=r},534:(t,e,n)=>{var i=n(353),r=n(902),o=n(223),s=n(911);function a(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.diagonalMovement=t.diagonalMovement,this.heuristic=t.heuristic||o.manhattan,this.weight=t.weight||1,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=s.OnlyWhenNoObstacles:this.diagonalMovement=s.IfAtMostOneObstacle:this.diagonalMovement=s.Never),this.diagonalMovement===s.Never?this.heuristic=t.heuristic||o.manhattan:this.heuristic=t.heuristic||o.octile}a.prototype.findPath=function(t,e,n,o,s){var a,l,h,u,p,f,d,c,g=function(t,e){return t.f-e.f},b=new i(g),v=new i(g),A=s.getNodeAt(t,e),y=s.getNodeAt(n,o),k=this.heuristic,m=this.diagonalMovement,M=this.weight,W=Math.abs,w=Math.SQRT2;for(A.g=0,A.f=0,b.push(A),A.opened=1,y.g=0,y.f=0,v.push(y),y.opened=2;!b.empty()&&!v.empty();){for((a=b.pop()).closed=!0,u=0,p=(l=s.getNeighbors(a,m)).length;u<p;++u)if(!(h=l[u]).closed){if(2===h.opened)return r.biBacktrace(a,h);f=h.x,d=h.y,c=a.g+(f-a.x==0||d-a.y==0?1:w),(!h.opened||c<h.g)&&(h.g=c,h.h=h.h||M*k(W(f-n),W(d-o)),h.f=h.g+h.h,h.parent=a,h.opened?b.updateItem(h):(b.push(h),h.opened=1))}for((a=v.pop()).closed=!0,u=0,p=(l=s.getNeighbors(a,m)).length;u<p;++u)if(!(h=l[u]).closed){if(1===h.opened)return r.biBacktrace(h,a);f=h.x,d=h.y,c=a.g+(f-a.x==0||d-a.y==0?1:w),(!h.opened||c<h.g)&&(h.g=c,h.h=h.h||M*k(W(f-t),W(d-e)),h.f=h.g+h.h,h.parent=a,h.opened?v.updateItem(h):(v.push(h),h.opened=2))}}return[]},t.exports=a},57:(t,e,n)=>{var i=n(534);function r(t){i.call(this,t);var e=this.heuristic;this.heuristic=function(t,n){return 1e6*e(t,n)}}r.prototype=new i,r.prototype.constructor=r,t.exports=r},764:(t,e,n)=>{var i=n(902),r=n(911);function o(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.diagonalMovement=t.diagonalMovement,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=r.OnlyWhenNoObstacles:this.diagonalMovement=r.IfAtMostOneObstacle:this.diagonalMovement=r.Never)}o.prototype.findPath=function(t,e,n,r,o){var s,a,l,h,u,p=o.getNodeAt(t,e),f=o.getNodeAt(n,r),d=[],c=[],g=this.diagonalMovement;for(d.push(p),p.opened=!0,p.by=0,c.push(f),f.opened=!0,f.by=1;d.length&&c.length;){for((l=d.shift()).closed=!0,h=0,u=(s=o.getNeighbors(l,g)).length;h<u;++h)if(!(a=s[h]).closed)if(a.opened){if(1===a.by)return i.biBacktrace(l,a)}else d.push(a),a.parent=l,a.opened=!0,a.by=0;for((l=c.shift()).closed=!0,h=0,u=(s=o.getNeighbors(l,g)).length;h<u;++h)if(!(a=s[h]).closed)if(a.opened){if(0===a.by)return i.biBacktrace(a,l)}else c.push(a),a.parent=l,a.opened=!0,a.by=1}return[]},t.exports=o},738:(t,e,n)=>{var i=n(534);function r(t){i.call(this,t),this.heuristic=function(t,e){return 0}}r.prototype=new i,r.prototype.constructor=r,t.exports=r},634:(t,e,n)=>{var i=n(902),r=n(911);function o(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.diagonalMovement=t.diagonalMovement,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=r.OnlyWhenNoObstacles:this.diagonalMovement=r.IfAtMostOneObstacle:this.diagonalMovement=r.Never)}o.prototype.findPath=function(t,e,n,r,o){var s,a,l,h,u,p=[],f=this.diagonalMovement,d=o.getNodeAt(t,e),c=o.getNodeAt(n,r);for(p.push(d),d.opened=!0;p.length;){if((l=p.shift()).closed=!0,l===c)return i.backtrace(c);for(h=0,u=(s=o.getNeighbors(l,f)).length;h<u;++h)(a=s[h]).closed||a.opened||(p.push(a),a.opened=!0,a.parent=l)}return[]},t.exports=o},929:(t,e,n)=>{var i=n(878);function r(t){i.call(this,t),this.heuristic=function(t,e){return 0}}r.prototype=new i,r.prototype.constructor=r,t.exports=r},807:(t,e,n)=>{n(902);var i=n(223),r=n(561),o=n(911);function s(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.diagonalMovement=t.diagonalMovement,this.heuristic=t.heuristic||i.manhattan,this.weight=t.weight||1,this.trackRecursion=t.trackRecursion||!1,this.timeLimit=t.timeLimit||1/0,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=o.OnlyWhenNoObstacles:this.diagonalMovement=o.IfAtMostOneObstacle:this.diagonalMovement=o.Never),this.diagonalMovement===o.Never?this.heuristic=t.heuristic||i.manhattan:this.heuristic=t.heuristic||i.octile}s.prototype.findPath=function(t,e,n,i,o){var s,a,l,h=(new Date).getTime(),u=function(t,e){return this.heuristic(Math.abs(e.x-t.x),Math.abs(e.y-t.y))}.bind(this),p=function(t,e,n,i,s){if(this.timeLimit>0&&(new Date).getTime()-h>1e3*this.timeLimit)return 1/0;var a,l,f,c,g=e+u(t,d)*this.weight;if(g>n)return g;if(t==d)return i[s]=[t.x,t.y],t;var b,v,A=o.getNeighbors(t,this.diagonalMovement);for(f=0,a=1/0;c=A[f];++f){if(this.trackRecursion&&(c.retainCount=c.retainCount+1||1,!0!==c.tested&&(c.tested=!0)),(l=p(c,e+(v=c,(b=t).x===v.x||b.y===v.y?1:Math.SQRT2),n,i,s+1))instanceof r)return i[s]=[t.x,t.y],l;this.trackRecursion&&0==--c.retainCount&&(c.tested=!1),l<a&&(a=l)}return a}.bind(this),f=o.getNodeAt(t,e),d=o.getNodeAt(n,i),c=u(f,d);for(s=0;;++s){if((l=p(f,0,c,a=[],0))===1/0)return[];if(l instanceof r)return a;c=l}return[]},t.exports=s},227:(t,e,n)=>{var i=n(150),r=n(911);function o(t){i.call(this,t)}o.prototype=new i,o.prototype.constructor=o,o.prototype._jump=function(t,e,n,i){var r=this.grid,o=t-n,s=e-i;if(!r.isWalkableAt(t,e))return null;if(!0===this.trackJumpRecursion&&(r.getNodeAt(t,e).tested=!0),r.getNodeAt(t,e)===this.endNode)return[t,e];if(0!==o&&0!==s){if(r.isWalkableAt(t-o,e+s)&&!r.isWalkableAt(t-o,e)||r.isWalkableAt(t+o,e-s)&&!r.isWalkableAt(t,e-s))return[t,e];if(this._jump(t+o,e,t,e)||this._jump(t,e+s,t,e))return[t,e]}else if(0!==o){if(r.isWalkableAt(t+o,e+1)&&!r.isWalkableAt(t,e+1)||r.isWalkableAt(t+o,e-1)&&!r.isWalkableAt(t,e-1))return[t,e]}else if(r.isWalkableAt(t+1,e+s)&&!r.isWalkableAt(t+1,e)||r.isWalkableAt(t-1,e+s)&&!r.isWalkableAt(t-1,e))return[t,e];return this._jump(t+o,e+s,t,e)},o.prototype._findNeighbors=function(t){var e,n,i,o,s,a,l,h,u=t.parent,p=t.x,f=t.y,d=this.grid,c=[];if(u)e=u.x,n=u.y,i=(p-e)/Math.max(Math.abs(p-e),1),o=(f-n)/Math.max(Math.abs(f-n),1),0!==i&&0!==o?(d.isWalkableAt(p,f+o)&&c.push([p,f+o]),d.isWalkableAt(p+i,f)&&c.push([p+i,f]),d.isWalkableAt(p+i,f+o)&&c.push([p+i,f+o]),d.isWalkableAt(p-i,f)||c.push([p-i,f+o]),d.isWalkableAt(p,f-o)||c.push([p+i,f-o])):0===i?(d.isWalkableAt(p,f+o)&&c.push([p,f+o]),d.isWalkableAt(p+1,f)||c.push([p+1,f+o]),d.isWalkableAt(p-1,f)||c.push([p-1,f+o])):(d.isWalkableAt(p+i,f)&&c.push([p+i,f]),d.isWalkableAt(p,f+1)||c.push([p+i,f+1]),d.isWalkableAt(p,f-1)||c.push([p+i,f-1]));else for(l=0,h=(s=d.getNeighbors(t,r.Always)).length;l<h;++l)a=s[l],c.push([a.x,a.y]);return c},t.exports=o},169:(t,e,n)=>{var i=n(150),r=n(911);function o(t){i.call(this,t)}o.prototype=new i,o.prototype.constructor=o,o.prototype._jump=function(t,e,n,i){var r=this.grid,o=t-n,s=e-i;if(!r.isWalkableAt(t,e))return null;if(!0===this.trackJumpRecursion&&(r.getNodeAt(t,e).tested=!0),r.getNodeAt(t,e)===this.endNode)return[t,e];if(0!==o&&0!==s){if(r.isWalkableAt(t-o,e+s)&&!r.isWalkableAt(t-o,e)||r.isWalkableAt(t+o,e-s)&&!r.isWalkableAt(t,e-s))return[t,e];if(this._jump(t+o,e,t,e)||this._jump(t,e+s,t,e))return[t,e]}else if(0!==o){if(r.isWalkableAt(t+o,e+1)&&!r.isWalkableAt(t,e+1)||r.isWalkableAt(t+o,e-1)&&!r.isWalkableAt(t,e-1))return[t,e]}else if(r.isWalkableAt(t+1,e+s)&&!r.isWalkableAt(t+1,e)||r.isWalkableAt(t-1,e+s)&&!r.isWalkableAt(t-1,e))return[t,e];return r.isWalkableAt(t+o,e)||r.isWalkableAt(t,e+s)?this._jump(t+o,e+s,t,e):null},o.prototype._findNeighbors=function(t){var e,n,i,o,s,a,l,h,u=t.parent,p=t.x,f=t.y,d=this.grid,c=[];if(u)e=u.x,n=u.y,i=(p-e)/Math.max(Math.abs(p-e),1),o=(f-n)/Math.max(Math.abs(f-n),1),0!==i&&0!==o?(d.isWalkableAt(p,f+o)&&c.push([p,f+o]),d.isWalkableAt(p+i,f)&&c.push([p+i,f]),(d.isWalkableAt(p,f+o)||d.isWalkableAt(p+i,f))&&c.push([p+i,f+o]),!d.isWalkableAt(p-i,f)&&d.isWalkableAt(p,f+o)&&c.push([p-i,f+o]),!d.isWalkableAt(p,f-o)&&d.isWalkableAt(p+i,f)&&c.push([p+i,f-o])):0===i?d.isWalkableAt(p,f+o)&&(c.push([p,f+o]),d.isWalkableAt(p+1,f)||c.push([p+1,f+o]),d.isWalkableAt(p-1,f)||c.push([p-1,f+o])):d.isWalkableAt(p+i,f)&&(c.push([p+i,f]),d.isWalkableAt(p,f+1)||c.push([p+i,f+1]),d.isWalkableAt(p,f-1)||c.push([p+i,f-1]));else for(l=0,h=(s=d.getNeighbors(t,r.IfAtMostOneObstacle)).length;l<h;++l)a=s[l],c.push([a.x,a.y]);return c},t.exports=o},410:(t,e,n)=>{var i=n(150),r=n(911);function o(t){i.call(this,t)}o.prototype=new i,o.prototype.constructor=o,o.prototype._jump=function(t,e,n,i){var r=this.grid,o=t-n,s=e-i;if(!r.isWalkableAt(t,e))return null;if(!0===this.trackJumpRecursion&&(r.getNodeAt(t,e).tested=!0),r.getNodeAt(t,e)===this.endNode)return[t,e];if(0!==o&&0!==s){if(this._jump(t+o,e,t,e)||this._jump(t,e+s,t,e))return[t,e]}else if(0!==o){if(r.isWalkableAt(t,e-1)&&!r.isWalkableAt(t-o,e-1)||r.isWalkableAt(t,e+1)&&!r.isWalkableAt(t-o,e+1))return[t,e]}else if(0!==s&&(r.isWalkableAt(t-1,e)&&!r.isWalkableAt(t-1,e-s)||r.isWalkableAt(t+1,e)&&!r.isWalkableAt(t+1,e-s)))return[t,e];return r.isWalkableAt(t+o,e)&&r.isWalkableAt(t,e+s)?this._jump(t+o,e+s,t,e):null},o.prototype._findNeighbors=function(t){var e,n,i,o,s,a,l,h,u,p=t.parent,f=t.x,d=t.y,c=this.grid,g=[];if(p){if(e=p.x,n=p.y,i=(f-e)/Math.max(Math.abs(f-e),1),o=(d-n)/Math.max(Math.abs(d-n),1),0!==i&&0!==o)c.isWalkableAt(f,d+o)&&g.push([f,d+o]),c.isWalkableAt(f+i,d)&&g.push([f+i,d]),c.isWalkableAt(f,d+o)&&c.isWalkableAt(f+i,d)&&g.push([f+i,d+o]);else if(0!==i){u=c.isWalkableAt(f+i,d);var b=c.isWalkableAt(f,d+1),v=c.isWalkableAt(f,d-1);u&&(g.push([f+i,d]),b&&g.push([f+i,d+1]),v&&g.push([f+i,d-1])),b&&g.push([f,d+1]),v&&g.push([f,d-1])}else if(0!==o){u=c.isWalkableAt(f,d+o);var A=c.isWalkableAt(f+1,d),y=c.isWalkableAt(f-1,d);u&&(g.push([f,d+o]),A&&g.push([f+1,d+o]),y&&g.push([f-1,d+o])),A&&g.push([f+1,d]),y&&g.push([f-1,d])}}else for(l=0,h=(s=c.getNeighbors(t,r.OnlyWhenNoObstacles)).length;l<h;++l)a=s[l],g.push([a.x,a.y]);return g},t.exports=o},427:(t,e,n)=>{var i=n(150),r=n(911);function o(t){i.call(this,t)}o.prototype=new i,o.prototype.constructor=o,o.prototype._jump=function(t,e,n,i){var r=this.grid,o=t-n,s=e-i;if(!r.isWalkableAt(t,e))return null;if(!0===this.trackJumpRecursion&&(r.getNodeAt(t,e).tested=!0),r.getNodeAt(t,e)===this.endNode)return[t,e];if(0!==o){if(r.isWalkableAt(t,e-1)&&!r.isWalkableAt(t-o,e-1)||r.isWalkableAt(t,e+1)&&!r.isWalkableAt(t-o,e+1))return[t,e]}else{if(0===s)throw new Error("Only horizontal and vertical movements are allowed");if(r.isWalkableAt(t-1,e)&&!r.isWalkableAt(t-1,e-s)||r.isWalkableAt(t+1,e)&&!r.isWalkableAt(t+1,e-s))return[t,e];if(this._jump(t+1,e,t,e)||this._jump(t-1,e,t,e))return[t,e]}return this._jump(t+o,e+s,t,e)},o.prototype._findNeighbors=function(t){var e,n,i,o,s,a,l,h,u=t.parent,p=t.x,f=t.y,d=this.grid,c=[];if(u)e=u.x,n=u.y,i=(p-e)/Math.max(Math.abs(p-e),1),o=(f-n)/Math.max(Math.abs(f-n),1),0!==i?(d.isWalkableAt(p,f-1)&&c.push([p,f-1]),d.isWalkableAt(p,f+1)&&c.push([p,f+1]),d.isWalkableAt(p+i,f)&&c.push([p+i,f])):0!==o&&(d.isWalkableAt(p-1,f)&&c.push([p-1,f]),d.isWalkableAt(p+1,f)&&c.push([p+1,f]),d.isWalkableAt(p,f+o)&&c.push([p,f+o]));else for(l=0,h=(s=d.getNeighbors(t,r.Never)).length;l<h;++l)a=s[l],c.push([a.x,a.y]);return c},t.exports=o},544:(t,e,n)=>{var i=n(911),r=n(427),o=n(227),s=n(410),a=n(169);t.exports=function(t){return(t=t||{}).diagonalMovement===i.Never?new r(t):t.diagonalMovement===i.Always?new o(t):t.diagonalMovement===i.OnlyWhenNoObstacles?new s(t):new a(t)}},150:(t,e,n)=>{var i=n(353),r=n(902),o=n(223);function s(t){t=t||{},this.heuristic=t.heuristic||o.manhattan,this.trackJumpRecursion=t.trackJumpRecursion||!1}n(911),s.prototype.findPath=function(t,e,n,o,s){var a,l=this.openList=new i((function(t,e){return t.f-e.f})),h=this.startNode=s.getNodeAt(t,e),u=this.endNode=s.getNodeAt(n,o);for(this.grid=s,h.g=0,h.f=0,l.push(h),h.opened=!0;!l.empty();){if((a=l.pop()).closed=!0,a===u)return r.expandPath(r.backtrace(u));this._identifySuccessors(a)}return[]},s.prototype._identifySuccessors=function(t){var e,n,i,r,s,a,l,h,u,p,f=this.grid,d=this.heuristic,c=this.openList,g=this.endNode.x,b=this.endNode.y,v=t.x,A=t.y,y=Math.abs;for(Math.max,r=0,s=(e=this._findNeighbors(t)).length;r<s;++r)if(n=e[r],i=this._jump(n[0],n[1],v,A)){if(a=i[0],l=i[1],(p=f.getNodeAt(a,l)).closed)continue;h=o.octile(y(a-v),y(l-A)),u=t.g+h,(!p.opened||u<p.g)&&(p.g=u,p.h=p.h||d(y(a-g),y(l-b)),p.f=p.g+p.h,p.parent=t,p.opened?c.updateItem(p):(c.push(p),p.opened=!0))}},t.exports=s},353:t=>{var n,i,r,o,s,a,l,h,u,p,f,d,c,g,b;r=Math.floor,p=Math.min,i=function(t,e){return e>t?-1:t>e?1:0},u=function(t,e,n,o,s){var a;if(null==n&&(n=0),null==s&&(s=i),0>n)throw new Error("lo must be non-negative");for(null==o&&(o=t.length);o>n;)s(e,t[a=r((n+o)/2)])<0?o=a:n=a+1;return[].splice.apply(t,[n,n-n].concat(e)),e},a=function(t,e,n){return null==n&&(n=i),t.push(e),g(t,0,t.length-1,n)},s=function(t,e){var n,r;return null==e&&(e=i),n=t.pop(),t.length?(r=t[0],t[0]=n,b(t,0,e)):r=n,r},h=function(t,e,n){var r;return null==n&&(n=i),r=t[0],t[0]=e,b(t,0,n),r},l=function(t,e,n){var r;return null==n&&(n=i),t.length&&n(t[0],e)<0&&(e=(r=[t[0],e])[0],t[0]=r[1],b(t,0,n)),e},o=function(t,e){var n,o,s,a,l,h;for(null==e&&(e=i),l=[],o=0,s=(a=function(){h=[];for(var e=0,n=r(t.length/2);n>=0?n>e:e>n;n>=0?e++:e--)h.push(e);return h}.apply(this).reverse()).length;s>o;o++)n=a[o],l.push(b(t,n,e));return l},c=function(t,e,n){var r;return null==n&&(n=i),-1!==(r=t.indexOf(e))?(g(t,0,r,n),b(t,r,n)):void 0},f=function(t,e,n){var r,s,a,h,u;if(null==n&&(n=i),!(s=t.slice(0,e)).length)return s;for(o(s,n),a=0,h=(u=t.slice(e)).length;h>a;a++)r=u[a],l(s,r,n);return s.sort(n).reverse()},d=function(t,e,n){var r,a,l,h,f,d,c,g,b;if(null==n&&(n=i),10*e<=t.length){if(!(l=t.slice(0,e).sort(n)).length)return l;for(a=l[l.length-1],h=0,d=(c=t.slice(e)).length;d>h;h++)n(r=c[h],a)<0&&(u(l,r,0,null,n),l.pop(),a=l[l.length-1]);return l}for(o(t,n),b=[],f=0,g=p(e,t.length);g>=0?g>f:f>g;g>=0?++f:--f)b.push(s(t,n));return b},g=function(t,e,n,r){var o,s,a;for(null==r&&(r=i),o=t[n];n>e&&r(o,s=t[a=n-1>>1])<0;)t[n]=s,n=a;return t[n]=o},b=function(t,e,n){var r,o,s,a,l;for(null==n&&(n=i),o=t.length,l=e,s=t[e],r=2*e+1;o>r;)o>(a=r+1)&&!(n(t[r],t[a])<0)&&(r=a),t[e]=t[r],r=2*(e=r)+1;return t[e]=s,g(t,l,e,n)},n=function(){function t(t){this.cmp=null!=t?t:i,this.nodes=[]}return t.push=a,t.pop=s,t.replace=h,t.pushpop=l,t.heapify=o,t.nlargest=f,t.nsmallest=d,t.prototype.push=function(t){return a(this.nodes,t,this.cmp)},t.prototype.pop=function(){return s(this.nodes,this.cmp)},t.prototype.peek=function(){return this.nodes[0]},t.prototype.contains=function(t){return-1!==this.nodes.indexOf(t)},t.prototype.replace=function(t){return h(this.nodes,t,this.cmp)},t.prototype.pushpop=function(t){return l(this.nodes,t,this.cmp)},t.prototype.heapify=function(){return o(this.nodes,this.cmp)},t.prototype.updateItem=function(t){return c(this.nodes,t,this.cmp)},t.prototype.clear=function(){return this.nodes=[]},t.prototype.empty=function(){return 0===this.nodes.length},t.prototype.size=function(){return this.nodes.length},t.prototype.clone=function(){var e;return(e=new t).nodes=this.nodes.slice(0),e},t.prototype.toArray=function(){return this.nodes.slice(0)},t.prototype.insert=t.prototype.push,t.prototype.remove=t.prototype.pop,t.prototype.top=t.prototype.peek,t.prototype.front=t.prototype.peek,t.prototype.has=t.prototype.contains,t.prototype.copy=t.prototype.clone,t}(),("undefined"!=typeof e&&null!==e?e.exports:void 0)?e.exports=n:window.Heap=n,t.exports=n}},n={};!function e(i){var r=n[i];if(void 0!==r)return r.exports;var o=n[i]={exports:{}};return t[i](o,o.exports,e),o.exports}(191)})();