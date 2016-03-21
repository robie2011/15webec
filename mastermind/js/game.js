"use strict";

// Returns Html Color for a given number
var colorMapping = function (number) {
    return 'red';
};

var arrayReduceToSum = function(previousValue, currentValue) { 
    return previousValue + currentValue;
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
var getRandomArbitrary = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

var countTry = 1;
var maxTry = 6;
var hasWon = false;


var solutionArray = [];
solutionArray.push(getRandomArbitrary(1,5));
solutionArray.push(getRandomArbitrary(1,5));
solutionArray.push(getRandomArbitrary(1,5));
solutionArray.push(getRandomArbitrary(1,5));
console.log("solution created: " + solutionArray);

// Return a solution hint array containing: 1 = correct color or 2 = correct color+position
var calculateSolutionHint = function (inputArray, solutionArray) {
    var solutionHintArray = [];
    
    var solutionNumberCounter = [0, 0, 0, 0];
    solutionArray.forEach(function(value){
        if (!solutionNumberCounter[value]) solutionNumberCounter[value] = 1;
        else solutionNumberCounter[value] = ++solutionNumberCounter[value];
    });
    
    var inputNumberCounter = [0, 0, 0, 0];    
    inputArray.forEach(function(value){
        if (!inputNumberCounter[value]) inputNumberCounter[value] = 1;
        else inputNumberCounter[value] = ++inputNumberCounter[value];
    });
    
    var totalCorrectColorAndPositionInput = 0;
    solutionArray.forEach(function(value, index){
       if (value === Number(inputArray[index])) ++totalCorrectColorAndPositionInput;
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
    
    console.log("input " + inputArray);
    console.log("hint " + solutionHintArray);
    return solutionHintArray;
}; 


//console.log(calculateSolutionHint([1,1,1,1], [1,2,3,4]));
//console.log(calculateSolutionHint([1,2,3,4], [1,2,3,4]));
//console.log(calculateSolutionHint([1,2,3,4], [4,3,2,1]));


var canSubmit = function(){
    return countTry <= maxTry
        && !hasWon
        && $('#input1').attr('data-code')
        && $('#input2').attr('data-code')
        && $('#input3').attr('data-code')
        && $('#input4').attr('data-code');
};

var addGamePlay = function (inputArray, solutionHintArray){
    var clonedTryTpl = $('#templates > .try').clone();    
    var colorBoxes = $(clonedTryTpl).find('.colorBox');
    colorBoxes[0] = $(colorBoxes[0]).attr('data-code', inputArray[0]);
    colorBoxes[1] = $(colorBoxes[1]).attr('data-code', inputArray[1]);
    colorBoxes[2] = $(colorBoxes[2]).attr('data-code', inputArray[2]);
    colorBoxes[3] = $(colorBoxes[3]).attr('data-code', inputArray[3]);
    
    var solutionHintBoxes = $(clonedTryTpl).find('.circle');
    solutionHintBoxes[0] = $(solutionHintBoxes[0]).attr('data-hint-code', solutionHintArray[0]);
    solutionHintBoxes[1] = $(solutionHintBoxes[1]).attr('data-hint-code', solutionHintArray[1]);
    solutionHintBoxes[2] = $(solutionHintBoxes[2]).attr('data-hint-code', solutionHintArray[2]);
    solutionHintBoxes[3] = $(solutionHintBoxes[3]).attr('data-hint-code', solutionHintArray[3]);    
    $(clonedTryTpl).appendTo('#game');
};

var resetUi = function (){
    $('#input1').attr('data-code', false);
    $('#input2').attr('data-code', false);
    $('#input3').attr('data-code', false);
    $('#input4').attr('data-code', false);

    $('#submitButton').attr('disabled', 'disabled');

    var infoText = "Versuch #"+countTry + " von Total " + maxTry;
    $('#infoText').text(infoText);
    $('#progress').val(countTry);
};

function useInput(dom){            
    var code = $(dom).attr('data-code');
    var targetInputControlNumber = $(dom).parent().attr('data-target-input');
    var targetId = '#input' + targetInputControlNumber;
    $(targetId).attr('data-code', code);
    
    if(canSubmit()){
        $('#submitButton').attr('disabled', false);
    }
}

function play(){
    var inputArray = [];    
    inputArray.push($('#input1').attr('data-code'));
    inputArray.push($('#input2').attr('data-code'));
    inputArray.push($('#input3').attr('data-code'));
    inputArray.push($('#input4').attr('data-code'));
    
    var solutionHintArray = calculateSolutionHint(inputArray, solutionArray);
    var solutionWasFound = solutionHintArray.filter(function(d){ return d == 2}).length == 4;
    if(solutionWasFound){
        hasWon = true;
        alert('Congratulation - You win!');
    }
    addGamePlay(inputArray, solutionHintArray);
    countTry++;
    resetUi();
}