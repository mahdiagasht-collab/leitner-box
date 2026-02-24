# 🗃️ جعبه لایتنر — Leitner Box

یک اپلیکیشن وب پیشرفته برای یادگیری با روش **مرور فاصله‌دار** (Spaced Repetition)، بر اساس سیستم معروف **Sebastian Leitner**.

<br/>

## 📸 پیش‌نمایش

> داشبورد — نمای کلی جعبه‌ها و کارت‌های آماده مرور امروز
>
> صفحه مرور — فلش‌کارت تعاملی با انیمیشن چرخش
>
> مدیریت کارت‌ها — افزودن، ویرایش، فیلتر و حذف

<br/>

## ✨ ویژگی‌ها

- 📦 **۵ جعبه لایتنر** با بازه‌های مرور: روزانه، ۲ روز، ۴ روز، هفتگی، ۲ هفته‌ای
- 🎴 **فلش‌کارت تعاملی** با انیمیشن چرخش سه‌بعدی
- 📊 **داشبورد آماری** — تعداد کارت‌ها، آماده مرور، تسلط یافته
- ➕ **مدیریت کامل کارت‌ها** — افزودن، ویرایش، حذف، فیلتر
- 💾 **ذخیره‌سازی محلی** بدون نیاز به سرور یا پایگاه داده
- ♿ **دسترس‌پذیر** — ARIA، keyboard navigation، focus management
- 📱 **واکنش‌گرا** — سازگار با موبایل، تبلت و دسکتاپ
- 🌙 **تم تاریک** با فونت Vazirmatn برای متن فارسی

<br/>

## 🏗️ معماری

این پروژه با معماری **MVC (Model-View-Controller)** و اصول **SOLID** و **OOP** طراحی شده است.

```
leitner-box/
├── index.html                  # نقطه ورود — HTML معنایی
├── assets/
│   └── css/
│       ├── variables.css       # Design Tokens — CSS Custom Properties
│       ├── reset.css           # Modern CSS Reset + Base Styles
│       ├── animations.css      # Keyframes & Motion
│       ├── layout.css          # App Shell, Grid, Views
│       └── components.css      # Buttons, Cards, Forms, Modal, Toast
└── src/
    ├── app.js                  # Composition Root — نقطه اتصال
    ├── models/
    │   ├── Card.js             # Entity — موجودیت کارت
    │   ├── LeitnerConfig.js    # Value Object — تنظیمات سیستم
    │   └── CardRepository.js  # Data Access — مدیریت ذخیره‌سازی
    ├── views/
    │   ├── BaseView.js         # Abstract Base — پایه مشترک
    │   ├── DashboardView.js    # داشبورد و آمار
    │   ├── ReviewView.js       # جلسه مرور فلش‌کارت
    │   ├── CardsView.js        # لیست و مدیریت کارت‌ها
    │   ├── ModalView.js        # مودال افزودن/ویرایش
    │   └── ToastView.js        # اعلان‌های موقت
    └── controllers/
        ├── AppController.js    # Orchestrator — هماهنگ‌کننده اصلی
        ├── ReviewController.js # مدیریت جلسه مرور
        └── CardController.js   # عملیات CRUD کارت‌ها
```

<br/>

## 🔷 اصول SOLID

| اصل | پیاده‌سازی در پروژه |
|-----|---------------------|
| **S** — Single Responsibility | هر کلاس فقط یک وظیفه دارد: `Card` فقط داده کارت، `CardRepository` فقط ذخیره‌سازی |
| **O** — Open/Closed | `LeitnerConfig` قابل گسترش است بدون تغییر `Card` یا `ReviewController` |
| **L** — Liskov Substitution | همه View‌ها از `BaseView` ارث‌بری می‌کنند و جایگزین یکدیگر می‌شوند |
| **I** — Interface Segregation | هر View فقط callback‌های مورد نیاز خود را bind می‌کند |
| **D** — Dependency Inversion | `AppController` وابستگی‌ها را inject می‌گیرد؛ Composition Root در `app.js` |

<br/>

## 💡 مفاهیم OOP

- **Encapsulation** — متدهای private با `_` برای جلوگیری از دسترسی خارجی
- **Inheritance** — همه View‌ها از `BaseView` ارث می‌برند
- **Polymorphism** — هر View متد `render()` را به شکل خاص خود پیاده می‌کند
- **Abstraction** — `BaseView` اینترفیس مشترک را تعریف می‌کند

<br/>

## 🧠 الگوریتم لایتنر

```
جواب صحیح ✓  →  کارت به جعبه بالاتر (max: ۵)
جواب اشتباه ✗  →  کارت به جعبه ۱ برمی‌گردد

جعبه ۱ → مرور فردا          (۱ روز)
جعبه ۲ → مرور پس‌فردا       (۲ روز)
جعبه ۳ → مرور ۴ روز دیگر   (۴ روز)
جعبه ۴ → مرور هفته آینده    (۸ روز)
جعبه ۵ → مرور ۲ هفته دیگر  (۱۶ روز)
```

<br/>

## 🚀 اجرا

این پروژه یک **Static Web App** است و به build tool یا سرور نیاز ندارد،

### روش ۱ — VS Code Live Server
پلاگین Live Server را نصب کنید و روی `index.html` کلیک راست → **Open with Live Server**

### روش ۲ — Node.js
```bash
npx serve .
# یا
npx http-server .
```

### روش ۳ — Python
```bash
python3 -m http.server 8080
```

سپس مرورگر را باز کنید: `http://localhost:8080`

> ✅ این پروژه با باز کردن مستقیم `index.html` در مرورگر (file://) نیز کار می‌کند!

<br/>

## 🌐 Deploy

| پلتفرم | روش |
|--------|-----|
| **GitHub Pages** | Settings → Pages → Branch: main / root |
| **Netlify** | Drag & drop پوشه پروژه |
| **Vercel** | `vercel --prod` |

<br/>

## 🛠️ تکنولوژی‌ها

| ابزار | کاربرد |
|-------|--------|
| **HTML5** | ساختار معنایی + ARIA |
| **CSS3** | Custom Properties, Grid, Flexbox, Animations |
| **JavaScript ES2022** | ES Modules, Classes, Optional Chaining, crypto.randomUUID |
| **localStorage** | ذخیره‌سازی داده‌ها در مرورگر |

بدون هیچ **framework** یا **کتابخانه خارجی** — Vanilla JS خالص.

<br/>

## 📄 لایسنس

MIT License — آزاد برای استفاده، تغییر و توزیع.

<br/>

---

<div align="center">
  ساخته‌شده با ❤️ و Vanilla JS
</div>
