export class Array3D{
    constructor(config){
        const self=this
        const colorList=[]
        const s=0.5
        for(let r=0;r<=1;r+=s)
            for(let g=0;g<=1;g+=s)
                for(let b=0;b<=1;b+=s){
                    colorList.push([r,g,b])
                }
        this.colorList=colorList
        self.x={
            start:config.x.start,
            end  :config.x.end,
            step :config.x.step
        }
        self.y={
            start:config.y.start,
            end  :config.y.end,
            step :config.y.step
        }
        self.z={
            start:config.z.start,
            end  :config.z.end,
            step :config.z.step
        }
        self.now={x:config.x.start,y:config.y.start,z:config.z.start}
        self.detected={}//-1:未检测 0:非核 1:核视点
        self.entropy={}
        self.neighbourDirection=[]//26个邻居
        const ns=1
        for(let i=-ns;i<=ns;i++)
            for(let j=-ns;j<=ns;j++)
                for(let k=-ns;k<=ns;k++)
                    if(i!=0||j!=0||k!=0)
                        self.neighbourDirection.push([i,j,k])
        for(let x=self.x.start;x<=self.x.end;x+=self.x.step){
            self.detected[x]={}
            self.entropy[x]={}
            for(let y=self.y.start;y<=self.y.end;y+=self.y.step){
                self.detected[x][y]={}
                self.entropy[x][y]={}
                for(let z=self.z.start;z<=self.z.end;z+=self.z.step){
                    let name=x+","+y+","+z
                    self.detected[x][y][z]=-1
                    self.entropy[x][y][z]=config.entropy[name]
                }
            }
        } 
    }
    neighbour(tag){
        let arr=this.neighbourDirection
        let x=this.now.x+this.x.step*arr[tag][0]
        let y=this.now.y+this.y.step*arr[tag][1]
        let z=this.now.z+this.z.step*arr[tag][2]
        if(
            x<this.x.start||x>this.x.end||
            y<this.y.start||y>this.y.end||
            z<this.z.start||z>this.z.end)return null
        else return{x:x,y:y,z:z}
    }
    getNext(){
        let entropyMax=this.entropy[this.now.x][this.now.y][this.now.z]
        let next=-1//周围熵最大的位置
        for (let i=0;i<this.neighbourDirection.length;i++){
            let p=this.neighbour(i)
            if(p!==null){
                let entropy=this.entropy[p.x][p.y][p.z]
                if(entropy>entropyMax){
                    entropyMax=entropy
                    next=p
                }
            }
        }  
        return next
    }
    detect(){
        this.computeConvexDot()
        this.computeConvexArea()
    }
    computeConvexDot(){
        const self=this
        self.convexDot=[]
        for(let x=self.x.start;x<=self.x.end;x+=self.x.step)
            for(let y=self.y.start;y<=self.y.end;y+=self.y.step)
            for(let z=self.z.start;z<=self.z.end;z+=self.z.step)
                if(self.detected[x][y][z]==-1){
                    this.now={x:x,y:y,z:z}
                    let next=this.getNext()
                    if(next==-1){
                        this.detected[this.now.x][this.now.y][this.now.z]=1//是核视点
                        self.convexDot.push([x,y,z])
                    }
                }   

        
        this.color_convexDot={}
        for(let i=0;i<this.convexDot.length;i++){
            let name=this.convexDot[i][0]+","+this.convexDot[i][1]+","+this.convexDot[i][2]
            this.color_convexDot[name]=this.colorList[i]
        }
        return self.convexDot
    }
    computeConvexArea(){
        const self=this
        if(!self.convexDot){
            return null
        }
        self.convexArea={}
        for(let x=self.x.start;x<=self.x.end;x+=self.x.step){
            self.convexArea[x]={}
            for(let y=self.y.start;y<=self.y.end;y+=self.y.step){
                self.convexArea[x][y]={}
                for(let z=self.z.start;z<=self.z.end;z+=self.z.step){
                    self.convexArea[x][y][z]=-1//尚未找到这个位置对应的凸点
                }
            }
        }
        for(let x=self.x.start;x<=self.x.end;x+=self.x.step)
            for(let y=self.y.start;y<=self.y.end;y+=self.y.step)
            for(let z=self.z.start;z<=self.z.end;z+=self.z.step)
                if(self.convexArea[x][y][z]==-1){
                    this.now={x:x,y:y,z:z}
                    let next=this.getNext()
                    while(next!=-1&&this.convexArea[next.x][next.y][next.z]==-1){//当前位置不是凸点 并且下一个位置不确定凸区域
                        this.now=next
                        next=this.getNext()
                    }
                    if(next==-1){//当前位置是核视点
                        this.convexArea[x][y][z]=this.now.x+","+this.now.y+","+this.now.z
                    }else if(this.convexArea[next.x][next.y][next.z]!==-1){//next的凸区域划分已经完成
                        this.convexArea[x][y][z]=this.convexArea[next.x][next.y][next.z]
                    }else{
                        console.log("error!!")
                    }

                }   
        return this.convexArea
    }

}