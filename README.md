## AI-Powered Job Search — Hackathon Projesi

Bu depo, adayların CV'lerini analiz edip onlara uygun iş ilanları önerebilen, doğal dil ile iş arama yapabilen ve CV'ye dayalı iş eşleştirmesi sağlayan bir full-stack uygulamadır. Backend olarak FastAPI, vektör depolama için Qdrant, bir dahili "superlinked" arama servisi ve frontend olarak Next.js (App Router) kullanır.

## Öne çıkan özellikler
- CV yükleyerek: beceri eşleştirme, güçlü/zayıf beceriler, öğrenme önerileri
- CV ile iş eşleştirme (cv->job) — doğal dil tabanlı arama
- Doğal dil iş arama (AI destekli)
- Frontend: Next.js tabanlı modern UI
- Docker destekli kolay çalıştırma (CPU & opsiyonel GPU)

## Kısa mimari
- backend/: FastAPI uygulaması, LLM entegrasyonları, API routelar
- superlinked_app/: lokal/ayrık arama servisi (docker-compose ile çalıştırılır)
- data/: örnek iş verileri ve şema
- scripts/: veri indirme ve scraping yardımcıları (LinkedIn, GitHub, vs.)
- frontend/: Next.js 16 + React 19 frontend

## Hızlı başlangıç (Docker ile) — PowerShell
Ön koşullar: Docker Desktop (veya Docker Engine), Docker Compose.

1) CPU ile çalıştırma:

```powershell
cd "c:\Users\gurur\OneDrive\Masaüstü\hackathon_final\backend"
docker compose -f docker-compose.yml up --build
```

2) GPU destekli (uygulamanızda GPU kullanacaksanız, ortamınıza göre):

```powershell
cd "c:\Users\gurur\OneDrive\Masaüstü\hackathon_final\backend"
docker compose -f docker-compose.gpu.yml up --build
```

Bu komutlar üç ana servisi ayağa kaldırır: `qdrant`, `superlinked` ve `backend`.

## Lokal geliştirme (Docker olmadan) — PowerShell

Backend (Python 3.10 önerilir):

```powershell
cd "c:\Users\gurur\OneDrive\Masaüstü\hackathon_final\backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# .env dosyasını oluşturup gerekli anahtarları ekleyin
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Frontend (Node.js 18+ önerilir):

```powershell
cd "c:\Users\gurur\OneDrive\Masaüstü\hackathon_final\frontend"
npm install
npm run dev
# Frontend tipik olarak http://localhost:3000'da çalışır
```

## Çevresel değişkenler (önemli)
`backend/app/config.py` üzerinden alınan ana değişkenler:
- GROQ_API_KEY — LLM sağlayıcı anahtarı (zorunlu)
- SUPERLINKED_URL — Superlinked servis adresi (örn. `http://superlinked:8080`)
- GROQ_BASE_URL, GROQ_MODEL, SUPERLINKED_TIMEOUT
- DEBUG, APP_NAME, APP_VERSION

Proje `Settings.Config.env_file = ".env"` olarak ayarlı; repository kökünde veya `backend` dizininde bir `.env` dosyası oluşturun ve anahtarları buraya ekleyin.

## Önemli API uç noktaları
Backend uygulaması şu router prefix'leri ile kaydolur:

- `/api/superlinked`
  - POST `/api/superlinked/search` — JSON body ile doğal dil iş arama (SearchRequest tipinde payload).
  - POST `/api/superlinked/search/job` — CV PDF yükleyerek CV tabanlı iş arama (multipart/form-data; `cv_file`).

- `/api/cv-analysis`
  - POST `/api/cv-analysis/analyze` — `cv_file` (PDF) ve `job_posting` (form) ile CV analizi.
  - POST `/api/cv-analysis/analyze_linkedin` — `cv_file` + `linkedin_url` ile LinkedIn scraping + analiz.
  - POST `/api/cv-analysis/recommend_courses` — hedef role göre kurs önerileri.
  - POST `/api/cv-analysis/analyze_candidate` — CV/GitHub/LinkedIn birleşimi ile aday profili.

- Sağlık kontrolü: GET `/health`

FastAPI uygulaması çalışırken otomatik dökümantasyon için: `http://localhost:8000/docs` adresini ziyaret edin.

## Örnek istekler

1) CV Analiz (`/api/cv-analysis/analyze`) — PowerShell örneği:

```powershell
$FilePath = "C:\path\to\your_cv.pdf"
$Form = @{ cv_file = Get-Item $FilePath; job_posting = "Senior ML Engineer pozisyonu için örnek açıklama" }
Invoke-RestMethod -Uri "http://localhost:8000/api/cv-analysis/analyze" -Method Post -Form $Form
```

2) Superlinked doğal dil arama (JSON):

```bash
curl -X POST "http://localhost:8000/api/superlinked/search" \
  -H "Content-Type: application/json" \
  -d '{"query":"Senior frontend engineer with React and Next.js, remote","limit":20}'
```

3) CV ile job search (dosya yükleme):

```bash
curl -X POST "http://localhost:8000/api/superlinked/search/job" \
  -F "cv_file=@/path/to/your_cv.pdf" \
  -F "limit=25"
```

Not: PowerShell'de curl alias'i farklı davranabilir; `Invoke-RestMethod` veya Postman kullanmanız daha kolay olabilir.

## Veri ve scraping
- `scripts/` içinde `linkedin_scraper.py`, `github_scraper.py` gibi yardımcı araçlar bulunur. Scraping kullanırken sitelerin kullanım koşullarına ve yasallığa dikkat edin.
- `data/` klasörü, `superlinked` servisine mount edilerek örnek veri sağlamak için kullanılıyor.

## Bilinen eksiklikler ve dikkat edilmesi gerekenler
- Bazı `superlinked_app` dosyaları çalışma zamanı okumasında bulunamadı; docker-compose içinde `superlinked_app` build context'i doğru olduğundan emin olun.
- LLM bağlantı hataları olması durumunda (yanlış anahtar veya yapılandırma) endpointler 500 dönebilir — `.env` ve LLM ayarlarını doğrulayın.
- Scraper scriptleri kırılgan olabilir; production için resmi API veya izinli veri kaynakları tercih edin.

## Geliştirme önerileri (hackathon sonrası iyileştirmeleri)
- Entegrasyon testleri: qdrant + superlinked + backend akışını test eden CI adımları ekleyin.
- CI/CD pipeline: Docker build, lint, test otomasyonu (GitHub Actions önerilir).
- Auth & rate-limiting ekleyin (prod için zorunlu).
- Daha sağlam hata raporlama, observability (Prometheus / Grafana) ekleyin.

## Hızlı kontrol listesi
- [ ] `backend/requirements.txt` kuruldu
- [ ] `.env` içinde gerekli anahtarlar (GROQ_API_KEY, SUPERLINKED_URL)
- [ ] Docker Compose ile `qdrant`, `superlinked`, `backend` çalışıyor
- [ ] Frontend `npm install` sonrası `npm run dev` ile açılıyor
- [ ] `/api/cv-analysis/analyze` endpoint çalışıyor

## Kaynaklar & Lisans
- Bu proje hackathon başvurusu içindir; lisans ve kaynak gösterimi gerektiğinde ekleyin.

---

Eğer istersen bu `README.md`'ye eklemeler yapabilirim (CONTRIBUTING, örnek `.env`, LICENSE). Hangi eklemeleri istersin?
