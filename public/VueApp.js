const app = Vue.createApp({
    data() {
        return {
            socket: null,
            messagelist: [],
        }
    },
    async created() {
        await this.createSocket();
        this.listeningToServer();
    },
    methods: {
        // shoulve generalized some of these
        async createSocket() {
            try {
                const response = await fetch('/config');
                const { port } = await response.json();
                this.socket = io(`ws://localhost:${port}`);
            } catch (error) {
                console.error("Error fetching the config:", error);
            }
        },
        sendMessage(data) {
            this.socket.emit('message', data);
        },
        updateMessageList(data) {
            this.messagelist.push(data);
        },
        listeningToServer() {
            // Update list if receive a message
            this.socket.on("message", (data) => {
                // let proccessedData = JSON.parse(JSON.stringify(data));
                // this.updateMessageList(proccessedData); 
                this.updateMessageList(data)
            })
        }
    },

});
