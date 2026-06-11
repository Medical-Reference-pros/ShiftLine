
const KEY='shiftline_build2';
let state={disclaimerAccepted:false,nextPatientId:1,activePatientId:null,patients:[]};

function save(){
 document.getElementById('saveStatus').textContent='Saving...';
 localStorage.setItem(KEY,JSON.stringify(state));
 setTimeout(()=>document.getElementById('saveStatus').textContent='✓ Saved',300);
}
function load(){
 const d=localStorage.getItem(KEY);
 if(d) state=JSON.parse(d);
}
function currentPatient(){
 return state.patients.find(p=>p.id===state.activePatientId);
}
function renderTabs(){
 const c=document.getElementById('patientTabs');
 c.innerHTML='';
 state.patients.forEach(p=>{
  const b=document.createElement('button');
  b.className='patient-tab'+(p.id===state.activePatientId?' active':'');
  b.textContent=p.room;
  b.onclick=()=>{state.activePatientId=p.id;save();render();};
  c.appendChild(b);
 });
}
function render(){
 renderTabs();
 const p=currentPatient();
 document.getElementById('patientTitle').textContent=p?p.room:'No Patient Selected';
 document.getElementById('weightInput').value=p?.weightKg||'';
 document.getElementById('quickNote').value=p?.quickNote||'';
}
function addPatient(){
 const room=prompt('Room/Bed Identifier (412A, CV7, SICU4)');
 if(!room) return;
 if(!/^[A-Z0-9-]{1,8}$/i.test(room)){alert('Invalid identifier');return;}
 const p={id:state.nextPatientId++,room,weightKg:'',quickNote:''};
 state.patients.push(p);
 state.activePatientId=p.id;
 save();render();
}
document.getElementById('addPatientBtn').onclick=addPatient;

document.getElementById('deletePatientBtn').onclick=()=>{
 const p=currentPatient();
 if(!p) return;
 if(confirm('Archive '+p.room+'?')){
  state.patients=state.patients.filter(x=>x.id!==p.id);
  state.activePatientId=state.patients[0]?.id||null;
  save();render();
 }
};

document.getElementById('weightInput').oninput=(e)=>{
 const p=currentPatient(); if(!p) return;
 p.weightKg=e.target.value; save();
};
document.getElementById('quickNote').oninput=(e)=>{
 const p=currentPatient(); if(!p) return;
 p.quickNote=e.target.value; save();
};

document.getElementById('acceptBtn').onclick=()=>{
 state.disclaimerAccepted=true;
 save();
 document.getElementById('disclaimer').classList.add('hidden');
};

load();
if(!state.disclaimerAccepted){
 document.getElementById('disclaimer').classList.remove('hidden');
}
render();
