import { Row, Rows } from "./query.js";

export class AsyncDatabase<_ExecuteResult> {
	private adapter: AsyncAdapter<_ExecuteResult>;

	constructor(adapter: AsyncAdapter<_ExecuteResult>) {
		this.adapter = adapter;
	}

	public async queryOne(statement: string, params: unknown[]): Promise<Row | null> {
		const result = await this.adapter.query(statement, params);
		if (result.length < 1) {
			return null;
		}
		return new Row(result[0]);
	}

	public async query(statement: string, params: unknown[]): Promise<Rows> {
		const result = await this.adapter.query(statement, params);
		return new Rows(result);
	}

	public async execute(statement: string, params: unknown[]): Promise<_ExecuteResult> {
		return await this.adapter.execute(statement, params);
	}
}

export interface AsyncAdapter<_ExecuteResult> {
	query(statement: string, params: unknown[]): Promise<unknown[][]>;
	execute(statement: string, params: unknown[]): Promise<_ExecuteResult>;
}
