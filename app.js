const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const url = require('url');
const cors = require("cors");
const sqlite = require("sqlite3");
const db = new sqlite.Database("./list.db", sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
});
let sql;

app.use(bodyParser.json());
app.use(cors());

//post request
app.post('/api/v1/tasks/create', (req, res) => {
    try {
        const { task, status } = req.body;
        sql = "INSERT INTO list(task, status) VALUES(?, ?)";
        db.run(sql, [task, status], (err) => {
            if (err) return console.error(err);
        })
        return res.send("Success!");
    } catch (error) {
        return res.status(404).send("error: " + error.message);
    }
});
// get request
app.get('/api/v1/tasks', (req, res) => {
    sql = "SELECT * FROM list";
    try {
        db.all(sql, [], (err, rows) => {
            if (err) return console.error(err);

            if (rows.length < 1)
                return res.json({status: 300, success: false, error: "Not Found"});

            return res.json({status: 200, data: rows, success: true});
        });
    } catch (error) {
        return res.status(404).send("error: " + error.message);   
    }
});

// put request
app.patch('/api/v1/tasks/update', (req, res) => {
    sql = "UPDATE list SET task = ?, status = ? WHERE ID = ?";
    try {
        const { task, status, ID } = req.body;
        db.run(sql, [task, status, ID], (err) => {
            if (err) return console.error(err);
        });
        return res.send("Updated task!");
    } catch (error) {
        return res.status(404).send("error: " + error.message);   
    }
});

// delete request
app.post('/api/v1/tasks/delete', function(req, res) {
    sql = "DELETE FROM list WHERE ID = ?";
    const { ID } = req.body;

    db.run(sql, ID, function(err) {
        if (err) {
            return console.error(err.message);
        } 
        return res.send("Deleted!");    
    }); 
});

app.listen(8080, ()=>{
    console.log("Listening on port 8080!");
})