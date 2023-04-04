from Viewpoint import Viewpoint
import os
import json
class Loader: #所有视点,每个视点的可见特征
    def __init__(self,path_pre_in,id):
        self.id=id
        self.data=self.initData(path_pre_in)
        self.c_all=self.configCLoad()
        self.data=self.removeRedundancy()
        self.componentIdMax=self.initComponentIdMax()
        self.componentDeAve=self.initComponentVisibilityAve()
    def initData(self,path_pre_in):
        # path_pre_in="F:/gitHubRepositories/vk-precompute-main/output"+str(id)#+"_new"
        # if len(path_pre_in.split("_new"))==2:print("load2")
        # else:print("load")
        file_list=os.listdir(path_pre_in)
        database={}
        for file_name in file_list:
            path=path_pre_in+"/"+file_name
            v=Viewpoint()
            if len(path_pre_in.split("_new"))==2:v.load2(path)#v.load(path)
            else                                :v.load(path)
            # v.getEntropy()
            v.path=path
            database[v.name]=v
        return database#database的冗余去除
    def removeRedundancy(self):
        database=self.data
        def rang(i,end,step):
            arr=[]
            while i<=end:
                arr.append(i)
                i+=step
            return arr
        database2={}
        c=self.c_all["src"]["Building_new"]["createSphere"]
        for x in rang(c["x"][0],c["x"][1],c["x"][2]):
            for y in rang(c["y"][0],c["y"][1],c["y"][2]):
                for z in rang(c["z"][0],c["z"][1],c["z"][2]):
                    name=str(x)+","+str(y)+","+str(z)
                    database2[name]=database[name]
        return database2
    def initComponentIdMax(self):
        idMax=-1
        for viewpoint in self.data:
            d=self.data[viewpoint].data["all"]
            for cid in d:
                if int(cid)>idMax:idMax=int(cid)
        return idMax
    def initComponentVisibilityAve(self):#获取构件可见度的平均值
        cvAve=[]
        for cid in range(self.componentIdMax+1):
            sum=0
            number=0
            for vid in self.data:
                d=self.data[vid].data["all"]
                if str(cid) in d:
                    sum=sum+d[str(cid)]
                    number=number+1
            if number==0:cvAve.append(0)
            else        :cvAve.append(sum/number)
        return cvAve
    def configCLoad(self):
        path="../config/config"+str(self.id)+".json"
        self.c_all=json.load(open(path, 'r'))
        self.c=self.c_all["src"]["Building_new"]#["createSphere"]
        return self.c_all
    def configCSave(self):
        self.coarseVVD()
        self.coarseIsdoor()
        self.coarseIswall()
        json.dump(
            self.c_all["src"]["SamplePointList"]["vvd"], 
            open(
            "../dist/assets/configVVD.json", # "../config/configVVD.json", 
            'w'))
        self.c_all["src"]["SamplePointList"]["vvd"]={}
        self.c_all["src"]["Building_new"]=self.c
        path="../config/config"+str(self.id)+".json"
        json.dump(self.c_all, open(path, 'w'), indent=4 )
        json.dump(self.c_all, open("../config/config.json", 'w'))

        json.dump(self.c_all, open(path, 'w'), indent=4 )
    def saveVVD(self):
        vvd={}
        for vid in self.data:
            vvd[vid]=self.data[vid].data
        self.c_all["src"]["SamplePointList"]["vvd"]=vvd
    def savePVD(self,pvd):
        f=pvd.f.featureAll
        for vid in self.c_all["src"]["SamplePointList"]["vvd"]:
            pvd0={}
            for cid in range(self.componentIdMax+1):
                if not f[vid][cid]==0:
                    pvd0[cid]=f[vid][cid]
            # print(self.c_all["src"]["SamplePointList"]["vvd"]["vid"])
            self.c_all["src"]["SamplePointList"]["vvd"][vid]["pvd"]=pvd0
    def coarseVVD(self):
        vvd=self.c_all["src"]["SamplePointList"]["vvd"]
        for vid in vvd:
            for direction in vvd[vid]:
                for cid in vvd[vid][direction]:
                    d=vvd[vid][direction][cid]
                    vvd[vid][direction][cid]=float('{:.3e}'.format(d))
    def coarseIsdoor(self):
        isdoor=self.c_all["src"]["Building_new"]["isdoor"]
        for cid in isdoor:
            if type(isdoor[cid])==type(True):
                if isdoor[cid]:isdoor[cid]=1
                else          :isdoor[cid]=0
    def coarseIswall(self):
        iswall=self.c_all["src"]["Building_new"]["iswall"]
        for cid in iswall:
            if iswall[cid]:iswall[cid]=1
            else          :iswall[cid]=0


        