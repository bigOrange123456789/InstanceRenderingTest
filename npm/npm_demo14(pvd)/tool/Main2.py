# from ViewpointList import ViewpointList
from Loader import Loader
from PVD import PVD
from ExtractorWall import ExtractorWall
import sys
import json
class Main: #所有视点,每个视点的可见特征
    def __init__(self,config):

        id=config["id"]
        loader0=Loader("F:/gitHubRepositories/vk-precompute-main/output"+str(id),id)
        # loader0.c_all["src"]["Building_new"]["entropy"]={}
        loader0.saveVVD()
        loader0.c_all["src"]["Building_new"]
        loader_addSphere=Loader("F:/gitHubRepositories/vk-precompute-main/output"+str(id)+"_1",id)
        loader_ceiling=Loader("F:/gitHubRepositories/vk-precompute-main/output"+str(id)+"_2",id)
        loader_shifting=Loader("F:/gitHubRepositories/vk-precompute-main/output"+str(id)+"_shifting",id)
        iswall=ExtractorWall.getWall(
            loader_ceiling,
            [loader_addSphere,loader_shifting] ,
            config['getwall']
        )
        isdoor=loader0.c_all["src"]["Building_new"]["isdoor"]
        loader0.savePVD(PVD(
            loader0,
            loader_ceiling,
            iswall,
            isdoor))

        loader0.configCSave()        
        

        
    def blocking(self):
        v_feature_list=[]
        v_feature_list_tag={}
        v_feature_list_tag_inv={}
        i=0
        for vid in self.featureAllB:
            feature=self.featureAllB[vid]
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
        # print("feature_all",feature_all)
        result={}
        print("len(v_feature_list)",len(v_feature_list))
        for i in range(len(v_feature_list)):
            f0=v_feature_list[i]
            vid=v_feature_list_tag_inv[i]
            name=''.join(str(i0) for i0 in f0)
            result[vid]=feature_all[name]
            # if feature_all[name]!=1:print(name)
        # self.c["blocking"]=result
        return result   
            
    def blocking2(self,k):
        v_feature_list=[]
        v_feature_list_tag={}
        v_feature_list_tag_inv={}
        i=0
        for vid in self.featureAllA:
            feature=[]
            featureA=self.featureAllA[vid]
            featureB=self.featureAllB[vid]
            # for j in range(len(featureA)):
            #     a=featureA[j]
            #     b=featureB[j]
            #     if not b==0:b=1
            #     feature.append(a+b)
            for j in range(len(featureA)):
                a=featureA[j]
                feature.append(a)
            for j in range(len(featureB)):
                b=featureB[j]
                if not b==0:b=1
                feature.append(b)
            for j in range(3):
                pos=int(vid.split(",")[j])
                feature.append(pos/100)

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
        for i in range(4000): # 首先利用广播机制计算每个样本到簇中心的距离，之后根据最小距离重新归类
            classifications = np.argmin(((data[:, :, None] - centers.T[None, :, :])**2).sum(axis=1), axis=1)#计算每个元素最近的质心
            new_centers = np.array([data[classifications == j, :].mean(axis=0) for j in range(k)])# 对每个新的簇计算簇中心
            if (new_centers == centers).all():
                print("聚类结果已经收敛")
                break# 簇中心不再移动的话，结束循环
            else: centers = new_centers
        classlist=classifications[:, None].tolist()
        result={}
        for i in range(len(classlist)):
            vid=v_feature_list_tag_inv[i]
            result[vid]=classlist[i][0]
        return result# return  centers.tolist(), classifications[:, None].tolist()#return  centers.tolist(), classifications.tolist()
    
    def getKernelView(self,feature_all1,feature_all2):
        block2Kernel={}
        for vID in self.block:
            blockID=str(self.block[vID])
            # print(blockID,type(blockID))
            block2Kernel[blockID]=None
        for blockID in block2Kernel:
            entropyMax=0
            for vID in self.block:
                if str(self.block[vID])==blockID:
                    entropy=0.5*self.entropy(feature_all1[vID])+0.5*self.entropy(feature_all2[vID])#+self.entropy(feature_all3[vID])
                    if entropy>entropyMax:
                        entropyMax=entropy
                        block2Kernel[blockID]=vID
        self.block2Kernel=block2Kernel
        print("block2Kernel:",block2Kernel)
        return block2Kernel
    
    def entropy(self,feature):
        probabilities=[]
        sum=0
        for d in feature:
            if d>0:
                sum+=d
                probabilities.append(d)
        for i in range(len(probabilities)):
            probabilities[i]/=sum
        import math
        entropy = 0
        for p in probabilities:
            entropy += -p * math.log2(p)
        return entropy
    def getKVCG(self,featureAll):
        i=0
        featureList=[]
        for blockId in self.block2Kernel:
            kv=self.block2Kernel[blockId]
            print("id:",blockId,"\tposition:",kv)#print(i,blockId,kv)
            featureList.append(featureAll[kv])
            i=i+1
        from sklearn.metrics.pairwise import cosine_similarity
        similarity=cosine_similarity(featureList)
        print("similarity:\n",similarity)
        from tabulate import tabulate
        print(tabulate(similarity))
        return similarity
if __name__ == "__main__":#用于测试
    config=json.load(open(sys.argv[1], 'r'))
    Main(config)