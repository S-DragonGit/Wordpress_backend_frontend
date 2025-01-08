import { useState } from "react";
import SwitcherTwo from "../../components/SwitcherTwo";
import TableOne from "../../components/TableOne";
import { eventDraftedColumns, eventPublishedColumns } from "../../app/columns";
import { eventPublished } from "../../app/list";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";

const Notification = () => {
  const switchList = ["Sent", "Scheduled","Draft"];

    const [switchTwo, setSwitchTwo] = useState("Sent");

    return (
        <div className="flex flex-col items-center w-full gap-5">
            <div className="flex items-center gap-4  w-full">
                <Link to={"/notifications/create"} >
                <button className="bg-primary px-3 rounded-lg py-2 flex items-center gap-2 text-white hover:bg-primary-light3 hover:text-primary">
                    Create new <span className="font-bold">+</span>
                </button>
                </Link>
                <div className="relative w-2/3">
                    <input
                        type="text"
                        className="border border-gray-border rounded-lg py-2 px-4 pl-10 text-sm outline-none w-full"
                        placeholder="Search for an event"
                    />
                    <CiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 " />
                </div>
            </div>
            <div className="mt-2 w-[90%]">
                <SwitcherTwo list={switchList} activeSwitch={switchTwo} setActiveSwitch={setSwitchTwo} />
            </div>
            <div className="w-full">
                <TableOne columns={switchTwo === "Draft" ? eventDraftedColumns: eventPublishedColumns } data={eventPublished} />
            </div>
        </div>
    );
};

export default Notification