// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '../hooks/useAuth';

// const LoginScreen = () => {
//   const [mode, setMode] = useState('login');
//   const { login, register: registerUser, loginAsGuest, loginWithGoogle, loading, error, clearError } = useAuth();
  
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//     watch
//   } = useForm({
//     mode: 'onChange', 
//   });

//   const password = watch('password'); // For confirm password validation

//   const onSubmit = async (data) => {
//     try {
//       clearError();
      
//       if (mode === 'login') {
//         await login(data.email, data.password);
//       } else if (mode === 'register') {
//         await registerUser(data.email, data.password, data.displayName);
//       } else if (mode === 'forgot') {
//         // TODO: Implement password reset functionality
//         console.log('Password reset for:', data.email);
//         // You'll need to add this to your firebaseService.js
//         // await sendPasswordResetEmail(data.email);
//         alert('Password reset link sent to your email!');
//         setMode('login');
//       }
//     } catch (err) {
//       console.error('Form submission error:', err);
//     }
//   };

//   const handleGuestLogin = async () => {
//     try {
//       clearError();
//       await loginAsGuest();
//     } catch (err) {
//       console.error('Guest login error:', err);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     try {
//       clearError();
//       await loginWithGoogle();
//     } catch (err) {
//       console.error('Google login error:', err);
//     }
//   };

//   const switchMode = (newMode) => {
//     setMode(newMode);
//     reset(); // Clear form when switching modes
//     clearError();
//   };

//   const formVariants = {
//     hidden: { opacity: 0, x: -50 },
//     visible: { opacity: 1, x: 0 },
//     exit: { opacity: 0, x: 50 }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <motion.h1 
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-4xl font-bold text-white mb-2"
//           >
//             Geography Quiz
//           </motion.h1>
//           <motion.p 
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="text-blue-200"
//           >
//             Test your knowledge of world geography
//           </motion.p>
//         </div>

//         {/* Form Card */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white rounded-lg shadow-2xl p-6"
//         >
//           {/* Mode Header */}
//           <div className="text-center mb-6">
//             <h2 className="text-2xl font-semibold text-gray-800">
//               {mode === 'login' && 'Welcome Back'}
//               {mode === 'register' && 'Create Account'}
//               {mode === 'forgot' && 'Reset Password'}
//             </h2>
//             <p className="text-gray-600 mt-1">
//               {mode === 'login' && 'Sign in to continue your journey'}
//               {mode === 'register' && 'Join us and start learning'}
//               {mode === 'forgot' && 'Enter your email to reset password'}
//             </p>
//           </div>

//           {/* Error Message */}
//           <AnimatePresence>
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: 'auto' }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
//               >
//                 <div className="flex items-center">
//                   <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   {error}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Form */}
//           <AnimatePresence mode="wait">
//             <motion.form
//               key={mode}
//               variants={formVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               transition={{ duration: 0.3 }}
//               onSubmit={handleSubmit(onSubmit)}
//               className="space-y-4"
//             >
//               {/* Display Name - Only for register */}
//               {mode === 'register' && (
//                 <div>
//                   <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
//                     Display Name *
//                   </label>
//                   <input
//                     {...register('displayName', {
//                       required: 'Display name is required',
//                       minLength: {
//                         value: 2,
//                         message: 'Display name must be at least 2 characters'
//                       },
//                       maxLength: {
//                         value: 30,
//                         message: 'Display name must be less than 30 characters'
//                       }
//                     })}
//                     type="text"
//                     id="displayName"
//                     className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
//                       errors.displayName ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter your display name"
//                   />
//                   {errors.displayName && (
//                     <motion.p 
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="text-red-500 text-sm mt-1"
//                     >
//                       {errors.displayName.message}
//                     </motion.p>
//                   )}
//                 </div>
//               )}

//               {/* Email */}
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                   Email Address *
//                 </label>
//                 <input
//                   {...register('email', {
//                     required: 'Email is required',
//                     pattern: {
//                       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                       message: 'Please enter a valid email address'
//                     }
//                   })}
//                   type="email"
//                   id="email"
//                   className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
//                     errors.email ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="Enter your email"
//                 />
//                 {errors.email && (
//                   <motion.p 
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     className="text-red-500 text-sm mt-1"
//                   >
//                     {errors.email.message}
//                   </motion.p>
//                 )}
//               </div>

