const mysql = require('mysql2/promise'); // Thư viện kết nối MySQL với hỗ trợ Promise
const bcrypt = require('bcrypt'); // Thư viện mã hóa mật khẩu
const crypto = require('crypto'); // Thư viện Node.js dùng để tạo mã bảo mật
const { sendEmail } = require('../services/emailService'); // Hàm gửi email từ service email

// Cấu hình cơ sở dữ liệu MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost', // Địa chỉ server
    user: process.env.DB_USER || 'your_username', // Tên đăng nhập
    password: process.env.DB_PASSWORD || 'ngockhanh2580', // Mật khẩu
    database: process.env.DB_NAME || 'smart_home', // Tên cơ sở dữ liệu
    waitForConnections: true, // Chờ khi không có kết nối khả dụng
    connectionLimit: 10, // Giới hạn số kết nối tối đa
    queueLimit: 0 // Không giới hạn hàng đợi
});

/**
 * Hiển thị trang đăng nhập
 */
const renderLoginPage = (req, res) => {
    res.render('auth/login'); // Render file giao diện login
};

/**
 * Xử lý đăng nhập
 */
const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm người dùng theo email
        const [users] = await pool.execute('SELECT * FROM account WHERE email = ?', [email]);

        if (users.length > 0) {
            const user = users[0];
            // So sánh mật khẩu người dùng nhập với mật khẩu được lưu
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                // Lưu thông tin người dùng vào session
                req.session.user = user;
                res.redirect('/home'); // Điều hướng đến trang chủ
            } else {
                // Mật khẩu không khớp
                res.render('auth/login', { error: 'Thông tin mật khẩu không đúng' });
            }
        } else {
            // Không tìm thấy email trong cơ sở dữ liệu
            res.render('auth/login', { error: 'Thông tin đăng nhập không đúng' });
        }
    } catch (error) {
        // Xử lý lỗi và hiển thị thông báo lỗi
        console.error('Lỗi khi xử lý phiên đăng nhập:', error);
        res.status(500).render('auth/login', { error: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' });
    }
};

/**
 * Hiển thị trang đăng ký
 */
const renderRegisterPage = (req, res) => {
    res.render('auth/register'); // Render file giao diện đăng ký
};

/**
 * Xử lý đăng ký người dùng mới
 */
const handleRegister = async (req, res) => {
    const { username, email, password } = req.body; // Lấy dữ liệu từ request

    // Kiểm tra dữ liệu nhập
    if (!email || !password) {
        return res.status(400).render('auth/Register', { error: 'Email và mật khẩu là bắt buộc' });
    }

    try {
        // Kiểm tra email đã tồn tại chưa
        const [existingUsers] = await pool.execute('SELECT * FROM account WHERE email = ?', [email]);
        
        if (existingUsers.length > 0) { // Nếu email đã tồn tại
            return res.status(400).render('auth/Register', { error: 'Email đã tồn tại' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Thêm người dùng mới vào cơ sở dữ liệu
        const [result] = await pool.execute(
            'INSERT INTO account (username, email, password, role, reset_token, token_expiry) VALUES (?, ?, ?, ?, ?, ?)', 
            [username, email, hashedPassword, 'user', null, null]
        );

        // Hiển thị trang đăng ký thành công
        res.render('auth/successRegister', { message: 'Đăng ký thành công!', email });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).render('auth/errorRegister', { error: 'Đã có lỗi xảy ra trong quá trình đăng ký' });
    }
};
/**
 * Hiển thị trang Quên mật khẩu
 */
const renderForgotPasswordPage = (req, res) => {
    res.render('auth/forgotPassword');
};

/**
 * Xử lý yêu cầu Quên mật khẩu
 */
const handleForgotPassword = async (req, res) => {
    const { email } = req.body;

    // Kiểm tra tính hợp lệ của input
    if (!email || !email.trim()) {
        return res.status(400).render('auth/errorForgotPassword', { message: 'Email không được để trống' });
    }

    try {
        // Tìm người dùng theo email
        const [users] = await pool.execute('SELECT * FROM account WHERE email = ?', [email]);

        // Nếu không tìm thấy người dùng, báo lỗi
        if (users.length === 0) {
            return res.status(400).render('auth/errorForgotPassword', { message: 'Email không tồn tại' });
        }

        // Tạo mã token đặt lại mật khẩu
        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 600000; // Token hết hạn sau 10 phút

        // Cập nhật token đặt lại và hạn dùng vào cơ sở dữ liệu
        await pool.execute(
            'UPDATE account SET reset_token = ?, token_expiry = ? WHERE email = ?',
            [token, new Date(tokenExpiry), email]
        );

        // Tạo liên kết đặt lại mật khẩu
        const resetLink = `http://localhost:5000/resetPassword?token=${token}`;

        // Gửi email đặt lại mật khẩu
        await sendEmail(
            email,
            'Đặt lại mật khẩu',
            `Vui lòng nhấp vào liên kết sau để đặt lại mật khẩu của bạn: ${resetLink}`
        );

        // Thông báo thành công gửi email
        res.render('auth/successForgotPassword', {
            message: 'Email khôi phục đã được gửi. Kiểm tra hộp thư của bạn.'
        });
    } catch (error) {
        // Xử lý lỗi và hiển thị thông báo lỗi
        console.error('Forgot password error:', error);
        res.status(500).render('auth/errorForgotPassword', { message: 'Không thể gửi email. Vui lòng thử lại.' });
    }
};
/**
 * Hiển thị trang Đặt lại mật khẩu
 * Xác thực token và render trang đặt lại mật khẩu nếu hợp lệ
 */
const renderResetPasswordPage = async (req, res) => {
    // Lấy token từ query string của yêu cầu
    const token = req.query.token;

    try {
        // Kiểm tra token có hợp lệ và chưa hết hạn
        const [users] = await pool.execute(
            'SELECT * FROM account WHERE reset_token = ? AND token_expiry > NOW()', 
            [token]
        );

        // Nếu token không hợp lệ hoặc đã hết hạn, trả về lỗi
        if (users.length === 0) {
            return res.status(400).render('auth/resetPassword', { error: 'Token không hợp lệ hoặc đã hết hạn' });
        }

        // Nếu token hợp lệ, hiển thị trang đặt lại mật khẩu
        res.render('auth/resetPassword', { token });
    } catch (error) {
        // Xử lý lỗi và hiển thị thông báo lỗi trên trang
        console.error('Reset password page error:', error);
        res.status(500).render('auth/resetPassword', { error: 'Đã có lỗi xảy ra' });
    }
};

/**
 * Xử lý yêu cầu Đặt lại mật khẩu
 * Đổi mật khẩu của người dùng nếu token hợp lệ
 */
const handleResetPassword = async (req, res) => {
    // Lấy thông tin mật khẩu mới và token từ yêu cầu
    const { newPassword, confirmPassword } = req.body;
    const token = req.query.token;

    // Kiểm tra mật khẩu nhập vào có khớp nhau không
    if (newPassword !== confirmPassword) {
        return res.status(400).render('auth/resetPassword', { error: 'Mật khẩu và xác nhận mật khẩu không khớp' });
    }

    try {
        // Tìm người dùng có token hợp lệ và chưa hết hạn
        const [users] = await pool.execute(
            'SELECT * FROM account WHERE reset_token = ? AND token_expiry > NOW()', 
            [token]
        );

        // Nếu không tìm thấy người dùng, báo lỗi token không hợp lệ hoặc đã hết hạn
        if (users.length === 0) {
            return res.status(400).render('auth/resetPassword', { error: 'Token không hợp lệ hoặc đã hết hạn' });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới và xóa token đặt lại
        await pool.execute(
            'UPDATE account SET password = ?, reset_token = NULL, token_expiry = NULL WHERE reset_token = ?', 
            [hashedPassword, token]
        );

        // Chuyển hướng đến trang đăng nhập với thông báo thành công
        res.status(200).render('auth/login', { message: 'Mật khẩu đã được thay đổi thành công. Vui lòng đăng nhập.' });
    } catch (error) {
        // Xử lý lỗi và hiển thị thông báo lỗi trên trang
        console.error('Reset password error:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            errno: error.errno,
            sql: error.sql,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage,
        });
        res.status(500).render('auth/resetPassword', { error: 'Đã có lỗi xảy ra trong quá trình thay đổi mật khẩu.' });
    }
};

/**
 * Xử lý xác thực đăng xuất
 */
const handleLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            // Không thể hủy session
            return res.status(500).send('Không thể đăng xuất. Vui lòng thử lại.');
        }
        res.redirect('auth/login'); // Điều hướng về trang đăng nhập
    });
};

module.exports = {
    // logout 
    handleLogout,
    // login
    renderLoginPage,
    handleLogin,
    // register
    renderRegisterPage,
    handleRegister,
    // forgot password
    handleForgotPassword,
    renderForgotPasswordPage,
    // reset password
    handleResetPassword,
    renderResetPasswordPage
};