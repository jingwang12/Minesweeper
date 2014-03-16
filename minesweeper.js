var mines=[];
var counts=[];
var flags=[];
var shown=[];
var countRemain=10;
var timer;
var started=false;
var inGame=true;

function setBoard(){
    var score=document.getElementById('score');
    score.textContent = countRemain;
    // select by id: $('#face')
    // select by class: $('.classname')
    document.getElementById('face').src=('smiley.png');
    for (var i=0;i<9;i++){
        for (var j=0;j<9;j++){
            var block = document.createElement('div');
            var X=i*20;
            var Y=j*20;
            block.id = 'block' +i + j;
            block.setAttribute("style","width:16px;height:16px;");
            /*
            to batch-set css properties using jQuery:
            block.css({
                background-color: '#ffffff',
                border-top: '2px solid white',
                //etc.
            });
            */
            block.style.backgroundColor='#d4d0c8';
            block.style.borderTop='2px solid white';
            block.style.borderLeft='2px solid white';
            block.style.borderRight='2px solid grey';
            block.style.borderBottom='2px solid grey';
            block.style.left = X+'px';
            block.style.top = Y+'px';
            block.style.display='block';
            block.style.position='absolute';
            block.style.textAlign='center';
            
            // best to put the field div as an instance var
            document.getElementById('field').appendChild(block);
        }
    }
}

function setArrays(){
    //set mines array
    mines=[];
    for(var i=-1;i<10;i++){
        mines[i]=[];
        for(var j=-1;j<10;j++){
            mines[i][j] = 0;
        }
    }
    var numOfBomb=1;
    while(numOfBomb <= 10){
        var randomX = Math.floor(Math.random() * 9);
        var randomY = Math.floor(Math.random() * 9);
        if(mines[randomX][randomY] !== 1) {
            mines[randomX][randomY] = 1;
            numOfBomb++;
        }
    }
    
    //set neighboring counts array
    counts=[];
    for(var i=0;i<9;i++){
        counts[i]=[];
        for(var j=0;j<9;j++){
            var count = 0;      
            for (var dX=-1;dX<2;dX++){
                for(var dY=-1;dY<2;dY++){
                    if(dX == 0 && dY == 0){}
                    else{       
                        if(mines[i+dX][j+dY] == 1){
                             count++;
                        }
                    }
                }
            }
            counts[i][j] = count;
        }
    }
    
    //set flags array
    flags=[];
    for(var i=-1;i<10;i++){
        flags[i]=[];
        for(var j=-1;j<10;j++){
            flags[i][j]=0;
        }
    }
    //set shown blocks array
    shown=[];
    for(var i=-1;i<10;i++){
        shown[i]=[];
        for(var j=-1;j<10;j++){
            shown[i][j]=0;
        }
    }
    for(var i=-1;i<10;i++){
        shown[-1][i]=2;
        shown[9][i]=2;
        shown[i][-1]=2;
        shown[i][9]=2;
    }
    
}

function reveal(x,y){
    var revealedBlock = document.getElementById('block'+x+y);
    console.log(revealedBlock.id);
    revealedBlock.style.borderTop='2px solid #CCCCCC';
    revealedBlock.style.borderLeft='2px solid #CCCCCC';
    revealedBlock.style.backgroundColor='#CCCCCC';
    shown[x][y]=1;
    if (counts[x][y]==0){}
    else{
        revealedBlock.textContent = counts[x][y];
    }    
}

function expandRow(x,y){
        var X=x;
            while(X>-1 && mines[X][y]==0 &&flags[X][y]==0){
                reveal(X,y);
                if(counts[X][y]!==0){break;}
                X--;
        }
        X=x;
        while(X<9 && mines[X][y]==0 && flags[X][y]==0){
            reveal(X,y);
            if(counts[X][y]!==0){break;}
            X++;
          }
}

function expandCol(x,y) {
            var Y=y;
            while(Y>-1 && mines[x][Y]==0 && flags[x][Y]==0){
                reveal(x,Y);
                if(counts[x][Y]!==0){break;}
                Y--;
            }
        Y=y;
        while(Y<9 && mines[x][Y]==0 && flags[x][Y]==0){
            reveal(x,Y);
            if(counts[x][Y]!==0){break;}
            Y++;
            }
}

function expand() {
    for (var i=0;i<9;i++){
        for(var j=0;j<9;j++){
            if (shown[i][j]==1){
                if(counts[i][j]==0){
                if((flags[i][j-1]==0 &&shown[i][j-1]==0) || (flags[i][j+1]==0 &&shown[i][j+1]==0)){
                    expandCol(i,j);
                }}
            }
        }
    }
    for (var i=0;i<9;i++){
        for(var j=0;j<9;j++){
            if (shown[i][j]==1){
                if(counts[i][j]==0){
                if((flags[i-1][j]==0 &&shown[i-1][j]==0) || (flags[i+1][j]==0 && shown[i+1][j]==0)){
                    expandRow(i,j);
                }}
            }
        }
    }
}

