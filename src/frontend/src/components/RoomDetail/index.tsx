import { useState } from 'react';

import {
  TitleContainer,
  TitleContainer_Img,
  Title,
  Username,
  DescriptionContainer,
  Description,
  TitleContainer_MemberNum,
  MoreButton,
  Circle,
} from './index.css';

const roomInfoExample = {
  imgUrl:
    'https://yt3.ggpht.com/YHA2HDj6dt07Qrtbfdyi94eKId71Bmoz6z9LfcLCbCv_RRnxUTYSn0p_IkW9k6Qkp_04Lq-56A=s88-c-k-c0x00ffffff-no-rj',
  title: '너무 조용하지도, 너무 들뜨지도 않아 듣기 좋은 재즈',
  creator: '유자네임',
  description:
    '설명이 들어갈 것이면 그렇다면 여기에 많은 내용이 담기겠죠\n심지어 단을 나눠서 설명이 필요할 수도 있겠죠\n#안정적 #음악 #코지\n#유료광고포함 #숨겨둠',
  people: '500',
};

export const RoomDetail = () => {
  return (
    <TitleContainer>
      <div>
        <TitleContainer_Img src={roomInfoExample.imgUrl} />
        <div>
          <Title>{roomInfoExample.title}</Title>
          <Username>{roomInfoExample.creator}</Username>
          <DescriptionText description={roomInfoExample.description} />
        </div>
      </div>
      <TitleContainer_MemberNum>
        <Circle />
        201 / {roomInfoExample.people}
      </TitleContainer_MemberNum>
    </TitleContainer>
  );
};

const DescriptionText = (props: { description: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <DescriptionContainer>
      <Description $isExpanded={isExpanded}>
        {props.description.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </Description>
      {!isExpanded && props.description.split('\n').length > 3 && (
        <MoreButton onClick={() => setIsExpanded(true)}>더보기</MoreButton>
      )}
      {isExpanded && <MoreButton onClick={() => setIsExpanded(false)}>접기</MoreButton>}
    </DescriptionContainer>
  );
};
