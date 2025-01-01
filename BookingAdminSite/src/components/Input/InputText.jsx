import { useState, useEffect } from 'react';

function InputText({
    labelTitle,
    labelStyle,
    type,
    containerStyle,
    defaultValue,
    placeholder,
    setValue,  // Pass the setValue function from parent
    name,      // Name to identify the input
    ...props
}) {
    const [value, setValueState] = useState(defaultValue);

    useEffect(() => {
        setValue(name, value);  // Sync with react-hook-form state
    }, [value, name, setValue]);

    const updateInputValue = (val) => {
        setValueState(val);  // Update local state
    };

    return (
        <div className={`form-control w-full ${containerStyle}`}>
            <label className="label">
                <span className={"label-text text-base-content " + labelStyle}>{labelTitle}</span>
            </label>
            <input
                {...props}
                type={type || "text"}
                value={value}
                placeholder={placeholder || ""}
                onChange={(e) => updateInputValue(e.target.value)}
                className="input input-bordered w-full"
            />
        </div>
    );
}

export default InputText;
