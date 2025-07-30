"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "@/app/graphql/userMutation";
import SotetelLogo from "@/assets/images/sotetel_logo.png";
import Image from "next/image";


export default function LoginModal() {
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Add state for toggling between login and forgot password view
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Apollo mutation for login
  const [loginUser, { loading, error }] = useMutation(LOGIN_MUTATION);

    

  
  // Toggle to the Forgot Password form
  const handleForgotPassword = () => {
    setIsForgotPassword(true);
  };

  // Toggle back to the Login form
  const handleBackToLogin = () => {
    setIsForgotPassword(false);
  };

  // Handle form submit (login)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await loginUser({ variables: { email, password } });
      const token = response.data?.login?.token;
      if (token) {
        // You can store the token or handle the successful login here (e.g., redirect to a protected page)
        console.log("Login successful, token:", token);
        localStorage.setItem("token", token); // Store the token in local storage

        location.href = "/"; // Redirect to the home page after successful login


      }
    } catch (err) {
      //console.error("Login failed:", err);
    }
  };

  return (
    <>
      { (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex justify-center items-center select-none">
          <div
            className={`bg-gradient-to-b from-blue-300 to-blue-50 p-8 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-300 ease-in-out `}
            style={{ filter: "drop-shadow(0 0 5px aliceblue)" }}
          >
            

            {/* Render Login Form or Forgot Password Form based on the state */}
            <div className={`${isForgotPassword ? 'opacity-0 translate-x-[100%]' : 'opacity-100 translate-x-0'} transition-all duration-300 ease-in-out`}>
              <div className="mb-8 items-center justify-center flex flex-col">
                <Image src={SotetelLogo} alt="Sotetel Logo" width={200} height={200} draggable={false} />
                <h2 className="text-xl font-semibold text-center text-[#444] mt-2 ml-5">تسجيل <span className="text-blue-500">الدخول</span></h2>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-gray-600">عنوان البريد الإلكتروني</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Update email state
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-gray-600">كلمة المرور</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Update password state
                    placeholder="أدخل كلمة المرور الخاصة بك"
                    required
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input type="checkbox" id="remember" className="mr-2" />
                    <label htmlFor="remember" className="text-gray-600">تذكرني</label>
                  </div>
                  <a href="#" onClick={handleForgotPassword} className="text-sm text-primary hover:underline">نسيت كلمة المرور؟</a>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 mt-4 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary-focus transition-all"
                  disabled={loading} // Disable the button while the request is loading
                >
                  {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                </button>
              </form>
              {error && <p className="text-red-500 text-center mt-2">{error.message}</p>}
            </div>

            {/* Forgot Password Form */}
            {isForgotPassword && (
              <div className="transition-all duration-300 ease-in-out  mt-[-400px]">
                <div className="mb-8 items-center justify-center flex flex-col">
                  <Image src={SotetelLogo} alt="Sotetel Logo" width={200} height={200} draggable={false} />
                  <h2 className="text-xl font-semibold text-center text-black mt-2 ml-5">نسيت <span className="text-orange-500">كلمة المرور</span></h2>
                </div>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="reset-email" className="block text-gray-600">أدخل عنوان بريدك الإلكتروني</label>
                    <input
                      type="email"
                      id="reset-email"
                      placeholder="أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور"
                      required
                      className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 mt-4 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary-focus transition-all"
                  >
                    إعادة تعيين كلمة المرور
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    onClick={handleBackToLogin} // Switch back to login view
                    className="text-primary hover:underline"
                  >
                    العودة إلى تسجيل الدخول
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
