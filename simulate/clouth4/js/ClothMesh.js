import * as THREE from './three.module.js';
class PinList{
    constructor(indexList,particles){
        this.pinParticles=this._initPinParticles(indexList,particles)
    }
    _initPinParticles(indexList,particles){
        this.pinParticles=[]
        for(let i=0;i<indexList.length;i++){
            const particle=particles[indexList[i]]
            this.pinParticles.push(particle)
        }
        return this.pinParticles
    }
    apply(){
        for ( let i = 0; i < this.pinParticles.length; i ++ ) {
            const p = this.pinParticles[ i ];//获取粒子
            p.position.copy( p.original );//这些粒子的位置是固定的
        }
    }
    move(){
        const self=this
        for ( let i = 0; i < this.pinParticles.length; i ++ ) {
            const p = self.pinParticles[ i ];//获取粒子
            p.original_x=p.original.x
        }
        const test=()=>{
            for ( let i = 0; i < this.pinParticles.length; i ++ ) {
                const p = self.pinParticles[ i ];//获取粒子
                if(p.original.x>p.original_x-i*20)
                    p.original.x=p.original.x-i*0.15;
            }
            requestAnimationFrame( test )
        }
        test()
    }
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
    constructor( MASS,xSegs,ySegs,restDistance) {//布料模拟
        this.xSegs=xSegs
        this.ySegs=ySegs
        const clothFunction=this._initClothFunction(xSegs,ySegs,restDistance)
        this.particles=this._initParticles(MASS,clothFunction)
        this.constraints = this._initConstraints(restDistance)
        this.geometry=this._initGeometry(clothFunction)
        this.gravity = new THREE.Vector3( 0, - 981 * 1.4, 0 ).multiplyScalar( MASS );//重力=加速度*质量//F=A*M
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
        const particles = []
        for ( let v = 0; v <= this.ySegs; v ++ ) 
            for ( let u = 0; u <= this.xSegs; u ++ ) 
                particles.push(
                    new Particle( u / this.xSegs, v / this.ySegs, 0, MASS,clothFunction )
                )
        this.particles = particles;
        return this.particles
    }
    _initConstraints(restDistance){
        const particles=this.particles
        const w=this.xSegs
        const h=this.ySegs
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
        const clothGeometry = new THREE.ParametricBufferGeometry( clothFunction,this.xSegs, this.ySegs );
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
    applyAcceleration(TIMESTEP_SQ,DRAG){
        for ( let i = 0; i < this.particles.length; i ++ ) {
            const particle = this.particles[ i ];
            particle.addForce( this.gravity );//添加重力
            particle.integrate( TIMESTEP_SQ,DRAG );
        }
    }
}
export class ClothMesh extends THREE.Mesh{
    constructor(){
        const DAMPING = 0.03;//阻尼damping//坚硬程度
        const DRAG = 1 - DAMPING;//阻力drag //影响加速度的变化速度
        const MASS = 0.3;//质量 //（密度）
        const restDistance = 28;//面片块大小
        const xSegs = 110;//水平方向的分段数量
        const ySegs = 68; //垂直方向的分段数量
        console.log(xSegs)

        const TIMESTEP = 18 / 1000;//时间步长
        const TIMESTEP_SQ = Math.pow(TIMESTEP ,2);//时间步长的平方

        const clothSim = new ClothSimulate( MASS,xSegs,ySegs,restDistance);
        super(
            clothSim.geometry, 
            new THREE.MeshLambertMaterial( {// cloth material
                map: new THREE.TextureLoader().load( './img/cloth.jpg' ),
                side: THREE.DoubleSide
            } ) 
        )

        const wind=new Wind()
        const pin=this.createPins(clothSim.particles,xSegs,ySegs)
        
        for(let i=0;i<100;i++){
            clothSim.applyAcceleration(TIMESTEP_SQ,DRAG)
            clothSim.applyConstraints()
            pin.apply()
        }
        const simulate =()=> {
            wind.apply(clothSim)
            clothSim.applyAcceleration(TIMESTEP_SQ,DRAG)
            clothSim.applyConstraints()
            pin.apply()
            requestAnimationFrame( simulate );
        }
        simulate()
    }
    createPins(particles,xSegs,ySegs){
        let list = [];//模拟钉子
        for(var i=(xSegs+1)*ySegs;i<=(xSegs+1)*(ySegs+1)-1;i++)
            list.push(i)//在最上面一行钉上钉子
        return new PinList(list,particles)
    }
}
