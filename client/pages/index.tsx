import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useSockets } from "../context/socket.context";

import RoomsContainer from "../containers/Rooms";
import MessagesContainer from "../containers/Messages";
import { useEffect, useRef } from "react";

export default function Home() {
  const { socket, username, setUsername } = useSockets();

  const usernameRef = useRef(null);

  //we check setUsername
  function handleSetUsername() {
    //usernameRef.current.value ?????????
    const value = usernameRef.current.value;
    if (!value) {
      return;
    }

    //if ok set value to setUsername
    setUsername(value);

    //we want to it to store it in localStorage
    //we dont want the user to reenter the name
    localStorage.setItem("username", value);
  }

  //to use the username which is in localStorage
  useEffect(() => {
    if (usernameRef)
      usernameRef.current.value = localStorage.getItem("username") || "";
  }, []);

  return (
      <div>
        //?????????????
        //if there is no username
        {!username && (
            <div className={styles.usernameWrapper}>
              <div className={styles.usernameInner}>
                <input placeholder="Username" ref={usernameRef} />
                <button className="cta" onClick={handleSetUsername}>
                  START
                </button>
              </div>
            </div>
        )}
        //if there is a username
        {username && (
            <div className={styles.container}>
              <RoomsContainer />
              <MessagesContainer />
            </div>
        )}
      </div>
  );
}