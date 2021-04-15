import {MoveManager} from './playerControl/MoveManager.js';
//import {PF} from './lib/PF.js';
export {PeopleController};
class PeopleController{
    myMain;
    model;
    xMin;zMin;
    floor0;floor1;
    goToPosition(pos,finished){
        var scope=this;

        var y1=Math.floor(scope.model.position.y);//化身当前的位置
        var y2=pos.y?Math.round(pos.y):y1;//目标位置

        if(Math.abs(y2-y1)<2){//路径不跨层//
            if(y1>-1){//地面
                console.log("地面的移动");
                scope.floor0.goToPosition(pos,finished);
            } else {//地下一层
                console.log("地下一层的移动");
                scope.floor1.goToPosition(pos,finished);
            }
        } else diffFloor();


        function diffFloor() {//路径跨层
            console.log(y1,y2)
            if(y1>-1){//起点在地面
                console.log("起点在地面");
                move0to_1(function () {
                    console.log("到了楼梯出口");
                    scope.goToPosition(pos);
                });
            }else if(y2>-1){//终点在地面
                console.log("终点在地面");
                move_1to0(function () {
                    console.log("到了楼梯出口");
                    scope.goToPosition(pos);
                });
            }

            function move0to_1(f){
                move([
                    [94,1.17,196],
                    [90.28,1.17,196.0],
                    [75.3,-3.7,196.05],
                    [74.52,-3.7,206.92],
                    [52.29,-3.7,206.17],
                    [49.62,-3.67,203.3],
                    [50,-8.53,189],
                ],f);
            }
            function move_1to0(f){
                move([
                    [50,-8.53,189],
                    [49.62,-3.67,203.3],
                    [52.29,-3.7,206.17],
                    [74.52,-3.7,206.92],
                    [75.3,-3.7,196.05],
                    [90.28,1.17,196.0],
                    [94,1.17,196],
                ],f);
            }
            function move(arr,f) {
                new MoveManager(//从0地面到-1层
                    scope.model, MoveManager.getArray(arr), f
                );
            }
        }
    }
    constructor(myMain,obstacle0,obstacle1){
        var scope=this;
        scope.model=new THREE.Object3D();
        scope.model.position.set(100,0,194);//(90,0,196);//(90,1.17,196);
        scope.model.scale.set(0.5,0.5,0.5);
        scope.myMain=myMain;
        scope.#radiographicTesting();

        scope.floor0=new SameFloorPF({model:scope.model,obstacle:obstacle0});
        scope.floor1=new SameFloorPF({
            model:scope.model,obstacle:obstacle1,
            xMin:-39,xMax:262,
            zMin:112, zMax:531
        });

        new THREE.GLTFLoader().load("../../_DATA_/male_run.glb", (glb) => {
            scope.model.add(glb.scene);
            playAnimation(glb);
            //scope.#test(glb);
            function playAnimation(G){
                console.log(G);
                var meshMixer2 = new THREE.AnimationMixer(G.scene);
                meshMixer2.clipAction(G.animations[0]).play();
                setInterval(function () {
                    meshMixer2.update(0.01);
                },20);
            }
        });
    }
    #test=function (){
        var scope=this;
        new MoveManager(
            scope.model,
            MoveManager.getArray([
                [90,1.17,196],
                [90.28,1.17,196.0],
                [75.3,-3.7,196.05],
                [74.52,-3.7,206.92],
                [52.29,-3.7,206.17],
                [49.62,-3.67,203.3],
                [49.96,-8.53,188.86],
            ])
        );
    }
    #addCamera=function(){
        myMain.camera.position.set(0,2,-3);
        myMain.camera.rotation.set(0,135,0);
        glb.scene.add(myMain.camera);
    }
    #radiographicTesting=function(){
        var scope=this;
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        var flag=0;
        function mouseDown0( event ) {
            flag++;
            if(flag!==2)return;
            flag=0;
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
            raycaster.setFromCamera( mouse, scope.myMain.camera );
            const intersects = raycaster.intersectObjects(
                scope.myMain.scene.children[1].children[0].children
            );////myRoomManager.room
            if(intersects.length){
                console.log('['+
                    Math.floor(intersects[0].point.x*100)/100+','+
                    Math.floor(intersects[0].point.y*100)/100+','+
                    Math.floor(intersects[0].point.z*100)/100+']'
                );//0是射线穿过的第一个对象
                scope.goToPosition(intersects[0].point)
            }else console.log("没有点击到");
        }
        //document.body.οnclick=mouseDown0;
        window.addEventListener( 'mousedown',mouseDown0, true );
        setInterval(function () {
            flag=0;
        },1000);
    }
}
class SameFloorPF{
    model;
    obstacle;
    grid;finder;
    xMin;zMin;xMax;zMax;

    canPass(area){
        for(var i=0;i<area.length;i++){
            this.grid.setWalkableAt(
                area[i][0]-this.xMin,
                area[i][1]-this.zMin,
                true);
        }
    }
    getPos2(pos){
        return {
            x:Math.round(pos.x)-this.xMin,
            z:Math.round(pos.z)-this.zMin
        }
    }
    goToPosition(pos,finished){
        //化身当前的位置
        var x1=Math.floor(this.model.position.x)-this.xMin;
        var z1=Math.floor(this.model.position.z)-this.zMin;
        //目标位置
        var x2=Math.round(pos.x)-this.xMin;
        var z2=Math.round(pos.z)-this.zMin;

        if(x1===x2&&z1===z2){
            if(finished)finished();
        }else{
            var grid=this.grid.clone();
            var path = this.finder.findPath(x1,z1,x2,z2,grid);
            for(var i=0;i<path.length;i++){
                path[i].splice(1,0,this.model.position.y);
                path[i][0]+=this.xMin;
                path[i][2]+=this.zMin;
            }
            if(path.length){
                new MoveManager(
                    this.model,
                    MoveManager.getArray(path),
                    finished
                );
            }else{
                console.log("没有找到路径!");
            }
        }
    }
    constructor(options){//model,obstacle//,xMin,zMin
        options = options || {};
        var scope=this;
        scope.model=options.model||new THREE.Object3D();
        scope.obstacle=options.obstacle||[];
        scope.xMin=(typeof(options.xMin)==="undefined")?-1000:options.xMin;
        scope.zMin=(typeof(options.zMin)==="undefined")?-1000:options.zMin;
        scope.xMax=(typeof(options.xMax)==="undefined")?1000:options.xMax;//options.xMax||1000;
        scope.zMax=(typeof(options.zMax)==="undefined")?1000:options.zMax;//options.zMax||1000;
        initPF();
        function initPF(){
            scope.grid = new PF.Grid(scope.xMax-scope.xMin+1,scope.zMax-scope.zMin+1);//生成网格
            for(var i=0;i<scope.obstacle.length;i++){
                scope.grid.setWalkableAt(
                    scope.obstacle[i][0]-scope.xMin,
                    scope.obstacle[i][1]-scope.zMin,
                    false);
            }
            scope.finder = new PF.BiAStarFinder({
                allowDiagonal: true,//允许对角线
                dontCrossCorners: false,//不要拐弯?
                heuristic: PF.Heuristic["manhattan"],//启发式["曼哈顿"]
                weight: 1
            });
        }
    }
}
