import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ label, error, className = '', ...props }, ref) => {
		return (
			<div className="space-y-2">
				{label && (
					<label className="block text-sm font-medium text-gray-700">
						{label}
					</label>
				)}
				<input
					ref={ref}
					className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${className}`}
					{...props}
				/>
				{error && (
					<p className="text-sm text-red-500">{error}</p>
				)}
			</div>
		);
	}
);

Input.displayName = 'Input';

export default Input;
