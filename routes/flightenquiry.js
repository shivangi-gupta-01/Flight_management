var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require("./multer")
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
router.get('/flightinterface', function (req, res) {
    var admin=JSON.parse(localStorage.getItem("ADMIN"))
    if(admin){
    res.render('flightinterface', { message: '' })}
    else{
        res.render('adminlogin', { message: '' })
    }
})
router.get('/displayall', function (req, res) {
    var admin=JSON.parse(localStorage.getItem("ADMIN"))  
    if(!admin){
        res.render('adminlogin', { message: '' })
    }
    else{

    pool.query("select F.*,(select C.cityname from cities C where C.cityid=F.source) as source,(select C.cityname from cities C where C.cityid=F.destination) as destination from flightdetails F ", function (error, result) {
        if (error) {
            console.log(error)
            res.render('displayall', { 'data': [], 'message': 'server Error' })
        }
        else {

            res.render('displayall', { 'data': result, 'message': 'Successfull' })
        }
    })
    }
})


router.get('/searchbyid', function (req, res) {
    pool.query("select F.*,(select C.cityname from cities C where C.cityid=F.source) as source,(select C.cityname from cities C where C.cityid=F.destination) as destination from flightdetails F where flightid=?", [req.query.fid], function (error, result) {
        if (error) {
            console.log(error)
            res.render('flightbyid', { 'data': [], 'message': 'server Error' })
        }
        else {
            // console.log(result[0])
            res.render('flightbyid', { 'data': result[0], 'message': 'Successfull' })
        }
    })
})


router.get('/searchbyidforimage', function (req, res) {
    pool.query("select F.*,(select C.cityname from cities C where C.cityid=F.source) as source,(select C.cityname from cities C where C.cityid=F.destination) as destination from flightdetails F where flightid=?", [req.query.fid], function (error, result) {
        if (error) {
            console.log(error)
            res.render('showimage', { 'data': [], 'message': 'server Error' })
        }
        else {
            console.log(result[0])
            res.render('showimage', { 'data': result[0], 'message': 'Successfull' })
        }
    })
})



router.post('/flightsubmit', upload.single('logo'), function (req, res) {
    var days = ("" + req.body.days).replaceAll("'", '"')
    pool.query("insert into flightdetails (flightname, type, totalseats, days, source, departuretime, destination, arrivaltime, company, logo)values(?,?,?,?,?,?,?,?,?,?)", [req.body.flightname, req.body.flighttype, req.body.noofseats, days, req.body.sourcecity, req.body.deptime, req.body.destcity, req.body.arrtime, req.body.company, req.file.originalname], function (error, result) {
        if (error) {
            console.log(error)
            res.render('flightinterface', { 'message': 'server Error' })
        }
        else {
            res.render('flightinterface', { 'message': 'Record Submitted Successfully' })
        }
    })
})



router.post('/flightedit_delete', function (req, res) {
    if (req.body.btn == "Edit") {
        var days = ("" + req.body.days).replaceAll("'", '"')
        pool.query("update flightdetails set flightname=?, type=?, totalseats=?, days=?, source=?, departuretime=?, destination=?, arrivaltime=?, company=? where flightid=?", [req.body.flightname, req.body.flighttype, req.body.noofseats, days, req.body.sourcecity, req.body.deptime, req.body.destcity, req.body.arrtime, req.body.company, req.body.flightid], function (error, result) {
            if (error) {
                console.log(error)
                res.redirect('/flight/displayall')
            }
            else {
                res.redirect('/flight/displayall')
            }
        })
    } else {
        var days = ("" + req.body.days).replaceAll("'", '"')
        pool.query("delete from flightdetails where flightid=?", [req.body.flightid], function (error, result) {
            if (error) {
                console.log(error)
                res.redirect('/flight/displayall')
            }
            else {
                res.redirect('/flight/displayall')
            }
        })
    }
})




router.get('/fetchcities', function (req, res) {
    pool.query("select * from cities", function (error, result) {
        if (error) {
            console.log(error)
            res.status(500).json({ result: [], message: error })
        }
        else {
            res.status(200).json({ result: result, message: 'Successfull' })
        }
    })
})



router.post('/editimage', upload.single('logo'), function (req, res) {
    console.log("BODY", req.body)
    console.log("FILE", req.file)
    pool.query("update flightdetails set logo=? where flightid=?",[req.file.originalname,req.body.flightid], function (error, result) {
        if (error) {
            console.log(error)
            res.redirect('/flight/displayall')
        }
        else {
            console.log(result)
            res.redirect('/flight/displayall')
        }
    })
})


module.exports = router;