
import React, { useEffect } from 'react';

// This component sets up CORS configuration for the app
const CorsConfig: React.FC = () => {
  useEffect(() => {
    // Setting credentials mode for fetch requests in the app
    window.fetch = new Proxy(window.fetch, {
      apply: function(fetch, that, args) {
        // If the request doesn't already specify credentials, add it
        if (args.length >= 1) {
          if (typeof args[1] === 'undefined') {
            args[1] = { credentials: 'include' };
          } else if (typeof args[1] === 'object' && !args[1].credentials) {
            args[1] = { ...args[1], credentials: 'include' };
          }
        }
        return fetch.apply(that, args);
      }
    });
  }, []);

  return null; // This component doesn't render anything
};

export default CorsConfig;
