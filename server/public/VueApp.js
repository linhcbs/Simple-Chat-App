const app = Vue.createApp({
    data(){
        return {
            PORT: 3000,
            socket: null,
            messagelist: [],
        }
    },
    created() {
        this.createSocket();
        this.listeningToServer();        
    },
    methods: { 
        // shoulve generalized some of these
        createSocket() {
            this.socket = io(`ws://localhost:${this.PORT}`);
        },
        sendMessage (data){
            this.socket.emit('message', data);
        },
        updateMessageList (data){
            this.messagelist.push(data);
        },
        listeningToServer (){
            // Update list if receive a message
            this.socket.on("message", (data) => {
                // let proccessedData = JSON.parse(JSON.stringify(data));
                // this.updateMessageList(proccessedData); 
                this.updateMessageList(data)
            })
        }
    },

});