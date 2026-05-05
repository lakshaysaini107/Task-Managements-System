import fs from "fs";
import path from "path";
import initSqlJs from "sql.js";

const dbPath = path.resolve("prisma", "dev.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const SQL = await initSqlJs();
const fileBuffer = fs.existsSync(dbPath) ? fs.readFileSync(dbPath) : null;
const db = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database();

db.run(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS User (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Project (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    admin_id INTEGER NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT Project_admin_id_fkey
      FOREIGN KEY (admin_id) REFERENCES User (id)
      ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS ProjectMember (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ProjectMember_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES User (id)
      ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT ProjectMember_project_id_fkey
      FOREIGN KEY (project_id) REFERENCES Project (id)
      ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS Task (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    dueDate DATETIME,
    priority TEXT NOT NULL DEFAULT 'Medium',
    status TEXT NOT NULL DEFAULT 'To Do',
    assignedTo INTEGER,
    projectId INTEGER NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT Task_assignedTo_fkey
      FOREIGN KEY (assignedTo) REFERENCES User (id)
      ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT Task_projectId_fkey
      FOREIGN KEY (projectId) REFERENCES Project (id)
      ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE UNIQUE INDEX IF NOT EXISTS ProjectMember_user_id_project_id_key
    ON ProjectMember(user_id, project_id);
  CREATE INDEX IF NOT EXISTS Project_admin_id_idx ON Project(admin_id);
  CREATE INDEX IF NOT EXISTS ProjectMember_project_id_idx ON ProjectMember(project_id);
  CREATE INDEX IF NOT EXISTS Task_projectId_idx ON Task(projectId);
  CREATE INDEX IF NOT EXISTS Task_assignedTo_idx ON Task(assignedTo);
`);

fs.writeFileSync(dbPath, Buffer.from(db.export()));
db.close();

console.log(`SQLite database is ready at ${dbPath}`);
