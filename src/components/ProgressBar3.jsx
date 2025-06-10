import React from 'react'

const ProgressBar3 = ({ isAvailable }) => {
	const totalSteps = 3;
	const progressPercentage = (isAvailable / totalSteps) * 100;

	return (
		<div className="w-full max-w-4xl mx-auto mb-6">
			<div className="w-full h-4 bg-red-400 rounded-full overflow-hidden">
				<div
					className="h-full bg-green-500 transition-all duration-500"
					style={{ width: `${progressPercentage}%` }}
				></div>
			</div>
		</div>
	);
};


export default ProgressBar3 