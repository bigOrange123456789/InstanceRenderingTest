import {MoveManager} from './playerControl/MoveManager.js';
//import {PF} from './lib/PF.js';
export {PeopleController};
class PeopleController{
    myMain;
    model;
    myPF;
    grid;finder;
    xMin;zMin;
    goToPosition(pos,finished){
        var scope=this;
        //化身当前的位置
        var x1=Math.floor(scope.model.position.x)-scope.xMin;
        var y1=Math.floor(scope.model.position.y)
        var z1=Math.floor(scope.model.position.z)-scope.zMin;
        //目标位置
        var x2=Math.round(pos.x)-scope.xMin;
        var y2=pos.y?Math.round(pos.y):y1;
        var z2=Math.round(pos.z)-scope.zMin;

        if(x1===x2&&y1===y2&&z1===z2){
            if(finished)finished();
            return;
        }
        console.log(y2,y1,Math.abs(y2-y1)<1)
        if(Math.abs(y2-y1)<1)
            sameFloor();
        else diffFloor();

        function sameFloor() {//路径不跨层//
            var grid=scope.grid.clone();
            var path = scope.finder.findPath(x1,z1,x2,z2,grid);
            for(var i=0;i<path.length;i++){
                path[i].splice(1,0,scope.model.position.y);
                path[i][0]+=scope.xMin;
                path[i][2]+=scope.zMin;
            }

            console.log(path);
            new MoveManager(
                scope.model,
                MoveManager.getArray(path),
                finished
            );
        }
        function diffFloor() {//路径跨层
            if(y1>-1){
                scope.goToPosition({x:90,z:196},function () {
                    move0to_1(function () {
                        scope.goToPosition({x:x2,z:z2},);
                    });
                })
            }

            function move0to_1(f){
                move([
                    [90,1.17,196],
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
                    [49.96,-8.53,188.86],
                    [49.62,-3.67,203.3],
                    [52.29,-3.7,206.17],
                    [74.52,-3.7,206.92],
                    [75.3,-3.7,196.05],
                    [90.28,1.17,196.0],
                    [90,1.17,196],
                ],f);
            }
            function move(arr,f) {
                new MoveManager(//从0地面到-1层
                    scope.model, MoveManager.getArray(arr), f
                );
            }
        }
    }
    #moveByPath(){
    }
    #throughStair(pos){
        var scope=this;


        if(type===0){
            new MoveManager(//从0地面到-1层
                scope.model,
                MoveManager.getArray([
                    [90,1.17,196],
                    [90.28,1.17,196.0],
                    [75.3,-3.7,196.05],
                    [74.52,-3.7,206.92],
                    [52.29,-3.7,206.17],
                    [49.62,-3.67,203.3],
                    [49.96,-8.53,188.86],
                ]),
                finished
            );
        }else{
            new MoveManager(//从-1层到0地面
                scope.model,
                MoveManager.getArray([
                    [49.96,-8.53,188.86],
                    [49.62,-3.67,203.3],
                    [52.29,-3.7,206.17],
                    [74.52,-3.7,206.92],
                    [75.3,-3.7,196.05],
                    [90.28,1.17,196.0],
                    [90,1.17,196],
                ]),
                finished
            );
        }

    }
    #throughStair1(finished,type){
        var scope=this;
        if(type===0){
            new MoveManager(//从0地面到-1层
                scope.model,
                MoveManager.getArray([
                    [90,1.17,196],
                    [90.28,1.17,196.0],
                    [75.3,-3.7,196.05],
                    [74.52,-3.7,206.92],
                    [52.29,-3.7,206.17],
                    [49.62,-3.67,203.3],
                    [49.96,-8.53,188.86],
                ]),
                finished
            );
        }else{
            new MoveManager(//从-1层到0地面
                scope.model,
                MoveManager.getArray([
                    [49.96,-8.53,188.86],
                    [49.62,-3.67,203.3],
                    [52.29,-3.7,206.17],
                    [74.52,-3.7,206.92],
                    [75.3,-3.7,196.05],
                    [90.28,1.17,196.0],
                    [90,1.17,196],
                ]),
                finished
            );
        }

    }
    #throughStair2(){
        var scope=this;
        var y1=scope.model.position.y;
        if(y1>-2){//在地面
            scope.goToPosition({x:90,z:196}, function () {//到楼梯口
                new MoveManager(//穿过楼梯
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
                });
        }else{//在地下

        }
    }
    #initPF(){
        var scope=this;

        scope.grid = new PF.Grid(2000,2000);//生成网格
        scope.xMin=-1000;
        scope.zMin=-1000;
        scope.grid.setWalkableAt(2,2,false);
        scope.#radiographicTesting();
        console.log(scope.grid);

        scope.finder = new PF.AStarFinder({
            allowDiagonal: true,//允许对角线
            dontCrossCorners: false,//不要拐弯?
            heuristic: PF.Heuristic["manhattan"],//启发式["曼哈顿"]
            weight: 1
        });

        var path = scope.finder.findPath(1,1,5,5, scope.grid);
        console.log(path);
    }
    constructor(myMain){
        var scope=this;
        scope.model=new THREE.Object3D();
        scope.model.position.set(90,0,196);//(90,1.17,196);
        scope.myMain=myMain;
        scope.#initPF();
        //scope.goToPosition({x:5,z:5})
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
        console.log(scope.myMain)
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        var flag=0;
        function mouseDown0( event ) {
            console.log(flag)
            flag++;
            if(flag!==2)return;
            flag=0;
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
            raycaster.setFromCamera( mouse, scope.myMain.camera );
            //console.log(myMain.scene.children[1].children[0].children);
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
