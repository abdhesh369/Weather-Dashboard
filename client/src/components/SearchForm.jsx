import { useState } from "react";
import { FiSearch } from "react-icons/fi";

import { motion } from "framer-motion";

function SearchForm({ onSearch }) {
    const [city, setCity] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        if (city.trim()) {
            onSearch(city);
            setCity("");
        }
    };

    return (
        <motion.form 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="search-form" 
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                placeholder="Search city..."
                className="search-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="search-button" 
                aria-label="Search"
            >
                <FiSearch size={20} />
            </motion.button>
        </motion.form>
    )
}

export default SearchForm;
