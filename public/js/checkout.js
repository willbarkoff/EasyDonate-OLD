function predefinedClicked(value) {
    $('#amountForm').val(value);
    $("#amount").text(" $" + value + " ");
    $("#continue").fadeIn();
}

$(document).ready(function(){
    var pkey = $("#publishableKey").text();
    var logoURL = $("#logoImage").text();
    var websiteURL = $("#websiteURL").text();
    var name = $("#name").text();
    $("#logo").attr("src", logoURL);
    $("#footerLink").attr("href", websiteURL);
    
    $("#loading").fadeOut(function(){
        $("#content").fadeIn();
    });

    var handler = StripeCheckout.configure({
        key: pkey,
        image: logoURL,
        locale: 'auto',
        zipCode: true,
        token: function(token) {
            var donorName =  $('#donorName').val();
            if(donorName == "") {
                donorName = "Anonymous"
            }
            var donationValue = $("#amountForm").val()*100
            $("#content").fadeOut(function(){
                $("#loading").fadeIn();
            });
            $.post( "/charge", { stripeEmail: token.email, stripeToken: token.id, amount: donationValue, name: donorName}, function(data) {
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
        // Open Checkout with further options:
        var amount = $("#amountForm").val()*100
        if(amount < 1) {   
            $("#errorContent").text("The donation amount must be at least 1 cent.")
            $("#error").fadeIn(); 
            e.preventDefault();
        } else if((!$('#anonymous').is(":checked")) && ($('#donorName').val() == "")) {
            $("#errorContent").text("You must type a name.")
            $("#error").fadeIn();
        } else {
            handler.open({
                name: name,
                description: 'Donation',
                amount: amount
            });
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

    document.getElementById('acknowledgementsLink').addEventListener('click', function(e) {
        $("#footer").fadeOut()
        $("#content").fadeOut(function(){
            $("#acknowledgements").fadeIn();
        })
    })

    $('#inHonor').on('input', function() { 
        if ($('#inHonor').is(":checked")){
            $('#donorName').val("");
            $('#donorName').attr("placeholder", "Type the honoree's name");
            $('#anonymousWrapper').fadeOut();
        } else {
            $('#donorName').val("")
            $('#donorName').attr("placeholder", "Type your name");
            $('#anonymousWrapper').fadeIn();
        }
    });
    $('#anonymous').on('input', function() { 
        if ($('#anonymous').is(":checked")){
            $('#donorName').fadeOut(function(){
                $('#donorName').val("");
            }); 
            $('#inHonorWrapper').fadeOut();
        } else {
            $('#donorName').fadeIn();
            $('#inHonorWrapper').fadeIn();
        }
    });
});