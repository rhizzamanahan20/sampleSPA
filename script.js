const catalog={
'Specialized':[['Signature',[550,750,950]],['Shiatsu / Dry',[550,750,950]],['Hilot',[500,700,900]],['Deep Tissue',[500,700,900]],['Foot Reflex',[500,650,800]],['Combination',[500,650,800]],['Swedish',[400,550,700]]],
'Therapeutic':[['Frozen Shoulder',[500,700,900]],['Sciatica Treatment',[550,700,900]],['Lymphatic Drainage',[550,750,950]],['Hotstone',[550,700,850]],['Ventosa',[550,700,850]]],
'Mom & Baby':[['Prenatal',[500,700,900]],['Postnatal',[500,700,900]],['Postnatal + Lactation',[700,900,1100]],['Kiddie (12 years old and below)',[350,450,null]]],
'Body Care':[['Body Scrub',500],['Ear Candling',200],['Foot Spa',400],['Paraffin Hand',400],['Paraffin Foot',300],['Paraffin (Hand & Foot)',500]],
'Upgrades':[['Ventosa Therapy',200],['Hotstone Therapy',200],['Hot Pack / Hot Compress',100],['Kiddie 30 mins',250],['Focus Massage 30 mins (Leg/Head/Hand/Back/Foot)',250]]};
const durations=['1 hour','1.5 hours','2 hours'];const serviceSelect=document.getElementById('serviceSelect'),durationSelect=document.getElementById('durationSelect');
const prices={};Object.entries(catalog).forEach(([category,items])=>items.forEach(([name,rate])=>{prices[name]=rate;const opt=new Option(category+' — '+name,name);serviceSelect.add(opt)}));
function refreshDuration(){durationSelect.innerHTML='<option value="">Select duration or option</option>';const price=prices[serviceSelect.value];if(price===undefined)return;if(Array.isArray(price)){price.forEach((cost,i)=>{if(cost!==null)durationSelect.add(new Option(durations[i]+' · ₱'+cost,durations[i]))})}else durationSelect.add(new Option('Single service · ₱'+price,'Single service'));if(durationSelect.options.length===2)durationSelect.selectedIndex=1}
serviceSelect.addEventListener('change',refreshDuration);
function renderCategory(category){const container=document.getElementById('serviceItems');container.classList.remove('reveal');void container.offsetWidth;container.classList.add('reveal');container.innerHTML='';catalog[category].forEach(([name,rate])=>{const item=document.createElement('button');item.type='button';item.className='price-item';const pricesText=Array.isArray(rate)?rate.map((cost,i)=>cost===null?'':durations[i]+': ₱'+cost).filter(Boolean).join(' · '):'₱'+rate;const heading=document.createElement('strong');heading.textContent=name;const priceText=document.createElement('small');priceText.textContent=pricesText;item.append(heading,priceText);item.addEventListener('click',()=>{serviceSelect.value=name;refreshDuration();document.getElementById('booking').scrollIntoView({behavior:'smooth'});serviceSelect.focus({preventScroll:true})});container.append(item)})}
document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t===tab));renderCategory(tab.dataset.category)}));renderCategory('Specialized');
document.getElementById('year').textContent=new Date().getFullYear();document.getElementById('date').min=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
const menu=document.querySelector('.menu'),nav=document.getElementById('nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
const typeField=document.getElementById('appointmentType'),addressWrap=document.getElementById('addressWrap'),homeAddress=document.getElementById('homeAddress');typeField.addEventListener('change',()=>{const home=typeField.value==='Home Service';addressWrap.hidden=!home;homeAddress.required=home;if(!home)homeAddress.value=''});
const bookingForm=document.getElementById('bookingForm');
const bookingStatus=document.getElementById('bookingStatus');
const submitBooking=document.getElementById('submitBooking');
// Use a normal browser form submission instead of fetch/AJAX.
// This avoids AJAX/CORS/JSON errors and allows FormSubmit's activation and
// verification pages to display directly to the customer.
bookingForm.addEventListener('submit', event => {
  if (!bookingForm.reportValidity()) {
    event.preventDefault();
    return;
  }

  const data = new FormData(bookingForm);
  if (data.get('_honey')) {
    event.preventDefault();
    return;
  }

  const rate = prices[data.get('service')];
  const durationIndex = durations.indexOf(data.get('duration'));
  const cost = Array.isArray(rate) ? rate[durationIndex] : rate;
  document.getElementById('bookingPrice').value =
    cost == null ? 'Please confirm' : 'PHP ' + cost;
  document.getElementById('bookingTerms').value =
    data.get('type') === 'Home Service'
      ? 'PHP 100 transport fee; minimum 2 hours per therapist, shareable by two people'
      : 'Not applicable';

  bookingStatus.textContent = 'Opening the secure booking submission page…';
  submitBooking.disabled = true;
  submitBooking.textContent = 'Submitting…';
  // No preventDefault: the browser submits directly to FormSubmit.
  // Only FormSubmit can confirm acceptance; do not display a false success message.
});

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}}),{threshold:.08});document.querySelectorAll('.section,.feature,.service-items').forEach(el=>{el.classList.add('scroll-reveal');observer.observe(el)});
