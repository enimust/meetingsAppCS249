/* This code is only run in the client side, because it is 
in the folder "client".
*/
// Global variables to store data in MiniMongo and Session
Meetings = new Mongo.Collection('meetings');
Session.setDefault("addMeetingFlag", false);
Session.setDefault("viewMeetingFlag", false);
Meteor.subscribe('theMeetings');


/* Deal with the two buttons that show up first in the page.*/
Template.body.events({
  "click #addButton": function(){
    Session.set("addMeetingFlag", true);
  },
  /* Switch name of button and show/hide meetings.*/
  "click #viewButton": function(event){
    if (event.target.textContent == "View Meetings"){
      Session.set("viewMeetingFlag", true);
      event.target.textContent = "Hide Meetings";
    }
    else {
      event.target.textContent = "View Meetings";
      Session.set("viewMeetingFlag", false);
    }
  }
})


/* Template helpers that set the values for the variables that control
the HTML page appearance. Because templates are reactive contexts,
whenever the value of flags is changed somewhere in the code, the code
in the template gets rerun, changing the HTML page.
*/
Template.addMeetingForm.helpers({
  
  addMeeting: function(){
    return Session.get("addMeetingFlag");
  }
  
});

Template.viewColumn.helpers({
    
  viewMeeting: function(){
    return Session.get("viewMeetingFlag");
  },
  
  meetingsList: function(){
    return Meetings.find({});
  }
  
});
                      

/* Deal with adding a meeting to the database */
Template.addMeetingForm.events({
  
  "submit form": function(event){

      var meetingObject = {
        name: event.target.meetingName.value,
        location: event.target.meetingLocation.value,
        date: event.target.meetingDate.value,
        startTime: event.target.startTime.value,
        endTime: event.target.endTime.value,
      };

      Meteor.call('insertMeeting', meetingObject);

      Session.set("addMeetingFlag", false); // make the form disappear
      console.log(meetingObject);
      event.target.reset(); // to clear the fields for next time
    
      // show message in the page using jQuery
      $("#successMessage").show().fadeOut(3000);
      return false;
    }
})