import React from 'react';

interface PrivacyPolicyProps {
    onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none p-4 rounded-lg">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p><em>Last Updated: {new Date().toLocaleDateString()}</em></p>

        <p>
            BantayBuwaya is committed to protecting your privacy and ensuring the anonymity of your reports. This Privacy Policy explains how we handle your information.
        </p>

        <h2 className="text-xl font-semibold mt-4 mb-2">1. Information We Collect</h2>
        <ul>
            <li>
                <strong>Account Information:</strong> When you sign in using Google, we receive your basic profile information (name, email address, profile picture) from Google for authentication purposes. We do not store this information long-term in association with your reports. The login is solely to prevent spam and abuse of the service.
            </li>
            <li>
                <strong>Report Information:</strong> We collect the information you voluntarily provide in your corruption reports, including text descriptions and any uploaded files. We take steps to ensure this information is handled securely.
            </li>
        </ul>

        <h2 className="text-xl font-semibold mt-4 mb-2">2. How We Use Information</h2>
        <ul>
            <li>
                <strong>Authentication:</strong> Your Google account information is used only to verify your identity and secure your session.
            </li>
            <li>
                <strong>Anonymity:</strong> Your personal account information is NEVER linked to the content of the report submitted for analysis. Our system is designed to decouple user identity from report data to maintain your anonymity.
            </li>
        </ul>

        <h2 className="text-xl font-semibold mt-4 mb-2">3. Data Security</h2>
        <p>
            We use industry-standard security measures to protect the information submitted to us. All data is transmitted over secure (HTTPS) connections.
        </p>

        <h2 className="text-xl font-semibold mt-4 mb-2">4. Data Sharing</h2>
        <p>
            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. The anonymized content of reports may be shared with anti-corruption bodies or journalists for the purpose of investigation, but without any link to your identity.
        </p>
        
        <h2 className="text-xl font-semibold mt-4 mb-2">5. Your Rights</h2>
        <p>
            You have the right to request the deletion of your account. Please contact us to process such requests.
        </p>

        <h2 className="text-xl font-semibold mt-4 mb-2">Changes to This Policy</h2>
        <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>

        <div className="text-center mt-8">
            <button
                onClick={onBack}
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
            >
                Back to App
            </button>
        </div>
    </div>
  );
};