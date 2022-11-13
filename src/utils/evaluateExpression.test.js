import evaluateExpression, { evaluatePostfix, infixToPostfix, tokenizeExpression } from './evaluateExpression';

describe('Expression evaluator', () => {
	it('adds', () => {
		expect(evaluateExpression('2 + 2')).toBe('4');
	});

	it('subtracts', () => {
		expect(evaluateExpression('2 - 2')).toBe('0');
	});

	it('multiplies', () => {
		expect(evaluateExpression('2 * 2')).toBe('4');
	});

	it('divides', () => {
		expect(evaluateExpression('2 / 2')).toBe('1');
	});

	it('exponentiates', () => {
		expect(evaluateExpression('2 ^ 2')).toBe('4');
	});

	it('handles parentheses', () => {
		expect(evaluateExpression('2 ^ (2 + 2)')).toBe('16');
	});

	it('handles negative numbers', () => {
		expect(evaluateExpression('-2 - 2')).toBe('-4');
	});

	it('handles decimals', () => {
		expect(evaluateExpression('2.22 + 2.78')).toBe('5');
	});

	it('handles complex expressions', () => {
		expect(evaluateExpression('2 + (-2 + 2 * (2 + 2 / 2.5) - -2)')).toBe('7.6');
	});

	it('handles NaN', () => {
		expect(function () {
			evaluateExpression('0 / 0');
		}).toThrow('NaN');
	});

	it('handles large numbers', () => {
		expect(function () {
			evaluateExpression(Number.MAX_SAFE_INTEGER + 1 + '');
		}).toThrow('number out of range');
		expect(function () {
			evaluateExpression(Number.MIN_SAFE_INTEGER - 1 + '');
		}).toThrow('number out of range');
	});

	it('handles invalid expressions', () => {
		expect(function () {
			evaluateExpression('(2 + 2');
		}).toThrow('invalid expression');
	});
});

describe('Expression tokenizer', () => {
	it('tokenizes an expression', () => {
		expect(tokenizeExpression('-2--2')).toStrictEqual(['', '-2', '', '~', '', '-2', '']);
	});
});

describe('Infix to postfix converter', () => {
	it('converts tokenized infix expression to postfix', () => {
		expect(infixToPostfix('-2--2')).toBe('-2 -2 ~');
	});
});

describe('Posfix evaluator', () => {
	it('evaluates a postfix expression', () => {
		expect(evaluatePostfix('-2 -2 ~')).toBe(0);
	});
});
