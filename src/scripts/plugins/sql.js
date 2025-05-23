// tauri-v2/packages/api/src/core.ts
var SERIALIZE_TO_IPC_FN = "__TAURI_TO_IPC_KEY__";
function transformCallback(callback, once = false) {
  return window.__TAURI_INTERNALS__.transformCallback(callback, once);
}
var Channel = class {
  /** The callback id returned from {@linkcode transformCallback} */
  id;
  #onmessage;
  // the index is used as a mechanism to preserve message order
  #nextMessageIndex = 0;
  #pendingMessages = [];
  #messageEndIndex;
  constructor(onmessage) {
    this.#onmessage = onmessage || (() => {
    });
    this.id = transformCallback((rawMessage) => {
      const index = rawMessage.index;
      if ("end" in rawMessage) {
        if (index == this.#nextMessageIndex) {
          this.cleanupCallback();
        } else {
          this.#messageEndIndex = index;
        }
        return;
      }
      const message = rawMessage.message;
      if (index == this.#nextMessageIndex) {
        this.#onmessage(message);
        this.#nextMessageIndex += 1;
        while (this.#nextMessageIndex in this.#pendingMessages) {
          const message2 = this.#pendingMessages[this.#nextMessageIndex];
          this.#onmessage(message2);
          delete this.#pendingMessages[this.#nextMessageIndex];
          this.#nextMessageIndex += 1;
        }
        if (this.#nextMessageIndex === this.#messageEndIndex) {
          this.cleanupCallback();
        }
      } else {
        this.#pendingMessages[index] = message;
      }
    });
  }
  cleanupCallback() {
    Reflect.deleteProperty(window, `_${this.id}`);
  }
  set onmessage(handler) {
    this.#onmessage = handler;
  }
  get onmessage() {
    return this.#onmessage;
  }
  [SERIALIZE_TO_IPC_FN]() {
    return `__CHANNEL__:${this.id}`;
  }
  toJSON() {
    return this[SERIALIZE_TO_IPC_FN]();
  }
};
async function invoke(cmd, args = {}, options) {
  return window.__TAURI_INTERNALS__.invoke(cmd, args, options);
}

// tauri-plugins/plugins/sql/guest-js/index.ts
var Database = class _Database {
  constructor(path) {
    this.path = path;
  }
  /**
   * **load**
   *
   * A static initializer which connects to the underlying database and
   * returns a `Database` instance once a connection to the database is established.
   *
   * # Sqlite
   *
   * The path is relative to `tauri::path::BaseDirectory::App` and must start with `sqlite:`.
   *
   * @example
   * ```ts
   * const db = await Database.load("sqlite:test.db");
   * ```
   */
  static async load(path) {
    const _path = await invoke("plugin:sql|load", {
      db: path
    });
    return new _Database(_path);
  }
  /**
   * **get**
   *
   * A static initializer which synchronously returns an instance of
   * the Database class while deferring the actual database connection
   * until the first invocation or selection on the database.
   *
   * # Sqlite
   *
   * The path is relative to `tauri::path::BaseDirectory::App` and must start with `sqlite:`.
   *
   * @example
   * ```ts
   * const db = Database.get("sqlite:test.db");
   * ```
   */
  static get(path) {
    return new _Database(path);
  }
  /**
   * **execute**
   *
   * Passes a SQL expression to the database for execution.
   *
   * @example
   * ```ts
   * // for sqlite & postgres
   * // INSERT example
   * const result = await db.execute(
   *    "INSERT into todos (id, title, status) VALUES ($1, $2, $3)",
   *    [ todos.id, todos.title, todos.status ]
   * );
   * // UPDATE example
   * const result = await db.execute(
   *    "UPDATE todos SET title = $1, completed = $2 WHERE id = $3",
   *    [ todos.title, todos.status, todos.id ]
   * );
   *
   * // for mysql
   * // INSERT example
   * const result = await db.execute(
   *    "INSERT into todos (id, title, status) VALUES (?, ?, ?)",
   *    [ todos.id, todos.title, todos.status ]
   * );
   * // UPDATE example
   * const result = await db.execute(
   *    "UPDATE todos SET title = ?, completed = ? WHERE id = ?",
   *    [ todos.title, todos.status, todos.id ]
   * );
   * ```
   */
  async execute(query, bindValues) {
    const [rowsAffected, lastInsertId] = await invoke(
      "plugin:sql|execute",
      {
        db: this.path,
        query,
        values: bindValues ?? []
      }
    );
    return {
      lastInsertId,
      rowsAffected
    };
  }
  /**
   * **select**
   *
   * Passes in a SELECT query to the database for execution.
   *
   * @example
   * ```ts
   * // for sqlite & postgres
   * const result = await db.select(
   *    "SELECT * from todos WHERE id = $1", [ id ]
   * );
   *
   * // for mysql
   * const result = await db.select(
   *    "SELECT * from todos WHERE id = ?", [ id ]
   * );
   * ```
   */
  async select(query, bindValues) {
    const result = await invoke("plugin:sql|select", {
      db: this.path,
      query,
      values: bindValues ?? []
    });
    return result;
  }
  /**
   * **close**
   *
   * Closes the database connection pool.
   *
   * @example
   * ```ts
   * const success = await db.close()
   * ```
   * @param db - Optionally state the name of a database if you are managing more than one. Otherwise, all database pools will be in scope.
   */
  async close(db) {
    const success = await invoke("plugin:sql|close", {
      db
    });
    return success;
  }
};
export {
  Database as default
};
