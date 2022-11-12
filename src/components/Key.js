import './Key.css';

const Key = ({ value, onClick }) => {
	return <button onClick={onClick}>{value}</button>;
};

export default Key;
