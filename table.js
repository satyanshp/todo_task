const sqlite = require("sqlite3");
const db = new sqlite.Database("./list.db", sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
});

const sql = `CREATE TABLE IF NOT EXISTS list (ID INTEGER PRIMARY KEY, task, status)`;
db.run(sql);