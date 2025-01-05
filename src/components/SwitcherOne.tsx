import React from "react";

interface SwitcherProps {
    list: { svg: string; title: string }[];
    activeSwitch: string;
    setActiveSwitch: (arg: string) => void;
}

const SwitcherOne: React.FC<SwitcherProps> = ({ list, activeSwitch, setActiveSwitch }) => {
    return (
        <div className="flex gap-1 border border-primary p-0.5 rounded-lg">
            {list.map((item, index) => (
                <button
                    key={index}
                    onClick={() => setActiveSwitch(item.title)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeSwitch === item.title ? "bg-primary text-white hover:text-primary" : "bg-white text-primary"
                        } hover:bg-primary-light3 `}
                >
                    <img src={item.svg} alt={item.title} className="w-5 h-5" />
                </button>
            ))}
        </div>
    );
};

export default SwitcherOne;
