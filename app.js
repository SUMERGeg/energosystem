'use strict';

const sourceURL = 'https://energosystemrus.ru/realizovannye-proekty';
const projects = [
  {id:'botanica',title:'ТЦ «Ботанический сад»',scope:'Архитектурное освещение фасада',year:'2024',place:'Москва',client:'ООО «АльфаСтрой»',image:'botanica.jpg',status:'completed',detail:'Архитектурно-художественное освещение фасада торгово-делового центра. На фотографии — реализованный объект из портфолио компании.'},
  {id:'bauman',title:'МГТУ им. Баумана',scope:'Освещение и обогрев купола',year:'2024',place:'Москва',client:'ООО «МонАрх»',image:'bauman-dome.jpg',status:'completed',detail:'Освещение и обогрев купола. В проекте показана работа с инженерными системами общественного здания.'},
  {id:'cinema',title:'Кинотеатр «Художественный»',scope:'Электрооборудование и архитектурное освещение',year:'2021',place:'Москва',client:'ПАО «Сбербанк»',image:'khudozhestvenny.webp',status:'completed',detail:'В опубликованной карточке проекта указаны системы ЭОМ и АХО — электрооборудование и архитектурно-художественное освещение.'},
  {id:'datacenter',title:'Центр обработки данных',scope:'Электрооборудование, СКС и системы МГН',year:'2024',place:'Москва',client:'ООО «МонАрх»',image:'data-center.png',status:'completed',detail:'В портфолио указаны системы ЭОМ, СКС и МГН. Отдельный пример инженерных работ на инфраструктурном объекте.'},
  {id:'bogorodsky',title:'ЖК «Богородский»',scope:'Электрооборудование, наружное освещение и сети',year:'2016–2017',place:'Щёлково',client:'ООО «КортРос»',image:'bogorodsky.webp',status:'completed',detail:'Корпуса 2, 16, 17 и 18. В опубликованном составе работ указаны системы ЭОМ, НО и ЭС.'},
  {id:'hotel',title:'Гостиничный комплекс',scope:'Электрооборудование и наружное освещение',year:'2019',place:'Москва, ул. Шереметьевская',client:'ООО «УкрРосМеталл»',image:'hotel-sheremetyevskaya.webp',status:'completed',detail:'Работы по электрооборудованию и наружному освещению гостиничного комплекса. Фотография и данные представлены в портфолио компании.'},
  {id:'prosecutor',title:'Прокуратура Москвы',scope:'Электрооборудование и электроосвещение',year:'2014',place:'Москва',client:'ООО «МонАрх»',image:'moscow-prosecutor.webp',status:'completed',detail:'В карточке объекта на сайте компании указана система ЭОМ.'},
  {id:'church',title:'Храм Архангела Михаила',scope:'Архитектурное освещение',year:'2015',place:'Краснознаменск',client:'ООО «НИСКОМ»',image:'archangel-church.webp',status:'completed',detail:'Архитектурное освещение храма. Состав работ указан в подписи исходной фотографии на сайте компании.'},
  {id:'khoroshevskoe',title:'ЖК «Хорошевское»',scope:'Электрооборудование, корпуса 1 и 18',year:'2020–2021',place:'Москва',client:'ООО «МонАрх»',image:'khoroshevskoe.webp',status:'progress',detail:'На исходном сайте этот проект отмечен «выполнение в процессе» за 2020–2021 годы. Актуальный этап работ не подтверждён. В прототипе сохранена исходная запись; перед публикацией рабочего сайта её необходимо актуализировать.'}
];
const clients = ['ПИК Группа','УкрРосМеталл','Сбербанк','ИнжКапСтрой','Лидер Инвест','КОРТРОС','МонАрх','Домстрой'];
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));

document.querySelector('#client-logos').innerHTML = clients.map((name,i) => `<div class="client-logo" title="${escapeHTML(name)}"><img src="assets/client-${i+1}.webp" alt="${escapeHTML(name)}" loading="lazy" width="120" height="55"></div>`).join('');
document.querySelector('#completed-count').textContent = projects.filter(p=>p.status==='completed').length;
document.querySelector('#progress-count').textContent = projects.filter(p=>p.status==='progress').length;

