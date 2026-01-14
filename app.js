const board = document.querySelector('#board');
var cells;
//globally define kr diya taki age bhi use kr paye
let row,col;
var matrix;
let source_Coordinate ;
 let target_Coordinate  ;
 let delay=10;
// making a method
renderBoard();
function renderBoard(cellWidth=22) {
    //root elemnt cellWidth ko nhi change krega
    const root=document.documentElement;
    root.style.setProperty('--cell-width',`${cellWidth}`)
     row=Math.floor(board.clientHeight / cellWidth);
     col=Math.floor(board.clientWidth / cellWidth);
    // Math.floor to handle floating value nhi kiya toh last me ada cell bhi aa rha hai
    board.innerHTML='';
    cells=[];
    matrix=[];
    
    // it will store data linearly but we want a matrix
    // console.log(row,col);
    for (let i = 0; i < row; i++) {
      const rowArr=[];
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');
        rowElement.setAttribute('id', `${i}`);
        
        // let colList = [];
        for (let j = 0; j < col; j++) {
            const colElement = document.createElement('div');
            colElement.classList.add('col');
            colElement.setAttribute('id', `${i}-${j}`);
            cells.push(colElement);
            rowArr.push(colElement);
            // colElement.setAttribute('id', `${i}-${i}-${j}`);
            rowElement.appendChild(colElement);
// aak baar column bn gya toh col ko rowElement me append krte hue chle ge!..
            // colList.push(colElement);
        }
        matrix.push(rowArr);
        board.appendChild(rowElement);
        // phir har rowElement ko board  me append krege!..
        // matrix.push(colList);   
    }
    source_Coordinate=set('source');
    target_Coordinate=set('target');
    boardInteraction(cells);
    //taaki har time jab board render ho yaani pixel ka size change ho toh cordinates change ho source and target ke toh drag ho jaye
}
//  console.log(matrix);

// ==========================================================
// ====================== CLICK EVENTS ======================
// ==========================================================

const navOptions = document.querySelectorAll(".nav-menu>li>a");
var dropOptions =null ;
const removeActive =(elements,parent=false)=>{
    // by default parentElement false hoga
    elements.forEach(element =>{
        if(parent) element =element.parentElement;
        // agar parent hai toh element parentElement se replace hojayega!..
        element.classList.remove('active');
    });
}
navOptions.forEach(navOption => {
  navOption.addEventListener("click", () => {
    const li =navOption.parentElement;
    if(li.classList.contains('active')){
        li.classList.remove('active');
        return;
    }
    removeActive(navOptions,true);
    
    li.classList.add("active");

    if(li.classList.contains('drop-box')){
        dropOptions=li.querySelectorAll('.drop-menu>li');
        
        toggle_dropOption(navOption.innerText);
    }

    // jitne bhi options hai sab se htanan hh lekin parent elemnet se htana hh
    // e.stopPropagation();
   
    // const currentMenu = option.closest(".drop-menu");
      
    // clear only inside that dropdown
    // currentMenu.querySelectorAll("li").forEach(li => li.classList.remove("active"));

    // set active only for selected one
    // close menus after selection
    // closeAllMenus();
    // clearActiveNav();

    // algorithm logic
    // const parentBox = option.closest("li.drop-box");
    // if (parentBox?.id === "algo") {
    //   const text = option.innerText.trim();
    //   algorithm = text.split(" ")[0];
    //   visualizeBtn.innerText = `Visualize ${algorithm}`;
    // }
  });
});

