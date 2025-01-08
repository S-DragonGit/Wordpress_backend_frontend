import { formFields, formFieldsTwo, meetingTags } from "../../app/list";
import FormOne from "../../components/FormOne";
import RecurringComponent from "../../components/Recurring";

const CreateEvents: React.FC = () => {
    return (
        <div className="flex gap-2">
            <div className="grid gap-5 grid-cols-2 mt-10 ml-10">
                <div className="flex flex-col gap-5">
                    {formFields.map((field, index) => (
                        <FormOne key={index} {...field} />
                    ))}
                </div>
                <div className="flex flex-col gap-5">
                    {formFieldsTwo.map((field, index) => (
                        <FormOne key={index} {...field} />
                    ))}
                </div>
                <div className="col-span-2" >
                    <RecurringComponent />
                </div>
            </div>
            <div>
                <div className="flex flex-col items-center w-80 p-2 bg-primary-light rounded-lg">
                    <h5 className="font-semibold text-lg mb-4">Meeting Tags</h5>
                    {meetingTags.map((tag, index) => (
                        <div key={index} className="w-full flex flex-col items-center mb-4">
                            {/* Category Checkbox */}
                            <label className="flex items-center gap-2 mb-2">
                                <input type="checkbox" className="w-4 h-4" />
                                <span className="text-sm">{tag.category}</span>
                            </label>

                            {/* Sub-items inside the colored background */}
                            <div className="bg-primary-light3 p-4 rounded-md w-full flex flex-col items-center border border-gray-border">
                                <div
                                    className={
                                        index === 0
                                            ? "grid grid-cols-2 gap-2" // Two columns for the first category
                                            : "flex flex-col gap-2  w-full"    // Default layout for others
                                    }
                                >
                                    {tag.items.map((item, idx) => (
                                        <label key={idx} className="flex items-center gap-1">
                                            <input type="checkbox" className="w-4 h-4" />
                                            <span className="text-sm">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex w-full justify-between mt-4" >
                    <button className="p-2 px-4 rounded-md bg-primary-light border text-sm border-primary text-primary">Create and Publish</button>
                    <button className="p-2 px-4 rounded-md bg-primary text-white text-sm">Create in Drafts</button>
                </div>
            </div>

        </div>
    );
};

export default CreateEvents;
