import { useState, useEffect } from "react";

const DEFAULT_PHASES = [
  {
    id: 1, emoji: "💡", title: "Definición del Proyecto", color: "#F59E0B",
    tasks: [
      { id: "1a", text: "¿Qué problema resuelve? Escríbelo en 2 frases", tag: "Idea" },
      { id: "1b", text: "¿Quién es el usuario objetivo?", tag: "Idea" },
      { id: "1c", text: "Listar las funcionalidades core (máximo 5)", tag: "Scope" },
      { id: "1d", text: "Listar lo que NO va a hacer (evitar scope creep)", tag: "Scope" },
      { id: "1e", text: "Buscar 2-3 proyectos similares como referencia", tag: "Research" },
    ],
    deliverable: "Sabes exactamente qué vas a construir y qué no",
  },
  {
    id: 2, emoji: "🏛️", title: "Arquitectura", color: "#06B6D4",
    tasks: [
      { id: "2a", text: "Decidir tipo de arquitectura: monolito, frontend + backend separados, serverless…", tag: "Arch" },
      { id: "2b", text: "Dibujar el flujo de datos principal", tag: "Arch" },
      { id: "2c", text: "Definir las entidades principales del sistema", tag: "Arch" },
      { id: "2d", text: "Definir qué se comunica con qué (APIs, servicios externos)", tag: "Arch" },
      { id: "2e", text: "Decidir dónde va a vivir cada parte (local, cloud, edge)", tag: "Infra" },
    ],
    deliverable: "Un diagrama claro de cómo se relacionan todas las piezas",
  },
  {
    id: 3, emoji: "⚙️", title: "Definición del Stack", color: "#8B5CF6",
    tasks: [
      { id: "3a", text: "Elegir lenguaje y framework del frontend", tag: "Frontend" },
      { id: "3b", text: "Elegir lenguaje y framework del backend", tag: "Backend" },
      { id: "3c", text: "Elegir base de datos (tipo y proveedor)", tag: "DB" },
      { id: "3d", text: "Definir servicios externos necesarios (auth, storage, IA, email…)", tag: "Services" },
      { id: "3e", text: "Verificar que todo el stack tiene plan gratuito o es asequible", tag: "Cost" },
    ],
    deliverable: "Stack cerrado y justificado, sin cambios a mitad del proyecto",
  },
  {
    id: 4, emoji: "🗄️", title: "Diseño de Base de Datos", color: "#10B981",
    tasks: [
      { id: "4a", text: "Definir todas las entidades/colecciones/tablas necesarias", tag: "DB" },
      { id: "4b", text: "Definir los campos y tipos de cada entidad", tag: "DB" },
      { id: "4c", text: "Definir relaciones entre entidades (1:1, 1:N, N:M)", tag: "DB" },
      { id: "4d", text: "Pensar qué consultas se harán más y optimizar para ellas", tag: "DB" },
      { id: "4e", text: "Crear el esquema en papel o dbdiagram.io", tag: "Docs" },
    ],
    deliverable: "Esquema de base de datos completo antes de escribir código",
  },
  {
    id: 5, emoji: "🔌", title: "Diseño de la API", color: "#F97316",
    tasks: [
      { id: "5a", text: "Listar todos los endpoints necesarios (método + ruta + qué hace)", tag: "API" },
      { id: "5b", text: "Definir el formato de request y response de cada endpoint", tag: "API" },
      { id: "5c", text: "Decidir estrategia de autenticación (JWT, session, OAuth…)", tag: "Auth" },
      { id: "5d", text: "Definir qué rutas son públicas y cuáles requieren auth", tag: "Auth" },
      { id: "5e", text: "Documentar la API (aunque sea en un README básico)", tag: "Docs" },
    ],
    deliverable: "Contrato de API definido — frontend y backend pueden trabajar en paralelo",
  },
  {
    id: 6, emoji: "🏗️", title: "Setup & Configuración", color: "#EC4899",
    tasks: [
      { id: "6a", text: "Crear repositorio en GitHub con .gitignore correcto", tag: "Git" },
      { id: "6b", text: "Inicializar el proyecto frontend", tag: "Frontend" },
      { id: "6c", text: "Inicializar el proyecto backend", tag: "Backend" },
      { id: "6d", text: "Configurar variables de entorno (.env)", tag: "Config" },
      { id: "6e", text: "Conectar backend con la base de datos y verificar conexión", tag: "DB" },
      { id: "6f", text: "Hacer un 'Hello World' end-to-end para validar que todo comunica", tag: "Test" },
    ],
    deliverable: "Proyecto corriendo en local, frontend y backend conectados",
  },
  {
    id: 7, emoji: "🔨", title: "Desarrollo Backend", color: "#14B8A6",
    tasks: [
      { id: "7a", text: "Implementar modelos/esquemas de base de datos", tag: "Backend" },
      { id: "7b", text: "Implementar endpoints de autenticación", tag: "Auth" },
      { id: "7c", text: "Implementar endpoints CRUD de cada entidad principal", tag: "Backend" },
      { id: "7d", text: "Implementar lógica de negocio específica del proyecto", tag: "Backend" },
      { id: "7e", text: "Testear todos los endpoints con Postman / Thunder Client", tag: "Test" },
      { id: "7f", text: "Manejo de errores: respuestas claras para cada caso de fallo", tag: "Backend" },
    ],
    deliverable: "API completamente funcional y testeada de forma manual",
  },
  {
    id: 8, emoji: "🎨", title: "Desarrollo Frontend", color: "#6366F1",
    tasks: [
      { id: "8a", text: "Crear estructura de carpetas y componentes base", tag: "Frontend" },
      { id: "8b", text: "Implementar sistema de rutas", tag: "Frontend" },
      { id: "8c", text: "Implementar flujo de autenticación en el cliente", tag: "Auth" },
      { id: "8d", text: "Construir todas las páginas y componentes necesarios", tag: "UI" },
      { id: "8e", text: "Conectar cada pantalla con su endpoint del backend", tag: "Frontend" },
      { id: "8f", text: "Gestión de estados de carga, error y vacío en cada vista", tag: "UX" },
      { id: "8g", text: "Diseño responsivo — funciona bien en móvil y escritorio", tag: "UI" },
    ],
    deliverable: "Aplicación funcional end-to-end en entorno local",
  },
  {
    id: 9, emoji: "✅", title: "Testing & Pulido", color: "#84CC16",
    tasks: [
      { id: "9a", text: "Recorrer todos los flujos de usuario de principio a fin", tag: "Test" },
      { id: "9b", text: "Probar casos límite: campos vacíos, datos inválidos, errores de red", tag: "Test" },
      { id: "9c", text: "Revisar la UI: consistencia visual, tipografía, espaciado", tag: "UI" },
      { id: "9d", text: "Optimizar imágenes y assets para carga rápida", tag: "Perf" },
      { id: "9e", text: "Revisar consola del navegador: sin errores ni warnings importantes", tag: "Debug" },
      { id: "9f", text: "Pedir a alguien que lo pruebe y recoger feedback", tag: "UX" },
    ],
    deliverable: "Proyecto estable, sin bugs críticos y visualmente cuidado",
  },
  {
    id: 10, emoji: "🚀", title: "Deploy a Producción", color: "#F43F5E",
    tasks: [
      { id: "10a", text: "Deploy del backend (Render, Railway, Fly.io…)", tag: "DevOps" },
      { id: "10b", text: "Deploy del frontend (Vercel, Netlify…)", tag: "DevOps" },
      { id: "10c", text: "Configurar variables de entorno en producción", tag: "Config" },
      { id: "10d", text: "Verificar que el backend responde en producción", tag: "DevOps" },
      { id: "10e", text: "Verificar frontend apuntando al backend de producción", tag: "DevOps" },
      { id: "10f", text: "Recorrer todos los flujos clave en producción", tag: "Test" },
    ],
    deliverable: "Proyecto live con URL pública y funcionando en producción",
  },
  {
    id: 11, emoji: "📁", title: "Documentación & Portfolio", color: "#A78BFA",
    tasks: [
      { id: "11a", text: "README completo: descripción, stack, features, cómo correrlo", tag: "Docs" },
      { id: "11b", text: "Añadir enlace a la demo live en el README", tag: "Docs" },
      { id: "11c", text: "Capturar screenshots o grabar un GIF del proyecto", tag: "Portfolio" },
      { id: "11d", text: "Publicar en LinkedIn: qué hiciste, qué aprendiste, links", tag: "Portfolio" },
      { id: "11e", text: "Añadir el proyecto a tu portfolio personal o CV", tag: "Portfolio" },
    ],
    deliverable: "Proyecto presentable para recruiters y entrevistas técnicas",
  },
];

