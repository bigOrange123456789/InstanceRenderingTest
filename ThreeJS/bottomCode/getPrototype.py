import os
#文件处理
import shutil
def move(url,path):
    if os.path.isfile(url):
        path0,name0=os.path.split(url)
        if not os.path.exists(path):
            os.makedirs(path)
        shutil.move(url,os.path.join(path, name0))
def copy(url,path):
    if os.path.isfile(url):
        path0,name0=os.path.split(url)
        if not os.path.exists(path):
            os.makedirs(path)
        shutil.move(url,os.path.join(path, name0))
def delete(url):
    if os.path.isdir(url):
        for file in os.listdir(url):
            delete(os.path.join(url,file))
        os.removedirs(url)
    elif os.path.isfile(url):
        os.remove(url)#os.unlink(url)
def find(dir_path):
    for file in os.listdir(dir_path):
        filepath=os.path.join(dir_path,file)
        if os.path.isdir(filepath):
            find(filepath)
        else:
            print(filepath)#file_list.append(filepath)
#3D模型
import meshio
def ply2obj():#格式转换
  for i in os.listdir("input"):
    name=i.split(".")[0]
    mesh = meshio.read("./input/"+name+".ply")
    mesh.write("./output/"+name+".obj", file_format="obj")
def getN(vertices,faces):#计算面法线
    ns=[]
    for f in faces:
        [v1, v2, v3] = f
        x1, y1, z1 = vertices[v1]#获取3个点的坐标
        x2, y2, z2 = vertices[v2]
        x3, y3, z3 = vertices[v3]
        p1 = np.array([x1, y1, z1])
        p2 = np.array([x2, y2, z2])
        p3 = np.array([x3, y3, z3])
        n=np.cross(p1-p2, p2-p3)
        l=np.dot(n,n)**0.5
        ns.append((n/l).tolist())
    return ns
#excel
def excel0():
    import xlrd #xls文件的read
    book0 = xlrd.open_workbook("in.xlsx")
    sheet0 = book0.sheet_by_name("Sheet1")
    import xlwt #xls文件的write
    book = xlwt.Workbook(encoding='utf-8')  #创建一个excel文件
    sheet = book.add_sheet('Sheet1',cell_overwrite_ok=True) #新增一个sheet工作表
    #sh.row_values(1) 获取第一行数据
    for i in range(0,sheet0.nrows):
        for j in range(0,sheet0.ncols):
            cell_value = sheet0.cell_value(i,j)
            sheet.write(i,j,float(cell_value))
    book.save('out.xlsx') #保存
#csv文件
def csv0():
    import pandas as pd
    data= pd.read_csv('test.csv')#读
    data.to_csv('test.csv')#写
#json
def json0():
    f1=open("./json/test.json","r")
    f2=open("./json/test.json","w")
    import json
    j=json.load(f1)
    json.dump(j,f2)#dump倾倒
#txt
def txt0():
    f1 = open('**',"r",encoding="utf-8")
    f2 = open('**',"w",encoding="utf-8")
    lines = f1.readlines()
    f2.write( ''.join(lines))

#开始
def copy(url,path):
    if os.path.isfile(url):
        path0,name0=os.path.split(url)
        if not os.path.exists(path):
            os.makedirs(path)
        shutil.move(url,os.path.join(path, name0))
def find0(dir_path):
    for file in os.listdir(dir_path):
        filepath=os.path.join(dir_path,file)
        if os.path.isdir(filepath):
            find0(filepath)
        else:
            filepath0="./src0"+filepath.split("./src1")[1]
            #os.remove(filepath1)
            shutil.copy(filepath0,filepath)
            print(filepath0)#file_list.append(filepath)
find0("./src1")



