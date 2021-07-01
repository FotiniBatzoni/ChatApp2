import { nanoid } from "nanoid";    //to create the room id
import { Server, Socket } from "socket.io";  //required for function socket
import logger from "./utils/logger";

//EVENT objects
const EVENTS = {
  connection: "connection",  //EVENTS.connection
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
    JOIN_ROOM: "JOIN_ROOM",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOM_MESSAGE: "ROOM_MESSAGE",
  },
};

const rooms: Record<string, { name: string }> = {};
// RESULT:
//   rooms[roomId] = {
//         name: roomName,
//       };
//--------------------------------

//this function takes one argument called {io}
//{io:Server} is a type of Server  which comes from a socket.io package
function socket({ io }: { io: Server }) {
  logger.info(`Sockets enabled`);

  //we pass an event io.on
  //the event we are listening is EVENTS.connection
  //this connection takes a socket argument which is of type Socket (socket:Socket)
  io.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`User connected ${socket.id}`);

    //it emits the EVENTS from SERVER of ROOMS , with property rooms
    socket.emit(EVENTS.SERVER.ROOMS, rooms);


   //---------------------------------------------------------------

    /*
     * 1.When a user creates a new room
     */

    //event comes from the CLIENT.CREATE_ROOM with property roomName
    socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
      console.log({ roomName });

      // create a roomId using nanoId
      const roomId = nanoid();

      // add a new room to the rooms object
      rooms[roomId] = {
        name: roomName,
      };

      //join the room
      socket.join(roomId);

      // broadcast an event saying there is a new room
      //it comes from SERVER.ROOMS  tj. EVENTS.SERVER.ROOMS
      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);

      // emit back to the room creator with all the rooms
      //it comes from SERVER.ROOMS  tj. EVENTS.SERVER.ROOMS
      socket.emit(EVENTS.SERVER.ROOMS, rooms);

      // emit event back the room creator saying they have joined a room
      //it comes from SERVER.JOINED_ROOM  tj. EVENTS.SERVER.JOINED_ROOM
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });
    //-----------------------------------------------------------


    /*
     * 2.When a user sends a room message
     */

    //event comes from the CLIENT.SEND_ROOM_MESSAGE with property roomId,message,username
    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      ({ roomId, message, username }) => {

        //create new timestamp
        const date = new Date();

        //to roomId we emit from SERVER ROOM_MESSAGE
        //with properties message,username,time: `${date.getHours()}:${date.getMinutes()}
        socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
          message,
          username,
          time: `${date.getHours()}:${date.getMinutes()}`,
        });
      }
    );
    //-------------------------------------------------------

    /*
     *3. When a user joins a room
     */
    //event comes from the CLIENT.JOIN_ROOM with property roomId
    socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {

      //we join the roomId
      socket.join(roomId);

      //we emit a new event from SERVER JOINED_ROOM --roomId
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });
  });
}

export default socket;