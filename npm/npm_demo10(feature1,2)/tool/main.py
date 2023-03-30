from ViewpointList import ViewpointList
import sys
import json
if __name__ == "__main__":#用于测试
    config=json.load(open(sys.argv[1], 'r'))
    vf=ViewpointList(config)
    vf.saveEntropy()
    vf.configCSave()
    