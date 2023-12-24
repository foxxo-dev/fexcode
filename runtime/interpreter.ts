import { RuntimeValue, NumberValue, NullValue, MK_NULL } from './values.ts';
import {
  BinaryExpression,
  NumericLiteral,
  Stmt,
  Program,
  Identifier
} from '../frontend/ast.ts';
import Enviorment from './enviorment.ts';

function evaluateProgram(program: Program, env: Enviorment): RuntimeValue {
  let lastEvaluated: RuntimeValue = MK_NULL();

  for (const stmt of program.body) {
    lastEvaluated = evaluate(stmt, env);
  }

  return lastEvaluated;
}

function evaluateNumericBinaryExpression(
  lhs: NumberValue,
  rhs: NumberValue,
  operator: string
): NumberValue {
  let result: number = 0;

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

function evaluateBinaryExpression(
  binop: BinaryExpression,
  env: Enviorment
): RuntimeValue {
  const lhs = evaluate(binop.left, env);
  const rhs = evaluate(binop.right, env);

  if (lhs.type == 'number' && rhs.type == 'number') {
    return evaluateNumericBinaryExpression(
      lhs as NumberValue,
      rhs as NumberValue,
      binop.operator
    );
  }

  return MK_NULL();
}

function evaluateIdentifier(id: Identifier, env: Enviorment): RuntimeValue {
  return env.getVar(id.symbol);
}

export function evaluate(node: Stmt, env: Enviorment): RuntimeValue {
  switch (node.kind) {
    case 'NumericLiteral':
      return {
        value: (node as NumericLiteral).value,
        type: 'number'
      } as NumberValue;
    case 'Identifier':
      return evaluateIdentifier(node as Identifier, env);
    case 'BinaryExpression':
      return evaluateBinaryExpression(node as BinaryExpression, env);
    case 'Program':
      return evaluateProgram(node as Program, env);
    default:
      console.error('Type Error: Unknown node type:', node.kind);
      Deno.exit(1);
  }
}
