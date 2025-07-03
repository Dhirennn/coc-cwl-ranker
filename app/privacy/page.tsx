export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-yellow-300 mb-8 text-center">Privacy Policy</h1>
        
        <div className="bg-slate-800 rounded-lg p-8 space-y-6 text-slate-200">
          <p className="text-sm text-slate-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-yellow-300 mb-4">Information We Collect</h2>
            <p className="mb-4">
              When you use CWL War Council, we may collect the following information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Clash of Clans clan tags and API keys you provide</li>
              <li>Browser information and IP address for analytics</li>
              <li>Cookies for advertising and site functionality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-yellow-300 mb-4">How We Use Information</h2>
            <p className="mb-4">We use the collected information to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide CWL ranking calculations and analysis</li>
              <li>Improve our service and user experience</li>
              <li>Display relevant advertisements</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-yellow-300 mb-4">Data Storage</h2>
            <p>
              We do not permanently store your Clash of Clans API keys or clan data. 
              API keys are used only for the duration of your session to fetch clan information 
              from Supercell's servers and are not saved to our databases.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-yellow-300 mb-4">Third-Party Services</h2>
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Google AdSense</h3>
            <p className="mb-4">
              We use Google AdSense to display advertisements. Google may use cookies to 
              serve ads based on your visits to this site and other sites on the Internet.
            </p>
            <p className="mb-4">
              You may opt out of personalized advertising by visiting{" "}
              <a 
                href="https://www.google.com/settings/ads" 
                className="text-yellow-300 underline hover:text-yellow-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Ads Settings
              </a>.
            </p>
            
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Clash of Clans API</h3>
            <p>
              We connect to Supercell's Clash of Clans API to retrieve clan and war data. 
              This connection is made directly from our servers using your provided API key. 
              Please refer to{" "}
              <a 
                href="https://supercell.com/en/terms-of-service/" 
                className="text-yellow-300 underline hover:text-yellow-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Supercell's Terms of Service
              </a>{" "}
              for their data usage policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-yellow-300 mb-4">Cookies</h2>
            <p className="mb-4">
              This website uses cookies to improve your experience and display relevant advertisements. 
              Cookies are small text files stored on your device that help us:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Remember your preferences</li>
              <li>Analyze site traffic and usage</li>
              <li>Serve personalized advertisements</li>
            </ul>
            <p className="mt-4">
              You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-yellow-300 mb-4">Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Request information about data we collect</li>
              <li>Request deletion of your data</li>
              <li>Opt out of personalized advertising</li>
              <li>Update or correct your information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-yellow-300 mb-4">Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information. 
              However, no method of transmission over the Internet is 100% secure. 
              We cannot guarantee absolute security of your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-yellow-300 mb-4">Children's Privacy</h2>
            <p>
              Our service is not intended for children under 13 years of age. 
              We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-yellow-300 mb-4">Changes to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of 
              any changes by posting the new Privacy Policy on this page and updating the 
              "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-yellow-300 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through 
              our website or by creating an issue on our GitHub repository.
            </p>
          </section>

          <div className="border-t border-slate-600 pt-6 mt-8">
            <p className="text-sm text-slate-400 text-center">
              This privacy policy is compliant with GDPR, CCPA, and Google AdSense requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 