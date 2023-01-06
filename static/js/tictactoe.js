var gameWinner = new Array();
var humanPickedArray = new Array();
var cpuPickedArray = new Array();
var humanWinArray, cpuWinArray, resetButton;
var board = ['#1','#2','#3','#4','#5','#6','#7','#8','#9'];
var winningCombos = [
    		"#1.COLOR, #2.COLOR, #3.COLOR", "#3.COLOR, #2.COLOR, #1.COLOR", "#2.COLOR, #1.COLOR, #3.COLOR", "#1.COLOR, #3.COLOR, #2.COLOR",
			"#4.COLOR, #5.COLOR, #6.COLOR", "#6.COLOR, #5.COLOR, #4.COLOR", "#5.COLOR, #4.COLOR, #6.COLOR", "#6.COLOR, #4.COLOR, #5.COLOR",
			"#7.COLOR, #8.COLOR, #9.COLOR", "#9.COLOR, #8.COLOR, #7.COLOR", "#8.COLOR, #7.COLOR, #9.COLOR", "#9.COLOR, #7.COLOR, #8.COLOR",
			"#1.COLOR, #4.COLOR, #7.COLOR", "#7.COLOR, #4.COLOR, #1.COLOR", "#4.COLOR, #7.COLOR, #1.COLOR", "#1.COLOR, #7.COLOR, #4.COLOR",
			"#2.COLOR, #5.COLOR, #8.COLOR", "#8.COLOR, #5.COLOR, #2.COLOR", "#5.COLOR, #8.COLOR, #2.COLOR", "#2.COLOR, #8.COLOR, #5.COLOR",
			"#3.COLOR, #6.COLOR, #9.COLOR", "#9.COLOR, #6.COLOR, #3.COLOR", "#6.COLOR, #9.COLOR, #3.COLOR", "#3.COLOR, #9.COLOR, #6.COLOR",
			"#1.COLOR, #5.COLOR, #9.COLOR", "#9.COLOR, #5.COLOR, #1.COLOR", "#5.COLOR, #9.COLOR, #1.COLOR", "#1.COLOR, #9.COLOR, #5.COLOR",
			"#3.COLOR, #5.COLOR, #7.COLOR", "#7.COLOR, #5.COLOR, #3.COLOR", "#5.COLOR, #7.COLOR, #3.COLOR", "#3.COLOR, #7.COLOR, #5.COLOR",
  			];	
function playGame(){
	var choice;
	humansTurn(choice);
}
function humansTurn(choice){
	humanPick(choice);			
}
function humanPick(choice){		
	$('.gridItem').click(function(event){
		addHuman(event,choice);
	});
}
function cpusTurn(humanChoice){
	var randomNum = Math.floor(Math.random() * board.length);
	var cpuChoice = board[randomNum];
	if (humanChoice != cpuChoice && (!humanPickedArray.includes(cpuChoice) && !cpuPickedArray.includes(cpuChoice) && humanWinArray === undefined) ){
		cpuPick(cpuChoice);
		board.splice(board.indexOf(cpuChoice), 1);
	} else {
		cpuRepick(randomNum);
		}
}
function cpuRepick(randomNum){
	var cpuRepick;
	var isTaken = true;
	if (cpuPickedArray.length >= 2){
		decideWinner(gameWinner);
		if (humanWinArray.includes(true)){
			isTaken = false;
		}
	}
	while(isTaken){
		randomNum = Math.floor(Math.random() * board.length);
		cpuRepick = board[randomNum];
		if (!humanPickedArray.includes(cpuRepick) && !cpuPickedArray.includes(cpuRepick)){
			cpuPick(cpuRepick);
			board.splice(board.indexOf(cpuRepick), 1);	
			isTaken = false;
		}
		randomNum++;
	}
}	
function cpuPick(cpuChoice){
	cpuPickedArray.push(cpuChoice);
	$(cpuChoice).addClass("red");
	$(cpuChoice).html("O");
}
function decideWinner(winner) {
  	humanWinArray = getWinningArray(winningCombos, "blue");
  	cpuWinArray = getWinningArray(winningCombos, "red");
  	var humanWins = humanWinArray.includes(true);
  	var cpuWins = cpuWinArray.includes(true);
  	var fullGrid = getHumanCount() + getCpuCount();
  	var draw = ((fullGrid === 9) && (!humanWins && !cpuWins));
  	if (humanWins) {
    	humanWin();
		gameWinner.push("Human");
		reset();
    	return humanWins;
  	} else if (cpuWins) {
    	cpuWin();
		gameWinner.push("CPU");
		reset();
    	return cpuWins;
  	} else if (draw) {
    	catsGame();
		gameWinner.push("Draw");
		reset();
    	return draw;
  	} else {
    	console.log('game on...');
  	}
}
function getWinningArray(array, string) {
  	return array.map(function(combo) {
    	var eachCombo = combo.replace(/COLOR/g, string);
    	return eachCombo = $(eachCombo).length === 3;
  	});
}
function humanWin(){
	$("#winningHeader").css("display", "block");
    $("#winningHeader").text("Human wins the game!");
    disableSpotsLeft();
}
function cpuWin(){
	$("#winningHeader").css("display", "block");
    $("#winningHeader").text("CPU wins the game!");
    disableSpotsLeft();
}
function catsGame(){
    $("#winningHeader").css("display","block");
    $("#winningHeader").text("DRAW!");
    disableSpotsLeft();
}
function getCpuCount() {
  	var cpuCount = $('.red').length;
  	return cpuCount;
}
function getHumanCount() {
	var humanCount = $('.blue').length;
  	return humanCount;
}
function disableSpotsLeft() {
	var notHumanOrCpu = document.querySelectorAll("div.gridItem:not(.blue):not(.red)");
  	$(notHumanOrCpu).addClass("gray");
	$(notHumanOrCpu).addClass("notClickable");
	$('#resetButton').addClass("grayButton");
	$('#resetButton').css("display","block");
  	return;
}
function reset(){
	$('#resetButton').click(function(){
		location.reload();
	});		
}
function addHuman(event, choice){
  	choice = '#' + event.currentTarget.id;
	if (board.includes(choice)){	
		if (gameWinner[0] === undefined){
			$(choice).addClass("blue");
			$(choice).html("X");
			humanPickedArray.push(choice);
			board.splice(board.indexOf(choice), 1);
		} 
		if (!gameWinner.includes("Human") || !gameWinner.includes("CPU")){
			cpusTurn(choice);
		}
		decideWinner(gameWinner);
		} else if (humanPickedArray.includes(choice) && cpuPickedArray.includes(choice)){
			window.alert("Your choice has already been taken, please choose another.");
		} else {	
		}
}
playGame();	