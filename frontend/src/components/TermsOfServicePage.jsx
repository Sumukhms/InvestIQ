import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css'; // Reusing the login page wrapper styles

const TermsOfServicePage = () => {
    return (
        // Use login wrapper for dark background/centering
        <div className="login-container-wrapper" style={{ alignItems: 'flex-start', paddingTop: '50px' }}>
            <div className="login-container" style={{ display: 'block', minHeight: 'auto', padding: '40px' }}>
                <div className="left-panel" style={{ flex: 'none', padding: '0', maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Terms of Service</h1>

                    <p><strong>Last Updated: October 2025</strong></p>
                    
                    <p>Welcome to InvestIQ! By using our service, you agree to these Terms of Service. Please read them carefully.</p>

                    <h3>1. Acceptance of Terms</h3>
                    <p>By accessing or using the services provided by InvestIQ, you agree to be bound by these Terms and all policies referenced herein. If you do not agree, you must not use our service.</p>

                    <h3>2. Use of Service</h3>
                    <p>The InvestIQ platform provides AI-driven startup investment analysis. This information is for informational purposes only and does not constitute financial or investment advice. You assume full responsibility for any decisions made based on the information provided by the service.</p>

                    <h3>3. User Accounts</h3>
                    <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                    
                    <p style={{ marginTop: '30px', textAlign: 'center' }}>
                        <Link to="/" className="btn btn-primary" style={{ width: 'auto', padding: '10px 20px', backgroundColor: '#3c5a77' }}>
                            Go Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;