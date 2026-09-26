# پلنر هلن — کنکور تجربی

پلنر روزانه/هفته‌ای با React + TypeScript + Next.js 14 (App Router)، سه‌بعدی‌سازی واقعی با
`react-three-fiber` / `drei` / `postprocessing` (bloom, distort material, ذرات نوری، محیط جنگل)،
نمودارها با `recharts`، و ذخیره‌ی داده روی مرورگر با `zustand` (localStorage).

این پروژه به‌صورت کامل نصب و `next build` شده و بدون خطا کامپایل و type-check می‌شود
(فقط فونت گوگل در سندباکس من به‌خاطر محدودیت شبکه بهینه نشد — روی هر سرویس واقعی مثل
Vercel این مشکل وجود ندارد چون به اینترنت باز دسترسی دارد).

## اجرا روی سیستم خودت

```bash
npm install
npm run dev
```

بعد آدرس `http://localhost:3000` رو باز کن.

برای بیلد نهایی:

```bash
npm run build
npm run start
```

## کجا آپلودش کنم که با یه سایت واقعی بالا بیاد؟

بهترین و ساده‌ترین گزینه برای Next.js، **Vercel** هست (همون شرکتی که Next.js رو ساخته، دیپلوی
کاملاً رایگانه برای این حجم پروژه):

1. یه ریپازیتوری روی گیت‌هاب بساز و این پروژه رو push کن:
   ```bash
   git init
   git add .
   git commit -m "helen planner"
   git branch -M main
   git remote add origin <آدرس ریپوی گیت‌هابت>
   git push -u origin main
   ```
2. برو به [vercel.com](https://vercel.com) و با اکانت گیت‌هابت لاگین کن.
3. روی «Add New → Project» بزن، ریپوی همین پروژه رو انتخاب کن.
4. هیچ تنظیم خاصی لازم نیست — Vercel خودش تشخیص می‌ده Next.js هست، دکمه‌ی Deploy رو بزن.
5. چند ثانیه بعد یه لینک زنده مثل `helen-planner.vercel.app` بهت می‌ده که روی موبایل هلن هم
   بی‌نقص باز می‌شه (کاملاً ریسپانسیوـه).

### گزینه‌ی جایگزین (بدون گیت‌هاب)

```bash
npm i -g vercel
vercel
```
دستور بالا رو داخل پوشه‌ی پروژه اجرا کن، سوال‌هاش رو با اینتر رد کن، همون‌جا لینک زنده بهت می‌ده.

Netlify هم گزینه‌ی خوبیه (`netlify.toml` لازم نداره، Next.js رو خودکار تشخیص می‌ده) اگه به هر
دلیلی نخوای از Vercel استفاده کنی.

## ساختار پروژه

- `app/page.tsx` — صفحه‌ی اصلی، تب روز/هفته
- `components/Scene3D.tsx` — پس‌زمینه‌ی سه‌بعدی جنگل (ذرات، مه، نور، bloom)
- `components/ProgressOrb3D.tsx` — اُرب پیشرفت (کره‌ی distort شونده + دو حلقه‌ی درصد)
- `components/DayView.tsx` / `WeekView.tsx` — نمای روز و هفته
- `components/SubjectCard.tsx` — کارت هر درس (ساعت مطالعه، تعداد تست، درصد، زمان تحلیل، توضیحات)
- `lib/store.ts` — state با zustand + ذخیره در localStorage
- `lib/constants.ts` / `lib/types.ts` — لیست درس‌ها/روزها و تایپ‌ها
