# Database query

A small library to add type-safety to your database driver.

```ts
const rows = db.query("SELECT user.id, user.username, user.email, user.email_verified, user.profile FROM user", []);
for (const row of rows) {
	const user: User = {
		id: row.number(0),
		username: row.string(1),
		email: row.string(2),
		emailVerified: Boolean(row.number(3)),
		profile: row.stringNullable(4)
	};
}
```

```ts
const row = db.queryOne(
	"SELECT user.id, user.username, user.email, user.email_verified, user.profile FROM user WHERE user.username = ?",
	[username]
);
if (row !== null) {
	const user: User = {
		id: row.number(0),
		username: row.string(1),
		email: row.string(2),
		emailVerified: Boolean(row.number(3)),
		profile: row.stringNullable(4)
	};
}
```

## Installation

```
npm install @pilcrowjs/db-query
```

## Example

```ts
import sqlite3 from "better-sqlite3";
import { SyncDatabase } from "@pilcrowjs/db-query";

import type { SyncAdapter } from "@pilcrowjs/db-query";

const sqlite = sqlite3("sqlite.db");

const adapter: SyncAdapter<sqlite3.RunResult> = {
	query: (statement: string, params: unknown[]): unknown[][] => {
		const result = sqlite
			.prepare(statement)
			.raw()
			.all(...params);
		return result as unknown[][];
	},
	execute: (statement: string, params: unknown[]): sqlite3.RunResult => {
		const result = sqlite
			.prepare(statement)
			.run(...params);
		return result;
	}
};

const db = new SyncDatabase(adapter);
```

APIs for asynchronous drivers are also available.

```ts
import { AsyncDatabase } from "@pilcrowjs/db-query";

import type { AsyncAdapter } from "@pilcrowjs/db-query";

const adapter: AsyncAdapter<void> = {
	query: async (statement: string, params: unknown[]): Promise<unknown[][]> => {
		// ...
	},
	execute: async (statement: string, params: unknown[]): Promise<void> => {
		// ...
	}
};

const db = new AsyncDatabase(adapter);
```

## API

### Database

```ts
function constructor(adapter: Adapter): this;
```

#### Database.execute()

`AsyncDatabase` will return `Promise<any>`. The return type will be the same as `Adapter.execute()`.

```ts
function execute(statement: string, args: any[]): any;
```

#### Database.query()

`AsyncDatabase` will return `Promise<Rows>`.

```ts
function query(statement: string, args: any[]): Rows;
```

```ts
class Rows {
	count(): number;
	*[Symbol.iterator](): Iterator<Row>;
}
```

#### Database.queryOne()

`AsyncDatabase` will return `Promise<Row | null>`.

```ts
function queryOne(statement: string, args: any[]): Row | null;
```

#### Database.queryOneOrThrow()

`AsyncDatabase` will return `Promise<Row>`. Similar to `queryOne()` but throws an `Error` if there are no rows.

```ts
function queryOne(statement: string, args: any[]): Row;
```

### Row

`bigintNullable()` and `bigint()` will convert integer Numbers to BigInts. All other methods will not do any implicit type conversion (e.g. Number => Boolean). Methods will throw an `Error` if the type is invalid.

```ts
class Row {
	stringNullable(index: number): string | null;
	string(index: number): string;
	numberNullable(index: number): number | null;
	number(index: number): number;
	bigintNullable(index: number): bigint | null;
	bigint(index: number): bigint;
	booleanNullable(index: number): boolean | null;
	boolean(index: number): boolean;
	bytesNullable(index: number): Uint8Array | null;
	bytes(index: number): Uint8Array;
	get(index: number): unknown;
}
```

### Adapter

`AsyncAdapter` methods should return a promise.

```ts
interface Adapter<_ExecuteResult> {
	query(statement: string, params: unknown[]): unknown[][];
	execute(statement: string, params: unknown[]): _ExecuteResult;
}
```
