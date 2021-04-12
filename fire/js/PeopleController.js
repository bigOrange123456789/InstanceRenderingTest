import {MoveManager} from './playerControl/MoveManager.js';
//import {PF} from './lib/PF.js';
export {PeopleController};
class PeopleController{
    model;
    myPF;
    grid;finder;
    goToPosition(pos){
        var scope=this;
        var x1=Math.floor(scope.model.position.x);
        var z1=Math.floor(scope.model.position.z);
        var x2=Math.floor(pos.x);
        var z2=Math.floor(pos.z);
        var path = scope.finder.findPath(x1,z1,x2,z2,scope.grid);
        console.log(x1,z1,x2,z2);
        console.log(path);
    }
    #initPF(){
        var scope=this;

        scope.grid = new PF.Grid(100,100);//生成网格
        scope.grid.setWalkableAt(2,2,false);
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
    constructor(){
        var scope=this;
        scope.model=new THREE.Object3D();
        scope.#initPF();
        scope.goToPosition({x:5,z:5})
        new THREE.GLTFLoader().load("../../_DATA_/male_run.glb", (glb) => {
            scope.model.add(glb.scene);
            playAnimation(glb);
            scope.#test(glb);
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
    #test=function (glb){
        glb.scene.position.set(90,1.17,196);
        window.MM=new MoveManager(
            glb.scene,
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
}
