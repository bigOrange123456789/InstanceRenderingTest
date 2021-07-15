var xls = require("exceljs");
var data=[]
var data2=[];
var out_data=[];
var group_num=0;
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
                name:v[3],
                group:-1
            })
        });
        read2();
        //process(0)
        //write();
    });
}
function read2(){
    const excelfile = "./分组情况.xlsx";  //这是要导入的.xlsx文件的路径
    var workbook = new xls.Workbook();
    workbook.xlsx.readFile(excelfile).then(function () {
        var worksheet = workbook.getWorksheet(1); //获取第一个worksheet
        worksheet.eachRow(function (row,row_index) {
            v=row.values;
            v.splice(0,1);
            console.log(v)
            data2.push(v)
            /*data.push({
                num:parseInt(v[1]),
                id:parseInt(v[2]),
                name:v[3]
            })*/
        });
        process_new();
        //process(0)
        //write();
    });
}
function process_new() {
    for(var i1=0;i1<data2.length;i1++){
        if(data2[i1].length>0){
            group_num++;
            for(var i2=0;i2<data2[i1].length;i2++){
                for(var i3=0;i3<data.length;i3++){
                    if(parseFloat(data[i3].id)===parseFloat(data2[i1][i2])){
                        //data[i3].group=i1+1;

                        data[i3].group=group_num;
                    }
                }
            }
        }
    }
    console.log(data)
    process_new2()
}

function process_new2() {
    var result="";
    for(var i1=1;i1<=group_num;i1++){
        //字符串
        result+="第"+i1+"组：\n"
        for(var i3=0;i3<data.length;i3++){
            if(data[i3].group===i1){
                result+=("\t"+data[i3].name+"\t\t"+data[i3].id+"\n");
            }
        }
        result+="\n";

        //表格
        out_data.push({
            id:i1,
            n:'',
            n1:'',
            n2:'',
            n3:'',
            n4:'',
            n5:'',
        })
        var string0='';
        for(i3=0;i3<data.length;i3++){
            if(data[i3].group===i1){
                string0+=(data[i3].name+" ");
            }
        }
        out_data[out_data.length-1].n=string0;

    }

    result+="尚未填写分组信息：\n"
    for(var i=0;i<data.length;i++){
        if(data[i].group===-1){
            result+=("\t"+data[i].name+"\t\t"+data[i].id+"\n");
        }
    }
    require('fs').writeFile("name.txt", result , function(){});
    write(out_data);
}

function write(data0) {
    var name0="打分表.xlsx",
        head0=[
            {header: '组号', key: 'id',  width: 5},
            {header: '成员',key: 'n', width: 12},
            {header: '工作量\n(10分)',key: 'n1', width: 12},
            {header: '难度系数\n(15分)',key: 'n2', width: 12},
            {header: '新颖性\n(5分)',key: 'n3', width: 12},
            {header: '文档材料完备性\n(10分)', key: 'n4', width: 5},
            {header: '答辩表现\n(10分)', key: 'n5', width: 5}
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
    workbook.xlsx.writeFile('./'+name0+'.xlsx').then(function() {console.log('write done')});

}


/**/
