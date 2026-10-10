import { TrainingItem } from '../types';

export interface InterviewPreset {
  id: string;
  label: string;
  interviewerTitle: string;
  targetRole: string;
  candidateLevel: 'Stajyer (Üniversite Öğrencisi)' | 'Yeni Mezun / Junior';
  companyContext: string;
  notes: string;
}

export const INTERVIEW_PRESETS: InterviewPreset[] = [
  {
    id: 'em-frontend-intern',
    label: 'Engineering Manager · Frontend Stajyeri',
    interviewerTitle: 'Engineering Manager (Yazılım Mühendisliği Müdürü)',
    targetRole: 'Frontend Web Geliştirici Stajyeri',
    candidateLevel: 'Stajyer (Üniversite Öğrencisi)',
    companyContext: 'B2B SaaS Teknoloji Şirketi',
    notes: 'Üniversite 3. sınıf öğrencisiyim. Okulda C++ ve Java aldım; kendi merakımla React ve Tailwind öğrendim. Küçük bir hava durumu uygulaması projem var.',
  },
  {
    id: 'hr-junior-swe',
    label: 'İnsan Kaynakları · Yeni Mezun Yazılımcı',
    interviewerTitle: 'Kıdemli İnsan Kaynakları & Yetenek Kazanımı Uzmanı',
    targetRole: 'Yeni Mezun Yazılım Mühendisi (Junior Software Engineer)',
    candidateLevel: 'Yeni Mezun / Junior',
    companyContext: 'Kurumsal Finans / Banka Teknoloji Merkezi',
    notes: 'Bilgisayar Mühendisliği yeni mezunuyum. Bitirme tezimde mikroservis mimarisi üzerine çalıştım. Ekip içinde öğrenmeye ve mentörlük almaya çok açığım.',
  },
  {
    id: 'techlead-backend',
    label: 'Tech Lead · Junior Backend',
    interviewerTitle: 'Kıdemli Backend Ekip Lideri (Tech Lead)',
    targetRole: 'Junior Backend Developer (Node.js / Go)',
    candidateLevel: 'Yeni Mezun / Junior',
    companyContext: 'Hızlı Büyüyen E-Ticaret Startup',
    notes: 'REST API tasarımları, PostgreSQL ve Docker temellerini biliyorum. Ancak büyük ölçekli ve yüksek trafikli sistemlerde henüz profesyonel tecrübem yok.',
  },
  {
    id: 'lead-data-intern',
    label: 'Lead Data Scientist · Veri Bilimi Stajyeri',
    interviewerTitle: 'Lead Data Scientist (Veri Bilimi Ekip Lideri)',
    targetRole: 'Veri Analitiği & Yapay Zeka Stajyeri',
    candidateLevel: 'Stajyer (Üniversite Öğrencisi)',
    companyContext: 'Yapay Zeka & Büyük Veri Ajansı',
    notes: 'Endüstri Mühendisliği 4. sınıf. Python, Pandas, Matplotlib biliyorum; Kaggle yarışmalarına katıldım. SQL sorguları yazabiliyorum.',
  },
  {
    id: 'pm-product-intern',
    label: 'Head of Product · Ürün Stajyeri',
    interviewerTitle: 'Head of Product (Ürün Direktörü)',
    targetRole: 'Ürün Yönetimi & İş Analitiği Stajyeri',
    candidateLevel: 'Stajyer (Üniversite Öğrencisi)',
    companyContext: 'Mobil Uygulama & SaaS Şirketi',
    notes: 'YBS öğrencisiyim. Figma ile prototipleme, kullanıcı görüşmeleri ve temel Agile/Scrum kavramlarına hakimim.',
  },
];

export interface TrainingProfilePreset {
  id: string;
  label: string;
  department: string;
  targetGoal: string;
  trainings: TrainingItem[];
  notes: string;
}

