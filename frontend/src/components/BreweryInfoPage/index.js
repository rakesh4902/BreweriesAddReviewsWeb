import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import Header from '../Header';
import './index.css';

const BreweryInfoPage = () => {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [description, setDescription] = useState('');
  const [reviews, setReviews] = useState([]);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    fetchBreweryReviews();
    fetchUsername();
  }, [id]);

  const fetchUsername = async () => {
    const jwtToken = Cookies.get('jwtToken');
    try {
      const response = await fetch('https://breweriesaddreviewsweb2.onrender.com/user', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
      } else {
        console.error('Failed to fetch username');
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const jwtToken = Cookies.get('jwtToken');

    try {
      const response = await fetch(`https://breweriesaddreviewsweb2.onrender.com/brewery/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ rating, description }),
      });

      if (response.ok) {
        setRating(0);
        setDescription('');
        fetchBreweryReviews();
      } else {
        console.error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const fetchBreweryReviews = async () => {
    const jwtToken = Cookies.get('jwtToken');
    try {
      const response = await fetch(`https://breweriesaddreviewsweb2.onrender.com/brewery/${id}/reviews`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const reviewsWithColor = data.map(review => ({
          ...review,
          color: getRandomColor()
        }));
        setReviews(reviewsWithColor);
      } else {
        console.error('Failed to fetch brewery reviews');
      }
    } catch (error) {
      console.error('Error fetching brewery reviews:', error);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleMouseEnter = (index) => setHover(index);
  const handleMouseLeave = () => setHover(null);
  const handleClick = (index) => setRating(index);

  const renderStars = (num) => {
    return '⭐'.repeat(num);
  };

  const getRandomColor = () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF5'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <>
      <Header />
      <div className="rating_reviews_container">
        <h1 className="add_review_label">Add Your Review</h1>
        <h1 className="hello_name">Hello {username}</h1>
        <form className="star-rating-container" onSubmit={handleSubmit}>
          <div className='star-rating'>
            {[1, 2, 3, 4, 5].map((star, index) => (
              <span
                key={index}
                className={`star ${rating >= star ? 'filled' : ''} ${hover >= star ? 'hover' : ''}`}
                onMouseEnter={() => handleMouseEnter(star)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(star)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            placeholder="Write your review..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit" className='submit-button'>
            Submit
          </button>
        </form>
        {isLoading ? ( 
          <div className='loader'></div>
        ) : (
          <div>
            <h1 className="reviews_label">Reviews</h1>
            {reviews.length > 0 ? (
              <ul className='reviews'>
                {reviews.map((review) => (
                  <li key={review.id} className="review-item">
                    <div className="review-header">
                      <div
                        className="review-avatar"
                        style={{ backgroundColor: review.color }}
                      >
                        {review.username[0]}
                      </div>
                      <p className="review-username">{review.username}</p>
                    </div>
                    <p>{renderStars(review.rating)}</p>
                    <p className='reviews_desc'>{review.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='no_reviews'>No reviews yet. Why Can't you be the first.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BreweryInfoPage;
