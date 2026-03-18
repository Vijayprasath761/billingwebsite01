import React, { useMemo, useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { MenuList } from "./components/MenuList.jsx";
import { Cart } from "./components/Cart.jsx";
import { BillingPanel } from "./components/BillingPanel.jsx";
import { ManageMenu } from "./components/ManageMenu.jsx";
import { SalesReport } from "./components/SalesReport.jsx";
import { QrCodeModal } from "./components/QrCodeModal.jsx";

const DEFAULT_MENU = [
  {
    id: "idly",
    name: "Idly",
    price: 20,
    category: "Breakfast",
    imageUrl: "/images/idly.png",
    isActive: true,
  },
  {
    id: "puttu",
    name: "Puttu",
    price: 40,
    category: "Breakfast",
    imageUrl: "/images/puttu.png",
    isActive: true,
  },
  {
    id: "poori",
    name: "Poori",
    price: 35,
    category: "Breakfast",
    imageUrl: "/images/poori.png",
    isActive: true,
  },
  {
    id: "vada",
    name: "Vada",
    price: 15,
    category: "Snacks",
    imageUrl: "/images/vada.png",
    isActive: true,
  },
  {
    id: "dosa",
    name: "Dosa",
    price: 50,
    category: "Breakfast",
    imageUrl: "/images/dosa.png",
    isActive: true,
  },
  {
    id: "coffee",
    name: "Coffee",
    price: 20,
    category: "Beverage",
    imageUrl:
      "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400",
    isActive: true,
  },
  {
    id: "pongal",
    name: "Pongal",
    price: 45,
    category: "Breakfast",
    imageUrl: "/images/pongal.png",
    isActive: true,
  },
  {
    id: "borota",
    name: "Borota",
    price: 30,
    category: "Bread",
    imageUrl: "/images/borota.png",
    isActive: true,
  },
];

const NAV_VIEWS = {
  MENU: "MENU",
  BILLING: "BILLING",
  SALES: "SALES",
  MANAGE_MENU: "MANAGE_MENU",
};

export default function App() {
  const [menu, setMenu] = useLocalStorage("restaurant_menu", DEFAULT_MENU);
  const [cart, setCart] = useLocalStorage("restaurant_cart", []);
  const [sales, setSales] = useLocalStorage("restaurant_sales", []);
  const [activeView, setActiveView] = useState(NAV_VIEWS.MENU);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [currentBill, setCurrentBill] = useState(null);

  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [cart]);

  const handleAddToCart = (menuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === menuItem.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItemId === menuItem.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [
        ...prev,
        {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
        },
      ];
    });
    setActiveView(NAV_VIEWS.BILLING);
  };

  const handleUpdateCartItem = (menuItemId, quantity) => {
    setCart((prev) => {
      const updated = prev
        .map((item) =>
          item.menuItemId === menuItemId ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0);
    return updated;
    });
  };

  const handleRemoveCartItem = (menuItemId) => {
    setCart((prev) => prev.filter((item) => item.menuItemId !== menuItemId));
  };

  const handleClearCart = () => {
    if (cart.length === 0) return;
    const confirmClear = window.confirm("Clear all items from the cart?");
    if (!confirmClear) return;
    setCart([]);
  };

  const handlePaymentInitiated = (bill, qrUrl) => {
    setCurrentBill(bill);
    setQrDataUrl(qrUrl);
  };

  const handlePaymentConfirmed = () => {
    if (!currentBill) {
      setQrDataUrl(null);
      return;
    }
    setSales((prev) => [...prev, currentBill]);
    setCart([]);
    setQrDataUrl(null);
    setCurrentBill(null);
    alert("Payment recorded and sale saved.");
  };

  const handleMenuChange = (updatedMenu) => {
    setMenu(updatedMenu);
    // Remove cart items that refer to deleted menu items
    setCart((prev) =>
      prev.filter((item) =>
        updatedMenu.some((menuItem) => menuItem.id === item.menuItemId)
      )
    );
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="brand">
          <span className="brand-title">Spice Garden</span>
          <span className="brand-subtitle">South Indian Restaurant</span>
        </div>
        <nav className="nav-tabs">
          <button
            className={
              activeView === NAV_VIEWS.MENU ? "nav-tab active" : "nav-tab"
            }
            onClick={() => setActiveView(NAV_VIEWS.MENU)}
          >
            Menu
          </button>
          <button
            className={
              activeView === NAV_VIEWS.BILLING ? "nav-tab active" : "nav-tab"
            }
            onClick={() => setActiveView(NAV_VIEWS.BILLING)}
          >
            Billing
          </button>
          <button
            className={
              activeView === NAV_VIEWS.SALES ? "nav-tab active" : "nav-tab"
            }
            onClick={() => setActiveView(NAV_VIEWS.SALES)}
          >
            Sales Report
          </button>
          <button
            className={
              activeView === NAV_VIEWS.MANAGE_MENU
                ? "nav-tab active"
                : "nav-tab"
            }
            onClick={() => setActiveView(NAV_VIEWS.MANAGE_MENU)}
          >
            Manage Menu
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeView === NAV_VIEWS.MENU && (
          <MenuList menu={menu} onAddToCart={handleAddToCart} />
        )}

        {activeView === NAV_VIEWS.BILLING && (
          <div className="billing-layout">
            <Cart
              cart={cart}
              onUpdateQuantity={handleUpdateCartItem}
              onRemoveItem={handleRemoveCartItem}
            />
            <BillingPanel
              cart={cart}
              totals={totals}
              onClearCart={handleClearCart}
              onPaymentInitiated={handlePaymentInitiated}
            />
          </div>
        )}

        {activeView === NAV_VIEWS.SALES && <SalesReport sales={sales} />}

        {activeView === NAV_VIEWS.MANAGE_MENU && (
          <ManageMenu menu={menu} onMenuChange={handleMenuChange} />
        )}
      </main>

      <QrCodeModal
        qrDataUrl={qrDataUrl}
        bill={currentBill}
        onClose={() => setQrDataUrl(null)}
        onConfirmPayment={handlePaymentConfirmed}
      />
    </div>
  );
}