let pixelSize=22;
let speed='normal';
let algorithm ='BFS';
const visualizeBtn=document.getElementById('visualize')
function toggle_dropOption(target){
    console.log(target);
    dropOptions.forEach(dropOption=>{
      dropOption.addEventListener('click',()=>{
          removeActive(dropOptions);
          dropOption.classList.add('active');

          if(target=='Pixel'){
              pixelSize=+dropOption.innerText.replace('px','');
            //   this innerText is a string so it has a method of replace
              console.log(pixelSize);
              renderBoard(pixelSize);
            //   board append ho ja rha hai toh sbse phle board clear kna hoga
          }
          else if(target=='Speed'){
            speed=dropOption.innerText;
            console.log(speed);
            if(speed=='fast')     delay=6;
            else if(speed == 'normal')
              delay =10;
             else if(speed== 'slow')
                delay =50;
          }
          
          
         
          

          else{
            algorithm= dropOption.innerText.split(' ')[0];
            // uss str ka har word aak array me contain ho ke mil jayega split where there is a space and return its ist word
            // Visualize btn ko bhi 
            // pta chle ki koi algo select hua hai
            console.log(algorithm);
            
            visualizeBtn.innerText=`Visualize ${algorithm}`;
            console.log(visualizeBtn.innerText);
          }
          //option selects hote hi drop close hojaye
          
          removeActive(navOptions,true);
          
      })
      
    })

}

document.addEventListener('click',(e)=>{
  const navMenu=document.querySelector('.nav-menu');
  if(!navMenu.contains(e.target)){
    removeActive(navOptions,true);
  }
})

//---------Board Interaction-----
function isValid(x , y){
   return (x>=0 && y>=0 && x<row && y<col);
}
function set(className, x=-1, y=-1){
   if(isValid(x,y)){
    matrix[x][y].classList.add(className);
   }
   else{
    //agar invalid hote hh toh src or target ko randomly set kr do!...
    x=Math.floor(Math.random()*row);
    y=Math.floor(Math.random()*col);
     matrix[x][y].classList.add(className);
   }
   return {x,y};
}
 
// console.log(source,target);

  let isDrawing=false;
  let isDragging=false;
  let DragPoint=null;

//taaki har time jab board render ho yaani pixel ka size change ho toh cordinates change ho source and target ke toh drag ho jaye
function boardInteraction(cells) {
   cells.forEach((cell)=>{
  const pointerdown = (e)=>{
    if(e.target.classList.contains('source')){
      DragPoint='source';
      isDragging=true;
    }
    else if(e.target.classList.contains('target')){
      DragPoint='target';
      isDragging=true;
    }
    else{
       isDrawing=true;
    }
  }
  const pointermove = (e)=>{
    //  console.log(e.target);
    if(isDrawing){
        e.target.classList.add('wall');
    }
    else if(DragPoint && isDragging){
      //baaki ko piche vle ko clear bhi toh krna hoga
      //instaed of writing forEach loop can remove DragPoint by selecting it   .lagaya as yeh class hai
      document.querySelector(`.${DragPoint}`).classList.remove(`${DragPoint}`);
      
      // console.log(`${DragPoint} moving`);
       e.target.classList.add(`${DragPoint}`)
       //now src and target ko update bhi toh krna hoga
      coordinate=e.target.id.split('-');
      if(DragPoint=='source'){
         source_Coordinate.x=+coordinate[0];
         //also convert string to number and source_Coordinate is an array
         source_Coordinate.y=+coordinate[1];
      }
      else{
        target_Coordinate.x=+coordinate[0]
        target_Coordinate.y=+coordinate[1]
      }
      // console.log(source_Coordinate,target_Coordinate)
    }

  }
  const pointerup = ()=>{
     isDragging=false;
     isDrawing=false;
     DragPoint= null;
  }
  cell.addEventListener('pointerdown',pointerdown)
  cell.addEventListener('pointermove',pointermove)
  cell.addEventListener('pointerup',pointerup)

  cell.addEventListener('click',()=>{
    cell.classList.toggle('wall');
  })
})
}


const clearPathBtn= document.getElementById('clearPath');
const clearBoardBtn= document.getElementById('clearBoard');
// const speedOptions = document.querySelectorAll('#speed .drop-menu li');

// const fast_AnimateDelay = 7;
// const normal_AnimateDelay = 10;
// const slow_AnimateDelay = 50;
// let delay = normal_AnimateDelay;

