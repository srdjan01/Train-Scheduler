/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new train- then update the html + update the database
// 3. Create a way to retrieve train from the train database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBJwxy1wTXDAAAgCIIoUgmgPPSK2_Imob4",
    authDomain: "scheduler-3fe1b.firebaseapp.com",
    databaseURL: "https://scheduler-3fe1b.firebaseio.com",
    projectId: "scheduler-3fe1b",
    storageBucket: "",
    messagingSenderId: "93949277597"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding train
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-name-input").val().trim();
  var trainTime = $("#time-input").val().trim();
  var trainFrequency = $("#frequency-input").val().trim();
  

  // Creates local "temporary" object for holding train data
  var newTrain = {

    name: trainName,
    destination: trainDestination,
    time: trainTime,
    frequency: trainFrequency,
   
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.time);
  console.log(newTrain.frequency);
  

  // Alert
  alert("Train Successfully Added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-name-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");
  
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().time;
  var trainFrequency = childSnapshot.val().frequency;


  

  //find when the next train is and minutes until next train

  // Frequency of train
  var tFrequency = trainFrequency;

  // Time the first train arrives
  var firstTime = trainTime;

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


  // Train Info
  // console.log(trainTime);
  // console.log(trainDestination);
  // console.log(trainTime);
  // console.log(trainFrequency);
  

// Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination+ "</td><td>" +
  trainFrequency  + "</td><td>" + trainTime + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});

// Now we will create code in moment.js to confirm that any attempt we use mets this test case
