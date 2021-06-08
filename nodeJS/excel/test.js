var xls = require("exceljs");
function read() {
    const excelfile = "./test.xlsx";  //这是要导入的.xlsx文件的路径
    var workbook = new xls.Workbook();
    workbook.xlsx.readFile(excelfile).then(function () {
        var worksheet = workbook.getWorksheet(1); //获取第一个worksheet
        worksheet.eachRow(function (data,row_index) {
            console.log(row_index,data.values)
            //console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
        });
    });
}


var data1 =  [
    {
        name : "张三",
        age  : 19,
        description : "一只张三"
    },
    {
        name : "张三",
        age  : 19,
        description : "2只张三"
    }
]

function operation() {
    var workbook = new xls.Workbook();// 新建一个工作表
    workbook.created = new Date();// 创建日期
    workbook.modified = new Date();// 修改日期
    workbook.creator = 'test';// 作者名称
    workbook.lastModifiedBy = 'test';// 最后修改人
    let sheet = workbook.addWorksheet('测试报表');// 添加sheet，并且初始化该sheet的名称
    // 设置表头
    sheet.columns = [
        {header: 'Name', key: 'name', width: 15},
        {header: 'Age', key: 'age', width: 15},
        {header: 'Description', key: 'description', width: 15}
    ];

    // 添加多行，data1要是个数组类型(能用foreach遍历)
    sheet.addRows(data1);

    // 单行添加，入参可以是一个对象，也可以是一个数组
    //sheet.addRow(data1[0]);

    // 写文件
    workbook.xlsx.writeFile('./filename.xlsx')
        .then(function() {
            // done
            console.log('write done')
        });

};

operation();
