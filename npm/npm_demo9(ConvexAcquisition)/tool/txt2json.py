from VisibilityDegree import VisibilityDegree
class ViewpointCorrelation:
    def __init__(self):
        print()

import sys
if __name__ == "__main__":#用于测试
    id=sys.argv[1]
    database=VisibilityDegree.getAllVisibilityDegree(id)
    VisibilityDegree.saveEntropy(id,database)
    print()