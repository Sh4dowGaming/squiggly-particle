var userChar = "X";
var computerChar = "O";
var gameOver = false;//gets set to the true when the game is over.
var scoreCount = 0;//set to zero initially, increments by 1 for every winning game.
var row1 = [1, 2, 3];
var row2 = [4, 5, 6];
var row3 = [7, 8, 9];
var col1 = [1, 4, 7];
var col2 = [2, 5, 8];
var col3 = [3, 6, 9];
var diag1 = [1, 5, 9];
var diag2 = [3, 5, 7];
//collect all winning combinations...
var rules = [row1, row2, row3, col1, col2, col3, diag1, diag2];
//
var aiOrder = [4, 0, 8, 5, 1, 7, 2, 6, 3];
$(document).ready(function() {//when the document is ready/loaded...	
	$("#game-area").hide();
	$("#score p").hide();
        $("#feedback").hide();
        //
	$("#introduction #startBtn").bind("click", startGame);
	$("#game-area .panel").each(function(i){//apply an id to all the panels...
		$(this).addClass("enabled").attr("id", "panel"+i);
	});
	$("#game-area .panel.enabled").bind("click", selectPanel);//apply a click event to all the panels...
	//
	//the click event for the start again button within the feedback div.
	$("#feedback #startAgainBtn").click(function(){
		$(this).parent().fadeOut();//hide thefeedback div once selected..
		$("#game-area .panel").empty().bind("click", selectPanel).css({"cursor":"pointer"}).removeClass("winner").addClass("enabled");//reset the games state to start again...
		gameOver = false;
	});
});
function startGame(){	
	$(this).parent().fadeOut();//hide thefeedback div once selected..	
	$("#game-area").fadeIn();
	if($('input[name=selections]:checked', '#character-selections').val() === "X"){
		userChar = "X";
		computerChar = "O";
	} else {
		userChar = "O";
		computerChar = "X";
	}
	$("#score p").show();		
}
function selectPanel(e){//invoked when the panel is selected, in this case, from a click event...	
	//this panel has it's click event removed, it's cursor set to default and it's no longer enabled, so this class is removed...
	$(this).text(userChar).unbind("click").css({"cursor":"default"}).removeClass("enabled");
	//loop over all of our rules...
	for (var i = 0;i<rules.length;i++){
		checkCombination(rules[i], userChar);//and execute our function to check all the combinations...
	}
	if(!gameOver){//if it isnt game over, then let the computer have a turn.
		computerMove();//the computers turn is executed with this function.
	}
	//
	e.preventDefault();//prevent the default behaviour of the a tag selected.
}
function computerMove() {	
	for (var i = 0;i<aiOrder.length;i++){//loop over the order array...
		if($("#game-area #panel"+aiOrder[i]).text()=== ""){//if the panel selected in this loop is empty...
			//...then apply the computers character to the panel, take away its click event, set the cursor to default, and remove the enabled class...
			$("#game-area #panel"+aiOrder[i]).text(computerChar).unbind("click").css({"cursor":"default"}).removeClass("enabled");
			break;//stop further execution of the outer loop.
		}
	}
	for (var j = 0;j<rules.length;j++){
		checkCombination(rules[j], computerChar);//check the combinations of the computer player...
	}
}
//generic function to check either players progress in the game...
function checkCombination(arr, playerChar){	
	var correctNum = 0;//stores the correct number selected by the player.
	var panelCount = 0;//stores the panel count selected.
	var thisNum;//refers to the current number selected
	$("#game-area .panel").each(function(i){//iterate over the panels...
		thisNum = (i+1);//increment our thisNum var, it's 0 based.
		if($("#game-area .panel").eq(i).text() === playerChar){//check if the current panel has the players char in it.
			for (var j = 0;j<arr.length;j++){//loop over the length of the array passed into this function...
				if(thisNum === arr[j]){//check this num against the passed in array...
					correctNum += 1;//test is true, we are correct, increment our correctnum var.
				}
			}
		}
	});
	if(correctNum === arr.length){//if correct num is equal to the arrays length, we are all correct	!		
		$("#feedback").fadeIn().children("p").text('"'+playerChar+'"'+' has won!');//show the feedback message, indicating which player has won!
		$("#game-area .panel.enabled").unbind("click").css({"cursor":"default"}).removeClass("enabled");//disable all the panels, game is over!
		for (var k = 0;k<arr.length;k++){//loop over the winning array found...
			$("#game-area #panel"+(arr[k]-1)).addClass("winner");//add a class to the winning panels! 
		}
		scoreCount +=1;
		$("#score p").text("Score: "+scoreCount);
		gameOver = true;		
	}	
	//determine if game is a tie...
	$("#game-area .panel").each(function(){//loop over all the panels...
		if($(this).text()!==""){//check if the current iterator of the loop is not an empty string...
			panelCount+= 1;//add to our panel count.
		}		
	});//show the feedback indicating game is a tie...
	if(panelCount === $("#game-area .panel").length){//if panel count indicates that all panels are filled, then...
		$("#feedback").fadeIn().children("p").text("Game is a tie!");//show the message that the game is a tie!
	}
}
