// // components/PromotionsList.jsx
// "use client";
// import { useState, useEffect } from 'react';

// export default function PromotionsList() {
//   const [promotions, setPromotions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPromotions = async () => {
//       try {
//         const response = await fetch('/api/promotions');
//         if (!response.ok) {
//           throw new Error('Failed to fetch promotions');
//         }
//         const data = await response.json();
//         setPromotions(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPromotions();
//   }, []);

//   if (loading) return <div>Loading promotions...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="mt-6">
//       <h2 className="text-2xl font-semibold mb-4">Available Promotions</h2>
//       {promotions.length === 0 ? (
//         <p>No active promotions at the moment.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {promotions.map((promo) => (
//             <div key={promo.id} className="border rounded-lg p-4 bg-white shadow-sm">
//               <h3 className="text-lg font-semibold">{promo.title}</h3>
//               {promo.description && <p className="text-gray-600 mt-1">{promo.description}</p>}
//               <div className="mt-2 text-emerald-600 font-medium">
//                 {promo.discountType === 'PERCENTAGE' ? (
//                   <span>{promo.discount}% OFF</span>
//                 ) : (
//                   <span>${promo.discount.toFixed(2)} OFF</span>
//                 )}
//               </div>
//               {promo.service && (
//                 <p className="text-sm mt-2">
//                   Valid for: {promo.service.name} ({promo.service.type})
//                 </p>
//               )}
//               {promo.endDate && (
//                 <p className="text-sm text-gray-500 mt-2">
//                   Expires: {new Date(promo.endDate).toLocaleDateString()}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }