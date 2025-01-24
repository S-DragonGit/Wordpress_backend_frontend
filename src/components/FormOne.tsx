import { useRef, useState } from "react";

// Update the FormOneProps interface
export interface FormOneProps {
    label: string;
    type: string;
    name: string;
    placeholder?: string;
    isRequired?: boolean;
    options?: { label: string; value: string; defaultChecked?: boolean }[];
    items?:{label:string,name:string,type:string}
    value?: string;  // Add this
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;  // Add this
}

// Update the FormOne component
const FormOne: React.FC<FormOneProps> = ({
    label,
    type,
    name,
    placeholder,
    isRequired,
    options,
    value,        // Add this
    onChange      // Add this
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [fileName, setFileName] = useState("No file chosen");

    const handleFileButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log("fileee",file);
        
        setFileName(file ? file.name : "No file chosen");
        // Pass the file object to the onChange callback
    onChange({ target: { value: file } });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start">
            <label htmlFor={name} className="w-24 text-sm">
                {label}{isRequired && '*'}
            </label>
            {type === 'textarea' ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    className="border border-gray-border bg-gray-light rounded-md w-[300px] h-20 p-2 outline-none"
                />
            ) : type === 'radio' ? (
                <div className="flex gap-8 items-center">
                    {options?.map((option, index) => (
                        <label key={index} className="flex items-center gap-2">
                            {/* <input
                                type="radio"
                                name={name}
                                value={option.value}
                                defaultChecked={option.defaultChecked}
                                className="w-4 h-4 text-warning focus:ring-warning"
                            /> */}
                            <input
                                type="radio"
                                name={name}
                                value={option.value}
                                checked={value === option.value} // Ensure the value reflects the state
                                onChange={onChange} // Trigger the state update
                                className="w-4 h-4 text-warning focus:ring-warning"
                            />
                            <span>{option.label}</span>
                        </label>
                    ))}
                </div>
            ) : type === 'checkbox' ? (
                <div className="flex flex-col gap-3">
                    {options?.map((option, index) => (
                        <label key={index} className="flex items-center gap-2" >
                            <input
                                type="checkbox"
                                name={name}
                                value={option.value}
                                checked={Array.isArray(value) && value.includes(option.value)} // Ensure value is an array
onChange={(e) => onChange && onChange(e)} // Pass back to parent
                                className="w-5 h-5 rounded-sm border-2 border-gray-border "
                            />
                            <span className="text-sm">{option.label}</span>
                        </label>
                    ))}
                    {/* <label  className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name={name}
                                value={value}
                                 checked={value?true:false} // Ensure the value reflects the state
                                onChange={onChange
                                }
                               
                                className="w-5 h-5 rounded-sm border-2 border-gray-border appearance-none"
                            />
                            <span className="text-sm">{label}</span>
                        </label> */}
                </div>
            )
            //  : type === 'file' ? (
            //     <div className="flex gap-4 items-center">
            //         <button
            //             className="bg-primary p-1 rounded-md text-white font-semibold px-3"
            //             onClick={handleFileButtonClick}
            //         >
            //             Choose file +
            //         </button>
            //         <span>{fileName}</span>
            //         <input
            //             type="file"
            //             ref={fileInputRef}
            //             onChange={handleFileChange}
            //             className="hidden"
            //         />
            //     </div>
            // ) 
            : type === 'file' ? (
                <div className="flex flex-col gap-2">
                    {/* Label and Button Row */}
                    <div className="flex items-center gap-4">
                        
                        <button
                            type="button"
                            className="bg-primary p-1 rounded-md text-white font-semibold px-4"
                            onClick={handleFileButtonClick}
                        >
                            Choose file +
                        </button>
                        <span className="text-sm text-gray-500">{fileName}</span>
                        <input
                            type="file"
                            name={name}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
            
                    {/* Drag and Drop Component */}
                    <div
                        className="border border-dashed border-gray-border bg-gray-light p-6 rounded-md text-center cursor-pointer flex flex-col items-center gap-2"
                        onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file) {
                                setFileName(file.name);
                            }
                        }}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <div className="text-blue-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 mx-auto"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 16l3.586-3.586a1 1 0 011.414 0L12 16l3.586-3.586a1 1 0 011.414 0L21 16M5 10l7-7m0 0l7 7m-7-7v18"
                                />
                            </svg>
                        </div>
                        <p className="text-gray-500">
                            Drag and drop files here <br />
                            or <a href="#" onClick={handleFileButtonClick} className="text-blue-500">Choose from computer</a>
                        </p>
                    </div>
                </div>
            ) 
            
            : type === 'date' ? (
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}         // Add this
                    onChange={onChange}
                    className="border border-gray-border bg-gray-light rounded-md py-2 w-[300px] outline-none p-2"
                />
            )  : type === 'time' ? (
                <div className="flex items-center gap-2">
                    <input
                        id={name}
                        name={name}
                        type="time"
                        value={value}
                        onChange={onChange}
                        className="border border-gray-border bg-gray-light rounded-md py-2 outline-none p-2 w-[130px]"
                    />
                    {/* <span className="flex items-center">TO</span> */}
                </div>
            ) : (
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}         // Add this
                    onChange={onChange}
                    className="border border-gray-border bg-gray-light rounded-md py-2 w-[300px] outline-none p-2"
                />
            )}
        </div>
    );
};

export default FormOne;