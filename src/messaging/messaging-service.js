const MessagingService = {
    getAllMessages(db) {
        return db
            .select('*')
            .from('messages')
            .join('users', 'users.id', 'user_id')
            .select('messages.id AS message_id')
            .select('users.date_created AS user_created')
            .orderBy('message_id')
    },
    getMessagesByUserId(db, user_id) {
        return db
            .from('messages')
            .join('users', 'users.id', 'user_id')
            .select('messages.id AS message_id')
            .select('users.date_created AS user_created')
            .where({ user_id })
            .orderBy('message_id')
    },
    insertMessage(db, newMessage) {
        return db
            .insert(newMessage)
            .into('messages')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteMessage(db, id) {
        return db
            .from('messages')
            .where({ id })
            .delete()
    },
    serializeMessage(message) {
        return {
            id: message.message_id,
            content: message.content,
            date_created: message.date_created,
            user_id: message.user_id,
            user_name: message.user_name
        }
    }
}

module.exports = MessagingService;