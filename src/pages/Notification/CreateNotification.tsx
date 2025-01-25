import { icons } from "../../constants";
import { useRef, useState } from "react";

const CreateNotification = () => {

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [typeNotification, setTypeNotification] = useState(0);

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleNotificationClick = (type: number) => {
    setTypeNotification(type);
    console.log(`Notification type set to: ${type}`);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : "No file chosen");
  };
  return (
    <div className="grid gap-5 smd:grid-cols-2 grid-cols-1 smd:mt-10 smd:ml-10">
      <div className="flex flex-col gap-5 p-4 max-w-2xl">
        <h2 className="text-xl font-semibold">Create New Notification</h2>

        {/* Send To Section */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">
            <span className="text-red-500">*</span>SEND TO:
          </label>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input type="radio" name="sendTo" className="w-4 h-4" />
              <span>All Users:</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="radio" name="sendTo" className="w-4 h-4" />
              <span>Disabled</span>
            </div>
          </div>
        </div>

        {/* Event/Attendees Section */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Event(s)/Attendees:</span>
          <select
            className="border border-gray-border w-full p-2 rounded-sm"
            name=""
            id=""
          >
            <option value="">Events</option>
          </select>
        </div>

        {/* Tags Section */}
        <div className="flex gap-2">
          <h5>Tags</h5>
          <div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <h5>Health Screening</h5>
            </div>
            <select name="" className="bg-primary-light2 mt-3 py-4 p-3" id="">
              <option value="">Cancer Screening</option>
              <option value="">Hight Bp</option>
              <option value="">Heart Disease</option>
            </select>
          </div>
        </div>

        {/* Notification Title */}
        <div className="flex flex-col gap-2 border-t border-gray-border">
          <h6 className="text-sm text-center">Notification Info</h6>
          <label className="text-sm mt-2">
            <span className="text-red-500">*</span>Notification Title
          </label>
          <input
            type="text"
            className="border border-gray-border p-2 rounded"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-sm">Description</label>
          <textarea className="border border-gray-border p-2 rounded h-32" />
        </div>

        {/* Link */}
        <div className="flex flex-col gap-2">
          <label className="text-sm">Link</label>
          <input
            type="text"
            className="border border-gray-border p-2 rounded"
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-sm">Image</label>
          <div className="flex gap-4 items-center">
            <button
              className="bg-primary p-1 rounded-md text-white font-semibold px-3"
              onClick={handleFileButtonClick}
            >
              Choose file +
            </button>
            <span>{fileName}</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          <span>Drafts</span>
        </div>
      </div>
      <div className="smd:border-l border-gray-border pl-5">
        {/* <h5 className="text-center font-semibold mb-4" ><span className="text-failed" >*</span>HOW TO SEND:</h5> */}
        <div className="grid smd:grid-cols-3 grid-cols-1 smd:gap-2 gap-6">
          <div
            className="flex flex-col items-center text-center gap-2"
            onClick={() => handleNotificationClick(0)}
          >
            <div
              className={`border flex flex-col gap-3 items-center rounded-lg font-semibold text-sm p-5 ${
                typeNotification === 0 ? "border-black" : "border-gray-border"
              }`}
            >
              <img src={icons.PlayOnce} alt="" />
              <h6>Simple Notifications</h6>
            </div>
            <p className="text-sm">
              A quick and simple option to send a one-off notification right
              away.
            </p>
          </div>
          <div
            className="h-32 flex flex-col items-center text-center gap-2"
            onClick={() => handleNotificationClick(1)}
          >
            <div
              className={`border flex flex-col gap-3 items-center rounded-lg font-semibold text-sm p-5 ${
                typeNotification === 1 ? "border-black" : "border-gray-border"
              }`}
            >
              <img src={icons.CalendarTwo} alt="" />
              <h6>Scheduled Notification</h6>
            </div>
            <p className="text-sm">
              Create a scheduled or recurring message over a chosen period.
            </p>
          </div>
          <div
            className="h-32 flex flex-col items-center text-center gap-2"
            onClick={() => handleNotificationClick(2)}
          >
            <div
              className={`border flex flex-col gap-3 items-center rounded-lg font-semibold text-sm p-5 ${
                typeNotification === 2 ? "border-black" : "border-gray-border"
              }`}
            >
              <img src={icons.GeoIcon} alt="" />
              <h6>Geo-fenced Notification</h6>
            </div>
            <p className="text-sm">
              Create a message that will be sent to customers when they enter or
              leave a location.
            </p>
          </div>
        </div>
        {typeNotification === 1 && (
          <div className="flex items-center gap-4 mt-10">
            <label className="text-sm w-70">Schedule Date & Time</label>

            <input
              type="date"
              className="border border-gray-border rounded-lg py-2 px-4 text-sm outline-none w-1/2"
            />

            <input
              type="time"
              className="border border-gray-border rounded-lg py-2 px-4 text-sm outline-none w-1/2"
            />
          </div>
        )}
        {typeNotification === 2 && (
          <>
            <div className="relative mt-10">
              <input
                type="text"
                className="border border-gray-border rounded-lg py-2 px-4 pl-10 text-sm outline-none w-full"
                placeholder="Search for an event"
              />
              {/* <CiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2" /> */}
            </div>
            <div className="flex gap-3 items-center mt-8 justify-between ml-10">
              <label className="text-sm">Category</label>
              <input
                type="text"
                className="border border-gray-border p-2 rounded outline-none"
                placeholder="5.65"
              />
              <select
                name=""
                className="border border-gray-border p-2 rounded outline-none w-1/3 text-sm"
                id=""
              >
                <option value="">mile</option>
                <option value="">km</option>
              </select>
              <button className="p-2 px-4 rounded-md bg-primary-light border text-sm border-primary text-primary w-1/3">
                Save
              </button>
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
                      <span className="text-sm">
                        Entering an area after send
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm  w-70">
                    Geo-fence expiration date
                  </label>
                  <input
                    type="date"
                    className="border border-gray-border rounded-lg py-2 px-4 text-sm outline-none w-full"
                  />
                </div>
              </div>
            </div>
          </>
        )}
        <div className="flex items-center mt-8 justify-end">
          {typeNotification !== 2 && (
            <button className="p-2 px-4 rounded-md bg-primary-light border text-sm border-primary text-primary mx-5 mt-10">
              Save
            </button>
          )}
          <button
            className={`p-2 px-4 rounded-md bg-primary-light border text-sm border-primary text-primary ${
              typeNotification === 3 ? "m-auto" : "mx-5"
            } mt-10`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNotification;
