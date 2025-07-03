import { FaFilter } from "react-icons/fa";

export default function FilterButton() {
  return (
    <button
      type="button"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: "50px",
        padding: "8px 16px",
        borderRadius: 6,
        border: "1px solid #e5e7eb",
        background: "#fff",
        fontWeight: 400,
        cursor: "pointer",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
      }}
    >
      <FaFilter style={{ fontSize: 18 }} />
      <span>Filter</span>
    </button>
  );
}
