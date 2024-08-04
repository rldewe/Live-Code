import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined `);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left `);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    }, [location.state?.username, reactNavigator, roomId]);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('RoomID Copied');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className='mainWrap'>
            <div className='aside'>
                <div className='aside-inner'>
                    <div className='logo'>
                        <img className='aside-logo-img' alt='aside-logo' src="/Untitled design (3).png" />
                    </div>
                    <h3>Joinees</h3>
                    <div className='join-list'>
                        {clients.map(client =>
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        )}
                    </div>
                </div>
                <button className='btn copy-btn' onClick={copyRoomId}>Copy Room ID</button>
                <button className='btn leave-btn' onClick={leaveRoom}>Leave Room</button>
            </div>
            <div className='editor-wrap'>
                <Editor 
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                      codeRef.current = code;
                    }}
                />
            </div>
        </div>
    );
};

export default EditorPage;
