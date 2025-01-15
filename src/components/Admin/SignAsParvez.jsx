import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SignAsParvez = () => {
  const [shopId, setShopId] = useState(1); // Example shop ID
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch detailed product information for the specified shop
    axios.get(`http://localhost:8081/shops/${shopId}/products`)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
      });
  }, [shopId]);

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Products for Shop {shopId}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.product_id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src={product.image_url} alt={product.title} className="w-full h-48 object-cover" />
            {console.log(product.title + ' ' + product.image_url)}
            <div className="p-4">
              <h3 className="text-lg font-bold">{product.title}</h3>
              <p className="text-gray-700">{product.description}</p>
              <strong className="block mt-2 text-red-500">Tk {product.price}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignAsParvez;


// projectimages/products/Vegetables/Capsicum.jpg
// projectimages\products\Vagetables\Capsicum.jpg








// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const SignAsParvez = () => {
//   const [shops, setShops] = useState([]);

//   useEffect(() => {
//     // Fetch all shops from the database
//     axios.get('http://localhost:8081/shops')
//       .then(response => {
//         setShops(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching shops:', error);
//       });
//   }, []);

//   return (
//     <div className="p-8 min-h-screen bg-gray-100">
//       <h1 className="text-3xl font-bold mb-8">All Shops</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {shops.map(shop => (
//           <div key={shop.shop_id} className="bg-white rounded-lg shadow-lg overflow-hidden">
//             <img src={shop.shop_image} alt={shop.shop_name} className="w-full h-48 object-cover" />
//             <div className="p-4">
//               <h3 className="text-lg font-bold">{shop.shop_name}</h3>
//               <p className="text-gray-700">{shop.full_address}</p>
//               <p className="text-gray-700">Rating: {shop.shop_rating}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };


// export default SignAsParvez;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const SignAsParvez = () => {
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     // Fetch product data from the database
//     axios.get('http://localhost:8081/products/3500') // Replace with the actual product ID or endpoint
//       .then(response => {
//         setProduct(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching product data:', error);
//       });
//   }, []);

//   if (!product) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//         <img src={product.image_url} alt={product.title} className="w-full h-48 object-cover" />
//         <div className="p-4">
//           <h2 className="text-xl font-bold mb-2">{product.title}</h2>
//           <p className="text-gray-700 mb-2">Category: {product.category}</p>
//           <p className="text-gray-700 mb-2">Price: ${product.price}</p>
//           <p className="text-gray-700 mb-2">Stock Quantity: {product.stock_quantity}</p>
//           <p className="text-gray-700 mb-2">Brand: {product.brand}</p>
//           <p className="text-gray-700 mb-2">Max Discountable Price: ${product.max_discountable_price}</p>
//           <p className="text-gray-700">{product.description}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignAsParvez;