const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const app = express()
const port = process.env.PORT || 3000;


const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect()

var jsonParser = bodyParser.json();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/save', jsonParser, (req, res) => {
    let note=req.body.note;

    if(typeof(note)==='string') {
      //call pgsql function
      let query = 'SELECT * FROM note_add($1)';

      client.query(query, [note]).then( value => {
        if(value.rows[0].note_add) {
          res.send({code:0,url:value.rows[0].note_add})
        }
      }).catch( e => {
        res.send({code:1,url:''})
      });
    }
 })

 app.post('/note', jsonParser, (req, res) => {
    let noteUrl = req.body.noteUrl;
    console.log(req.body);
    if(noteUrl && noteUrl.length === 10) {
      let query = 'SELECT note FROM notes WHERE url = $1';

      client.query(query, [noteUrl]).then( value => {
        if(value.rows[0].note) {
          res.send({code:0,note:value.rows[0].note})
        }
      }).catch( e => {
        console.log(e)
        res.send({code:1,note:''})
      });

    }


  })




app.listen(port, () => console.log(`Server listening on port ${port}!`))
