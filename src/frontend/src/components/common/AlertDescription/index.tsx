import { CommonParagraph } from '@/ui/Common.css';
import {
  AlertDescriptionContainer,
  AlertDescriptionImage,
  AlertDescriptionTextBox,
  AlertDescriptionTitle,
} from './index.css';
import CircleInformation from '@/assets/img/CircleInformation.svg';
export const AlertDescription = (props: { title: string; description: string }) => {
  return (
    <AlertDescriptionContainer>
      <AlertDescriptionImage>
        <img src={CircleInformation} alt="alert-description-image" />
      </AlertDescriptionImage>
      <AlertDescriptionTextBox>
        <AlertDescriptionTitle>{props.title}</AlertDescriptionTitle>
        <CommonParagraph>{props.description}</CommonParagraph>
      </AlertDescriptionTextBox>
    </AlertDescriptionContainer>
  );
};
