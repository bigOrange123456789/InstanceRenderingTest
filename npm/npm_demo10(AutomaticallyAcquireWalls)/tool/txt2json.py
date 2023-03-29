from VisibilityDegree import VisibilityDegree
# class ViewpointCorrelation:
#     def __init__(self):
#         print()
# class ComponentFeature:
#     def __init__(self,database):
#         self.data=database["all"]
#         self.feature_all={}
#     def getFeature(self,id):
#         if not id in self.feature_all:
#             #return self.feature_all[id]
#             feature=[]
#             for viewpoint in self.data:
#                 d=self.data[viewpoint]
#                 if id in d:feature.append(d[id])
#                 else:feature.append(0)
#             self.feature_all[id]=feature
#         return self.feature_all[id]
#     def getIdMax(self):
#         idMax=-1
#         for viewpoint in self.data:
#             d=self.data[viewpoint]
#             for id in d:
#                 if id>idMax:idMax=id
#         return idMax
from ViewpointFeature import ViewpointFeature
import sys
if __name__ == "__main__":#用于测试
    id=sys.argv[1]
    database=VisibilityDegree.getAllVisibilityDegree(id)
    VisibilityDegree.saveEntropy(id,database)
    VisibilityDegree.computeVVF(database)
    print("正在判断哪些构件是墙构件")
    iswall=ViewpointFeature(database).getWallComponent(1.7,0.0005) #threshold_entropy,threshold_sim
    import json
    path="../config/config"+str(id)+".json"
    config=json.load(open(path, 'r'))
    config["src"]["Building_new"]["iswall"]=iswall
    json.dump(config, open(path, 'w'), indent=4 )
    json.dump(config, open("../config/config.json", 'w'), indent=4 )
    


