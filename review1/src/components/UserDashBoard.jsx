import React from 'react';
import { Link } from 'react-router-dom';
import './UserDashBoard.css';

function UserDashboard() {
    const speeches = [
        {
          id: 1,
          title: "The Power of Positive Thinking",
          author: "John Doe",
          date: "2022-01-01",
          rating: 4.5,
          review: "Inspiring speech that changed my perspective on life."
        },
        {
          id: 2,
          title: "The Future of Artificial Intelligence",
          author: "Jane Smith",
          date: "2022-02-15",
          rating: 4.8,
          review: "Mind-blowing insights into the world of AI."
        },
        {
          id: 3,
          title: "Overcoming Fear and Anxiety",
          author: "Bob Johnson",
          date: "2022-03-20",
          rating: 4.2,
          review: "Helpful tips and strategies for managing fear and anxiety."
        },
        {
          id: 4,
          title: "The Importance of Self-Care",
          author: "Emily Chen",
          date: "2022-04-10",
          rating: 4.9,
          review: "A must-listen for anyone looking to prioritize their well-being."
        },
        {
          id: 5,
          title: "The Art of Public Speaking",
          author: "Michael Brown",
          date: "2022-05-01",
          rating: 4.6,
          review: "Practical advice for improving your public speaking skills."
        },
        {
          id: 6,
          title: "The Benefits of Meditation",
          author: "Sarah Lee",
          date: "2022-06-15",
          rating: 4.7,
          review: "A calming and informative speech on the benefits of meditation."
        },
        {
          id: 7,
          title: "The Power of Gratitude",
          author: "David Kim",
          date: "2022-07-01",
          rating: 4.4,
          review: "A heartwarming speech on the importance of gratitude in our lives."
        },
        {
          id: 8,
          title: "The Art of Negotiation",
          author: "Jessica Lee",
          date: "2022-08-10",
          rating: 4.3,
          review: "Valuable insights and techniques for effective negotiation."
        },
        {
          id: 9,
          title: "The Psychology of Happiness",
          author: "Daniel Park",
          date: "2022-09-15",
          rating: 4.7,
          review: "Fascinating exploration of the science behind happiness."
        },
        {
          id: 10,
          title: "The Impact of Climate Change",
          author: "Jacob Kim",
          date: "2022-10-01",
          rating: 4.6,
          review: "Important and timely speech on the effects of climate change."
        }
      ];

  return (
    <div className="user-dashboard">
      <Link to="/">
        <button>Back to Home</button>
      </Link>
      <h1>User Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Date</th>
            <th>Rating</th>
            <th>Review</th>
          </tr>
        </thead>
        <tbody>
          {speeches.map((speech) => (
            <tr key={speech.id}>
              <td>{speech.title}</td>
              <td>{speech.author}</td>
              <td>{speech.date}</td>
              <td>{speech.rating}</td>
              <td>{speech.review}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="stats">
        <h2>Statistics</h2>
        <p>Average rating: 4.57</p>
        <p>Total speeches: 10</p>
      </div>
    </div>
  );
}

export default UserDashboard;
