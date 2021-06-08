var xls = require("exceljs");
var data=[]
var head=[
    {header: '编号', key: 'num',  width: 5},
    {header: 'id',   key: 'id',   width: 9},
    {header: '姓名', key: 'name', width: 9},
    {header: '1猫变虎', key: 'n1', width: 15},
    {header: '2直线绘制', key: 'n2', width: 15},
    {header: '3圆的绘制', key: 'n3', width: 15},
    {header: '4点与多面体', key: 'n4', width: 15},
    {header: '5扫描线填充', key: 'n5', width: 15},
    {header: '6栅栏填充', key: 'n6', width: 15},
    {header: '7图形几何变换', key: 'n7', width: 15},
    {header: '8多边形裁剪', key: 'n8', width: 15},
    {header: '9Hermit曲线', key: 'n9', width: 15},
    {header: '提交次数', key: 'total', width: 15},
]
read();
function read() {
    const excelfile = "./list.xlsx";  //这是要导入的.xlsx文件的路径
    var workbook = new xls.Workbook();
    workbook.xlsx.readFile(excelfile).then(function () {
        var worksheet = workbook.getWorksheet(1); //获取第一个worksheet
        worksheet.eachRow(function (row,row_index) {
            v=row.values;
            data.push({
                num:parseInt(v[1]),
                id:parseInt(v[2]),
                name:v[3]
            })
        });
        process(0)
        //write();
    });
}
function process(index) {
    var filesName=[
        '作业1-猫变虎',
        '作业2-直线绘制',
        '作业3-圆的绘制',
        '作业4-判断点在多面体内部',
        '作业5-扫描线填充',
        '作业6-栅栏填充',
        '作业7-图形几何变换',
        '作业8-多边形裁剪',
        '作业9-Hermit曲线',
    ]
    var fs = require('fs');

    var path="./作业1-猫变虎"
    if(index<filesName.length){
        path="./"+filesName[index]
    }else{
        total();
        return;
    }
    fs.readdirSync(path).forEach(function (s) {
        var id0=parseInt(s.substring(0,7));
        add(id0,"n"+(index+1))
    });
    process(index+1)
}
function total() {
    for(i=0;i<data.length;i++){
        e=data[i]
        var total=0;
        for(var j=1;j<=9;j++){
            if(e["n"+j])total++;
        }
        e.total=total;
    }
    write()
}
function add(id0,attribute){
    for(var i=0;i<data.length;i++){
        var e=data[i]
        if(e.id===id0){
            e[attribute]="Y"
        }
    }
}



function write() {
    var workbook = new xls.Workbook();// 新建一个工作表
    workbook.created = new Date();// 创建日期
    workbook.modified = new Date();// 修改日期
    workbook.creator = 'test';// 作者名称
    workbook.lastModifiedBy = 'test';// 最后修改人
    let sheet = workbook.addWorksheet('汇总记录');// 添加sheet，并且初始化该sheet的名称
    // 设置表头
    sheet.columns =head;

    // 添加多行，data1要是个数组类型(能用foreach遍历)
    sheet.addRows(data);

    // 单行添加，入参可以是一个对象，也可以是一个数组
    //sheet.addRow(data1[0]);

    // 写文件
    workbook.xlsx.writeFile('./提交情况.xlsx').then(function() {console.log('write done')});

}


/**/
