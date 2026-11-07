const $ = id => document.getElementById(id);
let ctx, stream, nodes = {}, active = false;
const defaults = {gain:1,bass:0,presence:0,treble:0,echo:0,reverb:0};
function makeImpulse(context, seconds=1.6, decay=2.2){const rate=context.sampleRate,length=Math.floor(rate*seconds),buffer=context.createBuffer(2,length,rate);for(let c=0;c<2;c++){const d=buffer.getChannelData(c);for(let i=0;i<length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/length,decay);}return buffer;}
function buildGraph(){
  const source=ctx.createMediaStreamSource(stream), bass=ctx.createBiquadFilter(), presence=ctx.createBiquadFilter(), treble=ctx.createBiquadFilter(), comp=ctx.createDynamicsCompressor(), gain=ctx.createGain();
  bass.type='lowshelf';bass.frequency.value=140;presence.type='peaking';presence.frequency.value=1800;presence.Q.value=0.8;treble.type='highshelf';treble.frequency.value=5000;
  comp.threshold.value=-18;comp.knee.value=18;comp.ratio.value=3;comp.attack.value=.008;comp.release.value=.18;
  const dry=ctx.createGain(), delay=ctx.createDelay(1), feedback=ctx.createGain(), echoWet=ctx.createGain(), convolver=ctx.createConvolver(), reverbWet=ctx.createGain(), master=ctx.createGain(), limiter=ctx.createDynamicsCompressor();
  delay.delayTime.value=.24;feedback.gain.value=.18;convolver.buffer=makeImpulse(ctx);
  limiter.threshold.value=-3;limiter.knee.value=0;limiter.ratio.value=20;limiter.attack.value=.003;limiter.release.value=.12;
  source.connect(bass).connect(presence).connect(treble).connect(comp).connect(gain);
  gain.connect(dry).connect(master);gain.connect(delay);delay.connect(echoWet).connect(master);delay.connect(feedback).connect(delay);
  gain.connect(convolver);convolver.connect(reverbWet).connect(master);master.connect(limiter).connect(ctx.destination);
  nodes={bass,presence,treble,comp,gain,dry,delay,feedback,echoWet,convolver,reverbWet,master,limiter};applyControls();
}
function val(id){return Number($(id).value)}
function applyControls(){if(!nodes.gain)return;nodes.gain.gain.setTargetAtTime(val('gain'),ctx.currentTime,.03);nodes.bass.gain.setTargetAtTime(val('bass'),ctx.currentTime,.03);nodes.presence.gain.setTargetAtTime(val('presence'),ctx.currentTime,.03);nodes.treble.gain.setTargetAtTime(val('treble'),ctx.currentTime,.03);nodes.echoWet.gain.setTargetAtTime(val('echo')/100,ctx.currentTime,.03);nodes.reverbWet.gain.setTargetAtTime(val('reverb')/100,ctx.currentTime,.03);for(const id of Object.keys(defaults))$(id+'Out').textContent=id==='gain'?val(id).toFixed(2)+'×':(['echo','reverb'].includes(id)?val(id)+'%':val(id)+' dB');}
function setValues(values){for(const [k,v] of Object.entries(values))$(k).value=v;applyControls();}
const presets={clean:{gain:1,bass:0,presence:0,treble:0,echo:0,reverb:0},bass:{gain:1.05,bass:5,presence:1,treble:-1,echo:0,reverb:3},bright:{gain:1,bass:-1,presence:3,treble:4,echo:0,reverb:0},ultra:{gain:1.45,bass:4,presence:2,treble:2,echo:4,reverb:3}};
async function start(){try{$('toggle').disabled=true;stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});ctx=new (window.AudioContext||window.webkitAudioContext)();await ctx.resume();buildGraph();active=true;$('toggle').textContent='Stop mic';$('statusTitle').textContent='Microphone is on';$('statusText').textContent='Audio is being monitored in this tab through a safety limiter. Headphones are strongly recommended.';}catch(e){$('statusTitle').textContent='Could not start microphone';$('statusText').textContent=e.name==='NotAllowedError'?'Allow microphone permission, then try again.':'Open this page on HTTPS and check microphone support.';if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;}finally{$('toggle').disabled=false;}}
async function stop(){if(stream)stream.getTracks().forEach(t=>t.stop());if(ctx)await ctx.close();stream=null;ctx=null;nodes={};active=false;$('toggle').textContent='Start mic';$('statusTitle').textContent='Microphone is off';$('statusText').textContent='Use headphones before starting to avoid feedback.';}
$('toggle').addEventListener('click',()=>active?stop():start());for(const id of Object.keys(defaults))$(id).addEventListener('input',applyControls);
document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-preset]').forEach(x=>x.classList.toggle('active',x===b));setValues(presets[b.dataset.preset]);}));
document.querySelectorAll('[data-voice]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-voice]').forEach(x=>x.classList.toggle('selected',x===b));const mode=b.dataset.voice;const values=mode==='radio'?{bass:-4,presence:4,treble:3}:mode==='robot'?{bass:2,presence:5,treble:-2}:{bass:0,presence:0,treble:0};for(const [k,v] of Object.entries(values))$(k).value=v;applyControls();}));
window.addEventListener('pagehide',()=>{if(stream)stream.getTracks().forEach(t=>t.stop());});
