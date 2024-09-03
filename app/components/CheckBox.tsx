interface CustomCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  checked,
  onChange,
  color = "",
}) => {
  const handleCheckboxChange = () => {
    onChange(!checked);
  };

  return (
    <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
        style={{ display: "none" }}
      />
      <span
        className={`checkbox ${checked ? "checked" : ""}`}
        style={{
          width: "1.75rem",
          height: "1.75rem",
          border: "2px solid #4200F8",
          borderRadius: "4px",
          backgroundColor: color,
          display: "inline-block",
          position: "relative",
          marginRight: "1.5rem",
        }}
      >
        {checked && (
          <span
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(45deg)",
              width: "10px",
              height: "20px",
              border: "solid white",
              borderWidth: "0 4px 4px 0",
            }}
          />
        )}
      </span>
      <span>{label}</span>
    </label>
  );
};

export default CustomCheckbox;
