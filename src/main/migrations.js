const migrations = [
  `
    CREATE TABLE applications(
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    process_name TEXT NOT NULL,
    executable_path TEXT NOT NULL, 
    args TEXT,
    always_launch INTEGER,
    riot_product TEXT
);
CREATE TABLE modes(
    id TEXT PRIMARY KEY,
    name TEXT
);
CREATE TABLE mode_applications(
    application_id TEXT,
    mode_id TEXT,
    position INTEGER,
    PRIMARY KEY (mode_id, application_id),
    CONSTRAINT application_fk FOREIGN KEY(application_id) REFERENCES applications(id),
    CONSTRAINT mode_fk FOREIGN KEY(mode_id) REFERENCES modes(id)
);`,
  `CREATE TABLE mode_activations(
id INTEGER PRIMARY KEY AUTOINCREMENT,
mode_id TEXT NOT NULL,
activated_at TEXT NOT NULL,
CONSTRAINT fk_mode FOREIGN KEY(mode_id) REFERENCES modes(id)
)`,
`
CREATE TABLE settings(
key TEXT PRIMARY KEY, 
value TEXT NOT NULL
)
`
]

export function runMigrations(db) {
  const { user_version: version } = db.prepare('PRAGMA user_version').get()
  for (let i = version; i < migrations.length; i++) {
    db.exec(migrations[i])
    db.exec(`PRAGMA user_version = ${i + 1}`)
  }
}
