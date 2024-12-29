app.component("message-list", {
    props :{
        messagelist: {
            type: Object,
            required: true,
        }
    },
    template:
    /* html */
    `<ul class="message-container__message-list" id="message-list">
        <li class="message-list__message" v-for="message in messagelist">
            <b class="message__sender">{{message.sender}}</b> : 
            <span class="message__messager-content">{{message.message}}</span>
        </li>
    </ul>`
})