// speedOptions.forEach((option) => {
//     option.addEventListener('click', () => {
//         let pickedSpeed = option.innerText;
//            console.log(pickedSpeed);
//         // if (pickedSpeed === 'fast') console.log)delay = fast_AnimateDelay;
//         // else if (pickedSpeed === 'normal') delay = normal_AnimateDelay;
//         // else delay = slow_AnimateDelay;
//     })
// })

clearBoardBtn.addEventListener('click',clearBoard);

const clearPath =()=>{
  cells.forEach(cell=>{
    cell.classList.remove('path');
    cell.classList.remove('visited');
  })
}

clearPathBtn.addEventListener('click',clearPath);
const clearWall =()=>{
  cells.forEach(cell=>{
    cell.classList.remove('Wall');
  })
}

function clearBoard(){
  cells.forEach(cell => {
    cell.classList.remove('visited');
    cell.classList.remove('wall');
    cell.classList.remove('path');
  })
}

//-----MAZE GENERATION--------

//Step 1:-Create surronding wall
// Step 2:-Draw walls ,(vertically *or* horizontally) and select cell jispr wall nhi lgani hai
//Step 3:-After drawing walls , two sub Division will be created

var wallToAnimate;
const generateMazeBtn =document.getElementById('generateMazeBtn');
generateMazeBtn.addEventListener('click',()=>{
  wallToAnimate = [];
  generateMaze(0,row-1,0,col-1,false,'horizontal');
  animate(wallToAnimate,'wall',6);
})

// generateMaze(0,row-1,0,col-1,false,'horizontal');

function generateMaze(rowStart,rowEnd,colStart,colEnd,surroundingWall,orientation){
  
  if(rowStart>rowEnd || colStart>colEnd){
    return;
  }

  if(!surroundingWall){
   for(let i=0 ;i<col ;i++){
    if(!matrix[0][i].classList.contains('source') && !matrix[0][i].classList.contains('target'))
      wallToAnimate.push(matrix[0][i]);
    if(!matrix[row-1][i].classList.contains('source') && !matrix[row-1][i].classList.contains('target'))
      wallToAnimate.push(matrix[row-1][i]);
   } 
   for(let i=0; i<row; i++){
    if(!matrix[i][0].classList.contains('source') && !matrix[i][0].classList.contains('target'))
      wallToAnimate.push(matrix[i][0]);
    if(!matrix[i][col-1].classList.contains('source') && !matrix[i][col-1].classList.contains('target'))
      wallToAnimate.push(matrix[i][col-1]);
   }
   surroundingWall=true;
  }
if(orientation=='horizontal'){
  let possibleRows=[];
  for(let i=rowStart; i<=rowEnd; i+=2){
    // if (i == 0 || i == row - 1) continue;
      possibleRows.push(i);
  }
  let possibleCols = [];
  for (let i = colStart - 1; i <= colEnd + 1; i += 2) {
            // if (i <= 0 || i >= col - 1) continue;
            if(i>0 && i<col-1)
              possibleCols.push(i);
        }
      //we need a random row jispr wall add hai 
   let currentRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];
  //we need a random column jisse wall htana hai 
      let colRandom = possibleCols[Math.floor(Math.random() * possibleCols.length)];

   //drawing horizontal wall
   //colStart - 1 colEnd + 1 because when we will create subdivisions then aak col piche and aak col aage reh jayega 
        for (i = colStart - 1; i <= colEnd + 1; i++) {
            const cell = matrix[currentRow][i];
             if (!cell || i === colRandom || cell.classList.contains('source') || cell.classList.contains('target'))
                continue;
            // cell.classList.add('wall');
            wallToAnimate.push(cell)
        }
      
            generateMaze(rowStart, currentRow - 2, colStart, colEnd,surroundingWall,((currentRow-2)-rowStart>colEnd-colStart)? 'horizontal':'vertical');

            generateMaze(currentRow + 2, rowEnd, colStart, colEnd,surroundingWall,(rowEnd-(currentRow+2)>colEnd-colStart)? 'horizontal':'vertical');
      }
      //=========== vertical ======
      else if (orientation === 'vertical') {
        let possibleCols = [];
              for(let i=colStart; i<=colEnd; i+=2){
          // if (i == 0 || i == row - 1) continue;
            possibleCols.push(i);
        }
        let possibleRows = [];
        for (let i = rowStart - 1; i <= rowEnd + 1; i += 2) {
                  // if (i <= 0 || i >= col - 1) continue;
                  if(i>0 && i<row-1)
                    possibleRows.push(i);
              }
        let currentCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];
        let rowRandom = possibleRows[Math.floor(Math.random() * possibleRows.length)];

        for(let i=rowStart-1; i<=rowEnd+1 ; i++){
           if (!matrix[i]) continue;

            const cell = matrix[i][currentCol];
            if(i==rowRandom ||cell.classList.contains('source') || cell.classList.contains('target'))
              continue;
            // cell.classList.add('wall');
            wallToAnimate.push(cell);
        }

        generateMaze(rowStart,rowEnd,colStart,currentCol-2,surroundingWall,(rowEnd-rowStart>(currentCol-2)-colStart? 'horizontal':'vertical'))
        generateMaze(rowStart,rowEnd,currentCol+2,colEnd,surroundingWall,(rowEnd-rowStart>(currentCol-2)-colStart? 'horizontal':'vertical'))
      }
   }