//               {/* Password - Not for forgot mode */}
//               {mode !== 'forgot' && (
//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                     Password *
//                   </label>
//                   <input
//                     {...register('password', {
//                       required: 'Password is required',
//                       minLength: {
//                         value: 6,
//                         message: 'Password must be at least 6 characters'
//                       },
//                       ...(mode === 'register' && {
//                         pattern: {
//                           value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//                           message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
//                         }
//                       })
//                     })}
//                     type="password"
//                     id="password"
//                     className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
//                       errors.password ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter your password"
//                   />
//                   {errors.password && (
//                     <motion.p 
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="text-red-500 text-sm mt-1"
//                     >
//                       {errors.password.message}
//                     </motion.p>
//                   )}
//                 </div>
//               )}

//               {/* Confirm Password - Only for register */}
//               {mode === 'register' && (
//                 <div>
//                   <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                     Confirm Password *
//                   </label>
//                   <input
//                     {...register('confirmPassword', {
//                       required: 'Please confirm your password',
//                       validate: value => value === password || 'Passwords do not match'
//                     })}
//                     type="password"
//                     id="confirmPassword"
//                     className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
//                       errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="Confirm your password"
//                   />
//                   {errors.confirmPassword && (
//                     <motion.p 
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="text-red-500 text-sm mt-1"
//                     >
//                       {errors.confirmPassword.message}
//                     </motion.p>
//                   )}
//                 </div>
//               )}

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading || isSubmitting}
//                 className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
//               >
//                 {(loading || isSubmitting) ? (
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                 ) : null}
//                 {mode === 'login' && 'Sign In'}
//                 {mode === 'register' && 'Create Account'}
//                 {mode === 'forgot' && 'Send Reset Link'}
//               </button>
//             </motion.form>
//           </AnimatePresence>

//           {/* Divider - Only show for login mode */}
//           {mode === 'login' && (
//             <div className="my-6 flex items-center">
//               <div className="flex-1 border-t border-gray-300"></div>
//               <div className="mx-4 text-gray-500 text-sm">or</div>
//               <div className="flex-1 border-t border-gray-300"></div>
//             </div>
//           )}

//           {/* Google Login Button - Only for login mode */}
//           {mode === 'login' && (
//             <button
//               onClick={handleGoogleLogin}
//               disabled={loading}
//               className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center mb-3"
//             >
//               <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                 <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                 <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                 <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                 <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//               </svg>
//               Continue with Google
//             </button>
//           )}

//           {/* Guest Login Button - Only for login mode */}
//           {mode === 'login' && (
//             <button
//               onClick={handleGuestLogin}
//               disabled={loading}
//               className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200 border border-gray-300"
//             >
//               Continue as Guest
//             </button>
//           )}

//           {/* Mode Switching Links */}
//           <div className="text-center mt-6 space-y-2">
//             {mode === 'login' && (
//               <>
//                 <p className="text-gray-600">
//                   Don't have an account?
//                   <button
//                     type="button"
//                     onClick={() => switchMode('register')}
//                     className="text-blue-600 hover:text-blue-800 font-medium ml-2 transition duration-200"
//                   >
//                     Sign Up
//                   </button>
//                 </p>
//                 <p className="text-gray-600">
//                   <button
//                     type="button"
//                     onClick={() => switchMode('forgot')}
//                     className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
//                   >
//                     Forgot your password?
//                   </button>
//                 </p>
//               </>
//             )}
            
//             {mode === 'register' && (
//               <p className="text-gray-600">
//                 Already have an account?
//                 <button
//                   type="button"
//                   onClick={() => switchMode('login')}
//                   className="text-blue-600 hover:text-blue-800 font-medium ml-2 transition duration-200"
//                 >
//                   Sign In
//                 </button>
//               </p>
//             )}
            
//             {mode === 'forgot' && (
//               <p className="text-gray-600">
//                 Remember your password?
//                 <button
//                   type="button"
//                   onClick={() => switchMode('login')}
//                   className="text-blue-600 hover:text-blue-800 font-medium ml-2 transition duration-200"
//                 >
//                   Back to Sign In
//                 </button>
//               </p>
//             )}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default LoginScreen;