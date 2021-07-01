import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "../config/default";
import EVENTS from "../config/events";

//we create the Context interface
interface Context {
    socket: Socket;
    username?: string;
    setUsername: Function;

    messages?: { message: string; time: string; username: string }[];
    setMessages: Function;

    roomId?: string;
    rooms: object;
}

//set a socket
const socket = io(SOCKET_URL);

//We create a socket context
//we use Context interface to createContext

//the default values
const SocketContext = createContext<Context>({
    socket,
    setUsername: () => false,
    setMessages: () => false,
    rooms: {},
    messages: [],
});

//socket Provider
function SocketsProvider(props: any) {
    const [username, setUsername] = useState(""); //useState for user
    const [roomId, setRoomId] = useState("");  //useState for roomId
    const [rooms, setRooms] = useState({});  //useState for rooms
    const [messages, setMessages] = useState([]);  //useState for messages

    //to give focus
    useEffect(() => {
        window.onfocus = function () {
            document.title = "Chat app";
        };
    }, []);

    //client is listening EVENTS.SERVER.ROOMS and setRooms(value)
    socket.on(EVENTS.SERVER.ROOMS, (value) => {
        setRooms(value);
    });

    //client is listening EVENTS.SERVER.JOINED_ROOM and setRoomId(value)
    socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
        setRoomId(value);

        //when we join the room setMessages becomes an empty array
        setMessages([]);
    });

    //client is listening EVENTS.SERVER.ROOM_MESSAGE and
    //if has not focus         document.title = "New message...";
    socket.on(EVENTS.SERVER.ROOM_MESSAGE, ({ message, username, time }) => {
        if (!document.hasFocus()) {
            document.title = "New message...";
        }

        //else setMessages
        setMessages([
            ...messages, //we spread the messages
            { message, username, time } // we pass these values
        ]);
    });

    return (
        <SocketContext.Provider
            value={{ //we return the consts from above
                socket,
                username,
                setUsername,
                rooms,
                roomId,
                messages,
                setMessages,
            }}
            {...props}
        />
    );
}

//export a way to use the socketProvider
export const useSockets = () => useContext(SocketContext);

export default SocketsProvider;