//==============PathFinding================


// ==========================================================
// ======================= BFS ⚙️🦾 ========================
// ==========================================================
var visitedCell;
var pathToAnimate;
//Target se path backtrack krna hai to source
visualizeBtn.addEventListener('click',()=>{
  visitedCell=[];
  pathToAnimate=[];
const startTime = performance.now();
  switch (algorithm){
    
    case 'BFS':
      clearPath();
        BFS();
       break;
    case 'DFS':
      clearPath();
      if(DFS(source_Coordinate)){
    pathToAnimate.push(matrix[source_Coordinate.x][source_Coordinate.y]);
  }
      break;

    case "Dijkstra's":
      clearPath();
      Dijkstra();
      break;
    
    case 'Greedy':
      clearPath();
      greedy();
      break;

    case 'A*':
      clearPath();
      Astar();
      break;
    
    default:
      break;  

  }

  
  // DFS(source_Coordinate);  aisa krne se aak yellow hona rehgaya
  const endTime = performance.now();
  const timeTaken = (endTime - startTime).toFixed(2);
  const visited= visitedCell.length;
 
  console.log(`Time Taken: ${timeTaken} ms`);
 


 document.getElementById('time').innerText =
  `Time: ${timeTaken} ms`;
 document.getElementById('visitedCell').innerText =
  `visitedCell: ${visited} `;
 


  animate(visitedCell,'visited',delay);

 const pathLength= pathToAnimate.length;
  console.log(`Path Length: ${pathLength} ms`);

  document.getElementById('pathLength').innerText =
  `pathLength: ${pathLength} `;

  setTimeout(() => {
    console.log("doing NOTHING")
  }, delay*100);


 
  
})

function BFS() {
    const queue = [];
    const visited = new Set();
    //yeh dhyaan rkhe ga ki abhi queue ke andar kon kon hai
    const parent = new Map();
    queue.push(source_Coordinate);
    visited.add(`${source_Coordinate.x}-${source_Coordinate.y}`);

    while (queue.length > 0) {
        const current = queue.shift();
        visitedCell.push(matrix[current.x][current.y]);
        // searchToAnimate.push(matrix[current.x][current.y]);
     
        //you find the Target
        if (current.x === target_Coordinate.x && current.y ===
          target_Coordinate.y) {
            getPath(parent, target_Coordinate);
            // pathToAnimate = backtrack(parent, target).reverse();
            return;
        }

        const neighbours = [
          {x: current.x-1, y: current.y},//up
          {x: current.x, y: current.y+1},//right
          {x: current.x+1, y: current.y},//bottom
          {x: current.x, y: current.y-1}//left
        ];

        for (const neighbour of neighbours) {
            //should be be valid
            //shouldn't be wall
            //shouldn't be visited
            const key = `${neighbour.x}-${neighbour.y}`;
            if (isValid(neighbour.x, neighbour.y) &&
                !matrix[neighbour.x][neighbour.y].classList.contains('wall') &&
                !visited.has(key)) {
                   visited.add(key);
                   queue.push(neighbour);
                   parent.set(key, current);
            }
        }
    }

}


