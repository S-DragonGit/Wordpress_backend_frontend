import { CiSearch } from "react-icons/ci";
import { icons } from "../../constants";
import SwitcherOne from "../../components/SwitcherOne";
import {  useState } from "react";
import SwitcherTwo from "../../components/SwitcherTwo";
import TableOne from "../../components/TableOne";
import { eventDraftedColumns, eventPublishedColumns } from "../../app/columns";
import CalendarView from "../../components/FullCalendar";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../services/events";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../app/redux/userSlice";

const EventManagement = () => {
    const switchList = ["Published", "Drafts"];
    const switchListSvg = [
        { svg: icons.Table, white: icons.TableWhite, title: "Table" },
        { svg: icons.Calendar, white: icons.CalendarWhite, title: "Calendar" }
    ];

    const [switchOne, setSwitchOne] = useState("Table");
    const [switchTwo, setSwitchTwo] = useState("Published");
    const token = useSelector(selectCurrentToken);

    const { data: events, isLoading } = useQuery({
        queryKey: ['events'],
        queryFn: () => fetchEvents(token, { user_id: 8 }),
        enabled: !!token,

    });
    const eventList = events?.data?.event_list

    return (
        <div className="flex flex-col items-center w-full gap-5">
            <div className="flex items-center gap-4 justify-between w-full">
                <Link to={"/eventManagement/create"}>
                    <button className="bg-primary px-3 rounded-lg py-2 flex items-center gap-2 text-white hover:bg-primary-light3 hover:text-primary">
                        Create new <span className="font-bold">+</span>
                    </button>
                </Link>
                <div className="relative w-2/3 hidden sm:block  ">
                    <input
                        type="text"
                        className="border border-gray-border rounded-lg py-2 px-4 pl-10 text-sm outline-none w-full"
                        placeholder="Search for an event"
                    />
                    <CiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 " />
                </div>
                <SwitcherOne list={switchListSvg} activeSwitch={switchOne} setActiveSwitch={setSwitchOne} />
            </div>
            {switchOne === "Table" ? <>
                <div className="mt-2 w-[90%]">
                    <SwitcherTwo list={switchList} activeSwitch={switchTwo} setActiveSwitch={setSwitchTwo} />
                </div>
                <div className="w-full">
                    {
                        isLoading ? <p className="items-center" >loading...</p> : <TableOne columns={switchTwo === "Published" ? eventPublishedColumns : eventDraftedColumns} data={eventList} />
                    }
                </div>
            </> : <div className="w-full"> <CalendarView /></div>}
        </div>
    );
};

export default EventManagement;
