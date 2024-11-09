export class Rows {
	private result: unknown[][];

	constructor(result: unknown[][]) {
		this.result = result;
	}

	*[Symbol.iterator](): Iterator<Row> {
		for (const item of this.result) {
			yield new Row(item);
		}
	}

	public count(): number {
		return this.result.length;
	}
}

export class Row {
	private result: unknown[];

	constructor(result: unknown[]) {
		this.result = result;
	}

	public stringNullable(index: number): string | null {
		const value = this.get(index);
		if (typeof value !== "string" && value !== null) {
			throw new Error("Not a string or null");
		}
		return value;
	}

	public string(index: number): string {
		const value = this.get(index);
		if (typeof value !== "string") {
			throw new Error("Not a string");
		}
		return value;
	}

	public numberNullable(index: number): number | null {
		const value = this.get(index);
		if (typeof value !== "number" && value !== null) {
			throw new Error("Not a number or null");
		}
		return value;
	}

	public number(index: number): number {
		const value = this.get(index);
		if (typeof value !== "number") {
			throw new Error("Not a number");
		}
		return value;
	}

	public bigintNullable(index: number): bigint | null {
		const value = this.get(index);
		if (typeof value === "number" && Number.isInteger(value)) {
			return BigInt(value);
		}
		if (typeof value !== "bigint" && value !== null) {
			throw new Error("Not an integer or null");
		}
		return value;
	}

	public bigint(index: number): bigint {
		const value = this.get(index);
		if (typeof value === "number" && Number.isInteger(value)) {
			return BigInt(value);
		}
		if (typeof value !== "bigint") {
			throw new Error("Not an integer");
		}
		return value;
	}

	public booleanNullable(index: number): boolean | null {
		const value = this.get(index);
		if ((typeof value !== "number" || (value !== 0 && value !== 1)) && value !== null) {
			throw new Error("Not a boolean or null");
		}
		return value === 1;
	}

	public boolean(index: number): boolean {
		const value = this.get(index);
		if (typeof value !== "number" || (value !== 0 && value !== 1)) {
			throw new Error("Not a boolean");
		}
		return value === 1;
	}

	public bytesNullable(index: number): Uint8Array | null {
		const value = this.get(index);
		if (!(value instanceof Uint8Array) && value !== null) {
			throw new Error("Not an Uint8Array or null");
		}
		return value;
	}

	public bytes(index: number): Uint8Array {
		const value = this.get(index);
		if (!(value instanceof Uint8Array)) {
			throw new Error("Not an Uint8Array");
		}
		return value;
	}

	public get(index: number): unknown {
		const value = this.result[index];
		return value;
	}
}
