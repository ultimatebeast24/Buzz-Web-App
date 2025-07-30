// const AuthImagePattern = ({ title, subtitle }) => {
//   return (
//     <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
//       <div className="max-w-md text-center">
//         <div className="grid grid-cols-3 gap-3 mb-8">
//           {[...Array(9)].map((_, i) => (
//             <div
//               key={i}
//               className={`aspect-square rounded-2xl bg-primary/10 ${
//                 i % 2 === 0 ? "animate-pulse" : ""
//               }`}
//             />
//           ))}
//         </div>
//         <h2 className="text-2xl font-bold mb-4">{title}</h2>
//         <p className="text-base-content/60">{subtitle}</p>
//       </div>
//     </div>
//   );
// };

// export default AuthImagePattern;

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        {/* Image with pulse animation */}
        <div className="relative aspect-square rounded-2xl overflow-hidden">
          <img
            src="/BUZZ.jpeg" // Replace with your image path
            alt="Image with pulse effect"
            className="w-full h-full object-cover animate-pulse duration-1000"
          />
        </div>

        {/* Title and Subtitle */}
        <h2 className="text-2xl font-bold mb-3 mt-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
        <p>Special thanks to Claude AI for it's invaluable assistance in bringing BUZZ to life!</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;