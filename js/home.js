$(document).ready(function() {
  getSnacks();

  // MAKE PURCHASE BUTTON
  $('#makePurchaseBtn').click(function() {
    $("#changeMsg").val('');
    var itemNum = $('#itemNum').val();
    var money = document.getElementById('balance').value;
    $.ajax({
      type: 'GET',
      url: 'http://localhost:8080/money/' + money + '/' + 'item/' + itemNum,
      success: function() {
        itemCost$ = $('#item' + itemNum + 'Price').text();
        itemCost = Math.round(parseFloat(itemCost$.substring(1,itemCost$.length)) * 100);
        money = Math.round(parseFloat(money) * 100);
        var updatedBalance = ((money - itemCost) / 100).toString();
        $('#balance').val(updatedBalance);
        $('#message').val('Thank You for your Purchase');
        getSnacks();
      },
      error: function(response) {
        var obj = JSON.parse(response.responseText);
        $('#message').val(obj.message);
      }
    });
  });
  // CHANGE RETURN BUTTON
  $('#changeBtn').click(function() {
    var balanceInPennies = Math.round(parseFloat($('#balance').val()) * 100);
    var quarters = Math.floor(balanceInPennies / 25);
    balanceInPennies %= 25;
    var dimes = Math.floor(balanceInPennies / 10);
    balanceInPennies %= 10;
    var nickels = Math.floor(balanceInPennies / 5);
    balanceInPennies %= 5;
    var change = {"quarters":quarters, "dimes":dimes, "nickels":nickels,"pennies":balanceInPennies};
    displayChange(change);
    $('#balance').val('0.00');
    $('#itemNum').val('');
    $('#message').val('');
  });
  // ADD MONEY BUTTONS
  $('#addDollarBtn').click(function() {
    $("#changeMsg").val('');
    var balance = parseFloat(document.getElementById('balance').value) + 1.00;
    document.getElementById('balance').value = balance.toString();
  });
  $('#addQuarterBtn').click(function() {
    $("#changeMsg").val('');
    var balance = parseFloat($('#balance').val()) + .25;
    $('#balance').val(balance.toString());
  });
  $('#addDimeBtn').on('click', function() {
    $("#changeMsg").val('');
    var balance = Math.round(parseFloat(document.getElementById('balance').value) * 100 + 10) / 100;
    document.getElementById('balance').value = balance.toString();
  });
  $('#addNickelBtn').click(function() {
    $("#changeMsg").val('');
    var balance = Math.round(parseFloat($('#balance').val()) * 100 + 5) / 100;
    $('#balance').val(balance.toString());
  });
});
// GET AND DISPLAY SNACKS
function getSnacks() {
  $('#snackColumn').empty();
  $.ajax({
    type: 'GET',
    url: 'http://localhost:8080/items',
    success: function(snacks) {
      var rowNumber = 0;
      for (i = 1; i <= snacks.length; i++) {
        if ((i-1)%3 == 0) {
          rowNumber++;
          $('#snackColumn').append('<div id="row' + rowNumber + '" class="row"></div>');
        }
        var panel = '<div class="col-sm-4"><div class="panel panel-default"><div class="panel-body">';
        panel += '<p class="text-left itemNumber">' + snacks[i - 1].id + '</p>';
        panel += '<p class="text-center">' + snacks[i - 1].name + '</p>';
        panel += '<p class="text-center" id="item' + i + 'Price">$' + snacks[i - 1].price + '</p>';
        panel += '<br><p class="text-center">Inventory: ' + snacks[i - 1].quantity + '</p>';
        panel += '</div></div></div>';
        $('#row' + rowNumber).append(panel);
      }
      // PANEL HOVER EFFECT AND PANEL CLICK TO SELECT SNACK
      $('.panel-body').hover(function() {
        $(this).css("background-color","red");},
        function() {
          $(this).css("background-color","yellow");
        });
        $('.panel-body').click(function() {
          $('#itemNum').val($(this).find('.itemNumber').text());
        });
      },
      error: function() {
        alert('Error: Please try again.');
      }
    });
  }
  // DISPLAY CHANGE
  function displayChange(change) {
    var changeMsg = "" + change.quarters + " Quarters ";
    changeMsg += change.dimes + " Dimes ";
    changeMsg += change.nickels + " Nickels ";
    $('#changeMsg').val(changeMsg);
  }