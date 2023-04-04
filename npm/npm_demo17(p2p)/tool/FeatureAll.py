import numpy as np
class FeatureAll: #所有视点,每个视点的可见特征
    def __init__(self,loader):
        self.dim=loader.componentIdMax+1
        self.componentDeAve=loader.componentDeAve
        self.featureAll=self.initFeature(loader.data)
    def initFeature(self,data):
        self.featureAll={}
        # self.idvList=[]
        # matrix=[]
        for idv in data:
            # self.idvList.append(idv)
            feature=[]
            d=data[idv].data["all"]
            for idc in range(self.dim):
                if str(idc) in d:
                    feature.append(d[str(idc)])
                else: feature.append(0)
            self.featureAll[idv]=feature
        #     matrix.append(feature)
        # self.matrix=np.array(matrix)
        return self.featureAll
    def getMatrix(self):
        self.idvList=[]
        self.matrix=[]
        for idv in self.featureAll:
            self.idvList.append(idv)
            self.matrix.append(self.featureAll[idv])
        #     if not len(self.featureAll[idv])==self.dim:
        #         print("not len(self.featureAll[idv])==self.dim",self.featureAll[idv])
        # print(self.matrix)
        self.matrix=np.array(self.matrix)
        # print(self.matrix)
        # print(self.matrix.ndim)
        return self.matrix
    def toPostion(self):
        self.featureAll={}
        for idv in self.featureAll:
            pos=idv.split(",")
            self.featureAll[idv]=[float(pos[0]),float(pos[1]),float(pos[2])]
        return self.featureAll
    def toSgn(self):
        for idv in self.featureAll:
            feature=self.featureAll[idv]
            for i in range(len(feature)):
                if feature[i]>0:feature[i]=1
                else           :feature[i]=0
        return self
    def toNormal(self):
        return self.applyVector(self.componentDeAve,"/")
    def toSplice(self,minCid,length):
        for idv in self.featureAll:
            feature1=self.featureAll[idv]
            feature2=[]
            for i in range(length):
                idC=minCid+i
                d=feature1[idC]
                feature2.append(d)
            self.featureAll[idv]=feature2
        return self
    def applyVector(self,vector,operation):
        for idv in self.featureAll:
            feature1=self.featureAll[idv]
            feature2=[]
            for idc in range(self.dim):
                d1=feature1[idc]
                v=vector[idc]
                if operation=='/':
                    if v==0:v=1
                    d2=d1/v
                else             :d2=d1
                feature2.append(d2)
            self.featureAll[idv]=feature2
        return self
    def getEntropy(self):
        entropyAll={}
        for idv in self.featureAll:
            feature=self.featureAll[idv]
            probabilities=[]
            sum=0
            for d in feature:
                if not d==0:
                    sum+=d
                    probabilities.append(d)
            for i in range(len(probabilities)):
                probabilities[i]/=sum
            import math
            entropy = 0
            for p in probabilities:
                entropy += -p * math.log2(p)
            entropyAll[idv]=entropy
        return entropyAll
    def mulMatrix(self,matrix):
        self.getMatrix()
        self.matrix=np.dot(self.matrix,np.array(matrix))
        i=0
        for vid in self.featureAll:
            self.featureAll[vid]=self.matrix[i,:].tolist()
            i=i+1
        return self
    def coarse(self):#保留四位有效数字
        for idv in self.featureAll:
            feature=self.featureAll[idv]
            for idc in range(self.dim):
                d=feature[idc]
                feature[idc]=float('{:.3e}'.format(d))