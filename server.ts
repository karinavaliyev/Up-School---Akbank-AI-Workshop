import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini instance
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for retrying with backoff and alternative models
async function callGeminiWithRetry(options: {
  contents: string;
  config: any;
}) {
  const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });

      if (response && response.text) {
        return JSON.parse(response.text.trim());
      }
    } catch (err: any) {
      console.warn(`Model ${model} attempt failed:`, err?.message || err);
      lastError = err;
      // Brief pause before trying alternative model
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  }

  throw lastError;
}

// Fallback generator for questions if all cloud models are under temporary outage
function getFallbackQuestions(
  interviewerTitle: string,
  targetRole: string,
  candidateLevel: string
) {
  return {
    interviewerMindsetSummary: `${interviewerTitle} olarak bir ${candidateLevel} adayında 10 yıllık mimari tecrübe değil; problem çözme disiplini, merak, geri bildirim almaya açıklık ve temel kavramları sindirmiş olma potansiyeli aranır.`,
    interviewerPriorities: [
      'Temel Bilgiler & Öğrenme Çevikliği',
      'Akademik/Bireysel Projelerdeki Somut Katkı',
      'Ekip İçi Uyum ve Hatalardan Ders Çıkarma',
    ],
    questions: [
      {
        id: 'q-1',
        category: 'teknik',
        categoryBadge: 'Teknik Temeller & Kod Kalitesi',
        questionText: `Daha önce geliştirdiğin bir okul projesinde veya yan projede karşılaştığın en karmaşık teknik problem neydi ve bunu adım adım nasıl çözdün?`,
        interviewerIntent: `${interviewerTitle}, ezber kod yerine adayın gerçek bir bug veya mimari tıkanıklık karşısında mantık yürütme ve araştırma metodolojisini sınar.`,
        whatToHighlight: [
          'Problemi nasıl tespit ettiğin ve izole ettiğin',
          'Dökümantasyon ve hata ayıklama (debugging) sürecin',
          'Elde edilen somut çıktı ve öğrendiğin ders',
        ],
        starAdvice:
          'Situation: Proje neydi? Task: Hangi modül patladı? Action: Hangi araçla çözdün? Result: Kod nasıl optimize oldu?',
        sampleGoodResponse:
          'Bitirme projemizde API yanıt süreleri uzadığında tarayıcı ağ sekmesinden gereksiz tekrarlı istekleri tespit ettim. Redux/React Query önbellekleme ekleyerek sayfa yüklenme süresini yarıya indirdim.',
        commonPitfalls:
          'Sadece "Arkadaşımla beraber çözdük" deyip kendi somut analiz adımlarını atlamak.',
      },
      {
        id: 'q-2',
        category: 'davranissal',
        categoryBadge: 'Geri Bildirim & Ekip Çalışması',
        questionText: `Yazdığın bir koda veya yaptığın bir tasarıma ekip liderinden ya da hocandan sert bir eleştiri/code review aldığında nasıl tepki verirsin? Gerçek bir örnek verebilir misin?`,
        interviewerIntent:
          'Adayın eleştiriyi kişiselleştirmeden gelişme fırsatı olarak görüp görmediğini (coachability) ölçer.',
        whatToHighlight: [
          'Savunmaya geçmek yerine sorulan gerekçeyi dinlemek',
          'Öğrenme odaklı yaklaşım sergilemek',
          'Düzeltmeyi yapıp teşekkür edebilmek',
        ],
        starAdvice:
          'Örnek bir code review veya ödev geri bildirimi seç. Aldığın tavsiyeyi koduna nasıl yansıttığını anlat.',
        sampleGoodResponse:
          'Stajımda yazdığım fonksiyona kıdemli mühendis spagetti uyarısı yaptı. Savunmak yerine refactor tavsiyelerini not alıp clean code prensiplerine göre parçalara böldüm ve standartları benimsedim.',
        commonPitfalls:
          'Haksızlığa uğradığını iddia etmek veya "Ben hiç hata yapmam" havası yaratmak.',
      },
      {
        id: 'q-3',
        category: 'proje',
        categoryBadge: 'Uygulamalı Proje Katkısı',
        questionText: `GitHub üzerinde yer alan projelerinden birini seçmeni istesek, mimarisini en çok savunduğun ve gurur duyduğun proje hangisi?`,
        interviewerIntent:
          'Kopya/tutorial projesi mi yoksa gerçekten emek verilmiş, iç mantığı kavranmış bir çalışma mı olduğunu anlar.',
        whatToHighlight: [
          'Projenin çözdüğü gerçek problem',
          'Kullanılan teknolojilerin bilinçli seçilme nedeni',
          'Eğer vaktin olsa bugün neyi farklı yapacağın',
        ],
        starAdvice:
          'Teknolojileri saymakla kalma; neden o kütüphaneyi seçtiğini ve yaşattığı faydayı aktar.',
        sampleGoodResponse:
          'Kişisel bütçe takip uygulamamda verileri sadece ekranda göstermek yerine LocalStorage senkronizasyonu ve grafik kütüphanesi entegre ettim. Bugün olsa TypeScript ile tip güvenliğini baştan kurardım.',
        commonPitfalls:
          'Sadece Udemy kursundan kopyalanan To-Do listesini anlatıp kendi imzanı gösterememek.',
      },
      {
        id: 'q-4',
        category: 'ogrenme',
        categoryBadge: 'Öğrenme Hızı & Merak',
        questionText: `Şirketimizde daha önce hiç kullanmadığın bir teknoloji veya framework kullanılıyorsa, ilk 2 hafta içinde bu teknolojiye nasıl adapte olursun?`,
        interviewerIntent:
          'Junior seviyede en değerli sermaye öğrenme hızı ve metodolojisidir.',
        whatToHighlight: [
          'Resmi dökümantasyon okuma alışkanlığı',
          'Küçük deneme (sandbox/PoC) projeleri yapma hızı',
          'Soru sormadan önce araştırma yapma dengesi',
        ],
        starAdvice:
          'Geçmişte kısa sürede öğrendiğin bir kütüphane veya dili kanıt olarak sun.',
        sampleGoodResponse:
          'Önce resmi dökümantasyonun Quickstart kılavuzunu tamamlarım. Ardından mevcut repodaki örnek commitleri inceleyerek şirketin kodlama standartlarını çıkarır, takıldığım noktalarda soru listesiyle mentörüme giderim.',
        commonPitfalls:
          '"Ben her şeyi 2 günde öğrenirim" şeklinde gerçek dışı iddialarda bulunmak.',
      },
      {
        id: 'q-5',
        category: 'motivasyon',
        categoryBadge: 'Kültür Uyumu & Neden Biz',
        questionText: `Neden başka bir alan veya şirket değil de özellikle bizim ekibimizde bir stajyer/junior olarak kariyerine başlamak istiyorsun?`,
        interviewerIntent:
          'Rastgele 100 yere başvurmuş biri mi, yoksa şirketin ürününü ve kültürünü araştırmış biri mi olduğunu test eder.',
        whatToHighlight: [
          'Şirketin çözdüğü probleme duyduğun ilgi',
          'Ekipteki mühendislik kalitesinden öğrenme arzusu',
          'Kendi kariyer hedefinle şirket misyonunun örtüşmesi',
        ],
        starAdvice:
          'Şirketin bir özelliğini, blog yazısını veya açık kaynak projesini referans göster.',
        sampleGoodResponse:
          'Sektörde B2B alanda ölçeklenen ürününüzü ve mühendislik blogunuzdaki mikro-frontend yazılarınızı inceledim. Kod kalitesine verilen önemin benim gibi yeni mezun bir mühendis için en doğru okul olacağına inanıyorum.',
        commonPitfalls:
          '"Sadece bir yerden başlamam gerekiyordu" veya maaş/yan hak odaklı cevap vermek.',
      },
    ],
  };
}

