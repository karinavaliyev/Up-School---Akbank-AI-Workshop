# Mülakat & Kariyer Koçu Agent (AI Interview & Career Coaching Studio)

Mülakat katılımcısının unvanına göre hedefe yönelik potansiyel mülakat soruları üreten, interaktif sesli/yazılı simülasyon sunan ve tamamlanan eğitim içeriklerini analiz ederek seviye tespiti, beceri açığı analizi ve kişiselleştirilmiş sonraki adım eğitim yol haritası çıkaran profesyonel kariyer platformu.

### User Review & Critical Decisions

> [!IMPORTANT]
> Kullanıcı tercihleri doğrultusunda belirlenen kritik mimari ve deneyim kararları:

- **Confirmed Decision 1 (Mülakat Deneyimi)**: Kullanıcı "Soru listesi ve interaktif sesli veya yazili pratik modu"nu seçti. Sorular yalnızca listelenmekle kalmayacak; her soru için adayın sesli (Web Speech API) veya yazılı olarak yanıt verebileceği, yapay zekanın STAR metodu, teknik derinlik ve iletişim puanı üzerinden anlık yapıcı geri bildirim ve ideal örnek cevap üreteceği interaktif bir pratik stüdyosu kurulacak.
- **Confirmed Decision 2 (Eğitim & Kariyer Analizi Derinliği)**: Kullanıcı "Beceri açığı analizi, seviye karşılaştırması ve somut eğitim yol haritası" bileşimini istedi. Tamamlanan eğitim içeriklerinden mevcut yetkinlik seviyesi haritalanacak, hedeflenen kariyer için eksik kalan beceri açıkları (skill gaps) listelenecek ve bir sonraki adım için alınması gereken spesifik eğitim konuları, müfredat başlıkları ve bitirme projeleri önerilecek.
- **Confirmed Decision 3 (Tasarım Dili)**: Modern ve profesyonel kurumsal tasarım seçildi. Gece mavisi ve koyu arduvaz (Slate-900/950) zemin, temiz kart yüzeyleri, indigo/kobalt aksan tonları, 60-30-10 renk dengesi, net tipografik hiyerarşi ve sıfır-hap (zero-pill) disiplini uygulanacak.

---

### 1. Overview & Core Concept

- **What It Does**: 
  1. **Katılımcı Unvanına Göre Mülakat Soruları**: Mülakata katılacak kişinin unvanı (örn. "Engineering Manager", "HR Director", "CTO", "Head of Product", "Senior Data Scientist"), şirketin sektörü ve adayın hedef pozisyonu girildiğinde; o kişinin bakış açısıyla sorulabilecek soruları, bu soruların sorulma amacını ve STAR modeline uygun ideal yanıt ipuçlarını kategorize edilmiş biçimde üretir.
  2. **İnteraktif Pratik ve Sesli/Yazılı Değerlendirme**: Seçilen soruyu adayın sesle veya klavyeyle cevaplamasına olanak tanır. Gemini 3.8 modeli adayın yanıtını değerlendirir; 1-100 arası yetkinlik puanı, güçlü yönler, geliştirilmesi gereken noktalar ve rafine edilmiş ideal örnek cevabı sunar.
  3. **Eğitim İçeriği Analizi & Sonraki Adım Eğitim Koçluğu**: Kullanıcının geçmişte aldığı bootcamp, kurs, üniversite modülleri veya sertifika içeriklerini metin veya hızlı şablonlarla alarak mevcut seviyesini (Junior / Mid / Senior / Specialist) analiz eder; endüstri standartlarına göre eksik olan becerileri (skill gaps) tespit eder ve bir sonraki adımda alması gereken nokta atışı eğitim yol haritasını (konu başlıkları, platform/kaynak önerileri ve portfolyo projesi) sunar.
