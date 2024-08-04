import React, { useState } from 'react'
import {v4 as uuidv4} from 'uuid';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const navigate=useNavigate();
    const [roomId,setRoomId]=useState('');
    const [username,setUserName]=useState('');
    

    //on enter be able to join room
    const handleInputEntered=(e)=>{
        if(e.code ==='Enter'){
            joinRoom();
        }
    }


    const createNewRoom=(e)=>{
        e.preventDefault();
        const id=uuidv4;
        setRoomId(id);
        toast.success('New Room Created!')
        
    }

    const joinRoom=()=>{
        if(!roomId || !username){
            toast.error(" Room ID and Username Required");
            return;

        }
        //redirect
        navigate(`/editor/${roomId}`,{
            state:{
                username,
            },
        },
    )
    }
  return (
    <div className='homePageWrapper'>
        <div className='formWrapper'>
        <img
                    className="homePageLogo"
                    src="/Untitled design (3).png"
                    alt="code-sync-logo"
                />
            <h4 className='mainLabel'></h4>
            <div className='inputGroup'>
           
                <input 
                type='text' 
                placeholder='Room ID' 
                className='inputBox' 
                value={roomId}
                onChange={(e)=>setRoomId(e.target.value)}
                onKeyUp={handleInputEntered}
                />
                <input 
                type='text' 
                placeholder='UserName' 
                className='inputBox'
                value={username}
                onChange={(e)=>setUserName(e.target.value)}
                onKeyUp={handleInputEntered}

                />
                <button
                onClick={joinRoom}
                 className='btn inputButton'>Join
                 
                 </button>
                <span className='createRoomInfo'>Create Room? &nbsp;
                    <a onClick={createNewRoom} href="" className='createNewRoom'>New Room</a>
                </span>

            </div>
        </div>
        <footer>
            <h4>@2024</h4>
        </footer>
    </div>
  )
}

export default Home