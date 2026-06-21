import { useState, FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (isRegister) await register(email, name, password);
      else await login(email, password);
    } catch (err: any) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Kanban Board</h1>
        <p className="text-gray-500 text-center mb-6">
          {isRegister ? "Create an account" : "Welcome back"}
        </p>
        {isRegister && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          {isRegister ? "Register" : "Login"}
        </button>
        <p className="text-center mt-4 text-sm text-gray-500">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-indigo-600 font-semibold">
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </form>
    </div>
  );
}
