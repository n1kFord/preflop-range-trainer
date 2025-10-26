import { FC } from "react";
import cn from "classnames";
import { PositionType } from "./ChartBoard";

interface ChartSwitchProps {
    items: { value: PositionType; label: string }[];
    value: string;
    onChange: any;
}

const ChartSwitch: FC<ChartSwitchProps> = ({ items, value, onChange }) => {
    return (
        <ul className="chart__actions__switch">
            {items.map((item, i) => (
                <li
                    key={item.label + i}
                    className={cn("chart__actions__switch__item", {
                        active: value === item.value,
                    })}
                    onClick={() => onChange(item.value)}
                >
                    <button type="button">{item.label}</button>
                </li>
            ))}
        </ul>
    );
};

export default ChartSwitch;
