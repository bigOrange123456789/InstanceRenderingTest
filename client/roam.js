var mydata;
if(sceneName==="cgm"){
    camera.position.set(-69.38,8.9,-104.1);
    camera.rotation.set(-2.621005672936,  -0.09848825414359064,  -3.085276106822402)
    //开始自动漫游路径
    mydata = [//自动漫游路径
        //x         y      z      angel       time  展板编号  展板初始旋转(单位是90度)
        [-69.38,8.9,-104.1,-2.62101,-0.09849,-3.08528,50]
        /**/,[-68.74,6.09,-97.28,-2.63673,-0.03204,-3.1239,50]
        ,[-68.44,3.19,-91.32,-2.43858,0.48844,2.76309,50]
        ,[-71.24,3.19,-89.53,-0.59823,-0.05111,-0.0348,50]
        ,[-71.74,1.07,-94.53,-0.73316,-0.37061,-0.31531,50]
        ,[-70.66,0.22,-95.85,-1.93785,-1.1941,-1.96285,50]
        ,[-69.21,-0.13,-95.76,-2.83154,-0.07599,-3.11728,50]
        ,[-68.71,-0.36,-94.09,-2.84314,0.12452,3.1034,50]
        ,[-68.74,-1.44,-87.81,-3.12541,0.08521,3.14021,50]
        ,[-68.28,-1.06,-70.6,3.11272,-0.03477,3.14058,50]
        ,[-78.29,-1,-59.7,-3.1404,0.46022,3.14106,50]
        ,[-77.49,-0.53,-53.19,3.06712,-0.12444,3.13233,50]
        ,[-75.07,-0.21,-22.85,3.03772,-0.04952,3.13643,50]
        ,[-74.42,-0.69,0.96,3.09849,-0.06472,3.1388,50]
        //,[-70.75,-1.34,36.84,-3.07858,-0.1994,-3.1291,20]
        ,[-68.01,-0.78,42.71,3.0488,-0.3185,3.11246,50]
        //,[-66.55,-0.41,49.31,3.09828,0.04018,-3.13986,20]
        ,[-66.61,-0.34,50.93,3.09828,0.04018,-3.13986,50]

        ,[-68.73,-0.09,60.92,-3.1399,-0.01979,-3.14156,50]
        ,[-68.3,-0.13,82.62,-3.1399,-0.01979,-3.14156,50]
        ,[-64.32,-0.33,86.25,-3.09791,-1.17445,-3.10129,50]
        ,[-51.3,-0.56,90.78,-3.11333,-1.50476,-3.11339,50]
        ,[-8.54,-0.63,90.42,2.63731,-1.51255,2.63803,50]
        ,[22.49,0.23,93.06,-3.02865,-1.14238,-3.03878,50]
        ,[44.77,-0.19,103.95,3.01937,-1.33811,3.02263,50]
        ,[93.59,0.46,109.01,2.7385,-1.49905,2.73943,50]
        ,[113.33,-0.11,110.01,0.61949,-1.52293,0.61894,50]
        ,[132.94,0.29,109.63,-1.10183,-1.51777,-1.10127,50]
        ,[157.33,-0.87,109.04,-1.10183,-1.51777,-1.10127,50]
        ,[176.29,-0.1,108.45,2.02818,-1.52324,2.02862,50]
        ,[203.79,-1.1,111.63,-1.31704,-1.47553,-1.31593,50]
        ,[207.83,-1.11,111.36,0.47279,-1.51018,0.47205,50]
        ,[223.6,-0.75,110.88,-3.04778,-1.38398,-3.0494,50]
        ,[242.29,-1.3,110.94,2.92898,-1.3806,2.93271,50]
    ];
}else{//scene==="demo1";
    camera.position.set(18.154013370872566,12.540075749220236, -50.36415035346785)
    camera.rotation.set(-3.1314631291789343,0.021591546162005783,3.1413739510125014)

    //开始自动漫游路径
    mydata = [//自动漫游路径
        //x         y      z      angel       time  展板编号  展板初始旋转(单位是90度)
        [18.15,12.54,-50.37,-3.13147,0.02159,3.14137,100]
        ,[14.94,2.8,-15.36,-3.1163,-0.0534,-3.14025,100]
        ,[13.77,1.36,-8.73,-3.1163,-0.0534,-3.14025,100]
        ,[12.79,1.2,0.3,3.09133,0.11145,-3.136,100]
        ,[11.83,0.97,4.38,-3.07535,0.59057,3.10466,100]
        ,[9.88,0.88,5.42,-3.0152,1.49095,3.01559,100]
        ,[-2.9,1.58,5.44,0.17083,1.4533,-0.16968,100]
        ,[-5.39,1.21,1.9,-0.05751,-0.25461,-0.0145,100]
        //,[-2.31,1.15,0.47,0.02689,-1.40995,0.02655,100]
        ,[1.79,1.12,0.53,-2.96502,-0.10987,-3.12204,100]
        ,[1.97,0.87,2.16,0.91337,-1.52861,0.91294,100]
        ,[5.55,3.03,2.22,1.72637,-1.09739,1.74523,100]
        ,[7.07,3.3,2.57,2.99072,0.36459,-3.08744,100]
        ,[7.94,3.57,3.46,2.54004,1.15699,-2.5805,100]
        ,[3.8,5.94,3.66,-1.30523,1.40973,1.3019,100]
        ,[2.23,5.91,2.87,-0.08371,0.25233,0.02094,100]
        ,[1.68,5.74,1.08,-0.10355,0.67056,0.06448,100]
        ,[-2.98,5.96,1.02,2.95123,1.46145,-2.95235,100]
        ,[-4.17,5.8,2.73,3.13624,0.05341,-3.14131,100]
        ,[-4.1,5.6,7.18,-3.1319,0.03841,3.14122,100]
        ,[-3.77,5.88,13.54,-2.97649,0.23034,3.10356,100]
    ];
}
setTimeout(function (){
    camera.position.set(
        camera.position.x,
        camera.position.y,
        camera.position.z+0.0001
    )
},1000)