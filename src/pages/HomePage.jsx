import { useAuthStore } from '../store/authStore';

const DashboardPage = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="text-gray-600">{user?.name} ({user?.role})</p>
          </div>
          <button 
            onClick={logout}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Đăng xuất
          </button>
        </div>

        {/* Content theo role */}
        <div className="bg-white p-6 rounded-lg shadow">
          {user?.role === 'organizer' ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">🎪 Organizer Dashboard</h2>
              <p className="text-gray-600">Chức năng quản lý sự kiện sẽ được thêm sau...</p>
              {/* Sau này thêm: danh sách event, nút tạo event mới, v.v. */}
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-4">👥 Attendee Dashboard</h2>
              <p className="text-gray-600">Chức năng đăng ký sự kiện sẽ được thêm sau...</p>
              {/* Sau này thêm: danh sách đã đăng ký, waitlist, v.v. */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;