const TAG_COLORS = {
  Idea:"#92400E", Scope:"#78350F", Research:"#1E3A5F", Arch:"#1E40AF",
  Infra:"#065F46", Frontend:"#1D4ED8", Backend:"#065F46", DB:"#5B21B6",
  Services:"#9D174D", Cost:"#374151", API:"#0F766E", Auth:"#B45309",
  Docs:"#374151", Git:"#1F2937", Config:"#92400E", Test:"#9D174D",
  UI:"#1E40AF", UX:"#6B21A8", Debug:"#7C2D12", Perf:"#14532D",
  DevOps:"#BE123C", Portfolio:"#0369A1",
};

const STATUS_COLORS = {
  "En progreso": "#F59E0B",
  "Completado": "#10B981",
  "Pausado": "#6B7280",
  "Sin empezar": "#374151",
};

const STORAGE_KEY = "devportfolio_projects_v1";

function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveProjects(projects) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); } catch {}
}

function makeProject(name, stack = "") {
  return {
    id: Date.now().toString(),
    name,
    stack,
    status: "Sin empezar",
    createdAt: new Date().toLocaleDateString("es-ES"),
    checked: {},
    phases: DEFAULT_PHASES.map(p => ({ ...p, tasks: p.tasks.map(t => ({ ...t })) })),
    openPhase: 1,
  };
}

