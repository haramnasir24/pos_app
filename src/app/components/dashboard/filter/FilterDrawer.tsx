import { useEffect, useState } from "react";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply: (selectedCategories: string[]) => void;
  initialSelected?: string[];
}

export default function FilterDrawer({ open, onClose, onApply, initialSelected = [] }: FilterDrawerProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch("/src/app/constant/data.json")
        .then((res) => res.json())
        .then((data) => {
          const cats = Array.from(new Set(data.products.map((p: any) => String(p.category)))) as string[];
          setCategories(cats);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [open]);

  useEffect(() => {
    setSelected(initialSelected);
  }, [initialSelected, open]);

  const handleToggle = (cat: string) => {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleApply = () => {
    onApply(selected);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.2)",
            zIndex: 99,
          }}
          onClick={onClose}
        />
      )}
      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: 320,
          background: "#fff",
          boxShadow: "2px 0 8px rgba(0,0,0,0.08)",
          zIndex: 100,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          padding: 24,
        }}
      >
        <button style={{ alignSelf: "flex-end", fontSize: 24, background: "none", border: "none", cursor: "pointer" }} onClick={onClose}>&times;</button>
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 16 }}>Filter by Category</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div style={{ flex: 1, overflowY: "auto" }}>
            {categories.map((cat) => (
              <label key={cat} style={{ display: "flex", alignItems: "center", marginBottom: 12, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={selected.includes(cat)}
                  onChange={() => handleToggle(cat)}
                  style={{ marginRight: 8 }}
                />
                {cat}
              </label>
            ))}
          </div>
        )}
        <button
          style={{
            marginTop: 24,
            padding: "10px 0",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
          }}
          onClick={handleApply}
          disabled={loading}
        >
          Apply Filter
        </button>
      </div>
    </>
  );
}
