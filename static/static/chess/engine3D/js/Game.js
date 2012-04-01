/*
 * spec :
 * canvasId : id of the canvas
 * fullscreen : true/false. facultative
 * rootDir : root of ressources. faculative
 */

var GAME={}, DEBUG=true, VIDEOSCREEN, GROUND;
var Game=function(spec) {
    var that={
    rootDir:spec.rootDir || "",
    playerWhite: true,
    camWhite: [7,0,-5 ],
    thetaWhite: Math.PI/2,
    phi: 8.4,
    started: false,
    infosChess: lib_dom.get("infosChess"),
    isInChess: false,
    msgStack: [],
    msgRcvStack: [],
    msgCounter: 0,
    chessmate: false,


    load: function() {
        var view0=View({cam: that.camWhite, theta: that.thetaWhite, phi:that.phi});
        view0.computeR();
        Context3D({view: view0, canvasId: spec.canvasId, fullscreen : spec.fullscreen});
        that.loaded();
    },

    loaded: function() {
        Chess();
        //Webrtc();
        GROUND=Obj({
            mesh: Quad({h: 50, w: 50, textureScale: 20}),
            texture: Texture({imageURL: "/static/chess/engine3D/ressources/ground.jpg"}),
            render: Renders.ground
        });
        GROUND.setPos([0,0,-4]);

	//alert(document.getElementById("remoteView"));
        
        VIDEOSCREEN=VideoScreenObj({w: 3.8,
                            h: 2.8,
                            position: [2.5,0,1.5],
                            //position: [3.5,0,1.0],
                            videoElt: document.getElementById("remoteView"),
                            //videoUrl: document.getElementById("remoteView"),
                            def: 512
                });

    },

    hideConnectWin:function() {
        CONTEXT3D.cv.style.webkitFilter="";
        //lib_dom.hide("connectWin");
    },


    //called by WEBRTC :
    handleMsg: function(msg, peer_id) {
        
        var parsedMsg=msg.split(":");
        if (parsedMsg[0]!=="CHESS") return false;
        //console.log(msg);
        var contents=(parsedMsg.length>2)?parsedMsg[2].split(","):false;
        switch(parsedMsg[1]) {
            case "UP":
                if (that.isMsgRcv(parseInt(parsedMsg[3]))) return false;
                CHESS.game[parseInt(contents[0])][parseInt(contents[1])].putUp(false);                
            break;
            case "DOWN" :
                if (that.isMsgRcv(parseInt(parsedMsg[3]))) return false;
                CHESS.game[parseInt(contents[0])][parseInt(contents[1])].putDown(false);                
            break;
            case "MOVE" :
                if (that.isMsgRcv(parseInt(parsedMsg[3]))) return false;
                CHESS.game[parseInt(contents[0])][parseInt(contents[1])].move([parseInt(contents[2]), parseInt(contents[3])], CHESS.getChessman([parseInt(contents[2]), parseInt(contents[3])]), false);
            break;
            case "ISBUSY" :
                //console.log("to "+peer_id+" IAMFREE");
                var reply=(that.started)?"IAMBUSY":"IAMFREE";
                WEBRTC.sendToPeer(peer_id, "CHESS:"+reply+":"+WEBRTC.get_myName());
                //that.sendAck(parsedMsg[2]);
            break;
            case "IAMFREE" :
                //console.log("ok "+peer_id+" is free :)");
                WEBRTC.freeCallback(peer_id, contents[0]);
                //that.sendAck(parsedMsg[2]);
            break;
            case "IAMBUSY" :
                WEBRTC.busyCallback();
                //that.sendAck(parsedMsg[2]);
            break;
            case "ACK":
                var messageNumber=parseInt(parsedMsg[2]);
                //console.log("received ack"+messageNumber);
                lib_array.removeElement(that.msgStack, messageNumber);
            break;
            case "RESTART": //the other player wants to restart
                console.log("restart", parsedMsg[2]);
                if (that.isMsgRcv(parseInt(parsedMsg[2]))) return false;
                console.log("ask restart")
                if (that.askRestart()) {
                    that.sendMsg("CHESS:DORESTART");
                    that.doRestart();
                } else {
                    that.sendMsg("CHESS:DONOTRESTART");
                }
            break;
            case "DORESTART": //the other player agree to restart the game
                
                if (that.isMsgRcv(parseInt(parsedMsg[2]))) return false;
                that.doRestart();
            break;
            case "DONOTRESTART": //the other player disagree to restart the game
                if (that.isMsgRcv(parseInt(parsedMsg[2]))) return false;
                alert("Your partner do not want to restart the game.");
            break;
        }

        return true;
    },

    isMsgRcv: function(msgId) {
       if (that.msgRcvStack.indexOf(msgId)!=-1) return true;
       that.sendAck(msgId);
       that.msgRcvStack.push(msgId);
       return false;
    },

    sendMsg: function(msg) {
    return true;
       that.msgStack.push(that.msgCounter);
       var msgNumbered=msg+":"+that.msgCounter;
       WEBRTC.sendMsg(msgNumbered);
       setTimeout(that.checkAck, 200, that.msgCounter, msgNumbered);
       that.msgCounter++;
    },

    checkAck: function(number, msg) {
        //console.log("check ack"+number+" "+msg);
        if (that.msgStack.indexOf(number)==-1) return true; //ack received
        WEBRTC.sendMsg(msg);
        setTimeout(that.checkAck, 200, number, msg);
    },

    sendAck: function(number) {
        //console.log("send ack "+number);
        WEBRTC.sendMsg("CHESS:ACK:"+number);
    },

    setBlack: function() {
        that.playerWhite=false;

    },

    setWhite: function() {
        that.playerWhite=true;        
    },

    //start the party !
    start: function() {
        //that.hideConnectWin();
        //if player black return the chessboard
        if (!that.playerWhite) {
            VIEW.rotate_soft(Math.PI, 2000);
            VIDEOSCREEN.rotate_soft(0, Math.PI, 2000);
            TOWERLEFT.swiftSide();
            TOWERRIGHT.swiftSide();
          //  GL.disable(GL.CULL_FACE);
        } else {
            // GL.enable(GL.CULL_FACE);
        }
        that.started=true;
    },

    askRestart: function() {
       return confirm("Do you really want to restart the game ?");
    },

    restart: function() {
        //if (!that.started) return;
        //if (!that.askRestart()) return;
        //console.log("send restart");
        //that.sendMsg("CHESS:RESTART");
        that.doRestart();
    },

    doRestart: function() {        
        that.chessmate=false;
        CHESS.doRestart();
        that.started=true;
    },
    
    chessAlert: function(inChess) {
        if ((that.isInChess && inChess) || (!that.isInChess && !inChess)) return false;
        if (inChess) {
            infosChess.innerHTML="CHESS";
            infosChess.style.backgroundColor="red";
        } else {
            infosChess.innerHTML="";
            infosChess.style.backgroundColor="white";
        }
        that.isInChess=inChess;
    },

    over: function() {
        that.chessmate=true;
        infosChess.innerHTML="CHESSMATE";
        infosChess.style.backgroundColor="red";
    },

    troubleshooting: function() {
        window.location.href="troubleshooting.php";
    }
    }; //end that

    GAME=that;
    return that;
};
