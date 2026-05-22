import { Link } from 'react-router-dom';
// Thêm dòng này để gọi kho lưu trạng thái
import { useAuthStore } from '../../store/authStore'; 

const Header = () => {
  // Lấy ra biến kiểm tra đăng nhập, thông tin user và hàm đăng xuất
  const { isAuthenticated, user, logout } = useAuthStore(); 

  return (
    <header className="homepage-topbar">
      <div className="homepage-brand">Eventify</div>
      <nav className="homepage-nav" aria-label="Main navigation">
        <button className="homepage-button" type="button">Help center</button>
        <button className="homepage-button" type="button">Find my tickets</button>
        
                {/* ĐOẠN NÀY ĐÃ ĐƯỢC THIẾT KẾ LẠI CHO ĐẸP VÀ CHỐNG RỚT DÒNG */}
        {isAuthenticated ? (
          <div className="user-profile-widget">
            <span className="user-greeting">Hi, {user?.name?.split(' ')[0]}</span>
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="user-avatar" referrerPolicy="no-referrer" />
            ) : (
              <div className="user-avatar-placeholder">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <button onClick={logout} className="logout-btn" title="Đăng xuất">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        ) : (
          <Link to="/login" className="homepage-action primary">Login</Link>
        )}

      </nav>
    </header>
  );
};

export default Header;