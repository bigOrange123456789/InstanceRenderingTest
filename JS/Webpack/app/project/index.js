PF={
    'Heap'                      : require('./src/heap'),
    'Node'                      : require('./src/core/Node'),
    'Grid'                      : require('./src/core/Grid'),
    'Util'                      : require('./src/core/Util'),
    'DiagonalMovement'          : require('./src/core/DiagonalMovement'),
    'Heuristic'                 : require('./src/core/Heuristic'),

    'AStarFinder'               : require('./src/finders/AStarFinder'),
    /*'BestFirstFinder'           : require('./src/finders/BestFirstFinder'),
    'BreadthFirstFinder'        : require('./src/finders/BreadthFirstFinder'),
    'DijkstraFinder'            : require('./src/finders/DijkstraFinder'),
    'BiAStarFinder'             : require('./src/finders/BiAStarFinder'),
    'BiBestFirstFinder'         : require('./src/finders/BiBestFirstFinder'),
    'BiBreadthFirstFinder'      : require('./src/finders/BiBreadthFirstFinder'),
    'BiDijkstraFinder'          : require('./src/finders/BiDijkstraFinder'),
    'IDAStarFinder'             : require('./src/finders/IDAStarFinder'),
    'JumpPointFinder'           : require('./src/finders/JumpPointFinder'),
*/
}
module.exports =PF;
