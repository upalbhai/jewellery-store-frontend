// HomePage.js
import FeatureComponent from '@/components/FeatureComponent';
import useSocket from '@/core/socket';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-off-white text-deep-green mt-10">

      <section className="bg-mint-cream py-20 text-center">
        <h2 className="text-4xl font-semibold mb-4 text-deep-green">Timeless Beauty</h2>
        <p className="max-w-xl mx-auto text-sea-green text-lg">
          Discover handcrafted jewelry that embodies elegance and sophistication. Perfect for every occasion.
        </p>
        <button onClick={()=>navigate('/search')} className="mt-6 px-6 py-3 rounded-full bg-forest-green text-white hover:bg-teal-green transition">
          Explore Collection
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-8">
        {['Rings', 'Necklaces', 'Bracelets'].map((item, idx) => (
          <div
            key={idx}
            className="bg-light-teal p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold text-forest-green mb-2">{item}</h3>
            <p className="text-sea-green">
              Shop our exclusive collection of {item.toLowerCase()} crafted with precision.
            </p>
          </div>
        ))}
      </section>
      <FeatureComponent/>
    </div>
  );
};

export default HomePage;