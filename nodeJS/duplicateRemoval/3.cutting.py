import bpy

class ModelProcessingTool:
    def __init__(self):
        self.batch()

    def __getObj():
        return bpy.data.objects;
    def batch(self):
        self.path="D:\\myModel3D\\3.gltf"
        self.names=[
	"ConferenceRoom0.gltf",
	"ConferenceRoom1.gltf",
            ]
        self.processOne(0);
        
    def opt(self):
        bpy.ops.object.select_all(action='SELECT')
        bpy.ops.object.mode_set(mode='EDIT')
        #bpy.ops.mesh.merge(type='CENTER')
        bpy.ops.mesh.remove_doubles()
        bpy.ops.object.mode_set(mode='OBJECT')
        
    def processOne(self,index):
        if index>=len(self.names):
            return;
        self.delete_all()#删除场景中的全部对象
        self.load_gltf(self.path,self.names[index])
        
        #激活全部对象
        for i in bpy.data.objects:#激活剩下的对象
            bpy.context.view_layer.objects.active=i;
        
        self.delete_noMesh()#删除非mesh对象
        #self.merge()
        #self.simplification_all(0.5)#输入网格的压缩比
        for i in bpy.data.objects:
            i.name=self.names[index];
            
        self.opt();#删除重复边
        self.separate('LOOSE');
        self.download("D:\\myModel3D\\4.0.split\\glb\\","glb");
        self.download("D:\\myModel3D\\4.0.split\\ply\\","ply");
        
        #下载
        #bpy.ops.export_mesh.ply(filepath="D:\\myModel3D\\4.ply\\"+name+".ply")

        #处理下一个
        self.processOne(index+1);

    def delete_all(self):
        bpy.ops.object.select_all(action='SELECT')
        bpy.ops.object.delete(use_global=False)
        #bpy.ops.object.delete()

    def merge(self):
        bpy.ops.object.select_all(action='DESELECT')#取消选择
        bpy.ops.object.select_by_type(type='MESH')#选中所有mesh对象
        bpy.ops.object.join()#合并

    def simplification_all(self,r):
        for obj in bpy.data.objects:
            if obj.type=="MESH":
                self.simplification(r,obj)
    def simplification(self,r,obj):
        obj.modifiers.new("dec", type = "DECIMATE")#decimate 毁灭#精简
        obj.modifiers["dec"].ratio = r
        bpy.ops.object.mode_set(mode='OBJECT')

        bpy.ops.object.modifier_apply(modifier='dec')

    def separate(self,type0):
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.separate(type=type0)#SELECTED  "LOOSE"
        bpy.ops.object.mode_set(mode='OBJECT')

    def reName(self):
        k0=0;
        for i in bpy.context.selectable_objects:
            if i.type == 'MESH':
                i.name =self.name+str(k0);# "改名网格物体"+i.name
                k0=k0+1;

    def delete_parent(self):
        bpy.ops.object.select_by_type(type='MESH')#选中所有mesh对象
        bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM')#(type='CLEAR')#清空所有mesh的父级关系

    def delete_noMesh(self):#只保留mesh类型的对象
        self.delete_parent()
        bpy.ops.object.select_all(action='DESELECT')#取消选择
        for i in bpy.context.selectable_objects:
            if not i.type == 'MESH':
                i.select_set(True)
        bpy.ops.object.delete()
        for i in bpy.data.objects:#激活剩下的对象
            bpy.context.view_layer.objects.active=i;

    def download(self,path,type):#https://blog.csdn.net/boy_love_sky/article/details/107697343
        import re
        import os
        for i in bpy.data.objects:
            if i.type=="MESH":
                bpy.ops.object.select_all(action='DESELECT')#取消之前的选中
                tpath = path + i.name + "."+type
                bpy.ops.object.select_pattern(pattern = i.name)#根据模型名字选中模型
                if type=="fbx":#导出模型
                    bpy.ops.export_scene.fbx(filepath=tpath)
                if type=="glb":
                    bpy.ops.export_scene.gltf(filepath=tpath, use_selection=True)
                if type=="obj":
                    bpy.ops.export_scene.obj(filepath=tpath, use_selection=True)
                if type=="ply":
                    bpy.ops.export_mesh.ply(filepath=tpath, use_selection=True)
            
            
        
    def load_gltf(self,path,filename):
        bpy.ops.import_scene.gltf(filepath=(path+"\\"+filename),  filter_glob='*.glb;*.gltf')
        

ModelProcessingTool()

#bpy.ops.export_scene.gltf(filepath="D:\\myModel3D\\out\\3.glb", use_selection=True)