function predefinedClicked(value) {
    $('#amountForm').val(value);
    $("#amount").text(" $" + value + " ");
    $("#continue").fadeIn();
}

$(document).ready(function(){
    var pkey = $("#publishableKey").text();
    var logoURL = $("#logoImage").text();
    var websiteURL = $("#websiteURL").text();
    $("#logo").attr("src", logoURL);
    $("#footerLink").attr("href", websiteURL);
    
    $("#loading").fadeOut(function(){
        $("#content").fadeIn();
    });

    var handler = StripeCheckout.configure({
        key: pkey,
        image: '/img/8.png',
        locale: 'auto',
        zipCode: true,
        token: function(token) {
            var donationValue = $("#amountForm").val()*100
            $.post( "/charge", { stripeEmail: token.email, stripeToken: token.id, amount: donationValue}, function(data) {
                $("#loading").fadeOut(function(){
                    if(data == "<p>hex success</p>") {
                        $("#paymentProcessed").fadeIn();
                    } else {
                        $("#errorProcessing").fadeIn();
                    }
                });
                setTimeout(function () {
                    $("#errorLoading").fadeIn;
                }, 5000);
            });
        }
      }); 

    document.getElementById('continue').addEventListener('click', function(e) {
        $("#content").fadeOut(function(){
            $("#loading").fadeIn();
        });
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
            $("#continue").fadeOut(function(){
                $("#amount").text(" ");
                $("#continue").fadeIn();
            })
        });
    });

    document.getElementById('errorTryAgain').addEventListener('click', function(e) {
        location.reload();
    })
});