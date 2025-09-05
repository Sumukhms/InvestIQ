# InvestIQ - AI-Powered Startup Success Predictor

InvestIQ is an AI-driven platform that analyzes startup data to provide insights and predictions for funding and success. It is designed for investors seeking promising opportunities and for startups to benchmark themselves against successful companies.

## About The Project

This project leverages a machine learning model to predict the success of startups based on various parameters. The platform provides an intuitive interface for users to input startup data and receive a success prediction, along with data visualizations and financial analysis tools.

### Features

  * **User Authentication:** Secure user registration and login functionality.
  * **Startup Analysis:** Submit startup data to get a success prediction from the machine learning model.
  * **Financial Charts:** Visualize financial data with interactive charts.
  * **Funding Alerts:** Get alerts and insights on funding opportunities.
  * **Dashboard:** A user-friendly dashboard to manage analyses and view results.

### Tech Stack

The project is a full-stack application with a separate machine learning API:

  * **Frontend:**
      * React
      * Vite
      * Tailwind CSS
  * **Backend:**
      * Node.js
      * Express.js
      * MongoDB with Mongoose
      * JWT for authentication
  * **Machine Learning API:**
      * Python
      * Flask
      * Pandas
      * Joblib for model persistence

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

  * Node.js and npm (or yarn)
  * Python and pip
  * MongoDB

### Installation & Setup

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/Sumukhms/InvestIQ.git
    ```

2.  **Backend Setup:**

      * Navigate to the `backend` directory:
        ```sh
        cd backend
        ```
      * Install dependencies:
        ```sh
        npm install
        ```
      * Create a `.env` file and add the following environment variables:
        ```env
        PORT=5000
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        ```
      * Start the backend server:
        ```sh
        npm start
        ```

3.  **Frontend Setup:**

      * Navigate to the `frontend` directory:
        ```sh
        cd frontend
        ```
      * Install dependencies:
        ```sh
        npm install
        ```
      * Start the frontend development server:
        ```sh
        npm run dev
        ```

4.  **Machine Learning API Setup:**

      * Navigate to the `ml_api` directory:
        ```sh
        cd ml_api
        ```
      * Install Python dependencies:
        ```sh
        pip install -r requirements.txt
        ```
      * Start the Flask API:
        ```sh
        python app.py
        ```

## API Usage

The application uses its own internal backend API and a separate Flask API for machine learning predictions.

### Backend API

The backend handles user authentication and data management for startup analyses. Key API routes include:

  * `POST /api/auth/register`: Register a new user.
  * `POST /api/auth/login`: Log in a user.
  * `POST /api/analysis`: Create a new analysis.
  * `GET /api/analysis`: Get all analyses for the logged-in user.

### Machine Learning API

The Flask API provides the startup success prediction.

  * `POST /predict`: Takes startup data as JSON input and returns a success prediction.

## Contributing

Contributions are welcome\! Please follow these steps to contribute:

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
