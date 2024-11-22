app.component("chat-display", {
    props: {
        messagelist: {
            type: Object,
            required: true,
        },
        socket: {
            type: Object,
            required: true,
        },
    },
    template:
        /*html*/
        `<div class="message-container">
        <form class="form message-form" 
            ref="messageForm"
            @submit.prevent="sendMessageToApp">
            <textarea class="message-form__user-message" placeholder="This is your message..." rows="2"
                ref="messageTextarea"
                v-model="message"
                @keypress = "handleKeyPress"
                ></textarea>

            <button class="message-form__send-btn send-btn" 
                ref="messageSendBtn"
                >Send</button>
        </form>
        <p class="message-container__user-activity" 
            ref="messageActivity"></p>
        <message-list :messagelist="messagelist"> </message-list>
    </div>`,
    data() {
        return {
            message: "",
        }
    },
    mounted() {
        this.ListeningForActivity();
    },
    methods: {
        sendMessageToApp() {
            if (this.message != "") {
                let data = {
                    msg: this.message,
                }
                this.$emit("send-message", data);

                // Reset
                this.message = "";
                this.$refs.messageTextarea.focus();
            }
        },
        clickSendBtn(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                this.$refs.messageSendBtn.click();
            }
        },
        emitActivity() {
            this.socket.emit("activity");
        },
        ListeningForActivity() {
            let activityTimer;
            this.socket.on("activity", (data) => {
                this.$refs.messageActivity.textContent = data.message;
                
                clearTimeout(activityTimer);
                activityTimer = setTimeout(() => {
                    this.$refs.messageActivity.textContent = "";
                }, 1000);
            })
        },
        handleKeyPress(e){
            this.clickSendBtn(e);
            this.emitActivity();
        }
    }
});