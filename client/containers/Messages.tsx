import { useEffect, useRef } from "react";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";
import styles from "../styles/Messages.module.css";

function MessagesContainer() {
    //all these are (socket,messages,etc) using sockets
    const { socket, messages, roomId, username, setMessages } = useSockets();

    const newMessageRef = useRef(null);
    const messageEndRef = useRef(null);

    function handleSendMessage() {
        const message = newMessageRef.current.value;

        //if it's empty return
        if (!String(message).trim()) {
            return;
        }

        //else we emit a new event from CLIENT (EVENTS.CLIENT.SEND_ROOM_MESSAGE) with properties  roomId, message, username
        socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, { roomId, message, username });

        const date = new Date();

        //add a new message
        setMessages([
            ...messages, //spread all messages
            {
                //it broadcast whatever the server brings us
                username: "You",
                message,
                time: `${date.getHours()}:${date.getMinutes()}`,
            },
        ]);

        newMessageRef.current.value = "";
    }

    //to scroll to the bottom of the screen
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    //if there is no roomId return an empty div
    if (!roomId) {
        return <div />;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.messageList}>

                {messages.map(({ message, username, time }, index) => {

                    return (

                        <div key={index} className={styles.message}>
                            <div key={index} className={styles.messageInner}>
                <span className={styles.messageSender}>
                  {username} - {time}
                </span>
                                <span className={styles.messageBody}>{message}</span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messageEndRef} />
            </div>
            <div className={styles.messageBox}>
        <textarea
            rows={1}
            placeholder="Tell us what you are thinking"
            ref={newMessageRef}
        />
                <button onClick={handleSendMessage}>SEND</button>
            </div>
        </div>
    );
}

export default MessagesContainer;