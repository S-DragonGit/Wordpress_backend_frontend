
export interface FormOneProps {
    label: string; // Label text for the field
    type: string;
    name: string; // Field name
    placeholder?: string; // Placeholder text for text/textarea fields
    isRequired?: boolean; // Whether the field is required
    options?: { label: string; value: string; defaultChecked?: boolean }[];
    optionsTwo?: { label: string; value: string; defaultChecked?: boolean }[];
}

const FormOne: React.FC<FormOneProps> = ({ label, type, name, placeholder, isRequired, options, optionsTwo }) => {
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
            ) : type === 'radioTwo' ? (
                <div className="flex flex-col gap-3">
                    {optionsTwo?.map((option, index) => (
                        <label key={index} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name={name}
                                value={option.value}
                                defaultChecked={option.defaultChecked}
                                className="w-4 h-4 border-2 border-gray-300 appearance-none checked:bg-transparent checked:border-blue-500"
                            />
                            <span className="text-sm">{option.label}</span>
                        </label>
                    ))}
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