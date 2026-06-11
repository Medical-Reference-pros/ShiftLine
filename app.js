
const KEY='shiftline_build2';

const DRUGS=[
{name:'Norepinephrine',cat:'vasopressor'},
{name:'Vasopressin',cat:'vasopressor'},
{name:'Epinephrine',cat:'vasopressor'},
{name:'Dopamine',cat:'vasopressor'},
{name:'Phenylephrine',cat:'vasopressor'},
{name:'Propofol',cat:'sedation'},
{name:'Precedex',cat:'sedation'},
{name:'Fentanyl',cat:'sedation'},
{name:'Versed',cat:'sedation'},
{name:'Morphine',cat:'sedation'},
{name:'Amiodarone',cat:'cardiac'},
{name:'Diltiazem',cat:'cardiac'},
{name:'Nicardipine',cat:'cardiac'},
{name:'Heparin',cat:'other'},
{name:'Insulin',cat:'other'}
];

let state={patients:[],activePatientId:null};

function load(){const d=localStorage.getItem(KEY);if(d)state=JSON.parse(d);}
function save(){localStorage.setItem(KEY,JSON.stringify(state));}
function patient(){return state.patients.find(x=>x.id===state.activePatientId);}

function renderTabs(){
 let c=document.getElementById('patientTabs'); c.innerHTML='';
 state.patients.forEach(p=>{
  let b=document.createElement('button');
  b.className='patient-tab'+(p.id===state.activePatientId?' active':'');
  b.textContent=p.room;
  b.onclick=()=>{state.activePatientId=p.id;save();render();};
  c.appendChild(b);
 });
}

function renderDrips(){
 const p=patient();
 const d=document.getElementById('dripList');
 d.innerHTML='';
 if(!p) return;
 p.drips=p.drips||[];
 p.drips.forEach((drip,i)=>{
  const div=document.createElement('div');
  div.className='drip '+drip.cat;
  div.innerHTML=`<b>${drip.name}</b><br>Dose: ${drip.dose}<br>
  <button onclick="removeDrip(${i})">Remove</button>`;
  d.appendChild(div);
 });
}

function render(){
 renderTabs();
 const p=patient();
 document.getElementById('patientTitle').textContent=p?p.room:'No Patient';
 document.getElementById('weightInput').value=p?.weightKg||'';
 renderDrips();
}

function removeDrip(i){
 const p=patient();
 p.drips.splice(i,1);
 save(); render();
}

document.getElementById('addDripBtn').onclick=()=>{
 document.getElementById('dripModal').classList.remove('hidden');
};

document.getElementById('closeModalBtn').onclick=()=>{
 document.getElementById('dripModal').classList.add('hidden');
};

const sel=document.getElementById('drugSelect');
DRUGS.forEach(d=>{
 let o=document.createElement('option');
 o.value=d.name;
 o.textContent=d.name;
 sel.appendChild(o);
});

document.getElementById('saveDripBtn').onclick=()=>{
 const p=patient();
 if(!p) return;
 p.drips=p.drips||[];
 const drug=DRUGS.find(x=>x.name===sel.value);
 p.drips.push({
  name:drug.name,
  cat:drug.cat,
  dose:document.getElementById('doseInput').value
 });
 save(); render();
 document.getElementById('dripModal').classList.add('hidden');
};

load();
render();
