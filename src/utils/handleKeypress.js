//handles the logic and behavior of each keypress, returns an expression
export default function handleKeypress(display, key) {
	let expression = display.expression;
	let tokens;

	switch (key) {
		case 'AC': //clear all
			expression = '';
			break;
		case 'C': //backspace
			expression = display.expression.substring(0, display.expression.length - 1);

			break;

		case '=': //evaluate expression
			if (display.expression.length == 0) {
				break;
			}
			expression = display.error ? '' : display.result ? display.result : display.expression;

			break;

		case '( )': //parens logic
			tokens = display.expression.split('');
			if ((tokens.length == 0 || tokens[tokens.length - 1].match(/([*^+(-\/])/)) && tokens[tokens.length - 1] !== ')') {
				expression = display.expression.concat(['(']);
			} else if (tokens[tokens.length - 1] == ')') {
				expression = display.expression.concat(['*(']);
			} else {
				if (
					(tokens[tokens.length - 1].match(/([0-9]+\.?[0-9]?)/) || tokens[tokens.length - 1] == ')') &&
					tokens.filter((t) => t == '(').length > tokens.filter((t) => t == ')').length
				) {
					expression = display.expression.concat([')']);
				} else {
					break;
				}
			}

			break;

		case '0': //numbers may need '*' added after ')'
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
			tokens = display.expression.split('');

			if (tokens.length > 0 && tokens[tokens.length - 1] == ')') {
				expression = display.expression.concat(['*' + key]);
			} else {
				expression = display.expression.concat([key]);
			}

			break;

		// these tokens must follow a number or paren and cannot be first
		case '/':
		case '+':
		case '*':
		case '^':
			tokens = display.expression.split('');

			if (tokens.length == 0 || (tokens.length > 0 && tokens[tokens.length - 1].match(/([*^(.+-\/])/))) {
				break;
			}

			expression = display.expression.concat([key]);

			break;
		case '.': // add a leading zero according to context
			tokens = display.expression.split('');
			if (tokens.length == 0) {
				expression = display.expression.concat(['0.']);
			} else if (tokens[tokens.length - 1] == ')' || tokens[tokens.length - 1] == '.') {
				break;
			} else if (tokens[tokens.length - 1].match(/([*^+-\/(])/)) {
				expression = display.expression.concat(['0.']);
			} else {
				for (let i = tokens.length - 1; i >= 0; i--) {
					if (tokens[i] == '.') {
						break;
					}
					if (i == 0 || tokens[i].match(/([*^+-\/(])/)) {
						expression = display.expression.concat(['.']);
						break;
					}
				}
			}

			break;
		case '-': // can be either unary or binary
			tokens = display.expression.split('');

			if (
				(tokens.length >= 2 && tokens[tokens.length - 1] == '-' && tokens[tokens.length - 2] == '-') ||
				(tokens.length >= 1 && tokens[tokens.length - 1] == '-' && tokens[tokens.length - 2] == '(')
			) {
				break;
			}

			expression = display.expression.concat('-');

			break;
		default:
			break;
	}

	return expression;
}
