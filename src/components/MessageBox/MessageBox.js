import React, { useEffect, useMemo, useRef, useState } from "react";
import "./MessageBox.css";
import { Box } from "@mui/system";
import {
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import socket, { sendMessageToOtherUser } from "../tools/socketClient";
import { getUserInfo } from "../tools/axiosFetch";
import CloseIcon from "@mui/icons-material/Close";
import { nanoid } from "nanoid";

const test_chats_window = ["test", "test2", "test3", "test4"];
export default function MessageBox({ id,users,setUsers,user_chats,setUsersChats}) {
  const [is_open, setOpen] = useState(false);
  const users_cmpts = Object.entries(users).map(([key, value], index) => {
    return (
      <Grid
        item
        xs={12}
        className="message_box_text_grid"
        key={nanoid()}
        onClick={() => openChat({ open_id: key })}
      >
        <User user_name={value.user_name} />
      </Grid>
    );
  });
  const window_chats = useMemo(
    () =>
      user_chats.map((user_id) => {
        const { user_name, messages } = users[user_id];
        return (
          <Grid item key={nanoid()}>
            <Chat
              user_name={user_name}
              messages={messages}
              onClose={() => closeChat({ close_id: user_id })}
              onSend={(reply) => onSendMessage({ receive_id: user_id, reply })}
            />
          </Grid>
        );
      }),
    [user_chats, users]
  );
  function onSendMessage({ receive_id = -1, reply = "" }) {
    setUsers((prev_users) => {
      let new_users = { ...prev_users };
      new_users[receive_id].messages.push({
        is_owner: true,
        message: reply,
      });
      return {users:new_users};
    });
    sendMessageToOtherUser({receive_id,reply});
  }

  function closeChat({ close_id }) {
    setUsersChats((prev) => {
      const new_user_chats = prev.filter((user_id) => close_id !== user_id);
      return {user_chats:new_user_chats};
    });
  }
  function openChat({ open_id = -1 }) {
    const is_alrady_open = user_chats.includes(open_id);
    if (is_alrady_open || open_id === -1) return;
    setUsersChats((prev_chats) => {
      let new_chats = [...prev_chats];
      new_chats.push(open_id);
      return {user_chats:new_chats};;
    });
  }
  //set effect when receive message
  useEffect(() => {
    //new message get from other user
    socket.on("Message:receive", async ({ message, user_id }) => {
      let new_user_name = "";
      //if new users contact
      if (!users[user_id]) {
        const user_data = await getUserInfo({ user_id });
        if (user_data.length === 0) {
          console.error("Fail to get user message with use_id " + user_id);
          return;
        }
        new_user_name = user_data[0]?.user_name;
      }
      setUsers((prev_users) => {
        console.log(prev_users);
        let new_users = { ...prev_users };
        //check if a message is from a new user
        if (new_user_name)
          new_users[user_id] = { user_name: new_user_name, messages: [] };
          new_users[user_id].messages.push({
          is_owner: user_id === id,
          message,
        });
        return {users:new_users};
      });
      openChat({open_id:user_id});
    });
  }, []);
  return (
    <Grid
      container
      spacing={1}
      justifyContent={"flex-start"}
      className="messagers_grid_container"
      direction={"row-reverse"}
    >
      <Grid item alignSelf={"flex-end"}>
        <Box
          className="messager_box"
          style={{ height: is_open ? "500px" : "30px" }}
        >
          <Grid container direction="column">
            <Grid item>
              <Grid container direction={"row"}>
                <Grid item className="message_box_text_grid">
                  <Typography>Messager</Typography>
                </Grid>
                <Grid item className="expand_icon_grid">
                  <IconButton onClick={() => setOpen((prev) => !prev)}>
                    {!is_open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                container
                direction={"row"}
                className="users_messager_container"
                spacing={1}
              >
                {users_cmpts}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      {window_chats}
    </Grid>
  );
}
function User({ user_name }) {
  return (
    <Paper elevation={3} className="user_name_text">
      {user_name}
    </Paper>
  );
}
function Chat({
  user_name,
  messages = [],
  onClose = () => {},
  onSend = () => {},
}) {
  const [reply, setReply] = useState("");
  const dummy = useRef(null);
  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "auto" });
  }, []);
  const message_cmpts = messages.map(({ is_owner, message }) => {
    return (
      <Grid
        item
        key={nanoid()}
        xs={12}
        justifySelf={is_owner ? "flex-start" : "flex-end"}
        style={{ marginBottom: "10px" }}
      >
        <Message is_owner={is_owner} message={message} />
      </Grid>
    );
  });
  return (
    <Box className="messager_box" style={{ height: "500px" }}>
      <Grid container direction={"column"}>
        <Grid item>
          <Grid container direction={"row"}>
            <Grid item className="message_box_text_grid">
              <Typography>{user_name}</Typography>
            </Grid>
            <Grid item marginLeft={"auto"}>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Box className="chat_window">
            <Grid container direction={"row"}>
              {message_cmpts}
            </Grid>
            <div ref={dummy} />
          </Box>
        </Grid>
        <Grid item style={{ marginTop: "10px" }}>
          <Grid container direction={"row"}>
            <Grid item xs={7}>
              <TextField
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => onEnter({ e, funct: () => onSend(reply) })}
              />
            </Grid>
            <Grid item alignSelf={"center"}>
              <Button variant="contained" onClick={() => onSend(reply)}>
                Send
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
function Message({ is_owner = false, message = "" }) {
  return (
    <Paper
      style={{
        marginLeft: is_owner ? "auto" : "0",
        backgroundColor: is_owner ? "blue" : "init",
        color: is_owner ? "white" : "black",
        maxWidth: "max-content",
        padding: "3px",
      }}
    >
      {message}
    </Paper>
  );
}
function onEnter({ e, funct = () => {} }) {
  if (e.key === "Enter") {
    funct();
  }
}
