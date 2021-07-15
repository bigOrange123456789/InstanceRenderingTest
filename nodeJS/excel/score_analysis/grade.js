var xls = require("exceljs");
read();
function read() {
    var data=[]
    var workbook = new xls.Workbook();
    workbook.xlsx.readFile("总分2.xlsx").then(function () {
        var worksheet = workbook.getWorksheet(1); //获取第一个worksheet
        worksheet.eachRow(function (row,row_index) {
            if(row_index===1)return;
            else console.log(row_index)
            v=row.values;
            //console.log(v[7].result*20/25)
            var n1=v[7].result*100/25+7
            var n2=v[8]*100/25+7
            var n3=v[9]*2+7
            n1=Math.ceil(n1)
            n2=Math.ceil(n2)
            n3=Math.ceil(n3)
            if(n1>100)n1=100;
            if(n2>100)n2=100;
            if(n3>100)n3=100;
            data.push({
                n1:n1,
                n2:n2,
                n3:n3
            })
            if(row_index===49){

            }
        });

        //read2();
        //process(0)
        //write();
        console.log(data)
        write(data);
    });

}


function write(data0) {
    var head0=[
            {header: 'n1', key: 'n1',  width: 5},
            {header: 'n2', key: 'n2',  width: 5},
            {header: 'n3', key: 'n3',  width: 5},
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
    sheet.addRows(data0);

    // 单行添加，入参可以是一个对象，也可以是一个数组
    //sheet.addRow(data1[0]);

    // 写文件
    workbook.xlsx.writeFile('./result000.xlsx').then(function() {console.log('write done')});

}


/**/
