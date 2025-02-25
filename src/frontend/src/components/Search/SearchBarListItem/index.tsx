import { useNavigate } from 'react-router-dom';
import { ChangeToHTML } from './ChangeToHTML';
import { Img, Li, Thumbnail } from './index.css';
import DefaultProfile from '@/assets/img/DefaultProfile.svg';
import DefaultThumbnail from '@/assets/img/DefaultThumbnail.svg';
import { useEffect, useState } from 'react';
import { getYoutubeThumbnail } from '@/utils/youtubeUtils';

export const SearchListItem = (props: {
  inputText?: string;
  resultText: string;
  resetSearchState: () => void;
  isTargetIndex?: boolean;
  imageUrl?: string;
  type: 'user' | 'room';
}) => {
  const { resultText, inputText, resetSearchState, isTargetIndex, type, imageUrl } = props;
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState<string>(DefaultThumbnail);

  useEffect(() => {
    if (type !== 'room' || !imageUrl) return;

    const fetchThumbnail = async () => {
      const url = await getYoutubeThumbnail(imageUrl ?? '', 'default');
      setThumbnail(url ?? DefaultThumbnail);
    };

    fetchThumbnail();
  }, [type, imageUrl]);

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
      {type === 'user' ? (
        <Img>
          <img src={imageUrl ?? DefaultProfile} alt="profile" />
        </Img>
      ) : (
        <Thumbnail>
          <img
            src={thumbnail}
            onError={e => {
              e.currentTarget.src = DefaultThumbnail;
            }}
            alt="thumbnail"
          />
        </Thumbnail>
      )}
      <ChangeToHTML origin={resultText} replace={inputText} />
    </Li>
  );
};