- **Target Audience / Persona**: Mülakatlara hazırlanan yazılımcılar, ürün yöneticileri, tasarımcılar, veri uzmanları ve kariyerinde bir üst seviyeye geçmek veya rol değiştirmek için doğru eğitim yatırımını yapmak isteyen tüm profesyoneller.
- **Key Value**: Mülakatta masanın karşı tarafında oturan kişinin psikolojisini ve beklentilerini anlamak, gerçek zamanlı geri bildirimle pratik yapmak ve gereksiz eğitimler arasında kaybolmadan en yüksek getirili sonraki adımı belirlemek.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Flow A - Mülakat Sorusu Üretimi & Pratik Modu**:
     - Kullanıcı "Mülakat Simülatörü" sekmesinde görüşmeci unvanını (örn. *Engineering Manager*), hedef pozisyonunu (örn. *Senior Frontend Developer*) ve varsa şirket/sektör bilgisini girer. Hızlı seçim için popüler unvan çipleri/şablonları sunulur.
     - "Soruları Üret" butonuna basıldığında sistem kategorize edilmiş soru kartlarını oluşturur: Teknik Derinlik, Davranışsal & STAR, Kriz & Çatışma Yönetimi, Kültür & Vizyon.
     - Kullanıcı herhangi bir soru kartında "Bu Soruyu Pratik Yap" butonuna basarak Pratik Modunu açar.
     - Kullanıcı mikrofon butonuna basarak sesli konuşabilir (anlık konuşma-metin dökümü) veya yazılı yanıtını girer.
     - "Yanıtımı Değerlendir" butonuna bastığında Gemini yanıtı puanlar, STAR kriterlerini inceler, kritik eksikleri belirtir ve örnek mükemmel yanıtı oluşturur.
  2. **Flow B - Eğitim Geçmişi Analizi & Gelecek Eğitim Yol Haritası**:
     - Kullanıcı "Kariyer & Eğitim Yol Haritası" sekmesinde bugüne kadar aldığı eğitimleri, sertifikaları ve içeriklerini girer (hızlı deneme için önceden hazırlanmış 3 hazır eğitim profili bulunur).
     - Hedeflediği sonraki kariyer adımını (örn. *Staff Engineer*, *Lead Product Manager*, *Senior Cloud Architect*) belirtir.
     - "Analiz Et & Yol Haritası Çıkar" butonuna tıklandığında:
       - **Mevcut Seviye Teşhisi**: Yetkinlik seviyesi, güçlü temeller ve örtüşen kazanımlar.
       - **Beceri Açığı Matrisi**: Hedef rol için eksik olan kritik teorik ve pratik kaslar.
       - **Önerilen Bir Sonraki Eğitim Paketi**: Alınması gereken eğitimin adı, kapsayacağı modüller, haftalık çalışma planı ve bu eğitimin getireceği somut yetkinlikler.
       - **Tavsiye Edilen Bitirme Projesi**: CV ve portföyde sergilenecek pratik uygulama senaryosu.
  3. **Flow C - Kayıt & Dışa Aktarma**:
     - Kullanıcı hazırladığı soruları, pratik geri bildirimlerini ve eğitim yol haritasını Markdown veya yazdırılabilir formatta dışa aktarabilir; geçmiş pratikleri LocalStorage üzerinde saklanır.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Üst düzey kurumsal yönetim danışmanlığı ve executive coaching platformu hissi veren modern, minimalist ve yüksek odaklı çalışma alanı.
  - *Color Palette*:
    - Tuval (Canvas): Slate-950 (`#090D16`) ve derin kömür mavisi Slate-900 (`#0F172A`)
    - Yüzeyler (Cards/Containers): Slate-800/90` (`#1E293B`) ve ince sınır çizgileri (`border-slate-800/80`)
    - Vurgu (Accent): Canlı İndigo (`#6366F1`) ve Zümrüt Başarı Yeşili (`#10B981`)
    - Tipografi: Beyaz (`#F8FAFC`) başlıklar, Slate-300 gövde metinleri, Slate-400 açıklama ve etiketler.
  - *Typography & Hierarchy*:
    - Başlıklar: Plus Jakarta Sans / Outfit (temiz, geometrik, otoriter kurumsal başlıklar).
    - Gövde: Inter / DM Sans (yüksek okunabilirlik, rahat satır aralıkları).
    - Metrikler ve zamanlayıcılar: Tabular figures (`tabular-nums font-mono`).
  - *Anti-Slop Restraints*:
    - Asla rastgele statik hap/hapçık (pill) etiketleri veya parlak pembe/mor degradeler kullanılmayacak.
    - Sahte derleyici/telemetri satırları ("LATENCY: 12ms", "SYS_VERIFIED") olmayacak.
    - Metadatalar nokta ayracıyla (`·`) temiz tipografik hiyerarşide sunulacak.