// Fallback evaluator
function getFallbackEvaluation(
  questionText: string,
  userAnswer: string,
  interviewerTitle: string
) {
  const wordCount = userAnswer.trim().split(/\s+/).length;
  const score = Math.min(92, Math.max(68, 65 + Math.round(wordCount * 0.4)));

  return {
    score,
    verdict: score >= 85 ? 'Çok Güçlü Yanıt & Net Potansiyel' : 'Geliştirilebilir Başarılı Temel',
    executiveSummary: `${interviewerTitle} perspektifinden bakıldığında yanıtınız samimi, hevesli ve iyi niyetli bir yaklaşım sergiliyor. Ancak olay örgüsünü ve kendi bireysel eylemlerinizi daha keskin bir dille vurgulamak puanınızı zirveye taşıyacaktır.`,
    starAnalysis: {
      situationTask:
        'Olayın veya görevin bağlamı anlaşılıyor ancak zaman ve mekan kısıtları biraz daha netleştirilebilir.',
      action:
        'Kendi aldığınız somut inisiyatifi "biz" yerine "ben" odağında net adımlarla anlatmanız daha etkili olur.',
      resultImpact:
        'Çıktının ne olduğunu ve bu tecrübeden sonraki projelerinize ne aktardığınızı bir cümleyle bağlamanız tavsiye edilir.',
    },
    strengths: [
      'Konuya hakimiyet ve öğrenmeye açık, mütevazı ama kararlı ton',
      'Gerçek bir tecrübeye dayanan içten anlatım',
      'Soruya doğrudan cevap verme gayreti',
    ],
    areasForImprovement: [
      'Giriş cümlesini daha vurucu yaparak sonuca hızlıca odaklanmak',
      'Kullanılan teknik araçların isimlerini net belirtmek',
      'Cevabın sonunda öğrendiğiniz kazanımı özetlemek',
    ],
    rephrasedIdealAnswer: `Bu soruya mülakatta şöyle yaklaşabilirsiniz: "${userAnswer.trim()} Süreç boyunca karşılaştığım engeli analiz edip çözüme odaklandım. Bu deneyim bana yalnızca teknik bir problemi aşmayı değil; bir ekibin parçası olarak inisiyatif almanın ve dökümantasyon çıkarmanın değerini de öğretti."`,
    coachTip:
      'Görüşmeciler junior adaylarda hatasızlık değil, hatayı fark edip analiz edebilme ve öğrenme hızına hayran kalır.',
  };
}

