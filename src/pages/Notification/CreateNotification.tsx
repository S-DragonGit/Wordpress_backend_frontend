import { CiSearch } from "react-icons/ci";
import { formFieldNotification } from "../../app/list";
import FormOne from "../../components/FormOne";
import { icons } from "../../constants";

const CreateNotification = () => {
    return (
        <div className="flex w-full">
            <div className="grid gap-5 grid-cols-2 mt-10 ml-10">
                <div className="flex flex-col gap-5">
                    {formFieldNotification.map((field, index) => (
                        <FormOne key={index} {...field} />
                    ))}
                </div>
                <div className="border-l border-gray-border pl-5">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="h-32 border border-gray-border flex flex-col gap-3 items-center rounded-lg font-semibold text-sm p-5">
                                <img src={icons.PlayOnce} alt="" />
                                <h6>Simple Notifications</h6>
                            </div>
                            <p className="text-sm">
                                A quick and simple option to send a one-off notification right away.
                            </p>
                        </div>
                        <div className="h-32 flex flex-col items-center text-center gap-2">
                            <div className="border border-gray-border flex flex-col gap-3 items-center rounded-lg font-semibold text-sm p-5">
                                <img src={icons.CalendarTwo} alt="" />
                                <h6>Scheduled Notification</h6>
                            </div>
                            <p className="text-sm">
                                Create a scheduled or recurring message over a chosen period.
                            </p>
                        </div>
                        <div className="h-32 flex flex-col items-center text-center gap-2">
                            <div className="border border-gray-border flex flex-col gap-3 items-center rounded-lg font-semibold text-sm p-5">
                                <img src={icons.GeoIcon} alt="" />
                                <h6>Geo-fenced Notification</h6>
                            </div>
                            <p className="text-sm">
                                Create a message that will be sent to customers when they enter or leave a location.
                            </p>
                        </div>
                    </div>
                    <div className="relative mt-10">
                        <input
                            type="text"
                            className="border border-gray-border rounded-lg py-2 px-4 pl-10 text-sm outline-none w-full"
                            placeholder="Search for an event"
                        />
                        <CiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2" />
                    </div>

                    {/* Map and Geo-fencing Fields */}
                    <div className="mt-10">
                        {/* Google Map Placeholder */}
                        <div className="h-64 w-full border border-gray-border rounded-lg">
                            <iframe
                                title="Google Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509324!2d-122.47795948468134!3d37.775206979758206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064e23e3a65%3A0xb5ef5bfa2b3e728e!2sGolden%20Gate%20Bridge!5e0!3m2!1sen!2sus!4v1600901746727!5m2!1sen!2sus"
                                className="w-full h-full"
                                allowFullScreen
                                loading="lazy"
                            ></iframe>
                        </div>

                        {/* Filter Fields */}
                        <div className="flex flex-col gap-4 mt-5">
                            <div className="flex items-center gap-4">
                                <label className="text-sm ">Filter by location</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="filterByLocation"
                                            value="inAreaAtSend"
                                            className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                                        />
                                        <span className="text-sm">In an area at send</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="filterByLocation"
                                            value="enteringAreaAfterSend"
                                            className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                                        />
                                        <span className="text-sm">Entering an area after send</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="text-sm  w-70">Geo-fence expiration date</label>
                                <input
                                    type="date"
                                    className="border border-gray-border rounded-lg py-2 px-4 text-sm outline-none w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNotification;
