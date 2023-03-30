from Viewpoint import Viewpoint
import os
import json
class ViewpointList: #所有视点,每个视点的可见特征
    def __init__(self,config):
        self.id=config["id"]
        self.data=self.initData()#database#["all"]
        self.data=self.removeRedundancy()
        
        self.componentIdMax=self.initComponentIdMax()
        self.feature_all0=self.initFeature0()#无用处
        self.componentDeAve=self.initComponentVisibilityAve()
        self.feature_all1=self.initFeature1()

        self.similarity_data=self.init_similarity_data()
        self.iswall=self.initIswall(
            config["getwall"]["threshold_entropy"],
            config["getwall"]["threshold_sim"])
        self.isdoor=self.initIsdoor(config["doorCid"])
        self.feature_all2=self.initFeature2(config['feature2coefficient'])

    def initData(self):
        id=self.id
        path_pre_in="F:/gitHubRepositories/vk-precompute-main/output"+str(id)#+"_new"
        if len(path_pre_in.split("_new"))==2:print("load2")
        else:print("load")
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
        c=self.configCLoad()["createSphere"]
        for x in rang(c["x"][0],c["x"][1],c["x"][2]):
            for y in rang(c["y"][0],c["y"][1],c["y"][2]):
                for z in rang(c["z"][0],c["z"][1],c["z"][2]):
                    name=str(x)+","+str(y)+","+str(z)
                    database2[name]=database[name]
        return database2
    def initFeature0(self):
        feature_all0={}
        for idv in self.data:
            feature_all0[idv]=self.data[idv].getFeature0(self.componentIdMax)
        return feature_all0
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
    def initFeature1(self):
        feature_all1={}
        for idv in self.data:
            feature_all1[idv]=self.data[idv].getFeature1(self.componentIdMax,self.componentDeAve)
        return feature_all1
    def initFeature2(self,feature2coefficient):
        feature_all2={}
        for idv in self.data:
            feature_all2[idv]=self.data[idv].getFeature2(self.iswall,self.isdoor,feature2coefficient)#(self.componentIdMax,self.componentDeAve)
        return feature_all2
    
    def configCLoad(self):
        path="../config/config"+str(self.id)+".json"
        self.c_all=json.load(open(path, 'r'))
        self.c=self.c_all["src"]["Building_new"]#["createSphere"]
        return self.c
    def configCSave(self):
        self.c_all["src"]["Building_new"]=self.c
        path="../config/config"+str(self.id)+".json"
        json.dump(self.c_all, open(path, 'w'), indent=4 )
        json.dump(self.c_all, open("../config/config.json", 'w'), indent=4 )

    def initIswall(self,threshold_entropy,threshold_sim):#需要先计算完视点的可见特征
        print("[threshold_entropy,threshold_sim]:",threshold_entropy,threshold_sim)#第一个阈值的用处不大，主要是第二个阈值在起作用
        iswall={}
        cidMax=self.componentIdMax
        for cid in range(cidMax+1):#遍历所有构件
            iswall[cid]=False
            vidList=[]
            for vid in self.data:
                d=self.data[vid].data["all"]
                if str(cid) in d:#如果视点vid能够看到构件cid
                    if not d[str(cid)]==0:
                        if self.data[vid].getEntropy1()>threshold_entropy:#1.7:#熵过小的视点很可能是构件内部的视点
                            vidList.append(vid)
            for i in range(len(vidList)):
                for j in range(len(vidList)):
                    if not i==j:
                        s=self.similarity(vidList[i],vidList[j])
                        if s<threshold_sim:iswall[cid]=True
        print("cidMax",cidMax)
        self.c["iswall"]=iswall
        return iswall
    def initIsdoor(self,doorCid):
        isdoor={}
        cidMax=self.componentIdMax
        for cid in range(cidMax+1):#遍历所有构件
            isdoor[cid]=False
        for cid in doorCid:
            isdoor[cid]=True
        return isdoor
    def init_similarity_data(self):
        v_feature_list=[]
        v_feature_list_tag={}
        i=0
        for vid in self.data:
            feature=self.feature_all1[vid]
            v_feature_list.append(feature)
            v_feature_list_tag[vid]=i
            i=i+1
        print("采样点的个数为:",i)
        self.v_feature_list    =v_feature_list
        self.v_feature_list_tag=v_feature_list_tag
        from sklearn.metrics.pairwise import cosine_similarity
        self.similarity_data=cosine_similarity(v_feature_list)
        print("完成计算关联度")
        return self.similarity_data
    
    def similarity(self,vid1,vid2):
        i1=self.v_feature_list_tag[vid1]
        i2=self.v_feature_list_tag[vid2]
        return self.similarity_data[i1][i2]# 计算余弦相似度
    def saveEntropy(self):
        database=self.data
        entropy_max=0
        name_max=""
        vd_max=None
        self.c["entropy"]={}
        for name in self.data:
            # print(name)
            entropy=database[name].getEntropy2()
            if entropy>entropy_max:
                entropy_max=entropy
                name_max=name
                vd_max=database[name]
            self.c["entropy"][name]=entropy   
        print("kernelPosition",name_max,"\n",entropy_max,"\n",vd_max.path)
        self.c["kernelPosition"]=name_max
        


