#python test2.py 2 test.ico
import sys
import os
os.chdir('D:')
os.chdir('/')
os.chdir("./upload5")

f1=open("./config.json","r")
import json
data=json.load(f1)["ip_list"]
for i in data:
    print(data[i],"\t",i)
