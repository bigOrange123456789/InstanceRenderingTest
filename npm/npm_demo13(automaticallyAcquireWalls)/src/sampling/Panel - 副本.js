import{MyUI} from "../lib/ui/MyUI.js"
export class Panel{
  constructor(){
      this.camera=window.camera
      this.addMyUI()
  }
  addMyUI()
  {
    const c=this.camera
    this.weight=this.computeWeight()
    window.weight=this.weight
    //开始设置个数
    this.viewPointNumber=0
    this.viewPointData=[]
    //完成设置个数
    
    var width=window.innerWidth
    var height=window.innerHeight
    var scope=this;
    var ui=new MyUI()
    ui.init()
    new ui.Button('调整场景', "#3498DB", '#2980B9', '#01DFD7',
          (width/10)/6, 150,
          width/10, (width/10)/4,
          800,30,(b)=>{
            alert("test")
          })
  }
}