var xls = require("exceljs");
var fs=require("fs");
var data=[]
var head=[
    {header: '姓名',   key: 'name',   width: 8},
    {header: '学号', key: 'id', width: 9},
    {header: '得分', key: 'score', width: 5},
]
read1();
function read1() {//获取学生名单
    const excelfile = "./list.xlsx";  //这是要导入的.xlsx文件的路径
    var workbook = new xls.Workbook();
    workbook.xlsx.readFile(excelfile).then(function () {
        var worksheet = workbook.getWorksheet(1); //获取第一个worksheet
        worksheet.eachRow(function (row,row_index) {
            v=row.values;
            var name=v[3];
            name=name.split("'")
            name=name[0]
            data.push({
                id:parseInt(v[2]),
                name:name,
                score:0
            })
        });
        console.log(data)
        read2()
    });
}
function read2() {//获取学生名单
    const excelfile = "./综述小组打分结果.xlsx";  //这是要导入的.xlsx文件的路径
    var workbook = new xls.Workbook();
    workbook.xlsx.readFile(excelfile).then(function () {
        var worksheet = workbook.getWorksheet(1); //获取第一个worksheet
        worksheet.eachRow(function (row,row_index) {
            if(row_index===1)return;
            v=row.values;
            var names=v[2];
            console.log(v[2])
            var arr=names.split(".")
            arr.splice(arr.length-1,1)
            for(var i=0;i<arr.length;i++){
                var name=arr[i]
                for(var j=0;j<data.length;j++){
                    var data0=data[j]
                    if(name===data0.name){
                        data0.score=v[3];
                    }
                }
            }
        });
        var p=[]
        for(var i=0;i<data.length;i++){
            if(data[i].score===0){
                data[i].score=17;
                var name=data[i].name;
                name=name.split("'")
                name.splice(1,1)
                name=name[0]
                p.push([data[i].id,name]);
            }
        }
        console.log(p)
        write();
    });
}




function write() {
    var workbook = new xls.Workbook();// 新建一个工作表
    workbook.created = new Date();// 创建日期
    workbook.modified = new Date();// 修改日期
    workbook.creator = 'test';// 作者名称
    workbook.lastModifiedBy = 'test';// 最后修改人
    let sheet = workbook.addWorksheet('s1');// 添加sheet，并且初始化该sheet的名称
    console.log(head,data)
    // 设置表头
    sheet.columns =head;

    // 添加多行，data1要是个数组类型(能用foreach遍历)
    sheet.addRows(data);

    // 单行添加，入参可以是一个对象，也可以是一个数组
    //sheet.addRow(data1[0]);

    // 写文件
    workbook.xlsx.writeFile('./综述个人成绩.xlsx').then(function() {console.log('write done')});

}


/**/
