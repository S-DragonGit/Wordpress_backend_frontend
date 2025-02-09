import { CiSearch } from "react-icons/ci";
import { icons } from "../../constants";
import SwitcherOne from "../../components/SwitcherOne";
import { useState } from "react";
import SwitcherTwo from "../../components/SwitcherTwo";
import { eventDraftedColumns, eventPublishedColumns } from "../../app/columns";
import CalendarView from "../../components/FullCalendar";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../services/events";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentId, selectCurrentToken } from "../../app/redux/userSlice";
import { updateEventStatusApi, getEventById } from "../../services/events";
import TableDraft from "../../components/TableDraft";
import TablePublish from "../../components/TablePublish";
import { setEvents, setCurrentEvent } from "../../app/redux/eventSlice";
import { useNavigate } from "react-router-dom";

const EventManagement = () => {
  const switchList = ["Published", "Drafts"];
  const switchListSvg = [
    { svg: icons.Table, white: icons.TableWhite, title: "Table" },
    { svg: icons.Calendar, white: icons.CalendarWhite, title: "Calendar" },
  ];

  const [switchOne, setSwitchOne] = useState("Table");
  const [switchTwo, setSwitchTwo] = useState("Published");
  const token = useSelector(selectCurrentToken);
  const id = useSelector(selectCurrentId);

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(token, { user_id: id }),
    enabled: !!token,
  });
  // console.log(events);
  const eventList = events?.data?.event_list;
  const dispatch = useDispatch();
  dispatch(setEvents(eventList));
  // console.log(eventList);


  const updateEventStatusMutation = useMutation({
    mutationFn: (data: any) => updateEventStatusApi(token, data),
    onSuccess: (data) => {
      // console.log("Event stasus updated successfully:", data);
      dispatch(setEvents(data));
    },
    onError: (error) => {
      console.error("Error creating event:", error);
    },
  });

  const handleOnPublish = async (event: any) => {
    console.log("View details for update event:", event);
    const data: any = {
      user_id: id,
      post_id: event.ID,
      event_status: "publish",
    };
    try {
      await updateEventStatusMutation.mutate(data);
    } catch (error) {
      console.error("Submission error for updating", error);
    }
  };

  const navigate = useNavigate();
  const getEvent = useMutation({
      mutationFn: (data: any) => getEventById(token, data),
      onSuccess: (data) => {
        // console.log("Event stasus updated successfully:", data.data.data);
        dispatch(setCurrentEvent(data.data.data));
        console.log(data.data.data);
      },
      onError: (error) => {
        console.error("Error creating event:", error);
      },
    });
  const handleOnViewDetails = async (event: any) => {
    const id_data: any = {
      user_id: id,
      post_id: String(Number(event.ID) + 1),
    }
    try {
      await getEvent.mutate(id_data);
    } catch (error) {
      console.error("Submission error:", error);
    }
    navigate(`/eventManagement/${event.ID}`);
  };

  const handleOnViewReviews = async (event: any) => {
    const id_data: any = {
      user_id: id,
      post_id: String(Number(event.ID) + 1),
    }
    try {
      await getEvent.mutate(id_data);
    } catch (error) {
      console.error("Submission error:", error);
    }
    navigate(`/eventManagement/reviews/${event.ID}`);
  };

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
        <SwitcherOne
          list={switchListSvg}
          activeSwitch={switchOne}
          setActiveSwitch={setSwitchOne}
        />
      </div>
      {switchOne === "Table" ? (
        <>
          <div className="mt-2 w-[90%]">
            <SwitcherTwo
              list={switchList}
              activeSwitch={switchTwo}
              setActiveSwitch={setSwitchTwo}
            />
          </div>
          <div className="w-full">
            {isLoading ? (
              <p className="items-center">loading...</p>
            ) : switchTwo === "Published" ? (
              <TablePublish data={eventList} columns={eventPublishedColumns} onViewDetails={handleOnViewDetails} onViewReviews={handleOnViewReviews} />
            ) : (
              <TableDraft
                data={eventList}
                columns={eventDraftedColumns}
                onPublish={handleOnPublish}
                onViewDetails={handleOnViewDetails}
              />
            )}
          </div>
        </>
      ) : (
        <div className="w-full">
          {" "}
          <CalendarView />
        </div>
      )}
    </div>
  );
};

export default EventManagement;
