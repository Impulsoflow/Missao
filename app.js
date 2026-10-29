(() => {
"use strict";
const VERSION = "v2.0.1";
const ITEMS = [
 {dimension:"presenca",text:"Consigo explicar, com minhas próprias palavras, o que dá direção à minha vida."},
 {dimension:"busca",text:"Tenho reservado tempo para descobrir quais contribuições desejo oferecer às pessoas ao meu redor."},
 {dimension:"presenca",text:"Minhas decisões importantes costumam refletir valores que considero essenciais."},
 {dimension:"busca",text:"Exploro novas experiências para compreender melhor onde posso fazer diferença."},
 {dimension:"presenca",text:"Reconheço relações, causas ou responsabilidades que tornam meus dias significativos."},
 {dimension:"busca",text:"Faço perguntas sinceras sobre o legado que desejo construir."},
 {dimension:"presenca",text:"Quando enfrento mudanças, ainda consigo identificar o que é importante para mim."},
 {dimension:"busca",text:"Busco conversas, aprendizados ou vivências que ampliem minha compreensão sobre meu propósito."},
 {dimension:"presenca",text:"Percebo uma conexão entre minhas habilidades, meus valores e a vida que desejo construir."},
 {dimension:"busca",text:"Estou disposto(a) a rever prioridades para aproximar minha rotina daquilo que realmente valorizo."}
];
const LABELS = ["Não me descreve","Descreve muito pouco","Descreve pouco","Descreve em parte","Descreve bem","Descreve bastante","Descreve totalmente"];
const $ = (id) => document.getElementById(id);
const answers = Array(10).fill(null);
let profile=null, current=0, outcome=null, chart=null, doc=null, submissionId=null;
function stage(which){
  ["intro","questions","results"].forEach((x,i)=>{
    $("stage-"+x).classList.toggle("active",x===which);
    $("tab-"+(i+1)).className="step"+(x===which?" active":i<["intro","questions","results"].indexOf(which)?" done":"");
  });
  window.scrollTo({top:0,behavior:"smooth"});
}
function clean(s){return String(s||"").trim().replace(/\s+/g," ").slice(0,254)}
function escapeFile(s){return clean(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9 -]/g,"").trim().replace(/\s+/g,"_").slice(0,70)}
function start(e){
  e.preventDefault();
  const values={};
  ["nome","whatsapp","idade","profissao","escolaridade","email"].forEach(id=>{values[id]=clean($(id).value)});
  const error=$("form-error");
  error.textContent="";
  if(Object.values(values).some(v=>!v)||!$("consent").checked){error.textContent="Preencha todos os campos e confirme sua autorização para continuar.";return}
  const age=Number(values.idade),tel=values.whatsapp.replace(/\D/g,"");
  if(age<18||age>110||!Number.isInteger(age)){error.textContent="Informe uma idade válida entre 18 e 110 anos.";return}
  if(tel.length<10||tel.length>13){error.textContent="Informe um número de WhatsApp válido, com DDD.";return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)){error.textContent="Informe um e-mail válido.";return}
  profile=values;
  stage("questions");renderQuestion();
}
function renderQuestion(){
  const item=ITEMS[current];
  $("question-counter").textContent="Questão "+(current+1)+" de "+ITEMS.length;
  $("progress-pct").textContent=Math.round((current+1)*100/ITEMS.length)+"%";
  $("progress-fill").style.width=((current+1)*100/ITEMS.length)+"%";
  $("question-tag").textContent="REFLEXÃO "+String(current+1).padStart(2,"0")+" · "+(item.dimension==="presenca"?"CLAREZA E SIGNIFICADO":"EXPLORAÇÃO E DESCOBERTA");
  $("question-text").textContent=item.text;
  $("question-error").textContent="";
  $("choices").replaceChildren(...LABELS.map((label,i)=>{
    const btn=document.createElement("button");
    btn.type="button";btn.className="choice"+(answers[current]===i+1?" selected":"");btn.setAttribute("role","radio");
    btn.setAttribute("aria-checked",String(answers[current]===i+1));btn.setAttribute("aria-label",(i+1)+" de 7: "+label);
    const strong=document.createElement("strong");strong.textContent=String(i+1);
    const small=document.createElement("small");small.textContent=label;
    btn.append(strong,small);
    btn.addEventListener("click",()=>{answers[current]=i+1;renderQuestion()});
    return btn;
  }));
  $("back-btn").textContent=current===0?"← Cadastro":"← Voltar";
  $("next-btn").textContent=current===9?"Ver meu mapa →":"Próxima reflexão →";
}
function next(){
  if(answers[current]===null){$("question-error").textContent="Escolha uma alternativa para continuar.";return}
  if(current===9){finish();return}
  current++;renderQuestion();$("question-text").focus({preventScroll:true});
}
function previous(){
  if(current===0){stage("intro");return}
  current--;renderQuestion();$("question-text").focus({preventScroll:true});
}
function describe(mean,kind){
  if(kind==="presenca"){
    if(mean>=5.3)return "Você relata uma conexão frequente entre seus valores, escolhas e fontes de significado.";
    if(mean>=3.4)return "Você já reconhece algumas referências de significado, com espaço para torná-las mais presentes nas escolhas.";
    return "Suas respostas sugerem uma oportunidade de explorar, com gentileza, o que hoje dá direção e importância à sua vida.";
  }
  if(mean>=5.3)return "Você se percebe ativamente disposto(a) a ampliar a compreensão sobre propósito e contribuição.";
  if(mean>=3.4)return "Você demonstra interesse variável em descobrir e aprofundar caminhos de significado.";
  return "No momento, a exploração de novos caminhos parece ocupar pouco espaço nas suas prioridades — e isso também pode refletir satisfação com o que já tem.";
}
function interpret(p,s){
  if(p>=4.5&&s>=4.5)return ["Você reconhece fontes de significado e mantém curiosidade para crescer. Essa combinação pode ajudar a viver com direção sem perder a abertura para novos aprendizados.","Transforme essa energia em pequenas contribuições alinhadas aos seus valores."];
  if(p>=4.5)return ["Sua percepção de significado parece relativamente estabelecida e, neste momento, você demonstra menor necessidade de explorar outros caminhos. Isso não é falta de ambição: pode significar contentamento e estabilidade.","Observe se suas escolhas cotidianas continuam expressando o propósito que já reconhece."];
  if(s>=4.5)return ["Você está em um período de busca e descoberta. A disposição de investigar novos sentidos pode ser uma fonte de crescimento, mesmo que a direção ainda não esteja inteiramente clara.","Escolha uma experiência pequena para testar onde seus valores, talentos e contribuições se encontram."];
  return ["Este pode ser um tempo de revisão de prioridades, mais do que de respostas prontas. Não há obrigação de sentir clareza plena ou estar sempre buscando.","Comece pelo que já tem valor concreto para você: relações, cuidado, aprendizado e pequenas ações."];
}
function actions(p,s){
  const first=p<4.5?"Escreva três momentos em que você sentiu que sua presença fez diferença para alguém. Identifique o valor presente em cada um.":"Anote três valores que já orientam suas escolhas e observe uma atitude da semana que represente cada valor.";
  const second=s<4.5?"Reserve duas conversas de qualidade com pessoas importantes e pergunte o que desejam construir ou melhorar juntos.":"Escolha uma atividade nova de contribuição, aprendizado ou serviço e reserve um momento real na agenda para experimentá-la.";
  return [
    {label:"7 DIAS · ESCUTAR",text:first},
    {label:"30 DIAS · EXPERIMENTAR",text:second},
    {label:"90 DIAS · CONSOLIDAR",text:"Defina uma contribuição concreta que traduza seus valores, estabeleça um indicador observável e revise mensalmente o que aprendeu."}
  ];
}
function finish(){
  if(answers.some(a=>a===null))return;
  const presenceItems=ITEMS.map((x,i)=>x.dimension==="presenca"?answers[i]:null).filter(v=>v!==null);
  const searchItems=ITEMS.map((x,i)=>x.dimension==="busca"?answers[i]:null).filter(v=>v!==null);
  const p=presenceItems.reduce((a,b)=>a+b,0),s=searchItems.reduce((a,b)=>a+b,0);
  const interpretation=interpret(p/5,s/5);
  outcome={p,s,pmean:p/5,smean:s/5,interpretation,steps:actions(p/5,s/5),when:new Date().toISOString()};
  submissionId=(crypto&&crypto.randomUUID?crypto.randomUUID():String(Date.now())+"-"+Math.random().toString(36).slice(2));
  $("result-heading").textContent=profile.nome.split(" ")[0]+", sua missão continua sendo escrita.";
  $("result-date").textContent="Avaliação de "+new Date().toLocaleDateString("pt-BR");
  $("presence-score").innerHTML=String(p)+' <small>/ 35</small>';
  $("search-score").innerHTML=String(s)+' <small>/ 35</small>';
  $("presence-text").textContent=describe(p/5,"presenca");
  $("search-text").textContent=describe(s/5,"busca");
  $("presence-bar").style.width=((p-5)/30*100)+"%";
  $("search-bar").style.width=((s-5)/30*100)+"%";
  $("interpretation").textContent=interpretation[0];
  $("recommendation").textContent=interpretation[1];
  $("action-list").replaceChildren(...outcome.steps.map(a=>{
    const el=document.createElement("div");el.className="action-item";
    const strong=document.createElement("strong");strong.textContent=a.label;
    const txt=document.createElement("p");txt.textContent=a.text;el.append(strong,txt);return el;
  }));
  stage("results");
  makeChart();
  try{
    doc=makePdf();
    doc.save("MISSÃO_Impulso_"+escapeFile(profile.nome)+"_"+new Date().toISOString().slice(0,10)+".pdf");
    $("delivery-status").textContent="PDF gerado e disponibilizado para download.";
    $("delivery-status").className="delivery-status good";
  }catch(err){
    $("delivery-status").textContent="Não foi possível gerar o PDF automaticamente. Verifique sua conexão e use o botão de download.";
    $("delivery-status").className="delivery-status warn";
    console.error("MISSÃO PDF",err);
  }
  void sendIfConfigured();
}
function makeChart(){
  if(typeof Chart==="undefined")return;
  if(chart)chart.destroy();
  chart=new Chart($("result-chart"),{
    type:"bar",data:{labels:["Clareza de significado","Exploração de propósito"],datasets:[{data:[outcome.p,outcome.s],backgroundColor:["#0b63ce","#dca44b"],borderRadius:6}]},
    options:{indexAxis:"y",responsive:true,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>ctx.raw+" de 35"}}},scales:{x:{beginAtZero:true,min:0,max:35,ticks:{stepSize:7}},y:{ticks:{font:{size:11}}}}}
  });
}
function makePdf(){
  if(!window.jspdf||!window.jspdf.jsPDF)throw Error("Biblioteca PDF indisponível");
  const pdf=new window.jspdf.jsPDF({unit:"mm",format:"a4"});
  const W=210,M=19,B=274;let page=0,y=35;
  function frame(title){
    page++;if(page>1)pdf.addPage();
    pdf.setFillColor(8,66,137);pdf.rect(0,0,W,24,"F");
    pdf.setTextColor(255,255,255);pdf.setFont("helvetica","bold");pdf.setFontSize(11);
    pdf.text("INSTITUTO IMPULSO IE  |  MISSAO",M,14);
    pdf.setTextColor(18,56,98);pdf.setFontSize(17);pdf.text(title,M,35);
    pdf.setDrawColor(215,229,241);pdf.line(M,282,191,282);
    pdf.setFont("helvetica","normal");pdf.setFontSize(8);pdf.setTextColor(107,127,149);
    pdf.text("Avaliacao autoral educativa  |  Confidencial - uso do participante",M,289);
    pdf.text(String(page),190,289,{align:"right"});y=47;
  }
  function paragraph(text,size=10,color=[56,79,107],space=6){
    pdf.setFont("helvetica","normal");pdf.setFontSize(size);pdf.setTextColor(...color);
    const lines=pdf.splitTextToSize(text,170),h=size*.47+1.2;
    for(const line of lines){
      if(y+h>B){frame("MISSAO | Continuacao");pdf.setFont("helvetica","normal");pdf.setFontSize(size);pdf.setTextColor(...color)}
      pdf.text(line,M,y);y+=h;
    }
    y+=space;
  }
  function heading(text){
    if(y+12>B)frame("MISSAO | Continuacao");
    pdf.setTextColor(10,66,128);pdf.setFont("helvetica","bold");pdf.setFontSize(12);pdf.text(text,M,y);y+=9;
  }
  frame("Seu mapa de significado e proposito");
  pdf.setFont("helvetica","bold");pdf.setFontSize(19);pdf.setTextColor(10,66,128);
  pdf.text(pdf.splitTextToSize(profile.nome,170),M,y);y+=17;
  paragraph("Avaliado em "+new Date(outcome.when).toLocaleDateString("pt-BR")+"  |  Referencia "+submissionId.slice(0,8).toUpperCase(),9);
  heading("Informacoes do participante");
  paragraph("Nome: "+profile.nome+"\nProfissao: "+profile.profissao+"\nIdade: "+profile.idade+" anos  |  Escolaridade: "+profile.escolaridade+"\nWhatsApp: "+profile.whatsapp+"\nE-mail: "+profile.email,10);
  heading("Mensagem central");
  paragraph("Seu proposito nao e um numero nem uma sentenca. Este mapa organiza reflexoes sobre significado e a busca por novos caminhos de contribuicao. Use os resultados como ponto de partida para conversas e escolhas conscientes.",11);
  heading("Visao executiva");
  pdf.setFillColor(237,246,255);pdf.roundedRect(M,y,172,35,4,4,"F");
  pdf.setFont("helvetica","bold");pdf.setTextColor(10,68,140);pdf.setFontSize(17);
  pdf.text(String(outcome.p)+"/35",M+8,y+14);pdf.text(String(outcome.s)+"/35",M+95,y+14);
  pdf.setFont("helvetica","normal");pdf.setFontSize(9);
  pdf.text("Clareza de significado",M+8,y+24);pdf.text("Exploracao de proposito",M+95,y+24);y+=48;
  paragraph(outcome.interpretation[0],10);
  paragraph("LEMBRETE METODOLOGICO: a escala e autoral, de reflexao, sem pontos de corte normativos. As duas dimensoes nao devem ser somadas como indice clinico.",9,[94,107,124]);
  frame("Como ler suas duas dimensoes");
  heading("1. Clareza de significado: "+outcome.p+" / 35");
  paragraph(describe(outcome.pmean,"presenca"),11);
  heading("2. Exploracao de proposito: "+outcome.s+" / 35");
  paragraph(describe(outcome.smean,"busca"),11);
  heading("Comparativo visual");
  [{title:"Clareza",n:outcome.p,c:[11,99,206]},{title:"Exploracao",n:outcome.s,c:[220,164,75]}].forEach((b)=>{
    paragraph(b.title+"  "+b.n+" de 35",10,[15,53,99],0);
    pdf.setFillColor(234,241,249);pdf.roundedRect(M,y,165,8,2,2,"F");
    pdf.setFillColor(...b.c);pdf.roundedRect(M,y,165*(b.n-5)/30,8,2,2,"F");y+=19;
  });
  heading("Uma interpretacao para dialogo");
  paragraph(outcome.interpretation[0]+" "+outcome.interpretation[1],10);
  paragraph("Buscar significado e sentir que a vida ja tem sentido sao experiencias distintas. Uma pontuacao alta em exploracao nao significa necessariamente insatisfacao, assim como menor exploracao nao significa ausencia de proposito.",10);
  frame("Suas 10 respostas");
  paragraph("Escala de 1 a 7: quanto cada afirmacao descreve seu momento atual. Cada dimensao inclui 5 afirmacoes.",9);
  ITEMS.forEach((q,i)=>{
    heading((i+1)+". "+(q.dimension==="presenca"?"Clareza":"Exploracao")+"  |  "+answers[i]+"/7");
    paragraph(q.text,9,[57,79,102],2);
  });
  frame("Plano de desenvolvimento 7 - 30 - 90 dias");
  paragraph("Os compromissos sugeridos nao sao prescricoes. Ajuste-os a sua realidade, cultura, valores e responsabilidades.",10);
  outcome.steps.forEach(step=>{heading(step.label);paragraph(step.text,11)});
  heading("Perguntas para levar consigo");
  paragraph("Qual valor eu gostaria que minhas escolhas expressassem com mais clareza?\nQuem se beneficia quando eu vivo de modo coerente com esse valor?\nQual atitude simples e observavel posso realizar nesta semana?",10);
  heading("Referencias conceituais");
  paragraph("Steger, M. F., Frazier, P., Oishi, S. & Kaler, M. (2006). The Meaning in Life Questionnaire: Assessing the presence of and search for meaning in life. Journal of Counseling Psychology, 53(1), 80-93. DOI: 10.1037/0022-0167.53.1.80.",9);
  paragraph("Seligman, M. E. P. (2011). Flourish. Free Press. Pilar Meaning do modelo PERMA; PERMA-V amplia a discussao de bem-estar incluindo vitalidade. Esta pesquisa NAO reproduz nem pretende ser o instrumento MLQ.",9);
  heading("Aviso de escopo");
  paragraph("Instrumento autoral de autoconhecimento, sem validacao psicometrica publicada, sem avaliacao diagnostica. Resultados nao devem ser usados para decisoes clinicas, selecao de pessoal ou inferencias patologicas.",9);
  return pdf;
}
async function sendIfConfigured(){
  const endpoint=window.IMPULSO_MISSAO_API_URL;
  if(!endpoint){
    $("delivery-status").textContent="PDF disponível para download. Envio por e-mail e arquivamento em Drive ainda não estão habilitados nesta versão; nenhum envio automático foi realizado.";
    $("delivery-status").className="delivery-status warn";
    return;
  }
  if(!/^https:\/\//.test(endpoint)&&!endpoint.startsWith("/api/")){
    $("delivery-status").textContent="Integração de envio configurada com endereço inválido.";return;
  }
  if(!doc)return;
  $("delivery-status").textContent="Enviando relatório para o serviço protegido...";
  const filename="Missao_Impulso_"+escapeFile(profile.nome)+".pdf";
  const request={version:VERSION,submissionId,instrument:"IMPULSO-MISSAO-2026",participant:profile,answers:answers.slice(),results:{presenca:outcome.p,busca:outcome.s},generatedAt:outcome.when,pdfFilename:filename,pdfBase64:doc.output("datauristring").split(",")[1]};
  try{
    const response=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"omit",body:JSON.stringify(request)});
    if(!response.ok)throw Error("HTTP "+response.status);
    const data=await response.json();
    if(!data||data.ok!==true||data.emailStatus!=="sent"||!data.pdfUrl)throw Error("Confirmação incompleta do serviço");
    $("delivery-status").textContent="Relatório arquivado no Google Drive e e-mail enviado: "+profile.email;
    $("delivery-status").className="delivery-status good";$("retry-send").hidden=true;
  }catch(e){
    $("delivery-status").textContent="O PDF foi gerado, mas o envio/arquivamento não foi confirmado. Faça o download e tente novamente. Detalhe: "+e.message;
    $("delivery-status").className="delivery-status warn";$("retry-send").hidden=false;
  }
}
async function sharePdf(){
  if(!profile || !outcome)return;
  try{
    if(!doc)doc=makePdf();
    const fileName="MISSAO_Impulso_"+escapeFile(profile.nome)+"_"+new Date().toISOString().slice(0,10)+".pdf";
    const blob=doc.output("blob");
    const file=new File([blob],fileName,{type:"application/pdf"});
    if(typeof navigator.share==="function" && typeof navigator.canShare==="function" && navigator.canShare({files:[file]})){
      await navigator.share({files:[file],title:"Relatório MISSÃO — Instituto Impulso",text:"Compartilho meu relatório de significado e propósito."});
      $("delivery-status").textContent="Arquivo PDF compartilhado pelo aplicativo escolhido. Não é envio automático do Instituto Impulso.";
      $("delivery-status").className="delivery-status good";
    }else{
      doc.save(fileName);
      $("delivery-status").textContent="O navegador não oferece compartilhamento de arquivos. Baixei o PDF para que você possa anexá-lo ao seu e-mail ou WhatsApp.";
      $("delivery-status").className="delivery-status warn";
    }
  }catch(error){
    if(error && error.name==="AbortError")return;
    $("delivery-status").textContent="Não foi possível compartilhar o arquivo. Use o botão Baixar relatório PDF.";
    $("delivery-status").className="delivery-status warn";
  }
}
function download(){
  try{if(!doc)doc=makePdf();doc.save("MISSÃO_Impulso_"+escapeFile(profile.nome)+"_"+new Date().toISOString().slice(0,10)+".pdf")}
  catch(err){$("delivery-status").textContent="Não foi possível gerar o PDF. Verifique a conexão e tente novamente."}
}
$("profile-form").addEventListener("submit",start);
$("next-btn").addEventListener("click",next);
$("back-btn").addEventListener("click",previous);
$("download-btn").addEventListener("click",download);
$("share-btn").addEventListener("click",()=>void sharePdf());
$("retry-send").addEventListener("click",()=>void sendIfConfigured());
})();