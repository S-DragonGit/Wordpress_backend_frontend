import { useState } from "react";

const RecurringComponent = () => {
    const [isRecurring, setIsRecurring] = useState(false);
    const [repeatEvery, setRepeatEvery] = useState(1);
    const [selectedDays, setSelectedDays] = useState<string[]>([]); // Define as an array of strings
    const [time, setTime] = useState({ hour: 10, period: "am" });
    const [endOption, setEndOption] = useState("never");
    const [endDate, setEndDate] = useState("");
    const [occurrences, setOccurrences] = useState(4);

    const daysOfWeek = ["M", "T", "W", "Th", "F"];

    const toggleDay = (day: string) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter((d) => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    }

    return (
        <div className=" p-5 rounded-lg w-full max-w-2xl ">
            {/* Recurring Checkbox */}
            <div className={`flex items-center gap-2 ${isRecurring && "bg-primary-light2"} rounded-t-md  p-3 w-30`}>
                <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-4 h-4"
                />
                <span className="text-sm font-medium">Recurring?</span>
            </div>
            <div className={`bg-primary-light2 w-full rounded-b-md  transition-all duration-500 ease-in-out overflow-hidden ${isRecurring && "p-3"} `} >

                {isRecurring && (
                    <>
                        {/* Repeat Every */}
                        <div className="flex items-center gap-10  w-full p-5 ">
                            <div >
                                <div className="flex items-center gap-1 mb-4  ">
                                    <span className="text-sm">Repeat every:</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                setRepeatEvery((prev) => Math.max(prev - 1, 1))
                                            }
                                            className="w-8 h-8 bg-white flex justify-center items-center rounded-md"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={repeatEvery}
                                            onChange={(e) =>
                                                setRepeatEvery(Math.max(1, Number(e.target.value)))
                                            }
                                            className="w-12 text-center p-1 border border-gray-border rounded-md"
                                        />
                                        <button
                                            onClick={() =>
                                                setRepeatEvery((prev) => prev + 1)
                                            }
                                            className="w-8 h-8 bg-white flex justify-center items-center rounded-md"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="text-sm">week(s)</span>
                                </div>

                                {/* Repeat On */}
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-sm">Repeat on:</span>
                                    <div className="flex gap-2">
                                        {daysOfWeek.map((day, index) => (
                                            <button
                                                key={index}
                                                onClick={() => toggleDay(day)}
                                                className={`w-10 h-10 flex justify-center items-center rounded-full ${selectedDays.includes(day)
                                                    ? "bg-primary text-white"
                                                    : "bg-white"
                                                    }`}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Time Selection */}
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-sm">Time:</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={time.hour}
                                            onChange={(e) =>
                                                setTime((prev) => ({
                                                    ...prev,
                                                    hour: Math.min(
                                                        12,
                                                        Math.max(1, Number(e.target.value))
                                                    ),
                                                }))
                                            }
                                            className="w-12 text-center p-1 border border-gray-border rounded-md"
                                        />
                                        <select
                                            value={time.period}
                                            onChange={(e) =>
                                                setTime((prev) => ({
                                                    ...prev,
                                                    period: e.target.value,
                                                }))
                                            }
                                            className="border p-1 border-gray-border rounded-md"
                                        >
                                            <option value="am">am</option>
                                            <option value="pm">pm</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* End Options */}
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-sm">Ends:</span>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="endOption"
                                            value="never"
                                            checked={endOption === "never"}
                                            onChange={(e) => setEndOption(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm">Never</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="endOption"
                                            value="on"
                                            checked={endOption === "on"}
                                            onChange={(e) => setEndOption(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm">On</span>
                                        <input
                                            type="date"
                                            disabled={endOption !== "on"}
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="border border-gray-border rounded-md p-1"
                                        />
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="endOption"
                                            value="after"
                                            checked={endOption === "after"}
                                            onChange={(e) => setEndOption(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm">After</span>
                                        <input
                                            type="number"
                                            disabled={endOption !== "after"}
                                            value={occurrences}
                                            onChange={(e) =>
                                                setOccurrences(Math.max(1, Number(e.target.value)))
                                            }
                                            className="w-16 text-center border border-gray-border rounded-md"
                                        />
                                        <span className="text-sm">occurrences</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RecurringComponent;
