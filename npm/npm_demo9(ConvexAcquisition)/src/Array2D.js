export class Array2D{
    constructor(config){
        const self=this
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
        self.now={x:config.x.start,y:config.y.start}
        self.detected={}//-1:未检测 0:非核 1:核视点
        self.entropy={}
        for(let x=self.x.start;x<=self.x.end;x+=self.x.step){
            self.detected[x]={}
            self.entropy[x]={}
            for(let y=self.y.start;y<=self.y.end;y+=self.y.step){
                let name=x+","+y+",-10"
                self.detected[x][y]=-1
                self.entropy[x][y]=config.entropy[name]
            }
        } 
    }
    l(){
        let x=this.now.x-this.x.step
        let y=this.now.y
        if(x<this.x.start)return null
        else return{x:x,y:y}
    }
    r(){
        let x=this.now.x+this.x.step
        let y=this.now.y
        if(x>this.x.end)return null
        else return{x:x,y:y}
    }
    d(){
        let x=this.now.x
        let y=this.now.y-this.y.step
        if(y<this.y.start)return null
        else return{x:x,y:y}
    }
    u(){
        let x=this.now.x
        let y=this.now.y+this.y.step
        if(y>this.y.end)return null
        else return{x:x,y:y}
    }
    neighbour(tag){
        let arr=[
            [1,0],
            [-1,0],
            [0,1],
            [0,-1],

            [1,1],
            [-1,-1],
            [-1,1],
            [1,-1]
        ]
        let x=this.now.x+this.x.step*arr[tag][0]
        let y=this.now.y+this.y.step*arr[tag][1]
        if(x<this.x.start||x>this.x.end||y<this.y.start||y>this.y.end)return null
        else return{x:x,y:y}

    }

    getNext_old(){
        let entropyMax=this.entropy[this.now.x][this.now.y]
        let next=-1//周围熵最大的位置
        let pes=[this.l(),this.r(),this.d(),this.u()]  
        for (let i in pes){
            let p=pes[i]
            if(p!==null){
                let entropy=this.entropy[p.x][p.y]
                if(entropy>entropyMax){
                    entropyMax=entropy
                    next=p
                }
            }
        }  
        return next
    }
    getNext(){
        let entropyMax=this.entropy[this.now.x][this.now.y]
        let next=-1//周围熵最大的位置
        for (let i=0;i<8;i++){
            let p=this.neighbour(i)
            if(p!==null){
                let entropy=this.entropy[p.x][p.y]
                if(entropy>entropyMax){
                    entropyMax=entropy
                    next=p
                }
            }
        }  
        return next
    }
    detect(){
        const self=this
        for(let x=self.x.start;x<=self.x.end;x+=self.x.step)
            for(let y=self.y.start;y<=self.y.end;y+=self.y.step)
                if(self.detected[x][y]==-1){
                    this.now={x:x,y:y}
                    let next=this.getNext()
                    // while(next!=-1&&this.detected[next.x][next.y]==-1){//有next 并且next没有被检测过
                    //     this.detected[this.now.x][this.now.y]=0//检测后发现不是核视点
                    //     this.now=next
                    //     next=this.getNext()                        
                    // }
                    //console.log(next)
                    if(next==-1){
                        this.detected[this.now.x][this.now.y]=1//是核视点
                    }
                }
        self.kernelPosition=[]
        for(let x=self.x.start;x<=self.x.end;x+=self.x.step)
            for(let y=self.y.start;y<=self.y.end;y+=self.y.step)
                if(this.detected[x][y]==1)
                    self.kernelPosition.push([x,y])
        return self.kernelPosition

    }

}