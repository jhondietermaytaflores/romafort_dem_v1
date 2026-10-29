import { useEffect, useMemo, useState } from "react";

const DB_KEY = "romaforte-db-v1";
const EMAIL = "jhon.mayta@romaforte.bo";
const PASSWORD = "romaforte123";
const today = (() => {
  const p = new Intl.DateTimeFormat("en-US", { timeZone: "America/La_Paz", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const v = Object.fromEntries(p.map((x) => [x.type, x.value]));
  return v.year + "-" + v.month + "-" + v.day;
})();
const initial = {
  products: [
    { id: "p1", name: "Inodoro Roma Forte Siena", sku: "RF-SAN-001", category: "Sanitarios", stock: 5, min: 4, price: 1280, cost: 820, unit: "unid." },
    { id: "p2", name: "Lavamanos Capri blanco", sku: "RF-LAV-014", category: "Sanitarios", stock: 3, min: 6, price: 540, cost: 340, unit: "unid." },
    { id: "p3", name: "Grifería monocomando Verona", sku: "RF-GRI-022", category: "Griferías", stock: 12, min: 8, price: 460, cost: 275, unit: "unid." },
    { id: "p4", name: "Set de ducha Roma Forte", sku: "RF-DUC-008", category: "Duchas", stock: 2, min: 5, price: 780, cost: 490, unit: "unid." },
    { id: "p5", name: "Cerámica marfil 45 × 45", sku: "RF-CER-045", category: "Cerámicas", stock: 6, min: 10, price: 92, cost: 57, unit: "caja" },
    { id: "p6", name: "Válvula de descarga universal", sku: "RF-ACC-006", category: "Accesorios", stock: 30, min: 12, price: 68, cost: 35, unit: "unid." },
    { id: "p7", name: "Tanque bajo Roma Forte", sku: "RF-TAN-019", category: "Sanitarios", stock: 4, min: 4, price: 380, cost: 235, unit: "unid." },
    { id: "p8", name: "Grifería para lavamanos Siena", sku: "RF-GRI-031", category: "Griferías", stock: 0, min: 3, price: 335, cost: 205, unit: "unid." },
    { id: "p9", name: "Espejo circular marco negro", sku: "RF-ESP-011", category: "Accesorios", stock: 15, min: 5, price: 295, cost: 165, unit: "unid." },
    { id: "p10", name: "Manguera flexible 40 cm", sku: "RF-ACC-012", category: "Accesorios", stock: 24, min: 10, price: 35, cost: 16, unit: "unid." },
    { id: "p11", name: "Mezclador para tina Roma", sku: "RF-GRI-044", category: "Griferías", stock: 3, min: 4, price: 890, cost: 570, unit: "unid." },
    { id: "p12", name: "Porcelanato piedra clara 60 × 60", sku: "RF-POR-060", category: "Cerámicas", stock: 18, min: 8, price: 148, cost: 95, unit: "caja" }
  ],
  sales: [
    ["V-2048", "Constructora Horizonte", 2450, "09:12", "Transferencia", "Casa Central"],
    ["V-2047", "María Fernanda Rojas", 1890, "09:46", "Tarjeta", "Casa Central"],
    ["V-2046", "Obras del Sur", 1640, "10:18", "Efectivo", "Sucursal Norte"],
    ["V-2045", "Luis Alberto Cárdenas", 1380, "10:51", "Transferencia", "Casa Central"],
    ["V-2044", "Constructora Horizonte", 1190, "11:23", "Tarjeta", "Casa Central"],
    ["V-2043", "Paola Méndez", 950, "12:07", "Efectivo", "Sucursal Norte"],
    ["V-2042", "Edifica Bolivia", 850, "13:16", "Transferencia", "Casa Central"],
    ["V-2041", "Javier Flores", 720, "14:04", "Tarjeta", "Casa Central"],
    ["V-2040", "Obras del Sur", 680, "14:38", "Efectivo", "Sucursal Norte"],
    ["V-2039", "Andrea Velasco", 700, "15:02", "Transferencia", "Casa Central"]
  ].map(([id, customer, amount, time, method, branch]) => ({ id, customer, amount, time, method, branch, date: today, status: "Completada" })),
  purchases: [
    { id: "OC-0391", supplier: "Cerámicas del Sur", date: "30 oct, 2026", items: 24, amount: 8420, status: "Pendiente" },
    { id: "OC-0390", supplier: "Distribuidora Sanitaria Brasil", date: "29 oct, 2026", items: 12, amount: 12850, status: "En tránsito" },
    { id: "OC-0389", supplier: "Griferías del Valle", date: "28 oct, 2026", items: 18, amount: 6340, status: "Aprobada" },
    { id: "OC-0388", supplier: "Importadora Los Andes", date: "27 oct, 2026", items: 8, amount: 3890, status: "Recibida" }
  ],
  customers: [
    ["Constructora Horizonte", "compras@horizonte.bo", "690 112 438", "Empresa", "Hoy"],
    ["María Fernanda Rojas", "maria.rojas@romaforte.bo", "701 244 908", "Particular", "Hoy"],
    ["Obras del Sur", "contacto@obrasdelsur.bo", "677 800 219", "Empresa", "Hoy"],
    ["Luis Alberto Cárdenas", "luis.cardenas@romaforte.bo", "712 035 117", "Particular", "Hoy"],
    ["Edifica Bolivia", "compras@edificabolivia.bo", "765 330 401", "Empresa", "Ayer"],
    ["Paola Méndez", "paola.mendez@romaforte.bo", "720 104 288", "Particular", "Ayer"],
    ["Javier Flores", "javier.flores@romaforte.bo", "691 242 116", "Particular", "27 oct"],
    ["Andrea Velasco", "andrea.velasco@romaforte.bo", "725 504 372", "Particular", "26 oct"]
  ].map(([name, email, phone, type, lastPurchase], i) => ({ id: "c" + i, name, email, phone, type, lastPurchase })),
  activity: [
    { title: "Venta registrada", detail: "V-2048 · Constructora Horizonte", time: "09:12" },
    { title: "Reposición pendiente", detail: "Set de ducha Roma Forte", time: "08:55" },
    { title: "Orden recibida", detail: "OC-0388 · Importadora Los Andes", time: "Ayer" }
  ]
};
const nav = [
  { group: "OPERACIÓN", items: [["dashboard", "Resumen", "◫"], ["sales", "Ventas", "▤"], ["inventory", "Inventario", "▦"], ["purchases", "Compras", "⇄"], ["customers", "Clientes", "♙"]] },
  { group: "ANÁLISIS", items: [["reports", "Reportes", "⌁"], ["settings", "Configuración", "⚙"]] }
];
const info = {
  dashboard: ["PANEL OPERATIVO", "Resumen", "Revisa cómo marcha la operación de hoy."],
  sales: ["OPERACIÓN COMERCIAL", "Ventas", "Consulta y registra las ventas de tus sucursales."],
  inventory: ["CONTROL DE EXISTENCIAS", "Inventario", "Productos, niveles de stock y movimientos."],
  purchases: ["ABASTECIMIENTO", "Compras", "Administra órdenes y proveedores."],
  customers: ["RELACIÓN COMERCIAL", "Clientes", "Consulta y administra tu cartera de clientes."],
  reports: ["ANÁLISIS DE NEGOCIO", "Reportes", "Indicadores para revisar tendencias del negocio."],
  settings: ["PREFERENCIAS", "Configuración", "Administra las preferencias del sistema."]
};

function cash(n, short = false) {
  return "Bs " + new Intl.NumberFormat("es-BO", { maximumFractionDigits: short ? 0 : 2, minimumFractionDigits: short ? 0 : 2 }).format(n || 0);
}
function copy(value) { return JSON.parse(JSON.stringify(value)); }
function readDb() { try { return JSON.parse(localStorage.getItem(DB_KEY)) || copy(initial); } catch { return copy(initial); } }
function Icon({ name }) {
  const a = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  const p = {
    dashboard: <><rect x="3" y="3" width="8" height="8" rx="1" {...a} /><rect x="13" y="3" width="8" height="5" rx="1" {...a} /><rect x="13" y="10" width="8" height="11" rx="1" {...a} /><rect x="3" y="13" width="8" height="8" rx="1" {...a} /></>,
    sales: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" {...a} /><path d="M9 8h6M9 12h6M9 16h3" {...a} /></>,
    inventory: <><path d="m12 3 8 4v10l-8 4-8-4V7l8-4Z" {...a} /><path d="m4.5 7.5 7.5 4 7.5-4M12 12v9" {...a} /></>,
    purchases: <><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" {...a} /><circle cx="7" cy="19" r="1.5" {...a} /><circle cx="18" cy="19" r="1.5" {...a} /></>,
    customers: <><circle cx="9" cy="8" r="3" {...a} /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 3.5 4.8" {...a} /></>,
    reports: <><path d="M4 20h16M6.5 16v-5M11.5 16V5M16.5 16V8" {...a} /><path d="m5 8 5-3 5 2 5-4" {...a} /></>,
    settings: <><circle cx="12" cy="12" r="3" {...a} /><path d="m19 13 1.5 1.1-1.5 2.5-1.7-.5a7 7 0 0 1-1.5.9l-.3 1.8h-3l-.3-1.8a7 7 0 0 1-1.5-.9l-1.7.5-1.5-2.5L7 13a8 8 0 0 1 0-2L5.5 9.9 7 7.4l1.7.5a7 7 0 0 1 1.5-.9l.3-1.8h3l.3 1.8a7 7 0 0 1 1.5.9l1.7-.5 1.5 2.5L19 11a8 8 0 0 1 0 2Z" {...a} /></>,
    search: <><circle cx="10.5" cy="10.5" r="6" {...a} /><path d="m15 15 5 5" {...a} /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" {...a} /></>,
    building: <><rect x="5" y="3" width="14" height="18" rx="1" {...a} /><path d="M9 7h2m3 0h2M9 11h2m3 0h2M9 15h2m3 0h2m-5 6v-3h2v3" {...a} /></>,
    alert: <><path d="m12 3 9 17H3l9-17Z" {...a} /><path d="M12 9v5m0 3h.01" {...a} /></>,
    check: <path d="m5 12 4 4L19 6" {...a} />,
    close: <path d="m6 6 12 12M18 6 6 18" {...a} />,
    plus: <path d="M12 5v14M5 12h14" {...a} />,
    arrow: <><path d="M7 17 17 7M8 7h9v9" {...a} /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 20h16" {...a} /></>,
    logout: <><path d="M10 4H5v16h5m4-12 4 4-4 4m-6-4h10" {...a} /></>,
    crown: <><path d="m3 8 5 3 4-6 4 6 5-3-2 11H5L3 8Z" {...a} /><path d="M6 15h12" {...a} /></>
  };
  return <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">{p[name] || p.dashboard}</svg>;
}
function Button({ children, onClick, secondary = false, icon = "" }) {
  return <button type="button" className={"btn " + (secondary ? "secondary" : "primary")} onClick={onClick}>{icon && <Icon name={icon} />}{children}</button>;
}
function Intro({ tag, title, text, action }) { return <div className="intro"><div><small>{tag}</small><h2>{title}</h2><p>{text}</p></div>{action}</div>; }
function Pill({ value }) {
  const kind = ["Completada", "Aprobada", "Recibida"].includes(value) ? "green" : value === "En tránsito" ? "blue" : value === "Pendiente" ? "amber" : "gray";
  return <span className={"pill " + kind}><i />{value}</span>;
}
function Table({ headers, rows }) {
  return <div className="table-scroll"><table><thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table>{!rows.length && <div className="empty">No hay resultados para esta búsqueda.</div>}</div>;
}
function Stat({ title, value, foot, icon, color }) {
  return <article className="stat"><span className={"stat-icon " + color}><Icon name={icon} /></span><small>{title}</small><strong>{value}</strong><span className="stat-foot">{foot}</span></article>;
}
function Head({ tag, title, note, action, extra }) {
  return <div className="card-head"><div><small>{tag}</small><h3>{title}</h3>{note && <p>{note}</p>}</div>{extra || (action && <button className="icon-btn" onClick={action}><Icon name="arrow" /></button>)}</div>;
}
function Modal({ type, db, error, close, save }) {
  if (!type) return null;
  const product = db.products[0];
  const titles = { sale: ["Registrar venta", "Crea un registro de venta."], stock: ["Registrar movimiento", "Actualiza las existencias de un producto."], purchase: ["Nueva orden de compra", "Prepara una orden que quedará pendiente."], customer: ["Nuevo cliente", "Añade un contacto al directorio de clientes."] };
  return <div className="shade" onMouseDown={(e) => e.target === e.currentTarget && close()}><section className="modal" role="dialog" aria-modal="true">
    <header><div><small>GESTIÓN COMERCIAL</small><h2>{titles[type][0]}</h2><p>{titles[type][1]}</p></div><button className="icon-btn" onClick={close} aria-label="Cerrar"><Icon name="close" /></button></header>
    <form onSubmit={save}>
      {type === "sale" && <><label className="field">Cliente<select name="customer">{db.customers.map((c) => <option key={c.id}>{c.name}</option>)}</select></label><label className="field">Producto<select name="productId">{db.products.map((p) => <option value={p.id} key={p.id}>{p.name} · stock {p.stock}</option>)}</select></label><div className="fields"><label className="field">Cantidad<input name="quantity" type="number" min="1" defaultValue="1" required /></label><label className="field">Método de pago<select name="method"><option>Transferencia</option><option>Tarjeta</option><option>Efectivo</option></select></label></div></>}
      {type === "stock" && <><label className="field">Producto<select name="productId">{db.products.map((p) => <option value={p.id} key={p.id}>{p.name} · stock {p.stock}</option>)}</select></label><div className="fields"><label className="field">Movimiento<select name="direction"><option>Ingreso</option><option>Salida</option></select></label><label className="field">Cantidad<input name="quantity" type="number" min="1" defaultValue="1" required /></label></div><label className="field">Motivo<input name="note" placeholder="Reposición de inventario" required /></label></>}
      {type === "purchase" && <><label className="field">Proveedor<input name="supplier" placeholder="Nombre del proveedor" required /></label><label className="field">Producto de referencia<select name="productId">{db.products.map((p) => <option value={p.id} key={p.id}>{p.name}</option>)}</select></label><div className="fields"><label className="field">Cantidad<input name="quantity" type="number" min="1" defaultValue="10" required /></label><label className="field">Fecha estimada<input name="date" type="date" /></label></div><small className="form-hint">La orden queda pendiente y no cambia el inventario.</small></>}
      {type === "customer" && <><label className="field">Nombre completo o empresa<input name="name" placeholder="Nombre o razón social" required /></label><div className="fields"><label className="field">Tipo de cliente<select name="type"><option>Particular</option><option>Empresa</option></select></label><label className="field">Teléfono<input name="phone" placeholder="7XX XXX XXX" /></label></div><label className="field">Correo electrónico<input name="email" type="email" placeholder="contacto@empresa.bo" /></label></>}
      {error && <p className="error">{error}</p>}<footer><Button secondary onClick={close}>Cancelar</Button><button className="btn primary" type="submit">Guardar {type === "sale" ? "venta" : type === "stock" ? "movimiento" : type === "purchase" ? "orden" : "cliente"}</button></footer>
    </form>
  </section></div>;
}

export default function App() {
  const [db, setDb] = useState(readDb);
  const [user, setUser] = useState(() => localStorage.getItem("romaforte-login") || sessionStorage.getItem("romaforte-login") ? "Jhon Mayta" : "");
  const [page, setPage] = useState("dashboard"), [query, setQuery] = useState("");
  const [branch, setBranch] = useState("Casa Central"), [modal, setModal] = useState("");
  const [error, setError] = useState(""), [toast, setToast] = useState("");
  const [menuOpen, setMenuOpen] = useState(false), [noticeOpen, setNoticeOpen] = useState(false);
  useEffect(() => { localStorage.setItem(DB_KEY, JSON.stringify(db)); }, [db]);
  useEffect(() => { if (!toast) return undefined; const timer = setTimeout(() => setToast(""), 3000); return () => clearTimeout(timer); }, [toast]);
  const low = useMemo(() => db.products.filter((p) => p.stock <= p.min), [db.products]);
  const pending = db.purchases.filter((p) => p.status === "Pendiente");
  function enter(email, password, remember) {
    if (email.trim().toLowerCase() !== EMAIL || password !== PASSWORD) return false;
    localStorage.removeItem("romaforte-login"); sessionStorage.removeItem("romaforte-login");
    (remember ? localStorage : sessionStorage).setItem("romaforte-login", "1");
    setUser("Jhon Mayta"); return true;
  }
  function logout() { localStorage.removeItem("romaforte-login"); sessionStorage.removeItem("romaforte-login"); setUser(""); setPage("dashboard"); }
  function go(id) { setPage(id); setQuery(""); setMenuOpen(false); }
  function pushActivity(old, title, detail) {
    const time = new Intl.DateTimeFormat("es-BO", { hour: "2-digit", minute: "2-digit", timeZone: "America/La_Paz" }).format(new Date());
    return [{ title, detail, time }, ...old].slice(0, 6);
  }
  function save(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget), qty = Number(form.get("quantity") || 0), id = String(form.get("productId") || ""), p = db.products.find((x) => x.id === id);
    if (modal === "sale") {
      if (!p || qty < 1 || !Number.isInteger(qty)) return setError("Selecciona un producto y una cantidad válida.");
      if (qty > p.stock) return setError("No hay suficiente stock disponible para completar la venta.");
      const sale = { id: "V-" + (2049 + db.sales.length - 10), customer: form.get("customer"), amount: p.price * qty, time: new Intl.DateTimeFormat("es-BO", { hour: "2-digit", minute: "2-digit", timeZone: "America/La_Paz" }).format(new Date()), method: form.get("method"), branch, date: today, status: "Completada" };
      setDb((old) => ({ ...old, products: old.products.map((x) => x.id === id ? { ...x, stock: x.stock - qty } : x), sales: [sale, ...old.sales], activity: pushActivity(old.activity, "Venta registrada", sale.id + " · " + sale.customer) }));
      setToast("Venta registrada correctamente.");
    } else if (modal === "stock") {
      const direction = form.get("direction");
      if (!p || qty < 1 || !Number.isInteger(qty)) return setError("Selecciona un producto y una cantidad válida.");
      if (direction === "Salida" && qty > p.stock) return setError("La cantidad supera el stock disponible.");
      setDb((old) => ({ ...old, products: old.products.map((x) => x.id === id ? { ...x, stock: x.stock + (direction === "Ingreso" ? qty : -qty) } : x), activity: pushActivity(old.activity, direction + " de inventario", p.name + " · " + qty + " " + p.unit) }));
      setToast("Movimiento de inventario registrado.");
    } else if (modal === "purchase") {
      if (!p || qty < 1 || !Number.isInteger(qty)) return setError("Completa el producto y la cantidad de la orden.");
      const order = { id: "OC-" + (392 + db.purchases.length - 4), supplier: form.get("supplier"), date: form.get("date") || "Por definir", items: qty, amount: p.cost * qty, status: "Pendiente" };
      setDb((old) => ({ ...old, purchases: [order, ...old.purchases], activity: pushActivity(old.activity, "Orden creada", order.id + " · " + order.supplier) }));
      setToast("Orden de compra creada.");
    } else {
      const customer = { id: "c" + Date.now(), name: String(form.get("name") || "").trim(), email: form.get("email") || "Sin correo", phone: form.get("phone") || "Sin teléfono", type: form.get("type"), lastPurchase: "Sin compras" };
      if (!customer.name) return setError("Escribe el nombre del cliente.");
      setDb((old) => ({ ...old, customers: [customer, ...old.customers], activity: pushActivity(old.activity, "Cliente agregado", customer.name) }));
      setToast("Cliente guardado correctamente.");
    }
    setModal(""); setError("");
  }
  function reset() { setDb(copy(initial)); localStorage.removeItem(DB_KEY); setToast("La información se restableció correctamente."); }
  function download(rows, headers, map, filename) {
    const quote = (x) => '"' + String(x ?? "").replaceAll('"', '""') + '"';
    const csv = "\uFEFF" + [headers, ...rows.map(map)].map((row) => row.map(quote).join(";")).join("\r\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); a.download = filename; a.click(); URL.revokeObjectURL(a.href);
    setToast("Archivo CSV descargado.");
  }
  const exportSales = (rows) => download(rows, ["Venta", "Cliente", "Fecha", "Hora", "Pago", "Sucursal", "Total BOB", "Estado"], (s) => [s.id, s.customer, s.date, s.time, s.method, s.branch, s.amount, s.status], "romaforte-ventas.csv");
  const exportCustomers = (rows) => download(rows, ["Cliente", "Tipo", "Correo", "Teléfono", "Última compra"], (c) => [c.name, c.type, c.email, c.phone, c.lastPurchase], "romaforte-clientes.csv");
  if (!user) return <Login enter={enter} />;

  const [tag, title, subtitle] = info[page], q = query.trim().toLowerCase();
  const daySales = db.sales.filter((s) => s.date === today && s.status === "Completada");
  const totalToday = daySales.reduce((sum, s) => sum + s.amount, 0);
  const sales = db.sales.filter((s) => !q || (s.id + s.customer + s.method + s.branch).toLowerCase().includes(q));
  const products = db.products.filter((p) => !q || (p.name + p.sku + p.category).toLowerCase().includes(q));
  const customers = db.customers.filter((c) => !q || (c.name + c.email + c.phone).toLowerCase().includes(q));
  const makeButton = (text, fn, secondary = false, icon = "plus") => <Button onClick={fn} secondary={secondary} icon={icon}>{text}</Button>;

  let content;
  if (page === "dashboard") content = <>
    <section className="welcome"><div><small>{new Intl.DateTimeFormat("es-BO", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "America/La_Paz" }).format(new Date())}</small><h2>Hola, Jhon <span>✦</span></h2><p>Este es el pulso de la operación de Romaforte para hoy.</p><button onClick={() => go("reports")}>Ver análisis de ventas <Icon name="arrow" /></button></div><div className="welcome-art"><span><Icon name="crown" /></span></div><label><Icon name="building" /> {branch}</label></section>
    <div className="metrics"><Stat title="Ventas de hoy" value={cash(totalToday, true)} foot="+12,8% vs. ayer" icon="reports" color="wine" /><Stat title="Órdenes registradas" value={String(daySales.length).padStart(2,"0")} foot="+3 vs. ayer" icon="sales" color="gold" /><Stat title="Productos activos" value={String(db.products.length).padStart(2,"0")} foot={low.length + " por revisar"} icon="inventory" color="blue" /><Stat title="Clientes atendidos" value={String(new Set(daySales.map((s) => s.customer)).size).padStart(2,"0")} foot="+2 nuevos hoy" icon="customers" color="green" /></div>
    <div className="dashboard-grid">
      <section className="card chart-card"><Head tag="RENDIMIENTO" title="Ventas de la semana" note="Ingresos registrados · BOB" extra={<select><option>Semana</option><option>Mes</option></select>} /><div className="chart-total"><b>{cash(totalToday, true)}</b><span>● +8,4% <small>esta semana</small></span></div><div className="chart"><div className="chart-y"><span>15k</span><span>10k</span><span>5k</span><span>0</span></div><svg viewBox="0 0 600 160" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8c2639" stopOpacity=".2" /><stop offset="1" stopColor="#8c2639" stopOpacity="0" /></linearGradient></defs><path d="M0 125L50 112 100 120 150 80 200 91 250 72 300 84 350 53 400 68 450 42 500 56 550 31 600 46V155H0Z" fill="url(#fill)" /><polyline points="0,125 50,112 100,120 150,80 200,91 250,72 300,84 350,53 400,68 450,42 500,56 550,31 600,46" fill="none" stroke="#8c2639" strokeWidth="3" strokeLinecap="round" /></svg><div className="chart-x"><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span></div></div></section>
      <section className="card"><Head tag="ATENCIÓN" title="Stock por reponer" note={low.length + " productos necesitan revisión"} action={() => go("inventory")} /><div className="low-list">{low.slice(0,4).map((p) => <div className="low-row" key={p.id}><span className="product-symbol"><Icon name="inventory" /></span><span><b>{p.name}</b><small>{p.sku}</small></span><strong>{p.stock}<small>mín. {p.min}</small></strong></div>)}</div><button className="text-link" onClick={() => go("inventory")}>Ver inventario completo <Icon name="arrow" /></button></section>
      <section className="card recent-card"><Head tag="MOVIMIENTO DEL DÍA" title="Ventas recientes" action={() => go("sales")} /><Table headers={["Venta", "Cliente", "Hora", "Total", "Estado"]} rows={sales.slice(0,5).map((s) => [<b className="wine-text">{s.id}</b>, s.customer, s.time, <b>{cash(s.amount)}</b>, <Pill value={s.status} />])} /></section>
      <section className="card quick-card"><Head tag="ACCESOS RÁPIDOS" title="¿Qué necesitas hacer?" /><button onClick={() => { setModal("sale"); setError(""); }}><i className="quick-icon wine-bg"><Icon name="plus" /></i><span><b>Registrar una venta</b><small>Registra una nueva venta</small></span><Icon name="arrow" /></button><button onClick={() => go("inventory")}><i className="quick-icon blue-bg"><Icon name="inventory" /></i><span><b>Revisar inventario</b><small>Consulta niveles y movimientos</small></span><Icon name="arrow" /></button><button onClick={() => go("purchases")}><i className="quick-icon gold-bg"><Icon name="purchases" /></i><span><b>Ver órdenes de compra</b><small>Seguimiento de proveedores</small></span><Icon name="arrow" /></button></section>
    </div>
  </>;
  if (page === "sales") content = <><Intro tag={tag} title="Registro de ventas" text={subtitle} action={makeButton("Nueva venta", () => { setModal("sale"); setError(""); })} /><section className="card table-card"><div className="table-top"><b>{sales.length} ventas</b><span>Total visible {cash(sales.reduce((a,s) => a+s.amount,0))}</span><button className="btn secondary small" onClick={() => exportSales(sales)}><Icon name="download" />Exportar CSV</button></div><Table headers={["N° de venta","Cliente","Fecha y hora","Pago","Sucursal","Total","Estado"]} rows={sales.map((s) => [<b className="wine-text">{s.id}</b>,<b>{s.customer}</b>,s.date.slice(5)+" · "+s.time,s.method,s.branch,<b>{cash(s.amount)}</b>,<Pill value={s.status} />])} /><div className="table-foot">Los registros se guardan únicamente en este navegador.</div></section></>;
  if (page === "inventory") content = <Inventory tag={tag} subtitle={subtitle} products={products} all={db.products} open={() => { setModal("stock"); setError(""); }} />;
  if (page === "purchases") content = <><Intro tag={tag} title="Compras" text={subtitle} action={makeButton("Nueva orden", () => { setModal("purchase"); setError(""); })} /><div className="mini-stats"><Summary label="Por aprobar" value={pending.length} icon="alert" color="gold" /><Summary label="En tránsito" value={db.purchases.filter((p) => p.status === "En tránsito").length} icon="purchases" color="blue" /><Summary label="Recibidas este mes" value={8} icon="check" color="green" /></div><section className="card table-card"><div className="table-top"><b>Órdenes de compra</b><span>{db.purchases.length} resultados</span></div><Table headers={["Orden","Proveedor","Fecha estimada","Artículos","Total estimado","Estado"]} rows={db.purchases.map((p) => [<b className="wine-text">{p.id}</b>,<b>{p.supplier}</b>,p.date,p.items+" unidades",<b>{cash(p.amount)}</b>,<Pill value={p.status} />])} /><div className="table-foot">Las órdenes nuevas quedan pendientes y no modifican el stock.</div></section></>;
  if (page === "customers") content = <><Intro tag={tag} title="Clientes" text={subtitle} action={makeButton("Nuevo cliente", () => { setModal("customer"); setError(""); })} /><div className="mini-stats"><Summary label="Clientes registrados" value={db.customers.length} icon="customers" color="wine" /><Summary label="Empresas" value={db.customers.filter((c) => c.type === "Empresa").length} icon="building" color="blue" /><Summary label="Particulares" value={db.customers.filter((c) => c.type === "Particular").length} icon="customers" color="green" /></div><section className="card table-card"><div className="table-top"><b>Directorio de clientes</b><span>{customers.length} resultados</span><button className="btn secondary small" onClick={() => exportCustomers(customers)}><Icon name="download" />Exportar CSV</button></div><Table headers={["Cliente","Tipo","Correo electrónico","Teléfono","Última compra"]} rows={customers.map((c,i) => [<span className="person"><i className={"avatar tone-"+(i%4)}>{c.name.split(" ").map((x)=>x[0]).slice(0,2).join("")}</i><b>{c.name}</b></span>,c.type,c.email,c.phone,c.lastPurchase])} /><div className="table-foot">Contactos y empresas de nuestras sucursales.</div></section></>;
  if (page === "reports") content = <Reports db={db} exportSales={exportSales} />;
  if (page === "settings") content = <><Intro tag={tag} title={title} text={subtitle} /><div className="settings-grid"><section className="card setting"><h3>Empresa y sucursales</h3><p>Administra la información de tu operación.</p><Row label="Nombre comercial" value="Importadora Romaforte" /><Row label="Sucursal seleccionada" value={branch} /><Row label="Moneda" value="Bolivianos (BOB)" /></section><section className="card setting"><h3>Cuenta de usuario</h3><p>Información del perfil activo.</p><Row label="Usuario" value={EMAIL} /><Row label="Perfil" value="Administrador" /><Row label="Estado de cuenta" value="Activa" /></section><section className="card setting wide"><h3>Preferencias de información</h3><p>Los cambios se guardan automáticamente y se pueden restablecer cuando sea necesario.</p><button className="btn danger" onClick={reset}>Restablecer información</button></section></div></>;

  return <div className="app">
    <aside className={"sidebar "+(menuOpen ? "open" : "")}><div className="side-brand"><span className="crown"><Icon name="crown" /></span><b>ROMA<span>FORTE</span></b><small>IMPORTADORA · BOLIVIA</small><button className="close-menu" onClick={() => setMenuOpen(false)}><Icon name="close" /></button></div><div className="section-label"><i />SISTEMA ROMAFORTE</div><nav>{nav.map((group) => <div className="nav-group" key={group.group}><small>{group.group}</small>{group.items.map(([id,label,glyph]) => <button key={id} className={page===id?"active":""} onClick={() => go(id)}><span className="nav-glyph">{glyph}</span>{label}{id==="sales"&&<i>10</i>}</button>)}</div>)}</nav><div className="side-help"><span>✦</span><b>Panel de gestión</b><small>Ventas, inventario y clientes en un solo lugar.</small><button onClick={() => go("settings")}>Ver configuración <Icon name="arrow" /></button></div><div className="side-user"><i>JM</i><span><b>{user}</b><small>Administrador</small></span><button onClick={logout} title="Cerrar sesión"><Icon name="logout" /></button></div></aside>
    <main className="main"><header className="topbar"><button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">☰</button><div className="top-title"><small>{tag}</small><h1>{title}</h1></div><div className="top-actions"><label className="search"><Icon name="search" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar en esta sección" /><kbd>⌘ K</kbd></label><label className="branch"><Icon name="building" /><select value={branch} onChange={(e) => setBranch(e.target.value)}><option>Casa Central</option><option>Sucursal Norte</option></select></label><div className="notice-wrap"><button className="icon-btn bell" onClick={() => setNoticeOpen(!noticeOpen)} aria-label="Notificaciones"><Icon name="bell" /><i /></button>{noticeOpen&&<div className="notice"><b>Notificaciones</b><p><Icon name="alert" />{low.length} productos con stock bajo</p><p><Icon name="purchases" />{pending.length} orden por aprobar</p><button className="text-link" onClick={() => {go("inventory");setNoticeOpen(false);}}>Ver inventario <Icon name="arrow" /></button></div>}</div><span className="top-avatar">JM</span></div></header>
      <div className="content"><div className="system-banner"><b>SISTEMA DE GESTIÓN</b><span>Operación comercial de Importadora Romaforte.</span><button onClick={() => go("settings")}>Ver configuración <Icon name="arrow" /></button></div>{content}<footer>Importadora Romaforte · Gestión comercial <span>Sesión de {user}</span></footer></div></main>
    {menuOpen&&<div className="scrim" onClick={() => setMenuOpen(false)} />}
    <Modal type={modal} db={db} error={error} close={() => {setModal("");setError("");}} save={save} />
    {toast&&<div className="toast"><Icon name="check" />{toast}</div>}
  </div>;
}

function Inventory({ tag, subtitle, products, all, open }) {
  const [category,setCategory]=useState("Todas"),[lowOnly,setLowOnly]=useState(false);
  const categories=["Todas",...new Set(all.map((p)=>p.category))], rows=products.filter((p)=>(category==="Todas"||p.category===category)&&(!lowOnly||p.stock<=p.min));
  const stock=all.reduce((a,p)=>a+p.stock,0);
  return <><Intro tag={tag} title="Inventario" text={subtitle} action={<Button onClick={open} icon="plus">Registrar movimiento</Button>} /><div className="mini-stats"><Summary label="Productos registrados" value={all.length} icon="inventory" color="wine" /><Summary label="Unidades disponibles" value={stock} icon="building" color="blue" /><Summary label="En nivel bajo" value={all.filter((p)=>p.stock<=p.min).length} icon="alert" color="gold" /></div><section className="card table-card"><div className="table-top"><b>Catálogo de productos</b><div className="filters"><select value={category} onChange={(e)=>setCategory(e.target.value)}>{categories.map((x)=><option key={x}>{x}</option>)}</select><button className="btn secondary small" onClick={()=>setLowOnly(!lowOnly)}><Icon name="alert" />{lowOnly?"Ver todo":"Stock bajo"}</button></div></div><Table headers={["Producto","SKU","Categoría","Existencias","Mínimo","Precio","Estado"]} rows={rows.map((p)=>[<b>{p.name}</b>,p.sku,p.category,<b>{p.stock} {p.unit}</b>,p.min+" "+p.unit,cash(p.price),<span className={"stock-state "+(p.stock<=p.min?"low":"ok")}>{p.stock<=p.min?"Reponer":"Disponible"}</span>])} /><div className="table-foot">Las existencias se actualizan con cada movimiento registrado.</div></section></>;
}
function Reports({ db, exportSales }) {
  const [period,setPeriod]=useState("Últimos 7 días"),total=db.sales.reduce((a,s)=>a+s.amount,0),average=db.sales.length?Math.round(total/db.sales.length):0;
  return <><Intro tag="ANÁLISIS DE NEGOCIO" title="Reportes e indicadores" text="Revisa el desempeño de la operación comercial." action={<Button secondary icon="download" onClick={()=>exportSales(db.sales)}>Descargar ventas</Button>} /><div className="period"><span>◷ Periodo del informe</span><div>{["Últimos 7 días","Este mes","Trimestre"].map((x)=><button className={period===x?"selected":""} onClick={()=>setPeriod(x)} key={x}>{x}</button>)}</div></div><div className="metrics three"><Stat title="Ventas registradas" value={cash(total,true)} foot="+8,4% vs. anterior" icon="reports" color="wine" /><Stat title="Transacciones" value={db.sales.length} foot="en este periodo" icon="sales" color="gold" /><Stat title="Ticket promedio" value={cash(average,true)} foot="+3,2% vs. anterior" icon="customers" color="blue" /></div><div className="report-grid"><section className="card"><Head tag="TENDENCIA" title="Ingresos por día" note={period+" · acumulado del periodo"} /><div className="bars">{[42,64,51,77,58,88,71].map((h,i)=><div key={i}><span className="bar"><i style={{height:h+"%"}} /></span><small>{["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"][i]}</small></div>)}</div></section><section className="card"><Head tag="CATÁLOGO" title="Productos destacados" />{db.products.slice(0,4).map((p,i)=><div className="top-product" key={p.id}><b>0{i+1}</b><span>{p.name}<small>{p.category} · {p.sku}</small></span><strong>{cash(p.price)}</strong></div>)}</section></div></>;
}
function Summary({ label,value,icon,color }) { return <div className="summary"><span className={"summary-icon "+color}><Icon name={icon} /></span><div><small>{label}</small><b>{value}</b></div></div>; }
function Row({ label,value }) { return <div className="settings-row"><span>{label}</span><b>{value}</b></div>; }

function Login({ enter }) {
  const [email,setEmail]=useState(EMAIL),[password,setPassword]=useState(""),[remember,setRemember]=useState(true),[show,setShow]=useState(false),[error,setError]=useState("");
  function submit(e){e.preventDefault();if(!enter(email,password,remember))setError("El correo o la contraseña no son correctos.");}
  return <main className="login"><section className="login-art"><div className="login-top"><div className="mini-brand"><span><Icon name="crown" /></span><b>ROMA<span>FORTE</span></b><small>IMPORTADORA · BOLIVIA</small></div><label className="access-chip"><i />GESTIÓN COMERCIAL</label></div><div className="login-middle"><img className="company-logo" src="/romaforte-logo.jpeg" alt="Logo Roma Forte Brasil, sanitarios de alta gama" /><div className="login-copy"><small>GESTIÓN COMERCIAL</small><h1>Todo tu negocio,<br /><em>en un solo lugar.</em></h1><p>Una vista clara para cuidar cada venta, producto y relación con tus clientes.</p></div><div className="login-perks"><span><Icon name="reports" /><b>Una operación más simple</b><small>Ventas · inventario · compras</small></span><i /><span><b>ROMA FORTE</b><small>Sanitarios de alta gama</small></span></div></div><div className="login-foot"><span>Gestión de operaciones</span><span>© 2026 Importadora Romaforte</span></div></section><section className="login-side"><div className="login-card"><div className="small-brand"><div className="mini-brand"><span><Icon name="crown" /></span><b>ROMA<span>FORTE</span></b><small>IMPORTADORA · BOLIVIA</small></div></div><small className="eyebrow">BIENVENIDO DE NUEVO</small><h2>Inicia sesión</h2><p className="login-intro">Ingresa tus credenciales para continuar.</p><form onSubmit={submit}><label className="label" htmlFor="email">Correo electrónico</label><div className="input-wrap"><span>✉</span><input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required /></div><div className="password-label"><label className="label" htmlFor="password">Contraseña</label></div><div className="input-wrap"><span>⌑</span><input id="password" type={show?"text":"password"} value={password} onChange={(e)=>setPassword(e.target.value)} required /><button className="reveal" type="button" onClick={()=>setShow(!show)}>◉</button></div><label className="remember"><input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} /> Mantener sesión en este dispositivo</label>{error&&<p className="error">{error}</p>}<button className="btn primary login-btn" type="submit">Iniciar sesión <Icon name="arrow" /></button></form><div className="credential"><span>✦</span><div><b>Acceso corporativo</b><small>Ventas, inventario y clientes en un solo lugar.</small></div></div><div className="help-link">¿Necesitas ayuda? <a href="mailto:soporte@romaforte.bo">Contacta a soporte</a></div></div></section></main>;
}
