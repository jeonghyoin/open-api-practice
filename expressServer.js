//db
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'fintech'
});
connection.connect();

//express.js
var express = require("express"),
app = express();

var currentUser = '';

//jwt
//npm install jsonwebtoken
var request = require('request');
var jwt = require('jsonwebtoken');
var tokenKey = "fintech!@#$%"

//토큰 인증 모듈
var auth = require('./lib/auth')

var port = process.env.PORT || 8080;
app.use(express.static(__dirname + '/public'));

//템플렛 추가
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.json());
app.use(express.urlencoded({extended:false}));

//index
app.get("/", function (request, response) {
    var user_name = request.query.user_name;
    var user_contents = request.query.user_contents;
    response.end("Hello " + user_name + "! " + user_contents);
});

//get
app.get("/member", function (req, res) {
    var temp;
    connection.query('SELECT * FROM fintech.member', function (error, results) {
        if (error) throw error;
        temp = results
        res.send(temp);
    });      
});

//html 띄우기 - ejs
app.get('/test', function(req, res) {
    res.render('test'); //파일명
});

//get
app.get('/main', function(req, res){
    res.render('main');
})

app.get('/login', function(req, res){
    res.render('login');
})

app.get('/balance', function(req, res){
    res.render('balance');
})

app.get('/signup', function(req, res){
    res.render('signup');
})

//qr 코드 생성
app.get('/qrcode', function(req, res){
    res.render('qrcode');
})

//qr 코드 리더기
app.get('/qrcodeReader', function(req, res){
    res.render('qrcodeReader')
})

app.get('/authTest', auth, function(req, res){
    res.json('로그인 사용자');
})

//토큰 발급 - 3-legged
//access token 인증 요청
app.get('/authResult', function(req, res){
    var authCode = req.query.code;
    var option = {
        method : "POST",
        url : "https://testapi.openbanking.or.kr/oauth/2.0/token",
        headers : "",
        form : {
            code : authCode,
            client_id : 'mZDDm2gP92FqwdD248kVm83PTJnlJKDIiTwaSSFu',
            client_secret : 'ed6EcMwoZ11mlHRRzmkmhD33w1Zg4zQ7ggbr0kPj',
            redirect_uri : 'http://localhost:8080/authResult',
            grant_type : 'authorization_code'
        }
    }
    request(option, function (error, response, body) {
        var result = JSON.parse(body);
        var accesstoken = result.access_token;
        var refreshtoken = result.refresh_token;
        var userseqno = result.user_seq_no;
        console.log(result);

        connection.query('UPDATE fintech.user SET ' +
        'accesstoken=?, refreshtoken=?, userseqno=? WHERE email=?',
        [accesstoken, refreshtoken, userseqno, currentUser], function (error, results, fields) {
            if (error) throw error;     
        });
        
        res.render('login');
    });
})

//토큰 발급 - 2-legged
app.get('/auth', function(req, res) {
    var option = {
        method : "POST",
        url : "https://testapi.openbanking.or.kr/oauth/2.0/token",
        headers : "",
        form : {
            client_id : 'mZDDm2gP92FqwdD248kVm83PTJnlJKDIiTwaSSFu',
            client_secret : 'ed6EcMwoZ11mlHRRzmkmhD33w1Zg4zQ7ggbr0kPj',
            scope : 'oob',
            grant_type : 'client_credentials'
        }
    }
    request(option, function (error, response, body) {
        console.log('/auth' + body);       
    });
})

app.get("/member", function (req, res) {
    var resu = "데이터가 존재하지 않습니다.";
    connection.query('SELECT * FROM fintech.member', function (error, results, fields) {
        if (error) throw error;
        console.log('/member' + results);
        resu = results;
        res.send(resu);
    });
});

//회원가입 데이터 처리
app.post('/user', function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    
    connection.query('INSERT INTO fintech.user ' +
    '(name, email, password) VALUES (?,?,?)',
    [name, email, password], function (error, results, fields) {
        if (error) throw error;
        currentUser = email;
        res.json(1);
    });
})

