import axios from 'axios';

export default class GoogleAnalyticsRepository {

    sendEvent() {
    
      const payload = {
        "client_id" : "botnei",
        "events" : [
            {
                "name" : "screen_view",
                "params": {
                  "debug_mode": true
                }
            }
        ]
      };
    
      axios.post(`https://www.google-analytics.com/mp/collect?measurement_id=G-TS7T9FNCS3&api_secret=nVJOa26hQiW72P7CWB65Ag`, JSON.stringify(payload), {
        headers : {
            "Content-Type" : "application/json"
        }
      })
        .then(response => {
          console.log('Event tracked:', response.statusText);
        })
        .catch(error => {
          console.error('Error tracking event:', error);
        });
    }
}