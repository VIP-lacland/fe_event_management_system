// src/pages/organizer/Home/Home.jsx
import "./Home.css";

const HomePage = () => {
  console.log('✅ HomePage component rendered!'); // ← Thêm dòng này
  
  return (
    <div className="home-page">
      <h1>Organizer Home Page</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
};

export default HomePage; 