
from FeatureAll import FeatureAll
import numpy as np
class ExtractorWall: #所有视点,每个视点的可见特征
    def __init__(self,loader0,loader1,threshold):
        self.componentIdMax=loader0.componentIdMax-2
        self.data=loader0.data
        dim0=1+loader0.componentIdMax-2
        dim1=1+loader1.componentIdMax
        f1=FeatureAll(loader1).toSplice(dim0,dim1-dim0)
        # self.entropy=FeatureAll(loader1).toSplice(0,dim0).getEntropy()#
        self.entropy=f1.getEntropy()
        
        self.init_difference(f1,threshold)
        self.initIswall(threshold)

    def init_difference(self,f,threshold):
        v_list=[]
        v_feature_list=[]
        v_feature_list_tag={}
        i=0
        for vid in f.featureAll:
            feature=f.featureAll[vid]
            v_list.append(vid)
            v_feature_list.append(np.array(feature))
            v_feature_list_tag[vid]=i
            i=i+1
        # print("采样点的个数为:",i)
        self.v_feature_list_tag=v_feature_list_tag
        difference=[]
        for i1 in range(len(v_feature_list)):
            difference.append([])
            for i2 in range(len(v_feature_list)):
                d=0
                if i1<i2:
                    name1=v_list[i1].split(",")
                    name2=v_list[i2].split(",")
                    p1=[float(name1[0]),float(name1[1]),float(name1[2])]
                    p2=[float(name2[0]),float(name2[1]),float(name2[2])]
                    position_distance_square=(p1[0]-p2[0])**2+(p1[1]-p2[1])**2+(p1[2]-p2[2])**2
                    if position_distance_square< (threshold["threshold_distance"]**2):
                        # d = np.linalg.norm(v_feature_list[i1] -v_feature_list[i2])#欧式距离
                        # d=d/( np.linalg.norm(v_feature_list[i1])+np.linalg.norm(v_feature_list[i2]) )
                        v1=v_feature_list[i1]
                        v2=v_feature_list[i2]
                        
                        n=np.linalg.norm(v1)*np.linalg.norm(v2)
                        if n==0:
                            if np.dot(v1, v2)==0:
                                cosine=0
                            else:
                                cosine=1
                        else:
                            cosine = np.dot(v1, v2) / n
                        # if np.dot(v1, v2)==0:
                        #     print("0:",v1,v2,cosine)
                        if i1==116 and i2==118:
                            print("116,118",cosine,"np.dot(v1, v2)",np.dot(v1, v2))
                            print()
                        # if cosine==0:
                        #     print("0:",v1,v2)
                        # if cosine<0.5:
                        #     print(v1,v2,cosine)
                        if cosine>1:cosine=1
                        if cosine<0:cosine=0
                        d=1-cosine
                        # print(d)
                difference[i1].append(d)
        for i1 in range(len(v_feature_list)):
            for i2 in range(len(v_feature_list)):
                if i1>=i2:
                    difference[i1][i2]=difference[i2][i1]
        self.difference=difference
        ##########
        # name1="-101000,2286.5,8000"
        # name2="-101000,2286.5,12000"
        # x=f.featureAll[name1]
        # y=f.featureAll[name2]
        # print(
        #     np.dot(np.array(x), np.array(y))
        # )
        # print(
        #     self.v_feature_list_tag[name1],
        #     self.v_feature_list_tag[name2]
        # )
        # d=self.getDifference(name1,name2)
        # print("d",d)
    def getDifference(self,vid1,vid2):
        i1=self.v_feature_list_tag[vid1]
        i2=self.v_feature_list_tag[vid2]
        return self.difference[i1][i2]
    def initIswall(self,threshold):#(self,threshold_entropy,threshold_sim):#需要先计算完视点的可见特征
        print(threshold)#第一个阈值的用处不大，主要是第二个阈值在起作用
        iswall={}
        cidMax=self.componentIdMax
        for cid in range(cidMax+1):#遍历所有构件
            iswall[cid]=False
            vidList=[]
            for vid in self.data:
                d=self.data[vid].data["all"]
                if str(cid) in d:#如果视点vid能够看到构件cid
                    if not d[str(cid)]==0:
                        
                        if self.entropy[vid]>threshold["threshold_entropy"]:#1.7:#熵过小的视点很可能是构件内部的视点
                            vidList.append(vid)
                        # else:print( "熵较小的视点:",self.entropy[vid] ,vid)
                        if vid=="79000,2286.5,2000":print("entropy,79000,2286.5,2000:",self.entropy[vid])
            for i in range(len(vidList)):
                for j in range(len(vidList)):
                    if self.getDifference(vidList[i],vidList[j])>=threshold["threshold_difference"]:
                        iswall[cid]=True
        self.iswall=iswall
        wallNumber=0
        for cid in iswall:
            if iswall[cid]:wallNumber+=1
        print("墙壁构件的个数为:",wallNumber)
        return iswall
    @staticmethod
    def getWall(loader_ceiling,loaderList,threshold):
        iswallList=[]
        for loader_addSphere in loaderList:
            iswall=ExtractorWall(loader_ceiling,loader_addSphere,threshold).iswall
            iswallList.append(iswall)
        iswall0=iswallList[0]
        for iswall in iswallList:
            for vid in iswall:
                if iswall[vid]:iswall0[vid]=True
        number=0
        for vid in iswall0:
            if iswall0[vid]:
                number+=1
        print("墙壁构件的总个数为:",number)
        return iswall0
