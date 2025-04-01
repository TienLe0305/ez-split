# EzSplitPVN

EzSplitPVN là ứng dụng web giúp chia sẻ chi phí một cách dễ dàng giữa nhóm bạn. Ứng dụng cho phép người dùng thêm, chỉnh sửa và quản lý các khoản chi tiêu, đồng thời tự động tính toán số tiền mà mỗi người cần thanh toán cho nhau.

## Tính năng chính

- **Quản lý người dùng**: 
  - Hệ thống có sẵn 7 người dùng: Phương, Thắng, Hoàng, Giang, Đức, Duyệt, Tâm
  - Thông tin người dùng bao gồm tên, số tài khoản ngân hàng và tên ngân hàng
  - Quản lý thông tin tài khoản ngân hàng để thanh toán dễ dàng

- **Quản lý chi tiêu**:
  - Xem danh sách chi tiêu với thông tin người trả, số tiền, ngày tạo
  - Lọc và tìm kiếm chi tiêu theo tên hoặc người trả
  - Xem số lượng người tham gia mỗi chi tiêu
  - Hiển thị trạng thái thanh toán của từng chi tiêu (đã thanh toán, đang chờ thanh toán)
  - Thêm, chỉnh sửa và xóa chi tiêu
  - Xem chi tiết chi tiêu và lịch sử thanh toán

- **Thêm chi tiêu**:
  - Tên chi tiêu
  - Số tiền chi tiêu
  - Người trả tiền (dropdown)
  - Những người tham gia (checkboxes)
  - Tùy chọn chia đều hoặc chia theo số tiền cụ thể cho từng người
  - Tự động tính toán số tiền mỗi người cần trả
  - **[Update]** Tự động chuyển đến trang chia tiền sau khi tạo chi tiêu mới
  - **[Update]** Chức năng chia sẻ liên kết chi tiêu hiển thị sau khi chuyển trang (trước đây hiển thị ngay lập tức và có thể bị đóng quá nhanh)

- **Xem chi tiết chi tiêu**:
  - Thông tin cơ bản: tên, số tiền, người trả, ngày tạo
  - Danh sách người tham gia và số tiền mỗi người được chia
  - Tùy chọn chỉnh sửa hoặc xóa chi tiêu

- **Chia tiền và thanh toán**:
  - Trang riêng biệt cho mỗi chi tiêu hiển thị thông tin chia tiền chi tiết
  - Danh sách các giao dịch cần thực hiện để thanh toán chi tiêu
  - Tích hợp đánh dấu trạng thái thanh toán và theo dõi tiến độ
  - Hiển thị thời gian thanh toán chính xác đến giây khi giao dịch được đánh dấu hoàn thành
  - Chức năng tạo mã QR cho các giao dịch thanh toán

- **Tổng kết chia tiền**:
  - Tab "Tổng kết cá nhân": Hiển thị thông tin tài chính của mỗi người trong nhóm
    - Số tiền đã chi (paid)
    - Số tiền đã tiêu (spent)
    - **[New]** Số tiền đã nhận thanh toán (received) - Các khoản tiền đã được thanh toán bởi người khác
    - **[New]** Số tiền chờ nhận (pending) - Các khoản tiền đang chờ người khác thanh toán 
  - Tab "Theo chi tiêu": Xem danh sách chi tiêu và trạng thái thanh toán của từng giao dịch trong mỗi chi tiêu
  - Danh sách các giao dịch cần thực hiện (ai trả cho ai, bao nhiêu tiền)
  - Tính năng cập nhật dữ liệu tổng kết theo thời gian thực

- **Thanh toán và tạo mã QR**:
  - Tạo mã QR thanh toán cho từng giao dịch liên kết với VPBank và các ngân hàng khác
  - Mã QR bao gồm thông tin:
    - Số tài khoản người nhận
    - Tên ngân hàng
    - Số tiền cần thanh toán
    - Nội dung chuyển khoản kèm tên chi tiêu
  - Đánh dấu giao dịch đã thanh toán với thời gian chính xác
  - Hiển thị trạng thái thanh toán cho mỗi giao dịch

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
