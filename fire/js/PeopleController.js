import {MoveManager} from './playerControl/MoveManager.js';
//import {PF} from './lib/PF.js';
export {PeopleController};
class PeopleController{
    myMain;
    model;
    myPF;
    grid;finder;
    goToPosition(pos){
        var scope=this;
        var x1=Math.floor(Math.abs(scope.model.position.x));
        var z1=Math.floor(Math.abs(scope.model.position.z));
        var x2=Math.floor(Math.abs(pos.x));
        var z2=Math.floor(Math.abs(pos.z));
        var grid=scope.grid.clone();
        var path = scope.finder.findPath(x1,z1,x2,z2,grid);
        for(var i=0;i<path.length;i++){
            path[i].splice(1,0,scope.model.position.y);
        }
        console.log(x1,z1,x2,z2);
        console.log(path);
        new MoveManager(
            scope.model,
            MoveManager.getArray(path)
        );
    }
    #moveByPath(){

    }
    #initPF(){
        var scope=this;

        scope.grid = new PF.Grid(500,500);//生成网格
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
        scope.model.position.set(90,1.17,196);
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
                scope.goToPosition({x:intersects[0].point.x,z:intersects[0].point.z})
            }else console.log("没有点击到");
        }
        //document.body.οnclick=mouseDown0;
        window.addEventListener( 'mousedown',mouseDown0, true );
        setInterval(function () {
            flag=0;
        },1000);
    }
}
