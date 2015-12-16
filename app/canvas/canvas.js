angular.module('Grasp.Canvas', ['ngDraggable', 'ngRoute'])

.controller('CanvasCTRL', function ($scope) {
  $scope.code = "";
  $scope.isCanvasDraggable=true;
  $scope.isCodeBlockDraggable=true;

  $scope.runCode = function() {
    var codeStr = $scope.code.split('\n').join("");
    eval(codeStr);
  }

  // generates code from droppedCodeBlocks
  generateCode = function(array) {
    // generate code from the array of codeBlocks received
    var code = "";
    for (var i = 0; i < array.length; i++) {
      if (array[i].type === "variable") {
        code += "var " + array[i].name + " = " + array[i].value + ";\n";
      } else if (array[i].type === "array") {
        code += "var " + array[i].name + " = [" + array[i].value + "];\n";
      } else if (array[i].type === "object") {
        code+= "var " + array[i].name + " = " + JSON.stringify(array[i].storage) + "\n";
        // code += "var " + array[i].name + " = {" + array[i].key + ":"+ JSON.stringify(array[i].value) + "};\n";
      } else if (array[i].type === "add()") {
        var arguments = "";
        for (var j = 0; j < array[i].parameters.length; j++) {
          if (j === array[i].parameters.length-1) {
            arguments += array[i].parameters[j];
          } else {
            arguments += array[i].parameters[j] + ",";
          }
          
        }
        code += "var " + array[i].name + " = function(" + arguments + ") {\n" + array[i].definition + "\n};\n";
      } else if (array[i].type === "subtract()") {
        var arguments = "";
        for (var j = 0; j < array[i].parameters.length; j++) {
          if (j === array[i].parameters.length-1) {
            arguments += array[i].parameters[j];
          } else {
            arguments += array[i].parameters[j] + ",";
          }
          
        }
        code += "var " + array[i].name + " = function(" + arguments + ") {\n" + array[i].definition + "\n};\n";
      }
    }

    return code;
  };

  // clone object
  var cloneObject = function(object) {
    var clone = {};

    for (var key in object) {
      if (Array.isArray(object[key])) {
        clone[key] = object[key].slice();
      } else {
        clone[key] = object[key];
      }
    }

    return clone;
  };

  // $scope.resize = function(codeBlock) {
  //   // var index = $scope.dropgpedCodeBlocks.indexOf(codeBlock);
  //   // if (!codeBlock.expanded) {
  //   //   document.getElementsByClassName("codeBlockDropped")[index].setAttribute("style", "height: 100px;");
  //   //   codeBlock.expanded = true; 
  //   // } else {
  //   //   document.getElementsByClassName("codeBlockDropped")[index].setAttribute("style", "height: 50px;");
  //   //   codeBlock.expanded = false; 
  //   // }
    
  // }

  /*
  */

  // types of codeBlocks, such as variables, arrays, objects, and functions
  $scope.codeBlocks = [
    {
      type: 'variable',
      name: "noNameVar",
      value: "undefined"
    },
    {
      type: 'array',
      name: "noNameArray",
      value: [],
      push: function(data) {
        if (data.storage !== undefined) {
          this.value.push(data.storage);
        } else {
          this.value.push(data.value);
        }
        
        $scope.code = generateCode($scope.droppedCodeBlocks);
      },
      pop: function () {
        this.value.pop();
        $scope.code = generateCode($scope.droppedCodeBlocks);
      }
    },
    {
      type: 'object',
      name: 'Object',
      key: "key",
      value: "value",
      storage: {},
        setValue: function (data, byInput) {
          if (!byInput) {
            if(data.type === "object") {
              this.value = data.storage;
              $scope.code = generateCode($scope.droppedCodeBlocks);
            } else {
                this.value = data.value;
                this.storage.name = data.name;
                this.storage.value = data.value;
                $scope.code = generateCode($scope.droppedCodeBlocks);
                console.log(this.storage);
              }
          } else {
            this.value = data;
            this.storage.value = data;
            $scope.code = generateCode($scope.droppedCodeBlocks);
          }
        },
        setKey: function (key) {
          this.key = key;
          $scope.code = generateCode($scope.droppedCodeBlocks);
        },
        addKeyValue: function(key, value) {
          console.log(key, ": ", value);
          this.storage[key] = value;
          $scope.code = generateCode($scope.droppedCodeBlocks);
        }
    },
    {
      type: 'add()',
      name: "add()",
      parameters: [],
      definition: "var total = 0;\nfor (var i = 0; i < arguments.length; i++) {\n  total += arguments[i];\n  }\nreturn total;\n",
      addParam: function(data) {
        this.parameters.push(data.value);
        $scope.code = generateCode($scope.droppedCodeBlocks);
      },
      execute: function () {
        var total = 0;
        for(var i = 0; i < this.parameters.length; i++) {
          total += Number(this.parameters[i]);
        }
        alert(total)
      }
    },
    {
      type: "subtract()",
      name: "subtract()" ,
      parameters: [],
      definition: "  var total = 0;\n  for (var i = 0; i < arguments.length; i++) {\n    total -= arguments[i];\n    }\n  return total;\n",
      addParam: function(data) {
        this.parameters.push(data.value);
        $scope.code = generateCode($scope.droppedCodeBlocks);
      },
      execute: function () {
        var total = this.parameters[0];
        for(var i = 1; i < this.parameters.length; i++) {
          total -= Number(this.parameters[i]);
        }
        alert(total)
      }
    },
    {
      type: "multiply()",
      name: "subtract()" ,
      parameters: [],
      definition: "  var total = 0;\n  for (var i = 0; i < arguments.length; i++) {\n    total -= arguments[i];\n    }\n  return total;\n",
      addParam: function(data) {
        this.parameters.push(data.value);
        $scope.code = generateCode($scope.droppedCodeBlocks);
      },
      execute: function () {
        var total = this.parameters[0];
        for(var i = 1; i < this.parameters.length; i++) {
          total -= Number(this.parameters[i]);
        }
        alert(total)
      }
    },
    {
      type: "divide()",
      name: "subtract()" ,
      parameters: [],
      definition: "var total = 0;\nfor (var i = 0; i < arguments.length; i++) {\n  total -= arguments[i];\n  }\nreturn total;\n",
      addParam: function(data) {
        this.parameters.push(data.value);
        $scope.code = generateCode($scope.droppedCodeBlocks);
      },
      execute: function () {
        var total = this.parameters[0];
        for(var i = 1; i < this.parameters.length; i++) {
          total -= Number(this.parameters[i]);
        }
        alert(total)
      }
    }
  ];

  // OICE
  // Communication out loud
  // Do Toy Problems on Whiteboard
  // Find interview Questions on Student Wiki and practice out loud
  // If you freeze, switch it up. Step back and look at the big picture, or try simpler cases

  // stores the codeblocks dropped in canvas
  $scope.droppedCodeBlocks = [];

  // when a codeblock is dropped, add it to array. Also regenerate code
  $scope.onDrop = function(data, event) {
    if ($scope.isCanvasDraggable) {
      if (data.storage !== undefined) {
        data.storage = cloneObject(data.storage);
      }
      $scope.droppedCodeBlocks.push(cloneObject(data));
      $scope.code = generateCode($scope.droppedCodeBlocks);
    }
  };

  $scope.turnOffDrag = function() {
    $scope.isCodeBlockDraggable = false;
  };

  $scope.turnOnDrag = function() {
    $scope.isCodeBlockDraggable = true;
  };

  // not sure what to do with this yet
  $scope.onDragFromCanvas = function(data, event) {
    $scope.isCanvasDraggable = false;
  };

  $scope.onDragFromToolbox = function(data, event) {
    $scope.isCanvasDraggable = true;
  };

  $scope.promptKey = function (data, context) {
    for( var prop in data) {
      if (prop === context.key) {
        data[prompt("Enter new key")] = data[prop];
        delete data[prop];
      }
    }
     $scope.code = generateCode($scope.droppedCodeBlocks);
  }

  $scope.deleteCodeblock = function (data) {
    console.log("data",data)
    var index = $scope.droppedCodeBlocks.indexOf(data);
    console.log(index);
    $scope.droppedCodeBlocks.splice(index, 1);
    $scope.code = generateCode($scope.droppedCodeBlocks);
  }

    $scope.promptValue = function (data, context) {
    for( var prop in data) {
      if (prop === context.key) {
        var newVal = prompt("Enter new value");
         data[prop] = newVal;
      }
    }
    $scope.code = generateCode($scope.droppedCodeBlocks);
  }

  // setting variable values
  $scope.setVariable = function(data, name, value, $event) {
    $event.preventDefault();
    data.name = name || data.name;
    data.value = value || data.value;
    $scope.code = generateCode($scope.droppedCodeBlocks);
  };
});