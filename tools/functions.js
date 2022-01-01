module.exports = {
    
    /**
     * Deletes message (whether by user or by FretBot) while
     * handling any errors if the message was already deleted.
     * @param {Message} msg - the original command message
     */
    deleteMsg: function(msgToDelete, time){
        setTimeout(() => 
            msgToDelete.delete().catch(err => {
                console.log('Message was already deleted');
            }), time*1000
        );
    }

    // ,
    // anotherFunc: function () {
    //   // writing this here so I dont forget how to do this
    // }
};