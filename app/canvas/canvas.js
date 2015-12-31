angular.module('Grasp.Canvas', ['Canvas.socket', 'ngDraggable', 'ngRoute', 'ngPopup'])

.controller('CanvasCTRL', function ($scope, socket, CanvasFactory) {
  $scope.isCanvasDroppable = true;

  // code generated from the combination of blocks on canvas
  $scope.code = "";

  // blocks available for user
  $scope.codeBlocks = CanvasFactory.codeBlocks;

  // storage for blocks currently on the canvas arranged in a matrix
  $scope.blockMatrix = CanvasFactory.matrix;

  // remove a block from the canvas
  $scope.deleteBlock = function (row, block) {
    var index = row.indexOf(block);
    row.splice(index, 1);
  }

  // handles any drop events on canvas
  $scope.onCanvasDrop = function(codeBlock, row) {
    // add codeBlock at row
    
    row.push(codeBlock);

    // add an extra empty row to the matrix if last row contains a codeBlock
    if ($scope.blockMatrix[$scope.blockMatrix.length-1].length > 0) {
      $scope.blockMatrix.push([]);
    }

    // emit block matrix to update other user's matrix
    socket.emit('canvasChange', $scope.blockMatrix);
  };

  // handles drag movements, this is where we emit x and y positions
  $scope.blockIsMoving = function(event, codeBlock) {
    var id = codeBlock.generateUniqueID();
    var obj = {
      isDragging: true,
      position: {x:event.tx, y:event.ty},
      id: id
    }; 
    socket.emit('changePosition', obj);
  };

  $scope.blockIsDoneMoving = function(event, codeBlock) {
    var id = codeBlock.generateUniqueID();
    var obj = {
      isDragging: false,
      position: {x:event.tx, y:event.ty},
      id: id
    }; 
    socket.emit('changePosition', obj);
  }

  // ------------- SOCKET HANDLERS -------------
  // update blockMatrix when changes are made to it
  socket.on('onCanvasChange', function(data) {
    $scope.blockMatrix = data;
  });

  // update current position of block that's being dragged
  socket.on('updatePosition', function(data) {
    var element = angular.element(document.getElementById(data.id));
    if (data.isDragging) {
      element.css({
        transform: 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + data.position.x + ', ' + data.position.y + ', 0, 1)',
        'z-index': 99999,
        '-webkit-transform': 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + data.position.x + ', ' + data.position.y + ', 0, 1)',
        '-ms-transform': 'matrix(1, 0, 0, 1, ' + data.position.x + ', ' + data.position.y + ')'
      });
    } else {
      element.css({transform:'', 'z-index':'', '-webkit-transform':'', '-ms-transform':''});
    }
  });

})

// ------------------- CANVAS FACTORY ------------------- 
.factory('CanvasFactory', function() {
  // blocks available for user
  var codeBlocks = [
                      {
                        type: 'number',
                        tag: '#',
                        name: 'no-name-number',
                        content: 0,
                        generateUniqueID: function() {
                          return this.name + this.content + "";
                        }
                      },
                      {
                        type: 'string',
                        tag: '~',
                        name: 'no-name-string',
                        content: '-- empty string --',
                        generateUniqueID: function() {
                          return this.name + this.content + "";
                        }
                      },
                      {
                        type: 'array',
                        tag: '[]',
                        name: 'no-name-array',
                        content: [],
                        generateUniqueID: function() {
                          return this.name + this.content + "";
                        }
                      },
                      {
                        type: 'object',
                        tag: '{}',
                        name: 'no-name-object',
                        content: {},
                        generateUniqueID: function() {
                          return this.name + this.content + "";
                        }
                      },
                      {
                        type: 'loop',
                        tag: 'O',
                        name: 'loop',
                        content: [[],[],[],[],[]],
                        generateUniqueID: function() {
                          return this.name + this.content + "";
                        }
                      }
                   ];

  // converts codeBlock into javascript code in the form of string
  var generateCode = function(matrix) {
    console.log("works");
  };

  var matrix = [
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  []
               ];

  return {
    codeBlocks: codeBlocks,
    generateCode: generateCode,
    matrix: matrix
  };
});
