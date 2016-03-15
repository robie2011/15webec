"use strict";

// Returns Html Color for a given number
var colorMapping = function (number) {
    return 'red';
};

var arrayReduceToSum = function(previousValue, currentValue) { 
    return previousValue + currentValue;
}

// Return a solution hint array containing: 1 = correct color or 2 = correct color+position
var calculateSolutionHint = function (inputArray, solutionArray) {
    var solutionHintArray = [];
    
    var solutionNumberCounter = [];
    solutionArray.forEach(function(value){
        if (!solutionNumberCounter[value]) solutionNumberCounter[value] = 1;
        else solutionNumberCounter[value] = ++solutionNumberCounter[value]; //POST INCREMENT DOESN'T WORK! WTF!
    });
    
    var inputNumberCounter = [];    
    inputArray.forEach(function(value){
        if (!inputNumberCounter[value]) inputNumberCounter[value] = 1;
        else inputNumberCounter[value] = ++inputNumberCounter[value]; //POST INCREMENT DOESN'T WORK! WTF!
    });
    
    var totalCorrectColorAndPositionInput = 0;
    solutionArray.forEach(function(value, index){
       if (value === inputArray[index]) ++totalCorrectColorAndPositionInput;
    });
    
    var totalCorrectColorInputs = 0;
    inputNumberCounter.forEach(function(value, index){
        totalCorrectColorInputs += Math.min(value, solutionNumberCounter[index]);
    });
    totalCorrectColorInputs -= totalCorrectColorAndPositionInput; // otherwiese we would count it twice
    
    var solutionHintArray = [];
    for (var i = 0; i < totalCorrectColorInputs; i++)
        solutionHintArray.push(1);
    
    for (var i = 0; i < totalCorrectColorAndPositionInput; i++)
        solutionHintArray.push(2);
    
    return solutionHintArray;
}; 

function getGamePlayHtml(inputArray, solutionArray) {
// example html to generate
//    <div class="game row">
//    <div class="try col-lg-4 col-md-4 col-xs-5">
//        <div style="background-color: red"></div>
//        <div style="background-color: red"></div>
//        <div style="background-color: red"></div>
//        <div style="background-color: red"></div>
//    </div>
//    <div class="col-lg-1 col-md-1 col-xs-3">
//        <div class="row">
//            <div class="circle"></div>
//            <div class="circle"></div>
//        </div>
//        <div class="row">
//            <div class="circle"></div>
//            <div class="circle"></div>
//        </div>
//    </div>
//</div>
    
    var html = '';
    html += '<div class="game row">\r\n';
    
    // entered colors
    html += '<div class="try col-lg-4 col-md-4 col-xs-5">\r\n';
    for (var i = 0; i < inputArray.length; i++)
    {
        html += '<div style="background-color: ' + colorMapping(inputArray[i]) +'"/>\r\n';
    }    
    html += '</div>\r\n';
    // -----------------------------------------------------------
    
    // Solution Hint Color Coding
    html += '<div class="col-lg-1 col-md-1 col-xs-3">\r\n';
    html += '<div class="row">';
    for (var i=0; i < solutionHintArray.length; i++)
    {
        var thereAreMoreThanTwoHints = i % 2 == 0;
        if (thereAreMoreThanTwoHints)
        {
            html += '<div class="row">';
            html += '</div>\r\n';            
        }
    }
    html += '</div>\r\n';
    html += '</div>\r\n';
    // -----------------------------------------------------------
    
    html += '</div>\r\n';
    
    return html;
}

console.log(calculateSolutionHint([1,1,1,1], [1,2,3,4]));
console.log(calculateSolutionHint([1,2,3,4], [1,2,3,4]));
console.log(calculateSolutionHint([1,2,3,4], [4,3,2,1]));