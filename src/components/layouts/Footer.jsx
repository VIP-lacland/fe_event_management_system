// Footer layout component for the attendee homepage
// Chứa các liên kết hỗ trợ và ghi chú ứng dụng
const Footer = () => {
  return (
    <footer className="homepage-footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h3>Eventify</h3>
          <p>Thiết kế để giúp bạn tìm kiếm sự kiện, kết nối trải nghiệm và giữ liên lạc với cộng đồng.</p>
        </div>
        <div className="footer-col">
          <h3>Resources</h3>
          <a href="#">Help center</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
        <div className="footer-col">
          <h3>Company</h3>
          <a href="#">About us</a>
          <a href="#">Contact</a>
          <a href="#">Careers</a>
        </div>
        <div className="footer-col">
          <h3>Follow</h3>
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
        </div>
      </div>
      <p className="footer-note">© 2026 Eventify. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
