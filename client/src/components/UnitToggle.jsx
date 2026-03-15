import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function UnitToggle({ units, setUnits }) {
    const { updateUnitPreference } = useContext(AuthContext);

    const handleToggle = (newUnits) => {
        setUnits(newUnits);
        updateUnitPreference(newUnits);
    };

    return (
        <div className="unit-toggle animate-fade">
            <button
                className={units === 'metric' ? 'active' : ''}
                onClick={() => handleToggle('metric')}
            >
                Metric
            </button>
            <button
                className={units === 'imperial' ? 'active' : ''}
                onClick={() => handleToggle('imperial')}
            >
                Imperial
            </button>
        </div>
    );
}

export default UnitToggle;
鼓
