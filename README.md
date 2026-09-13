# Expense Management

Ứng dụng quản lý chi tiêu cá nhân.

- **Backend** (thư mục gốc): NestJS + Prisma + PostgreSQL — chạy ở port `3000`.
- **Frontend** (`frontend/`): Next.js + TanStack Query + Zustand + Tailwind — chạy ở port `3001`.

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

### Backend

```bash
npm install

# Tạo file .env từ mẫu, sửa lại DATABASE_URL cho phù hợp
cp .env.example .env

# Chạy migration + generate Prisma Client
npx prisma migrate dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL trỏ tới backend
```

## Chạy dự án

Mở 2 terminal:

```bash
# Terminal 1 — backend (port 3000)
npm run start:dev

# Terminal 2 — frontend (port 3001)
cd frontend && npm run dev -- -p 3001
```

Truy cập giao diện tại http://localhost:3001

Backend chỉ cho phép CORS từ `CORS_ORIGIN` (mặc định `http://localhost:3001`).

## Giao diện

- **Tổng quan**: số chi tiêu tháng hiện tại, chi tiêu trong ngày/năm, biểu đồ chi tiêu theo từng ngày trong tháng và theo từng tháng trong năm (mỗi biểu đồ có thể chuyển sang dạng bảng).
- **Giao dịch**: danh sách + bộ lọc (khoảng ngày, loại, danh mục), thêm/sửa/xóa qua dialog.
- **Danh mục**: thêm và xóa danh mục thu/chi.
- Hỗ trợ giao diện sáng/tối và responsive trên mobile.

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
npm test        # unit test backend
npm run lint    # oxlint backend

cd frontend && npm run lint && npm run build   # frontend
```
