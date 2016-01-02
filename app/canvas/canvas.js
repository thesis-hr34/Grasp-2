angular.module('Grasp.Canvas', ['Canvas.socket', 'ngDraggable', 'ngRoute', 'ngPopup'])

.controller('CanvasCTRL', function ($scope, socket, CanvasFactory) {
  $scope.isCanvasDroppable = true;
  $scope.isCanvasBlockDraggable = false;
  $scope.isToolboxDroppable = true;
  $scope.isToolboxBlockDraggable = true;
  $scope.isDropContainerDroppable = false;

  $scope.isNormalMode = true;
  $scope.isCanvasDragModeOn = false;
  $scope.isCanvasRearrangeModeOn = false;

  var hasRearrangedOnBlock = false;

  $scope.generateUniqueID = function(codeBlock) {
    return codeBlock.name + codeBlock.content + codeBlock.isItInToolbox + "";
  }

  // code generated from the combination of blocks on canvas
  $scope.code = "";

  $scope.generateCode = function() {
    $scope.code = CanvasFactory.generateCode($scope.blockMatrix);
  }

  // blocks available for user
  $scope.codeBlocks = CanvasFactory.codeBlocks;

  // storage for blocks currently on the canvas arranged in a matrix
  $scope.blockMatrix = CanvasFactory.matrix;

  /*
    1 - dragging onto empty row [GOOD]
    2 - dragging onto different populated row, but empty space [GOOD]
    3 - dragging onto same row, at empty space [GOOD]
    4 - dragging onto same row, on block [BAD]
  */

  // handles any drop events on canvas
  $scope.onCanvasDrop = function(codeBlock, row) {
    var clonedBlock = CanvasFactory.cloneBlock(codeBlock);
    clonedBlock.isItInToolbox = false;

    if ($scope.isCanvasRearrangeModeOn) {
      var oldRowIndex = -1;
      var oldIndex = -1;

      for (var rowIndex = 0; rowIndex < $scope.blockMatrix.length; rowIndex++) {
        oldIndex = $scope.blockMatrix[rowIndex].indexOf(codeBlock);
        if (oldIndex !== -1) {
          oldRowIndex = rowIndex;
          break;
        }
      }

      if ($scope.blockMatrix.indexOf(row) === oldRowIndex) {
        //
      } else {
        row.push(clonedBlock);
        $scope.blockMatrix[oldRowIndex].splice(oldIndex, 1);
      }

    } else {
      row.push(clonedBlock);
    }

    // add an extra empty row to the matrix if last row contains a codeBlock
    if ($scope.blockMatrix[$scope.blockMatrix.length-1].length > 0) {
      $scope.blockMatrix.push([]);
    }
  };

  $scope.onCanvasRearrange = function(codeBlock, row, newIndex) {
    var clonedBlock = CanvasFactory.cloneBlock(codeBlock);

    var oldRowIndex = -1;
    var oldIndex = -1;

    for (var rowIndex = 0; rowIndex < $scope.blockMatrix.length; rowIndex++) {
      oldIndex = $scope.blockMatrix[rowIndex].indexOf(codeBlock);
      if (oldIndex !== -1) {
        oldRowIndex = rowIndex;
        break;
      }
    }
    
    $scope.blockMatrix[oldRowIndex].splice(oldIndex, 1);
    row.splice(newIndex, 0, clonedBlock);
  };

  var toggleCanvasControls = function() {
    var normalModeBTN = angular.element(document.getElementById('normalMode'));
    var canvasDragModeBTN = angular.element(document.getElementById('canvasDragMode'));
    var canvasRearrangeModeBTN = angular.element(document.getElementById('canvasRearrangeMode'));
    
    if ($scope.isNormalMode) {
      normalModeBTN.css({'background-color': '#ffd777', 'color': '#404040'});
    } else {
      normalModeBTN.css({'background-color': '', 'color': 'white'});
    }
    if ($scope.isCanvasDragModeOn) {
      canvasDragModeBTN.css({'background-color': '#ffd777', 'color': '#404040'});
    } else {
      canvasDragModeBTN.css({'background-color': '', 'color': 'white'});
    }
    if ($scope.isCanvasRearrangeModeOn) {
      canvasRearrangeModeBTN.css({'background-color': '#ffd777', 'color': '#404040'});
    } else {
      canvasRearrangeModeBTN.css({'background-color': '', 'color': 'white'});
    }
  }

  toggleCanvasControls();

  $scope.normalMode = function() {
    $scope.isNormalMode = true;
    $scope.isCanvasDragModeOn = false;
    $scope.isCanvasRearrangeModeOn = false;

    $scope.isCanvasDroppable = true;
    $scope.isCanvasBlockDraggable = false;
    $scope.isToolboxDroppable = true;
    $scope.isToolboxBlockDraggable = true;
    $scope.isDropContainerDroppable = false;

    toggleCanvasControls();
  }

  $scope.canvasDragMode = function() {
    $scope.isNormalMode = false;
    $scope.isCanvasDragModeOn = true;
    $scope.isCanvasRearrangeModeOn = false;

    $scope.isCanvasDroppable = false;
    $scope.isCanvasBlockDraggable = true;
    $scope.isToolboxDroppable = false;
    $scope.isToolboxBlockDraggable = false;
    $scope.isDropContainerDroppable = false;

    toggleCanvasControls();
  }

  $scope.canvasRearrangeMode = function() {
    $scope.isNormalMode = false;
    $scope.isCanvasDragModeOn = false;
    $scope.isCanvasRearrangeModeOn = true;

    $scope.isCanvasDroppable = true;
    $scope.isCanvasBlockDraggable = true;
    $scope.isToolboxDroppable = false;
    $scope.isToolboxBlockDraggable = false;
    $scope.isDropContainerDroppable = true;

    toggleCanvasControls();
  }

  $scope.emit = function() {
    socket.emit('canvasChange', $scope.blockMatrix);
  }

  // Modify block
  $scope.modifyBlock = function(canvasBlock, name, content, loopCount) {
    canvasBlock.name = name || canvasBlock.name;
    canvasBlock.content = content || canvasBlock.content;
    canvasBlock.loopCount = loopCount || canvasBlock.loopCount;
  }

  // Delete block from canvas
  $scope.deleteBlock = function(codeBlock, row) {
    var index = row.indexOf(codeBlock);
    row.splice(index, 1);
  }

  // handles drag movements, this is where we emit x and y positions
  $scope.blockIsMoving = function(event, codeBlock) {
    var id = $scope.generateUniqueID(codeBlock);
    var obj = {
      isDragging: true,
      position: {x:event.tx, y:event.ty},
      id: id
    }; 
    socket.emit('changePosition', obj);
  };

  $scope.blockIsDoneMoving = function(event, codeBlock) {
    var id = $scope.generateUniqueID(codeBlock);
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
    $scope.generateCode();
  });

  // update current position of block that's being dragged
  socket.on('updatePosition', function(data) {
    console.log(data.isDragging);
    var element = angular.element(document.getElementById(data.id));
    if (data.isDragging) {
      element.css({
        transform: 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + data.position.x + ', ' + data.position.y + ', 0, 1)',
        'z-index': 99999,
        '-webkit-transform': 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + data.position.x + ', ' + data.position.y + ', 0, 1)',
        '-ms-transform': 'matrix(1, 0, 0, 1, ' + data.position.x + ', ' + data.position.y + ')'
      });
    } else {
      console.log('fire')
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
                        name: 'number',
                        content: 0,
                        // id: this.name + this.content + this.isItInToolbox + "",
                        isItInToolbox: true,
                        generateUniqueID: function() {
                          return this.name + this.content + this.isItInToolbox;
                        }
                      },
                      {
                        type: 'string',
                        tag: '~',
                        name: 'string',
                        content: '',
                        isItInToolbox: true,
                        generateUniqueID: function() {
                          return this.name + this.content + this.isItInToolbox;
                        }
                      },
                      {
                        type: 'bool',
                        tag: 'ß',
                        name: 'boolean',
                        content: false,
                        toggleBool: function() {
                          this.content = !this.content;
                        },
                        isItInToolbox: true,
                        generateUniqueID: function() {
                          return this.name + this.content + this.isItInToolbox;
                        }
                      },
                      {
                        type: 'array',
                        tag: '[]',
                        name: 'array',
                        content: [],
                        addBlock: function(codeBlock) {
                          this.content.push(codeBlock);
                        },
                        isItInToolbox: true,
                        generateUniqueID: function() {
                          return this.name + this.content.join('') + this.isItInToolbox;
                        }
                      },
                      {
                        type: 'object',
                        tag: '{}',
                        name: 'object',
                        content: {},
                        addBlock: function(codeBlock) {
                          this.content[codeBlock.name] = codeBlock.content;
                        },
                        isItInToolbox: true,
                        generateUniqueID: function() {
                          return this.name + JSON.stringify(this.content) + this.isItInToolbox;
                        }
                      },
                      {
                        type: 'loop',
                        tag: 'O',
                        name: 'loop',
                        loopCount: '0',
                        content: [[],[],[],[],[]],
                        addContent: function(row, codeBlock) {
                          row.push(cloneBlock(codeBlock));
                          if (this.content[this.content.length-1].length > 0) {
                            content.push([]);
                          }
                        },
                        isItInToolbox: true,
                        generateUniqueID: function() {
                          return this.name + JSON.stringify(this.content) + this.isItInToolbox;
                        }
                      },
                      {
                        type: 'function',
                        tag: 'ƒ',
                        name: 'someFunction',
                        arguments: [],
                        content: [[],[],[],[],[]],
                        addArgument: function(codeBlock) {
                          this.arguments.push(codeBlock);
                          if (this.arguments[this.arguments.length-1].length > 0) {
                            content.push([]);
                          }
                        },
                        addContent: function(row, codeBlock) {
                          row.push(codeBlock);
                          if (this.content[this.content.length-1].length > 0) {
                            content.push([]);
                          }
                        },
                        isItInToolbox: true,
                        generateUniqueID: function() {
                          return this.name + JSON.stringify(this.content) + JSON.stringify(this.arguments) + this.isItInToolbox;
                        }
                      }
                   ];

  // different types of codeBlock converters
  var convertNumber = function(codeBlock) {
    return "var " + codeBlock.name + " = " + codeBlock.content + ";";
  };
  var convertString = function(codeBlock) {
    return "var " + codeBlock.name + " = \"" + codeBlock.content + "\";";
  };
  var convertBool = function(codeBlock) {
    return "var " + codeBlock.name + " = " + codeBlock.content + ";";
  };
  var convertArray = function(codeBlock) {
    var elements = [];
    for (var i = 0; i < codeBlock.content.length; i++) {
      if (codeBlock.content[i].type === "number" || codeBlock.content[i].type === "string" ||codeBlock.content[i].type === "bool") {
        elements.push(codeBlock.content[i].content);
      } else {
        elements.push(codeBlock.content[i].name);
      }
    }
    return "var " + codeBlock.name + " = [ " + elements.join(", ") + " ];";
  };
  var convertObject = function(codeBlock) {
    var keyValuePairs = [];
    for (var key in codeBlock.content) {
      keyValuePairs.push("  " + key + ": " + codeBlock.content[key]);
    }

    return "var " + codeBlock.name + " = " + "{ \n" + keyValuePairs.join("\n") + "\n};";
  };
  var convertLoop = function(codeBlock, depth) {
    var space = "";
    for (var i = 0; i < depth; i++) {
      space += " ";
    }
    return "for (var i = 0; i <= " + codeBlock.loopCount + "; i++) {\n" + generateCode(codeBlock.content, depth + 1) + space + "}\n";
  };
  var convertFunction = function(codeBlock, depth) {
    var space = "";
    for (var i = 0; i < depth; i++) {
      space += " ";
    }
    var args = [];
    for (var i = 0; i < codeBlock.arguments.length; i++) {
      args.push(codeBlock.arguments[i].name);
    }
    return "var " + codeBlock.name + " = function( " + args.join(', ') + " ) {\n" + generateCode(codeBlock.content, depth + 1) + space + "};\n";
  };

  // converts codeBlock into javascript code in the form of string
  var generateCode = function(matrix, depth) {
    var code = "";
    if (depth === undefined) { depth = 0;}

    for (var row = 0; row < matrix.length; row++) {
      for (var codeBlockIndex = 0; codeBlockIndex < matrix[row].length; codeBlockIndex++) {
        var codeBlock = matrix[row][codeBlockIndex];

        for (var i = 0; i < depth; i++) {
          code += " ";
        }

        if (codeBlock.type === "number") {
          code += convertNumber(codeBlock);
        } else if (codeBlock.type === "string") {
          code += convertString(codeBlock);
        } else if (codeBlock.type === "bool") {
          code += convertBool(codeBlock);
        } else if (codeBlock.type === "array") {
          code += convertArray(codeBlock);
        } else if (codeBlock.type === "object") {
          code += convertObject(codeBlock);
        } else if (codeBlock.type === "loop") {
          code += convertLoop(codeBlock, depth);
        } else if (codeBlock.type === "function") {
          code += convertFunction(codeBlock, depth);
        }
      }
      code += "\n";
    }
    return code;
  };

  // clone block to avoid reference
  var cloneBlock = function(codeBlock) {
    var obj = {};

    for (var key in codeBlock) {
      if (typeof codeBlock[key] === 'object') {
        if (Array.isArray(codeBlock[key])) {
          if (codeBlock.type === "loop") {
            var matrix = [];
            for (var i = 0; i < codeBlock.content.length; i++) {
              matrix.push(codeBlock.content[i].slice());
            }
            obj[key] = matrix.slice();
          } else if (codeBlock.type === "function") {
            if (key === "arguments") {
              obj[key] = codeBlock[key].slice();
            } else {
              var matrix = [];
              for (var i = 0; i < codeBlock.content.length; i++) {
                matrix.push(codeBlock.content[i].slice());
              }
              obj[key] = matrix.slice();
            }
          } else {
            obj[key] = codeBlock[key].slice();
          }
          
        } else {
          obj[key] = cloneBlock(codeBlock[key]);
        }
      } else {
        obj[key] = codeBlock[key];
      }
    }
    return obj;
  }

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
    matrix: matrix,
    cloneBlock: cloneBlock
  };
});
