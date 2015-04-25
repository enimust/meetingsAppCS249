/* This code is only run on the server side, because it is in the 
"server" folder.
*/

Meetings = new Mongo.Collection('meetings');

/* Helper function used in the publish method to filter undesired items.*/
function checkExpiration(){
  // Iterate through all meetings and check if time has expired
  var allMeetings = Meetings.find({});
  var now = new Date();
  allMeetings.forEach(function(item){
    if (item.endTimeDate < now)
      Meetings.update(item, {$set: {hasExpired: true}});
  })
  // remove expired entries
  Meetings.remove({hasExpired: true})
}


Meteor.publish('theMeetings', function(){
    checkExpiration();
    return Meetings.find({hasExpired: false}, {sort: {startTimeDate: 1}})
});


Meteor.methods({
  insertMeeting: function(meetingObj){
    // create two new fields for startTime and endTime, so that they are
    // Date() objects
    var startTimeObj = new Date(meetingObj.date + " " + meetingObj.startTime);
    var endTimeObj = new Date(meetingObj.date + " " + meetingObj.endTime);
    
    Meetings.insert({
      name: meetingObj.name,
      location: meetingObj.location,
      dateStr: meetingObj.date,
      // Use the moment.js library to format time in US time
      startTimeStr: moment(startTimeObj).format("hh:mm A"),
      endTimeStr: moment(endTimeObj).format("hh:mm A"),
      startTimeDate: startTimeObj,
      endTimeDate: endTimeObj,
      hasExpired: false
    })
    console.log("new meeting added in mongodb");
  }
})
