// Retorna la url del servicio. Es una función de configuración.
function BBServiceURL() {
    return 'ws://localhost:8080/TTTService';
}


class WSBBChannel {
    constructor(URL, callback) {
        this.URL = URL;
        this.wsocket = new WebSocket(URL);
        this.wsocket.onopen = (evt) => this.onOpen(evt);
        this.wsocket.onmessage = (evt) => this.onMessage(evt);
        this.wsocket.onerror = (evt) => this.onError(evt);
        this.receivef = callback;
        this.starterValue = null;
    }


    onOpen(evt) {
        console.log("In onOpen", evt);
        
        //pedir  ticket (get) (fetch)
        //Enviar ticket por websocket 
    }
    onMessage(evt) {
        console.log("In onMessage", evt);
        // Este if permite que el primer mensaje del servidor no se tenga en cuenta.
        // El primer mensaje solo confirma que se estableció la conexión.
        // De ahí en adelante intercambiaremos solo puntos(x,y) con el servidor
        
        if (evt.data != "Connection established.") {    
            	if (evt.data === "inicial: O" || evt.data === "inicial: X") {
            		const value = evt.data.length;            		
            		this.receivef(`{"inicial": "${evt.data[value-1]}"}`);
            	}else{
            		this.receivef(evt.data);
            	}
            
        }
    }
    onError(evt) {
        console.error("In onError", evt);
    }

    send(x, y) {
    	
        let msg = `{ "position" : ${x} , "xIsNext": ${y} }`;
        this.wsocket.send(msg);        
    }


}


alert("Entrando");
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      squares: Array(9).fill(false),
      xIsNext: true,
      inicial: null,
    };
      this.comunicationWS =
                new WSBBChannel(BBServiceURL(),
                        (msg) => {                        
                    var obj = JSON.parse(msg);
                    console.log("Este es el JSON: ",obj);
                    
                    let starterValue;
                    if(obj.inicial){
                    	starterValue = obj.inicial == 'X'? 'X' : 'O';
						console.log("El valor inicial",starterValue);
						this.setState({
                    		squares : this.state.squares,
                    		xIsNext : this.state.xIsNext,
                    		inicial : this.state.inicial === null? starterValue : this.state.inicial, 
                    	});    					         	
                    }
                    else{
                    this.setState({
                    		squares : this.state.squares,
                    		xIsNext : obj.xIsNext,
                    		inicial : this.state.inicial === null? starterValue : this.state.inicial, 
                    	});
                    }                  	                                  	          
                    	this.handleClick(obj.position,true);
                                       	                                                                              
                });
       
  }

  handleClick(i,band) {
    const squares = this.state.squares.slice();
    //console.log("SQUARES HANDLE: ",squares,"band: ",band);
    if(!band){
    	console.log("Bandera de prueba del band: ",band);
    }            
    if (calculateWinner(squares) || squares[i]) { 
    	//console.log("Condicion no pinta"); 
      return;
    } else if(!band && this.state.inicial == "O" && this.state.xIsNext){    	
    	return;
    } else if(!band && this.state.inicial == "X" && !this.state.xIsNext){    	
    	return;
    }
        
    
    if(i){
    	squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
      		squares: squares,
      		xIsNext: !this.state.xIsNext,
      		inicial: this.state.inicial,
    	});
    	     	
    	this.comunicationWS.send(i, this.state.xIsNext);
    	    
    }
    
    
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let inicial = 'Your token: ' + this.state.inicial;
    
    let status;    
    if (winner) {
      status = 'Winner: ' + winner;
      
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
	//console.log("Estado: ", this.state);
     
    return (
      <div>
      	<div className="status">{inicial}</div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
        </div>
        <div className="board-row">
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(6)}
        </div>
        <div className="board-row">
          {this.renderSquare(7)}
          {this.renderSquare(8)}
          {this.renderSquare(9)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>          
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('tiktaktoe')
);

function calculateWinner(squares) {
  const lines = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
