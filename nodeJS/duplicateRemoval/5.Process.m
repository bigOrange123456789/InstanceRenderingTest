classdef Process
    %PROCESS �˴���ʾ�йش����ժҪ
    %   �˴���ʾ��ϸ˵��
    
    properties
        fileNames
        vectors
        distances
    end
    
    methods
        function o = Process()
            %PROCESS ��������ʵ��
            %   �˴���ʾ��ϸ˵��
            [o.fileNames,o.vectors]=Process.read("5.txt");
            %o.fileNames=fileNames;
            %o.vectors=vectors;
            o.distances=Process.distance(o.vectors);
            
            result=o.distances<0.01;
            result=result-diag(diag(result));
            disp(sum(result,"all"));
            disp(sum(result,"all")/(length(result)^2));
            result=gather(result);
            %result=mat2cell(result);
            xlswrite('result.xlsx', result);
            xlswrite('names.xlsx', o.fileNames');
            %{
            c1=mat2cell(o.fileNames',length(o.fileNames'));
            c2=mat2cell( (1:length(result))',length(result));
            size(c1)
            console=[c1';c2']';
            %size(console)
            for j1=1:length(result)-1
                if j1==cell2mat(console(j1,2))
                    for j2=j1+1:length(result)
                        if result(j1,j2)==1
                            console(j2,2)={j1};
                        end
                    end
                end
            end
            xlswrite('console.xlsx', console);
            
            %}
            
        end
        
        
    end
    methods(Static)
        function dis = distance(vectors)%input:  n*c output: n*n
            vectors=gpuArray(vectors);%ʹ��GPU��������1200����%��ʹ��GPU�����޸���1800
            sizeV=size(vectors);
            n=sizeV(1);
            c=sizeV(2);
            p1=reshape(vectors,n,1,c);
            p2=reshape(vectors,1,n,c);
            fun = @(a,b) (a - b).^2;
            b=bsxfun(fun,p1,p2);
            %  10*10*n   10*1*n  1*10*n
            %            n*1*v  1*n*v
            dis=sqrt(sum(b,3));
        end
        function [fileNames,mat] = read(path)
            
            fileFolder=fullfile(path);
            dirOutput=dir(fullfile(fileFolder,'*.txt'));
            fileNames={dirOutput.name};
            c=544;
            mat=zeros(length(fileNames),c);
            for i=1:length(fileNames)
                disp(i);
                arr=getArr( path+"/"+ string(fileNames(i)) );
                mat(i,:)=arr(1,c);
            end
            
            function arr=getArr(path0)
                fid = fopen(path0);%fid��һ������0������
                fgetl(fid);
                str = fgetl(fid);
                arr=strsplit(str," ");
                arr(1)=[];
                arr=str2double(arr);
                fclose(fid);
            end
            
        end
    end
end

