import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Home Component
function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to Mentor-Mentee Interaction Platform</p>
    </div>
  );
}

// Login Component
function Login() {
  return (
    <div>
      <h1>Login Page</h1>
      <form>
        <div>
          <label>Email:</label><br />
          <input type="email" placeholder="Enter email" />
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Password:</label><br />
          <input type="password" placeholder="Enter password" />
        </div>

        <button style={{ marginTop: "15px" }}>Login</button>
      </form>
    </div>
  );
}

// Register Component
function Register() {
  return (
    <div>
      <h1>Register Page</h1>
      <form>
        <div>
          <label>Name:</label><br />
          <input type="text" placeholder="Enter name" />
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Email:</label><br />
          <input type="email" placeholder="Enter email" />
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Password:</label><br />
          <input type="password" placeholder="Enter password" />
        </div>

        <button style={{ marginTop: "15px" }}>Register</button>
      </form>
    </div>
  );
}

// Main App
function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        
        {/* Navigation */}
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "15px" }}>Home</Link>
          <Link to="/login" style={{ marginRight: "15px" }}>Login</Link>
          <Link to="/register">Register</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
