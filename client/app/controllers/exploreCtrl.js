angular.module('exploreCtrl', [])

.controller('exploreController', function (Users, $location, filterFilter) {

  var vm = this;

  vm.getSkills = function () {

    // using Users factory from factories.js to do GET
    Users.getOtherUsers(vm.user)
      .then(function (data) {
        vm.userArray = data;
        vm.filterSkills(vm.userArray);
      })
      .catch(function (err) {
        console.log(err);
        //redirect to login if unsuccessful
        $location.path('/login');
      });
  };
  // get skills from all users, make one big array and remove
  //duplicates before displaying html
  vm.filterSkills = function (array) {
    var allOffers = _.map(array, function (item) {
      return item.offer;
    });

    allOffers = _.flatten(allOffers);
    // console.log("allOffers: ", allOffers);
    vm.userSkills = _.uniq(allOffers);
    // console.log("vm.userSkills: ", vm.UserSkills);
    //if there are no skills available, display error message
    if (vm.userSkills.length === 0) {
      vm.err = "Sorry, no users are currently looking for your skills.";
    }
  };

  // addition by Jake S.
  vm.getSkillStats = function(){
    console.log("getSkillStats firred");
    //why is vm.user undefined
    console.log("vm.user: ", vm.user);
    // get data from users who aren't the current user
    vm.user = {};
    var userInfo = [];
    Users.getOtherUsers()
      .then(function (data){
        // put all the other users' skills offered in one array
        _.each(data, function(item){
          userInfo.push(_.flatten(item.offer));
        });
        // count the occurences of each skill offered
        var tally = {};
        _.each(_.flatten(userInfo), function(el){
          tally[el] = tally[el] + 1 || 1;
        });
        // group into sorted pairs to order by size
        var pairs = _.pairs(tally);
        var sortedPairs = _.sortBy(pairs, function(pair){
          return pair[1];
        });
        vm.tally = sortedPairs;
        // populate dataset for Chart
        // vm.populateDatasets(vm.tally);
      })
      .catch(function (err){
        console.log(err);
      });
        // console.log("userInfo: ", userInfo);
        console.log("vm.user in Users.getOtherStories: ", vm.user);
        console.log("tally: ", vm.tally);
  };
  // this is a dummy tally until I figure out what broke the real tally :/
  vm.dummyTally = {
    "javascript": 30,
     "parking": 15,
     "WOW": 12,
     "java": 10,
     "weaving": 9,
     "dog walking": 9,
     "ESP": 7,
     "juggling": 5,
     "opera": 3,
     "puppets": 3,
     "zen": 1
  };
  // this options object currently within view.explore.jade because I couldn't seem to get it to work from this file
  // vm.masonryOptions =  {
  //      'itemSelector': '.grid-item',
  //      'percentPosition': true,
  //      'columnWidth':
  //      '.grid-sizer',
  //      'isFitWidth': true
  // };


  //shows list of skills by default, or people with certain skill when clicked
  vm.shouldShow = true;
  vm.toggleView = function () {
    vm.shouldShow = !vm.shouldShow;
  };
  //filters users into array if they have the skill user is looking for
  vm.showUsers = function (skill) {
    vm.toggleView();
    vm.usersWithSkill = filterFilter(vm.userArray, {
      offer: skill
    });
  };


   vm.getSkills();

});

