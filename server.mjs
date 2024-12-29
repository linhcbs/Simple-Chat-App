import {Server} from "socket.io"
import express from "express"
import cors from "cors"

// Get the full file path to this file's directory
import path from "path"
import { fileURLToPath } from "url"
import { type } from "os";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Use the provided port, if there isn't one, use port 3000.
const PORT = process.env.PORT|| 7070;

const app = express(); // Create a new express server
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "public" directory to the client.
app.use(cors())

// Start an HTTP server and listen on the specified PORT
const expressServer = app.listen(PORT, () => {
    console.log(`Listen on port ${PORT}`);
});

// routes
app.get('/config', (req, res) => {
    res.json({ port: PORT });
});
app.get("/", (req, res) => {
    const view = path.join(__dirname, "index.html");
    res.sendFile(view);
})


// Attach a new socket server to this HTTP server
const io = new Server(expressServer, {
    // Allow the front-end to access this server
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : [`http://localhost:${PORT}`, `http://127.0.0.1:${PORT}`],
    }
}); 

io.on('connection', socket => { // Server listening to a specific event ("connection")
    let id = socket.id.substring(0, 5);

    // Send notifications to newly-connected clients
    socket.emit('message', { 
        message : "Welcome to Simple Chat App! Send messages to communicate with other users.",
        type: "notification",
        sender: "System"
    });

    // Notify to all other clients that a new client has joined.
    socket.broadcast.emit('message', {
        message: `User ${id} connected`,
        type: "notification",
        sender: "System"
    })

    // Listening for messages sent by client;
    socket.on('message', (data) => { 
        // Send that message to all clients.
        io.emit("message", {
            message : data.msg,
            type: "message",
            sender: id,
        }); 
    })


    // Listening for disconnection 
    socket.on('disconnect', () => {
        // Notify others that this client disconnected
        socket.broadcast.emit('message',  {
            message : `User ${id} disconnected`,
            type: "notification",
            sender: "System"
        })
    })

    // Notify other clients when this client is typing
    socket.on('activity', () => {
        socket.broadcast.emit("activity", {
            message : `User ${id} is typing...`,
            type: "notification",
            sender: "System"
        });
    })
});
