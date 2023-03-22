import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import config from '../config/conifg.json'
export class Building{
    constructor(scene){
        this.config=config.src.Building_new
        this.path= this.config.path//"assets/113"
        this.number=this.config.number//9
        this.parentGroup = new THREE.Group()
        this.meshlist=[]
        window.meshlist=this.meshlist
        scene.add(this.parentGroup)
        this.load()
    }
    load(){
        var self = this
        new THREE.FileLoader().load(self.path+"/structdesc.json",json=>{
            var structList = JSON.parse(json)
            new THREE.FileLoader().load(self.path+"/smatrix.json",json=>{
                var matrixList = JSON.parse(json)
                var i = 0
                var loading = setInterval(function(){
                    self.loadSubGLTF(i,structList,matrixList)
                    if(++i===self.number) {
                        clearInterval(loading)
                        console.log("finish!")
                    }
                },10)
            })
        })
    }
    loadSubGLTF (meshIndex,structdesc0,matrixConfig){
	    const self=this;
        var url=self.path+"/output"+meshIndex+".gltf"    // console.log(url)
	    var loader=new THREE.LoadingManager()
	    new Promise(function( resolve, reject) {
		    var myGLTFLoaderEx=new GLTFLoader(loader)
		    myGLTFLoaderEx.load(url, (gltf)=>{
			    resolve(gltf)
		    },()=>{},()=>{	    // console.log("加载失败："+meshIndex)
			    setTimeout(()=>{
				    self.loadSubGLTF(meshIndex,structdesc0,matrixConfig)
			    },1000*(0.5*Math.random()+1))
		    })
	    } ).then( function ( gltf ) {
		    var meshNodeList = gltf.scene.children[0].children
            self.processMesh(meshNodeList,structdesc0,matrixConfig)
	    } )
    }
    processMesh(meshNodeList,structList,matrixList){//这个模型已经拆分好了
        for(let i=0; i<meshNodeList.length; i++){//遍历全部mesh对象
            var node = meshNodeList[i].clone()//将第i个mesh进行实例化
            var group = structList[Number(node.name)][0]//将这个mesh的全部分组信息提取出来
            var matrices = matrixList[group.n].it//获取这个分组的全部矩阵
            matrices.push([1,0,0,0,  0,1,0,0,  0,0,1,0])
            var instanceMesh = new THREE.InstancedMesh(node.geometry,node.material,matrices.length)
            instanceMesh.spheres_mat=[]
            for(let j=0; j<matrices.length; j++){
                var mat = matrices[j]
                var instanceMatrix = new THREE.Matrix4().set(
                    mat[0], mat[1], mat[2], mat[3],
                    mat[4], mat[5], mat[6], mat[7],
                    mat[8], mat[9], mat[10], mat[11],
                    0, 0, 0, 1)
                instanceMesh.spheres_mat.push(instanceMatrix)
                instanceMesh.setMatrixAt(j,instanceMatrix)
            }
            this.parentGroup.add(instanceMesh )
            this.meshlist.push(instanceMesh)
            getSpheres(instanceMesh)   
            if(this.meshlist.length==21484)this.merge()
        }
        function getSpheres(instanceMesh){//获取实例化对象对包围球
            instanceMesh.spheres=[]
            instanceMesh.geometry.computeBoundingSphere()
            for(var j=0;j<instanceMesh.spheres_mat.length;j++){
                var sphere = instanceMesh.geometry.boundingSphere.clone()
                sphere.applyMatrix4(instanceMesh.spheres_mat[j])
                sphere.applyMatrix4(instanceMesh.matrixWorld)
                instanceMesh.spheres.push(sphere)
            }
        }
    }
    merge(){
        console.log("开始进行kmeans距离计算!")
        const dataSet=[]
        for(let i=0;i<window.meshlist.length;i++){
            const center=window.meshlist[i].spheres[0].center
            dataSet.push([
                center.x,
                center.y,
                center.z
            ])
        }
        const clusterAssment=kMeans(dataSet, 1000)
        for(let i=0;i<1000;i++){
            let count=0
            for(let j=0;j<clusterAssment.length;j++){
                if(clusterAssment[j]==i)count++
            }
            if(count===0){
                console.log(i)
            }
        }
            
                
        console.log("clusterAssment",clusterAssment)
        console.log("完成进行kmeans距离计算!")

        function kMeans(dataSet, k) {
            // 初始化质心
            let centroids = initCentroids(dataSet, k);
          
            // 循环迭代
            let clusterChanged = true;
            let clusterAssment = [];
            for (let i = 0; i < dataSet.length; i++) {
              clusterAssment.push(-1);
            }
            while (clusterChanged) {
              clusterChanged = false;
          
              // 分配数据点到最近的质心
              let clusters = {};
              for (let i = 0; i < dataSet.length; i++) {
                let point = dataSet[i];
                let minDist = Infinity;
                let minIndex = -1;
                for (let j = 0; j < centroids.length; j++) {
                  let dist = euclideanDist(point, centroids[j]);
                  if (dist < minDist) {
                    minDist = dist;
                    minIndex = j;
                  }
                }
                if (clusterAssment[i] !== minIndex) {
                  clusterChanged = true;
                  clusterAssment[i] = minIndex;
                }
                if (!clusters[minIndex]) {
                  clusters[minIndex] = [];
                }
                clusters[minIndex].push(point);
              }
          
              // 更新质心
              for (let i = 0; i < centroids.length; i++) {
                let cluster = clusters[i];
                if (cluster) {
                  let newCentroid = calcCentroid(cluster);
                  if (!arraysEqual(newCentroid, centroids[i])) {
                    centroids[i] = newCentroid;
                    clusterChanged = true;
                  }
                }
              }
            }
          
            // 返回聚类结果
            return clusterAssment;
          }
          
          
        function initCentroids(dataSet, k) {//随机选取几个点作为质心
            let centroids = [];
            for (let i = 0; i < k; i++) {
              centroids.push(dataSet[Math.floor(Math.random() * dataSet.length)]);
            }
            return centroids;
        }
          
          function euclideanDist(a, b) {//计算两个点之间的欧式距离
            let dist = 0;
            for (let i = 0; i < a.length; i++) {
              dist += (a[i] - b[i]) ** 2;
            }
            return Math.sqrt(dist);
          }
          
          function calcCentroid(points) {//获取一组点的中心
            let centroid = [];
            for (let i = 0; i < points[0].length; i++) {
              let sum = 0;
              for (let j = 0; j < points.length; j++) {
                sum += points[j][i];
              }
              centroid.push(sum / points.length);
            }
            return centroid;
          }
          
          function arraysEqual(a, b) {//判断两组点是否一致
            if (a.length !== b.length) {
              return false;
            }
            for (let i = 0; i < a.length; i++) {
              if (a[i] !== b[i]) {
                return false;
              }
            }
            return true;
          }
          

    }
    
}
