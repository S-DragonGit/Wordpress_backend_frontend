import { useState } from "react";
import SwitcherTwo from "../../components/SwitcherTwo"
import CalendarView from "../../components/FullCalendar";
import NavigatorView from "../../components/NavigatorView";

const NavigatorMng = () => {
  const switchList = ["One View", "Navigator View"];
  const [switchTwo, setSwitchTwo] = useState("One View");
  return (
    <div >
      <div className="w-[90%] mx-auto" >
        <SwitcherTwo list={switchList} activeSwitch={switchTwo} setActiveSwitch={setSwitchTwo} />
      </div>
      {switchTwo === "One View" ? <CalendarView /> : <NavigatorView />}
    </div>
  )
}

export default NavigatorMng