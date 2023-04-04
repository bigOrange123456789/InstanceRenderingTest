class Viewpoint:#单个视点的可见度信息
    def __init__(self):
        self.name=None
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
        self.position=None
        self.feature0=None
        self.feature0_1=None
        self.feature1=None
        self.feature2=None
        self.entropy0=None
        self.entropy1=None
        self.entropy2=None
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
                self.position=[float(name[0]),float(name[1]),float(name[2])]
                # if self.name=="-49000,2286.5,6000":
                #     print(path)
                #     exit(0)
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
    def getFeature0(self,componentIdMax):
        if self.feature0==None:
            feature=[]
            d=self.data["all"]
            for idc in range(componentIdMax+1):
                if str(idc) in d:
                    feature.append(d[str(idc)])
                else: feature.append(0)
            self.feature0=feature
        return self.feature0
    def getFeature0_1(self,iswall,isdoor,feature0_1coefficient):
        if self.feature0==None:
            print("self.feature0==None")
            exit(0)
        if self.feature0_1==None:
            feature=[]
            for idc in range(len(self.feature0)):
                coe=1
                if isdoor[idc]:
                    coe=feature0_1coefficient["door"]
                elif iswall[idc]:
                    coe=feature0_1coefficient["wall"]
                else :
                    coe=feature0_1coefficient["inner"]
                if not coe==0:
                    feature.append(self.feature0[idc]*coe)
            self.feature0_1=feature
        return self.feature0_1
    def getFeature1(self,componentIdMax,componentDeAve):
        if self.feature1==None:
            feature=[]
            d=self.data["all"]
            for idc in range(componentIdMax+1):
                if str(idc) in d:
                    feature.append(d[str(idc)]/componentDeAve[idc])
                else: feature.append(0)
            self.feature1=feature
        return self.feature1
    def getFeature2(self,iswall,isdoor,feature2coefficient):
        if self.feature1==None:
            print("self.feature1==None")
            exit(0)
        if self.feature2==None:
            feature=[]
            for idc in range(len(self.feature1)):
                coe=1
                if isdoor[idc]:
                    coe=feature2coefficient["door"]
                elif iswall[idc]:
                    coe=feature2coefficient["wall"]
                else :
                    coe=feature2coefficient["inner"]
                if not coe==0:
                    feature.append(self.feature1[idc]*coe)
            self.feature2=feature
        return self.feature2
    def getFeature0_(self,iswall,isdoor,feature2coefficient):
            feature=[]
            for idc in range(len(self.feature1)):
                coe=1
                if isdoor[idc]:
                    coe=feature2coefficient["door"]
                elif iswall[idc]:
                    coe=feature2coefficient["wall"]
                else :
                    coe=feature2coefficient["inner"]
                if not coe==0:
                    feature.append(self.feature1[idc]*coe)
            return feature
    
    def getEntropy0(self):
        if not self.entropy0==None:
            return self.entropy0
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
        self.entropy0=entropy
        return self.entropy0
    def getEntropy1(self):
        if not self.entropy1==None:
            return self.entropy1
        probabilities=[]
        sum=0
        for d in self.feature1:
            if not d==0:
                sum+=d
                probabilities.append(d)
        for i in range(len(probabilities)):
            probabilities[i]/=sum
        import math
        entropy = 0
        for p in probabilities:
            entropy += -p * math.log2(p)
        self.entropy1=entropy
        return self.entropy1
    def getEntropy2(self):
        if not self.entropy2==None:
            return self.entropy2
        probabilities=[]
        sum=0
        for d in self.feature2:
            if not d==0:
                sum+=d
                probabilities.append(d)
        for i in range(len(probabilities)):
            probabilities[i]/=sum
        import math
        entropy = 0
        for p in probabilities:
            entropy += -p * math.log2(p)
        self.entropy2=entropy
        return self.entropy2




