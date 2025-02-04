import { useNavigate } from 'react-router-dom';
import { ChangeToHTML } from './ChangeToHTML';
import { Li } from './index.css';

export const SearchListItem = (props: {
  inputText?: string;
  resultText: string;
  resetSearchState: () => void;
  isTargetIndex?: boolean;
}) => {
  const { resultText, inputText, resetSearchState, isTargetIndex } = props;
  const navigate = useNavigate();

  return (
    <Li
      className={isTargetIndex ? 'active' : ''}
      onClick={() => {
        const query = `?q=${resultText}`;

        navigate({
          pathname: 'search',
          search: query,
        });
        resetSearchState();
      }}
    >
      <ChangeToHTML origin={resultText} replace={inputText} />
    </Li>
  );
};
