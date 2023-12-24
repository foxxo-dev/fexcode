import { RuntimeValue } from './values.ts';

export default class Enviorment {
    private parent?: Enviorment;
    private variables: Map<string, RuntimeValue>;

    constructor(parentENV?: Enviorment) {
        this.parent = parentENV;
        this.variables = new Map();
    }

    public declareVar(varName: string, value: RuntimeValue): RuntimeValue {
        if (this.variables.has(varName)) {
            console.error('Runtime Error: Variable', varName, 'already declared');
            Deno.exit(1);
        }

        this.variables.set(varName, value);
        return value;
    }

    public assignVar(varName: string, value: RuntimeValue): RuntimeValue {
        const env = this.resolve(varName);
        env.variables.set(varName, value);

        return value;
    }

    public getVar(varName: string): RuntimeValue {
        const env = this.resolve(varName);

        return env.variables.get(varName) as RuntimeValue;
    }

    public resolve(varname: string): Enviorment {
        if (this.variables.has(varname)) {
            return this;
        }

        if (this.parent == undefined) {
            throw new VariableNotFoundError(varname);
        }

        return this.parent.resolve(varname);
    }
}

class VariableNotFoundError extends Error {
    constructor(varname: string) {
        super('Could not resolve variable: ' + varname);
        this.name = 'VariableNotFoundError';
    }
}
