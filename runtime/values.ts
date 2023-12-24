export type ValueTypes = 'null' | 'number' | 'boolean';

export interface RuntimeValue {
  type: ValueTypes;
}

export interface NullValue extends RuntimeValue {
  type: 'null';
  value: 'nil';
}

export interface NumberValue extends RuntimeValue {
  type: 'number';
  value: number;
}

export interface BoolValue extends RuntimeValue {
  type: 'boolean';
  value: boolean;
}

export function MK_NUMBER(value: number): NumberValue {
  return { type: 'number', value } as NumberValue;
}

export function MK_NULL(): NullValue {
  return { type: 'null', value: 'nil' } as NullValue;
}

export function MK_BOOL(value: boolean): BoolValue {
  return { type: 'boolean', value } as BoolValue;
}
