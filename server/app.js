const ws = require("nodejs-websocket");
const http = require("http");

const broadcast = (str) => {
    console.log(str);
    server.connections.forEach((connect)=>{
        connect.sendText(str);
    });
}

const getAllChatter = ()=>{
    let chatterArr = [];
    server.connections.forEach((connect) => {
        chatterArr.push({name:connect.nickname});
    });
    return chatterArr;
};

const server = ws.createServer((connect) => {
    connect.on("text", (str)=>{
        let data = JSON.parse(str);
        console.log(data);

        switch(data.type) {
            case "setName":
                connect.nickname = data.nickname;
                broadcast(JSON.stringify({
                    type: "serverInformation",
                    message: data.nickname + " join room"
                }));

                broadcast(JSON.stringify({
                    type: "chatterList",
                    list: getAllChatter()
                }));
                break;
            case "chat":
                broadcast(JSON.stringify({
                    type: "chat",
                    name: connect.nickname,
                    message: data.message
                }));
                break;
            default:
                break;
        }
    })

    connect.on("close", () => {
        broadcast(JSON.stringify({
            type: "serverInfomation",
            message: connect.nickname+" left room"
        }));

        broadcast(JSON.stringify({
            type: "chatterList",
            list: getAllChatter()
        }));
    });

    connect.on("error", (err)=>{
        console.log(err);
    });
}).listen(3000, ()=>{
    console.log("running");
});