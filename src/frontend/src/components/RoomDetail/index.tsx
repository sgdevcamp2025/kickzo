import { useEffect, useRef, useState } from 'react';

import {
  Container,
  TitleContainer_Img,
  TextContainer,
  Title,
  Username,
  DescriptionContainer,
  Description,
  MemberCount,
  MoreButton,
  Circle,
} from './index.css';
import { useMyRoomsStore } from '@/stores/useMyRoomsStore';
import DefaultProfile from '@/assets/img/DefaultProfile.svg';

export const RoomDetail = () => {
  const currentRoom = useMyRoomsStore(state => state.currentRoom);
  const roomInfo = currentRoom?.roomDetails.roomInfo[0];

  const handleDescription = () => {
    if (roomInfo?.description == null) return '';
    return roomInfo?.description;
  };

  return (
    <Container>
      <TitleContainer_Img
        src={roomInfo?.profileImageUrl ?? DefaultProfile}
        onError={e => {
          e.currentTarget.src = DefaultProfile;
        }}
      />
      <TextContainer>
        <Title>{roomInfo?.title}</Title>
        <Username>{roomInfo?.creator}</Username>
        <DescriptionText description={handleDescription()} />
      </TextContainer>
      <MemberCount>
        <Circle />
        {roomInfo?.userCount}명
      </MemberCount>
    </Container>
  );
};

const DescriptionText = (props: { description: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      setIsOverflowing(element.scrollHeight > element.clientHeight);
    }
  }, [props.description]);

  return (
    <DescriptionContainer>
      <Description ref={textRef} $isExpanded={isExpanded}>
        {props.description.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </Description>
      {!isExpanded && isOverflowing && (
        <MoreButton onClick={() => setIsExpanded(true)}>더보기</MoreButton>
      )}
      {isExpanded && <MoreButton onClick={() => setIsExpanded(false)}>접기</MoreButton>}
    </DescriptionContainer>
  );
};
