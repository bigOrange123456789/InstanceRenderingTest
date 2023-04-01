from Viewpoint import Viewpoint
import os
import json
class ViewpointList: #所有视点,每个视点的可见特征
    def __init__(self,config,getWall,path_pre_in,featureCoef):
        self.id=config["id"]
        self.data=self.initData(path_pre_in)#database#["all"]
        self.data=self.removeRedundancy()
        
        self.componentIdMax=self.initComponentIdMax()
        self.feature_all0  =self.initFeature0()
        self.componentDeAve=self.initComponentVisibilityAve()
        self.feature_all1=self.initFeature1()#数据归一化 #用于提取墙

        if getWall:
            self.similarity_data1=self.init_similarity_data1()
            self.iswall=self.initIswall(
                config["getwall"]["threshold_entropy"],
                config["getwall"]["threshold_sim"])
            self.isdoor=self.initIsdoor(config["doorCid"])

            self.feature_all0_1=self.initFeature0_1(featureCoef["0_1"])
            self.feature_all2=self.initFeature2(featureCoef["2"])

            self.similarity_data2=self.init_similarity_data2()
            # self.blocking(config["blocking"]["k"])

    def initData(self,path_pre_in):
        id=self.id
        # path_pre_in="F:/gitHubRepositories/vk-precompute-main/output"+str(id)#+"_new"
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
    def initFeature0_(self,feature2coefficient):
        feature_all={}
        for idv in self.data:
            feature_all[idv]=self.data[idv].getFeature0_(self.iswall,self.isdoor,feature2coefficient)
        return feature_all
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
    
    def initFeature0_1(self,feature0_1coefficient):
        feature_all0_1={}
        for idv in self.data:
            feature_all0_1[idv]=self.data[idv].getFeature0_1(self.iswall,self.isdoor,feature0_1coefficient)#(self.componentIdMax,self.componentDeAve)
        return feature_all0_1
    
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
                        s=self.similarity1(vidList[i],vidList[j])
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
    def init_similarity_data1(self):
        v_feature_list1=[]
        v_feature_list_tag1={}
        i=0
        for vid in self.data:
            feature=self.feature_all1[vid]
            v_feature_list1.append(feature)
            v_feature_list_tag1[vid]=i
            i=i+1
        print("采样点的个数为:",i)
        self.v_feature_list1    =v_feature_list1
        self.v_feature_list_tag1=v_feature_list_tag1
        from sklearn.metrics.pairwise import cosine_similarity
        self.similarity_data1=cosine_similarity(v_feature_list1)
        print("完成计算关联度")
        return self.similarity_data1
    def similarity1(self,vid1,vid2):
        i1=self.v_feature_list_tag1[vid1]
        i2=self.v_feature_list_tag1[vid2]
        return self.similarity_data1[i1][i2]# 计算余弦相似度
    def init_similarity_data2(self):
        v_feature_list2=[]
        v_feature_list_tag2={}
        i=0
        for vid in self.data:
            feature=self.feature_all2[vid]
            v_feature_list2.append(feature)
            v_feature_list_tag2[vid]=i
            i=i+1
        print("采样点的个数为:",i)
        self.v_feature_list2    =v_feature_list2
        self.v_feature_list_tag2=v_feature_list_tag2
        from sklearn.metrics.pairwise import cosine_similarity
        self.similarity_data2=cosine_similarity(v_feature_list2)
        print("完成计算关联度")
        return self.similarity_data2
    def similarity2(self,vid1,vid2):
        i1=self.v_feature_list_tag2[vid1]
        i2=self.v_feature_list_tag2[vid2]
        return self.similarity_data2[i1][i2]# 计算余弦相似度
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
        
    def blocking_old(self,k):
        v_feature_list=[]
        v_feature_list_tag={}
        v_feature_list_tag_inv={}
        i=0
        for vid in self.data:
            feature=self.feature_all2[vid]
            # pos=vid.split(",")
            # for j in range(3):
            #     feature.append(float(pos[j])*0.01)
            for j in range(len(feature)):
                # if feature[j]==0:
                #     feature[j]=-1000
                if feature[j]==0:
                    feature[j]=0
                else:
                    feature[j]=1
            # print(feature)
            v_feature_list.append(feature)
            v_feature_list_tag[vid]=i
            v_feature_list_tag_inv[i]=vid
            i=i+1
        print("采样点的个数为:",i)
        dataSet=v_feature_list
        import numpy as np
        data=np.array(dataSet)
        #k= 7#int(np.shape(dataSet)[0]/step)#质心个数
        step=int(np.shape(dataSet)[0]/k)
        centers = data[ (np.array(range(k))*step).tolist(),:]             #np.mat(np.zeros((k, n)))#用于存储所有质心
        for i in range(1500): # 首先利用广播机制计算每个样本到簇中心的距离，之后根据最小距离重新归类
            classifications = np.argmin(((data[:, :, None] - centers.T[None, :, :])**2).sum(axis=1), axis=1)#计算每个元素最近的质心
            new_centers = np.array([data[classifications == j, :].mean(axis=0) for j in range(k)])# 对每个新的簇计算簇中心
            if (new_centers == centers).all():break# 簇中心不再移动的话，结束循环
            else: centers = new_centers
        classlist=classifications[:, None].tolist()
        result={}
        for i in range(len(classlist)):
            vid=v_feature_list_tag_inv[i]
            result[vid]=classlist[i]
        self.c["blocking"]=result
        return result# return  centers.tolist(), classifications[:, None].tolist()#return  centers.tolist(), classifications.tolist()
    
    def blocking(self,k):
        v_feature_list=[]
        v_feature_list_tag={}
        v_feature_list_tag_inv={}
        i=0
        for vid in self.data:
            feature=self.feature_all2[vid]
            # pos=vid.split(",")
            # for j in range(3):
            #     feature.append(float(pos[j])*0.01)
            for j in range(len(feature)):
                # if feature[j]==0:
                #     feature[j]=-1000
                if feature[j]==0:
                    feature[j]=0
                else:
                    feature[j]=1
            # print(feature)
            v_feature_list.append(feature)
            v_feature_list_tag[vid]=i
            v_feature_list_tag_inv[i]=vid
            i=i+1
        feature_all={}
        
        id=0
        for f0 in v_feature_list:
            name=''.join(str(i) for i in f0)
            if not name in feature_all:
                feature_all[name]=id
                id=id+1
        print("feature_all",feature_all)
        result={}
        print("len(v_feature_list)",len(v_feature_list))
        for i in range(len(v_feature_list)):
            f0=v_feature_list[i]
            vid=v_feature_list_tag_inv[i]
            name=''.join(str(i0) for i0 in f0)
            result[vid]=feature_all[name]
            # if feature_all[name]!=1:print(name)
        self.c["blocking"]=result
        return result