let filter = 'completed';
let expanded = false;
const projectGrid = document.querySelector('#project-grid');
const showMore = document.querySelector('#show-more');
const tabs = [...document.querySelectorAll('[data-filter]')];
function renderProjects() {
  const filtered = projects.filter(p=>p.status===filter);
  projectGrid.innerHTML = filtered.slice(0,expanded ? filtered.length : 6).map(p=>`<button class="project-card" data-project="${p.id}" aria-label="Подробнее о проекте ${escapeHTML(p.title)}"><div class="project-photo"><img src="assets/${p.image}" alt="${escapeHTML(p.title+' — '+p.scope)}" loading="lazy" width="640" height="400">${p.status==='progress'?'<span class="project-tag">В процессе · запись 2020–2021</span>':''}<span class="project-arrow" aria-hidden="true">↗</span></div><div class="project-meta"><span>${escapeHTML(p.place)}</span><span>${p.year}</span></div><h3>${escapeHTML(p.title)}</h3><p class="project-scope">${escapeHTML(p.scope)}</p><p class="project-client">Заказчик: ${escapeHTML(p.client)}</p></button>`).join('');
  projectGrid.setAttribute('aria-labelledby',filter==='completed'?'tab-completed':'tab-progress');
  document.querySelector('#status-note').hidden = filter !== 'progress';
  showMore.hidden = expanded || filtered.length<=6;
}
tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>{filter=tab.dataset.filter;expanded=false;tabs.forEach(t=>{t.setAttribute('aria-selected',String(t===tab));t.tabIndex=t===tab?0:-1;});renderProjects();});
  tab.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[next].focus();tabs[next].click();});
});
showMore.addEventListener('click',()=>{expanded=true;renderProjects();projectGrid.querySelectorAll('.project-card')[6]?.focus({preventScroll:true});});
renderProjects();

const dialog = document.querySelector('#project-dialog');
projectGrid.addEventListener('click',event=>{
  const card=event.target.closest('[data-project]');if(!card)return;
  const p=projects.find(p=>p.id===card.dataset.project);if(!p)return;
  document.querySelector('#dialog-content').innerHTML=`<img class="dialog-image" src="assets/${p.image}" alt="${escapeHTML(p.title)}"><div class="dialog-info"><div class="eyebrow">${p.status==='progress'?'Статус по исходному портфолио':'Реализованный проект'} · ${p.year}</div><h2 id="dialog-title">${escapeHTML(p.title)}</h2><p>${escapeHTML(p.detail)}</p><dl><div><dt>Состав работ</dt><dd>${escapeHTML(p.scope)}</dd></div><div><dt>Заказчик</dt><dd>${escapeHTML(p.client)}</dd></div><div><dt>Объект</dt><dd>${escapeHTML(p.place)}</dd></div><div><dt>Период в портфолио</dt><dd>${p.year}</dd></div></dl><a class="text-link" href="${sourceURL}" target="_blank" rel="noopener">Посмотреть в исходном портфолио ↗</a></div>`;
  dialog.showModal();document.body.classList.add('modal-open');
});
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));

const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#navigation');
function closeMenu(){navigation.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Открыть меню');}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');navigation.classList.toggle('open',open);});
navigation.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus();}});
window.matchMedia('(min-width: 801px)').addEventListener('change',event=>{if(event.matches)closeMenu();});

document.querySelectorAll('[data-object]').forEach(link=>link.addEventListener('click',()=>{document.querySelector('#object-select').value=link.dataset.object;}));
const form=document.querySelector('#contact-form');
const feedback=document.querySelector('#form-feedback');
form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const data=new FormData(form);const contact=String(data.get('contact')).trim();
  if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)||contact.replace(/\D/g,'').length>=8)){feedback.textContent='Укажите телефон с кодом или полный адрес электронной почты.';form.elements.contact.focus();return;}
  const subject='Обсуждение объекта'+(data.get('object')?' — '+data.get('object'):'');
  const body=`Добрый день!\n\nИмя: ${String(data.get('name')).trim()}\nКонтакт: ${contact}\nТип объекта: ${data.get('object')||'Не указан'}\n\nЗадача:\n${String(data.get('task')).trim()}\n\nПроект или ТЗ при необходимости приложу к письму.`;
  const href=`mailto:energosystemrus@yandex.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  feedback.replaceChildren();const text=document.createElement('span');text.textContent='Письмо подготовлено. Проверьте его и приложите файлы в почтовом клиенте. ';const link=document.createElement('a');link.href=href;link.textContent='Открыть письмо ↗';link.style.textDecoration='underline';feedback.append(text,link);
});

if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.08});document.querySelectorAll('.section-head,.clients-intro,.service,.company-heading').forEach(el=>{el.classList.add('reveal');observer.observe(el);});}
