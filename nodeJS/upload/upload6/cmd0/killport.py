import sys #获取输入参数
import os #使用命令行
port=sys.argv[1]
r = os.popen("netstat -ano | findstr "+port)
text = r.read()
arr=text.split("\n")
print("进程个数为：",len(arr)-1)
for text0 in arr:
    arr2=text0.split(" ")
    if len(arr2)>1:
        pid=arr2[len(arr2)-1]
        os.system("taskkill /PID "+pid+" /T /F")
        print(pid)
r.close()
