# CareerCompass 🧭

<div align="center">
  <img src="./frontend/public/assets/images/careercompass.png" alt="CareerCompass Logo" width="1200"/>
  
  ### Profesyonel Yolculuğunuzda Rehberiniz
  
  *[English](./README.md) | [Türkçe](#turkish)*
</div>

---

<a name="turkish"></a>

### CareerCompass Hakkında

CareerCompass, iş arayanların profesyonel yolculuklarında güvenle ilerlemelerine yardımcı olan yapay zeka destekli bir kariyer rehberlik platformudur. Gelişmiş yapay zeka teknolojileri ve vektör arama yetenekleri sayesinde kişiselleştirilmiş iş eşleştirme, CV analizi ve akıllı kariyer önerileri sunuyoruz.

**Misyonumuz:** Profesyonellere veri odaklı içgörüler ve yapay zeka destekli rehberlik sağlayarak kariyer geçişlerini daha sorunsuz ve iş aramalarını daha etkili hale getirmek.

### Temel Özellikler

🎯 **Yapay Zeka Destekli İş Arama** - Semantik anlama kullanan doğal dil iş arama  
📄 **Akıllı CV Analizi** - CV'nizi iş ilanlarıyla yapay zeka destekli içgörülerle karşılaştırın  
🔍 **Akıllı İş Eşleştirme** - Becerilerinize ve deneyiminize uygun işleri bulun  
📚 **Öğrenme Önerileri** - Kişiselleştirilmiş kurs ve kaynak önerileri alın  
🌐 **Çoklu Kaynak Entegrasyonu** - LinkedIn ve diğer platformlardan iş ilanlarını çekin ve analiz edin  

---

### 🏗️ Teknik Mimari

CareerCompass modern ve ölçeklenebilir bir mimariyle inşa edilmiştir:

#### Backend Teknolojileri
- **FastAPI** - Yüksek performanslı Python web framework'ü
- **Superlinked** - Karmaşık veri ilişkileri için unified embedding'ler sağlayan gelişmiş multi-modal vektör framework'ü
- **Qdrant** - Ölçeklenebilir benzerlik araması ve semantik erişim için optimize edilmiş yüksek performanslı vektör veritabanı
- **Groq/OpenAI** - Akıllı analiz için LLM entegrasyonu
- **Docker** - Container'lı dağıtım

#### Frontend Teknolojileri
- **Next.js 16** - Sunucu taraflı render'lama ile React framework'ü
- **React 19** - Concurrent özellikleri olan en son React
- **Tailwind CSS 4** - Modern utility-first CSS framework'ü
- **Radix UI** - Erişilebilir bileşen primitifleri
- **Framer Motion** - Akıcı animasyonlar
- **Axios** - API iletişimi için HTTP istemcisi

#### Yapay Zeka & Veri İşleme
- **Superlinked Vektör Arama** - Doğal dil kullanarak semantik iş eşleştirme
- **LLM Entegrasyonu** - CV analizi ve öneriler
- **Web Scraping** - LinkedIn ve GitHub veri çıkarma
- **Kaggle Veri Setleri** - İş ilanı veri toplama

**Kullanılan AI Modelleri:**
- **Llama 3.3 70B Versatile** - CV analizi ve öneriler için birincil LLM (Groq üzerinden)
- **Llama 4 Maverick 17B 128e Instruct** - Semantik arama için doğal dil sorgu işleme
- **IBM Granite Embedding Small English R2** - Vektör arama için metin embedding

---

### 🚀 Kurulum Kılavuzu

CareerCompass'ı yerel makinenizde kurmak için aşağıdaki adımları izleyin:

#### Ön Gereksinimler
- Python 3.12+
- Node.js 18+
- Docker & Docker Compose
- (Opsiyonel) CUDA desteği olan NVIDIA GPU

#### Adım 1: Repository'yi Klonlayın
```bash
git clone https://github.com/Llamallience/hackathon-final.git
cd hackathon-final
```

#### Adım 2: Python Ortamı Oluşturun
```bash
# Python 3.12 sanal ortamı oluşturun
python -m venv venv

# Ortamı aktif edin
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# Windows (Command Prompt):
.\venv\Scripts\activate.bat

# Linux/Mac:
source venv/bin/activate

# Backend bağımlılıklarını yükleyin
cd backend
pip install -r requirements.txt
```

#### Adım 3: İş Verilerini İndirin
```bash
# Kaggle'dan iş veri setlerini çekmek için downloader scriptini çalıştırın
python scripts/downloader.py
```

**⚠️ Doğrulama:** `backend/data/jobs.csv` dosyasının başarıyla oluşturulduğunu kontrol edin. Bu dosya birden fazla Kaggle veri setinden birleştirilmiş iş ilanlarını içermelidir.

#### Adım 4: İş Verilerini Normalize Edin
```bash
# İş verilerini işleyin ve normalize edin
python scripts/normalize_jobs.py
```

**⚠️ Doğrulama:** `backend/data/schema.json` dosyasının başarıyla oluşturulduğunu kontrol edin. Bu dosya kategorize edilmiş iş meta verilerini içerir.

#### Adım 5: Docker Servislerini Başlatın

**Seçenek A - NVIDIA GPU Kullanıcıları İçin:**
```bash
# GPU optimize edilmiş docker-compose'u kullanın
docker-compose -f docker-compose.gpu.yml up -d
```

**Seçenek B - CPU Kullanıcıları İçin:**
```bash
# Standart docker-compose'u kullanın
docker-compose up -d
```

Bu komut üç servisi başlatacaktır:
- **Qdrant** (Vektör Veritabanı) - http://localhost:6333
- **Superlinked** (Vektör Arama API) - http://localhost:8080
- **Backend** (FastAPI) - http://localhost:8000

#### Adım 6: Verileri Qdrant'a Yükleyin

İş verilerini Qdrant'a yüklemek için iki seçeneğiniz var:

##### Seçenek 6.1: Snapshot'tan Yükleyin (Önerilen - Daha Hızlı)

1. Önceden işlenmiş snapshot'ı şuradan indirin: `<snapshot_link>` (sağlanacak)
2. Qdrant Dashboard'una gidin: http://localhost:6333/dashboard#/collections
3. Sağ üst köşedeki **"Upload Snapshot"** butonuna tıklayın
4. Koleksiyon adını şu şekilde ayarlayın: **"default"**
5. İndirdiğiniz snapshot dosyasını seçin ve yükleyin
6. Koleksiyon durumu **yeşil** olana kadar bekleyin ✅

##### Seçenek 6.2: Verileri Manuel İşleyin (İleri Düzey)

1. Veri yükleyici konfigürasyonunu alın:
```bash
# GET isteği gönderin
curl http://localhost:8080/data-loader/
```

Örnek yanıt:
```json
{
  "result": {
    "job_postings": "DataLoaderConfig(path='data/jobs.csv', format=<DataFormat.CSV: 1>, name='job_postings', pandas_read_kwargs={'chunksize': 1000, 'converters': {'job_skills': <function <lambda> at 0x7faf18023b50>}})"
  }
}
```

2. Veri işlemeyi başlatmak için yanıttaki `name` değerini kullanın:
```bash
# Veri yükleyici adıyla POST isteği gönderin
curl -X POST http://localhost:8080/data-loader/job_postings/run
```

3. İlerlemeyi Docker loglarından takip edin:
```bash
docker logs -f <superlinked_container_name>
```

Veri yükleme işlemi, veri seti boyutuna bağlı olarak birkaç dakika sürebilir.

#### Adım 7: Frontend'i Kurun

```bash
# Frontend dizinine gidin
cd ../frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama şu adreste kullanılabilir olacaktır: http://localhost:3000

---

### 🎮 Kullanım

1. **Karşılama Sayfası** - CareerCompass özelliklerine genel bakış
2. **Yapay Zeka İş Arama** - İş aramak için doğal dil kullanın
3. **CV vs İş Analizi** - CV'nizi yükleyin ve iş ilanlarıyla karşılaştırın
4. **İş Eşleştirme** - En uygun işleri bulmak için CV'nizi yükleyin

---

### 🔧 Ortam Değişkenleri

Uygun dizinlerde `.env` dosyaları oluşturun:

**backend/.env:**
```env
GROQ_API_KEY=your_groq_api_key_here
SUPERLINKED_URL=http://localhost:8080
```

**backend/superlinked_app/.env:**
```env
# Doğal dil sorgu işleme için Ollama API ayarları
OPENAI_API_KEY=your_groq_api_key_here
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=meta-llama/llama-4-maverick-17b-128e-instruct

# Qdrant Vektör Veritabanı (varsayılan localhost)
QDRANT_URL=http://qdrant:6333
QDRANT_API_KEY=

# Embedding model ayarları
TEXT_EMBEDDER_NAME=ibm-granite/granite-embedding-small-english-r2

# Veri işleme
CHUNK_SIZE=1000
```

> **Not:** Aynı `GROQ_API_KEY` değerini hem `backend/.env` hem de `backend/superlinked_app/.env` dosyalarında kullanabilirsiniz.

---

### 📊 Veri Kaynakları

Bu proje demo amaçlı olarak aşağıdaki Kaggle veri setlerini kullanmaktadır:

- **Data Analyst Jobs** - [asaniczka/data-analyst-job-postings](https://www.kaggle.com/datasets/asaniczka/data-analyst-job-postings)
- **Data Engineer Jobs** - [asaniczka/linkedin-data-engineer-job-postings](https://www.kaggle.com/datasets/asaniczka/linkedin-data-engineer-job-postings)
- **Data Scientist Jobs** - [asaniczka/data-scientist-linkedin-job-postings](https://www.kaggle.com/datasets/asaniczka/data-scientist-linkedin-job-postings)
- **Software Engineer Jobs** - [asaniczka/software-engineer-job-postings-linkedin](https://www.kaggle.com/datasets/asaniczka/software-engineer-job-postings-linkedin)

Bu veri setleri kurulum sürecinde `downloader.py` scripti tarafından otomatik olarak indirilir ve birleştirilir.

---

### 📚 API Dokümantasyonu

Backend çalıştıktan sonra, interaktif API dokümantasyonuna erişin:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

### 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen şu adımları izleyin:

1. Repository'yi fork edin
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Fork'unuza push edin
5. Pull Request açın

---

### 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.

---

### 👥 Ekip

Hackathon süresince Llamallience ekibi tarafından ❤️ ile geliştirilmiştir.

---

<div align="center">
  
### 🌟 CareerCompass - Profesyonel Yolculuğunuzda Rehberiniz 🧭

Llamallience tarafından 💙 ile yapılmıştır

</div>
