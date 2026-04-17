import { useState, useMemo, useEffect } from "react";
import { api, toObj, toArr } from "./api.js";

const C = {
  navy:"#07111F",dark:"#0C1A2E",card:"#0F2035",border:"rgba(56,189,248,0.13)",
  accent:"#38BDF8",teal:"#2DD4BF",gold:"#FBBF24",warm:"#FB923C",
  green:"#34D399",red:"#F87171",muted:"#64748B",white:"#E2EAF4",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Exo 2',sans-serif;background:${C.navy};color:${C.white};min-height:100vh;}
::-webkit-scrollbar{width:6px;height:6px;}
::-webkit-scrollbar-track{background:${C.dark};}
::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px;}
.layout{display:flex;min-height:100vh;}
.sidebar{width:248px;min-height:100vh;background:${C.dark};border-right:1px solid ${C.border};display:flex;flex-direction:column;position:fixed;left:0;top:0;bottom:0;z-index:100;}
.main-area{margin-left:248px;flex:1;min-height:100vh;display:flex;flex-direction:column;}
.topbar{padding:15px 26px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid ${C.border};background:rgba(7,17,31,0.88);backdrop-filter:blur(12px);position:sticky;top:0;z-index:50;}
.content{padding:22px 26px;flex:1;}
.sb-brand{padding:20px 18px 14px;border-bottom:1px solid ${C.border};}
.sb-logo{width:38px;height:38px;border-radius:9px;background:linear-gradient(135deg,${C.accent},${C.teal});display:flex;align-items:center;justify-content:center;font-size:17px;margin-bottom:9px;}
.sb-name{font-weight:900;font-size:14px;letter-spacing:.03em;}
.sb-sub{font-size:9px;color:${C.muted};letter-spacing:.1em;text-transform:uppercase;margin-top:2px;}
.sb-rbadge{display:inline-block;padding:2px 7px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-top:7px;}
.r-admin{background:rgba(251,191,36,.15);color:${C.gold};border:1px solid rgba(251,191,36,.25);}
.r-student{background:rgba(56,189,248,.12);color:${C.accent};border:1px solid rgba(56,189,248,.2);}
.r-staff{background:rgba(45,212,191,.12);color:${C.teal};border:1px solid rgba(45,212,191,.2);}
.nav-sec{flex:1;padding:10px 8px;}
.nav-glbl{font-size:9px;color:${C.muted};letter-spacing:.12em;text-transform:uppercase;padding:0 8px;margin:12px 0 5px;}
.nav-item{display:flex;align-items:center;gap:9px;padding:9px 11px;border-radius:8px;cursor:pointer;font-size:12.5px;font-weight:500;color:${C.muted};transition:all .15s;margin-bottom:2px;border:1px solid transparent;}
.nav-item:hover{background:rgba(56,189,248,.07);color:${C.white};}
.nav-item.active{background:linear-gradient(90deg,rgba(56,189,248,.14),rgba(56,189,248,.04));color:${C.accent};border-color:rgba(56,189,248,.18);}
.nav-ico{font-size:14px;width:26px;text-align:center;}
.sb-foot{padding:12px;border-top:1px solid ${C.border};}
.user-row{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;background:rgba(255,255,255,.04);}
.av{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:${C.navy};flex-shrink:0;}
.uname{font-size:12px;font-weight:600;}
.urole{font-size:10px;color:${C.muted};}
.ptitle{font-weight:800;font-size:18px;letter-spacing:.02em;}
.psub{font-size:11px;color:${C.muted};margin-top:2px;}
.tbar-r{display:flex;align-items:center;gap:9px;}
.notif{width:34px;height:34px;border-radius:8px;border:1px solid ${C.border};background:rgba(56,189,248,.05);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;position:relative;}
.ndot{width:6px;height:6px;border-radius:50%;background:${C.red};position:absolute;top:5px;right:5px;}
.btn{padding:8px 16px;border-radius:8px;border:none;cursor:pointer;font-family:'Exo 2',sans-serif;font-size:12.5px;font-weight:600;transition:all .15s;letter-spacing:.02em;}
.btn-primary{background:${C.accent};color:${C.navy};}
.btn-primary:hover{background:#7DD3FC;transform:translateY(-1px);}
.btn-teal{background:${C.teal};color:${C.navy};}
.btn-teal:hover{background:#5EEAD4;}
.btn-ghost{background:rgba(56,189,248,.08);color:${C.accent};border:1px solid rgba(56,189,248,.2);}
.btn-ghost:hover{background:rgba(56,189,248,.15);}
.btn-warn{background:rgba(251,191,36,.1);color:${C.gold};border:1px solid rgba(251,191,36,.2);}
.btn-danger{background:rgba(248,113,113,.1);color:${C.red};border:1px solid rgba(248,113,113,.2);}
.btn-success{background:rgba(52,211,153,.1);color:${C.green};border:1px solid rgba(52,211,153,.2);}
.btn-sm{padding:5px 11px;font-size:11px;border-radius:7px;}
.btn-xs{padding:3px 8px;font-size:10px;border-radius:6px;}
.btn-block{width:100%;padding:12px;}
.card{background:${C.card};border:1px solid ${C.border};border-radius:13px;padding:20px;}
.card-title{font-weight:800;font-size:14px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;letter-spacing:.02em;}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;}
.stat-card{background:${C.card};border:1px solid ${C.border};border-radius:13px;padding:16px;position:relative;overflow:hidden;transition:transform .18s,border-color .18s;}
.stat-card:hover{transform:translateY(-2px);border-color:rgba(56,189,248,.28);}
.stat-glow{position:absolute;top:-20px;right:-20px;width:80px;height:80px;border-radius:50%;opacity:.06;}
.stat-ico{width:38px;height:38px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px;margin-bottom:10px;}
.stat-val{font-family:'JetBrains Mono',monospace;font-size:24px;font-weight:500;line-height:1;}
.stat-lbl{font-size:11px;color:${C.muted};margin-top:4px;}
.stat-ch{font-size:10px;margin-top:7px;}
.tbl{width:100%;border-collapse:collapse;}
.tbl th{font-size:9px;color:${C.muted};text-transform:uppercase;letter-spacing:.1em;text-align:left;padding:8px 13px;border-bottom:1px solid ${C.border};}
.tbl td{padding:11px 13px;font-size:12.5px;border-bottom:1px solid rgba(255,255,255,.03);vertical-align:middle;}
.tbl tr:last-child td{border-bottom:none;}
.tbl tbody tr:hover td{background:rgba(56,189,248,.03);}
.badge{display:inline-flex;align-items:center;padding:3px 8px;border-radius:20px;font-size:9.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;}
.b-green{background:rgba(52,211,153,.12);color:${C.green};}
.b-red{background:rgba(248,113,113,.12);color:${C.red};}
.b-gold{background:rgba(251,191,36,.12);color:${C.gold};}
.b-blue{background:rgba(56,189,248,.12);color:${C.accent};}
.b-teal{background:rgba(45,212,191,.12);color:${C.teal};}
.b-muted{background:rgba(100,116,139,.12);color:${C.muted};}
.fg{display:flex;flex-direction:column;gap:5px;}
.fl{font-size:9.5px;color:${C.muted};font-weight:600;letter-spacing:.08em;text-transform:uppercase;}
.fi{padding:9px 12px;border-radius:8px;border:1px solid ${C.border};background:rgba(255,255,255,.04);color:${C.white};font-family:'Exo 2',sans-serif;font-size:13px;outline:none;transition:border-color .15s;width:100%;}
.fi:focus{border-color:rgba(56,189,248,.4);background:rgba(56,189,248,.04);}
.fi option{background:${C.dark};}
.f2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;z-index:200;}
.modal{background:${C.dark};border:1px solid ${C.border};border-radius:16px;padding:26px;width:520px;max-width:96vw;max-height:92vh;overflow-y:auto;display:flex;flex-direction:column;gap:16px;}
.modal-hd{font-weight:800;font-size:16px;display:flex;align-items:center;justify-content:space-between;}
.cls{cursor:pointer;color:${C.muted};font-size:21px;line-height:1;transition:color .15s;}
.cls:hover{color:${C.white};}
.tabs{display:flex;gap:3px;background:rgba(255,255,255,.04);padding:3px;border-radius:10px;width:fit-content;}
.tab{padding:6px 14px;border-radius:7px;cursor:pointer;font-size:11.5px;font-weight:600;color:${C.muted};transition:all .15s;}
.tab.active{background:${C.card};color:${C.white};box-shadow:0 2px 8px rgba(0,0,0,.35);}
.rooms-wrap{display:grid;grid-template-columns:repeat(auto-fill,minmax(62px,1fr));gap:6px;}
.room-tile{border-radius:8px;padding:8px 3px;text-align:center;cursor:pointer;border:1.5px solid;transition:all .14s;display:flex;flex-direction:column;align-items:center;gap:2px;}
.room-tile:hover{transform:scale(1.06);}
.av-nonac{background:rgba(52,211,153,.06);border-color:rgba(52,211,153,.3);}
.av-ac{background:rgba(56,189,248,.06);border-color:rgba(56,189,248,.3);}
.rt-occ{background:rgba(248,113,113,.06);border-color:rgba(248,113,113,.2);cursor:not-allowed;}
.rt-mine{background:rgba(251,191,36,.1);border-color:rgba(251,191,36,.4);}
.rt-maint{background:rgba(100,116,139,.06);border-color:rgba(100,116,139,.2);cursor:not-allowed;}
.rt-sel{border-color:${C.accent};background:rgba(56,189,248,.14);box-shadow:0 0 0 2px rgba(56,189,248,.25);}
.rnum{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;}
.aclbl{font-size:7.5px;font-weight:700;letter-spacing:.04em;}
.pay-methods{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.pay-m{border:1.5px solid ${C.border};border-radius:10px;padding:13px 8px;text-align:center;cursor:pointer;transition:all .15s;background:rgba(255,255,255,.02);}
.pay-m:hover{border-color:rgba(56,189,248,.3);}
.pay-m.sel{border-color:${C.accent};background:rgba(56,189,248,.08);}
.pay-ico{font-size:22px;margin-bottom:5px;}
.pay-nm{font-size:11px;font-weight:700;}
.pay-sb{font-size:9px;color:${C.muted};margin-top:2px;}
.srch-w{position:relative;}
.srch{padding:8px 12px 8px 33px;border-radius:8px;border:1px solid ${C.border};background:rgba(255,255,255,.04);color:${C.white};font-family:'Exo 2',sans-serif;font-size:12.5px;outline:none;width:200px;transition:all .15s;}
.srch:focus{border-color:rgba(56,189,248,.3);width:240px;}
.srch-ico{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:${C.muted};font-size:12px;}
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:${C.navy};position:relative;overflow:hidden;}
.login-bg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 15% 50%,rgba(56,189,248,.07) 0%,transparent 55%),radial-gradient(ellipse at 85% 20%,rgba(45,212,191,.05) 0%,transparent 50%);}
.login-grid{display:grid;grid-template-columns:1fr 1fr;width:840px;max-width:96vw;background:${C.dark};border:1px solid ${C.border};border-radius:20px;overflow:hidden;}
.login-l{padding:40px 36px;background:linear-gradient(135deg,${C.card} 0%,${C.dark} 100%);}
.login-r{padding:40px 36px;border-left:1px solid ${C.border};}
.lb-ico{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,${C.accent},${C.teal});display:flex;align-items:center;justify-content:center;font-size:20px;}
.lb-name{font-weight:900;font-size:18px;}
.lb-sub{font-size:9px;color:${C.muted};text-transform:uppercase;letter-spacing:.1em;}
.role-cards{display:flex;flex-direction:column;gap:9px;margin-top:16px;}
.role-card{border:1.5px solid ${C.border};border-radius:11px;padding:13px 14px;cursor:pointer;transition:all .18s;display:flex;align-items:center;gap:11px;}
.role-card:hover{border-color:rgba(56,189,248,.3);background:rgba(56,189,248,.04);}
.role-card.sel{border-color:${C.accent};background:rgba(56,189,248,.08);}
.role-ico{font-size:20px;width:38px;height:38px;border-radius:9px;background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center;}
.role-lbl{font-weight:700;font-size:13px;}
.role-desc{font-size:10px;color:${C.muted};margin-top:1px;}
.lh{font-weight:900;font-size:22px;margin-bottom:5px;}
.ls{font-size:12px;color:${C.muted};margin-bottom:22px;}
.err{font-size:11px;color:${C.red};padding:9px 12px;border-radius:7px;background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.2);}
.divider{height:1px;background:${C.border};margin:14px 0;}
.chip{display:inline-flex;align-items:center;gap:3px;padding:3px 8px;border-radius:20px;font-size:10.5px;font-weight:600;}
.chip-b{background:rgba(56,189,248,.1);color:${C.accent};border:1px solid rgba(56,189,248,.2);}
.chip-t{background:rgba(45,212,191,.1);color:${C.teal};border:1px solid rgba(45,212,191,.2);}
.chip-g{background:rgba(251,191,36,.1);color:${C.gold};border:1px solid rgba(251,191,36,.2);}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;}
.shd{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.empty{text-align:center;padding:44px;color:${C.muted};}
.empty-ico{font-size:36px;margin-bottom:10px;}
.leg-row{display:flex;gap:14px;margin-bottom:14px;flex-wrap:wrap;}
.leg{display:flex;align-items:center;gap:5px;font-size:11px;}
.leg-d{width:9px;height:9px;border-radius:2px;}
.ibox{padding:11px 13px;border-radius:9px;font-size:11.5px;line-height:1.5;}
.ibox-i{background:rgba(56,189,248,.08);border:1px solid rgba(56,189,248,.15);color:${C.accent};}
.ibox-w{background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.15);color:${C.gold};}
.ibox-s{background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.15);color:${C.green};}
.pay-sum{background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.12);border-radius:11px;padding:14px;}
.pay-row{display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:7px;}
.pay-tot{display:flex;justify-content:space-between;font-size:15px;font-weight:800;margin-top:7px;padding-top:7px;border-top:1px solid ${C.border};}
.receipt{border:1px solid ${C.border};border-radius:11px;padding:18px;text-align:center;}
.rcpt-chk{font-size:44px;margin-bottom:10px;}
.rcpt-id{font-family:'JetBrains Mono',monospace;font-size:12px;color:${C.muted};margin-top:5px;}
.mt14{margin-top:14px;} .mt18{margin-top:18px;} .mt20{margin-top:20px;}
.mono{font-family:'JetBrains Mono',monospace;}
.occ-bar{margin-bottom:13px;}
.floor-sec{margin-bottom:18px;}
.floor-hd{font-weight:700;font-size:12px;color:${C.muted};margin-bottom:8px;display:flex;align-items:center;gap:6px;letter-spacing:.04em;}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
.fade{animation:fadeIn .3s ease forwards;}
@keyframes scIn{from{opacity:0;transform:scale(.96);}to{opacity:1;transform:scale(1);}}
.scin{animation:scIn .22s ease forwards;}
`;

// ── Room generation: 5 floors × 30 rooms ─────────────────────────────────────
function genRooms() {
  const rooms = {};
  // Generate rooms for North Wing (NW)
  for (let f = 1; f <= 5; f++) {
    for (let n = 1; n <= 30; n++) {
      const ac = n > 20;
      const id = `NW-F${f}-${String(n).padStart(2,"0")}`;
      rooms[id] = { id, blockCode:"NW", floor:f, num:n, ac, price: ac?35000:22000, status:"available", studentId:null };
    }
  }
  // Generate rooms for South Wing (SW)
  for (let f = 1; f <= 5; f++) {
    for (let n = 1; n <= 30; n++) {
      const ac = n > 20;
      const id = `SW-F${f}-${String(n).padStart(2,"0")}`;
      rooms[id] = { id, blockCode:"SW", floor:f, num:n, ac, price: ac?35000:22000, status:"available", studentId:null };
    }
  }
  // Mark some as occupied
  ["NW-F1-01","NW-F1-03","NW-F1-05","NW-F1-21","NW-F1-23","NW-F2-02","NW-F2-15","NW-F2-22","NW-F3-08","NW-F3-24","NW-F4-20","NW-F4-25","NW-F5-10","NW-F5-20",
   "SW-F1-02","SW-F2-05","SW-F3-10","SW-F4-15","SW-F5-12"]
    .forEach(id=>{ if(rooms[id]) rooms[id].status="occupied"; });
  // Mark some as maintenance
  ["NW-F1-10","NW-F2-12","NW-F3-15","NW-F4-11","NW-F5-05",
   "SW-F1-08","SW-F2-18","SW-F3-20","SW-F4-09","SW-F5-25"]
    .forEach(id=>{ if(rooms[id]) rooms[id].status="maintenance"; });
  return rooms;
}

const USERS = {
  admin:{ id:"admin1",role:"admin",name:"Dr. R. Krishnan",email:"admin@hostel.edu",pass:"admin123",dept:"Administration" },
  staff:[
    { id:"staff1",role:"staff",name:"Mr. P. Suresh",email:"suresh@hostel.edu",pass:"staff123",dept:"Maintenance" },
    { id:"staff2",role:"staff",name:"Ms. K. Lakshmi",email:"lakshmi@hostel.edu",pass:"staff123",dept:"Housekeeping" },
  ],
  students:[
    { id:"stu1",role:"student",name:"Arjun Sharma",email:"arjun@student.edu",pass:"stu123",rollNo:"CS2021001",course:"B.Tech CSE",year:3,phone:"9876543210",roomId:"F1-01",feeStatus:"paid" },
    { id:"stu2",role:"student",name:"Priya Nair",email:"priya@student.edu",pass:"stu123",rollNo:"EC2022045",course:"B.Tech ECE",year:2,phone:"9876500123",roomId:"F1-41",feeStatus:"pending" },
    { id:"stu3",role:"student",name:"Rahul Verma",email:"rahul@student.edu",pass:"stu123",rollNo:"ME2023012",course:"B.Tech ME",year:1,phone:"9812345678",roomId:null,feeStatus:"pending" },
    { id:"stu4",role:"student",name:"Sneha Patel",email:"sneha@student.edu",pass:"stu123",rollNo:"CS2022088",course:"B.Tech CSE",year:2,phone:"9811223344",roomId:"F2-02",feeStatus:"overdue" },
    { id:"stu5",role:"student",name:"Karthik Raja",email:"karthik@student.edu",pass:"stu123",rollNo:"IT2021033",course:"B.Tech IT",year:3,phone:"9823456789",roomId:"F1-03",feeStatus:"paid" },
  ],
};

const SEED_COMPLAINTS = [
  { id:1,studentId:"stu1",studentName:"Arjun Sharma",roomId:"F1-01",category:"Electrical",title:"Fan not working",desc:"Ceiling fan stopped working.",status:"pending",priority:"high",date:"2024-03-20" },
  { id:2,studentId:"stu2",studentName:"Priya Nair",roomId:"F1-41",category:"Plumbing",title:"Water leakage",desc:"Leak under washbasin.",status:"in-progress",priority:"medium",date:"2024-03-18" },
  { id:3,studentId:"stu5",studentName:"Karthik Raja",roomId:"F1-03",category:"Network",title:"No WiFi",desc:"WiFi down on Floor 1.",status:"resolved",priority:"low",date:"2024-03-15" },
];

const SEED_PAYMENTS = [
  { id:"TXN-001",studentId:"stu1",studentName:"Arjun Sharma",roomId:"F1-01",amount:22000,method:"UPI",status:"success",date:"2024-01-10",ref:"UPI001" },
  { id:"TXN-002",studentId:"stu5",studentName:"Karthik Raja",roomId:"F1-03",amount:22000,method:"Net Banking",status:"success",date:"2024-01-12",ref:"NB002" },
  { id:"TXN-003",studentId:"stu2",studentName:"Priya Nair",roomId:"F1-41",amount:35000,method:"Card",status:"pending",date:"2024-03-01",ref:"CRD003" },
];

const AVc=["#38BDF8","#2DD4BF","#FBBF24","#FB923C","#A78BFA","#F472B6","#34D399"];
const avc=(s)=>AVc[(s||"").charCodeAt(0)%AVc.length];
const ini=(s)=>(s||"?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
const fmt=(n)=>`₹${Number(n).toLocaleString("en-IN")}`;

function SBadge({s}){
  const m={paid:"b-green",success:"b-green",resolved:"b-green",pending:"b-gold","in-progress":"b-blue",overdue:"b-red",failed:"b-red",available:"b-green",occupied:"b-red",maintenance:"b-muted"};
  const l={paid:"Paid",success:"Success",resolved:"Resolved",pending:"Pending","in-progress":"In Progress",overdue:"Overdue",failed:"Failed",available:"Available",occupied:"Occupied",maintenance:"Maintenance"};
  return <span className={`badge ${m[s]||"b-muted"}`}>{l[s]||s}</span>;
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function Login({onLogin}){
  const [mode,setMode]=useState("login");
  const [role,setRole]=useState("student");
  const [email,setEmail]=useState("admin@hostel.edu");
  const [pass,setPass]=useState("admin123");
  const [err,setErr]=useState("");
  const [signupForm,setSignupForm]=useState({name:"",email:"",pass:"",pass2:"",rollNo:"",course:"",year:1,phone:""});

  const presets={admin:{email:"admin@hostel.edu",pass:"admin123"},staff:{email:"suresh@hostel.edu",pass:"staff123"},student:{email:"arjun@student.edu",pass:"stu123"}};
  const pick=(r)=>{ setRole(r);setErr("");setEmail(presets[r].email);setPass(presets[r].pass); };

  const login=()=>{
    let u=null;
    if(role==="admin"&&email===USERS.admin.email&&pass===USERS.admin.pass) u=USERS.admin;
    else if(role==="staff") u=USERS.staff.find(s=>s.email===email&&s.pass===pass);
    else if(role==="student") u=USERS.students.find(s=>s.email===email&&s.pass===pass);
    if(u) onLogin(u); else setErr("Invalid credentials. Use the demo info below.");
  };

  const signup=()=>{
    if(!signupForm.name||!signupForm.email||!signupForm.pass||!signupForm.pass2) {
      setErr("All fields required");
      return;
    }
    if(signupForm.pass!==signupForm.pass2) {
      setErr("Passwords don't match");
      return;
    }
    if(signupForm.email.includes("@hostel.edu")||signupForm.email.includes("@student.edu")) {
      setErr("Email must be unique");
      return;
    }
    const newStudent={id:`stu${Date.now()}`,role:"student",name:signupForm.name,email:signupForm.email,pass:signupForm.pass,rollNo:signupForm.rollNo,course:signupForm.course,year:signupForm.year,phone:signupForm.phone,roomId:null,feeStatus:"pending"};
    USERS.students.push(newStudent);
    onLogin(newStudent);
  };

  return(
    <div className="login-wrap">
      <style>{css}</style>
      <div className="login-bg"/>
      <div className="login-grid fade">
        <div className="login-l">
          <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:28}}>
            <div className="lb-ico">🏛️</div>
            <div><div className="lb-name">HostelMS Pro</div><div className="lb-sub">Smart College Hostel System</div></div>
          </div>
          <div style={{fontSize:12,color:C.muted,marginBottom:14}}>Select your role to continue</div>
          <div className="role-cards">
            {[{k:"admin",ico:"👑",l:"Administrator",d:"Full system access · Warden"},{k:"staff",ico:"🔧",l:"Hostel Staff",d:"Complaints & maintenance"},{k:"student",ico:"🎓",l:"Student",d:"Room booking, fees & profile"}].map(r=>(
              <div key={r.k} className={`role-card ${role===r.k?"sel":""}`} onClick={()=>pick(r.k)}>
                <div className="role-ico">{r.ico}</div>
                <div><div className="role-lbl">{r.l}</div><div className="role-desc">{r.d}</div></div>
              </div>
            ))}
          </div>
          <div className="divider"/>
          <div style={{fontSize:10.5,color:C.muted,lineHeight:1.8}}>
            <strong style={{color:C.white,display:"block",marginBottom:2}}>Demo Credentials</strong>
            Admin: admin@hostel.edu / admin123<br/>
            Staff: suresh@hostel.edu / staff123<br/>
            Student: arjun@student.edu / stu123
          </div>
        </div>
        <div className="login-r">
          {mode==="login"?(
            <>
              <div className="lh">Welcome back 👋</div>
              <div className="ls">Sign in as <strong style={{color:C.accent}}>{role}</strong></div>
              <div style={{display:"flex",flexDirection:"column",gap:13}}>
                <div className="fg"><label className="fl">Email</label><input className="fi" type="email" value={email} onChange={e=>setEmail(e.target.value)}/></div>
                <div className="fg"><label className="fl">Password</label><input className="fi" type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/></div>
                {err&&<div className="err">{err}</div>}
                <button className="btn btn-primary btn-block" onClick={login}>Sign In →</button>
                <div style={{fontSize:11,color:C.muted,textAlign:"center"}}>New user? <button style={{background:"none",border:"none",color:C.accent,cursor:"pointer",fontWeight:600}} onClick={()=>{setMode("signup");setErr("")}}>Create account</button></div>
              </div>
            </>
          ):(
            <>
              <div className="lh">Create Account 🎓</div>
              <div className="ls">Join as a <strong style={{color:C.accent}}>Student</strong></div>
              <div style={{display:"flex",flexDirection:"column",gap:11}}>
                <div className="fg"><label className="fl">Full Name</label><input className="fi" placeholder="John Doe" value={signupForm.name} onChange={e=>setSignupForm({...signupForm,name:e.target.value})}/></div>
                <div className="fg"><label className="fl">Email</label><input className="fi" type="email" placeholder="john@example.edu" value={signupForm.email} onChange={e=>setSignupForm({...signupForm,email:e.target.value})}/></div>
                <div className="fg"><label className="fl">Roll No</label><input className="fi" placeholder="CS2021001" value={signupForm.rollNo} onChange={e=>setSignupForm({...signupForm,rollNo:e.target.value})}/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <div className="fg"><label className="fl">Course</label><input className="fi" placeholder="B.Tech CSE" value={signupForm.course} onChange={e=>setSignupForm({...signupForm,course:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Year</label><select className="fi" value={signupForm.year} onChange={e=>setSignupForm({...signupForm,year:parseInt(e.target.value)})}>
                    <option>1</option><option>2</option><option>3</option><option>4</option>
                  </select></div>
                </div>
                <div className="fg"><label className="fl">Phone</label><input className="fi" placeholder="9876543210" value={signupForm.phone} onChange={e=>setSignupForm({...signupForm,phone:e.target.value})}/></div>
                <div className="fg"><label className="fl">Password</label><input className="fi" type="password" placeholder="••••••••" value={signupForm.pass} onChange={e=>setSignupForm({...signupForm,pass:e.target.value})}/></div>
                <div className="fg"><label className="fl">Confirm Password</label><input className="fi" type="password" placeholder="••••••••" value={signupForm.pass2} onChange={e=>setSignupForm({...signupForm,pass2:e.target.value})}/></div>
                {err&&<div className="err">{err}</div>}
                <button className="btn btn-primary btn-block" onClick={signup}>Create Account →</button>
                <div style={{fontSize:11,color:C.muted,textAlign:"center"}}>Already have an account? <button style={{background:"none",border:"none",color:C.accent,cursor:"pointer",fontWeight:600}} onClick={()=>{setMode("login");setErr("")}}>Sign in</button></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── PAYMENT MODAL ─────────────────────────────────────────────────────────────
function PayModal({room,user,onClose,onSuccess,standalone=false,amount=null,purpose=""}){
  const [method,setMethod]=useState("UPI");
  const [step,setStep]=useState(1);
  const [upi,setUpi]=useState("");
  const [cno,setCno]=useState("");
  const [cnm,setCnm]=useState("");
  const [cexp,setCexp]=useState("");
  const [ccvv,setCcvv]=useState("");
  const [bank,setBank]=useState("SBI");
  const [proc,setProc]=useState(false);
  const [txnId,setTxnId]=useState("");

  const amt=amount||room?.price||0;
  const desc=purpose||(room?`Room ${room.id} · ${room.ac?"AC":"Non-AC"} · Floor ${room.floor}`:"Hostel Fee");
  const methods=[{k:"UPI",ico:"📲",nm:"UPI",sb:"GPay · PhonePe · Paytm"},{k:"Card",ico:"💳",nm:"Card",sb:"Visa · Mastercard · RuPay"},{k:"Net Banking",ico:"🏦",nm:"Net Banking",sb:"All major banks"}];

  const pay=()=>{
    setProc(true);
    setTimeout(()=>{
      const id="TXN-"+Date.now().toString().slice(-8);
      setTxnId(id); setProc(false); setStep(4);
      if(onSuccess) onSuccess({id,studentId:user.id,studentName:user.name,roomId:room?.id||"",amount:amt,method,status:"success",date:new Date().toISOString().slice(0,10),ref:id,purpose:desc});
    },2000);
  };

  const body=(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {step===1&&<>
        <div className="pay-sum">
          <div className="pay-row"><span style={{color:C.muted}}>Description</span><span style={{fontWeight:600,textAlign:"right",maxWidth:240}}>{desc}</span></div>
          <div className="pay-row"><span style={{color:C.muted}}>Student</span><span>{user.name}</span></div>
          <div className="pay-tot"><span>Total</span><span style={{color:C.accent,fontFamily:"JetBrains Mono,monospace"}}>{fmt(amt)}</span></div>
        </div>
        <div style={{fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em"}}>Select Payment Method</div>
        <div className="pay-methods">
          {methods.map(m=>(
            <div key={m.k} className={`pay-m ${method===m.k?"sel":""}`} onClick={()=>setMethod(m.k)}>
              <div className="pay-ico">{m.ico}</div><div className="pay-nm">{m.nm}</div><div className="pay-sb">{m.sb}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:9}}>
          {!standalone&&<button className="btn btn-ghost" onClick={onClose}>Cancel</button>}
          <button className="btn btn-primary" onClick={()=>setStep(2)}>Continue →</button>
        </div>
      </>}

      {step===2&&<>
        <div className="pay-sum">
          <div className="pay-row"><span style={{color:C.muted}}>Method</span><span style={{color:C.accent,fontWeight:700}}>{method}</span></div>
          <div className="pay-tot"><span>Amount</span><span style={{color:C.accent,fontFamily:"JetBrains Mono,monospace"}}>{fmt(amt)}</span></div>
        </div>
        {method==="UPI"&&<div className="fg"><label className="fl">UPI ID</label><input className="fi" placeholder="yourname@upi" value={upi} onChange={e=>setUpi(e.target.value)}/><div style={{fontSize:10,color:C.muted,marginTop:3}}>e.g. 9876543210@paytm</div></div>}
        {method==="Card"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div className="fg"><label className="fl">Card Number</label><input className="fi" placeholder="1234 5678 9012 3456" maxLength={19} value={cno} onChange={e=>setCno(e.target.value)}/></div>
          <div className="fg"><label className="fl">Name on Card</label><input className="fi" placeholder="As on card" value={cnm} onChange={e=>setCnm(e.target.value)}/></div>
          <div className="f2">
            <div className="fg"><label className="fl">Expiry</label><input className="fi" placeholder="MM/YY" value={cexp} onChange={e=>setCexp(e.target.value)}/></div>
            <div className="fg"><label className="fl">CVV</label><input className="fi" type="password" placeholder="•••" maxLength={3} value={ccvv} onChange={e=>setCcvv(e.target.value)}/></div>
          </div>
        </div>}
        {method==="Net Banking"&&<div className="fg"><label className="fl">Select Bank</label>
          <select className="fi" value={bank} onChange={e=>setBank(e.target.value)}>
            {["SBI","HDFC","ICICI","Axis","Canara","PNB","BOB","Union Bank","Kotak","Indian Bank"].map(b=><option key={b}>{b}</option>)}
          </select>
        </div>}
        <div style={{display:"flex",justifyContent:"flex-end",gap:9}}>
          <button className="btn btn-ghost" onClick={()=>setStep(1)}>← Back</button>
          <button className="btn btn-primary" onClick={()=>setStep(3)}>Review →</button>
        </div>
      </>}

      {step===3&&<>
        <div className="pay-sum">
          <div className="pay-row"><span style={{color:C.muted}}>Description</span><span style={{fontWeight:600,maxWidth:220,textAlign:"right"}}>{desc}</span></div>
          <div className="pay-row"><span style={{color:C.muted}}>Method</span><span>{method}</span></div>
          {method==="UPI"&&<div className="pay-row"><span style={{color:C.muted}}>UPI ID</span><span className="mono" style={{fontSize:11}}>{upi||"—"}</span></div>}
          {method==="Card"&&<div className="pay-row"><span style={{color:C.muted}}>Card</span><span>•••• {cno.slice(-4)||"????"}</span></div>}
          {method==="Net Banking"&&<div className="pay-row"><span style={{color:C.muted}}>Bank</span><span>{bank}</span></div>}
          <div className="pay-tot"><span>Total Payable</span><span style={{color:C.green,fontFamily:"JetBrains Mono,monospace"}}>{fmt(amt)}</span></div>
        </div>
        <div className="ibox ibox-i">🔒 Secured with 256-bit SSL encryption</div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:9}}>
          <button className="btn btn-ghost" onClick={()=>setStep(2)}>← Back</button>
          <button className="btn btn-teal" style={{minWidth:130}} onClick={pay} disabled={proc}>{proc?"⏳ Processing…":"✓ Pay Now"}</button>
        </div>
      </>}

      {step===4&&(
        <div className="receipt scin">
          <div className="rcpt-chk">✅</div>
          <div style={{fontWeight:800,fontSize:18,color:C.green}}>Payment Successful!</div>
          <div style={{color:C.muted,fontSize:12,marginTop:5}}>{fmt(amt)} paid via {method}</div>
          <div className="rcpt-id">{txnId}</div>
          <div style={{marginTop:14,fontSize:11,color:C.muted,lineHeight:1.8}}>{desc}<br/>Date: {new Date().toLocaleDateString("en-IN")}</div>
          <button className="btn btn-success" style={{marginTop:16}} onClick={onClose}>Done ✓</button>
        </div>
      )}
    </div>
  );

  if(standalone) return <div className="fade">{body}</div>;
  return(
    <div className="overlay" onClick={step!==4?onClose:undefined}>
      <div className="modal fade" onClick={e=>e.stopPropagation()}>
        <div className="modal-hd">{step!==4?"💳 Payment Gateway":"Payment Receipt"}{step!==4&&<span className="cls" onClick={onClose}>×</span>}</div>
        {body}
      </div>
    </div>
  );
}

// ── ROOM SELECTOR (student) ───────────────────────────────────────────────────
function RoomSelector({rooms,user,setUser,students,setStudents,payments,setPayments,setRooms}){
  const [selectedBlock,setSelectedBlock]=useState(null);
  const [floor,setFloor]=useState(1);
  const [typeF,setTypeF]=useState("all");
  const [sel,setSel]=useState(null);
  const [showPay,setShowPay]=useState(false);
  const me=students.find(s=>s.id===user.id)||user;
  const myRoom=me.roomId?rooms[me.roomId]:null;

  const blocks=[
    {id:1,name:"North Wing",code:"NW",numFloors:5},
    {id:2,name:"South Wing",code:"SW",numFloors:5},
  ];

  const floorRooms=useMemo(()=>
    selectedBlock?Object.values(rooms).filter(r=>{
      if(r.blockCode!==selectedBlock.code) return false;
      if(r.floor!==floor) return false;
      if(typeF==="ac") return r.ac;
      if(typeF==="nonac") return !r.ac;
      return true;
    }).sort((a,b)=>a.num-b.num):[],
  [rooms,selectedBlock,floor,typeF]);

  const pick=(r)=>{
    if(r.status==="occupied"||r.status==="maintenance"||myRoom) return;
    setSel(r.id===sel?null:r.id);
  };

  return(
    <div className="fade">
      {myRoom?(
        <div className="ibox ibox-s" style={{marginBottom:16}}>
          ✅ You are assigned to <strong>{myRoom.id}</strong> — Floor {myRoom.floor}, {myRoom.ac?"AC":"Non-AC"}, {fmt(myRoom.price)}/semester
        </div>
      ):(
        <div className="ibox ibox-w" style={{marginBottom:16}}>⚠️ No room assigned. Select a block, floor, and room below to book and pay.</div>
      )}

      {!selectedBlock?(
        <div className="card" style={{marginBottom:16}}>
          <div className="card-title">Select a Block</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
            {blocks.map(b=>(
              <div key={b.id} style={{padding:"14px",borderRadius:11,border:`2px solid ${C.border}`,background:"rgba(56,189,248,.04)",cursor:"pointer",transition:"all .15s"}}
                onClick={()=>setSelectedBlock(b)}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(56,189,248,.5)";e.currentTarget.style.background="rgba(56,189,248,.1)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background="rgba(56,189,248,.04)"}}>
                <div style={{fontSize:13,fontWeight:700,marginBottom:6}}>{b.name}</div>
                <div style={{fontSize:10,color:C.muted,marginBottom:8}}>Code: <span className="mono">{b.code}</span></div>
                <div style={{fontSize:10,color:C.accent}}>🏗️ {b.numFloors} Floors</div>
              </div>
            ))}
          </div>
        </div>
      ):(
        <>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,padding:"14px",borderRadius:11,background:`${C.card}`,border:`1px solid ${C.border}`}}>
            <button className="btn btn-ghost btn-sm" onClick={()=>{setSelectedBlock(null);setFloor(1);}}>← Back to Blocks</button>
            <div style={{fontSize:12,color:C.muted}}>Selected: <span style={{color:C.accent,fontWeight:600}}>{selectedBlock.name}</span></div>
            <div style={{marginLeft:"auto",fontSize:11,color:C.muted}}>Select a floor below</div>
          </div>

          <div className="shd" style={{marginBottom:16}}>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <div className="tabs">{Array.from({length:selectedBlock.numFloors},(v,i)=>i+1).map(f=><div key={f} className={`tab ${floor===f?"active":""}`} onClick={()=>setFloor(f)}>Floor {f}</div>)}</div>
              <div className="tabs">{[["all","All"],["nonac","Non-AC"],["ac","AC"]].map(([k,l])=><div key={k} className={`tab ${typeF===k?"active":""}`} onClick={()=>setTypeF(k)}>{l}</div>)}</div>
            </div>
            <div style={{fontSize:11,color:C.muted}}>{floorRooms.filter(r=>r.status==="available").length} available on Floor {floor}</div>
          </div>

          <div className="leg-row">
            <div className="leg"><div className="leg-d" style={{background:"rgba(52,211,153,.5)"}}/>Non-AC Avail</div>
            <div className="leg"><div className="leg-d" style={{background:"rgba(56,189,248,.5)"}}/>AC Avail</div>
            <div className="leg"><div className="leg-d" style={{background:"rgba(248,113,113,.4)"}}/>Occupied</div>
            {myRoom&&<div className="leg"><div className="leg-d" style={{background:"rgba(251,191,36,.5)"}}/>My Room</div>}
            <div className="leg"><div className="leg-d" style={{background:"rgba(100,116,139,.3)"}}/>Maintenance</div>
          </div>

          <div className="card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:12,color:C.muted}}>{selectedBlock.name} • Floor {floor} — <span style={{color:C.green}}>Non-AC ₹22,000</span> · <span style={{color:C.accent}}>AC ₹35,000</span></div>
              <div style={{fontSize:11,color:C.muted}}>Rooms 01–30</div>
            </div>
            <div className="rooms-wrap">
              {floorRooms.length===0?(
                <div style={{width:"100%",padding:"20px",textAlign:"center",color:C.muted,fontSize:12}}>No rooms available</div>
              ):(
                floorRooms.map(r=>{
                  const isMine=r.id===me.roomId;
                  const isSel=r.id===sel;
                  let cls="room-tile ";
                  if(isMine) cls+="rt-mine";
                  else if(isSel) cls+="rt-sel";
                  else if(r.status==="occupied") cls+="rt-occ";
                  else if(r.status==="maintenance") cls+="rt-maint";
                  else cls+=r.ac?"av-ac":"av-nonac";
                  return(
                    <div key={r.id} className={cls} onClick={()=>pick(r)} title={`${r.id} · ${r.ac?"AC":"Non-AC"} · ${fmt(r.price)}/sem`}>
                      <div className="rnum" style={{color:isMine?C.gold:r.status==="occupied"?C.red:r.status==="maintenance"?C.muted:r.ac?C.accent:C.green}}>{String(r.num).padStart(2,"0")}</div>
                      <div className="aclbl" style={{color:r.ac?C.accent:C.green,fontSize:"7px"}}>{r.ac?"AC":"—"}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      {sel&&!myRoom&&(
        <div className="card mt18 scin" style={{borderColor:"rgba(56,189,248,.3)"}}>
          <div className="card-title">Selected: {sel}</div>
          <div className="g2" style={{marginBottom:14}}>
            {[["Room",sel],["Floor",`Floor ${rooms[sel]?.floor}`],["Type",rooms[sel]?.ac?"🌬️ AC":"🪟 Non-AC"],["Fee",fmt(rooms[sel]?.price)+"/semester"]].map(([k,v])=>(
              <div key={k} style={{padding:"10px 12px",borderRadius:8,background:"rgba(56,189,248,.05)",border:"1px solid rgba(56,189,248,.15)"}}>
                <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>{k}</div>
                <div style={{fontWeight:700}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:9}}>
            <button className="btn btn-ghost" onClick={()=>setSel(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={()=>setShowPay(true)}>Proceed to Payment →</button>
          </div>
        </div>
      )}

      {showPay&&sel&&(
        <PayModal
          room={rooms[sel]} user={user}
          onClose={()=>setShowPay(false)}
          onSuccess={(txn)=>{
            const updatedRoom={...rooms[sel],status:"occupied",studentId:user.id};
            const updatedStudent={...user,roomId:sel,feeStatus:"paid"};
            
            // Update local state
            setRooms(prev=>({...prev,[sel]:updatedRoom}));
            setUser(updatedStudent);
            setStudents(prev=>prev.map(s=>s.id===user.id?updatedStudent:s));
            setPayments(prev=>[...prev,txn]);
            
            // Save to MongoDB
            api.updateRoom(sel,{status:"occupied",studentId:user.id}).catch(err=>console.error('Room update error:',err));
            api.updateUser(user.id||user._id,{roomId:sel,feeStatus:"paid"}).catch(err=>console.error('User update error:',err));
            api.createPayment(txn).catch(err=>console.error('Payment save error:',err));
            
            setSel(null); setShowPay(false);
          }}
        />
      )}
    </div>
  );
}

// ── ADMIN DASHBOARD ───────────────────────────────────────────────────────────
function AdminDash({rooms,students,complaints,payments}){
  const vals=Object.values(rooms);
  const occ=vals.filter(r=>r.status==="occupied").length;
  const avail=vals.filter(r=>r.status==="available").length;
  const maint=vals.filter(r=>r.status==="maintenance").length;
  const rev=payments.filter(p=>p.status==="success").reduce((s,p)=>s+p.amount,0);
  const openC=complaints.filter(c=>c.status!=="resolved").length;

  const floors=[1,2,3,4,5].map(f=>{
    const fr=vals.filter(r=>r.floor===f);
    const o=fr.filter(r=>r.status==="occupied").length;
    return{f,total:fr.length,occ:o,pct:Math.round(o/fr.length*100)};
  });

  return(
    <div className="fade">
      <div className="stats-grid">
        {[
          {ico:"🏠",l:"Total Rooms",v:300,sub:`${avail} available`,col:C.accent,bg:"rgba(56,189,248,.1)"},
          {ico:"👥",l:"Students",v:students.length,sub:`${occ} occupied`,col:C.teal,bg:"rgba(45,212,191,.1)"},
          {ico:"⚠️",l:"Open Complaints",v:openC,sub:`${complaints.filter(c=>c.status==="resolved").length} resolved`,col:C.gold,bg:"rgba(251,191,36,.1)"},
          {ico:"💰",l:"Revenue",v:fmt(rev),sub:`${payments.filter(p=>p.status==="success").length} txns`,col:C.green,bg:"rgba(52,211,153,.1)"},
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div className="stat-glow" style={{background:s.col}}/>
            <div className="stat-ico" style={{background:s.bg}}>{s.ico}</div>
            <div className="stat-val mono">{s.v}</div>
            <div className="stat-lbl">{s.l}</div>
            <div className="stat-ch" style={{color:s.col}}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-title">Floor Occupancy</div>
          {floors.map(x=>(
            <div key={x.f} className="occ-bar">
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
                <span style={{color:C.muted}}>Floor {x.f}</span>
                <span className="mono">{x.occ}/{x.total} ({x.pct}%)</span>
              </div>
              <div style={{height:5,borderRadius:3,background:"rgba(255,255,255,.06)",overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:3,width:`${x.pct}%`,background:`linear-gradient(90deg,${C.accent},${C.teal})`}}/>
              </div>
            </div>
          ))}
          <div className="divider"/>
          <div style={{display:"flex",gap:14,fontSize:11}}>
            {[{c:C.green,l:"Available",v:avail},{c:C.red,l:"Occupied",v:occ},{c:C.muted,l:"Maintenance",v:maint}].map((x,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:7,height:7,borderRadius:2,background:x.c}}/>
                <span style={{color:C.muted}}>{x.l}</span>
                <span className="mono" style={{fontWeight:600}}>{x.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Room Type Stats</div>
          {[
            {l:"Non-AC Rooms",total:200,avail:vals.filter(r=>!r.ac&&r.status==="available").length,col:C.green,price:"₹22,000/sem"},
            {l:"AC Rooms",total:100,avail:vals.filter(r=>r.ac&&r.status==="available").length,col:C.accent,price:"₹35,000/sem"},
          ].map((x,i)=>(
            <div key={i} style={{marginBottom:14,padding:"13px",borderRadius:9,background:"rgba(255,255,255,.03)",border:`1px solid ${C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                <span style={{fontSize:12,color:C.muted}}>{x.l}</span>
                <span style={{fontSize:10,color:x.col,fontWeight:700}}>{x.price}</span>
              </div>
              <div className="mono" style={{fontSize:18,fontWeight:500,color:x.col}}>{x.avail}<span style={{fontSize:12,color:C.muted}}> / {x.total} avail</span></div>
              <div style={{height:4,borderRadius:2,background:"rgba(255,255,255,.06)",overflow:"hidden",marginTop:7}}>
                <div style={{height:"100%",borderRadius:2,width:`${Math.round(x.avail/x.total*100)}%`,background:x.col,opacity:.7}}/>
              </div>
            </div>
          ))}
          <div className="ibox ibox-w" style={{fontSize:11}}>5 floors × 20 Non-AC + 10 AC = 150 total rooms per block</div>
        </div>
      </div>

      <div className="card mt18">
        <div className="card-title">Recent Payments</div>
        {payments.slice().reverse().slice(0,5).map(p=>(
          <div key={p.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <div className="av" style={{background:avc(p.studentName)}}>{ini(p.studentName)}</div>
              <div><div style={{fontSize:12.5,fontWeight:600}}>{p.studentName}</div><div style={{fontSize:10,color:C.muted}}>{p.roomId||p.purpose} · {p.method} · {p.date}</div></div>
            </div>
            <div style={{textAlign:"right"}}>
              <div className="mono" style={{fontWeight:600,color:C.green}}>{fmt(p.amount)}</div>
              <SBadge s={p.status}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── STUDENT DASHBOARD ─────────────────────────────────────────────────────────
function StudentDash({user,students,rooms,complaints,payments}){
  const me=students.find(s=>s.id===user.id)||user;
  const myRoom=me.roomId?rooms[me.roomId]:null;
  const myC=complaints.filter(c=>c.studentId===user.id);
  const myP=payments.filter(p=>p.studentId===user.id);

  return(
    <div className="fade">
      <div className="card" style={{marginBottom:18,background:"linear-gradient(135deg,rgba(56,189,248,.09),rgba(45,212,191,.04))",borderColor:"rgba(56,189,248,.22)"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div className="av" style={{width:52,height:52,fontSize:18,background:avc(user.name)}}>{ini(user.name)}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:900,fontSize:17}}>{user.name}</div>
            <div style={{fontSize:11,color:C.muted,marginTop:2}}>{me.rollNo} · {me.course} · Year {me.year}</div>
            <div style={{marginTop:7,display:"flex",gap:7}}>
              {myRoom?<span className="chip chip-t">🏠 {myRoom.id} · {myRoom.ac?"AC":"Non-AC"}</span>:<span className="badge b-gold">No Room</span>}
              <SBadge s={me.feeStatus}/>
            </div>
          </div>
        </div>
      </div>

      <div className="g3">
        {[
          {ico:"🏠",l:"My Room",v:myRoom?myRoom.id:"—",sub:myRoom?(myRoom.ac?"AC Room":"Non-AC Room"):"Not assigned",col:C.accent},
          {ico:"⚠️",l:"Complaints",v:myC.length,sub:`${myC.filter(c=>c.status==="resolved").length} resolved`,col:C.gold},
          {ico:"💳",l:"Payments",v:myP.filter(p=>p.status==="success").length,sub:"Successful",col:C.green},
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div className="stat-ico" style={{background:`rgba(${i===0?"56,189,248":i===1?"251,191,36":"52,211,153"},.1)`}}>{s.ico}</div>
            <div className="stat-val mono">{s.v}</div>
            <div className="stat-lbl">{s.l}</div>
            <div className="stat-ch" style={{color:s.col}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {myRoom&&(
        <div className="card mt18">
          <div className="card-title">Room Details</div>
          <div className="g2">
            {[["Room ID",myRoom.id],["Floor",`Floor ${myRoom.floor}`],["Type",myRoom.ac?"🌬️ AC Room":"🪟 Non-AC Room"],["Semester Fee",fmt(myRoom.price)]].map(([k,v])=>(
              <div key={k} style={{padding:"11px 13px",borderRadius:8,background:"rgba(255,255,255,.03)",border:`1px solid ${C.border}`}}>
                <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>{k}</div>
                <div style={{fontWeight:700,fontSize:14}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── ADMIN STUDENTS ────────────────────────────────────────────────────────────
function AdminStudents({students,setStudents}){
  const [srch,setSrch]=useState("");
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({name:"",email:"",rollNo:"",course:"",year:1,phone:"",feeStatus:"pending",pass:"stu123"});

  const filtered=students.filter(s=>s.name.toLowerCase().includes(srch.toLowerCase())||(s.rollNo||"").toLowerCase().includes(srch.toLowerCase()));

  const add=()=>{
    if(!form.name||!form.email) return;
    setStudents(prev=>[...prev,{...form,id:"stu"+Date.now(),role:"student",roomId:null}]);
    setForm({name:"",email:"",rollNo:"",course:"",year:1,phone:"",feeStatus:"pending",pass:"stu123"});
    setModal(false);
  };

  return(
    <div className="fade">
      <div className="shd">
        <div className="srch-w"><span className="srch-ico">🔍</span><input className="srch" placeholder="Search…" value={srch} onChange={e=>setSrch(e.target.value)}/></div>
        <button className="btn btn-primary" onClick={()=>setModal(true)}>+ Add Student</button>
      </div>
      <div className="card">
        <table className="tbl">
          <thead><tr><th>Student</th><th>Roll</th><th>Room</th><th>Course</th><th>Yr</th><th>Fee</th><th></th></tr></thead>
          <tbody>
            {filtered.length===0?<tr><td colSpan={7}><div className="empty"><div className="empty-ico">👤</div>No students</div></td></tr>
            :filtered.map(s=>(
              <tr key={s.id}>
                <td><div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div className="av" style={{background:avc(s.name)}}>{ini(s.name)}</div>
                  <div><div style={{fontWeight:600,fontSize:12.5}}>{s.name}</div><div style={{fontSize:10,color:C.muted}}>{s.email}</div></div>
                </div></td>
                <td><span className="chip chip-b mono" style={{fontSize:10}}>{s.rollNo}</span></td>
                <td><span className="chip chip-t">{s.roomId||"—"}</span></td>
                <td style={{fontSize:11.5,color:C.muted}}>{s.course}</td>
                <td style={{fontSize:11.5,color:C.muted}}>Y{s.year}</td>
                <td><SBadge s={s.feeStatus}/></td>
                <td><button className="btn btn-danger btn-xs" onClick={()=>setStudents(prev=>prev.filter(x=>x.id!==s.id))}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal&&(
        <div className="overlay" onClick={()=>setModal(false)}>
          <div className="modal fade" onClick={e=>e.stopPropagation()}>
            <div className="modal-hd">Add New Student <span className="cls" onClick={()=>setModal(false)}>×</span></div>
            <div style={{display:"flex",flexDirection:"column",gap:11}}>
              <div className="f2">
                <div className="fg"><label className="fl">Full Name</label><input className="fi" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
                <div className="fg"><label className="fl">Email</label><input className="fi" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
                <div className="fg"><label className="fl">Roll No.</label><input className="fi" value={form.rollNo} onChange={e=>setForm({...form,rollNo:e.target.value})}/></div>
                <div className="fg"><label className="fl">Phone</label><input className="fi" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
                <div className="fg"><label className="fl">Course</label><input className="fi" value={form.course} onChange={e=>setForm({...form,course:e.target.value})}/></div>
                <div className="fg"><label className="fl">Year</label>
                  <select className="fi" value={form.year} onChange={e=>setForm({...form,year:Number(e.target.value)})}>
                    {[1,2,3,4].map(y=><option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
              </div>
              <div className="fg"><label className="fl">Default Password</label><input className="fi" value={form.pass} onChange={e=>setForm({...form,pass:e.target.value})}/></div>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:9}}>
              <button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={add}>Add Student</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ADMIN ROOMS ───────────────────────────────────────────────────────────────
function AdminRooms({rooms,setRooms}){
  const [modal,setModal]=useState(null);
  const [selectedBlock,setSelectedBlock]=useState(null);
  const [selectedFloor,setSelectedFloor]=useState(1);
  const [blocks,setBlocks]=useState([
    {id:1,name:"North Wing",code:"NW",numFloors:5,rooms:150},
    {id:2,name:"South Wing",code:"SW",numFloors:5,rooms:150},
  ]);
  const [blockForm,setBlockForm]=useState({name:"",code:"",numFloors:5});
  const [floorForm,setFloorForm]=useState({blockCode:"",floorNum:1});
  const [roomForm,setRoomForm]=useState({blockCode:"",floor:1,num:1,ac:false,price:22000});
  const [editRoom,setEditRoom]=useState(null);
  
  const fr=useMemo(()=>selectedBlock?Object.values(rooms).filter(r=>r.blockCode===selectedBlock.code&&r.floor===selectedFloor).sort((a,b)=>a.num-b.num):[],[rooms,selectedBlock,selectedFloor]);

  const toggle=(id)=>{
    setRooms(prev=>{
      const r=prev[id];
      const ns=r.status==="available"?"maintenance":r.status==="maintenance"?"available":r.status;
      return{...prev,[id]:{...r,status:ns}};
    });
  };

  const addBlock=()=>{
    if(!blockForm.name||!blockForm.code) return;
    setBlocks(prev=>[...prev,{id:Date.now(),name:blockForm.name,code:blockForm.code,numFloors:blockForm.numFloors,rooms:blockForm.numFloors*30}]);
    alert(`Block "${blockForm.name}" (${blockForm.code}) created successfully!`);
    setBlockForm({name:"",code:"",numFloors:5});
    setModal(null);
  };

  const addFloor=()=>{
    if(!floorForm.blockCode||!floorForm.floorNum) return;
    alert(`Floor ${floorForm.floorNum} added to Block ${floorForm.blockCode}!`);
    setFloorForm({blockCode:"",floorNum:1});
    setModal(null);
  };

  const addRoom=()=>{
    if(!roomForm.blockCode||!roomForm.floor||!roomForm.num) return;
    const id=`${roomForm.blockCode}-F${roomForm.floor}-${String(roomForm.num).padStart(2,"0")}`;
    const newRoom={id,blockCode:roomForm.blockCode,floor:roomForm.floor,num:roomForm.num,ac:roomForm.ac,price:roomForm.price,status:"available",studentId:null};
    setRooms(prev=>({...prev,[id]:newRoom}));
    alert(`Room ${id} created successfully!`);
    setRoomForm({blockCode:"",floor:1,num:1,ac:false,price:22000});
    setModal(null);
    // Save to MongoDB
    api.createRoom(newRoom).catch(err=>console.error('Room create error:',err));
  };

  const updateRoom=(id,updates)=>{
    const updated={...rooms[id],...updates};
    setRooms(prev=>({...prev,[id]:updated}));
    setEditRoom(null);
    alert("Room updated!");
    // Save to MongoDB
    api.updateRoom(id,updates).catch(err=>console.error('Room update error:',err));
  };

  const deleteRoom=(id)=>{
    if(confirm("Are you sure?")) {
      setRooms(prev=>{const r={...prev};delete r[id];return r;});
      alert("Room deleted!");
      // Delete from MongoDB
      api.deleteRoom(id).catch(err=>console.error('Room delete error:',err));
    }
  };

  return(
    <div className="fade">
      <div style={{marginBottom:16,padding:"14px",borderRadius:13,background:`${C.card}`,border:`1px solid ${C.border}`}}>
        <div style={{fontSize:11,fontWeight:700,marginBottom:10,color:C.muted,textTransform:"uppercase",letterSpacing:".08em"}}>Infrastructure Management</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <button className="btn btn-primary" style={{display:"flex",alignItems:"center",gap:6}} onClick={()=>setModal("block")}>
            <span>➕</span> Add Block
          </button>
          <button className="btn btn-primary" style={{display:"flex",alignItems:"center",gap:6}} onClick={()=>setModal("floor")}>
            <span>🏗️</span> Add Floor
          </button>
          <button className="btn btn-primary" style={{display:"flex",alignItems:"center",gap:6}} onClick={()=>setModal("room")}>
            <span>🚪</span> Add Room
          </button>
          <button className="btn btn-ghost" style={{display:"flex",alignItems:"center",gap:6}} onClick={()=>setModal("manage")}>
            <span>✏️</span> Manage Rooms
          </button>
        </div>
      </div>

      <div className="card" style={{marginBottom:16}}>
        <div className="card-title">🏢 Hostel Blocks</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
          {blocks.map(b=>(
            <div key={b.id} style={{padding:"16px",borderRadius:11,background:"rgba(56,189,248,.06)",border:`1px solid ${C.border}`,transition:"all .15s",cursor:"pointer"}}
              onClick={()=>setSelectedBlock(b)}
              onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(56,189,248,.4)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:10}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700}}>{b.name}</div>
                  <div style={{fontSize:10,color:C.muted,marginTop:2}}>Code: <span className="mono" style={{fontWeight:600}}>{b.code}</span></div>
                </div>
                <div style={{fontSize:18}}>🏘️</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                <div style={{padding:"8px",borderRadius:8,background:"rgba(56,189,248,.1)"}}>
                  <div style={{fontSize:9,color:C.muted,textTransform:"uppercase"}}>Floors</div>
                  <div className="mono" style={{fontSize:14,fontWeight:600,color:C.accent}}>{b.numFloors}</div>
                </div>
                <div style={{padding:"8px",borderRadius:8,background:"rgba(45,212,191,.1)"}}>
                  <div style={{fontSize:9,color:C.muted,textTransform:"uppercase"}}>Rooms</div>
                  <div className="mono" style={{fontSize:14,fontWeight:600,color:C.teal}}>{b.rooms}</div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" style={{width:"100%"}} onClick={(e)=>{e.stopPropagation();setSelectedBlock(b)}}>View Details →</button>
            </div>
          ))}
          <div style={{padding:"16px",borderRadius:11,border:`2px dashed ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .15s",minHeight:150}}
            onClick={()=>setModal("block")}
            onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(56,189,248,.5)"}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:24,marginBottom:6}}>➕</div>
              <div style={{fontSize:12,fontWeight:600}}>Add Block</div>
              <div style={{fontSize:9,color:C.muted,marginTop:3}}>Create new block</div>
            </div>
          </div>
        </div>
      </div>

      <div className="leg-row">
        <div className="leg"><div className="leg-d" style={{background:"rgba(52,211,153,.5)"}}/>Non-AC</div>
        <div className="leg"><div className="leg-d" style={{background:"rgba(56,189,248,.5)"}}/>AC</div>
        <div className="leg"><div className="leg-d" style={{background:"rgba(248,113,113,.4)"}}/>Occupied</div>
        <div className="leg"><div className="leg-d" style={{background:"rgba(100,116,139,.3)"}}/>Maintenance</div>
        <div style={{marginLeft:"auto",fontSize:10,color:C.muted}}>Click tile to toggle maintenance</div>
      </div>

      {!selectedBlock?(
        <div className="card" style={{marginBottom:16}}>
          <div className="card-title">Select Block</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
            {blocks.map(b=>(
              <div key={b.id} style={{padding:"14px",borderRadius:11,border:`2px solid ${C.border}`,background:"rgba(56,189,248,.04)",cursor:"pointer",transition:"all .2s"}}
                onClick={()=>setSelectedBlock(b)}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(56,189,248,.5)";e.currentTarget.style.background="rgba(56,189,248,.1)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background="rgba(56,189,248,.04)"}}>
                <div style={{fontSize:13,fontWeight:700,marginBottom:6}}>{b.name}</div>
                <div style={{fontSize:10,color:C.muted,marginBottom:8}}>Code: <span className="mono">{b.code}</span></div>
                <div style={{display:"flex",gap:8}}>
                  <div style={{fontSize:10,color:C.accent}}>🏗️ {b.numFloors} Floors</div>
                  <div style={{fontSize:10,color:C.teal}}>🚪 {b.rooms} Rooms</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ):(
        <>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,padding:"14px",borderRadius:11,background:`${C.card}`,border:`1px solid ${C.border}`}}>
            <button className="btn btn-ghost btn-sm" onClick={()=>{setSelectedBlock(null);setSelectedFloor(1);}}>← Back to Blocks</button>
            <div style={{fontSize:12,color:C.muted}}>Selected: <span style={{color:C.accent,fontWeight:600}}>{selectedBlock.name}</span></div>
            <div style={{marginLeft:"auto",fontSize:11,color:C.muted}}>Select a floor below</div>
          </div>

          <div className="tabs" style={{marginBottom:14}}>
            {Array.from({length:selectedBlock.numFloors},(v,i)=>i+1).map(f=>(
              <div key={f} className={`tab ${selectedFloor===f?"active":""}`} onClick={()=>setSelectedFloor(f)}>Floor {f}</div>
            ))}
          </div>

          <div className="card" style={{marginBottom:16}}>
            <div style={{marginBottom:9,display:"flex",justifyContent:"space-between",fontSize:12,color:C.muted}}>
              <span>{selectedBlock.name} • Floor {selectedFloor}</span>
              <span>{fr.filter(r=>r.status==="available").length} available · {fr.filter(r=>r.status==="occupied").length} occupied</span>
            </div>
            <div className="rooms-wrap">
              {fr.length===0?(
                <div style={{width:"100%",padding:"20px",textAlign:"center",color:C.muted,fontSize:12}}>No rooms on this floor yet</div>
              ):(
                fr.map(r=>{
                  let cls="room-tile ";
                  if(r.status==="occupied") cls+="rt-occ";
                  else if(r.status==="maintenance") cls+="rt-maint";
                  else cls+=r.ac?"av-ac":"av-nonac";
                  return(
                    <div key={r.id} className={cls} onClick={()=>toggle(r.id)}>
                      <div className="rnum" style={{color:r.status==="occupied"?C.red:r.status==="maintenance"?C.muted:r.ac?C.accent:C.green}}>{String(r.num).padStart(2,"0")}</div>
                      <div className="aclbl" style={{color:r.ac?C.accent:C.green}}>{r.ac?"AC":"—"}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-title">{selectedBlock.name} • Floor {selectedFloor} Details</div>
            <table className="tbl">
              <thead><tr><th>ID</th><th>No.</th><th>Type</th><th>Fee/sem</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {fr.map(r=>(
                  <tr key={r.id}>
                    <td><span className="chip chip-b mono" style={{fontSize:10}}>{r.id}</span></td>
                    <td className="mono" style={{fontSize:11}}>{String(r.num).padStart(2,"0")}</td>
                    <td>{r.ac?<span className="chip chip-t">🌬️ AC</span>:<span style={{color:C.green,fontSize:11}}>🪟 Non-AC</span>}</td>
                    <td className="mono" style={{color:C.gold,fontSize:11}}>{fmt(r.price)}</td>
                    <td><SBadge s={r.status}/></td>
                    <td>{r.status!=="occupied"&&<button className={`btn btn-sm ${r.status==="maintenance"?"btn-success":"btn-warn"}`} onClick={()=>toggle(r.id)}>{r.status==="maintenance"?"Set Available":"Maintenance"}</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {modal==="block"&&(
        <div className="overlay" onClick={()=>setModal(null)}>
          <div className="modal fade" onClick={e=>e.stopPropagation()}>
            <div className="modal-hd">Add New Block <span className="cls" onClick={()=>setModal(null)}>×</span></div>
            <div style={{display:"flex",flexDirection:"column",gap:11}}>
              <div className="fg"><label className="fl">Block Name</label><input className="fi" placeholder="e.g., North Wing" value={blockForm.name} onChange={e=>setBlockForm({...blockForm,name:e.target.value})}/></div>
              <div className="fg"><label className="fl">Block Code</label><input className="fi" placeholder="e.g., NW" value={blockForm.code} onChange={e=>setBlockForm({...blockForm,code:e.target.value.toUpperCase()})}/></div>
              <div className="fg"><label className="fl">Number of Floors</label><input className="fi" type="number" value={blockForm.numFloors} onChange={e=>setBlockForm({...blockForm,numFloors:parseInt(e.target.value)||5})}/></div>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <button className="btn btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={addBlock}>Create Block</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal==="floor"&&(
        <div className="overlay" onClick={()=>setModal(null)}>
          <div className="modal fade" onClick={e=>e.stopPropagation()}>
            <div className="modal-hd">Add New Floor <span className="cls" onClick={()=>setModal(null)}>×</span></div>
            <div style={{display:"flex",flexDirection:"column",gap:11}}>
              <div className="fg"><label className="fl">Block Code</label><input className="fi" placeholder="e.g., NW" value={floorForm.blockCode} onChange={e=>setFloorForm({...floorForm,blockCode:e.target.value.toUpperCase()})}/></div>
              <div className="fg"><label className="fl">Floor Number</label><input className="fi" type="number" value={floorForm.floorNum} onChange={e=>setFloorForm({...floorForm,floorNum:parseInt(e.target.value)||1})}/></div>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <button className="btn btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={addFloor}>Add Floor</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal==="room"&&(
        <div className="overlay" onClick={()=>setModal(null)}>
          <div className="modal fade" onClick={e=>e.stopPropagation()}>
            <div className="modal-hd">Add New Room <span className="cls" onClick={()=>setModal(null)}>×</span></div>
            <div style={{display:"flex",flexDirection:"column",gap:11}}>
              <div className="fg"><label className="fl">Block Code</label><input className="fi" placeholder="e.g., NW" value={roomForm.blockCode} onChange={e=>setRoomForm({...roomForm,blockCode:e.target.value.toUpperCase()})}/></div>
              <div className="f2">
                <div className="fg"><label className="fl">Floor</label><input className="fi" type="number" value={roomForm.floor} onChange={e=>setRoomForm({...roomForm,floor:parseInt(e.target.value)||1})}/></div>
                <div className="fg"><label className="fl">Room Number</label><input className="fi" type="number" value={roomForm.num} onChange={e=>setRoomForm({...roomForm,num:parseInt(e.target.value)||1})}/></div>
              </div>
              <div className="f2">
                <div className="fg"><label className="fl">Type</label>
                  <select className="fi" value={roomForm.ac?"AC":"NonAC"} onChange={e=>setRoomForm({...roomForm,ac:e.target.value==="AC"})}>
                    <option>NonAC</option>
                    <option>AC</option>
                  </select>
                </div>
                <div className="fg"><label className="fl">Fee/Semester</label><input className="fi" type="number" value={roomForm.price} onChange={e=>setRoomForm({...roomForm,price:parseInt(e.target.value)||22000})}/></div>
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <button className="btn btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={addRoom}>Create Room</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal==="manage"&&(
        <div className="overlay" onClick={()=>setModal(null)}>
          <div className="modal fade" onClick={e=>e.stopPropagation()} style={{width:650,maxHeight:"85vh"}}>
            <div className="modal-hd">Manage Room <span className="cls" onClick={()=>setModal(null)}>×</span></div>
            {!editRoom?(
              <div style={{maxHeight:"70vh",overflowY:"auto"}}>
                <div style={{fontSize:11,color:C.muted,marginBottom:12}}>Select a room from Floor {floor} to edit or delete</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {fr.map(r=>(
                    <div key={r.id} style={{padding:"12px",borderRadius:9,border:`1px solid ${C.border}`,background:"rgba(255,255,255,.03)",cursor:"pointer",transition:"all .15s"}} 
                      onClick={()=>setEditRoom(r)}
                      onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(56,189,248,.3)"}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                      <div style={{fontSize:12,fontWeight:700}}>{r.id}</div>
                      <div style={{fontSize:10,color:C.muted,marginTop:3}}>{r.ac?"🌬️ AC":"🪟 Non-AC"} • {fmt(r.price)}</div>
                      <div style={{fontSize:10,marginTop:4}}><SBadge s={r.status}/></div>
                    </div>
                  ))}
                </div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:11}}>
                <div style={{fontSize:12,fontWeight:600,color:C.accent}}>Room: {editRoom.id}</div>
                <div className="fg"><label className="fl">Price/Semester</label><input className="fi" type="number" value={editRoom.price} onChange={e=>setEditRoom({...editRoom,price:parseInt(e.target.value)||22000})}/></div>
                <div className="fg"><label className="fl">Status</label>
                  <select className="fi" value={editRoom.status} onChange={e=>setEditRoom({...editRoom,status:e.target.value})}>
                    <option>available</option>
                    <option>occupied</option>
                    <option>maintenance</option>
                  </select>
                </div>
                <div style={{padding:12,borderRadius:9,background:"rgba(248,113,113,.08)",border:`1px solid rgba(248,113,113,.2)`}}>
                  <div style={{fontSize:10,color:C.red,fontWeight:700,marginBottom:8}}>⚠️ Danger Zone</div>
                  <button className="btn btn-danger btn-sm" onClick={()=>deleteRoom(editRoom.id)}>Delete Room</button>
                </div>
                <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                  <button className="btn btn-ghost" onClick={()=>setEditRoom(null)}>Back</button>
                  <button className="btn btn-primary" onClick={()=>updateRoom(editRoom.id,{price:editRoom.price,status:editRoom.status})}>Save Changes</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── COMPLAINTS ────────────────────────────────────────────────────────────────
function Complaints({complaints,setComplaints,user}){
  const [filter,setFilter]=useState("all");
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({category:"Maintenance",title:"",desc:"",priority:"medium"});
  const isStu=user.role==="student";

  const shown=isStu?complaints.filter(c=>c.studentId===user.id)
    :filter==="all"?complaints:complaints.filter(c=>c.status===filter);

  const add=()=>{
    if(!form.title) return;
    const newComplaint={id:Date.now(),studentId:user.id,studentName:user.name,roomId:user.roomId||"—",...form,status:"pending",date:new Date().toISOString().slice(0,10)};
    setComplaints(prev=>[...prev,newComplaint]);
    setForm({category:"Maintenance",title:"",desc:"",priority:"medium"});
    setModal(false);
    // Save to MongoDB
    api.createComplaint(newComplaint).catch(err=>console.error('Complaint save error:',err));
  };

  const upd=(id,s)=>{
    setComplaints(prev=>prev.map(c=>c.id===id?{...c,status:s}:c));
    // Save to MongoDB
    api.updateComplaint(id,{status:s}).catch(err=>console.error('Complaint update error:',err));
  };

  return(
    <div className="fade">
      <div className="shd">
        {!isStu&&<div className="tabs">
          {[["all","All"],["pending","Pending"],["in-progress","In Progress"],["resolved","Resolved"]].map(([k,l])=>(
            <div key={k} className={`tab ${filter===k?"active":""}`} onClick={()=>setFilter(k)}>{l}</div>
          ))}
        </div>}
        {isStu&&<div style={{fontSize:12,color:C.muted}}>Your submitted complaints</div>}
        <button className="btn btn-primary" onClick={()=>setModal(true)}>+ New</button>
      </div>
      <div style={{marginTop:12}}>
        {shown.length===0?<div className="card"><div className="empty"><div className="empty-ico">✅</div>No complaints</div></div>
        :shown.map(c=>(
          <div key={c.id} style={{padding:"14px",borderRadius:11,border:`1px solid ${C.border}`,background:"rgba(255,255,255,.02)",marginBottom:9,transition:"border-color .15s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(56,189,248,.2)"}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7}}>
              <div><div style={{fontWeight:700,fontSize:13.5}}>{c.title}</div><div style={{fontSize:10.5,color:C.muted,marginTop:2}}>{c.studentName} · {c.roomId} · {c.category} · {c.date}</div></div>
              <div style={{display:"flex",gap:5}}><SBadge s={c.priority==="high"?"overdue":c.priority==="medium"?"pending":"b-muted"}/><SBadge s={c.status}/></div>
            </div>
            <div style={{fontSize:12.5,color:C.muted,lineHeight:1.6}}>{c.desc}</div>
            {!isStu&&c.status!=="resolved"&&(
              <div style={{marginTop:9,display:"flex",gap:7}}>
                {c.status==="pending"&&<button className="btn btn-ghost btn-sm" onClick={()=>upd(c.id,"in-progress")}>In Progress</button>}
                <button className="btn btn-success btn-sm" onClick={()=>upd(c.id,"resolved")}>Resolve</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {modal&&(
        <div className="overlay" onClick={()=>setModal(false)}>
          <div className="modal fade" onClick={e=>e.stopPropagation()}>
            <div className="modal-hd">New Complaint <span className="cls" onClick={()=>setModal(false)}>×</span></div>
            <div style={{display:"flex",flexDirection:"column",gap:11}}>
              <div className="fg"><label className="fl">Title</label><input className="fi" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
              <div className="f2">
                <div className="fg"><label className="fl">Category</label>
                  <select className="fi" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                    {["Maintenance","Electrical","Plumbing","Housekeeping","Network","AC/Cooling","Other"].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="fg"><label className="fl">Priority</label>
                  <select className="fi" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="fg"><label className="fl">Description</label><textarea className="fi" rows={3} style={{resize:"vertical"}} value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})}/></div>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:9}}>
              <button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={add}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PAYMENTS PAGE ─────────────────────────────────────────────────────────────
function PaymentsPage({payments,setPayments,students,user,rooms}){
  const [tab,setTab]=useState("history");
  const isAdmin=user.role==="admin";
  const me=students.find(s=>s.id===user.id)||user;
  const myRoom=me?.roomId?rooms[me.roomId]:null;
  const shown=isAdmin?payments:payments.filter(p=>p.studentId===user.id);
  const rev=shown.filter(p=>p.status==="success").reduce((s,p)=>s+p.amount,0);

  const downloadPayments=()=>{
    const headers=["Txn ID","Student","Room","Method","Amount","Date","Status"];
    const rows=shown.slice().reverse().map(p=>[
      p.id,
      p.studentName,
      p.roomId||"—",
      p.method,
      p.amount,
      p.date,
      p.status
    ]);
    
    let csv="data:text/csv;charset=utf-8,";
    csv+=headers.join(",")+"\n";
    rows.forEach(row=>csv+=row.join(",")+"\n");
    
    const link=document.createElement("a");
    link.setAttribute("href",encodeURI(csv));
    link.setAttribute("download",`payments_${new Date().toISOString().slice(0,10)}.csv`);
    link.click();
  };

  return(
    <div className="fade">
      <div className="g3" style={{marginBottom:18}}>
        {[
          {ico:"✅",l:"Total Collected",v:fmt(rev),col:C.green,bg:"rgba(52,211,153,.1)"},
          {ico:"📋",l:"Transactions",v:shown.length,col:C.accent,bg:"rgba(56,189,248,.1)"},
          {ico:"⏳",l:"Pending",v:shown.filter(p=>p.status==="pending").length,col:C.gold,bg:"rgba(251,191,36,.1)"},
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div className="stat-ico" style={{background:s.bg}}>{s.ico}</div>
            <div className="stat-val mono">{s.v}</div>
            <div className="stat-lbl">{s.l}</div>
          </div>
        ))}
      </div>

      {!isAdmin&&(
        <div className="tabs" style={{marginBottom:16}}>
          {[["history","History"],["pay","Make Payment"]].map(([k,l])=>(
            <div key={k} className={`tab ${tab===k?"active":""}`} onClick={()=>setTab(k)}>{l}</div>
          ))}
        </div>
      )}

      {(isAdmin||tab==="history")&&(
        <div className="card">
          <div className="card-title">
            Transaction History
            <button className="btn btn-ghost btn-sm" onClick={downloadPayments} style={{display:"flex",alignItems:"center",gap:6}}>
              <span>📥</span> Download CSV
            </button>
          </div>
          <table className="tbl">
            <thead><tr><th>Txn ID</th><th>Student</th><th>Room</th><th>Method</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {shown.length===0?<tr><td colSpan={7}><div className="empty"><div className="empty-ico">💳</div>No transactions</div></td></tr>
              :shown.slice().reverse().map(p=>(
                <tr key={p.id}>
                  <td><span className="mono" style={{fontSize:10,color:C.muted}}>{p.id}</span></td>
                  <td style={{fontSize:12.5}}>{p.studentName}</td>
                  <td><span className="chip chip-t" style={{fontSize:10}}>{p.roomId||"—"}</span></td>
                  <td><span className="chip chip-b">{p.method}</span></td>
                  <td><span className="mono" style={{fontWeight:700,color:C.green}}>{fmt(p.amount)}</span></td>
                  <td style={{fontSize:11,color:C.muted}}>{p.date}</td>
                  <td><SBadge s={p.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isAdmin&&tab==="pay"&&(
        <div className="card">
          <div className="card-title">Make a Payment</div>
          {myRoom?(
            <PayModal room={myRoom} user={user} standalone={true} onClose={()=>{}} onSuccess={(txn)=>setPayments(prev=>[...prev,txn])}/>
          ):(
            <div className="empty"><div className="empty-ico">🏠</div>Book a room first</div>
          )}
        </div>
      )}
    </div>
  );
}

// ── STAFF PAGE ────────────────────────────────────────────────────────────────
function StaffOverview({rooms,complaints,user}){
  const vals=Object.values(rooms);
  return(
    <div className="fade">
      <div className="ibox ibox-i" style={{marginBottom:16}}>👋 Welcome, {user.name} — {user.dept} Department</div>
      <div className="stats-grid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        {[
          {ico:"⚠️",l:"Open Complaints",v:complaints.filter(c=>c.status!=="resolved").length,col:C.gold,bg:"rgba(251,191,36,.1)"},
          {ico:"🔧",l:"Maintenance",v:vals.filter(r=>r.status==="maintenance").length,col:C.red,bg:"rgba(248,113,113,.1)"},
          {ico:"✅",l:"Resolved Today",v:complaints.filter(c=>c.status==="resolved").length,col:C.green,bg:"rgba(52,211,153,.1)"},
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div className="stat-ico" style={{background:s.bg}}>{s.ico}</div>
            <div className="stat-val mono">{s.v}</div>
            <div className="stat-lbl">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── NAV CONFIG ────────────────────────────────────────────────────────────────
const NAV={
  admin:[{id:"dashboard",ico:"📊",l:"Dashboard"},{id:"students",ico:"👥",l:"Students"},{id:"rooms",ico:"🏠",l:"Rooms (300)"},{id:"complaints",ico:"⚠️",l:"Complaints"},{id:"payments",ico:"💰",l:"Payments"}],
  staff:[{id:"dashboard",ico:"📊",l:"Overview"},{id:"complaints",ico:"⚠️",l:"Complaints"},{id:"rooms",ico:"🏠",l:"Room Status"}],
  student:[{id:"dashboard",ico:"🏠",l:"My Dashboard"},{id:"rooms",ico:"🛏️",l:"Book a Room"},{id:"complaints",ico:"⚠️",l:"My Complaints"},{id:"payments",ico:"💳",l:"Payments"}],
};
const RBADGE={admin:"r-admin",staff:"r-staff",student:"r-student"};
const PT={dashboard:"Dashboard",students:"Students",rooms:"Rooms",complaints:"Complaints",payments:"Payments"};

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App(){
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [rooms,setRooms]=useState({});
  const [students,setStudents]=useState([]);
  const [complaints,setComplaints]=useState([]);
  const [payments,setPayments]=useState([]);
  const [loading,setLoading]=useState(true);

  // Load data from MongoDB on app start
  useEffect(()=>{
    const loadData=async()=>{
      try {
        setLoading(true);
        
        // Load rooms
        const roomsData=await api.getRooms();
        if(roomsData.length===0) {
          // Initialize rooms if database is empty
          const newRooms=genRooms();
          const roomsArray=Object.values(newRooms);
          await Promise.all(roomsArray.map(r=>api.createRoom(r)));
          setRooms(newRooms);
        } else {
          setRooms(toObj(roomsData));
        }
        
        // Load students
        const studentsData=await api.getUsers();
        if(studentsData.length===0) {
          // Initialize users if database is empty
          await Promise.all(USERS.students.map(s=>api.createUser(s)));
          setStudents(USERS.students);
        } else {
          setStudents(studentsData);
        }
        
        // Load payments
        const paymentsData=await api.getPayments();
        setPayments(paymentsData.length>0?paymentsData:SEED_PAYMENTS);
        
        // Load complaints
        const complaintsData=await api.getComplaints();
        setComplaints(complaintsData.length>0?complaintsData:SEED_COMPLAINTS);
        
      } catch(err) {
        console.error('Error loading data:',err);
        // Fallback to local data if backend is down
        setRooms(genRooms());
        setStudents(USERS.students);
        setPayments(SEED_PAYMENTS);
        setComplaints(SEED_COMPLAINTS);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  },[]);

  if(loading) return <div className="fade" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}><div style={{fontSize:14,color:C.muted}}>Loading...</div></div>;
  if(!user) return <Login onLogin={(u)=>{setUser(u);setPage("dashboard");}}/>;

  const nav=NAV[user.role]||[];

  const subs={
    dashboard:user.role==="student"?`Welcome, ${user.name.split(" ")[0]}!`:`${Object.values(rooms).filter(r=>r.status==="available").length} rooms available`,
    students:`${students.length} registered`,
    rooms:`5 floors · 300 rooms · ${Object.values(rooms).filter(r=>r.status==="available").length} available`,
    complaints:`${complaints.filter(c=>c.status!=="resolved").length} open`,
    payments:`${payments.filter(p=>p.status==="success").length} transactions`,
  };

  const render=()=>{
    if(page==="dashboard"){
      if(user.role==="student") return <StudentDash user={user} students={students} rooms={rooms} complaints={complaints} payments={payments}/>;
      if(user.role==="staff") return <StaffOverview rooms={rooms} complaints={complaints} user={user}/>;
      return <AdminDash rooms={rooms} students={students} complaints={complaints} payments={payments}/>;
    }
    if(page==="students"&&user.role==="admin") return <AdminStudents students={students} setStudents={setStudents}/>;
    if(page==="rooms"){
      if(user.role==="student") return <RoomSelector rooms={rooms} user={user} setUser={setUser} students={students} setStudents={setStudents} payments={payments} setPayments={setPayments} setRooms={setRooms}/>;
      return <AdminRooms rooms={rooms} setRooms={setRooms}/>;
    }
    if(page==="complaints") return <Complaints complaints={complaints} setComplaints={setComplaints} user={user}/>;
    if(page==="payments") return <PaymentsPage payments={payments} setPayments={setPayments} students={students} user={user} rooms={rooms}/>;
    return null;
  };

  return(
    <div className="layout">
      <style>{css}</style>
      <aside className="sidebar">
        <div className="sb-brand">
          <div className="sb-logo">🏛️</div>
          <div className="sb-name">HostelMS Pro</div>
          <div className="sb-sub">Smart Hostel System</div>
          <div className={`sb-rbadge ${RBADGE[user.role]}`}>{user.role}</div>
        </div>
        <nav className="nav-sec">
          <div className="nav-glbl">Menu</div>
          {nav.map(n=>(
            <div key={n.id} className={`nav-item ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
              <span className="nav-ico">{n.ico}</span>{n.l}
            </div>
          ))}
        </nav>
        <div className="sb-foot">
          <div className="user-row">
            <div className="av" style={{background:avc(user.name)}}>{ini(user.name)}</div>
            <div style={{flex:1,minWidth:0}}>
              <div className="uname">{user.name}</div>
              <div className="urole">{user.role==="admin"?"Warden":user.role==="staff"?(user.dept||"Staff"):(user.rollNo||"Student")}</div>
            </div>
          </div>
          <button className="btn btn-danger" style={{width:"100%",marginTop:9,fontSize:11.5}} onClick={()=>{setUser(null);setPage("dashboard");}}>Sign Out</button>
        </div>
      </aside>
      <main className="main-area">
        <div className="topbar">
          <div>
            <div className="ptitle">{PT[page]||page}</div>
            <div className="psub">{subs[page]}</div>
          </div>
          <div className="tbar-r">
            <div className="notif">🔔<div className="ndot"/></div>
            <div className="mono" style={{fontSize:10.5,color:C.muted}}>{new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</div>
          </div>
        </div>
        <div className="content">{render()}</div>
      </main>
    </div>
  );
}
