import { useRef, useState } from "react";

export interface FormOneProps {
    label: string; // Label text for the field
    type: string;
    name: string; // Field name
    placeholder?: string; // Placeholder text for text/textarea fields
    isRequired?: boolean; // Whether the field is required
    options?: { label: string; value: string; defaultChecked?: boolean }[];
}

const FormOne: React.FC<FormOneProps> = ({ label, type, name, placeholder, isRequired, options }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [fileName, setFileName] = useState("No file chosen");

    const handleFileButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger file input click
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Optional chaining for safety
        setFileName(file ? file.name : "No file chosen");
    };
    return (
        <div className="flex gap-4 items-start">
            <label htmlFor={name} className="w-24 text-sm">
                {label}{isRequired && '*'}
            </label>
            {type === 'textarea' ? (
                <textarea
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    className="border border-gray-border bg-gray-light rounded-md w-[300px] h-20 p-2 outline-none"
                />
            ) : type === 'radio' ? (
                <div className="flex gap-8 items-center">
                    {options?.map((option, index) => (
                        <label key={index} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name={name}
                                value={option.value}
                                defaultChecked={option.defaultChecked}
                                className="w-4 h-4 text-warning focus:ring-warning"
                            />
                            <span>{option.label}</span>
                        </label>
                    ))}
                </div>
            ) : type === 'checkbox' ? (
                <div className="flex flex-col gap-3">
                    {options?.map((option, index) => (
                        <label key={index} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name={name}
                                className="w-5 h-5 rounded-sm border-2  border-gray-border appearance-none "
                            />
                            <span className="text-sm">{option.label}</span>
                        </label>
                    ))}
                </div>
            )
                : type === 'file' ? (
                    <div className="flex gap-4 items-center">
                        <button
                            className="bg-primary p-1 rounded-md text-white font-semibold px-3"
                            onClick={handleFileButtonClick}
                        >
                            Choose file +
                        </button>
                        <span>{fileName}</span>
                        {/* Hidden input field */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                )
                    : (
                        <input
                            id={name}
                            name={name}
                            type={type}
                            placeholder={placeholder}
                            className="border border-gray-border bg-gray-light rounded-md py-2 w-[300px] outline-none p-2"
                        />
                    )}
        </div>
    );
};

export default FormOne;