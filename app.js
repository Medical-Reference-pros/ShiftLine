const STORAGE_KEY='shiftline_v2';
let state={disclaimerAccepted:false,activePatientId:null,nextPatientId:1,patients:[]};

function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
function load(){
 const d=localStorage.getItem(STORAGE_KEY);
 if(d) state=JSON.parse(d);
}
function renderPatients(){
 const c=document.getElementById('patientTabs');
 c.innerHTML='';
 state.patients.forEach(p=>{
   const b=document.createElement('button');
   b.textContent=p.room;
   b.onclick=()=>{state.activePatientId=p.id;save();renderPatients();renderCurrent();};
   c.appendChild(b);
 });
}
function renderCurrent(){
 const p=state.patients.find(x=>x.id===state.activePatientId);
 document.getElementById('patientTitle').textContent=p?p.room:'No Patient Selected';
}
function addPatient(){
 const room=prompt('Room/Bed Identifier (e.g. 412A)');
 if(!room) return;
 if(!/^[A-Z0-9-]{1,8}$/i.test(room)){alert('Invalid identifier');return;}
 const p={id:state.nextPatientId++,room};
 state.patients.push(p);
 state.activePatientId=p.id;
 save();renderPatients();renderCurrent();
}
document.getElementById('addPatientBtn').onclick=addPatient;
document.getElementById('acceptBtn').onclick=()=>{
 state.disclaimerAccepted=true; save();
 document.getElementById('disclaimer').classList.add('hidden');
};
load();
if(!state.disclaimerAccepted){document.getElementById('disclaimer').classList.remove('hidden');}
renderPatients(); renderCurrent();
