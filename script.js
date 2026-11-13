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
// Booking is sent through EmailJS; do not display success before it resolves.
bookingForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;
  const config = window.SPARADISE_EMAILJS || {};
  const ready = ['publicKey','serviceId','templateId'].every(key =>
    config[key] && !String(config[key]).startsWith('YOUR_'));
  if (!ready) {
    bookingStatus.textContent = 'Online booking is being configured. Please use Chat With Us on Facebook for now.';
    return;
  }
  if (!window.emailjs) {
    bookingStatus.textContent = 'Email service is temporarily unavailable. Please try again or chat with us.';
    return;
  }
  const data = new FormData(bookingForm);
  if (data.get('_honey')) return;
  const rate = prices[data.get('service')];
  const cost = Array.isArray(rate) ? rate[durations.indexOf(data.get('duration'))] : rate;
  const details = {
    'Customer name': data.get('name'),
    'Mobile number': data.get('phone'),
    'Appointment type': data.get('type'),
    'Home service address': data.get('type') === 'Home Service' ? data.get('address') : 'Not applicable',
    'Service': data.get('service'),
    'Duration': data.get('duration'),
    'Listed price': cost == null ? 'Please confirm' : 'PHP ' + cost,
    'Guests': data.get('guests'),
    'Date': data.get('date'),
    'Time': data.get('time'),
    'Special requests': data.get('notes') || 'None',
    'Home service terms': data.get('type') === 'Home Service'
      ? 'PHP 100 transportation fee; minimum 2 hours per therapist (shareable by two people)'
      : 'Not applicable'
  };
  const summary = Object.entries(details).map(([key, value]) => key + ': ' + value).join('\n');
  const params = {
    to_email: 'rhizza2020@gmail.com',
    customer_name: String(data.get('name')),
    customer_phone: String(data.get('phone')),
    booking_details: summary,
    subject: 'New Sparadise Booking Request — ' + data.get('name')
  };
  submitBooking.disabled = true;
  submitBooking.textContent = 'Sending request…';
  bookingStatus.textContent = 'Sending your booking request…';
  document.getElementById('bookingResult').hidden = true;
  try {
    await emailjs.send(config.serviceId, config.templateId, params, { publicKey: config.publicKey });
    document.getElementById('bookingSummary').textContent = summary;
    document.getElementById('bookingResult').hidden = false;
    bookingStatus.textContent = 'Booking request sent! Please wait for Sparadise to confirm your appointment.';
    bookingForm.reset();
    addressWrap.hidden = true;
    homeAddress.required = false;
    durationSelect.innerHTML = '<option value="">Select duration or option</option>';
    document.getElementById('bookingResult').scrollIntoView({behavior:'smooth',block:'center'});
  } catch (error) {
    console.error('EmailJS booking error:', error);
    bookingStatus.textContent = 'Booking was not sent (' + (error?.status || 'connection error') + '). Please check EmailJS settings or use Chat With Us.';
  } finally {
    submitBooking.disabled = false;
    submitBooking.textContent = 'Send Booking Request ↗';
  }
});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}}),{threshold:.08});document.querySelectorAll('.section,.feature,.service-items').forEach(el=>{el.classList.add('scroll-reveal');observer.observe(el)});
