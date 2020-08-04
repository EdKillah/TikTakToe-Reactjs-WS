
function tick(){
	const element = (
		<div>
			<h1>Hello Bro!</h1>
			<h2>It is {new Date().toLocaleTimeString()}. </h2>
		</div>
	);
	ReactDOM.render(element, document.getElementById('root2'));
}

//Usualmente se llama ReactDOM.render una sola vez
//Aqui lo estamos llamando cada segundo (Bad)
setInterval(tick, 1000);

//Aqui solo se llama una sola vez (Good)
ReactDOM.render(
	<h1>Hello World!</h1>,
	document.getElementById('root')
);

// Ninguno de los siguientes fragmentos de codigo
// esta siendo llamado por lo tanto no aparece en index
// Solo sirven para ver las diferentes formas de renderizar

//Para solventar el problema de un solo uso del render
//Usamos funciones con props.
function WelcomeFunction(props){
	return <h1> Hello, {props.name}! </h1>;
}

//Se pueden usar clases tambien para definir componentes
class Welcome extends React.Component {
	render() {
		return <h1> Hello, {props.name}</h1>;
	}
}

