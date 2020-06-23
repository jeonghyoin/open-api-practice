// db
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'fintech'
});
connection.connect();

var express = require("express"),
app = express();

var currentUser = '';

// jwt
var request = require('request');
var jwt = require('jsonwebtoken');
var tokenKey = "fintech!@#$%";

// 토큰 인증 모듈
var auth = require('./lib/auth');

var port = process.env.PORT || 8080;
app.use(express.static(__dirname + '/public'));

// 템플렛 추가
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// index
app.get("/", function (request, response) {
    var user_name = request.query.user_name;
    var user_contents = request.query.user_contents;
    response.end("Hello " + user_name + "! " + user_contents);
});

// html 띄우기 - ejs
app.get('/test', function(req, res) {
    res.render('test'); //파일명
});

// get
app.get('/main', function(req, res){
    res.render('main');
})

app.get('/login', function(req, res){
    res.render('login');
})

app.get('/balance', function(req, res){
    res.render('balance');
})

app.get('/transaction', function(req, res){
    res.render('transaction');
})

app.get('/signup', function(req, res){
    res.render('signup');
})

// qr 코드 생성
app.get('/qrcode', function(req, res){
    res.render('qrcode');
})

// qr 코드 리더기
app.get('/withdrawQR', function(req, res){
    res.render('qrcodeReader');
})

app.get('/authTest', auth, function(req, res){
    res.json('로그인 중인 사용자');
})

// get
app.get("/member", function (req, res) {
    var temp;
    connection.query('SELECT * FROM fintech.member', function (error, results) {
        if (error) throw error;
        temp = results
        res.send(temp);
    });      
});

// 토큰 발급 - 3-legged
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

// 토큰 발급 - 2-legged
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
        console.log('/auth');
        console.log(body);       
    });
})

// 유저 목록
app.get("/member", function (req, res) {
    var result = "데이터가 존재하지 않습니다.";
    connection.query('SELECT * FROM fintech.member', function (error, results, fields) {
        if (error) throw error;

        result = results;
        res.send(result);
    });
});

// 회원가입 데이터 처리
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
});

// 로그인, jwt 추가
app.post('/login', function(req, res){
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;

    connection.query('SELECT * FROM user WHERE email = ?',
    [userEmail], function (error, results, fields) {
        if(error) throw error;

        if(results.length < 1) {
            res.json({message: '사용자가 존재하지 않습니다.'});
        } else {
            if(results[0].accesstoken === null) {
                res.json({message: '오픈뱅킹 인증이 되지 않은 사용자입니다.'});
            } else if(results[0].password == userPassword) {
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
                    res.json({accesstoken: token, message: '로그인이 완료되었습니다.'});
                });
            } else {
                res.json({message: '비밀번호가 일치하지 않습니다.'});
            }
        } 
    });      
})

// 사용자 인증정보 활용 요청
app.post('/userData', auth, function(req, res){
    var userId = req.decoded.userId;

    connection.query('SELECT * FROM user WHERE id = ?', [userId], function (error, results, fields) {
        if (error) throw error;

        var option = {
            method : "get",
            url : "https://testapi.openbanking.or.kr/v2.0/user/me",
            headers : {
                Authorization : "Bearer " + results[0].accesstoken
            },
            qs : {
                user_seq_no : results[0].userseqno
            } 
        }
        request(option, function (error, response, body) {
            var result = JSON.parse(body);
            res.json(result);
        });
    });      
})

// 잔액 조회
app.post('/balance',auth, function(req, res){
    var userId = req.decoded.userId;
    var finusenum = req.body.fin_use_num;

    // 랜덤 transId 생성 - 은행거래 고유번호 생성 안내사항 참고
    var countnum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = "T991603750U" + countnum;

    connection.query('SELECT * FROM user WHERE id = ?', [userId], function (error, results, fields) {
        if (error) throw error;

        var option = {
            method : "get",
            url : "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num",
            headers : {
                Authorization : "Bearer " + results[0].accesstoken
            },
            qs : {
                // 은행 거래 고유번호
                bank_tran_id :  transId,
                // 핀테크 이용번호
                fintech_use_num : finusenum,
                // 요청 시간
                tran_dtime : "20200622000000"
            }
        }
        request(option, function (error, response, body) {
            console.log('/balanc: ' + body);

            var result = JSON.parse(body);
            if(result.rsp_code != "A0000") {
                console.log("잔액조회 요청 실패");
            } else {
                res.json(result);
            }
        });
    });      
})

// 거래내역 조회
app.post('/transaction',auth, function(req, res){
    var userId = req.decoded.userId;
    var finusenum = req.body.fin_use_num;

    var countnum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = "T991603750U" + countnum;

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
                // 조회 구분코드 (A: All, I: 입금, O: 출금)
                inquiry_type : "A",
                // 조회기준코드주 (D: 일자, T: 시간)
                inquiry_base : "D",
                // 조회 시작 일자
                from_date : "20190101",
                // 조회 종료 일자 -> 20190101 데이터를 기준으로 조회
                to_date : "20190101",
                // 데이터 내림차순 정렬
                sort_order : "D",
                // 요청 일시
                tran_dtime : "20200622000000"
            }
        }
        request(option, function (error, response, body) {
            console.log('/transaction: ' + body);

            var result = JSON.parse(body);
            if(result.rsp_code != "A0000") {
                console.log("거래내역 조회 요청 실패");
            } else {
                res.json(result);
            }
        });
    });      
})

// 출금 이체 - QR 결제
app.post('/withdrawQR', auth, function(req, res){
    var finusenum = req.body.fin_use_num;
    var userId = req.decoded.userId;

    var countnum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = "T991603750U" + countnum;
    var reqClientNum = "F000000000U" + countnum;

    connection.query('SELECT * FROM user WHERE id = ?', [userId], function (error, results, fields) {
        if (error) throw error;

        var option = {
            method : "post",
            url : "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
            headers : {
                Authorization : "Bearer " + results[0].accesstoken
            },
            json : {
                // ** 거래 정보
                // 약정 계좌/계정 구분(N: 계좌, C: 계정)
                cntr_account_type : "N",
                // 약정 계좌 or 계정 번호
                cntr_account_num : "5582638902",
                // 입금계좌 인자내역
                dps_print_content : "이용료",
                // 출금계좌 핀테크 이용번호
                fintech_use_num : finusenum,
                // 거래 금액
                tran_amt : "100000",
                // 요청 일시
                tran_dtime : "20200622000000",
                // ** 요청고객 정보
                // 요청고객 계좌번호 - 고유 번호
                req_client_num : reqClientNum,
                // 요청고객 핀테크 이용번호
                req_client_bank_code : "097",
                // 요청고객 계좌 번호
                req_client_account_num : "", // 지움
                // 요청고객 성명
                req_client_name : "홍길동",
                //이체 용도(TR: 송금, ST: 결제, RC: 충전)
                transfer_purpose : "TR",
                // ** 수취 고객 정보
                // 최종 수취고객 성명
                recv_client_name : "", // 자움
                // 최종 수취고객 계좌 개설기관. 표준코드
                recv_client_bank_code : "097",
                // 최종 수취고객 계좌번호
                recv_client_account_num : "" // 지움
            }
        }
        request(option, function (error, response, body) {
            console.log('/withdrawQR');
            console.log(body);

            var result = body;
            if(result.rsp_code == "A0000") {
                res.json(1);
            } else {
                res.json(result.rsp_code);
            }
        });
    });
});

// 입금 이체


app.listen(port);
console.log("Listening on port ", port);