import { formFields } from "../../app/list";
import FormOne from "../../components/FormOne";

const CreateEvents: React.FC = () => {
    return (
        <div className="flex">
            <div className="grid grid-cols-2 mt-10 ml-10">
                <div className="flex flex-col gap-5">
                    {formFields.map((field, index) => (
                        <FormOne key={index} {...field} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CreateEvents;
