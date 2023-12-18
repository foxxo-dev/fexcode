import Parser from './frontend/parser.ts';

repl();

function repl() {
  const parser = new Parser();
  console.log('Repl v0.0.1');
  while (true) {
    const input = prompt('>  ');
    // No user or exit keyword
    if (!input || input.includes('exit')) {
      Deno.exit(1);
    }

    const program = parser.produceAST(input as string);
    console.log(program);
  }
}