---

### 3. Key Product Decisions & Trade-Offs

- **Server-Side Gemini API Entegrasyonu**:
  - *Yaklaşım*: Vite backend proxy veya express proxy ile `/api/interview/generate-questions`, `/api/interview/evaluate-answer` ve `/api/career/analyze-roadmap` uç noktaları üzerinden `gemini-3.8-flash` çağrılacak. API anahtarı istemciye asla sızdırılmayacak.
  - *Gerekçe*: Güvenlik kuralı ve AI Studio mimarisi gereği server-side @google/genai SDK çağrısı esastır. `gemini-3.8-flash` hem düşük gecikme hem de derin yapısal analiz için en ideal modeldir.
- **Web Speech API & Yazılı Giriş Hibriti**:
  - *Yaklaşım*: Tarayıcının yerel `webkitSpeechRecognition` / `SpeechRecognition` API'si ile sıfır harici bağımlılıkla Türkçe ve İngilizce canlı konuşma-metin desteği sağlanacak. Mikrofon izni verilemediğinde ya da desteklenmediğinde kullanıcı kesintisiz şekilde klavye ile yazmaya devam edebilecek.
- **Tek Noktadan Şablon & Örnek Yükleme Kolaylığı**:
  - *Yaklaşım*: Kullanıcının vakit kaybetmeden sistemi test edebilmesi için "Engineering Manager", "HR Specialist", "Lead Data Scientist", "Senior Product Manager" gibi hazır görüşmeci profilleri ile "Full-Stack Bootcamp Mezunu", "Veri Analizi Sertifika Programı" gibi hazır eğitim geçmişi setleri sunulacak.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Tarayıcı (React 19 + Tailwind v4)              │
│                                                                        │
│  ┌───────────────────────┐  ┌──────────────────────┐  ┌─────────────┐ │
│  │ Mülakat Soru &        │  │ Sesli & Yazılı       │  │ Eğitim &    │ │
│  │ Simülatör Sekmesi     │  │ Pratik Stüdyosu      │  │ Yol Haritası│ │
│  └───────────┬───────────┘  └──────────┬───────────┘  └──────┬──────┘ │
│              │                         │                     │        │
│              ▼                         ▼                     ▼        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ State Yönetimi (Mülakat Soruları, Yanıtlar, Değerlendirmeler,     │  │
│  │ Eğitim Geçmişi, LocalStorage Senkronizasyonu)                    │  │
│  └─────────────────────────────────┬────────────────────────────────┘  │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │ fetch /api/...
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│              Node.js / Express Server-Side Proxy (server.ts)            │
│                                                                        │
│  POST /api/interview/generate-questions                                │
│  POST /api/interview/evaluate-answer                                  │
│  POST /api/career/analyze-roadmap                                      │
│                                                                        │
│  Google GenAI SDK (gemini-3.8-flash, structured JSON Type schema)      │
│  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }          │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Google Gemini 3.8 Flash                           │
└────────────────────────────────────────────────────────────────────────┘
```

- **Data Models**:
  - `InterviewQuestion`: id, category ('technical' | 'behavioral' | 'scenario' | 'culture'), questionText, interviewerIntent (neden soruluyor), evaluationCriteria (aranan ipuçları), starModelGuide, sampleGoodResponse.
  - `EvaluationResult`: score (0-100), overallFeedback, starBreakdown (Situation, Task, Action, Result analizi), strengths, areasForImprovement, refinedAnswer (mükemmelleştirilmiş versiyon).
  - `TrainingItem`: id, title, provider, completedTopics (öğrenilen konular), durationWeeks, keySkillsAcquired.
  - `CareerProgressionResult`: currentLevelAssessment, levelBenchmarkSummary, identifiedSkillGaps, recommendedNextCourses (kurs başlığı, kapsaması gereken modüller, gerekçe, süre), portfolioProjectProposal, longTermVision.

- **State & Error Handling**:
  - Form validasyonları ve yükleme durumları (skeleton animasyonları, net hata mesajları).
  - Ağ hatalarında kullanıcıya anlaşılır Türkçe yönlendirmeler.
  - Tamamen duyarlı (responsive) 1440px desktop baseline ve mobil uyumlu kart hiyerarşisi.
