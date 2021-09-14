f1=open("./result.json","r")
import json
j=json.load(f1)

#获取数据
result={}
for i in j:
    number=i["number"]
    result[number]=[]
for i in j:
    number=i["number"]
    time=i["time"]
    result[number].append(time)

#计算平均值
result2=[]
for i in result:
    arr=result[i]
    ave=0
    for a in arr:
        ave=ave+a
    ave=ave/len(arr)
    result2.append({
        "number":i,
        "time":ave
    })

#排序
def sort0(obj):
    for i1 in range(len(obj)):
        i1=len(obj)-i1-1
        max=i1
        for i2 in range(i1):
            if obj[i2]["number"]>obj[max]["number"]:
                max=i2
        temp=obj[max]
        obj[max]=obj[i1]
        obj[i1]=temp
    return obj
sort0(result2)

#绘图
x=[]
y=[]
for i in result2:
    if i["number"]>2:
        x.append(i["number"])
        y.append(i["time"]/1000)
print(x)
import matplotlib.pyplot as plt
plt.plot(x, y)
plt.xlabel("Number of people")
plt.ylabel("Time(second)")
plt.title('Time the connection was established')
plt.show()

