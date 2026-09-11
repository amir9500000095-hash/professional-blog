# 🚀 راهنمای شروع سریع برای وبلاگ تکنولوژی

تبریک! وبلاگ تکنولوژی حرفه‌ای شما با تمام ویژگی‌های پیشرفته آماده است!

## 📋 اطلاعات ورود پیش‌فرض

قبل از هر چیز، یک حساب Admin ایجاد کنید:

### نام کاربری اول
```
نام کاربری: admin
ایمیل: admin@professionalblog.com
رمز عبور: Admin@123456
نقش: admin
```

## 🌐 آدرس‌های دسترسی

### سایت اصلی
```
🔗 http://localhost:3000
```

### API Backend
```
🔗 http://localhost:5000/api
```

### پنل مدیریت
```
🔗 http://localhost:3000/admin
```

### داشبورد
```
🔗 http://localhost:3000/admin (بعد از ورود به عنوان Admin)
```

## 🔐 سازی حساب Admin

### مرحله 1: ثبت نام
1. رفتن به: http://localhost:3000/register
2. اطلاعات را وارد کنید:
   - نام کامل: Admin
   - نام کاربری: admin
   - ایمیل: admin@professionalblog.com
   - رمز عبور: Admin@123456

### مرحله 2: تصدیق نقش
- به MongoDB مراجعه کنید و نقش کاربر را به `admin` تغییر دهید
- یا از این دستور استفاده کنید:

```bash
# در MongoDB Shell
use professional-blog
db.users.updateOne(
  { username: "admin" },
  { $set: { role: "admin" } }
)
```

### مرحله 3: ورود
1. رفتن به: http://localhost:3000/login
2. وارد کردن:
   - ایمیل: admin@professionalblog.com
   - رمز عبور: Admin@123456

## 📝 ویژگی‌های اصلی

### برای کاربران عام
✅ مشاهده مقالات
✅ نظرات و بحث‌ها
✅ جستجوی مقالات
✅ تیپ کاربری

### برای نویسندگان
✅ نوشتن مقالات جدید
✅ ویرایش مقالات خود
✅ مدیریت برچسب‌ها و دسته‌بندی‌ها
✅ پیش‌نمایش مقالات

### برای Admin
✅ تأیید نظرات
✅ حذف نظرات نامناسب
✅ مدیریت تمام مقالات
✅ مدیریت کاربران و نقش‌ها
✅ تنظیمات سایت
✅ آمار و گزارشات

## 🛠️ نصب و اجرا

### 1. نصب وابستگی‌ها
```bash
npm install
cd frontend && npm install && cd ..
```

### 2. تنظیم متغیرهای محیطی
```bash
cp .env.example .env
```

### 3. اجرای Docker (اختیاری)
```bash
docker-compose up -d
```

### 4. اجرای محلی بدون Docker
```bash
# ترمینال 1: Backend
npm run dev:backend

# ترمینال 2: Frontend
npm run dev:frontend

# MongoDB و Redis را باید از قبل راه‌اندازی کرده باشید
```

## 📊 داشبورد Admin

پس از ورود به حساب Admin:

1. **بررسی نظرات**: http://localhost:3000/admin
   - تأیید نظرات جدید
   - حذف نظرات نامناسب
   - مدیریت نظرات

2. **مقالات**:
   - ایجاد مقالات جدید: http://localhost:3000/create
   - مشاهده تمام مقالات
   - ویرایش و حذف مقالات

3. **کاربران**:
   - مشاهده پروفایل کاربران
   - تغییر نقش‌ها
   - مدیریت دسترسی‌ها

## 🔑 رمزهای عبور پیشنهادی

```
نام کاربری: testauthor
رمز عبور: Author@123456
نقش: author

نام کاربری: testeditor  
رمز عبور: Editor@123456
نقش: editor

نام کاربری: testuser
رمز عبور: User@123456
نقش: user
```

## 🎨 ویرایش تنظیمات

### رنگ‌های تم
فایل: `frontend/src/config/appConfig.js`
```javascript
theme: {
  primaryColor: '#2563eb',
  secondaryColor: '#1e40af',
}
```

### دسته‌بندی‌های مقالات
فایل: `frontend/src/config/adminConfig.js`
```javascript
categories: [
  { id: 'tech', name: 'فناوری' },
  { id: 'programming', name: 'برنامه‌نویسی' },
  // ...
]
```

## 📧 تنظیم ایمیل

برای فعال کردن سیستم ایمیل:
1. اطلاعات SMTP خود را در `.env` وارد کنید
2. اطلاعات ایمیل Gmail:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   ```

## 🚀 استقرار در پروداکشن

### Vercel (Frontend)
```bash
vercel deploy
```

### Heroku (Backend)
```bash
heroku create your-app-name
git push heroku main
```

## 🆘 حل مشکلات رایج

### مشکل: پورت 5000 استفاده شده است
```bash
# تغییر پورت در .env
PORT=5001
```

### مشکل: MongoDB متصل نیست
```bash
# بررسی MongoDB
mongod --version

# اجرای MongoDB
mongod
```

### مشکل: تغییرات ذخیره نمی‌شود
```bash
# بررسی توکن
localStorage.getItem('token')

# پاک کردن cache
localStorage.clear()
```

## 📚 مستندات بیشتر

- [نصب و راه‌اندازی](./INSTALL.md)
- [راهنمای مشارکت](./CONTRIBUTING.md)
- [نقشه توسعه](./ROADMAP.md)

## 💬 پشتیبانی

برای سؤالات و مشکلات:
1. Issues: https://github.com/amir9500000095-hash/professional-blog/issues
2. Discussions: https://github.com/amir9500000095-hash/professional-blog/discussions

---

**سایت شما آماده است! موفق باشید! 🎉**
