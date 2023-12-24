import Parser from './frontend/parser.ts';
import Enviorment from './runtime/enviorment.ts';
import { evaluate } from './runtime/interpreter.ts';
import { MK_BOOL, MK_NUMBER, NumberValue } from './runtime/values.ts';

repl();

function repl() {
  const parser = new Parser();

  const env = new Enviorment();
  env.declareVar('pi', MK_NUMBER(Math.PI) as NumberValue);
  env.declareVar('true', MK_BOOL(true));
  env.declareVar('false', MK_BOOL(false));
  env.declareVar(
    'maybe',
    MK_BOOL(Math.round(Math.random()) == 1 ? true : false)
  );
  env.declareVar('nil', { type: 'null', value: null });

  console.log('Repl v0.0.1');
  while (true) {
    const input = prompt('>  ');
    // No user or exit keyword
    if (!input || input.includes('exit')) {
      Deno.exit(1);
    }

    const program = parser.produceAST(input as string);

    const result = evaluate(program, env);
    console.log(result);
  }
}
