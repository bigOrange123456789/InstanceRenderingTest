class ViewpointFeature: #所有视点,每个视点的可见特征
    def __init__(self,database):
        self.data=database#["all"]
        self.feature_all={}
        self.componentIdMax=self.getComponentIdMax()
        self.cvAve=self.getComponentVisibilityAve()
        self.similarity_data=""
    def getComponentIdMax(self):
        idMax=-1
        for viewpoint in self.data:
            d=self.data[viewpoint].data["all"]
            for cid in d:
                if int(cid)>idMax:idMax=int(cid)
                # print("cid",cid)
        print("idMax",idMax)
        # exit(0)
        return idMax
    def getComponentVisibilityAve(self):#获取构件可见度的平均值
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
    def getFeature(self,idv):#获取视点的可见特征 #id是视点名称
        if not idv in self.feature_all:
            feature=[]
            # print(idv)
            d=self.data[idv].data["all"]
            for idc in range(self.componentIdMax+1):
                if str(idc) in d:
                    feature.append(d[str(idc)]/self.cvAve[idc])#如果d中有对应信息 cvAve就不会为0
                else: feature.append(0)
            self.feature_all[idv]=feature
        return self.feature_all[idv]
    def getWallComponent(self,threshold_entropy,threshold_sim):#需要先计算完视点的可见特征
        print("[threshold_entropy,threshold_sim]:",threshold_entropy,threshold_sim)#第一个阈值的用处不大，主要是第二个阈值在起作用
        self.init_similarity_data()
        iswall={}
        cidMax=self.getComponentIdMax()
        for cid in range(cidMax+1):#遍历所有构件
            iswall[cid]=False
            vidList=[]
            for vid in self.data:
                d=self.data[vid].data["all"]
                if str(cid) in d:#如果视点vid能够看到构件cid
                    if not d[str(cid)]==0:
                        if self.data[vid].entropy>threshold_entropy:#1.7:#熵过小的视点很可能是构件内部的视点
                            vidList.append(vid)
            for i in range(len(vidList)):
                for j in range(len(vidList)):
                    if not i==j:
                        s=self.similarity(vidList[i],vidList[j])
                        if s<threshold_sim:iswall[cid]=True
        print("cidMax",cidMax)
        # import json
        # json.dump(iswall, open("iswall.json", 'w'), indent=4 )
        return iswall
    def init_similarity_data(self):
        v_feature_list=[]
        v_feature_list_tag={}
        i=0
        for vid in self.data:
            feature=self.getFeature(vid)
            v_feature_list.append(feature)
            v_feature_list_tag[vid]=i
            i=i+1
        print(i)
        self.v_feature_list    =v_feature_list
        self.v_feature_list_tag=v_feature_list_tag
        from sklearn.metrics.pairwise import cosine_similarity
        self.similarity_data=cosine_similarity(v_feature_list)
        print("完成计算关联度")
    def similarity(self,vid1,vid2):
        i1=self.v_feature_list_tag[vid1]
        i2=self.v_feature_list_tag[vid2]
        # print(i1,i2)
        return self.similarity_data[i1][i2]# 计算余弦相似度


