class VisibilityDegree:
    def __init__(self):
        self.name=""
        self.data={
            "all":{}
        }
        for i in range(6):
            self.data[str(i+1)]={}
        self.directionEncoded={
            "1 0 0":'1',
            "-1 0 0":'2',
            "0 1 0":'3',
            "0 -1 0":'4',
            "0 0 1":'5',
            "0 0 -1":'6'
        }
    def add(self,component,vd,direction):
        direction=self.directionEncoded[direction]
        for direction in [direction,"all"]:
            if component in self.data[direction]:
                self.data[direction][component]+=vd
            else:
                self.data[direction][component]=vd
    def load(self,path):
        f1 = open(path, "r", encoding="utf-8")
        lines = f1.readlines()
        pre="first"
        direction=""
        for line in lines:
            arr = line.split("\n") #去除每一行记录的尾部
            if arr[0]=="":
                pre=""
            elif pre=="first":
                name=arr[0]
                name=name.split(" ")
                self.name=name[0]+","+name[1]+","+name[2]
                pre=""
            elif pre=="":
                direction=arr[0]
                pre="direction"
            elif pre=="direction":
                component=arr[0].split(' ')[0]
                vd       =arr[0].split(' ')[1]
                self.add(component,float(vd),direction)
    def load2(self,path):
        arr=path.split("/")
        name=arr[len(arr)-1].split(".json")[0]
        # print(name)
        self.name=name
        import json
        with open(path, 'r') as f:
            json_data = json.load(f)
            self.data=json_data
            all={}
            # print(path)
            for direction in self.data:
                d=self.data[direction]
                for componetId in d:
                    if componetId in all:
                        all[componetId]+=d[componetId]
                    else:
                        # print(type(componetId))
                        # print(componetId)
                        # print(d)
                        # print(d[componetId])
                        all[componetId]=d[componetId]
            self.data["all"]=all
    def save(self,path_pre):
        import json
        json_str = json.dumps(self.data)
        with open(path_pre+"/"+self.name+".json", 'w') as f:
            f.write(json_str)
    def getEntropy(self):
        probabilities=[]
        sum=0
        for i in self.data["all"]:
            d=self.data['all'][i]
            sum+=d
            probabilities.append(d)
        for i in range(len(probabilities)):
            probabilities[i]/=sum
        import math
        entropy = 0
        for p in probabilities:
            entropy += -p * math.log2(p)
        self.entropy=entropy
    def getComponentNumber(self):
        return len(self.data["all"].keys())
def read(path):
    import json
    # 打开JSON文件
    with open(path, 'r') as f:
        json_data = json.load(f)
        return json_data
import sys
id=sys.argv[1]
import os
path_pre_in="F:/gitHubRepositories/vk-precompute-main/output"+str(id)#+"_new"
if len(path_pre_in.split("_new"))==2:print("load2")
else:print("load")
file_list=os.listdir(path_pre_in)
database={}
for file_name in file_list:
    path=path_pre_in+"/"+file_name
    v=VisibilityDegree()
    if len(path_pre_in.split("_new"))==2:v.load2(path)#v.load(path)
    else                                :v.load(path)
    v.getEntropy()
    v.path=path
    # v.save(".")
    database[v.name]=v
    # print(file_name,"\t",v.name,"\t",v.entropy,"\t",v.getComponentNumber())

config=read("../config/config"+str(id)+".json")
c=config["src"]["Building_new"]["createSphere"]
import sys
entropy_max=sys.float_info.min
name_max=""
vd_max=None
def rang(start,end,step):
    arr=[]
    i=start
    while i<=end:
        arr.append(i)
        i+=step
    return arr
for x in rang(c["x"][0],c["x"][1],c["x"][2]):
    for y in rang(c["y"][0],c["y"][1],c["y"][2]):
        for z in rang(c["z"][0],c["z"][1],c["z"][2]):
            name=str(x)+","+str(y)+","+str(z)
            # print(name,"/n",database[name])
            entropy=database[name].entropy
            # print(name,"\t",entropy,"\t",database[name].getComponentNumber())
            if entropy>entropy_max:
                entropy_max=entropy
                name_max=name
                vd_max=database[name]
print("id:",id)      
print("kernelPosition",name_max,"\n",entropy_max,"\n",vd_max.path)
path="../config/config"+str(id)+".json"

import json
config=read(path)
config["src"]["Building_new"]["kernelPosition"]=name_max
config["src"]["Building_new"]["entropy"]={}
for name in database:
    config["src"]["Building_new"]["entropy"][name]=database[name].entropy
json.dump(config, open(path, 'w'), indent=4 )
