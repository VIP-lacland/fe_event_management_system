// src/components/ui/RegistrationButton.jsx

import useRegistration from "../../hooks/useRegistration";
import "./RegistrationButton.css";

/**
 * Button đăng ký / hủy đăng ký event
 * Tự hiển thị trạng thái: confirmed / waitlist / chưa đăng ký
 *
 * Props:
 *   eventId        — ID của event
 *   initialStatus  — trạng thái hiện tại từ API ("confirmed"|"waitlist"|null)
 *   initialPosition — vị trí waitlist hiện tại (nếu có)
 *   isLoggedIn     — user đã đăng nhập chưa
 *   isFull         — event có đang full không (để hiện badge)
 */
export default function RegistrationButton({
  eventId,
  initialStatus   = null,
  initialPosition = null,
  isLoggedIn      = false,
  isFull          = false,
}) {
  const { status, position, loading, error, message, register, cancel } =
    useRegistration(eventId, initialStatus);

  // Chưa đăng nhập
  if (!isLoggedIn) {
    return (
      <a href="/login" className="reg-btn reg-btn--login">
        Đăng nhập để đăng ký
      </a>
    );
  }

  return (
    <div className="reg-wrap">

      {/* Thông báo thành công */}
      {message && <p className="reg-msg reg-msg--success">{message}</p>}

      {/* Thông báo lỗi */}
      {error && <p className="reg-msg reg-msg--error">{error}</p>}

      {/* ── Đã confirmed ── */}
      {status === "confirmed" && (
        <div className="reg-state">
          <span className="reg-badge reg-badge--confirmed">✓ Đã đăng ký</span>
          <button
            className="reg-btn reg-btn--cancel"
            onClick={cancel}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Hủy đăng ký"}
          </button>
        </div>
      )}

      {/* ── Đang trong waitlist ── */}
      {status === "waitlist" && (
        <div className="reg-state">
          <span className="reg-badge reg-badge--waitlist">
            ⏳ Waitlist #{position ?? initialPosition}
          </span>
          <p className="reg-hint">
            Bạn sẽ tự động được xác nhận khi có chỗ trống.
          </p>
          <button
            className="reg-btn reg-btn--cancel"
            onClick={cancel}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Rời khỏi waitlist"}
          </button>
        </div>
      )}

      {/* ── Chưa đăng ký ── */}
      {status === null && (
        <div className="reg-state">
          {isFull && (
            <p className="reg-hint reg-hint--full">
              Sự kiện đã đầy — bạn sẽ được thêm vào danh sách chờ.
            </p>
          )}
          <button
            className={`reg-btn ${isFull ? "reg-btn--waitlist" : "reg-btn--register"}`}
            onClick={register}
            disabled={loading}
          >
            {loading
              ? "Đang xử lý..."
              : isFull
              ? "Tham gia Waitlist"
              : "Đăng ký tham dự"}
          </button>
        </div>
      )}

    </div>
  );
}