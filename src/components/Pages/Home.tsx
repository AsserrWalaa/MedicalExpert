import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const Home: React.FC = () => {
  // Sample data for the bar chart
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Sales",
        data: [4000, 3000, 2000, 2780, 1890, 2390, 3490],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return ` $${context.raw}`;
          },
        },
      },
    },
  };

  // Custom styles
  const cardStyle = {
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    border: "none",
    color: "#fff",
  };

  const cardTitleStyle = {
    fontSize: "1rem",
    fontWeight: "500",
    opacity: 0.9,
  };

  const statStyle = {
    fontSize: "1.75rem",
    fontWeight: "bold",
  };

  const colors = {
    users: "#28a745", // Green
    orders: "#17a2b8", // Blue
    revenue: "#ffc107", // Yellow
    sessions: "#dc3545", // Red
  };

  return (
    <div className="container-fluid mt-5">
      <Row className="g-4">
        <Col xs={10} sm={6} md={4} lg={3}>
          <Card
            className="text-center p-3"
            style={{ ...cardStyle, backgroundColor: colors.users }}>
            <Card.Body>
              <Card.Title style={cardTitleStyle}>Total Users</Card.Title>
              <Card.Text style={statStyle}>1,234</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={10} sm={6} md={4} lg={3}>
          <Card
            className="text-center p-3"
            style={{ ...cardStyle, backgroundColor: colors.orders }}>
            <Card.Body>
              <Card.Title style={cardTitleStyle}>New Orders</Card.Title>
              <Card.Text style={statStyle}>567</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={10} sm={6} md={4} lg={3}>
          <Card
            className="text-center p-3"
            style={{ ...cardStyle, backgroundColor: colors.revenue }}>
            <Card.Body>
              <Card.Title style={cardTitleStyle}>Revenue</Card.Title>
              <Card.Text style={statStyle}>$89,000</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={10} sm={6} md={4} lg={3}>
          <Card
            className="text-center p-3"
            style={{ ...cardStyle, backgroundColor: colors.sessions }}>
            <Card.Body>
              <Card.Title style={cardTitleStyle}>Active Sessions</Card.Title>
              <Card.Text style={statStyle}>321</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={10} className="d-flex justify-content-center">
          <Card
            className="w-100 p-3"
            style={{
              maxWidth: "600px",
              ...cardStyle,
              backgroundColor: "#f8f9fa",
              color: "#333",
            }}>
            <Card.Body>
              <Card.Title style={{ ...cardTitleStyle, color: "#333" }}>
                Bar Chart Example
              </Card.Title>
              <div style={{ width: "100%", height: 300 }}>
                <Bar data={data} options={options} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
