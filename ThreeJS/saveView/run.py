# -*- coding: utf-8 -*-
from flask import Flask,request,render_template
import base64
app = Flask(__name__)

@app.route('/')
def index():
    data=render_template('index.html')
    data.replace('src="../','src="')
    return data
@app.route('/getList')
def getList():
    import os
    arr=os.listdir("./static/input")
    str = ','.join(i for i in arr)
    print(str)
    return str
@app.route('/saveImg')
def saveImg():
    data = request.args.get('text')#无法处理加号
    data=data.replace(",","+")
    name = request.args.get('name').split(".")[0]
    with open('static/output/'+name+'.jpg','wb') as f:
            f.write(base64.b64decode(data))
    return "success!"

app.run()
