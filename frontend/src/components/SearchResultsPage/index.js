import { Component } from 'react';
import { Link, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from '../Header';
import './index.css'

// Higher-order component to pass params to class component
function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class SearchResultsPage extends Component {
  state = {
    breweries: [],
    errorMessage: '',
  };

  async componentDidMount() {
    const { searchType, searchQuery } = this.props.params;
    
    const token = Cookies.get('jwtToken');

    try {
      const response = await fetch(`http://localhost:3000/breweries/${searchType}/${searchQuery}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    //   console.log(response)
      if (response.ok) {
        const data = await response.json();
        this.setState({ breweries: data });
      } else {
        this.setState({ errorMessage: 'Error fetching breweries' });
      }
    } catch (error) {
      console.error('Error fetching breweries:', error);
      this.setState({ errorMessage: 'Network error' });
    }
  }

  render() {
    const { breweries, errorMessage } = this.state;

    return (
        <><Header />
        <div className="brewery-results-container">
        {errorMessage && <p className="error-msg">{errorMessage}</p>}
        {breweries.length > 0 ? (
          <div className="brewery-cards">
            {breweries.map((brewery) => (
              <Link to={`/brewery/${brewery.id}`} className="brewery-link"><div key={brewery.id} className="brewery-card">
                <h1 className='brewery_name'>{brewery.name}</h1>
                <p className='address'><span className='span_addr'> Address:</span>{brewery.street}, {brewery.city}, {brewery.state}</p>
                <p className='address'><span className='span_addr'>Phone:</span> {brewery.phone || 'N/A'}</p>
                <p className='address'><span className='span_addr'>Website:</span> <a href={brewery.website_url || '#'}>{brewery.website_url ? brewery.website_url : 'N/A'}</a></p>
                <div className="type_city_name">
                <p className='address'><span className='span_addr'>Type: </span> {brewery.brewery_type}</p>
                <p className='address'><span className='span_addr'>State:</span>  {brewery.state}</p>
                <p className='address'><span className='span_addr'>City:</span> {brewery.city}</p>
                </div>
                
              </div></Link>
            ))}
          </div>
        ) : (
          <p className='no_reviews' >No breweries found</p>
        )}
      </div>
      </>
    );
  }
}

export default withParams(SearchResultsPage);
