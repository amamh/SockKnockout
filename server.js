var http = require('http');
var sockjs = require('sockjs');
var node_static = require('node-static');
var _u = require('underscore')

// 1. Echo sockjs server
var sockjs_opts = {sockjs_url: "http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js"};

var sockjs_echo = sockjs.createServer(sockjs_opts);
sockjs_echo.on('connection', function(conn) {
    conn.on('data', function(message) {
        conn.write(message);
    });
    
    var symbols = "AAL.L,ABF.L,ADM.L,AHT.L,ANTO.L,ARM.L,AV.L,AZN.L,BA.L,BAB.L,BARC.L,CCL.L,CNA.L,CPG.L,CPI.L,CRH.L,DC.L,DCC.L,DGE.L,DLG.L,EXPN.L,EZJ.L,FRES.L,GKN.L,GLEN.L,GSK.L,III.L,IMB.L,INF.L".split(',');
    
    var sendPrice = function() {
        var symbol  = symbols[Math.floor(Math.random()*symbols.length)];
        var price = 10 + Math.random()*100; 
        
        conn.write(
            JSON.stringify({
                "symbol": symbol,
                "price": price,
            })
        );
        
        setTimeout(sendPrice, 100); // repeat
    }

    sendPrice();
    
});

// 2. Static files server
var static_directory = new node_static.Server(__dirname);

// 3. Usual http stuff
var server = http.createServer();
server.addListener('request', function(req, res) {
    static_directory.serve(req, res);
});
server.addListener('upgrade', function(req,res){
    res.end();
});

sockjs_echo.installHandlers(server, {prefix:'/echo'});

console.log(' [*] Listening on 0.0.0.0:9999' );
server.listen(9999, '0.0.0.0');

