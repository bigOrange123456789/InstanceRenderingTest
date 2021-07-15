var xls = require("exceljs");
var data=[]
var data2=[];
var out_data=[];
var group_num=0;
read();
function read() {
    var arr=[];
    const excelfile = "./总分3 - 副本.xlsx";  //这是要导入的.xlsx文件的路径
    var workbook = new xls.Workbook();
    workbook.xlsx.readFile(excelfile).then(function () {
        var worksheet = workbook.getWorksheet(1); //获取第一个worksheet
        worksheet.eachRow(function (row,row_index) {
            if(row_index===1)return;
            v=row.values;
            s=v[13].result;
            /*
            if(s>89.5)s="优"
            else if(s>79.5)s="良"
            else if(s>69.5)s="中"
            else if(s>59.5)s="及格"
            else s=""
            */
            //str=str.split("'")[0]

            console.log(s)
            arr.push({n1:s})
            //console.log(str)
        });
        //read2();
        //process(0)
        write(arr);
    });
}

function write(arr0) {
    var head0=[
            {header: 'n1', key: 'n1',  width: 5}
        ];

    var workbook = new xls.Workbook();// 新建一个工作表
    workbook.created = new Date();// 创建日期
    workbook.modified = new Date();// 修改日期
    workbook.creator = 'test';// 作者名称
    workbook.lastModifiedBy = 'test';// 最后修改人
    let sheet = workbook.addWorksheet('汇总记录');// 添加sheet，并且初始化该sheet的名称
    // 设置表头
    sheet.columns =head0;

    // 添加多行，data1要是个数组类型(能用foreach遍历)
    sheet.addRows(arr0);

    // 单行添加，入参可以是一个对象，也可以是一个数组
    //sheet.addRow(data1[0]);

    // 写文件
    workbook.xlsx.writeFile('./work.xlsx').then(function() {console.log('write done')});

}


/**/
