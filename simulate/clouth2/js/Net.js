import * as THREE from './three.module.js';
class Pin{
    constructor(){}
}
class Wind{
    windForce=new THREE.Vector3()//风力方向
    _tool=new THREE.Vector3()
    constructor(){
        this._animate()
    }
    _animate(){        
        const scope=this
        function update(now){
            const windStrength = Math.cos( now / 7000 ) * 5 + 20;//风力大小
            scope.windForce.set( Math.sin( now / 2000 ), Math.cos( now / 3000 ), Math.sin( now / 1000 ) );//风力方向
            scope.windForce.normalize();//单位化
            scope.windForce.multiplyScalar( 10*windStrength );//方向*大小
            requestAnimationFrame( update );
        }
        update(0)
    }
    apply(cloth){
        const particles=cloth.particles
        for(let indx=0;indx<particles.length;indx++){
            const normal=particles[ indx ].normal
            const Direction = this._tool.copy( normal ).normalize()
            const size      = normal.dot( this.windForce )
            particles[ indx ].addForce( Direction.multiplyScalar( size ) )
        }
    }
}
class Particle{
    constructor( x, y, z, mass ,clothFunction) {
        this.position = new THREE.Vector3();
        this.previous = new THREE.Vector3();
        this.original = new THREE.Vector3();
        this.a = new THREE.Vector3(); // acceleration
        this.mass = mass;
        this.invMass = 1 / mass;
        this.tmp = new THREE.Vector3();
        this.tmp2 = new THREE.Vector3();

        // init
        clothFunction( x, y, this.position ); // position
        clothFunction( x, y, this.previous ); // previous
        clothFunction( x, y, this.original );
    }
    addForce( force ) {
        this.a.add(
            this.tmp2.copy( force ).multiplyScalar( this.invMass )
        )
    }
    integrate( timesq,DRAG ) {//加速度会不会突然变化
        const newPos = this.tmp.subVectors( this.position, this.previous );
        newPos.multiplyScalar( DRAG ).add( this.position );
        newPos.add( this.a.multiplyScalar( timesq ) );
        this.tmp = this.previous;
        this.previous = this.position;
        this.position = newPos;
        this.a.set( 0, 0, 0 );
    }
}
class ClothSimulate{
    _tool=new THREE.Vector3()
    constructor( w, h ,MASS,xSegs,ySegs,restDistance) {//布料模拟
        this.w = w||10
        this.h = h||10
        const clothFunction=this._initClothFunction(xSegs,ySegs,restDistance)
        this.particles=this._initParticles(MASS,clothFunction)
        this.constraints = this._initConstraints(restDistance)
        this.geometry=this._initGeometry(clothFunction)
    }
    _initClothFunction(xSegs,ySegs,restDistance){
        const width=restDistance * xSegs
        const height=restDistance * ySegs
        return (u, v, target)=>{
            const x = ( u - 0.5 ) * width;
            const y = ( v + 0.5 ) * height;
            const z = 10*Math.sin( Math.PI*20*u );
            target.set( x, y, z );
        }
    }
    _initParticles(MASS,clothFunction){
        const w=this.w
        const h=this.h
        const particles = []
        for ( let v = 0; v <= h; v ++ ) 
            for ( let u = 0; u <= w; u ++ ) 
                particles.push(
                    new Particle( u / w, v / h, 0, MASS,clothFunction )
                )
        this.particles = particles;
        return this.particles
    }
    _initConstraints(restDistance){
        const particles=this.particles
        const w=this.w
        const h=this.h
        const arr=[]
        for ( let v = 0; v < h; v ++ ) 
            for ( let u = 0; u < w; u ++ ) {
                arr.push([u, v,         u, v + 1])
                arr.push([u, v,         u+ 1, v ])
            }
        for ( let u = w, v = 0; v < h; v ++ ) 
            arr.push([u, v,         u, v + 1])
        for ( let v = h, u = 0; u < w; u ++ ) 
            arr.push([u, v,         u+ 1, v ])

        const constraints = [];//约束
        const index=(u,v)=>{return u + v * ( w + 1 )}
        for(let i=0;i<arr.length;i++){
            constraints.push( [
                particles[ index( arr[i][0], arr[i][1] ) ],
                particles[ index( arr[i][2], arr[i][3] ) ],
                restDistance
            ] );
        }
        
        this.constraints = constraints
        return this.constraints
    }
    _initGeometry(clothFunction){
        const clothGeometry = new THREE.ParametricBufferGeometry( clothFunction,this.w, this.h );
        const self=this
        const addNormal=(clothGeometry,particles)=>{
            const indices = clothGeometry.index;
            const normals = clothGeometry.attributes.normal;
            for ( let i = 0, il = indices.count; i < il; i += 3 ) {
                for ( let j = 0; j < 3; j ++ ) {
                    const indx = indices.getX( i + j );
                    const normal = self._tool.fromBufferAttribute( normals, indx );
                    particles[ indx ].normal=normal.clone()
                }
            }
        }
        const update=()=>{
            const particles = self.particles;
            for ( let i = 0, il = particles.length; i < il; i ++ ) {
                const v = particles[ i ].position;
                clothGeometry.attributes.position.setXYZ( i, v.x, v.y, v.z );
            }
            clothGeometry.attributes.position.needsUpdate = true;
            clothGeometry.computeVertexNormals();
            addNormal(clothGeometry,particles)
            requestAnimationFrame( update )
        }
        update()
        this.geometry=clothGeometry
        return this.geometry
    }
    applyConstraints(){
        const self=this
        const applyConstraint=( p1, p2, distance )=> {
            const diff = self._tool.subVectors( p2.position, p1.position );
            const currentDist = diff.length();
            if ( currentDist === 0 ) return; // prevents division by 0
            const correction = diff.multiplyScalar( 1 - distance / currentDist );
            const correctionHalf = correction.multiplyScalar( 0.5 );//似乎可以理解为韧性 范围为(0~0.5]
            p1.position.add( correctionHalf );
            p2.position.sub( correctionHalf );
        }
        const constraints = this.constraints;
        for ( let i = 0; i < constraints.length; i ++ ) {
            const constraint = constraints[ i ];
            applyConstraint( constraint[ 0 ], constraint[ 1 ], constraint[ 2 ] );
        }
    }
}
export class Net{
    object;
    constructor(){
        const DAMPING = 0.03;//阻尼damping//坚硬程度
        const DRAG = 1 - DAMPING;//阻力drag //影响加速度的变化速度
        const MASS = 0.3;//质量
        const restDistance = 28;//面片块大小
        const xSegs = 110;//水平方向的面片块数
        const ySegs = 68;//垂直方向的面片块数
        const cloth = new ClothSimulate( xSegs, ySegs ,MASS,xSegs,ySegs,restDistance);
        const gravity = new THREE.Vector3( 0, - 981 * 1.4, 0 ).multiplyScalar( MASS );//重力=加速度*质量//F=A*M
        const TIMESTEP = 18 / 1000;//时间步长
        const TIMESTEP_SQ = Math.pow(TIMESTEP ,2);//时间步长的平方
        let pins = [];//模拟钉子
        //钉子的行数：ySegs+1     钉子的列数：xSegs+1 //钉子是从下往上排列的
        for(var i=(xSegs+1)*ySegs;i<=(xSegs+1)*(ySegs+1)-1;i++)pins.push(i)//在最上面一行钉上钉子


        const wind=new Wind()//const windForce = new THREE.Vector3(  );//风力

        // cloth geometry
        var clothGeometry =cloth.geometry
        // cloth mesh
        this.object = new THREE.Mesh( 
            clothGeometry, 
            new THREE.MeshLambertMaterial( {// cloth material
                map: new THREE.TextureLoader().load( './img/cloth.jpg' ),
                side: THREE.DoubleSide
            } ) 
        )

        //记录各个钉子的初始位置
        for ( let i = 0; i < pins.length; i ++ ) {
            const xy = pins[ i ];//粒子编号
            const p = cloth.particles[ xy ];//获取粒子
            p.original_x=p.original.x;
            p.h=120;
        }
        // for(let i=0;i<200;i++)simulate(0)
        animate();
        function animate() {
            requestAnimationFrame( animate );
            simulate();//time只影响风
        }
        function simulate() {//开始模拟
            const particles = cloth.particles;
            // Aerodynamics forces空气动力
            for ( let i = 0, il = particles.length; i < il; i ++ ) {
                const particle = particles[ i ];
                particle.addForce( gravity );//添加重力
                particle.integrate( TIMESTEP_SQ,DRAG );//时间步长的平方//integrate整合 //根据加速度生成新的位置
            }

            // Start Constraints开始约束
            cloth.applyConstraints()
            // cloth.addNormal(clothGeometry)
            wind.apply(cloth)

            // Pin Constraints销约束//pin 别针//丝网挂在了栏杆上//设置了11枚钉子
            for ( let i = 0; i < pins.length; i ++ ) {
                const xy = pins[ i ];//粒子编号
                const p = particles[ xy ];//获取粒子

                if(window.start&&p.original.x>p.original_x-i*20){
                    p.original.x=p.original.x-i*0.15;
                }

                p.position.copy( p.original );//这些粒子的位置是固定的
            }
        }//完成模拟
    }

}
