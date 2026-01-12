// js/quiz.js (FINAL - single screen wizard + result in same card)

const councils = {
  genclik: {
    title: "Gençlik Meclisi",
    desc: "Gençlerin İzmir’de yönetimde söz almasını, dayanışmayı ve proje süreçlerine katılımı destekler; teknoloji ve sosyal enerji ile kente güç katar.",
    groups: ["Öğrenci Komisyonu", "Sosyal Medya Komisyonu", "Etkinlik Proje"]
  },
  kadin: {
    title: "Kadın Meclisi",
    desc: "Kadınların kent yaşamında görünürlüğünü ve temsilini güçlendirir; hukuk, sağlık, kültür, çalışma yaşamı ve toplumsal cinsiyet alanlarında projeler üretir.",
    groups: ["Toplumsal Cinsiyet Eşitliği", "Kadın Hukuk", "Kadın Emeği ve İstihdam"]
  },
  engelli: {
    title: "Engelli Meclisi",
    desc: "Engelli bireylerin kent yaşamına eşit katılımını savunur; erişilebilirlik ve temsil alanlarında çözüm odaklı proje üretir.",
    groups: ["Erişilebilirlik", "Tek Sağlık", "Afetler"]
  },
  cocuk: {
    title: "Çocuk Meclisi",
    desc: "Çocukların kent yönetiminde söz sahibi olmalarını sağlar; çocuk dostu İzmir için dayanışmayı, temsil gücünü ve uluslararası katılımı destekler.",
    groups: ["Eğitim", "Kültür ve Sanat", "Sosyal Gelişim"]
  }
};

// value: genclik/kadin/engelli/cocuk
const questions = [
  { name:"q1",  title:"1) İzmir’de seni en çok etkileyen/öncelik verdiğin konu hangisi?", options:[
    {label:"Erişilebilirlik ve engelsiz yaşam", value:"engelli"},
    {label:"Gençlerin eğitim/iş fırsatları", value:"genclik"},
    {label:"Kadınların güvenliği ve eşitliği", value:"kadin"},
    {label:"Çocuklar için güvenli alanlar", value:"cocuk"},
  ]},
  { name:"q2",  title:"2) Bir proje ekibine girsen hangi rol sana daha uygun?", options:[
    {label:"İletişim & içerik üretimi", value:"genclik"},
    {label:"Organizasyon & saha koordinasyonu", value:"engelli"},
    {label:"Araştırma & raporlama", value:"kadin"},
    {label:"Savunuculuk & farkındalık", value:"cocuk"},
  ]},
  { name:"q3",  title:"3) Şehirde hızlıca iyileşmesini istediğin bir hizmet seç:", options:[
    {label:"Toplu taşıma ve ulaşım düzeni", value:"genclik"},
    {label:"Parklar ve çevre düzeni", value:"cocuk"},
    {label:"Sağlık/psikososyal destek", value:"engelli"},
    {label:"Kültür–sanat etkinlikleri", value:"kadin"},
  ]},
  { name:"q4",  title:"4) Sence kentte en güçlü olması gereken değer?", options:[
    {label:"Eşitlik", value:"kadin"},
    {label:"Dayanışma", value:"engelli"},
    {label:"Sürdürülebilirlik", value:"cocuk"},
    {label:"Yenilikçilik", value:"genclik"},
  ]},
  { name:"q5",  title:"5) Hangi alan seni daha çok çekiyor?", options:[
    {label:"Sosyal medya / medya üretimi", value:"genclik"},
    {label:"Yerel yönetimler / kamu hizmetleri", value:"engelli"},
    {label:"Eğitim / öğrenci odaklı çalışmalar", value:"cocuk"},
    {label:"Sağlık ve toplumsal refah", value:"kadin"},
  ]},
  { name:"q6",  title:"6) Bir kampanya fikri seç:", options:[
    {label:"“Engelsiz İzmir Haritası”", value:"engelli"},
    {label:"“Kadınlar için güvenli kent noktaları”", value:"kadin"},
    {label:"“Gençlik etkinlikleri ve atölye haftası”", value:"genclik"},
    {label:"“Çocuk dostu parklar”", value:"cocuk"},
  ]},
  { name:"q7",  title:"7) Kendini hangi cümle daha iyi anlatır?", options:[
    {label:"“Ben çözüm üretmeyi seviyorum.”", value:"engelli"},
    {label:"“Ben topluluklara enerji katıyorum.”", value:"genclik"},
    {label:"“Ben adalet/eşitlik için ses olurum.”", value:"kadin"},
    {label:"“Ben çocukların geleceğini önemsiyorum.”", value:"cocuk"},
  ]},
  { name:"q8",  title:"8) Şehir yaşamında hangi başlık sana daha “acil” geliyor?", options:[
    {label:"Afet hazırlığı", value:"engelli"},
    {label:"Kentsel dönüşüm", value:"genclik"},
    {label:"Hayvan hakları", value:"cocuk"},
    {label:"Kooperatif/yerel ekonomi", value:"kadin"},
  ]},
  { name:"q9",  title:"9) Bir çalışma grubu seçmen gerekse hangisi?", options:[
    {label:"Sosyal Medya Komisyonu", value:"genclik"},
    {label:"Erişilebilirlik", value:"engelli"},
    {label:"Kadın Hukuk", value:"kadin"},
    {label:"Öğrenci Komisyonu", value:"cocuk"},
  ]},
  { name:"q10", title:"10) İzmir’i tanıtmak için hangi yaklaşım daha iyi?", options:[
    {label:"Turizm rotaları ve kültür haritası", value:"cocuk"},
    {label:"Sosyal medya kampanyası", value:"genclik"},
    {label:"Etkinlik ve festival serileri", value:"kadin"},
    {label:"Uluslararası ağlar ve projeler", value:"engelli"},
  ]},
];

