interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = ({ label, error, icon, className = '', ...props }: InputProps) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`w-full ${icon ? 'pl-11' : 'px-4'} py-3 border rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all ${error ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 group-hover:border-gray-300'
            } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">{error}</p>}
    </div>
  );
};
