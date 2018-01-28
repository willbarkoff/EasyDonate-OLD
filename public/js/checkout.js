function predefinedClicked(value) {
    $('#amountForm').val(value);
}

$(document).ready(function(){
    $("#loading").fadeOut(function(){
        $("#content").fadeIn();
    });

    var pkey = $("#publishableKey").text();

    var handler = StripeCheckout.configure({
        key: pkey,
        image: '/img/8.png',
        locale: 'auto',
        token: function(token) {
          // You can access the token ID with `token.id`.
          // Get the token ID to your server-side code for use.
        }
      });    

    document.getElementById('continue').addEventListener('click', function(e) {
        // Open Checkout with further options:
        var amount = $("#amountForm").val()*100
        if(amount >= 1) {    
            handler.open({
                name: 'Whiskey Bravo',
                description: 'Donation',
                amount: amount
            });
            e.preventDefault();
        } else {
            $("#error").fadeIn();
        }
    });

    document.getElementById('otherAmount').addEventListener('click', function(e) {
        $("#predefinedButtons").fadeOut(function(){
            $("#amountSelect").fadeIn(function(){
                document.getElementById("amountSelect").focus();
            });
        });
    });
});