// var x = 45
// [ VarToken, IdentifierToke, EqualsToken, NumberToken ]

export enum TokenType {
  Null,
  Number,
  Identifier,
  Equals,
  OpenParen,
  CloseParen,
  BinaryOperator,
  Var,
  EOF // End of File
}

const KEYWORDS: Record<string, TokenType> = {
  var: TokenType.Var,
  X: TokenType.BinaryOperator,
  nil: TokenType.Null
};

export interface Token {
  value: string;
  type: TokenType;
}

export function token(value = '', type: TokenType): Token {
  return { value, type };
}

function isAlpha(src: string) {
  return src.toUpperCase() != src.toLowerCase();
}

function isInt(str: string) {
  const c = str.charCodeAt(0);
  const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
  return c >= bounds[0] && c <= bounds[1];
}

function isSkiable(src: string) {
  return src == '\n' || src == ' ' || src == '\t' || src == '\r' || src == ';';
}

export function tokenize(source: string): Token[] {
  const tokens = new Array<Token>();
  const src = source.split('');

  //  Build Each Token
  while (src.length > 0) {
    if (src[0] == '(') {
      tokens.push(token(src.shift(), TokenType.OpenParen));
    } else if (src[0] == ')') {
      tokens.push(token(src.shift(), TokenType.CloseParen));
    } else if (
      src[0] == '+' ||
      src[0] == '-' ||
      src[0] == '*' ||
      src[0] == '/' ||
      src[0] == '%' ||
      src[0] == 'X'
    ) {
      tokens.push(token(src.shift(), TokenType.BinaryOperator));
    } else if (src[0] == '=') {
      tokens.push(token(src.shift(), TokenType.Equals));
    } else {
      // Handle Multicharacter Tokens

      //   Handle Numbers
      if (isInt(src[0])) {
        let num = '';
        while (src.length > 0 && isInt(src[0])) {
          num += src.shift();
        }

        tokens.push(token(num, TokenType.Number));
      } else if (isAlpha(src[0])) {
        let id = '';
        while (src.length > 0 && isAlpha(src[0])) {
          id += src.shift();
        }

        //  Check for reserved keywords
        //  Check for reserved keywords
        const reserved = KEYWORDS[id];
        if (reserved !== undefined) {
          tokens.push(token(id, reserved));
        } else {
          tokens.push(token(id, TokenType.Identifier));
        }
      } else if (isSkiable(src[0])) {
        src.shift();
      } else {
        console.error(`Unexpected token ${src[0]}`);
        Deno.exit(1);
      }
    }
  }
  tokens.push(token('EndOfFile', TokenType.EOF));
  return tokens;
}

const source = await Deno.readTextFile('./test.fc');

for (const token of tokenize(source)) {
  console.log(token);
}

export default tokenize;
