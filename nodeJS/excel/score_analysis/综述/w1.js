var xls = require("exceljs");
var fs=require("fs");
var data=[]
var head=[
    {header: '组号', key: 'num',  width: 5},
    {header: '学号1',   key: 'id',   width: 9},
    {header: '学号2',   key: 'id',   width: 9},
    {header: '学号3',   key: 'id',   width: 9},
    {header: '学号4',   key: 'id',   width: 9},
]
read();
function read() {//获取学生名单
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
        process0()
        //write();
    });
}
function process0(){
    var groups=[];
    var groups_name=[];
    fs.readdirSync("./data").forEach(s=>{
        groups_name.push(s)
        var arr=s.split(".");
        arr.splice(arr.length-1,1)
        groups.push(arr)
    })
    console.log(groups)
    write(groups_name)
}




function write(arr) {
    var head=[
        {header: 'id',   key: 'id',   width: 3},
        {header: '组名', key: 'groupName', width: 9},
        {header: '分数', key: 'score', width: 5},
    ]
    var data=[]
    for(var i=0;i<arr.length;i++){
        data.push({
            'id':i,
            'groupName':arr[i]
        })
    }

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
    workbook.xlsx.writeFile('./综述小组.xlsx').then(function() {console.log('write done')});

}


/**/
