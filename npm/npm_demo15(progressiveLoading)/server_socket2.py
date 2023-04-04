import json
def getJson(path):
    try:
        return json.load(
            open(path,"r")
        )
    except Exception as e:
        print("无法解析的json文件:",path,e)


#################################加载json文件############################################
scene_names=["huayi_113"]#["huayi_133","huayi_113"]
data={}
data_scene0={}
scene_name0=""
def finish():
    print("finish")
def load0(index):
  fileName = 'dist/assets/visibility/'+scene_name0+'/['+str(index)+']7.ls_d_index.json'
  print(fileName)
  jsonData = getJson(fileName)
  data_scene0[str(index)]=jsonData
  if(index+1<=6):load0(index+1)
for name in scene_names:
    scene_name0=name
    load0(1)
    data[name]=data_scene0

#################################建立服务器############################################
from flask import Flask
from flask import request
app=Flask(__name__)

# 跨域支持
def after_request(resp):
    resp.headers['Access-Control-Allow-Origin'] = '*'
    #print(resp.headers['config']['level'])#INFO
    # resp.headers['config']['level']='DEBUG'
    return resp
app.after_request(after_request)

@app.route("/")
def process():
    sceneName=request.args.get('sceneName')
    index=request.args.get('text')#解析地址栏
    data0={}
    if sceneName in data:
        for i in range(6):
            i=str(i+1)
            if(index in data[sceneName][i]):list=data[sceneName][i][index]
            else:list=[]
            data0[i]=list
    return {'index':index,'data0':data0}

if __name__=="__main__":
    
    print(app.url_map)
    app.run(host="0.0.0.0", port=int("5000"))# app.run(host="0.0.0.0", port=int("5000"), debug=True)# app.run()