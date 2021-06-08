var xls = require("exceljs");

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
    let sheet = workbook.addWorksheet('统计');// 添加sheet，并且初始化该sheet的名称
    sheet.columns = [// 设置表头
        {header: '学号', key: 'id', width: 15},
        //{header: '第一次作业', key: 'n1', width: 15},
        //{header: '第二次作业', key: 'n2', width: 15}
    ];

    // 添加多行，data1要是个数组类型(能用foreach遍历)
    sheet.addRows(data1);

    // 单行添加，入参可以是一个对象，也可以是一个数组
    //sheet.addRow(data1[0]);

    // 写文件
    workbook.xlsx.writeFile('./filename.xlsx')
        .then(function() {console.log('write done')});

}

operation();
