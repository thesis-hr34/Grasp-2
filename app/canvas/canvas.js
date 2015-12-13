angular.module('Grasp.Canvas', ['ngDraggable', 'ngRoute'])

.controller('CanvasCTRL', function ($scope) {
  $scope.code = "";
  $scope.isCanvasDraggable=true;
  $scope.isCodeBlockDraggable=true;
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
        code += "var " + array[i].name + " = {" + array[i].value + "};\n";
      } else if (array[i].type === "function") {
        code += "var " + array[i].name + " = function() {\n" + array[i].value + "\n};\n";
      }
    }

    return code;
  }

  // clone object
  var cloneObject = function(object) {
    var clone = {};

    for (var key in object) {
      clone[key] = object[key];
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
        this.value.push(data.value);
        $scope.code = generateCode($scope.droppedCodeBlocks);
      }
    },
    {
      type: 'object',
      name: "noNameObject",
      value: "key: value"
    },
    {
      type: 'function',
      name: "noNameFunction",
      value: "undefined"
    }
  ];

  // stores the codeblocks dropped in canvas
  $scope.droppedCodeBlocks = [];

  // when a codeblock is dropped, add it to array. Also regenerate code
  $scope.onDrop = function(data, event) {
    if ($scope.isCanvasDraggable) {
      $scope.droppedCodeBlocks.push(cloneObject(data));
      $scope.code = generateCode($scope.droppedCodeBlocks);
    }
  };

  $scope.turnOffDrag = function() {
    $scope.isCodeBlockDraggable = false;
  }

  $scope.turnOnDrag = function() {
    $scope.isCodeBlockDraggable = true;
  }

  // not sure what to do with this yet
  $scope.onDragFromCanvas = function(data, event) {
    $scope.isCanvasDraggable = false;
  }

  $scope.onDragFromToolbox = function(data, event) {
    $scope.isCanvasDraggable = true;
  }

  // setting variable values
  $scope.setVariable = function(data, name, value, $event) {
    $event.preventDefault();
    data.name = name || data.name;
    data.value = value || data.value;
    $scope.code = generateCode($scope.droppedCodeBlocks);
  }
});