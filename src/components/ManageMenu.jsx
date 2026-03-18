import React, { useState } from "react";

const EMPTY_FORM = {
  id: "",
  name: "",
  price: "",
  category: "",
  imageUrl: "",
  isActive: true,
};

export function ManageMenu({ menu, onMenuChange }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl === "string") {
        setForm((prev) => ({ ...prev, imageUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      alert("Name is required");
      return;
    }
    const priceNumber = Number(form.price);
    if (Number.isNaN(priceNumber) || priceNumber <= 0) {
      alert("Price must be a positive number");
      return;
    }

    if (editingId) {
      const updated = menu.map((item) =>
        item.id === editingId
          ? {
              ...item,
              name: trimmedName,
              price: priceNumber,
              category: form.category.trim() || "General",
              imageUrl: form.imageUrl.trim() || item.imageUrl,
              isActive: form.isActive,
            }
          : item
      );
      onMenuChange(updated);
    } else {
      const newId =
        form.id.trim() ||
        trimmedName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
      if (menu.some((item) => item.id === newId)) {
        alert("Generated ID already exists, please change the name slightly.");
        return;
      }
      const newItem = {
        id: newId,
        name: trimmedName,
        price: priceNumber,
        category: form.category.trim() || "General",
        imageUrl:
          form.imageUrl.trim() ||
          "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400",
        isActive: form.isActive,
      };
      onMenuChange([...menu, newItem]);
    }

    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      id: item.id,
      name: item.name,
      price: String(item.price),
      category: item.category || "",
      imageUrl: item.imageUrl || "",
      isActive: item.isActive,
    });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Delete this menu item?");
    if (!confirmDelete) return;
    const updated = menu.filter((item) => item.id !== id);
    onMenuChange(updated);
    if (editingId === id) {
      setEditingId(null);
      setForm(EMPTY_FORM);
    }
  };

  const handleToggleActive = (id) => {
    const updated = menu.map((item) =>
      item.id === id ? { ...item, isActive: !item.isActive } : item
    );
    onMenuChange(updated);
  };

  return (
    <section className="card">
      <h2 className="section-title">Manage Menu</h2>
      <form className="menu-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Name
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </label>
          <label>
            Price (₹)
            <input
              type="number"
              min="1"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              required
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Category
            <input
              type="text"
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              placeholder="Breakfast, Beverage..."
            />
          </label>
          <label>
            Image URL
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <small>
              Or choose a file below to store as a local image.
            </small>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
            />
          </label>
        </div>
        <div className="form-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
            />
            Active
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingId ? "Update Item" : "Add Item"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEditingId(null);
                setForm(EMPTY_FORM);
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
        {form.imageUrl && (
          <div className="form-row">
            <div>
              <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                Image preview
              </span>
              <img
                src={form.imageUrl}
                alt="Preview"
                style={{
                  marginTop: "0.25rem",
                  width: "96px",
                  height: "96px",
                  objectFit: "cover",
                  borderRadius: "0.5rem",
                }}
              />
            </div>
          </div>
        )}
      </form>

      <table className="manage-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>₹ {item.price}</td>
              <td>{item.category}</td>
              <td>{item.isActive ? "Active" : "Hidden"}</td>
              <td>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => handleToggleActive(item.id)}
                >
                  {item.isActive ? "Hide" : "Show"}
                </button>
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {menu.length === 0 && (
            <tr>
              <td colSpan="5" className="empty-state">
                No menu items yet. Add your first item above.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

