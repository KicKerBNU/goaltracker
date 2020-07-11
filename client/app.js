function getGoals() {
  $.get("http://localhost:3000/goals", function (data) {
    viewModel.goals(data);
  });
}

function ViewModel() {
  var that = this;
  that.goals = ko.observableArray();
  that.goalInputName = ko.observable();
  that.goalInputType = ko.observable();
  that.goalInputDeadline = ko.observable();
  that.selectedGoals = ko.observableArray();
  that.isUpdate = ko.observable(false);
  that.updateId = ko.observable();
  that.canEdit = ko.computed(function () {
    return that.selectedGoals().length > 0;
  });

  that.addGoal = function () {
    var name = $("#name").val();
    var type = $("#type").val();
    var deadline = $("#deadline").val();

    that.goals.push({
      name: name,
      type: type,
      deadline: deadline,
    });

    $.ajax({
      url: "http://localhost:3000/goals",
      data: JSON.stringify({
        name: name,
        type: type,
        deadline: deadline,
      }),
      type: "POST",
      contentType: "application/json",
      success: function (data) {
        console.log("Goal Added...");
      },
      error: function (xhr, status, err) {
        console.log(err);
      },
    });
  };

  that.updateGoal = function () {
    var id = that.updateId;
    var name = $("#name").val();
    var type = $("#type").val();
    var deadline = $("#deadline").val();

    that.goals.remove(function (item) {
      return item._id == id;
    });

    that.goals.push({
      name: name,
      type: type,
      deadline: deadline,
    });

    $.ajax({
      url: "http://localhost:3000/goals/" + id,
      data: JSON.stringify({
        name: name,
        type: type,
        deadline: deadline,
      }),
      type: "PUT",
      contentType: "application/json",
      success: function (data) {
        console.log("Goal Updated...");
      },
      error: function (xhr, status, err) {
        console.log(err);
      },
    });
  };

  that.editSelected = function () {
    that.updateId = that.selectedGoals()[0]._id;
    var name = that.selectedGoals()[0].name;
    var type = that.selectedGoals()[0].type;
    var deadline = that.selectedGoals()[0].deadline;

    that.isUpdate(true);
    that.goalInputName(name);
    that.goalInputType(type);
    that.goalInputDeadline(deadline);
  };

  that.deleteSelected = function () {
    $.each(that.selectedGoals(), function (index, value) {
      var id = that.selectedGoals()[index]._id;
      $.ajax({
        url: "http://localhost:3000/goals/" + id,
        type: "DELETE",
        async: true,
        timeout: 30000,
        success: function (data) {
          console.log("Goal Removed...");
        },
        error: function (xhr, status, err) {
          console.log(err);
        },
      });
    });

    that.goals.removeAll(that.selectedGoals());
    that.selectedGoals.removeAll();
  };

  that.types = ko.observableArray([
    "Health & Fitness",
    "Professional",
    "Relationships",
    "Self help",
  ]);
}

var viewModel = new ViewModel();
ko.applyBindings(viewModel);
