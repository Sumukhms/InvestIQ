# InvestIQ 🚀

**InvestIQ** is a comprehensive, AI-powered analytics platform designed to help startup founders and investors make data-driven decisions. By combining financial tracking, competitor analysis, and machine learning models, InvestIQ provides actionable insights into a startup's probability of success and growth trajectory.

---

## 🌟 Key Features

* **🔮 AI Success Prediction:** Uses an advanced Stacking Ensemble ML model (XGBoost, LightGBM, Random Forest) to predict startup success probability based on funding, milestones, and network strength.
* **📊 Interactive Dashboard:** Real-time overview of key metrics, alerts, and financial health.
* **📈 Startup Scorecard:** A detailed evaluation tool that rates startups across multiple dimensions (Team, Product, Market) and provides a downloadable report.
* **💰 Financial Tracking:** Manage and visualize runway, burn rate, and revenue projections.
* **🤖 Smart Chatbot:** An AI assistant (powered by Google Gemini) to answer queries about market trends and startup strategies.
* **⚔️ Competitor Analysis:** Track and compare performance against direct competitors.
* **🌍 Funding Environment:** Insights into the current investment landscape and funding trends.
* **💡 Growth Engine:** Automated, AI-generated suggestions for scaling and operational improvements.
* **🔔 Real-time Alerts:** Notifications for market shifts, news, and critical threshold breaches.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **Visualization:** Recharts, React Circular Progressbar
* **Routing:** React Router DOM

### **Backend**
* **Runtime:** Node.js & Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** Passport.js (Google OAuth), JWT
* **AI Integration:** Google Generative AI SDK

### **Machine Learning Engine**
* **Language:** Python
* **API:** Flask
* **Libraries:** Scikit-Learn, XGBoost, LightGBM, Pandas, NumPy
* **Model:** Stacked Ensemble Classifier

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v16+)
* Python (v3.8+)
* MongoDB (Local or Atlas)

### 1. Clone the Repository
```bash
git clone [https://github.com/sumukhms/InvestIQ.git](https://github.com/sumukhms/InvestIQ.git)
cd InvestIQ
````

### 2\. Backend Setup

```bash
cd backend
npm install
# Create a .env file (see Environment Variables below)
npm start
```

### 3\. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4\. Machine Learning Service

```bash
cd ml_model
pip install -r requirements.txt
python train_model.py  # Run this once to generate the .pkl models
python app.py          # Starts the Flask prediction API
```

-----

## 🔑 Environment Variables

Create a `.env` file in the `backend` directory with the following keys:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
GEMINI_API_KEY=your_google_gemini_api_key
SENDGRID_API_KEY=your_sendgrid_key (Optional for email)
EMAIL_FROM=no-reply@investiq.com
```

-----

## 🧠 How the ML Model Works

The core prediction engine (`ml_model/`) analyzes historical startup data to generate a "Success Probability" score. It utilizes **Advanced Feature Engineering** to calculate:

  * **Funding Momentum:** Rate of capital inflow relative to years active.
  * **Milestone Velocity:** Speed of achieving key operational goals.
  * **Network Strength:** Quality and quantity of investor/advisor relationships.

-----

## 📄 License

This project is licensed under the MIT License.

------