// ==========================================================
// ==================== ANIMATION ⚙️🦾 =====================
// ==========================================================

// function animate(list, className, delay) {
function animate(elements, className,delay=10) {
  
  if(className === 'path'){
    delay *=3.5;
  }
  console.log('delay: ');
  console.log(delay);
    // clearPreviousTimeouts(); 
    // if(algorithm == 'Bi' && className == 'visited'){
    //     delay /= 1.5;
    // }
    for (let i = 0; i <elements.length; i++) {
        // let timeoutId = setTimeout(() => {
          setTimeout(() => {
            // if (className === 'wall') {
            //     elements[i].setAttribute('class', `col ${className}`);
            // } else {
                // elements[i].classList.remove('visited', 'unvisited', 'path');
                elements[i].classList.remove('visited' );
                elements[i].classList.add(className);
                //agar i last element visit hogya 
                if(i === elements.length-1 && className === 'visited'){
                  // console.log("search finished");
                  animate(pathToAnimate,'path');
                }
            },delay * i);

            // After searching is done, animate the path
            // if (className === 'visited' && i === list.length - 1) {
            //     animate(pathToAnimate, 'path', delay);
            // }
        // }, (className === 'path') ? i * (delay + 20) : i * delay);

        // timeoutIds.push(timeoutId);  
    }
}


function getPath(parent, target) {
  if(!target) return;

  //src ka parent nhi hoga toh return 
    // let arr = [];
    // while (target) {
        pathToAnimate.push(matrix[target.x][target.y]);
        // if (target == source) return arr;
        const p = parent.get(`${target.x}-${target.y}`);
    // }
    getPath(parent,p);
}

//========DIJKSTRA'S ALGORITHM======
//revisit possible visuted not used; one src and multiple destination ; relaxation method
//========PriorityQueue=============

class PriorityQueue {
    constructor() {
      //phle koi bhi element nhi hai
        this.elements = [];
        this.length = 0;
    }
    push(data) {
        this.elements.push(data);
        this.length++;
        // data joh abhi push kiya uska idx length-1 hoga and use upHeapify kro
        this.upHeapify(this.length - 1);
    }
    pop() {
        this.swap(0, this.length - 1);
        const popped = this.elements.pop();
        this.length--;
        this.downheapify(0);
        return popped;
    }

    upHeapify(i) {
        if (i === 0) return;
        const parent = Math.floor((i - 1) / 2);
        if (this.elements[i].cost < this.elements[parent].cost) {
            this.swap(parent, i);
            this.upHeapify(parent);
        }
    }
    downheapify(i) {
        let minNode = i;
        const leftChild = (2 * i) + 1;
        const rightChild = (2 * i) + 2;
        //say i ->leaf node then leftChild / rightChild not valid
        if (leftChild < this.length && this.elements[leftChild].cost < this.elements[minNode].cost) {
            minNode = leftChild;
        }
        if (rightChild < this.length && this.elements[rightChild].cost < this.elements[minNode].cost) {
            minNode = rightChild;
        }
          
        if (minNode !== i) {
            this.swap(minNode, i);
            this.downheapify(minNode);
        }
    }
    isEmpty() {
        return this.length === 0;
    }
    swap(x, y) {
      //array destructuring...
        [this.elements[x], this.elements[y]] = [this.elements[y], this.elements[x]];
    }
}

// const pq=new PriorityQueue();
// pq.push({cost:2});
// pq.push({cost :5});
// pq.push({cost :8});

// console.log(pq.pop());
// console.log(pq.pop());
// console.log(pq.pop());


