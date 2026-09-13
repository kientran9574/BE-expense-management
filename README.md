# Expense Management API

Backend quản lý chi tiêu cá nhân, xây dựng bằng NestJS + Prisma + PostgreSQL.

## Chức năng hiện có

- **Categories**: CRUD danh mục thu/chi (`INCOME` / `EXPENSE`).
- **Transactions**: CRUD giao dịch (số tiền, loại, ngày, danh mục, ghi chú).
- **Summary**:
  - `GET /transactions/summary/daily?date=YYYY-MM-DD` — tổng thu/chi trong 1 ngày.
  - `GET /transactions/summary/monthly?month=YYYY-MM` — tổng thu/chi trong 1 tháng, kèm breakdown theo từng ngày trong tháng.
  - `GET /transactions/summary/yearly?year=YYYY` — tổng thu/chi trong 1 năm, kèm breakdown theo từng tháng trong năm.

## Yêu cầu

- Node.js 22+
- PostgreSQL 14+

## Cài đặt

```bash
npm install

# Tạo file .env từ mẫu, sửa lại DATABASE_URL cho phù hợp
cp .env.example .env

# Chạy migration + generate Prisma Client
npx prisma migrate dev
```

## Chạy dự án

```bash
npm run start:dev   # chế độ dev, tự reload
npm run build && npm run start:prod   # chạy bản build
```

## API nhanh

### Category

```
POST   /categories        { name, type }
GET    /categories
GET    /categories/:id
PATCH  /categories/:id
DELETE /categories/:id
```

### Transaction

```
POST   /transactions      { amount, type, date, categoryId, note? }
GET    /transactions?from=&to=&type=&categoryId=
GET    /transactions/:id
PATCH  /transactions/:id
DELETE /transactions/:id
```

### Summary

```
GET /transactions/summary/daily?date=2026-09-01
GET /transactions/summary/monthly?month=2026-09
GET /transactions/summary/yearly?year=2026
```

Mỗi response summary trả về `totalIncome`, `totalExpense`, `net` cho khoảng thời gian được hỏi, cùng breakdown chi tiết (theo ngày với monthly, theo tháng với yearly) để dựng biểu đồ.

## Test

```bash
npm test        # unit test
npm run lint    # oxlint
```
