import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Badge, IconButton, TextField, Button, Box } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import styles from '../styles/videoComponent.module.css';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import server from '../environment';
import { useNavigate } from 'react-router-dom';

const server_url = server;
const peerConfigConnections = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export default function VideoMeetComponent() {
  const navigate = useNavigate();

  const socketRef = useRef();
  const socketIdRef = useRef();
  const localVideoref = useRef();
  const connectionsRef = useRef({});

  const [videoAvailable, setVideoAvailable] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(false);
  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);
  const [screen, setScreen] = useState(false);
  const [showModal, setModal] = useState(false);
  const [screenAvailable, setScreenAvailable] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [newMessages, setNewMessages] = useState(0);
  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState('');
  const videoRef = useRef([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices
        .getUserMedia({ video: true })
        .catch(() => null);
      if (videoPermission) {
        setVideoAvailable(true);
        videoPermission.getTracks().forEach((track) => track.stop());
      }

      const audioPermission = await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .catch(() => null);
      if (audioPermission) {
        setAudioAvailable(true);
        audioPermission.getTracks().forEach((track) => track.stop());
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      }
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [video, audio]);

  const getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  const getUserMediaSuccess = (stream) => {
    try {
      if (window.localStream) {
        window.localStream.getTracks().forEach((track) => track.stop());
      }
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    if (localVideoref.current) {
      localVideoref.current.srcObject = stream;
    }

    const connections = connectionsRef.current;
    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);
      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              'signal',
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }
  };

  const getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .catch((e) => console.log(e));
    } else {
      try {
        if (localVideoref.current && localVideoref.current.srcObject) {
          let tracks = localVideoref.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        }
      } catch (e) {}
    }
  };

  const getDislayMediaSuccess = (stream) => {
    try {
      if (window.localStream) {
        window.localStream.getTracks().forEach((track) => track.stop());
      }
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    if (localVideoref.current) {
      localVideoref.current.srcObject = stream;
    }

    const connections = connectionsRef.current;
    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);
      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              'signal',
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);
          getUserMedia();
        })
    );
  };

  useEffect(() => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDislayMediaSuccess)
          .catch((e) => console.log(e));
      }
    } else if (screen === false) {
      getUserMedia();
    }
  }, [screen]);

  const gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);
    const connections = connectionsRef.current;

    if (fromId !== socketIdRef.current && connections[fromId]) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === 'offer') {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        'signal',
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  const connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, {
      secure: true,
      rejectUnauthorized: false,
    });

    socketRef.current.on('signal', gotMessageFromServer);

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join-call', window.location.href);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on('chat-message', addMessage);

      socketRef.current.on('user-left', (id) => {
        setVideos((videos) => videos.filter((v) => v.socketId !== id));
        if (connectionsRef.current[id]) {
          connectionsRef.current[id].close();
          delete connectionsRef.current[id];
        }
      });

      socketRef.current.on('user-joined', (id, clients) => {
        clients.forEach((socketListId) => {
          if (!connectionsRef.current[socketListId]) {
            connectionsRef.current[socketListId] = new RTCPeerConnection(
              peerConfigConnections
            );
          }

          const pc = connectionsRef.current[socketListId];

          pc.onicecandidate = function (event) {
            if (event.candidate != null) {
              socketRef.current.emit(
                'signal',
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };

          pc.onaddstream = (event) => {
            let videoExists = videoRef.current.find(
              (v) => v.socketId === socketListId
            );

            if (videoExists) {
              setVideos((prevVideos) => {
                const updated = prevVideos.map((v) =>
                  v.socketId === socketListId
                    ? { ...v, stream: event.stream }
                    : v
                );
                videoRef.current = updated;
                return updated;
              });
            } else {
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
              };
              setVideos((prevVideos) => {
                const updated = [...prevVideos, newVideo];
                videoRef.current = updated;
                return updated;
              });
            }
          };

          if (window.localStream) {
            pc.addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connectionsRef.current) {
            if (id2 === socketIdRef.current) continue;

            try {
              connectionsRef.current[id2].addStream(window.localStream);
            } catch (e) {}

            connectionsRef.current[id2].createOffer().then((description) => {
              connectionsRef.current[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    'signal',
                    id2,
                    JSON.stringify({
                      sdp: connectionsRef.current[id2].localDescription,
                    })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  const handleVideo = () => setVideo(!video);
  const handleAudio = () => setAudio(!audio);
  const handleScreen = () => setScreen(!screen);

  const handleEndCall = () => {
    if (localVideoref.current?.srcObject) {
      localVideoref.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
    }
    if (window.localStream) {
      window.localStream.getTracks().forEach((track) => track.stop());
    }

    for (let id in connectionsRef.current) {
      connectionsRef.current[id].close();
    }
    connectionsRef.current = {};

    socketRef.current?.disconnect();
    navigate('/home', { replace: true });
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [...prevMessages, { sender, data }]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prev) => prev + 1);
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    socketRef.current.emit('chat-message', message, username);
    setMessage('');
  };

  const connect = () => {
    if (!username.trim()) {
      alert('Please enter a username!');
      return;
    }
    setAskForUsername(false);
    getMedia();
  };

  return (
    <div>
      {askForUsername ? (
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            connect();
          }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxWidth: 300,
            margin: 'auto',
            mt: 10,
            alignItems: 'center',
          }}
        >
          <h2>Enter into Lobby</h2>
          <TextField
            id="outlined-basic"
            label="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                color: '#fff',
                transition: 'all 0.3s ease',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: '#FF9839',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FF9839',
                  borderWidth: '2px',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#9ca3af',
                fontWeight: 500,
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#FF9839',
              },
            }}
          />
          <Button variant="contained" type="submit" fullWidth>
            Connect
          </Button>
        </Box>
      ) : (
        <div className={styles.meetVideoContainer}>
          {showModal && (
            <div className={styles.chatRoom}>
              <div className={styles.chatContainer}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <h1>Chat</h1>
                  <Button
                    onClick={() => {
                      setModal(false);
                      setNewMessages(0);
                    }}
                  >
                    Close
                  </Button>
                </Box>

                <div className={styles.chattingDisplay}>
                  {messages.length !== 0 ? (
                    messages.map((item, index) => (
                      <div style={{ marginBottom: '20px' }} key={index}>
                        <p style={{ fontWeight: 'bold' }}>{item.sender}</p>
                        <p>{item.data}</p>
                      </div>
                    ))
                  ) : (
                    <p>No Messages Yet</p>
                  )}
                </div>

                <Box
                  component="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className={styles.chattingArea}
                >
                  <TextField
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    id="outlined-basic"
                    label="Enter Your chat"
                    variant="outlined"
                    fullWidth
                  />
                  <Button variant="contained" type="submit">
                    Send
                  </Button>
                </Box>
              </div>
            </div>
          )}

          <div className={styles.buttonContainers}>
            <IconButton onClick={handleVideo} style={{ color: 'white' }}>
              {video ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
            <IconButton onClick={handleEndCall} style={{ color: 'red' }}>
              <CallEndIcon />
            </IconButton>
            <IconButton onClick={handleAudio} style={{ color: 'white' }}>
              {audio ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            {screenAvailable && (
              <IconButton onClick={handleScreen} style={{ color: 'white' }}>
                {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
              </IconButton>
            )}

            <Badge badgeContent={newMessages} max={99} color="warning">
              <IconButton
                onClick={() => {
                  setModal(!showModal);
                  setNewMessages(0);
                }}
                style={{ color: 'white' }}
              >
                <ChatIcon />
              </IconButton>
            </Badge>
          </div>

          <video
            className={styles.meetUserVideo}
            ref={localVideoref}
            autoPlay
            muted
            playsInline
          ></video>

          <div className={styles.conferenceView}>
            {videos.map((v) => (
              <div key={v.socketId}>
                <video
                  data-socket={v.socketId}
                  ref={(ref) => {
                    if (ref && v.stream) {
                      ref.srcObject = v.stream;
                    }
                  }}
                  autoPlay
                  playsInline
                ></video>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
