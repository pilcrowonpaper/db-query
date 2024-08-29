import { Row, Rows } from "./query.js";

export class SyncDatabase<_ExecuteResult> {
	private adapter: SyncAdapter<_ExecuteResult>;

	constructor(adapter: SyncAdapter<_ExecuteResult>) {
		this.adapter = adapter;
	}

	public queryOne(statement: string, params: unknown[]): Row | null {
		const result = this.adapter.query(statement, params);
		if (result.length < 1) {
			return null;
		}
		return new Row(result[0]);
	}

	public queryOneOrThrow(statement: string, params: unknown[]): Row {
		const row = this.queryOne(statement, params);
		if (row === null) {
			throw new Error("Query did not return any rows");
		}
		return row;
	}

	public query(statement: string, params: unknown[]): Rows {
		const result = this.adapter.query(statement, params);
		return new Rows(result);
	}

	public execute(statement: string, params: unknown[]): _ExecuteResult {
		return this.adapter.execute(statement, params);
	}
}

export interface SyncAdapter<_ExecuteResult> {
	query(statement: string, params: unknown[]): unknown[][];
	execute(statement: string, params: unknown[]): _ExecuteResult;
}