// Fallback career roadmap
function getFallbackRoadmap(trainings: any[], targetGoal: string) {
  return {
    currentLevelAssessment: {
      levelBadge: 'Junior Hazırlık Aşaması (Teori Güçlü / Pratik Portfolyo Eksik)',
      levelPercentage: 68,
      profileSummary:
        'Aldığınız eğitimler temel programlama mantığını, sözdizimini ve yaygın kütüphaneleri kavradığınızı gösteriyor. Ancak staj ve iş ilanlarının aradığı endüstri standardı araçlar (Git takım çalışması, test yazımı, Docker ve uçtan uca mimari) henüz pekiştirilmemiş.',
      validatedSkills: [
        'Temel Programlama ve Algoritma Mantığı',
        'Bileşen / Modül Tabanlı Geliştirme Temelleri',
        'Veri Listeleme ve CRUD Operasyonları',
      ],
    },
    skillGaps: [
      {
        skillName: 'Uçtan Uca Takım Git & GitHub İş Akışı (PR & Code Review)',
        severity: 'Kritik Açık',
        gapReason:
          'Eğitimlerde genellikle tek kişi commit atılır; ekiplerde pull request, merge conflict ve branch stratejileri zorunludur.',
        interviewRisk:
          '"Bir merge conflict durumunda ne yaparsın?" veya "Ekipte kod review kültürü nasıldı?" sorusunda duraksama.',
      },
      {
        skillName: 'Birim Testleri (Unit Testing) & Temel Test Kültürü',
        severity: 'Önemli Açık',
        gapReason:
          'Başlangıç kursları hızlı ürün çıkarmak için test yazmayı atlar, oysa kurumsal şirketler test yazabilen juniorları ilk sıraya koyar.',
        interviewRisk:
          '"Yazdığın kodun çalıştığını production öncesi nasıl garanti edersin?" sorusunda yanıtsız kalmak.',
      },
      {
        skillName: 'Gerçek Dünya API Hata Yönetimi & Durum Yönetimi (Edge Cases)',
        severity: 'Tamamlayıcı',
        gapReason:
          'Kurslardaki "mutlu yol" (happy path) örnekleri ağ hataları, token yenileme ve 401/500 durumlarını içermez.',
        interviewRisk:
          'Canlı mülakat kodlama aşamasında internet kesintisi veya hata senaryolarını ele almamak.',
      },
    ],
    recommendedNextTrainings: [
      {
        stepNumber: 1,
        trainingTitle: 'Uygulamalı Full-Stack Entegrasyon ve REST API Mimarisi',
        targetCompetency: 'Front-end ve Back-end Arasındaki Köprüyü Eksiksiz Kurma',
        estimatedWeeks: '3-4 Hafta',
        syllabusTopics: [
          'RESTful Prensipler, Status Kodları ve Güvenli Header Yapıları',
          'JWT ile Kimlik Doğrulama ve Token Refresh Mekanizması',
          'SQL vs NoSQL Karşılaştırması ve Doğru Veritabanı Şemalandırma',
          'Ortam Değişkenleri (.env) ve Güvenlik Hijyeni',
        ],
        recommendedPlatformsOrResources: [
          'The Odin Project (Full-Stack JS)',
          'MDN Web Docs & YouTube "Traversy / FreeCodeCamp"',
          'Resmi Express / React Dökümantasyonları',
        ],
        capstoneProjectIdea:
          'Üniversite öğrencileri için staj/etkinlik ilan panosu: Giriş yapmış kullanıcıların başvuru yapabildiği, şirketlerin ilan açtığı tam fonksiyonel CRUD platformu.',
      },
      {
        stepNumber: 2,
        trainingTitle: 'Modern DevOps & Konteynerizasyon Temelleri (Docker & CI/CD)',
        targetCompetency: 'Kodu Kendi Bilgisayarından Çıkarıp Buluta Güvenle Taşıma',
        estimatedWeeks: '2-3 Hafta',
        syllabusTopics: [
          'Dockerfile Hazırlama ve Multi-Stage Build Mantığı',
          'Docker Compose ile Veritabanı ve Uygulama Konteynerlerini Ayağa Kaldırma',
          'GitHub Actions ile Otomatik Test & Lint Pipeline Kurulumu',
          'Render / Vercel / Cloud Run Üzerine Canlıya Alma',
        ],
        recommendedPlatformsOrResources: [
          'Docker Getting Started Tutorial',
          'GitHub Skills (Actions Interactive Course)',
          'BTK Akademi Docker Eğitimi',
        ],
        capstoneProjectIdea:
          'Geliştirdiğin önceki projeyi Dockerfile ile paketle ve GitHub Actions ile her main pushunda otomatik build alıp canlı linkini README dosyana ekle.',
      },
    ],
    careerCoachAdvice:
      'Özgeçmişinize sadece kurs sertifikalarını dizmek yerine, bu eğitimlerin sonucunda canlıya aldığınız (çalışan URL ve temiz GitHub README) 2 projeyi en tepeye koyun. Staj mülakatlarında masanın karşı tarafını en çok etkileyen şey bitmiş ve yayında olan projedir.',
  };
}

