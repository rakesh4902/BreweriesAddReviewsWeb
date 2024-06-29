import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import './index.css';

const SearchPage = () => {
    const [searchType, setSearchType] = useState('by_name');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearchTypeChange = (event) => {
        setSearchType(event.target.value);
    };

    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearch = () => {
        navigate(`/results/${searchType}/${searchQuery}`);
    };

    return (
        <>
            <Header />
            <div className="search-page-container">
                <div className="search-form">
                    <select 
                        value={searchType} 
                        onChange={handleSearchTypeChange} 
                        className='search_by'
                    >
                        <option value="by_name">Search By Name</option>
                        <option value="by_city">Search By City</option>
                        <option value="by_type">Search By Type</option>
                    </select>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        placeholder="Enter your interests"
                        className='search_input'
                    />
                    <button onClick={handleSearch} className='search_button'>Search</button>
                </div>
            </div>
        </>
    );
};

export default SearchPage;