function expandable(){
    for (var i=0;i<9;i++){
        for(var j=0;j<9;j++){
            if (shown[i][j]==1 && counts[i][j]==0){
                //if(shown[i][j-1]!==undefined && shown[i][j+1]!==undefined){
                if((flags[i][j-1]==0 &&shown[i][j-1]==0) || (flags[i][j+1]==0 &&shown[i][j+1]==0)){
                    return true;
                }
            }
        }
    }
    for (var i=0;i<9;i++){
        for(var j = 0; j < 9; j++){
            if (shown[i][j] == 1 && counts[i][j] == 0){
                if((flags[i-1][j]==0 &&shown[i-1][j]==0) || (flags[i+1][j]==0 &&shown[i+1][j]==0)){
                    return true;
                }
            }
        }
    }
    return false;
}


function expose(x,y){
    reveal(x,y);
    while (expandable()) {
        expand();
    }
}

function plantFlag(x,y){
    if(flags[x][y]==0){
        flags[x][y]=1;
        countRemain--;
        var img=new Image();
        img.src='flag.png';
        img.id='img'+x+y;
        img.style.width='16px';
        img.style.height='16px';
        img.style.visibility='visible';
        var block = document.getElementById('block'+x+y);
        img.onload=function(){
            block.appendChild(img);
            //block.style.backgroundImage=img;
        }
    }
    else if(flags[x][y]==1){
        flags[x][y]=0;
        countRemain++;
        document.getElementById('img'+x+y).style.visibility='hidden';
        //var block = document.getElementById('block'+x+y);
        //block.style.backgroundImage='none';
    }
}

function startTimer(){
    var start = new Date;

    timer=setInterval(function() {
        $('.Timer').text(Math.floor((new Date - start) / 1000));
    }, 1000);
}

function stopTimer(){
    clearInterval(timer);
}

function lose(){
    stopTimer();
    document.getElementById('face').src=('sad.png');
    inGame=false;
    for (var i=0;i<9;i++){
        for(var j=0;j<9;j++){
            if(flags[i][j]==1){
                document.getElementById('img'+i+j).style.width='0';
                document.getElementById('img'+i+j).style.height='0';
            }
            if(mines[i][j]==1){
                var img= new Image();
                img.src='mine.png';
                img.style.width='16px';
                img.style.height='16px';
                
                document.getElementById('block'+i+j).appendChild(img);
            }
        }
    }
}

function checkwin(){
    var count=0;
    for(var i=0;i<9;i++){
        for(var j=0;j<9;j++){
            if(mines[i][j]==1 && flags[i][j]==1){
                count++;
            }
        }
    }
    
    if(count==10){
        stopTimer();
        inGame=false;
        document.getElementById('face').src='sunglass.png';
        return true;
    }
   return false; 
}

// constructor for a mine
/*
function mine (x, y) {
    return {
      'x': x,
        'y': y
    };
}

var ma = mine(1, 2),
    mb = mine(2, 4),
    mc = mine(3, 3);
mines = [ma, mb, mc]

function checkWin() {
    count = 0;
    for (var i = 0; i < mines.length; i++) {
        if (mines.flagged) {
            count++;
        }
    }
    
    if (count === 10) {
        win();
    }
}
*/

function newGame(){
    //countRemain=10;
    setArrays();
    setBoard();
    for(var i=0;i<9;i++){
        for(var j=0;j<9;j++){
            var block = document.getElementById('block'+i+j);
            // with jquery: block.on('click', handler_function);
            // or block.onclick(handler_function);
            block.addEventListener("click",function(){
                if(started==false){
                    startTimer();
                    started=true;
                }
                
                if(started && inGame){
                    var blockId=String(this.id);
                    var x=blockId.charAt(5);
                    var y=blockId.charAt(6);
                    if(mines[x][y]==1){
                        lose();
                    }
                    else{
                        expose(x,y);
                    }
                }
            });
            
            block.addEventListener('contextmenu', function(e) {
                var blockId=String(this.id);
                var x=blockId.charAt(5);
                var y=blockId.charAt(6);
                if(shown[x][y]==0){
                    plantFlag(x,y);
                    score.textContent = countRemain;
                }
                if(checkwin()){
                    alert('You win! Press the smiley face to restart.');
                }
            });
        }
    }
}