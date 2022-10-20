const io = require("socket.io")(3000, {
    cors:{
        origin: ["http://localhost:1234"]
    }
});

io.on("connection", (socket) => {
    socket.emit("data", "hello world");
    io.on("msg", (data) => {
        console.log(data);
        console.log("puuu!")
    })
});

// io.on("msg", (data) => {
//     console.log(data);
//     console.log("puuu!")
// })
