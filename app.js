let ops=JSON.parse(localStorage.getItem("misAccionesOps")||"[]");let type="buy";
const €=n=>new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(n);
const num=id=>parseFloat(document.getElementById(id).value)||0;
function save(){localStorage.setItem("misAccionesOps",JSON.stringify(ops))}
function calc(){let map={};let fees=0,invested=0,sales=0;
 ops.forEach(o=>{fees+=o.fee;let m=map[o.ticker]??={ticker:o.ticker,company:o.company,shares:0,cost:0,last:0};
 if(o.type==="buy"){m.shares+=o.shares;m.cost+=o.shares*o.price+o.fee;invested+=o.shares*o.price+o.fee}
 else{m.shares-=o.shares;sales+=o.shares*o.price-o.fee}
 m.last=o.price});
 let arr=Object.values(map).filter(x=>x.shares>0);
 let value=arr.reduce((s,x)=>s+x.shares*x.last,0);let pnl=value-invested;
 document.getElementById("portfolioValue").textContent=€(value);document.getElementById("invested").textContent=€(invested);
 document.getElementById("pnl").textContent=€(pnl);document.getElementById("pnl").className=pnl>=0?"gain":"loss";
 document.getElementById("return").textContent=(invested?((pnl/invested)*100):0).toFixed(2)+" %";
 document.getElementById("return").className=pnl>=0?"gain":"loss";document.getElementById("fees").textContent=€(fees);
 document.getElementById("holdings").innerHTML=arr.length?arr.map(x=>`<div class="holding"><div><div class="ticker">${x.ticker}</div><div class="sub">${x.company||x.ticker}</div></div><div class="right"><b>${x.shares.toLocaleString("es-ES")} títulos</b><div class="sub">Precio: ${€(x.last)}</div></div></div>`).join(""):'<div class="empty">No tienes posiciones. Añade tu primera compra.</div>';
 document.getElementById("operations").innerHTML=ops.length?[...ops].sort((a,b)=>b.date.localeCompare(a.date)).map(o=>`<div class="op"><div><div class="ticker">${o.type==="buy"?"Compra":"Venta"} · ${o.ticker}</div><div class="sub">${o.date} · ${o.shares} títulos</div></div><div class="right"><b>${€(o.shares*o.price)}</b><div class="sub">Comisión ${€(o.fee)}</div></div></div>`).join(""):'<div class="empty">Todavía no hay operaciones.</div>';
}
function open(){document.getElementById("modal").classList.remove("hidden");document.getElementById("date").value=new Date().toISOString().slice(0,10)}
function close(){document.getElementById("modal").classList.add("hidden")}
document.getElementById("addBtn").onclick=open;document.getElementById("closeBtn").onclick=close;document.getElementById("refreshBtn").onclick=calc;
document.querySelectorAll(".seg button").forEach(b=>b.onclick=()=>{type=b.dataset.type;document.querySelectorAll(".seg button").forEach(x=>x.classList.remove("active"));b.classList.add("active")});
document.getElementById("saveBtn").onclick=()=>{let ticker=document.getElementById("ticker").value.trim().toUpperCase();if(!ticker||!num("shares")||!num("price"))return alert("Introduce ticker, acciones y precio.");
ops.push({id:crypto.randomUUID(),type,date:document.getElementById("date").value,ticker,company:document.getElementById("company").value.trim(),shares:num("shares"),price:num("price"),fee:num("fee"),currency:document.getElementById("currency").value});save();close();calc()};
calc();