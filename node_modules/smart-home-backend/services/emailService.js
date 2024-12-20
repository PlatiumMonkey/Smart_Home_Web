const nodemailer = require('nodemailer');

/**
 * Gửi email với Ethereal
 * @param {string} to - Email người nhận.
 * @param {string} subject - Tiêu đề email.
 * @param {string} text - Nội dung email.
 */
const sendEmail = async (to, subject, text) => {
    try {
        // Tạo tài khoản Ethereal tạm thời
        let testAccount = await nodemailer.createTestAccount();

        console.log('Tài khoản Ethereal:', testAccount);

        // Cấu hình SMTP Ethereal
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // Vì sử dụng port 587, không cần secure
            auth: {
                user: testAccount.user, // Tài khoản tự động
                pass: testAccount.pass  // Mật khẩu tương ứng
            }
        });

        // Cấu hình email
        const mailOptions = {
            from: '"Hỗ trợ" <no-reply@example.com>', // Địa chỉ gửi
            to,                                     // Địa chỉ nhận
            subject,                                // Tiêu đề email
            text                                    // Nội dung email
        };

        // Gửi email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email đã gửi: %s', info.messageId);

        // Liên kết để xem email
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('Xem email tại:', previewUrl);

        return previewUrl; // Trả về liên kết xem email
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
        throw error;
    }
};

module.exports = { sendEmail };
