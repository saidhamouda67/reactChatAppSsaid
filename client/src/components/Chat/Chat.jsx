import React,{useEffect,useState} from 'react'
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css'
import InfoBar from '../infoBar/InfoBar';
import { Input } from '../Input/Input';
import { Messages } from '../messages/Messages';
import { TextContainer } from '../TextContainer/TextContainer';
let socket;

export const Chat = ({location}) => {
const [name, setName] = useState('');
const [room, setRoom] = useState('');
const [message, setMessage] = useState('')
const [messages, setMessages] = useState([])
const [users, setUsers] = useState([])
const ENDPOINT='https://react-chat-app-said.herokuapp.com/';
useEffect(() => {
        const {name,room}=queryString.parse(location.search);
        socket=io(ENDPOINT);
        setName(name);
        setRoom(room);
        socket.emit('join',{name,room},(error)=>{
            // alert(error)
        
        });

        return ()=>{
            socket.emit('disconnect');

            socket.off();
        }
    }, [ENDPOINT,location.search])


    useEffect(()=>{
        socket.on('message',(message)=>{
            setMessages([...messages,message])
        })
    },[messages])

    useEffect(()=>{
        socket.on('roomData',({users,room})=>{
            setUsers(users)
        })
    },[users])
    const sendMessage=(event)=>{
        event.preventDefault();
        if(message){
            socket.emit('sendMessage',message,()=>{
                setMessage('');
            })
        }
    }
    console.log(message,messages)
    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name}   />
               <Input message={message} sendMessage={sendMessage} setMessage={setMessage} />
            </div>
            <TextContainer users={users} />

        </div>
    )
}


