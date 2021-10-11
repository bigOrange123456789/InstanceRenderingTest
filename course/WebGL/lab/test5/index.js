class CGMath{
    constructor() {
    }
    getMat4(type){
        if(typeof (type)==="undefined"){
            return [
                [1,0,0,0],
                [0,1,0,0],
                [0,0,1,0],
                [0,0,0,1]
            ]
        }else if(type==="xy"){
            return [
                [0,1,0,0],
                [1,0,0,0],
                [0,0,1,0],
                [0,0,0,1]
            ]
        }else if(type==="xz"){
            return [
                [0,0,1,0],
                [0,1,0,0],
                [1,0,0,0],
                [0,0,0,1]
            ]
        }else if(type==="yz"){
            return [
                [1,0,0,0],
                [0,0,1,0],
                [0,1,0,0],
                [0,0,0,1]
            ]
        }
    }
    getVec4(){
        return [0,0,0,0]
    }

    //开始准备模型矩阵的计算
    mul(){
        var c=this.getMat4()
        var i,j,k;
        if(arguments.length===2){
            var a=arguments[0]
            var b=arguments[1]
            //console.log('a,b',a,b)
            //console.log(b[0],typeof b[0])
            if(typeof b.length!=="undefined"){//矩阵*矩阵
                for(i=0;i<4;i++)
                    for(j=0;j<4;j++){
                        c[i][j]=0
                        for(k=0;k<4;k++)
                            c[i][j]+=a[i][k]*b[k][j]
                        //console.log(i,j,c[i][j])
                    }
            }else{//矩阵*向量
                for(i=0;i<4;i++)
                    for(j=0;j<4;j++){
                        c[i][j]=0
                        for(k=0;k<4;k++)
                            c[i][j]+=a[i][k]*b[k]
                    }
            }
            //console.log('c',c)

        }else{
            for(k=0;k<arguments.length;k++){
                c=this.mul(c,arguments[k])
            }
        }
        return c
    }
    getMove(x,y,z){
        return [
            [1,0,0,x],
            [0,1,0,y],
            [0,0,1,z],
            [0,0,0,1]
        ]
    }
    getScale(x,y,z){
        return [
            [x,0,0,0],
            [0,y,0,0],
            [0,0,z,0],
            [0,0,0,1]
        ]
    }
    getRotX(angle){
        var c=Math.cos(angle)
        var s=Math.sin(angle)
        return [
            [1,0,0,0],
            [0,c,-s,0],
            [0,s,c,0],
            [0,0,0,1]
        ]
    }
    getRotY(angle){
        return this.mul(
            this.getMat4('xy'),
            this.getRotX(angle),
            this.getMat4('xy')
        )
    }
    getRotZ(angle){
        return this.mul(
            this.getMat4('xz'),
            this.getRotX(angle),
            this.getMat4('xz')
        )
    }
    getRot(x,y,z){
        return this.mul(
            this.getRotX(x),
            this.getRotY(y),
            this.getRotZ(z)
        )
    }
    getModelMat(opt){
        return this.mul(
            this.getMove(opt.move.x,opt.move.y,opt.move.z),
            this.getRot(opt.rot.x,opt.rot.y,opt.rot.z),
            this.getScale(opt.scale.x,opt.scale.y,opt.scale.z)
        )
    }

    //开始准备视图矩阵的计算
    det0(mat){
        return mat[0][0]*mat[1][1]-mat[1][0]*mat[0][1]
    }
    det(square) {
        // 方阵约束
        if (square.length !== square[0].length) {
            throw new Error();
        }
        // 方阵阶数
        let n = square.length;

        let result = 0;
        if (n > 3) {
            // n 阶
            for (let column = 0; column < n; column++) {
                // 去掉第 0 行第 column 列的矩阵
                let matrix = new Array(n - 1).fill(0).map(arr => new Array(n - 1).fill(0));
                for (let i = 0; i < n - 1; i++) {
                    for (let j = 0; j < n - 1; j++) {
                        if (j < column) {
                            matrix[i][j] = square[i + 1][j];
                        } else {
                            matrix[i][j] = square[i + 1][j + 1];
                        }
                    }
                }
                result += square[0][column] * Math.pow(-1,  column) * det(matrix);
            }
        } else if (n === 3) {
            // 3 阶
            result = square[0][0] * square[1][1] * square[2][2] +
                square[0][1] * square[1][2] * square[2][0] +
                square[0][2] * square[1][0] * square[2][1] -
                square[0][2] * square[1][1] * square[2][0] -
                square[0][1] * square[1][0] * square[2][2] -
                square[0][0] * square[1][2] * square[2][1];
        } else if (n === 2) {
            // 2 阶
            result = square[0][0] * square[1][1] - square[0][1] * square[1][0];
        } else if (n === 1) {
            // 1 阶
            result = square[0][0];
        }
        return result;
    }
    adjoint(square) {
        // 方阵约束
        if (square[0].length !== square.length) {
            throw new Error();
        }

        let n = square.length;

        let result = new Array(n).fill(0).map(arr => new Array(n).fill(0));
        for (let row = 0; row < n; row++) {
            for (let column = 0; column < n; column++) {
                // 去掉第 row 行第 column 列的矩阵
                let matrix = [];
                for (let i = 0; i < square.length; i++) {
                    if (i !== row) {
                        let arr = [];
                        for (let j = 0; j < square.length; j++) {
                            if (j !== column) {
                                arr.push(square[i][j]);
                            }
                        }
                        matrix.push(arr);
                    }
                }
                result[row][column] = Math.pow(-1, row + column) * det(matrix);
            }
        }
        return transpose(result);
    }
    inv(square) {
        if (square[0].length !== square.length) {
            throw new Error();
        }
        let detValue = det(square);
        let result = adjoint(square);

        for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < result.length; j++) {
                result[i][j] /= detValue;
            }
        }
        return result;
    }
    outProduct(v1,v2){
        var x=this.det([
            [v1[1],v1[2]],
            [v2[1],v2[2]]
        ])
        var y=this.det([
            [v1[0],v1[2]],
            [v2[0],v2[2]]
        ])
        var z=this.det([
            [v1[0],v1[1]],
            [v2[0],v2[1]]
        ])
        return [x,-y,z]
    }
    normal(v){
        var s=0
        for(var i=0;i<v.length;i++){
            s+=Math.pow(v[i],2)
        }
        s=Math.pow(s,0.5)
        for(i=0;i<v.length;i++){
            v[i]/=s
        }
        return v
    }
    getRight(forward){
        var oldUp=[0,1,0]
        var right=this.outProduct(
            forward,
            oldUp
        )
        this.normal(right)
        return right;
    }
    getUp(right,forward){
        var up=this.outProduct(
            right,
            forward
        )
        this.normal(up)
        return up;
    }
    sub(a,b){
        for(var i=0;i<a.length;i++)
            a[i]-=b[i]
        return a
    }
    getViewMat(look,eye){
        var f=this.sub(look,eye)
        var r=this.getRight(f)
        var u=this.getUp(r,f)
        var vRotation=this.inv([
            [f[0],f[1],f[2],0],
            [r[0],r[1],r[2],0],
            [v[0],v[1],v[2],0],
            [  0 ,  0 ,  0 ,1]
        ])
        var vMove=[
            [1,0,0,eye[0]],
            [0,1,0,eye[1]],
            [0,0,1,eye[2]],
            [0,0,0,1]
        ]
        return this.mul(
            vMove,
            vRotation
        )
    }

    //开始准备透视投影矩阵的计算
    getProjectMat(w,h,n,f){
        return [
            [2*n/w,0    ,0      ,0         ],
            [0    ,2*n/h,0      ,0         ],
            [0    ,0    ,f/(f-n),-n*f/(f-n)],
            [0    ,0    ,1      ,0         ]
        ]
        /*return [
            [-2*n/w,0    ,0      ,0         ],
            [0    ,-2*n/h,0      ,0         ],
            [0    ,0    ,-f/(f-n),n*f/(f-n)],
            [0    ,0    ,-1      ,0         ]
        ]*/
    }
    toList(a){
        return[
            a[0][0],
            a[1][0],
            a[2][0],
            a[3][0],

            a[0][1],
            a[1][1],
            a[2][1],
            a[3][1],

            a[0][2],
            a[1][2],
            a[2][2],
            a[3][2],

            a[0][3],
            a[1][3],
            a[2][3],
            a[3][3],
        ]
    }

}
var t=new CGMath()
var a=[
    [1,0,0,0],
    [0,1,0,0],
    [0,0,1,2],
    [0,0,0,2]
]
var b=[
    [2,0,0,0],
    [0,1,0,0],
    [0,0,1,0],
    [0,0,0,1]
]
var c=[
    [2,0,0,0],
    [0,2,0,0],
    [0,0,1,0],
    [0,0,0,1]
]
console.log(t.getRight([
    0,0,5
]))
