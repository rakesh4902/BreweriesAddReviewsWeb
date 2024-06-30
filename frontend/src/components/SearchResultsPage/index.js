import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from '../Header';
import './index.css';

const SearchResultsPage = () => {
  const { searchType, searchQuery } = useParams();
  const [breweries, setBreweries] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBreweries = async () => {
      const token = Cookies.get('jwtToken');
      try {
        const response = await fetch(`https://breweriesaddreviewsweb2.onrender.com/breweries/${searchType}/${searchQuery}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBreweries(data);
          setIsLoading(false);
        } else {
          setErrorMessage('Error fetching breweries');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching breweries:', error);
        setErrorMessage('Network error');
        setIsLoading(false);
      }
    };

    fetchBreweries();
  }, [searchType, searchQuery]);

  return (
    <>
      <Header />
      <div className="brewery-results-container">
        {isLoading ? (
          <div className='loader'></div>
        ) : (
          <>
            {errorMessage && <p className="error-msg">{errorMessage}</p>}
            {breweries.length > 0 ? (
              <>
              <h1 class="review-heading">Want to add a review? Click on your interested brewery</h1>
              <div className="brewery-cards">
                
                {breweries.map((brewery) => (
                  <Link to={`/brewery/${brewery.id}`} className="brewery-link" key={brewery.id}>
                    <div className="brewery-card">
                      <h1 className='brewery_name'>{brewery.name}</h1>
                      <p className='address'><span className='span_addr'> Address:</span>{brewery.street}, {brewery.city}, {brewery.state}</p>
                      <p className='address'><span className='span_addr'>Phone:</span> {brewery.phone || 'N/A'}</p>
                      <p className='address'><span className='span_addr'>Website:</span> <a href={brewery.website_url || '#'}>{brewery.website_url ? brewery.website_url : 'N/A'}</a></p>
                      <div className="type_city_name">
                        <p className='address'><span className='span_addr'>State:</span>  {brewery.state}</p>
                        <p className='address'><span className='span_addr'>City:</span> {brewery.city}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              </>
            ) : (
              <p className='no_reviews'>No breweries found</p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SearchResultsPage;
