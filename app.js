const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(express.static('foto'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pertemuan5'
});

connection.connect((err) => {
    if(err) {
        console.error("Terjadi kesalahan dalam kondeksi ke MySQL:", err.stack);
        return;
    }
    console.log("Koneksi MySQL berhasil dengan id" + connection.threadId)
});

app.set('view engine', 'ejs');

// ini adalah routing (Create, Read, Update, Delete)

//Read
app.get('/', (req, res) => {
   const query = 'SELECT * FROM users'; 
   connection.query(query, (err, results) => {
        res.render('index', {users:results});
   });
});


//create / input / insert
app.post('/add', (req, res) => {
    const {nama, email, phone} = req.body;
    const query = 'INSERT INTO users (nama, email, phone) VALUES (?,?,?)';
    connection.query(query,[nama, email, phone], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

//update 
//untuk akses halaman
app.get('/edit/:id', (req, res) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('edit', {user:result[0]});
    });
})

//untuk update data
app.post('/update/:id', (req, res) =>{
    const {nama, email, phone} = req.body;
    const query = 'UPDATE users SET nama = ?, email = ?, phone = ? WHERE id = ?';
    connection.query(query,[nama, email, phone, req.params.id], (err, result) =>{
        if (err) throw err;
        res.redirect('/');
    });
})

//hapus
app.get('/delete/:id', (req, res) => {
    const query = 'DELETE FROM users WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
})

app.listen(3000,() =>{
    console.log("Server berjalan di prt 3000, buka web melalui http://localhost:3000 ")
});