
window.addEventListener("load",()=>{
    if( checkPlatform()=="PC"){
        speciesLib=loadForestWithMultiSpeciesProgressively(100,100,
            [
               {name:"Black_Gum",count:1,barkMaterialID:"1",scaleBase:2,planarTreeScale:15}
            ]);
    }else{
        speciesLib=loadForestWithMultiSpeciesProgressively(30,30,
            [
               ,{name:"Black_Gum",count:9,barkMaterialID:"1",scaleBase:3,planarTreeScale:15}
            ]);
    } 
},false);