function Dijkstra() {
    const pq = new PriorityQueue();
   
    //yeh dhyaan rkhe ga ki abhi queue ke andar kon kon hai
    const parent = new Map();
    const distance=[];
    for(let i=0; i<row ;i++){
      const INF=[];
       for(let j=0; j<col ;j++){
          INF.push(Infinity);
       }
       distance.push(INF);
    }
    distance[source_Coordinate.x][source_Coordinate.y]=0;
    pq.push({coordinate: source_Coordinate,cost:0});
    

    while (!pq.isEmpty()) {
        const {coordinate: current ,cost : distanceSoFar} = pq.pop();
        visitedCell.push(matrix[current.x][current.y]);
        // searchToAnimate.push(matrix[current.x][current.y]);
     
        //you find the Target
        if (current.x === target_Coordinate.x && current.y ===
          target_Coordinate.y) {
            getPath(parent, target_Coordinate);
            // pathToAnimate = backtrack(parent, target).reverse();
            return;
        }

        const neighbours = [
          {x: current.x-1, y: current.y},//up
          {x: current.x, y: current.y+1},//right
          {x: current.x+1, y: current.y},//bottom
          {x: current.x, y: current.y-1}//left
        ];

        for (const neighbour of neighbours) {
            //should be be valid
            //shouldn't be wall
            //shouldn't be visited
            const key = `${neighbour.x}-${neighbour.y}`;
            if (isValid(neighbour.x, neighbour.y) &&
                !matrix[neighbour.x][neighbour.y].classList.contains('wall'))
                 {
                 //Assuming edge weight=1,between adjacent vertices
                 const edgeWeight=1 ; 
                 const distanceToNeighbour=distanceSoFar + edgeWeight;
                 if(distanceToNeighbour<distance[neighbour.x][neighbour.y]){
                  distance[neighbour.x][neighbour.y]=distanceToNeighbour;
                 
                   pq.push({coordinate: neighbour,cost:distanceToNeighbour});
                   parent.set(key, current);
                 }
            }
        }
    }

}

//Greedy Algorithm -> BFS but chooses wisely ->app uss path pr jao jo apho apke target ke closer le jaye

function heuristicValue(node) {
  // return dx+dy
    return Math.abs(node.x - target_Coordinate.x) + Math.abs(node.y - target_Coordinate.y);
}


function greedy() {
  //greedy uses priority queue
    const queue = new PriorityQueue();
    const visited = new Set();
    //yeh dhyaan rkhe ga ki abhi queue ke andar kon kon hai
    const parent = new Map();
    queue.push({coordinate:source_Coordinate, cost:heuristicValue(source_Coordinate)});
    visited.add(`${source_Coordinate.x}-${source_Coordinate.y}`);

    while (queue.length > 0) {
      //miminum heuristicValue vala hi pop hoga
        const {coordinate:current} = queue.pop();
        visitedCell.push(matrix[current.x][current.y]);
        // searchToAnimate.push(matrix[current.x][current.y]);
     
        //you find the Target
        if (current.x === target_Coordinate.x && current.y ===
          target_Coordinate.y) {
            getPath(parent, target_Coordinate);
            // pathToAnimate = backtrack(parent, target).reverse();
            return;
        }

        const neighbours = [
          {x: current.x-1, y: current.y},//up
          {x: current.x, y: current.y+1},//right
          {x: current.x+1, y: current.y},//bottom
          {x: current.x, y: current.y-1}//left
        ];

        for (const neighbour of neighbours) {
            //should be be valid
            //shouldn't be wall
            //shouldn't be visited
            const key = `${neighbour.x}-${neighbour.y}`;
            if (isValid(neighbour.x, neighbour.y) &&
                !matrix[neighbour.x][neighbour.y].classList.contains('wall') &&
                !visited.has(key)) {
                   visited.add(key);
                   queue.push({coordinate:neighbour,cost:heuristicValue(neighbour)});
                   parent.set(key, current);
            }
        }
    }

}

//Astar Algorithm 
//Astar = Dijkstra + Greedy
//          dist   +  heuristicValue
//