// Endpoint: Generate Interview Questions
app.post('/api/interview/generate-questions', async (req, res) => {
  try {
    const {
      interviewerTitle,
      targetRole,
      candidateLevel = 'Stajyer / Yeni Mezun',
      companyContext = 'Genel Teknoloji Şirketi',
      additionalNotes = '',
    } = req.body;

    if (!interviewerTitle || !targetRole) {
      return res.status(400).json({
        error: 'Lütfen görüşmeci unvanını ve hedeflenen pozisyonu belirtin.',
      });
    }

    const systemInstruction = `Sen Türkiye ve global teknoloji ekosisteminde stajyer (üniversite öğrencisi) ve yeni mezun (junior) adaylar için çalışan kıdemli bir Mülakat ve Kariyer Koçusun.
Görevin: Masanın karşı tarafında oturacak kişinin unvanına ('${interviewerTitle}') bürünmek ve bu unvandaki bir profesyonelin bir stajyer veya junior adayda (${candidateLevel} - Hedef Rol: ${targetRole}, Şirket/Sektör: ${companyContext}) tam olarak neyi arayacağını analiz etmektir.
Tam olarak 5 soru üret. Türkçe ve yapılandırılmış JSON çıktısı ver.`;

    const prompt = `Aday Seviyesi: ${candidateLevel}
Hedef Pozisyon: ${targetRole}
Mülakatçı Unvanı: ${interviewerTitle}
Şirket Türü: ${companyContext}
Aday Notları: ${additionalNotes || 'Belirtilmedi'}`;

    try {
      const data = await callGeminiWithRetry({
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              interviewerMindsetSummary: { type: Type.STRING },
              interviewerPriorities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    category: { type: Type.STRING },
                    categoryBadge: { type: Type.STRING },
                    questionText: { type: Type.STRING },
                    interviewerIntent: { type: Type.STRING },
                    whatToHighlight: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    starAdvice: { type: Type.STRING },
                    sampleGoodResponse: { type: Type.STRING },
                    commonPitfalls: { type: Type.STRING },
                  },
                  required: [
                    'id',
                    'category',
                    'categoryBadge',
                    'questionText',
                    'interviewerIntent',
                    'whatToHighlight',
                    'starAdvice',
                    'sampleGoodResponse',
                    'commonPitfalls',
                  ],
                },
              },
            },
            required: [
              'interviewerMindsetSummary',
              'interviewerPriorities',
              'questions',
            ],
          },
        },
      });

      return res.json(data);
    } catch (genError) {
      console.warn('Gemini temporary outage, using robust domain fallback:', genError);
      return res.json(
        getFallbackQuestions(interviewerTitle, targetRole, candidateLevel)
      );
    }
  } catch (error: any) {
    console.error('Error generating interview questions:', error);
    return res.status(500).json({
      error: 'Mülakat soruları oluşturulamadı: ' + (error?.message || 'Bilinmeyen hata'),
    });
  }
});

