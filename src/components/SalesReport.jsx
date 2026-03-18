import React, { useMemo, useState } from "react";

function formatMonthYear(date) {
  return date.toISOString().slice(0, 7); // YYYY-MM
}

export function SalesReport({ sales }) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return formatMonthYear(new Date());
  });

  const { monthlySales, totals } = useMemo(() => {
    const filtered = sales.filter((sale) =>
      sale.createdAt.startsWith(selectedMonth)
    );
    const totalRevenue = filtered.reduce(
      (sum, sale) => sum + (sale.total || 0),
      0
    );
    const totalOrders = filtered.length;

    const byDay = {};
    filtered.forEach((sale) => {
      const day = sale.createdAt.slice(0, 10);
      if (!byDay[day]) {
        byDay[day] = { revenue: 0, orders: 0 };
      }
      byDay[day].revenue += sale.total || 0;
      byDay[day].orders += 1;
    });

    return {
      monthlySales: filtered,
      totals: { totalRevenue, totalOrders, byDay },
    };
  }, [sales, selectedMonth]);

  const uniqueMonths = Array.from(
    new Set(sales.map((s) => s.createdAt.slice(0, 7)))
  ).sort();

  return (
    <section className="card">
      <h2 className="section-title">Monthly Sales Report</h2>
      <div className="form-row">
        <label>
          Month
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </label>
      </div>

      {sales.length === 0 && (
        <p className="empty-state">
          No sales yet. Complete a payment to see reports.
        </p>
      )}

      {sales.length > 0 && uniqueMonths.length > 0 && !uniqueMonths.includes(selectedMonth) && (
        <p className="hint-text">
          No data for selected month. Available months:{" "}
          {uniqueMonths.join(", ")}
        </p>
      )}

      {monthlySales.length > 0 && (
        <>
          <div className="report-summary">
            <div className="summary-item">
              <span>Total Revenue</span>
              <strong>₹ {totals.totalRevenue}</strong>
            </div>
            <div className="summary-item">
              <span>Total Orders</span>
              <strong>{totals.totalOrders}</strong>
            </div>
          </div>

          <h3 className="subsection-title">By Day</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Orders</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(totals.byDay).map(([day, info]) => (
                <tr key={day}>
                  <td>{day}</td>
                  <td>{info.orders}</td>
                  <td>₹ {info.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="subsection-title">Recent Bills</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Date & Time</th>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {monthlySales
                .slice()
                .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
                .map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.id}</td>
                    <td>{new Date(sale.createdAt).toLocaleString()}</td>
                    <td>
                      {sale.items
                        .map((item) => `${item.name} x${item.quantity}`)
                        .join(", ")}
                    </td>
                    <td>₹ {sale.total}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}

