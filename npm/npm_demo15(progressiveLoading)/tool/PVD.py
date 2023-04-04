from FeatureAll import FeatureAll
import numpy as np
class PVD: #所有视点,每个视点的可见特征
    def __init__(self,loader0,loader_ceiling,iswall,isdoor):
        self.dim=1+loader0.componentIdMax#构件个数
        self.iswall=iswall
        self.isdoor=isdoor
        self.f=FeatureAll(loader0)
        self.CCD=self.initCCD(loader_ceiling)
        self.f.mulMatrix(self.CCD)
        # self.f.coarse()
    def initCCD(self,loader_ceiling):
        f=FeatureAll(loader_ceiling).toSplice(0,self.dim)
        m=f.getMatrix()
        CCD=[]
        for i1 in range(self.dim):
            CCD.append([])
            for i2 in range(self.dim):
                d=0
                if i1==i2:d=1
                # elif (self.iswall[i1] and not self.isdoor[str(i1)]):d=0
                elif (self.iswall[i2] and not self.isdoor[str(i2)]):d=0
                # elif i1<i2 :
                else:
                    featureC1=m[:, i1]
                    featureC2=m[:, i2]
                    n=np.linalg.norm(featureC1)*np.linalg.norm(featureC2)
                    if n==0:
                        d=0
                        # print("出现空的构件特征:",i1,"or",i2)
                    else:
                        d=np.dot(featureC1, featureC2) / n
                CCD[i1].append(d)
        for i1 in range(self.dim):
            for i2 in range(self.dim):
                if i1>i2:
                    CCD[i1][i2]=CCD[i2][i1]
        self.CCD=CCD
        return self.CCD