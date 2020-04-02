var language = "";
var docType = "";

var id_front = "";
var id_back = "";
var selfie = "";

$(document).ready(function () {
    console.log("ready!");
    language = "en";
});

$("#startbutton").click(function (e) {
    e.preventDefault();
    document.getElementById("result").innerHTML = "";
    console.log("start get session id");
    docType = $("input[name='docType']:checked").val();
    console.log("DocType - " + docType);
    docSide = $("input[name='docSide']:checked").val();
    console.log("Doc Side - " + docSide);
    StartAutoCaptureFront();

    setTimeout(function () {
        window.scrollTo(0, document.body.scrollHeight);
    });

});

function StartAutoCaptureFront() {

    $.ajax({
        url: "/home/sessionId?autoCapture=true",
        async: true,
        crossDomain: true,
        processData: false,
        contentType: false,
        type: "GET",

    }).done(function (data) {
        $("#autoCaptureFront").empty();
        var sessionId = data.session_Id;
        console.log("session id - " + sessionId);
        autoCaptureFront(sessionId);
        document.getElementById("front").hidden = false;
        document.getElementById("back").hidden = true;
        document.getElementById("textByLiveness").hidden = true;
    }).fail(function (data) {
        document.getElementById("front").hidden = true;
        console.log("Session ID Error - " + data);
    })
}

function autoCaptureFront(sessionId) {
    console.log("start auto capture front");
    $("#container").autocapture({
        locale: language,
        session_id: sessionId,
        document_type: docType,
        document_side: "front",
        http: true,
        callback: function (token, image) {
            console.log(token);
            id_front = token;
            startAutoCaptureBack();

        },
        failure: function (error) {
            console.log("Auto Capture Front Error - " + error);
            document.getElementById("front").hidden = true;
            if (error == "402") {
                id_front = "testingfront";
                startAutoCaptureBack();
            }
        }
    });
}

function startAutoCaptureBack() {
    $.ajax({
        url: "/home/sessionId?autoCapture=true",
        async: true,
        crossDomain: true,
        processData: false,
        contentType: false,
        type: "GET",

    }).done(function (data) {
        $("#autoCaptureBack").empty();
        var sessionId = data.session_Id;
        console.log("session id - " + sessionId);
        autoCaptureBack(sessionId);
        document.getElementById("front").hidden = true;
        document.getElementById("back").hidden = false;
        document.getElementById("textByLiveness").hidden = true;
    }).fail(function (data) {
        //alert(data);
        console.log("Session ID Back Error - " + data);
        document.getElementById("back").hidden = true;
    })
}

function autoCaptureBack(sessionId) {
    console.log("start auto capture back");

    $("#container").autocapture({
        locale: language,
        session_id: sessionId,
        document_type: docType,
        document_side: "back",
        http: true,
        callback: function (token, image) {
            console.log(token);
            id_back = token;
            document.getElementById("autocapture").remove();
            startLiveness();

        },
        failure: function (error) {
            console.log("Auto Capture Front Error - " + error);
            
            alert(error);
            if (error == "402") {
                id_back = "testingback";
                startLiveness();
            }
        }
    });
}

function startLiveness() {
    console.log("start liveness session id");
    document.getElementById("front").hidden = true;
    document.getElementById("back").hidden = true;
    document.getElementById("textByLiveness").hidden = false;

    $.ajax({
        url: "/home/sessionId?autoCapture=false",
        async: true,
        crossDomain: true,
        processData: false,
        contentType: false,
        type: "GET",

    }).done(function (data) {
        $("#autoCaptureBack").empty();
        var sessionId = data.session_Id;
        console.log("session id - " + sessionId);
        captureSelfie(sessionId);

    }).fail(function (data) {
        console.log("Session ID Back Error - " + data);
        document.getElementById("textByLiveness").hidden = true;
    })
}

function captureSelfie(sessionId) {
    var formData = new FormData();
    formData.append("liveness", true);
    TOCliveness("liveness", {
        locale: language,
        http: true,
        session_id: sessionId,
        callback: function (token) {
            selfie = token;
            document.getElementById("liveness").remove();
            console.log("selfie - " + token);
            document.getElementById("textByLiveness").hidden = true;
            validatedData();
        }
    });
}

function validatedData() {
    console.log("Start validating data");
    var postData = {
        "documentType": docType,
        "selfie": selfie,
        "documentFront": id_front,
        "documentBack": id_back
    }
    $.post
    $.ajax({
        url: "/Home/Validate",
        async: true,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify(postData)
    }).done(function (data) {
        console.log(data);
        document.getElementById("result").innerHTML = data;

    }).fail(function (error) {

        console.log(error);
    });
}