import { useState } from "react";
import SwitcherTwo from "../../components/SwitcherTwo"
import CalendarScheduler from "../../components/CalenderScheduler";


const NavigatorMng = () => {
  const switchList = ["One View", "Navigator View"];
  const [switchTwo, setSwitchTwo] = useState("One View");
  return (
    <div className="w-[90%] mx-auto">
      <SwitcherTwo list={switchList} activeSwitch={switchTwo} setActiveSwitch={setSwitchTwo} />
      <CalendarScheduler />
    </div>
  )
}

export default NavigatorMng