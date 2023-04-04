import{MyUI} from "../../lib/ui/MyUI_sim.js"
export class Panel{
  constructor(main){
      this.main=main
      this.addMyUI()
      this.show
  }
  addMyUI()
  {
    //完成设置个数
    var width=window.innerWidth
    var height=window.innerHeight
    var self=this;
    var ui=new MyUI()
    ui.init()
    new ui.Button('展示模型', "#3498DB", '#2980B9', '#01DFD7',
          (width/10)/6, 150,
          width/10, (width/10)/4,
          0,500,(b)=>{//位置
            // alert("test")
            // if(self.showModel)self.showModel()
            self.main.building.modelShow()
          })
    new ui.Button('展示墙壁', "#3498DB", '#2980B9', '#01DFD7',
          (width/10)/6, 150,
          width/10, (width/10)/4,
          0,550,(b)=>{//位置
            // alert("test")
            // if(self.showModel)self.showModel()
            self.main.building.wallShow()
          })
    new ui.Button('准确可见集', "#3498DB", '#2980B9', '#01DFD7',
          (width/10)/6, 150,
          width/10, (width/10)/4,
          0,600,(b)=>{//位置
            if(window.showVDbyColor=="evd"){
              window.showVDbyColor="pvd"
              b.innerHTML="潜在可见集"
            }else{
              window.showVDbyColor="evd"
              b.innerHTML="准确可见集"
            }
            
            // alert("test")
            // if(self.showModel)self.showModel()
            console.log(b)
            window.b=b
          })
  }
}