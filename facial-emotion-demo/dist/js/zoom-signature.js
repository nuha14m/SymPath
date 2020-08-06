  const meetConfig2s = {
      apiKey: '3239845720934223459'
      meetingNumber: '123456789',
      leaveUrl: 'https://yoursite.com/meetingEnd',
      userName: 'Firstname Lastname',
      userEmail: 'firstname.lastname@yoursite.com', // required for webinar
      passWord: 'password', // if required
      role: 0 // 1 for host; 0 for attendee or webinar
  };

  const meetConfig = {
      meetingNumber: '123456789',
      role: 1 // 1 for host; 0 for attendee or webinar
  };




  import { ZoomMtg } from '@zoomus/websdk'

  ZoomMtg.preLoadWasm();
  ZoomMtg.prepareJssdk();

  getSignature(meetConfig) {
      fetch(`${https://cryptic-tor-62436.herokuapp.com}`, {
              method: 'POST',
              body: JSON.stringify({ meetingData: meetConfig })
          })
          .then(result => result.text())
          .then(response => {
              ZoomMtg.init({
                  leaveUrl: "https://google.com",
                  isSupportAV: true,
                  success: function() {
                      ZoomMtg.join({
                          signature: response,
                          apiKey: meetConfig.apiKey,
                          meetingNumber: meetConfig.meetingNumber,
                          userName: meetConfig.userName,
                          // Email required for Webinars
                          userEmail: meetConfig.userEmail,
                          // password optional; set by Host
                          passWord: meetConfig.passWord
                          error(res) {
                              console.log(res)
                          }
                      })
                  }
              })
      }
  }
