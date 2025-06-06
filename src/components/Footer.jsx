import { getSettingsForAll } from "@/features/settings/settingTunks";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Footer = () => {
    const dispatch = useDispatch();
const { settingData } = useSelector((state) => state.settings); // ✅ Correct
console.log('see',settingData)
  useEffect(() => {
    getSettingsForAll(dispatch);
  }, [dispatch]);
    return (
      <footer className="bg-mint-cream text-deep-green">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10 border-t border-stark-white-200">
          
          {/* Branding */}
          <div>
            <h4 className="text-xl font-semibold mb-3 text-forest-green">{settingData?.name}</h4>
            <p className="text-sm text-sea-green">
              Crafting elegance for generations.<br />
              Made with love & precision.
            </p>
          </div>
  
          {/* Links */}
          <div>
            <h4 className="text-xl font-semibold mb-3 text-forest-green">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {['Home', 'Shop', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-teal-green transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
  
          {/* Contact */}
          <div>
            <h4 className="text-xl font-semibold mb-3 text-forest-green">Contact Us</h4>
            <p className="text-sm text-sea-green">Email: {settingData?.adminEmail}</p>
            <p className="text-sm text-sea-green">Phone: +91 {settingData?.contactNumber}</p>
          </div>
        </div>
  
        <div className="text-center text-xs text-slate-green py-4">
          © {new Date().getFullYear()} {settingData?.name} All rights reserved.
        </div>
      </footer>
    );
  };
  
  export default Footer;
  