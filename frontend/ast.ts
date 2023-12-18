export type NodeType =
  | 'Program'
  | 'NumberLiteral'
  | 'BinaryExpression'
  | 'NumericLiteral'
  | 'CallExpression'
  | 'UnaryExpression'
  | 'FunctionDeclaration'
  | 'Identifier'
  | 'NullLiteral';

// let x = 45 NOT RETURN VALUE x = 45 RETURN VALUE
export interface Stmt {
  kind: NodeType;
}

export interface Program extends Stmt {
  kind: 'Program';
  body: Stmt[];
}

export interface Expr extends Stmt {}

export interface BinaryExpression extends Expr {
  // 10 - 50 || foo - bar
  kind: 'BinaryExpression';
  left: Expr;
  right: Expr;
  operator: string;
}

export interface Identifier extends Expr {
  kind: 'Identifier';
  symbol: string;
}

export interface NumericLiteral extends Expr {
  kind: 'NumericLiteral';
  value: number;
}

export interface NullLiteral extends Expr {
  kind: 'NullLiteral';
  value: 'nil';
}
