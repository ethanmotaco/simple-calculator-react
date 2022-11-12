import './Screen.css';

const Screen = ({ expression, result, error }) => {
	return (
		<div className='screen'>
			<div className='outer-div'>
				<div className='inner-div'>
					<p className='expression'>{expression}</p>
				</div>
			</div>
			<div className='outer-div'>
				<div className='inner-div'>
					<p className='result'>{error ? error : result}</p>
				</div>
			</div>
		</div>
	);
};

export default Screen;
