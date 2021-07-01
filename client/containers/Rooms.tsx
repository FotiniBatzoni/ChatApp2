import { useRef } from "react";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";
import styles from "../styles/Room.module.css";

function RoomsContainer() {
    const { socket, roomId, rooms } = useSockets();
    const newRoomRef = useRef(null);


    function handleCreateRoom() {
        //get the room name
        const roomName = newRoomRef.current.value || "";

        if (!String(roomName).trim()) return;

        // emit room created event  (roomName is emitted)
        socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName });

        // set room name input to empty string
        newRoomRef.current.value = "";
    }

    //to handle Join the Room
    //key is the roomId
    function handleJoinRoom(key) {

        //if(key is the current roomId)
        //tj. user clicked in the room he is already in
        if (key === roomId) return;

        //else emit a new event from CLIENT JOIN_ROOM (the key)
        socket.emit(EVENTS.CLIENT.JOIN_ROOM, key);
    }

    return (
        <nav className={styles.wrapper}>
            <div className={styles.createRoomWrapper}>
                <input ref={newRoomRef} placeholder="Room name" />
                <button className="cta" onClick={handleCreateRoom}>
                    CREATE ROOM
                </button>
            </div>

            <ul className={styles.roomList}>
                {Object.keys(rooms).map((key) => {
                    return (
                        <div key={key}>
                            <button
                                 // the button is disabled if(key is the current roomId)
                                disabled={key === roomId}

                                //joins the room's name
                                title={`Join ${rooms[key].name}`}

                                //onclick we handleJoinRoom(roomId)
                                onClick={() => handleJoinRoom(key)}
                            >
                                {/*room's name*/}
                                {rooms[key].name}
                            </button>
                        </div>
                    );
                })}
            </ul>
        </nav>
    );
}

export default RoomsContainer;