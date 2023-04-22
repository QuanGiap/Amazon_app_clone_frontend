import { io } from "socket.io-client";
const BASE_URL = "http://localhost:5000"

const socket = io(BASE_URL,{autoConnect:false});
export function connectSocket(){
    socket.connect();
}
export function disconnectSocket(){
    socket.disconnect();
}
export async function sendMessageToOtherUser({receive_id,reply},callBack = () => {}){
    const token = localStorage.getItem("access_token");
    socket.emit("Message:send",{token,id_receiver:receive_id,message:reply})
}
socket.on("connect", () => {
    console.log(socket.id+" is connected");
    const token = localStorage.getItem("access_token");
    socket.emit("Auth:sign_in",{token},(response)=>{
        console.log(response);
    });
});
socket.on("message", (message) => {
    console.log(message)
});
export default socket;