//로그인, jwt 추가
app.post('/login', function(req, res){
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;
    connection.query('SELECT * FROM user WHERE email = ?',
    [userEmail], function (error, results, fields) {
        if (error) throw error;

        if(results.length < 1){
            console.log('사용자가 존재하지 않습니다.');
        } else {
            if(results[0].password == userPassword) {
                jwt.sign({
                    userName : results[0].name,
                    userId : results[0].id,
                    userEmail : results[0].email
                },
                tokenKey,
                {
                    expiresIn : '10d',
                    issuer : 'fintech.admin',
                    subject : 'user.login.info'
                },
                function(err, token){
                    res.json(token);
                });
            }
            else {
                console.log('비밀번호가 일치하지 않습니다.');
            }    
        } 
    });      
})

//사용자 인증정보 활용 요청
app.post('/userData', auth, function(req, res){
    var userId = req.decoded.userId
    connection.query('SELECT * FROM user WHERE id = ?', [userId], function (error, results, fields) {
        if (error) throw error;
        console.log('/userData' + results);
        var option = {
            method : "get",
            url : "https://testapi.openbanking.or.kr/v2.0/user/me",
            //토큰
            headers : {
                Authorization : "Bearer " + results[0].accesstoken
            },
            qs : {
                user_seq_no : results[0].userseqno
            }
        }
        request(option, function (error, response, body) {
            console.log('/userData' + body);
            var resultObject = JSON.parse(body);
            res.json(resultObject);
        });
    });      
})

//잔액 조회
app.post('/balance',auth, function(req, res){
    var userId = req.decoded.userId
    var finusenum = req.body.fin_use_num;

    //랜덤 transId 생성
    var countnum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = "T991599190U" + countnum;

    connection.query('SELECT * FROM user WHERE id = ?', [userId], function (error, results, fields) {
        if (error) throw error;
        var option = {
            method : "get",
            url : "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num",
            //헤더에 토큰 삽입
            headers : {
                Authorization : "Bearer " + results[0].accesstoken
            },
            //쿼리 스트링
            qs : {
                bank_tran_id :  transId,
                fintech_use_num : finusenum,
                tran_dtime : "20191212140000"
            }
        }
        request(option, function (error, response, body) {
            console.log('/balanc' + body);
            var resultObject = JSON.parse(body);
            res.json(resultObject);
        });
    });      
})

//거래 내역
app.post('/transaction',auth, function(req, res){
    var userId = req.decoded.userId
    var finusenum = req.body.fin_use_num;
    var countnum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = "T991599190U" + countnum;
    connection.query('SELECT * FROM user WHERE id = ?', [userId], function (error, results, fields) {
        if (error) throw error;
        var option = {
            method : "get",
            url : "https://testapi.openbanking.or.kr/v2.0/account/transaction_list/fin_num",
            headers : {
                Authorization : "Bearer " + results[0].accesstoken
            },
            qs : {
                bank_tran_id :  transId,
                fintech_use_num : finusenum,
                inquiry_type : 'A',
                inquiry_base : 'D',
                from_date : '20190101',
                to_date : '20190101',
                sort_order : 'D',
                tran_dtime : "20191212140000"
            }
        }
        request(option, function (error, response, body) {
            console.log('/transaction' + body);
            var resultObject = JSON.parse(body);
            res.json(resultObject);
        });
    });      
})

//출금
app.post('/withdrawQR', auth, function(req, res){
    var finusenum = req.body.qrFin;
    var userId = req.decoded.userId
    var countnum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = "T991599190U" + countnum;
    connection.query('SELECT * FROM user WHERE id = ?', [userId], function (error, results, fields) {
        if (error) throw error;
        var option = {
            method : "post",
            url : "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
            headers : {
                Authorization : "Bearer " + results[0].accesstoken
            },
            json : { //API 문서 참고
                bank_tran_id : transId,
                cntr_account_type : "N",
                cntr_account_num : "7832932596",
                dps_print_content : "쇼핑몰환불",
                fintech_use_num : "199159919057870978715901",
                wd_print_content : "쇼핑몰환불",
                tran_amt : "1000",
                req_client_fintech_use_num : "199159919057870978715901",
                tran_dtime : "20190910101921",
                req_client_name : "진상언",
                req_client_num : "7832932596",
                transfer_purpose : "TR"
            }
        }
        request(option, function (error, response, body) {
            console.log('withdrawQR' + body);
            var resultObject = body;
            if(resultObject.rsp_code == "A0000"){
                //예외처리
                res.json(1);
            } 
            else {
                res.json(resultObject.rsp_code)
            }

        });
    });
});

app.listen(port);
console.log("Listening on port ", port);