function pickWinner(scores) {
  const order = ["genclik", "kadin", "engelli", "cocuk"]; // tie-break
  let bestKey = "genclik";
  let bestScore = -1;
  for (const k of order) {
    const s = scores[k] ?? 0;
    if (s > bestScore) { bestScore = s; bestKey = k; }
  }
  return bestKey;
}

function calcScores(answers) {
  const scores = { genclik:0, kadin:0, engelli:0, cocuk:0 };
  Object.values(answers).forEach(v => { if (scores[v] !== undefined) scores[v]++; });
  return scores;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quizForm");
  if (!form) return;

  const wizardWrap = document.getElementById("quizWizard");
  const resultWrap = document.getElementById("quizResult");

  const qTitle = document.getElementById("qTitle");
  const qOptions = document.getElementById("qOptions");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const resetBtn = document.getElementById("resetBtn");
  const restartBtn = document.getElementById("restartBtn");
  const hint = document.getElementById("inlineHint");

  const progressText = document.getElementById("progressText");
  const progressBar = document.getElementById("progressBar");

  const resultCouncilTitle = document.getElementById("resultCouncilTitle");
  const resultCouncilDesc = document.getElementById("resultCouncilDesc");
  const resultGroups = document.getElementById("resultGroups");

  let step = 0;
  const answers = {};

  function setHint(show){ hint.style.display = show ? "block" : "none"; }

  function updateProgress(){
    const total = questions.length;
    progressText.textContent = `Soru ${step + 1}/${total}`;
    progressBar.style.width = `${Math.round(((step + 1) / total) * 100)}%`;
  }

  function renderStep(){
    setHint(false);

    const q = questions[step];
    qTitle.textContent = q.title;

    qOptions.innerHTML = "";
    q.options.forEach((opt, idx) => {
      const id = `${q.name}_${idx}`;

      const label = document.createElement("label");
      label.className = "opt";
      label.htmlFor = id;

      const input = document.createElement("input");
      input.type = "radio";
      input.name = q.name;
      input.id = id;
      input.value = opt.value;

      if (answers[q.name] === opt.value) input.checked = true;

      label.appendChild(input);
      label.appendChild(document.createTextNode(" " + opt.label));
      qOptions.appendChild(label);
    });

    prevBtn.disabled = step === 0;
    nextBtn.textContent = step === questions.length - 1 ? "Sonucu Gör" : "Sonraki →";

    updateProgress();
  }

  function currentAnswer(){
    const q = questions[step];
    const checked = form.querySelector(`input[name="${q.name}"]:checked`);
    return checked ? checked.value : null;
  }

  function showResult(){
    const scores = calcScores(answers);
    const winner = pickWinner(scores);
    const data = councils[winner];

    resultCouncilTitle.textContent = data.title;
    resultCouncilDesc.textContent = data.desc;

    resultGroups.innerHTML = "";
    data.groups.forEach(g => {
      const span = document.createElement("span");
      span.className = "badge";
      span.textContent = g;
      resultGroups.appendChild(span);
    });

    // ✅ same card: hide wizard, show result
    wizardWrap.style.display = "none";
    resultWrap.style.display = "block";

    // progress ends at 100%
    progressText.textContent = `Tamamlandı`;
    progressBar.style.width = `100%`;

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goNext(){
    const val = currentAnswer();
    if (!val) { setHint(true); return; }

    answers[questions[step].name] = val;

    if (step < questions.length - 1){
      step += 1;
      renderStep();
    } else {
      showResult();
    }
  }

  function goPrev(){
    if (step === 0) return;
    step -= 1;
    renderStep();
  }

  function hardReset(){
    for (const k in answers) delete answers[k];
    step = 0;

    // clear radios
    form.reset();

    // show wizard again
    wizardWrap.style.display = "block";
    resultWrap.style.display = "none";

    renderStep();
  }

  // events
  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", (e) => { e.preventDefault(); goNext(); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    goNext();
  });

  form.addEventListener("change", () => setHint(false));

  resetBtn.addEventListener("click", hardReset);
  restartBtn?.addEventListener("click", hardReset);

  renderStep();
});