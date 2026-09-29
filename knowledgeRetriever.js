/* Standalone copy of the retriever that is embedded in CAPACITI_Buddy.html (the app does not load this file).
   Browser: define KNOWLEDGE_BASE first.  Node: it loads ./capaciti_knowledge_base.json automatically. */
/* ============ knowledgeRetriever.js (embedded, zero dependencies) ============
   Tokenise -> score every chunk -> return the top 1-2 chunks above a minimum score.
   keyword match = 3x, category/subCategory match = 2x, content match = 1x.       */
const KnowledgeRetriever = (function(kb){
  const MIN_SCORE = 3;        // a single keyword hit qualifies; a lone content hit does not
  const MAX_RESULTS = 2;      // never send more than two chunks to the model
  const SECOND_RATIO = 0.7;   // 2nd chunk must score at least 70% of the best one
  const STOP = new Set(('the and for are you your can how what who when where does with from have has this that not '+
    'a an of to in on is it my me i do did will would should could be am was were there their about please tell explain '+
    'help need want know any some get just also if so or at by as into than then us we our they them he she his her its '+
    'which why much many let lets im ive don doesn didn isn won cant dont').split(' '));
  // common alternative phrasings -> vocabulary used in the knowledge base
  const SYN = {
    stipend:'salary pay payment', salary:'stipend pay payment', pay:'stipend salary payment', paid:'stipend salary payment', money:'stipend salary pay', wage:'salary pay',
    boss:'manager supervisor', supervisor:'manager', teacher:'coach mentor', lecturer:'coach mentor',
    fired:'dismissal disciplinary misconduct', sacked:'dismissal disciplinary misconduct', dismissed:'dismissal disciplinary misconduct',
    late:'lateness timekeeping attendance', sick:'absence leave', ill:'absence leave', off:'leave absence', leave:'absence hr',
    clothes:'dress attire clothing', clothing:'dress attire', outfit:'dress attire clothing', wear:'dress attire clothing', jeans:'dress attire ripped',
    weed:'cannabis marijuana drugs', dagga:'cannabis marijuana drugs', drunk:'alcohol intoxicated', booze:'alcohol liquor', beer:'alcohol liquor',
    gun:'firearm weapon', knife:'weapon knives',
    fight:'assault abuse', hit:'assault', swear:'abusive language', rude:'abusive insubordination',
    phone:'cellphone', whatsapp:'cellphone social media', instagram:'social media', facebook:'social media', tiktok:'social media', twitter:'social media',
    firstaid:'first aid', hurt:'first aid injury', injured:'first aid injury', fire:'marshal',
    counsellor:'counselling wellbeing', stressed:'wellbeing mental stress', depressed:'wellbeing mental', anxious:'wellbeing mental anxiety', burnout:'wellbeing mental stress', sad:'wellbeing mental',
    resume:'cv', passwords:'password', password:'reset login', login:'password access', app:'yes one app',
    itsupport:'it technical systems', sherep:'she safety rep',
    quit:'resign absence abscondment', resign:'notice programme', internship:'programme', learnership:'programme',
    complain:'complaint grievance', report:'complaint grievance', grievance:'complaint hr'
  };
  function stem(w){
    if(w.length>5 && w.endsWith('ing')) return w.slice(0,-3);
    if(w.length>4 && w.endsWith('ies')) return w.slice(0,-3)+'y';
    if(w.length>4 && w.endsWith('ed')) return w.slice(0,-2);
    if(w.length>3 && w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us')) return w.slice(0,-1);
    return w;
  }
  function words(text){
    return String(text||'')
      .replace(/\bIT\b/g,'itsupport').replace(/\bSHE\b/g,'sherep')                       // keep IT / SHE from being dropped as stop words
      .replace(/\bit\s+(support|issues?|problems?|systems?|desk|access|department|team)\b/gi,'itsupport $1')
      .toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/)
      .filter(w=>(w.length>1 || /\d/.test(w)) && !STOP.has(w));
  }
  // Step 1 - tokenisation: lowercase, strip punctuation, drop stop words (+ light stemming)
  function tokenize(text){ return words(text).map(stem); }
  function levenshtein(a,b){
    if(Math.abs(a.length-b.length)>1) return 9;
    const dp=Array.from({length:a.length+1},(_,i)=>[i]);
    for(let j=1;j<=b.length;j++) dp[0][j]=j;
    for(let i=1;i<=a.length;i++) for(let j=1;j<=b.length;j++)
      dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
    return dp[a.length][b.length];
  }
  const norm = s => ' '+String(s).toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim()+' ';
  // index once at load time
  const index = kb.map(c=>({
    c,
    kw: new Set(tokenize(c.keywords.join(' '))),
    kwArr: [...new Set(tokenize(c.keywords.join(' ')))].filter(t=>t.length>=5),
    cat: new Set(tokenize(c.category+' '+c.subCategory)),
    body: new Set(tokenize(c.content)),
    phrases: c.keywords.filter(k=>k.trim().includes(' ')).map(norm)
  }));
  function scoreChunk(q, nq, ix){
    let score=0;
    q.forEach(({t,w})=>{
      let s=0;
      if(ix.kw.has(t)) s+=3;                                                            // keywords: 3x
      else if(t.length>=5 && ix.kwArr.some(k=>levenshtein(t,k)<=1)) s+=2;               // typo tolerance
      if(ix.cat.has(t)) s+=2;                                                           // category / subCategory: 2x
      if(ix.body.has(t)) s+=1;                                                          // content: 1x
      score+=s*w;
    });
    ix.phrases.forEach(p=>{ if(nq.includes(p)) score+=2; });                            // exact multi-word keyword phrase
    return score;
  }
  // Steps 2+3 - relevance scoring and chunk filtering
  function run(query){
    const own = new Set(tokenize(query));
    const q = [...own].map(t=>({t,w:1}));
    words(query).forEach(w=>{ if(SYN[w]) SYN[w].split(' ').forEach(x=>{ const t=stem(x); if(!own.has(t)){ own.add(t); q.push({t,w:.7}); } }); });
    if(!q.length) return [];
    const nq=norm(query);
    const ranked = index.map(ix=>({c:ix.c, score:Math.round(scoreChunk(q,nq,ix)*10)/10}))
      .filter(r=>r.score>=MIN_SCORE).sort((a,b)=>b.score-a.score);
    if(!ranked.length) return [];
    const best=ranked[0].score;
    return ranked.filter((r,i)=>i===0 || r.score>=best*SECOND_RATIO).slice(0,MAX_RESULTS)
      .map(r=>({id:r.c.id, category:r.c.category, subCategory:r.c.subCategory, content:r.c.content, score:r.score}));
  }
  // retrieve(query, {lastChunks}) -> [] when nothing relevant. A short, clearly referential follow-up
  // ("and the men?") that matches nothing on its own reuses the chunks from the previous answer.
  function retrieve(query, opts){
    const hits = run(query);
    if(!hits.length && opts && opts.lastChunks && opts.lastChunks.length && FOLLOWUP.test(query) && tokenize(query).length<=5)
      return opts.lastChunks.map(c=>Object.assign({}, c, {score:0, followUp:true}));
    return hits;
  }
  const FOLLOWUP = /\b(what about|how about|and|also|what if|that|those|them|it|this|these|more|else|another|other|why|same|too|instead)\b/i;   // only treat clearly-referential questions as follow-ups
  const byId = id => kb.find(c=>c.id===id) || null;
  const categories = () => [...new Set(kb.map(c=>c.category))];
  const topics = (cat,n) => kb.filter(c=>c.category===cat).slice(0,n||10);
  return {retrieve, tokenize, byId, categories, topics, MIN_SCORE, MAX_RESULTS};
})(typeof KNOWLEDGE_BASE!=='undefined' ? KNOWLEDGE_BASE : require('./capaciti_knowledge_base.json'));
if(typeof module!=='undefined') module.exports = KnowledgeRetriever;

