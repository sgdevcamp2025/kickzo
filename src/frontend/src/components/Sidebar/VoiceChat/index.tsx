import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

import MicrophoneOn from '@/assets/img/MicrophoneOn.svg';
import HeadphoneOn from '@/assets/img/HeadphoneOn.svg';
import MicrophoneOffRed from '@/assets/img/MicrophoneOffRed.svg';
import HeadphoneOffRed from '@/assets/img/HeadphoneOffRed.svg';

import { useCurrentRoomStore } from '@/stores/useCurrentRoomStore';
import { useUserStore } from '@/stores/useUserStore';

import { SidebarType } from '@/types/enums/SidebarType';
import { ProfileType } from '@/types/enums/ProfileType';

import { RoomProfileModal } from '@/components/Modal/RoomProfileModal';
import { SmallProfile } from '@/components/common/SmallProfile';
import { RoleNickname } from '@/components/common/RoleNickname';

import {
  Container,
  ParticipantsPreview,
  VideoSection,
  MyVideoSection,
  RemoteVideoGrid,
  FooterBar,
  ActionButton,
  JoinButton,
  ProfileWrapper,
} from './index.css';

export const VoiceChat = () => {
  const roomId = useCurrentRoomStore(state => state.roomId);
  const userId = useUserStore(state => state.user?.userId);
  const userNickname = useUserStore(state => state.user?.nickname);
  const userList = useCurrentRoomStore(state => state.currentRoom?.roomDetails.userList || []);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [joined, setJoined] = useState(false);
  const [, setMuted] = useState(false);
  const [, setCameraOff] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);

  const myFaceRef = useRef<HTMLVideoElement | null>(null);
  const callRef = useRef<HTMLDivElement | null>(null);
  const myStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
  const userMapRef = useRef<{ [socketId: string]: string }>({});

  useEffect(() => {
    if (!socket) {
      const newSocket = io('http://localhost:8105', { transports: ['websocket'] });
      console.log('소켓연결');
      setSocket(newSocket);
    }
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        if (!roomId) return;
        const response = await axios.get(`http://localhost:8105/api/signal/participants/${roomId}`);
        if (response.data?.users) {
          setParticipants(response.data.users);
          console.log('API participants:', response.data.users);
        }
      } catch (error) {
        console.error('fetchUserList error:', error);
      }
    };
    fetchUserList();
  }, [roomId]);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit('request_participants', roomId);
    }
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket) return;

    const handleUpdateUserList = (users: string[]) => {
      setParticipants(users);
      console.log('소켓 participants:', users);
    };
    socket.on('update_user_list', handleUpdateUserList);

    const handleUserLeft = (socketId: string) => {
      const videoContainer = document.getElementById(`container_${socketId}`);
      if (videoContainer && callRef.current) {
        callRef.current.removeChild(videoContainer);
      }
      if (peersRef.current[socketId]) {
        peersRef.current[socketId].close();
        delete peersRef.current[socketId];
      }
      if (userMapRef.current[socketId]) {
        delete userMapRef.current[socketId];
      }
    };
    socket.on('user_left', handleUserLeft);

    const handleWelcome = async (newSocketId: string, newUserId: string) => {
      userMapRef.current[newSocketId] = newUserId;
      makeConnection(newSocketId);

      const pc = peersRef.current[newSocketId];
      if (!pc) return;
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('offer', offer, newSocketId);
    };

    const handleOffer = async (
      offer: RTCSessionDescriptionInit,
      remoteId: string,
      remoteUserId: string,
    ) => {
      userMapRef.current[remoteId] = remoteUserId;
      if (!myStreamRef.current) {
        await getMedia();
      }
      makeConnection(remoteId);

      const pc = peersRef.current[remoteId];
      if (!pc) return;
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', answer, remoteId);
    };

    const handleAnswer = (
      answer: RTCSessionDescriptionInit,
      remoteId: string,
      remoteUserId: string,
    ) => {
      userMapRef.current[remoteId] = remoteUserId;
      const pc = peersRef.current[remoteId];
      pc?.setRemoteDescription(answer);
    };

    const handleIce = (ice: RTCIceCandidate, remoteId: string, remoteUserId: string) => {
      userMapRef.current[remoteId] = remoteUserId;
      peersRef.current[remoteId]?.addIceCandidate(ice);
    };

    socket.on('welcome', handleWelcome);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice', handleIce);

    return () => {
      socket.off('update_user_list', handleUpdateUserList);
      socket.off('user_left', handleUserLeft);
      socket.off('welcome', handleWelcome);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice', handleIce);
    };
  }, [socket]);

  useEffect(() => {
    if (joined && socket && roomId && userId) {
      getMedia();
      socket.emit('join_room', { roomId, userId });
    }
  }, [joined, socket, roomId, userId]);

  async function getMedia(deviceId?: string) {
    const constraints = deviceId
      ? { audio: true, video: { deviceId: { exact: deviceId } } }
      : { audio: true, video: { facingMode: 'user' } };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      myStreamRef.current = stream;
      if (myFaceRef.current) {
        myFaceRef.current.srcObject = stream;
        myFaceRef.current.muted = true;
      }
      if (!deviceId) {
        await getCameras();
      }
    } catch (err) {
      console.error('getMedia error:', err);
    }
  }
  async function getCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(d => d.kind === 'videoinput');
      setCameras(videoInputs);
    } catch (err) {
      console.error('getCameras error:', err);
    }
  }

  function makeConnection(socketId: string) {
    if (peersRef.current[socketId]) return;
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
    });

    pc.addEventListener('icecandidate', e => {
      if (e.candidate) {
        socket?.emit('ice', e.candidate, socketId);
      }
    });

    pc.addEventListener('track', e => {
      const remoteUserId = userMapRef.current[socketId] || 'Unknown';
      const containerId = `container_${socketId}`;
      let videoContainer = document.getElementById(containerId) as HTMLDivElement | null;
      if (!videoContainer) {
        videoContainer = document.createElement('div');
        videoContainer.id = containerId;
        videoContainer.style.display = 'flex';
        videoContainer.style.flexDirection = 'column';
        videoContainer.style.alignItems = 'center';
        videoContainer.style.height = '80%';
      }
      let peerVideo = document.getElementById(socketId) as HTMLVideoElement | null;
      if (!peerVideo) {
        peerVideo = document.createElement('video');
        peerVideo.id = socketId;
        peerVideo.autoplay = true;
        peerVideo.playsInline = true;
        peerVideo.width = 150;
        peerVideo.height = 100;
        peerVideo.style.marginBottom = '10px';
      }
      peerVideo.srcObject = e.streams[0];

      let label = document.getElementById(`label_${socketId}`) as HTMLDivElement | null;
      if (!label) {
        label = document.createElement('div');
        label.id = `label_${socketId}`;
        label.style.fontWeight = 'bold';
      }
      const found = userList.find(u => String(u.userId) == remoteUserId);

      const userNickname = found?.nickname ?? 0;
      label.innerText = `${userNickname}`;

      videoContainer.appendChild(peerVideo);
      videoContainer.appendChild(label);

      if (callRef.current && !document.getElementById(containerId)) {
        callRef.current.appendChild(videoContainer);
      }
    });

    if (myStreamRef.current) {
      myStreamRef.current.getTracks().forEach(track => pc.addTrack(track, myStreamRef.current!));
    }

    peersRef.current[socketId] = pc;
  }

  function handleJoinClick() {
    if (!roomId || !userId) {
      alert('Room ID와 User ID가 필요합니다!');
      return;
    }
    setJoined(true);
  }

  function handleLeaveClick() {
    if (myStreamRef.current) {
      myStreamRef.current.getTracks().forEach(track => track.stop());
    }
    socket?.disconnect();
    setJoined(false);

    if (myFaceRef.current) {
      myFaceRef.current.srcObject = null;
    }
    Object.values(peersRef.current).forEach(pc => pc.close());
    peersRef.current = {};
    userMapRef.current = {};
    setParticipants([]);
  }

  // 마이크/카메라 버튼
  const handleMicrophone = () => {
    setMicOn(!micOn);
    if (myStreamRef.current) {
      myStreamRef.current.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
    }
    setMuted(prev => !prev);
  };

  const handleSound = () => {
    setSoundOn(!soundOn);
    if (myStreamRef.current) {
      myStreamRef.current.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
    }
    setCameraOff(prev => !prev);
  };

  const [activeProfile, setActiveProfile] = useState<number | null>(null);
  const currentRoom = useCurrentRoomStore(state => state.currentRoom);
  const handleProfileClick = (id: number) => {
    setActiveProfile(prevId => (prevId === id ? null : id));
  };

  return (
    <Container>
      <ParticipantsPreview>
        {!joined &&
          participants.map(member => {
            const found = userList.find(u => String(u.userId) === member);
            const displayId = found?.userId ?? 0;
            const displayName = found?.nickname ?? 'nickname없음';
            const displayRole = found?.role ?? 2;
            const displayImg = found?.profileImageUrl ?? 'profileImageUrl없음';

            return (
              <ProfileWrapper key={displayId}>
                <div onClick={() => handleProfileClick(displayId)}>
                  <SmallProfile
                    type={ProfileType.MEMBER}
                    role={displayRole}
                    nickname={displayName}
                    imgUrl={displayImg}
                  />
                </div>
                {roomId && activeProfile === displayId && (
                  <RoomProfileModal
                    userId={displayId}
                    roomId={roomId}
                    nickname={displayName}
                    imgUrl={displayImg}
                    userRole={displayRole}
                    myRole={currentRoom?.myRole ?? 2}
                    sidebarType={SidebarType.USERLIST}
                    onCancel={() => setActiveProfile(null)}
                  />
                )}
              </ProfileWrapper>
            );
          })}
      </ParticipantsPreview>

      {joined && (
        <VideoSection>
          <RemoteVideoGrid ref={callRef} />
          <MyVideoSection>
            <video ref={myFaceRef} autoPlay playsInline width={150} height={100} />
            <RoleNickname role={currentRoom?.myRole ?? 2} nickname={userNickname ?? ''} />
          </MyVideoSection>
        </VideoSection>
      )}

      <FooterBar>
        <ActionButton onClick={handleMicrophone}>
          <img src={micOn ? MicrophoneOn : MicrophoneOffRed} alt="mic-toggle" />
        </ActionButton>
        <ActionButton onClick={handleSound}>
          <img src={soundOn ? HeadphoneOn : HeadphoneOffRed} alt="sound-toggle" />
        </ActionButton>
        {!joined ? (
          <JoinButton onClick={handleJoinClick}>입장</JoinButton>
        ) : (
          <JoinButton onClick={handleLeaveClick}>퇴장</JoinButton>
        )}
      </FooterBar>
    </Container>
  );
};
