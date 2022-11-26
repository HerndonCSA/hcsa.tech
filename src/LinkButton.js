import { useNavigate } from 'react-router-dom';

export default function LinkButton({ to, children }) {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    navigate(to);
  }
  return (
    <button onClick={handleClick}>{children}</button>
  );
}