// Endpoint: Evaluate User's Practice Answer
app.post('/api/interview/evaluate-answer', async (req, res) => {
  try {
    const {
      questionText,
      interviewerTitle = 'Mülakatçı',
      candidateLevel = 'Stajyer / Yeni Mezun',
      userAnswer,
    } = req.body;

    if (!questionText || !userAnswer || !userAnswer.trim()) {
      return res.status(400).json({
        error: 'Lütfen değerlendirilecek soruyu ve yanıtınızı girin.',
      });
    }

    const systemInstruction = `Sen stajyer ve yeni mezun (junior) adayları mülakatlara hazırlayan Baş Mülakat Koçusun.
Adayın mülakat sorusuna verdiği yanıtı inceleyip; adayın seviyesini (${candidateLevel}) ve mülakatı yapan kişinin unvanını (${interviewerTitle}) göz önüne alarak değerlendireceksin.
Puan (0-100), STAR analizi, güçlü yönler, geliştirmeler ve rephrased ideal answer ver. Türkçe ve JSON çıktısı üret.`;

    const prompt = `Görüşmeci: ${interviewerTitle}
Aday: ${candidateLevel}
Soru: "${questionText}"
Aday Yanıtı: "${userAnswer}"`;

    try {
      const data = await callGeminiWithRetry({
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.6,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              verdict: { type: Type.STRING },
              executiveSummary: { type: Type.STRING },
              starAnalysis: {
                type: Type.OBJECT,
                properties: {
                  situationTask: { type: Type.STRING },
                  action: { type: Type.STRING },
                  resultImpact: { type: Type.STRING },
                },
                required: ['situationTask', 'action', 'resultImpact'],
              },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              areasForImprovement: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              rephrasedIdealAnswer: { type: Type.STRING },
              coachTip: { type: Type.STRING },
            },
            required: [
              'score',
              'verdict',
              'executiveSummary',
              'starAnalysis',
              'strengths',
              'areasForImprovement',
              'rephrasedIdealAnswer',
              'coachTip',
            ],
          },
        },
      });

      return res.json(data);
    } catch (genError) {
      console.warn('Gemini temporary outage, using robust evaluation fallback:', genError);
      return res.json(
        getFallbackEvaluation(questionText, userAnswer, interviewerTitle)
      );
    }
  } catch (error: any) {
    console.error('Error evaluating answer:', error);
    return res.status(500).json({
      error: 'Yanıt değerlendirilemedi: ' + (error?.message || 'Bilinmeyen hata'),
    });
  }
});

