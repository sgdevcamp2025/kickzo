import PeopleSearch from '@/assets/img/PeopleSearch.svg';
import {
  GreetingViewContainer,
  GreetingViewImage,
  GreetingViewSubTitle,
  GreetingViewTitle,
  GreetingViewWrapper,
} from '@/ui/Common.css';

export const NoFriendView = () => {

  return (
    <GreetingViewWrapper>
      <GreetingViewContainer>
        <GreetingViewImage>
          <img src={PeopleSearch} alt="greeting-view-image" />
        </GreetingViewImage>
        <GreetingViewTitle>아직 친구가 없어요</GreetingViewTitle>
        <GreetingViewSubTitle>새로운 친구를 추가하고 함께 대화를 나눠보세요!</GreetingViewSubTitle>
      </GreetingViewContainer>
    </GreetingViewWrapper>
  );
};
