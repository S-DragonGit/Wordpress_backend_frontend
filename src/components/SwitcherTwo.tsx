import React from 'react'
interface SwitcherTwoProps {
    list: string[];
    activeSwitch: string;
    setActiveSwitch: (arg: string) => void;
}

const SwitcherTwo: React.FC<SwitcherTwoProps> = ({ list, activeSwitch, setActiveSwitch }) => {
    return (
        <div className="flex gap-1 border border-primary p-0.5 rounded-lg w-full" >
            {list.map((item, index) => (
                <button
                    key={index}
                    onClick={() => setActiveSwitch(item)}
                    className={`flex w-full justify-center items-center gap-2 px-4 py-2 rounded-lg ${activeSwitch === item ? "bg-primary text-white " : "bg-white text-primary hover:bg-primary-light3"
                        }  `}
                >
                    {item}
                </button>
            ))}
        </div>
    )
}

export default SwitcherTwo