function Astar() {
  //greedy uses priority queue
    const queue = new PriorityQueue();
    const visited = new Set(); //bas name change krta hai visited=closed set
    //yeh dhyaan rkhe ga ki abhi queue ke andar kon kon hai
    const queued = new Set();//bas name change krta hai queued=open set
    // queued tracks ki kon sa element abhi queue ke andar present hai
    
    const parent = new Map();

     const gScore=[];
    for(let i=0; i<row ;i++){
      const INF=[];
       for(let j=0; j<col ;j++){
          INF.push(Infinity);
       }
       gScore.push(INF);
    }

    gScore[source_Coordinate.x][source_Coordinate.y]=0;
    //0 is distance of source
    queue.push({coordinate:source_Coordinate, cost: heuristicValue(source_Coordinate)});
    queued.add(`${source_Coordinate.x}-${source_Coordinate.y}`);
    // visited.add(`${source_Coordinate.x}-${source_Coordinate.y}`);

    while (queue.length > 0) {
      //miminum heuristicValue vala hi pop hoga
        const {coordinate:current} = queue.pop();
        visitedCell.push(matrix[current.x][current.y]);
        // searchToAnimate.push(matrix[current.x][current.y]);
     
        //you find the Target
        if (current.x === target_Coordinate.x && current.y ===
          target_Coordinate.y) {
            getPath(parent, target_Coordinate);
            // pathToAnimate = backtrack(parent, target).reverse();
            return;
        }
        //target ke equal ho gya toh theek hai nhi toh visited ke andar add kr denge yaani finalize ho gya
        visited.add(`${current.x}-${current.y}`);//finalize ho gya

        const neighbours = [
          {x: current.x-1, y: current.y},//up
          {x: current.x, y: current.y+1},//right
          {x: current.x+1, y: current.y},//bottom
          {x: current.x, y: current.y-1}//left
        ];

        for (const neighbour of neighbours) {
            //should be be valid
            //shouldn't be wall
            //shouldn't be visited
            const key = `${neighbour.x}-${neighbour.y}`;
            if (isValid(neighbour.x, neighbour.y) &&
                !matrix[neighbour.x][neighbour.y].classList.contains('wall') &&
                !visited.has(key) && !queued.has(key)) {
                   //Assuming edge weight=1,between adjacent vertices
                 const edgeWeight=1 ; 
                 //distanceSoFar=distance[neighbour.x][neighbour.y]
                 const gScoreToNeighbour=gScore[current.x][current.y] + edgeWeight;
                 const fScore=gScoreToNeighbour + heuristicValue(neighbour);
                 if(gScoreToNeighbour<gScore[neighbour.x][neighbour.y]){
                  gScore[neighbour.x][neighbour.y]=gScoreToNeighbour;
                 
                   
                  queue.push({coordinate: neighbour,cost:fScore});
                  queued.add(key); 
                  parent.set(key, current);
                 }
            }
        }
    }

}

//DFS is worst algorithm of all in pathFinding ALgo as it is recursive
const visited =new Set();
function DFS(current){
  if(current.x === target_Coordinate.x && current.y === target_Coordinate.y){
    return true;
  }

  visitedCell.push(matrix[current.x][current.y]);
  visited.add(`${current.x}-${current.y}`);
  // visitedCell.push(matrix)

  const neighbours = [
          {x: current.x-1, y: current.y},//up
          {x: current.x, y: current.y+1},//right
          {x: current.x+1, y: current.y},//bottom
          {x: current.x, y: current.y-1}//left
  ];

  for (const neighbour of neighbours) {
    if(isValid(neighbour.x, neighbour.y) &&
        !visited.has(`${neighbour.x}-${neighbour.y}`)
        && !matrix[neighbour.x][neighbour.y].classList.contains('wall')){
         if(DFS(neighbour)) {
          //backtrack kud ho jayega as recursion hai...
          pathToAnimate.push(matrix[neighbour.x][neighbour.y]);
          return true;
         }
        }
  }
}