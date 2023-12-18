import { ValueTypes, RuntimeValue, NumberValue, NullValue } from './values.ts';
import {
  BinaryExpression,
  NodeType,
  NumericLiteral,
  Stmt,
  Program
} from '../frontend/ast.ts';

function evaluateProgram(program: Program): RuntimeValue {
  let lastEvaluated: RuntimeValue = { type: 'null', value: 'nil' } as NullValue;

  for (const stmt of program.body) {
    lastEvaluated = evaluate(stmt);
  }

  return lastEvaluated;
}

function evaluateNumericBinaryExpression(
  lhs: NumberValue,
  rhs: NumberValue,
  operator: string
): NumberValue {
  let result: number;

  if (operator === '+') {
    result = lhs.value + rhs.value;
  } else if (operator === '-') {
    result = lhs.value - rhs.value;
  } else if (operator === '*' || operator === 'X') {
    result = lhs.value * rhs.value;
  } else if (operator === '/') {
    if (rhs.value === 0 || lhs.value === 0) {
      console.error('Type Error: Division by zero');
      Deno.exit(1);
    }
    result = lhs.value / rhs.value;
  } else if (operator === '%') {
    result = lhs.value % rhs.value;
  } else {
    console.error('Type Error: Unknown operator:', operator);
    Deno.exit(1);
  }

  return { value: result, type: 'number' };
}

function evaluateBinaryExpression(binop: BinaryExpression): RuntimeValue {
  const lhs = evaluate(binop.left);
  const rhs = evaluate(binop.right);

  if (lhs.type == 'number' && rhs.type == 'number') {
    return evaluateNumericBinaryExpression(
      lhs as NumberValue,
      rhs as NumberValue,
      binop.operator
    );
  }

  return { type: 'null', value: 'nil' } as NullValue;
}

export function evaluate(node: Stmt): RuntimeValue {
  switch (node.kind) {
    case 'NumericLiteral':
      return {
        value: (node as NumericLiteral).value,
        type: 'number'
      } as NumberValue;
    case 'NullLiteral':
      return { value: 'nil', type: 'null' } as NullValue;
    case 'BinaryExpression':
      return evaluateBinaryExpression(node as BinaryExpression);
    case 'Program':
      return evaluateProgram(node as Program);
    default:
      console.error('Type Error: Unknown node type:', node.kind);
      Deno.exit(1);
  }
}
