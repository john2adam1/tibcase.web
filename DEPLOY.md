# Deploy (CI/CD)

`main` branchga push qilinganda GitHub Actions serverga SSH orqali kirib, loyihani avtomatik yangilaydi va Docker'da qayta ishga tushiradi.

## Oqim

```
git push origin main
   -> GitHub Actions (.github/workflows/deploy.yml)
   -> SSH: deploy@<DEPLOY_HOST>
   -> cd /opt/tibcase-web
   -> git fetch + git reset --hard origin/main
   -> docker compose up -d --build   (Vite build -> nginx image)
   -> docker image prune -f          (eski image'larni tozalash)
```

Qo'lda ishga tushirish: GitHub -> **Actions -> Deploy -> Run workflow** (`workflow_dispatch`).

## Repo va serverlar

| Repo | Serverdagi papka | Port | Domen (Caddy orqali) |
|---|---|---|---|
| `tibcase.web` | `/opt/tibcase-web` | `8080` (`PORT` bilan o'zgaradi) | web domeni |
| `tibcase.admin` | `/opt/tibcase-admin` | `3000` | admin domeni |

Ikkala repoda workflow bir xil, faqat papka nomi boshqa (`/opt/tibcase-web` o'rniga `/opt/tibcase-admin`).

## GitHub Secrets

Repo -> **Settings -> Secrets and variables -> Actions -> New repository secret**. Ikkala repoda ham qo'shiladi:

| Secret | Qiymat |
|---|---|
| `DEPLOY_HOST` | server IP yoki domen |
| `DEPLOY_USER` | `deploy` |
| `DEPLOY_SSH_KEY` | SSH **private** key (to'liq, `-----BEGIN ...` dan `-----END ...` gacha) |

> Private key, parol va `.env` qiymatlarini hech qachon repoga, chatga yoki issue'ga yozmang. Faqat GitHub Secrets'da turadi.

## Serverda bir marta tayyorlanadigan narsalar

1. **Papka va git clone**: `/opt/tibcase-web` repo clone qilingan bo'lishi, `origin` esa `main` branchni o'qiy olishi kerak. Repo private bo'lsa, serverda read-only **deploy key** (yoki token) sozlang.
2. **`deploy` foydalanuvchisi**: `docker` guruhida bo'lishi (`sudo usermod -aG docker deploy`), papkaga yozish huquqi bo'lishi kerak. Yangi login talab qilinadi.
3. **`.env` serverda** (`/opt/tibcase-web/.env`) — gitga tushmaydi (`.gitignore`da), `git reset --hard` uni o'chirmaydi. Unda:
   - `VITE_API_BASE=https://prod.tibstation.uz`
   - `VITE_GOOGLE_CLIENT_ID`, `VITE_FIREBASE_*` (API key, auth domain, project id, storage bucket, sender id, app id, VAPID key)
   - ixtiyoriy: `PORT`, `BACKEND_HOST` (standart `prod.tibstation.uz`)
4. **Docker + compose plugin** o'rnatilgan.
5. **Caddy** (HTTPS): `Caddyfile.example` ni `/etc/caddy/Caddyfile` ga nusxalab, haqiqiy domenlarni yozing va `sudo systemctl reload caddy`. DNS A-yozuvlari server IP'siga qarashi kerak.

## Muhim eslatmalar

- `VITE_*` qiymatlari **build vaqtida** bundle ichiga yoziladi. `.env` ni o'zgartirsangiz, qayta deploy (build) kerak.
- `git reset --hard` serverdagi **kuzatiluvchi** fayllardagi qo'lda qilingan o'zgarishlarni o'chiradi. Serverda kodni qo'lda tahrirlamang.
- `docker compose up -d --build` paytida bir necha soniya uzilish bo'lishi mumkin.
- Deploy ishlamasa: GitHub -> Actions -> oxirgi run loglarini ko'ring. Serverda: `cd /opt/tibcase-web && docker compose logs --tail=100`.

## Tezkor tekshiruv (serverda)

```bash
cd /opt/tibcase-web
docker compose ps
curl -I http://localhost:8080
git log -1 --oneline     # oxirgi deploy qilingan commit
```

## Xavfsizlik

- SSH private key suhbat yoki boshqa ochiq joyda yuborilgan bo'lsa, uni **almashtiring**: yangi juft yarating (`ssh-keygen -t ed25519`), public qismini serverda `deploy` foydalanuvchisining `~/.ssh/authorized_keys` ga qo'shing, eskisini o'chiring, private qismini `DEPLOY_SSH_KEY` secret'iga yangilang.
- `deploy` foydalanuvchisiga faqat kerakli huquqlar bering (sudo shart emas).
- `client_secret_*.json` va `.env` allaqachon `.gitignore` da, repoga tushmaydi.
