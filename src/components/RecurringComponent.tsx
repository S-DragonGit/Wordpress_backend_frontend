import React from "react";

interface RecurringState {
    isRecurring: boolean;
    repeatEvery: number;
    selectedDays: string[];
    time: { hour: number; period: string };
    endOption: string;
    endDate: string;
    occurrences: number;
}

interface RecurringComponentProps {
    recurringState: RecurringState;
    setRecurringState: (state: Partial<RecurringState>) => void;
}

const RecurringComponent: React.FC<RecurringComponentProps> = ({ recurringState, setRecurringState }) => {
    const { isRecurring, repeatEvery, selectedDays, time, endOption, endDate, occurrences } = recurringState;

    const toggleDay = (day: string) => {
        setRecurringState({
            selectedDays: selectedDays.includes(day)
                ? selectedDays.filter((d: string) => d !== day)
                : [...selectedDays, day],
        });
    };

    return (
        <div className="p-5 rounded-lg w-full max-w-2xl">
            {/* Recurring Checkbox */}
            <div className={`flex items-center gap-2 ${isRecurring && "bg-primary-light2"} rounded-t-md p-3 w-30`}>
                <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setRecurringState({ isRecurring: e.target.checked })}
                    className="w-4 h-4"
                />
                <span className="text-sm font-medium">Recurring?</span>
            </div>

            {/* Recurring Options */}
            <div
                className={`bg-primary-light2 w-full rounded-b-md transition-all duration-500 ease-in-out overflow-hidden ${
                    isRecurring && "p-3"
                }`}
            >
                {isRecurring && (
                    <>
                        {/* Repeat Every */}
                        <div className="flex items-center gap-10 w-full p-5">
                            <div>
                                <div className="flex items-center gap-1 mb-4">
                                    <span className="text-sm">Repeat every:</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                setRecurringState({ repeatEvery: Math.max(repeatEvery - 1, 1) })
                                            }
                                            className="w-8 h-8 bg-white flex justify-center items-center rounded-md"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={repeatEvery}
                                            onChange={(e) =>
                                                setRecurringState({
                                                    repeatEvery: Math.max(1, Number(e.target.value)),
                                                })
                                            }
                                            className="w-12 text-center p-1 border border-gray-border rounded-md"
                                        />
                                        <button
                                            onClick={() =>
                                                setRecurringState({ repeatEvery: repeatEvery + 1 })
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
                                        {["M", "T", "W", "Th", "F"].map((day: string, index: number) => (
                                            <button
                                                key={index}
                                                onClick={() => toggleDay(day)}
                                                className={`w-10 h-10 flex justify-center items-center rounded-full ${
                                                    selectedDays.includes(day)
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
                                                setRecurringState({
                                                    time: {
                                                        ...time,
                                                        hour: Math.min(12, Math.max(1, Number(e.target.value))),
                                                    },
                                                })
                                            }
                                            className="w-12 text-center p-1 border border-gray-border rounded-md"
                                        />
                                        <select
                                            value={time.period}
                                            onChange={(e) =>
                                                setRecurringState({
                                                    time: { ...time, period: e.target.value },
                                                })
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
                                            onChange={(e) => setRecurringState({ endOption: e.target.value })}
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
                                            onChange={(e) => setRecurringState({ endOption: e.target.value })}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm">On</span>
                                        <input
                                            type="date"
                                            disabled={endOption !== "on"}
                                            value={endDate}
                                            onChange={(e) => setRecurringState({ endDate: e.target.value })}
                                            className="border border-gray-border rounded-md p-1"
                                        />
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="endOption"
                                            value="after"
                                            checked={endOption === "after"}
                                            onChange={(e) => setRecurringState({ endOption: e.target.value })}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm">After</span>
                                        <input
                                            type="number"
                                            disabled={endOption !== "after"}
                                            value={occurrences}
                                            onChange={(e) =>
                                                setRecurringState({
                                                    occurrences: Math.max(1, Number(e.target.value)),
                                                })
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
