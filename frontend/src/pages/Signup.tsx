import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.string().min(1, "Role is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const onSubmit = async () => {
    const result = signupSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
      role,
    });

    if (!result.success) {
      const newErrors: Partial<Record<string, string>> = {};
      result.error.errors.forEach((e: any) => {
        newErrors[e.path[0]] = e.message;
      });
      setErrors(newErrors);
      return;
    }

    try {
      const data = await axios.post("http://localhost:8000/signup", {
        name,
        email,
        password,
        role,
      });
      console.log(data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Signup Form</h1>
        <form>
          <div className="form-group">
            <label>Select Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Select role</option>
              <option value="admin">ADMIN</option>
              <option value="user">USER</option>
              <option value="guest">VERIFIER</option>
            </select>
            {errors.role && <p className="error">{errors.role}</p>}
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="button" onClick={onSubmit}>
            Signup
          </button>
        </form>
      </div>

      <style>{`
        .signup-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f7f7f7;
          font-family: 'Roboto', sans-serif;
        }

        .signup-card {
          background-color: #ffffff;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #555;
          font-size: 0.9rem;
        }

        input,
        select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 1rem;
          color: #333;
          box-sizing: border-box;
        }

        input:focus,
        select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
        }

        .error {
          color: #ff0000;
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }

        button {
          width: 100%;
          padding: 0.75rem;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        button:hover {
          background-color: #0056b3;
        }

        @media (max-width: 480px) {
          .signup-card {
            padding: 1.5rem;
            margin: 1rem;
          }

          h1 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Signup;