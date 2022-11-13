//stores the configuration for each operator. more operations can be added later
const ops = {
	'^': {
		precedence: 9, //PEMDAS order
		associativity: 'R', //wether the operator evaluates to the left or the right of the operand when precedence is the same
		//Left: [ (a ~ b) ~ c ] vs Right: [ a ~ (b ~ c) ]

		// the operation performed by the operator
		operation: (a, b) => {
			return Math.pow(b, a);
		},
	},
	'*': {
		precedence: 8,
		associativity: 'L',
		operation: (a, b) => {
			return b * a;
		},
	},
	'/': {
		precedence: 8,
		associativity: 'L',
		operation: (a, b) => {
			return b / a;
		},
	},
	'+': {
		precedence: 6,
		associativity: 'L',
		operation: (a, b) => {
			return b + a;
		},
	},
	'~': {
		//binary operator for subtract '-'
		precedence: 6,
		associativity: 'L',
		operation: (a, b) => {
			return b - a;
		},
	},
};

function isNum(token) {
	return token.match(/([0-9]+\.?[0-9]?)/);
}

function isOp(token) {
	return token.match(/([*^+~\/])/);
}

function tokenizeExpression(expression) {
	let expressionArr = expression.split('');

	//replacing '-' with binary operatator '~' based on context
	for (let i = 0; i < expressionArr.length; i++) {
		if (expressionArr[i] === '-') {
			if (i > 0 && (expressionArr[i - 1] == ')' || expressionArr[i - 1] == '.' || isNum(expressionArr[i - 1]))) {
				expressionArr[i] = '~';
			} else if (expressionArr[i + 1] == '(') {
				expressionArr.splice(i, 1, '-1*');
			}
		}
	}

	//if there is an op at the end of the expression, pop it so the expression still evaluates.
	if (isOp(expressionArr[expressionArr.length - 1])) {
		expressionArr.pop();
	}

	return expressionArr.join('').split(/(-?[0-9]+\.?[0-9]*|[*^+~\/()]{1})/);
}

//uses shunting yard algorithm to convert from infix to postfix notation https://en.wikipedia.org/wiki/Shunting_yard_algorithm
function infixToPostfix(expression) {
	let tokens = tokenizeExpression(expression);
	let output = [];
	let opStack = [];

	//loop through each token from left to right
	while (tokens.length != 0) {
		let token = tokens.shift();

		//numbers are added to output
		if (isNum(token)) {
			output.push(token);
		}

		//operators are placed on the stack and moved to the output based on precendence
		else if (isOp(token)) {
			while (
				(ops[token].associativity == 'L' &&
					ops[token].precedence <= (ops[opStack[opStack.length - 1]]?.precedence ?? -1)) ||
				(ops[token].associativity == 'R' &&
					ops[token].precedence < (ops[opStack[opStack.length - 1]]?.precedence ?? -1))
			) {
				output.push(opStack.pop());
			}

			opStack.push(token);
		}

		//opening parenthesis can be added to output
		else if (token == '(') {
			opStack.push(token);
		} else if (token == ')') {
			//pop off the stack until an opening parenthesis is found
			while (opStack[opStack.length - 1] != '(') {
				//if no closing parenthesis is found throw an error.
				if (opStack.length == 0) throw 'invalid expression';

				output.push(opStack.pop());
			}
			opStack.pop();
		}
	}

	while (opStack.length != 0) {
		//if there are still parentheses left on that stack there is an error
		if (!opStack[opStack.length - 1].match(/([()])/)) output.push(opStack.pop());
		else throw 'invalid expression';
	}
	return output.join(' ');
}

//evaluates postfix expression https://en.wikipedia.org/wiki/Reverse_Polish_notation
function evaluatePostfix(expression) {
	let tokens = expression.split(' ');
	let evalStack = [];

	while (tokens.length != 0) {
		let token = tokens.shift();

		//if the token is a number, push to eval stack
		if (isNum(token)) {
			evalStack.push(token);
		}

		//if the token is an operator, evaluate the last two operands on the stack
		else if (isOp(token)) {
			let a = evalStack.pop();
			let b = evalStack.pop();

			//performs the current operation on the two operands
			let result = ops[token].operation(parseFloat(a), parseFloat(b));
			evalStack.push(result);
		}
	}
	return evalStack.pop();
}

export default function evaluateExpression(expression) {
	if (!expression.length) {
		return '';
	}
	let result = evaluatePostfix(infixToPostfix(expression.replace(/\s/g, '')));
	if (result > Number.MAX_SAFE_INTEGER || result < Number.MIN_SAFE_INTEGER) {
		throw 'number out of range';
	}
	if (isNaN(result)) {
		throw 'NaN';
	}
	return result.toString();
}

export { evaluatePostfix, tokenizeExpression, infixToPostfix };
