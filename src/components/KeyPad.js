import './KeyPad.css';

const KeyPad = ({ children }) => {
	return (
		<div id='keyPad' className='keyPad'>
			{children}
		</div>
	);
};

export default KeyPad;
