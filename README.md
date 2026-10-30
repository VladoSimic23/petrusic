# Petrušić gradnja

Monorepo s Next.js web stranicom i zasebnim Sanity Studiom.

## Struktura

- `front/my-app` — Next.js frontend
- `back/petrusic` — Sanity Studio i sheme sadržaja

Frontend i Studio imaju zasebne `package-lock.json` datoteke i instalacije. To omogućuje da se frontend na Vercelu gradi izravno iz `front/my-app`.

## Lokalni razvoj

Potrebni su Node.js 20.9 ili noviji i npm.

1. U korijenu repozitorija instaliraj ovisnosti:

   ```sh
   npm run install:all
   ```

2. Kopiraj `front/my-app/.env.example` u `front/my-app/.env.local` i po potrebi dopuni vrijednosti.

3. Pokreni aplikacije u odvojenim terminalima:

   ```sh
   npm run dev:web
   npm run dev:studio
   ```

Frontend je dostupan na `http://localhost:3000`, a Studio na adresi koju ispiše Sanity CLI.

## Korisne naredbe

```sh
npm run build:web
npm run build:studio
npm run lint:web
npm run typecheck:web
npm run typecheck:studio
```

## GitHub

Iz korijena `stranica` direktorija:

```sh
git status
git add .
git commit -m "Prepare Petrušić Gradnja monorepo"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Prije dodavanja provjeri `git status` i potvrdi da `.env.local`, `.env` i drugi lokalni tajni podaci nisu među datotekama za commit.

## Vercel — frontend

1. Na Vercelu odaberi **Add New → Project** i uvezi GitHub repozitorij.
2. Postavi **Root Directory** na `front/my-app`.
3. Ostavi framework na **Next.js**, a instalaciju i build na automatskim postavkama (`npm install` / `npm run build`).
4. U **Environment Variables** dodaj:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` — ID Sanity projekta
   - `NEXT_PUBLIC_SANITY_DATASET` — najčešće `production`
   - `SANITY_REVALIDATE_SECRET` — nasumična tajna vrijednost; koristi se za osigurani webhook revalidation endpoint
5. Pokreni deployment.

Frontend čita objavljeni Sanity sadržaj bez tokena. Nemoj dodavati Sanity write token u frontend ili Vercel varijable za ovu konfiguraciju.

### Sanity webhook za osvježavanje sadržaja

Nakon što dobiješ Vercel domenu, u Sanity Manageu dodaj webhook prema:

```text
https://TVOJA-DOMENA/api/revalidate
```

Koristi isti `SANITY_REVALIDATE_SECRET` kao u Vercelu. Odaberi dataset `production` i događaje create, update i delete. Tako će objave u CMS-u osvježavati cache stranice.

## Sanity Studio — backend

Studio se hosta odvojeno od frontenda. Nakon postavljanja repozitorija na GitHubu, lokalno se prijavi u Sanity CLI (`npx sanity login`), zatim pokreni:

```sh
npm run deploy:studio
```

Slijedi Sanity CLI za odabir Studio hostnamea i deployment. Studio koristi projekt i dataset definirane u `back/petrusic/sanity.cli.ts`. Ne treba ga deployati na Vercel osim ako se namjerno želi zaseban Vercel projekt za Studio.
