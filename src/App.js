import throttle from 'lodash/throttle';
import { useEffect, useState } from 'react';
import './App.css';
import Key from './components/Key';
import KeyPad from './components/KeyPad';
import Screen from './components/Screen';
import Wrapper from './components/Wrapper';
import evaluateExpression from './utils/evaluateExpression';
import handleKeypress from './utils/handleKeypress';

const portraitLayout = [
	['AC', '( )', '^', '/'],
	['7', '8', '9', '*'],
	['4', '5', '6', '-'],
	['1', '2', '3', '+'],
	['0', '.', 'C', '='],
];

const landscapeLayout = [
	['7', '8', '9', '/', 'AC'],
	['4', '5', '6', '*', '( )'],
	['1', '2', '3', '-', '^'],
	['0', '.', 'C', '+', '='],
];

function App() {
	const [display, setDisplay] = useState({
		expression: '',
		result: '',
		error: '',
	});
	const [layout, setLayout] = useState(portraitLayout);

	function updateDisplay(display, key) {
		let expression = handleKeypress(display, key);
		let result = '';
		let error = '';

		try {
			result = evaluateExpression(expression);
		} catch (e) {
			error = e;
			console.error(e);
		}

		if (expression == result) result = '';

		setDisplay({
			expression: expression,
			result: result,
			error: error,
		});
	}

	//watches for window resize and updates keyboard layout if the key pad grid changes.
	useEffect(() => {
		setLayout(
			getComputedStyle(document.getElementById('keyPad')).gridTemplateColumns.split(' ').length == 4
				? portraitLayout
				: landscapeLayout
		);
		const updateLayout = throttle(function () {
			setLayout(
				getComputedStyle(document.getElementById('keyPad')).gridTemplateColumns.split(' ').length == 4
					? portraitLayout
					: landscapeLayout
			);
		}, 10);
		window.addEventListener('resize', updateLayout);
		return () => window.removeEventListener('resize', updateLayout);
	}, []);

	return (
		<Wrapper>
			<Screen expression={display.expression} result={display.result} error={display.error} />
			<KeyPad>
				{layout.flat().map((key) => {
					return <Key key={key} value={key} onClick={() => updateDisplay(display, key)} />;
				})}
			</KeyPad>
			<p className='attribution'>Created by Ethan Motaco</p>
		</Wrapper>
	);
}

export default App;
