const express = require("express");
const nodemon = require("nodemon");
const app = express();
const port = 3004
const mysql = require("./connection").con
//config
app.set("view engine","hbs");
app.set("views","./view");
app.use(express.static(__dirname +"/public"));

//routing
app.get("/",(req, res) => {
    res.render("index")
});
app.get("/Add",(req, res) => {
    res.render("Add")
});
app.get("/Search",(req, res) => {
    res.render("Search")
});
app.get("/Update",(req, res) => {
    res.render("Update")
});
app.get("/Delete",(req, res) => {
    res.render("Delete")
});
app.get("/view", (req, res) => {
    let qry = "select * from test ";
    mysql.query(qry, (err, results) => {
        if (err) throw err
        else {
            res.render("view", { data: results });
        }

    });

});
app.get("/addstudent", (req, res) => {
    const { name, phone, email, gender } = req.query

    let qry = "select * from test where emailid=? or phoneno=?";
    mysql.query(qry, [email, phone], (err, results) => {
        if (err)
            throw err
        else {

            if (results.length > 0) {
                res.render("add", { checkmesg: true })
            } else {

                
                let qry2 = "insert into test values(?,?,?,?)";
                mysql.query(qry2, [name, phone, email, gender], (err, results) => {
                    if (results.affectedRows > 0) {
                        res.render("add", { mesg: true })
                    }
                })
            }
        }
    })
});
app.get("/searchstudent", (req, res) => {


    const { phone } = req.query;

    let qry = "select * from test where phoneno=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("search", { mesg1: true, mesg2: false })
            } else {

                res.render("search", { mesg1: false, mesg2: true })

            }

        }
    });
})

app.get("/updatesearch", (req, res) => {

    const { phone } = req.query;

    let qry = "select * from test where phoneno=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("update", { mesg1: true, mesg2: false, data: results })
            } else {

                res.render("update", { mesg1: false, mesg2: true })

            }

        }
    });
})
app.get("/updatestudent", (req, res) => {

    const { phone, name, gender } = req.query;
    let qry = "update test set username=?, gender=? where phoneno=?";

    mysql.query(qry, [name, gender, phone], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("update", { umesg: true })
            }
        }
    })

});

app.get("/removestudent", (req, res) => {



    const { phone } = req.query;

    let qry = "delete from test where phoneno=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("delete", { mesg1: true, mesg2: false })
            } else {

                res.render("delete", { mesg1: false, mesg2: true })

            }

        }
    });
});
app.listen(port, (err) => {
    if (err)
        throw err
    else
        console.log("Server is running at port %d:", port);
});