// ─── Mini progress ring ───────────────────────────────────────────────────────
function Ring({ pct, color, size = 48 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1F2937" strokeWidth="4" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        fill="#fff" fontSize="10" fontWeight="700"
        style={{ transform: "rotate(90deg)", transformOrigin: `${size/2}px ${size/2}px` }}>
        {pct}%
      </text>
    </svg>
  );
}

// ─── Project Roadmap View ─────────────────────────────────────────────────────
function RoadmapView({ project, onUpdate, onBack }) {
  const [openPhase, setOpenPhase] = useState(project.openPhase || 1);

  const toggle = (taskId) => {
    const newChecked = { ...project.checked, [taskId]: !project.checked[taskId] };
    const total = project.phases.reduce((a, p) => a + p.tasks.length, 0);
    const done = Object.values(newChecked).filter(Boolean).length;
    const pct = Math.round((done / total) * 100);
    const status = pct === 100 ? "Completado" : pct > 0 ? "En progreso" : "Sin empezar";
    onUpdate({ ...project, checked: newChecked, status, openPhase });
  };

  const total = project.phases.reduce((a, p) => a + p.tasks.length, 0);
  const done = Object.values(project.checked).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <button onClick={onBack} style={{
          background: "#0D1117", border: "1px solid #1F2937", color: "#9CA3AF",
          padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13,
          display: "flex", alignItems: "center", gap: 6,
        }}>← Volver</button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:22, color:"#F1F5F9" }}>
            {project.name}
          </h2>
          {project.stack && <p style={{ fontSize:12, color:"#4B5563", marginTop:2 }}>{project.stack}</p>}
        </div>
        <Ring pct={pct} color={pct===100?"#10B981":"#8B5CF6"} size={52} />
      </div>

      {/* Phase list */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {project.phases.map((phase, idx) => {
          const isOpen = openPhase === phase.id;
          const pDone = phase.tasks.filter(t => project.checked[t.id]).length;
          const pComplete = pDone === phase.tasks.length;

          return (
            <div key={phase.id} style={{
              background:"#0D1117",
              border:`1px solid ${isOpen ? phase.color+"55" : pComplete ? phase.color+"22" : "#161B22"}`,
              borderRadius:13, overflow:"hidden",
              boxShadow: isOpen ? `0 4px 24px ${phase.color}12` : "none",
            }}>
              <div onClick={() => { setOpenPhase(isOpen ? null : phase.id); onUpdate({...project, openPhase: isOpen ? null : phase.id}); }}
                style={{ padding:"15px 18px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", userSelect:"none" }}>
                <div style={{
                  width:36, height:36, borderRadius:9, flexShrink:0,
                  background: pComplete ? phase.color+"22" : "#111827",
                  border:`1px solid ${pComplete ? phase.color : "#1F2937"}`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
                }}>
                  {pComplete ? "✓" : phase.emoji}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, fontWeight:700, color:"#374151", fontFamily:"'Space Grotesk',sans-serif" }}>
                      {String(idx+1).padStart(2,"0")}
                    </span>
                    <span style={{
                      fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:14,
                      color: pComplete ? "#4B5563" : "#F1F5F9",
                      textDecoration: pComplete ? "line-through" : "none",
                    }}>{phase.title}</span>
                    {pComplete && <span style={{ fontSize:9, fontWeight:700, color:phase.color, background:phase.color+"18", padding:"1px 7px", borderRadius:20 }}>COMPLETADA</span>}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4 }}>
                    <div style={{ height:3, width:90, background:"#1F2937", borderRadius:4, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${(pDone/phase.tasks.length)*100}%`, background:phase.color, borderRadius:4, transition:"width 0.4s" }} />
                    </div>
                    <span style={{ fontSize:11, color:"#374151" }}>{pDone}/{phase.tasks.length}</span>
                  </div>
                </div>
                <svg style={{ transition:"transform 0.25s", transform: isOpen?"rotate(180deg)":"none", flexShrink:0 }}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>

              {isOpen && (
                <div style={{ borderTop:"1px solid #161B22", padding:"6px 12px 12px" }}>
                  {phase.tasks.map(task => (
                    <div key={task.id} onClick={() => toggle(task.id)}
                      style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:8, cursor:"pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.03)"}
                      onMouseLeave={e => e.currentTarget.style.background="transparent"}
                    >
                      <div style={{
                        width:17, height:17, borderRadius:5, flexShrink:0,
                        border:`2px solid ${project.checked[task.id] ? phase.color : "#2D3748"}`,
                        background: project.checked[task.id] ? phase.color : "transparent",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        transition:"all 0.15s",
                      }}>
                        {project.checked[task.id] && (
                          <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                            <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span style={{
                        flex:1, fontSize:13.5, lineHeight:1.4,
                        color: project.checked[task.id] ? "#374151" : "#CBD5E1",
                        textDecoration: project.checked[task.id] ? "line-through" : "none",
                      }}>{task.text}</span>
                      <span style={{
                        fontSize:10, fontWeight:700, flexShrink:0, color:"#fff",
                        background:(TAG_COLORS[task.tag]||"#1F2937")+"DD",
                        padding:"2px 7px", borderRadius:4, letterSpacing:"0.04em",
                      }}>{task.tag}</span>
                    </div>
                  ))}
                  <div style={{
                    marginTop:8, padding:"10px 14px",
                    background:phase.color+"0A", border:`1px solid ${phase.color}25`, borderRadius:8,
                    display:"flex", gap:10, alignItems:"flex-start",
                  }}>
                    <span style={{ fontSize:14 }}>🎯</span>
                    <div>
                      <span style={{ fontSize:10, fontWeight:700, color:phase.color, textTransform:"uppercase", letterSpacing:"0.1em" }}>Meta de esta fase</span>
                      <p style={{ margin:"3px 0 0", fontSize:13, color:"#94A3B8", lineHeight:1.5 }}>{phase.deliverable}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ projects, onOpen, onCreate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [stack, setStack] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name.trim(), stack.trim());
    setName(""); setStack(""); setShowForm(false);
  };

  const getPct = (p) => {
    const total = p.phases.reduce((a, ph) => a + ph.tasks.length, 0);
    const done = Object.values(p.checked).filter(Boolean).length;
    return total ? Math.round((done / total) * 100) : 0;
  };

  const getCurrentPhase = (p) => {
    const ph = p.phases.find(ph => ph.tasks.some(t => !p.checked[t.id]));
    return ph ? ph.title : "Completado 🎉";
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", color:"#374151", textTransform:"uppercase", marginBottom:8 }}>
          🗂️ &nbsp;Portfolio Tracker
        </p>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(26px,4vw,38px)", fontWeight:800,
            background:"linear-gradient(135deg,#fff 0%,#94A3B8 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Mis Proyectos
          </h1>
          <button onClick={() => setShowForm(true)} style={{
            background:"linear-gradient(135deg,#8B5CF6,#EC4899)", border:"none", color:"#fff",
            padding:"10px 20px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700,
            fontFamily:"'Space Grotesk',sans-serif", display:"flex", alignItems:"center", gap:8,
          }}>+ Nuevo proyecto</button>
        </div>

        {/* Stats bar */}
        {projects.length > 0 && (
          <div style={{ display:"flex", gap:12, marginTop:20, flexWrap:"wrap" }}>
            {[
              { label:"Total", val: projects.length, color:"#8B5CF6" },
              { label:"En progreso", val: projects.filter(p=>p.status==="En progreso").length, color:"#F59E0B" },
              { label:"Completados", val: projects.filter(p=>p.status==="Completado").length, color:"#10B981" },
              { label:"Pausados", val: projects.filter(p=>p.status==="Pausado").length, color:"#6B7280" },
            ].map(s => (
              <div key={s.label} style={{
                background:"#0D1117", border:"1px solid #161B22", borderRadius:10,
                padding:"10px 16px", display:"flex", alignItems:"center", gap:10,
              }}>
                <span style={{ fontSize:20, fontWeight:800, fontFamily:"'Space Grotesk',sans-serif", color:s.color }}>{s.val}</span>
                <span style={{ fontSize:12, color:"#4B5563" }}>{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New project form */}
      {showForm && (
        <div style={{
          background:"#0D1117", border:"1px solid #8B5CF655", borderRadius:14,
          padding:24, marginBottom:20,
          boxShadow:"0 0 32px #8B5CF622",
        }}>
          <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:16, color:"#F1F5F9", marginBottom:16 }}>
            Nuevo proyecto
          </h3>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <input
              placeholder="Nombre del proyecto *"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreate()}
              style={{
                background:"#111827", border:"1px solid #1F2937", borderRadius:8,
                padding:"10px 14px", color:"#F1F5F9", fontSize:14, outline:"none",
                fontFamily:"inherit",
              }}
            />
            <input
              placeholder="Stack tecnológico (ej: React + FastAPI + PostgreSQL)"
              value={stack}
              onChange={e => setStack(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreate()}
              style={{
                background:"#111827", border:"1px solid #1F2937", borderRadius:8,
                padding:"10px 14px", color:"#F1F5F9", fontSize:14, outline:"none",
                fontFamily:"inherit",
              }}
            />
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={handleCreate} style={{
                background:"linear-gradient(135deg,#8B5CF6,#EC4899)", border:"none", color:"#fff",
                padding:"10px 20px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:"inherit",
              }}>Crear proyecto</button>
              <button onClick={() => { setShowForm(false); setName(""); setStack(""); }} style={{
                background:"transparent", border:"1px solid #1F2937", color:"#6B7280",
                padding:"10px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontFamily:"inherit",
              }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {projects.length === 0 && !showForm && (
        <div style={{ textAlign:"center", padding:"60px 20px" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🚀</div>
          <p style={{ color:"#4B5563", fontSize:15, marginBottom:20 }}>Todavía no tienes proyectos.</p>
          <button onClick={() => setShowForm(true)} style={{
            background:"linear-gradient(135deg,#8B5CF6,#EC4899)", border:"none", color:"#fff",
            padding:"12px 24px", borderRadius:10, cursor:"pointer", fontSize:14, fontWeight:700, fontFamily:"inherit",
          }}>Crear mi primer proyecto</button>
        </div>
      )}

      {/* Project cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
        {projects.map(project => {
          const pct = getPct(project);
          const currentPhase = getCurrentPhase(project);
          const statusColor = STATUS_COLORS[project.status] || "#374151";

          return (
            <div key={project.id}
              style={{
                background:"#0D1117", border:"1px solid #161B22", borderRadius:14,
                padding:20, cursor:"pointer", transition:"all 0.2s",
                position:"relative",
              }}
              onMouseEnter={e => { e.currentTarget.style.border="1px solid #2D3748"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.border="1px solid #161B22"; e.currentTarget.style.transform="none"; }}
            >
              {/* Delete btn */}
              <button
                onClick={e => { e.stopPropagation(); if(confirm(`¿Eliminar "${project.name}"?`)) onDelete(project.id); }}
                style={{
                  position:"absolute", top:12, right:12,
                  background:"transparent", border:"none", color:"#374151",
                  cursor:"pointer", fontSize:16, padding:4, borderRadius:6, lineHeight:1,
                }}
                title="Eliminar proyecto"
              >×</button>

              <div onClick={() => onOpen(project.id)} style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                  <Ring pct={pct} color={pct===100?"#10B981":"#8B5CF6"} size={46} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:15, color:"#F1F5F9", lineHeight:1.3 }}>
                      {project.name}
                    </h3>
                    {project.stack && (
                      <p style={{ fontSize:11, color:"#4B5563", marginTop:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {project.stack}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{
                    fontSize:11, fontWeight:700, color:statusColor,
                    background:statusColor+"18", padding:"3px 9px", borderRadius:20,
                  }}>{project.status}</span>
                  <span style={{ fontSize:11, color:"#374151" }}>
                    {new Date(project.createdAt).toLocaleDateString ? project.createdAt : project.createdAt}
                  </span>
                </div>

                {/* Current phase */}
                <div style={{ background:"#111827", borderRadius:8, padding:"8px 12px" }}>
                  <p style={{ fontSize:11, color:"#4B5563", marginBottom:2 }}>Fase actual</p>
                  <p style={{ fontSize:12, color:"#94A3B8", fontWeight:500 }}>{currentPhase}</p>
                </div>

                {/* Phase dots */}
                <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
                  {project.phases.map(ph => {
                    const phDone = ph.tasks.filter(t => project.checked[t.id]).length === ph.tasks.length;
                    const phStarted = ph.tasks.some(t => project.checked[t.id]);
                    return (
                      <div key={ph.id} title={ph.title} style={{
                        flex:1, height:4, borderRadius:4, minWidth:6,
                        background: phDone ? ph.color : phStarted ? ph.color+"44" : "#1F2937",
                        transition:"background 0.3s",
                      }} />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [projects, setProjects] = useState(() => loadProjects());
  const [activeId, setActiveId] = useState(null);

  useEffect(() => { saveProjects(projects); }, [projects]);

  const activeProject = projects.find(p => p.id === activeId);

  const handleCreate = (name, stack) => {
    setProjects(prev => [...prev, makeProject(name, stack)]);
  };

  const handleUpdate = (updated) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDelete = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div style={{
      minHeight:"100vh", background:"#080B10",
      fontFamily:"'DM Sans','Segoe UI',sans-serif", color:"#E2E8F0",
      padding:"40px 20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@700;800&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        input { font-family:'DM Sans',sans-serif; }
        input:focus { border-color:#8B5CF6 !important; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:#1F2937; border-radius:4px; }
      `}</style>

      {activeProject ? (
        <RoadmapView
          project={activeProject}
          onUpdate={handleUpdate}
          onBack={() => setActiveId(null)}
        />
      ) : (
        <Dashboard
          projects={projects}
          onOpen={setActiveId}
          onCreate={handleCreate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
