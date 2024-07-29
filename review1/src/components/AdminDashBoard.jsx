import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashBoard.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashBoard() {
  const [data, setData] = useState({
    totalUsers: 0,
    totalSpeeches: 0,
    totalAnalyses: 0,
    users: [],
    speeches: [],
    analyses: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Simulated data fetching
    setData({
      totalUsers: 5,
      totalSpeeches: 8,
      totalAnalyses: 15,
      users: [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
        { id: 3, name: 'Charlie', email: 'charlie@example.com' },
        { id: 4, name: 'David', email: 'david@example.com' },
        { id: 5, name: 'Eve', email: 'eve@example.com' }
      ],
      speeches: [
        { id: 1, title: 'Speech 1', speaker: 'Alice' },
        { id: 2, title: 'Speech 2', speaker: 'Bob' },
        { id: 3, title: 'Speech 3', speaker: 'Charlie' },
        { id: 4, title: 'Speech 4', speaker: 'David' },
        { id: 5, title: 'Speech 5', speaker: 'Eve' },
        { id: 6, title: 'Speech 6', speaker: 'Alice' },
        { id: 7, title: 'Speech 7', speaker: 'Bob' },
        { id: 8, title: 'Speech 8', speaker: 'Charlie' }
      ],
      analyses: [
        { id: 1, speechId: 1, analysis: 'Positive' },
        { id: 2, speechId: 1, analysis: 'Negative' },
        { id: 3, speechId: 2, analysis: 'Neutral' },
        { id: 4, speechId: 3, analysis: 'Positive' },
        { id: 5, speechId: 4, analysis: 'Negative' },
        { id: 6, speechId: 5, analysis: 'Neutral' },
        { id: 7, speechId: 6, analysis: 'Positive' },
        { id: 8, speechId: 7, analysis: 'Negative' },
        { id: 9, speechId: 8, analysis: 'Neutral' },
        { id: 10, speechId: 8, analysis: 'Positive' },
        { id: 11, speechId: 7, analysis: 'Neutral' },
        { id: 12, speechId: 6, analysis: 'Positive' },
        { id: 13, speechId: 5, analysis: 'Negative' },
        { id: 14, speechId: 4, analysis: 'Positive' },
        { id: 15, speechId: 3, analysis: 'Neutral' }
      ]
    });
  }, []);

  const chartData = {
    labels: ['Speech 1', 'Speech 2', 'Speech 3', 'Speech 4', 'Speech 5', 'Speech 6', 'Speech 7', 'Speech 8'],
    datasets: [
      {
        label: 'Number of Analyses',
        data: [
          data.analyses.filter(analysis => analysis.speechId === 1).length,
          data.analyses.filter(analysis => analysis.speechId === 2).length,
          data.analyses.filter(analysis => analysis.speechId === 3).length,
          data.analyses.filter(analysis => analysis.speechId === 4).length,
          data.analyses.filter(analysis => analysis.speechId === 5).length,
          data.analyses.filter(analysis => analysis.speechId === 6).length,
          data.analyses.filter(analysis => analysis.speechId === 7).length,
          data.analyses.filter(analysis => analysis.speechId === 8).length
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat">
          <h2>Total Users</h2>
          <p>{data.totalUsers}</p>
        </div>
        <div className="stat">
          <h2>Total Speeches</h2>
          <p>{data.totalSpeeches}</p>
        </div>
        <div className="stat">
          <h2>Total Analyses</h2>
          <p>{data.totalAnalyses}</p>
        </div>
      </div>
      <div className="dashboard-charts">
        <h2>Speech Analyses Overview</h2>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': ' + context.raw;
                  }
                }
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Speeches'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Number of Analyses'
                },
                beginAtZero: true
              }
            }
          }}
        />
      </div>
      <div className="dashboard-tables">
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Speeches</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Speaker</th>
            </tr>
          </thead>
          <tbody>
            {data.speeches.map(speech => (
              <tr key={speech.id}>
                <td>{speech.id}</td>
                <td>{speech.title}</td>
                <td>{speech.speaker}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Analyses</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Speech ID</th>
              <th>Analysis</th>
            </tr>
          </thead>
          <tbody>
            {data.analyses.map(analysis => (
              <tr key={analysis.id}>
                <td>{analysis.id}</td>
                <td>{analysis.speechId}</td>
                <td>{analysis.analysis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="back-button" onClick={() => navigate('/')}>Back to Homepage</button>
    </div>
  );
}

export default AdminDashBoard;
