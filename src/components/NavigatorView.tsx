import images from '../constants/images'
import DatePicker from '../components/DatePicker'
import TableOne from "./TableOne";
import { navigatiorColumn } from '../app/columns';
import { eventPublished } from '../app/list';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { calendarEvents } from "../app/list";

const NavigatorView = () => {
    return (
        <div className='mt-14 flex gap-2'>
            <div className='sm:grid grid-cols-2 gap-4 sm:w-[75%] w-full  ' >
                <div className='flex flex-col items-center rounded-lg bg-primary-light3 px-6 py-8 '>
                    <img className='h-30 w-30 rounded-full -translate-y-16' src={images.ProfileOne} alt="" />
                    <div className='w-full text-center flex -translate-y-13 flex-col gap-1'>
                        <h6 className='font-semibold text-xl mt-3 '>Jack Daniels</h6>
                        <p className='text-sm'>navigatior@rafiki.com</p>
                        <p className='text-sm'>+1 (1234) 567-890</p>
                        <p className='text-sm'>123 ABC Street, Apt 123, City, State, 12345</p>
                    </div>
                </div>
                <div >
                    <div className='shadow-1 rounded-lg bg-white w-full'>
                        <DatePicker />
                    </div>
                </div>
                <div className='col-span-2 ' >
                    <TableOne columns={navigatiorColumn} data={eventPublished}/>
                </div>
            </div>
            <div className=" w-[280px]  text-sm">
                <FullCalendar
                    plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        interactionPlugin,
                        listPlugin,
                    ]}
                    headerToolbar={{
                        left: "",
                        // center: "title",
                        right: "",
                    }}
                    events={calendarEvents}
                    editable={true}
                    rerenderDelay={10}
                    eventDurationEditable={false}
                    selectable={true}
                    selectMirror={true}
                    droppable={true}
                    dayMaxEvents={2}
                    weekends={true}
                    contentHeight={600}
                    initialView="timeGridDay"
                />
            </div>

        </div>
    )
}

export default NavigatorView