import Logo from '@/assets/img/Logo.png';
import { Link } from 'react-router-dom';

export const LogoButton = () => {
  return (
    <Link to="/">
      <img src={Logo} alt="Logo" />
    </Link>
  );
};
