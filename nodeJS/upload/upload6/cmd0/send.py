#python test2.py 2 test.ico
import sys
import os
address=str(sys.argv[1])
path0=os.getcwd()
fileName=path0+"\\"+str(sys.argv[2])
os.chdir('D:')
os.chdir('/')
os.chdir("./upload5")
cmd="node send "+address+" "+fileName+" "+path0
print("cmd:",cmd)
os.system(cmd)