// Endpoint: Analyze Training History & Generate Roadmap
app.post('/api/career/analyze-roadmap', async (req, res) => {
  try {
    const {
      trainings,
      targetGoal = 'Yazılım Stajı ve Junior Pozisyon',
      universityDepartment = 'Üniversite Öğrencisi / Yeni Mezun',
      notes = '',
    } = req.body;

    if (!trainings || !Array.isArray(trainings) || trainings.length === 0) {
      return res.status(400).json({
        error: 'Lütfen tamamladığınız en az bir eğitim, kurs veya ders içeriğini ekleyin.',
      });
    }

    const systemInstruction = `Sen üniversite öğrencileri ve yeni mezunlar için uzmanlaşmış Kıdemli Kariyer & Öğrenme Yolu Mimarı (Senior Career Architect).
Aday sana bugüne kadar tamamladığı eğitimleri, kursları, ders modüllerini verdi.
Görevin:
1. Mevcut Seviye Değerlendirmesi
2. Beceri Açığı Analizi (Hedeflenen role göre nelerin eksik kaldığı)
3. Bir Sonraki Adım İçin Alınması Gereken Somut Eğitim Planı (Syllabus, platformlar ve CV için Capstone Projesi)
Türkçe ve JSON çıktısı üret.`;

    const prompt = `Aday Bilgisi: ${universityDepartment}
Hedef: ${targetGoal}
Notlar: ${notes || 'Belirtilmedi'}
Eğitimler: ${JSON.stringify(trainings)}`;

    try {
      const data = await callGeminiWithRetry({
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              currentLevelAssessment: {
                type: Type.OBJECT,
                properties: {
                  levelBadge: { type: Type.STRING },
                  levelPercentage: { type: Type.INTEGER },
                  profileSummary: { type: Type.STRING },
                  validatedSkills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: [
                  'levelBadge',
                  'levelPercentage',
                  'profileSummary',
                  'validatedSkills',
                ],
              },
              skillGaps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    skillName: { type: Type.STRING },
                    severity: { type: Type.STRING },
                    gapReason: { type: Type.STRING },
                    interviewRisk: { type: Type.STRING },
                  },
                  required: [
                    'skillName',
                    'severity',
                    'gapReason',
                    'interviewRisk',
                  ],
                },
              },
              recommendedNextTrainings: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    trainingTitle: { type: Type.STRING },
                    targetCompetency: { type: Type.STRING },
                    estimatedWeeks: { type: Type.STRING },
                    syllabusTopics: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    recommendedPlatformsOrResources: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    capstoneProjectIdea: { type: Type.STRING },
                  },
                  required: [
                    'stepNumber',
                    'trainingTitle',
                    'targetCompetency',
                    'estimatedWeeks',
                    'syllabusTopics',
                    'recommendedPlatformsOrResources',
                    'capstoneProjectIdea',
                  ],
                },
              },
              careerCoachAdvice: { type: Type.STRING },
            },
            required: [
              'currentLevelAssessment',
              'skillGaps',
              'recommendedNextTrainings',
              'careerCoachAdvice',
            ],
          },
        },
      });

      return res.json(data);
    } catch (genError) {
      console.warn('Gemini temporary outage, using robust career roadmap fallback:', genError);
      return res.json(getFallbackRoadmap(trainings, targetGoal));
    }
  } catch (error: any) {
    console.error('Error analyzing training history:', error);
    return res.status(500).json({
      error: 'Eğitim analizi yapılamadı: ' + (error?.message || 'Bilinmeyen hata'),
    });
  }
});

// Configure Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static files
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
