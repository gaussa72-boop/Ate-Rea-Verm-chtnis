/* Ate Rea – samtiger Vorleseraum. Nutzt die auf dem Gerät verfügbaren Stimmen. */
(()=> {
 if (window.__ateReaReaderInstalled) return; window.__ateReaReaderInstalled=true;
 const style=document.createElement('style');
 style.textContent=`
 .ate-reader{position:relative;z-index:4;display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:14px 18px;margin:22px auto 30px;max-width:1120px;background:linear-gradient(135deg,#171512ee,#0d0e0fee);border:1px solid #c7a65d66;box-shadow:0 12px 36px #0007;color:#e8d8b0;font:11px Manrope, sans-serif;letter-spacing:.04em}
 .ate-reader .reader-title{font:500 19px 'Cormorant Garamond',serif;color:#f2dfad;margin-right:auto}
 .ate-reader button,.ate-reader select{border:1px solid #b99a5b77;background:#111;color:#dfc98e;padding:9px 12px;font:inherit;cursor:pointer}
 .ate-reader button:hover{background:#282114}.ate-reader button:focus-visible,.ate-reader select:focus-visible{outline:2px solid #e8c77e;outline-offset:2px}
 .ate-reader select{max-width:190px}.ate-reader .reader-status{width:100%;color:#999184;font-size:10px}
 @media(max-width:620px){.ate-reader{margin:12px;padding:12px}.ate-reader .reader-title{width:100%}.ate-reader select{max-width:100%;flex:1}}
 `;
 document.head.appendChild(style);
 const main=document.querySelector('main')||document.body;
 const bar=document.createElement('section');bar.className='ate-reader';bar.setAttribute('aria-label','Vorlesefunktion');
 bar.innerHTML='<span class="reader-title">✧ Vorleseraum · Stimme des Lichtes</span><button type="button" data-action="play">▶ Vorlesen</button><button type="button" data-action="pause">Ⅱ Pause</button><button type="button" data-action="stop">■ Stop</button><label for="ate-voice">Stimme</label><select id="ate-voice" aria-label="Vorlesestimme"><option>Stimmen werden geladen …</option></select><span class="reader-status" aria-live="polite">Warme, ruhige Lesung · Deutsch · Tempo und Klang werden an die verfügbaren Stimmen deines Geräts angepasst.</span>';
 main.prepend(bar);
 const status=bar.querySelector('.reader-status'),select=bar.querySelector('select');
 let voices=[],utterance=null;
 function loadVoices(){
   voices=window.speechSynthesis? speechSynthesis.getVoices().filter(v=>/^de(-|_)/i.test(v.lang)):[];
   select.innerHTML='';
   if(!voices.length){const o=document.createElement('option');o.textContent='Systemstimme Deutsch';o.value='';select.append(o);return;}
   voices.sort((a,b)=>((/female|natural|premium|neural|online/i.test(b.name)?1:0)-(/female|natural|premium|neural|online/i.test(a.name)?1:0)));
   voices.forEach((v,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=v.name+' · '+v.lang;select.append(o)});
 }
 loadVoices();if(window.speechSynthesis)speechSynthesis.onvoiceschanged=loadVoices;
 function textToRead(){
   const clone=main.cloneNode(true);
   clone.querySelectorAll('.ate-reader,button,nav,header,footer,script,style,[aria-hidden="true"]').forEach(e=>e.remove());
   return (clone.innerText||clone.textContent||'').replace(/\s+/g,' ').trim();
 }
 function stop(){if(window.speechSynthesis)speechSynthesis.cancel();utterance=null;status.textContent='Lesung beendet.'}
 bar.addEventListener('click',e=>{
   const action=e.target.closest('button')?.dataset.action;if(!action||!window.speechSynthesis)return;
   if(action==='stop'){stop();return}
   if(action==='pause'){if(speechSynthesis.speaking&&!speechSynthesis.paused){speechSynthesis.pause();status.textContent='Die Lesung pausiert.'}else if(speechSynthesis.paused){speechSynthesis.resume();status.textContent='Die Lesung wird fortgesetzt.'}return}
   stop();const text=textToRead();if(!text){status.textContent='Auf dieser Seite wurde kein lesbarer Text gefunden.';return}
   utterance=new SpeechSynthesisUtterance(text);utterance.lang='de-DE';utterance.rate=.88;utterance.pitch=.94;utterance.volume=1;
   const chosen=voices[Number(select.value)];if(chosen)utterance.voice=chosen;
   utterance.onstart=()=>status.textContent='Die Chronik wird vorgelesen. Du kannst jederzeit pausieren oder stoppen.';
   utterance.onend=()=>status.textContent='Die Lesung ist beendet.';utterance.onerror=()=>status.textContent='Die Systemstimme konnte nicht gestartet werden. Bitte wähle eine andere Stimme.';
   speechSynthesis.speak(utterance);
 });
 window.addEventListener('pagehide',()=>{if(window.speechSynthesis)speechSynthesis.cancel()});
})();