export const TRAINING_PROFILE_PRESETS: TrainingProfilePreset[] = [
  {
    id: 'cs-student-frontend',
    label: 'Bilgisayar Mühendisliği 3. Sınıf (Frontend Stajı Arayan)',
    department: 'Bilgisayar Mühendisliği 3. Sınıf',
    targetGoal: 'Yaz Dönemi İçin Frontend Geliştirici Stajı Bulmak',
    notes: 'Okulda teori ve C++ ağırlıklı gittik. Kendi çabamla frontend öğrenmeye çalışıyorum ama neyin eksik olduğunu tam göremiyorum.',
    trainings: [
      {
        id: 't-1',
        title: 'Üniversite: Nesne Yönelimli Programlama & Veri Yapıları',
        provider: 'Üniversite Dersi (2 Dönem)',
        topicsCovered: 'C++, Bellek yönetimi, Bağlı listeler, Ağaçlar, Algoritma karmaşıklığı (Big O), OOP prensipleri',
        duration: '28 Hafta',
        skillsGained: 'Algoritmik düşünme, temel veri yapıları, C++',
      },
      {
        id: 't-2',
        title: 'Modern JavaScript (ES6+) ve HTML/CSS Web Geliştirme',
        provider: 'BTK Akademi & YouTube',
        topicsCovered: 'DOM Manipülasyonu, Flexbox, Grid, Async/Await, Fetch API, LocalStorage, Temel Responsive Tasarım',
        duration: '6 Hafta',
        skillsGained: 'Temel JavaScript, Web sayfaları hazırlama',
      },
      {
        id: 't-3',
        title: 'Sıfırdan İleri Seviyeye React & Redux Toolkit Eğitimi',
        provider: 'Udemy Online Kurs',
        topicsCovered: 'React Bileşenleri, useState, useEffect, Custom Hooks, Context API, Redux Toolkit, React Router',
        duration: '5 Hafta',
        skillsGained: 'Tek sayfa uygulama (SPA) geliştirme, React temelleri',
      },
    ],
  },
  {
    id: 'new-grad-backend',
    label: 'Yeni Mezun Yazılımcı (Junior Backend İşi Arayan)',
    department: 'Yazılım Mühendisliği Yeni Mezun',
    targetGoal: 'Kurumsal veya Startup Şirkette Junior Backend Developer Olarak İşe Başlamak',
    notes: 'Okul bitti, küçük CRUD projeleri yaptım ama iş ilanlarında istenen CI/CD, Docker ve bulut teknolojilerini bilmiyorum.',
    trainings: [
      {
        id: 't-4',
        title: 'Node.js, Express & MongoDB ile RESTful API Geliştirme',
        provider: 'Udemy Sertifika Programı',
        topicsCovered: 'Express route yapıları, Mongoose ODM, JWT Kimlik Doğrulama, Hata yakalama middleware, CRUD işlemleri',
        duration: '8 Hafta',
        skillsGained: 'REST API yazabilme, MongoDB kullanımı, Node.js',
      },
      {
        id: 't-5',
        title: 'İlişkisel Veritabanları ve İleri SQL Sorgulama',
        provider: 'Coursera & Üniversite Dersi',
        topicsCovered: 'PostgreSQL, JOIN türleri, İndeksleme temelleri, Normalizasyon kuralları, Gruplama ve Aggregate fonksiyonlar',
        duration: '6 Hafta',
        skillsGained: 'SQL sorguları, Tablo ilişkileri',
      },
      {
        id: 't-6',
        title: 'Git & GitHub ile Versiyon Kontrolü Atölyesi',
        provider: 'Öğrenci Kulübü Hackathon Öncesi Eğitimi',
        topicsCovered: 'Git commit, push, pull, branch açma, merge etme, pull request oluşturma',
        duration: '1 Hafta',
        skillsGained: 'Temel Git komutları',
      },
    ],
  },
  {
    id: 'data-analyst-intern',
    label: 'İktisat/Endüstri Mezunu (Junior Veri Analisti Arayan)',
    department: 'Endüstri Mühendisliği / İktisat',
    targetGoal: 'Junior Veri Analisti veya İş Zekası (BI) Stajyeri Olmak',
    notes: 'Excel ve temel Python biliyorum. Veri dünyasına geçiş yapmak için hangi araçları öğrenmem gerektiğinden emin değilim.',
    trainings: [
      {
        id: 't-7',
        title: 'Python for Data Science and Machine Learning Bootcamp',
        provider: 'Coursera & Datacamp',
        topicsCovered: 'NumPy dizileri, Pandas DataFrame manipülasyonu, Matplotlib ve Seaborn ile görselleştirme, Scikit-learn ile lineer regresyon',
        duration: '10 Hafta',
        skillsGained: 'Veri temizleme, keşifçi veri analizi (EDA), Python',
      },
      {
        id: 't-8',
        title: 'İleri Düzey Excel ve Veri Modelleme',
        provider: 'LinkedIn Learning',
        topicsCovered: 'Pivot Tablolar, VLOOKUP, XLOOKUP, INDEX-MATCH, Power Query ile veri birleştirme, Dashboard tasarımı',
        duration: '4 Hafta',
        skillsGained: 'İleri Excel, Veri özetleme',
      },
    ],
  },
];
