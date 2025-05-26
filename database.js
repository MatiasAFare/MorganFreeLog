const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.sqlite'), { verbose: console.log });

const initDb = () => {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            rol_id INTEGER,
            FOREIGN KEY (rol_id) REFERENCES roles(id)
        )
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS roles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT UNIQUE NOT NULL
        )
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS permisos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT UNIQUE NOT NULL,
            descripcion TEXT
        )
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS rol_permiso (
            rol_id INTEGER,
            permiso_id INTEGER,
            PRIMARY KEY (rol_id, permiso_id),
            FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE,
            FOREIGN KEY (permiso_id) REFERENCES permisos(id) ON DELETE CASCADE
        )
    `).run();
};

initDb();

module.exports = db;