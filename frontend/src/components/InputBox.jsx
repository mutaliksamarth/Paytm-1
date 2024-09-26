export function InputBox({ label, placeholder, value, onChange }) {
    return (
        <div>
            <div className="text-sm font-medium text-left py-2">
                {label}
            </div>
            <input 
                value={value}  // Controlled input value
                onChange={onChange}  // Handles changes
                placeholder={placeholder} 
                className="w-full px-2 py-1 border rounded bg-slate-100 border-slate-100" 
            />
        </div>
    );
}
