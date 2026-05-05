import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6">
      <div className="bg-white/5 border border-white/10 p-10 rounded-3xl w-full max-w-md backdrop-blur-lg">
        <h2 className="text-3xl font-bold text-center mb-8">System Access</h2>

        {/* Your Login Form Form will go here, connecting to authService.js */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enterprise Email"
            className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-brand-purple transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-brand-purple transition-colors"
          />

          <button className="w-full bg-brand-purple text-white font-bold py-4 rounded-xl mt-4 hover:bg-brand-blue transition-colors">
            Authenticate
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-gray-500 hover:text-white text-sm transition-colors"
          >
            &larr; Return to Main Site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

