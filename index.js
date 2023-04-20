const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const GoogleStrategy = require('passport-google-oauth20').Strategy;




mongoose.connect("mongodb+srv://lonely1:24810@cluster0.wk0dk.mongodb.net/Transpo", function (err) {

    if (err) {
        console.log(err);
    } else {

        console.log("Connected to Mongo");

    }


});

const TranspoSchemaDealer = ({
    DealerName: String,
    DealerEmail: String,
    DealerPassword: String

});


const TranspoSchemaDriver = ({
    driverName: String,
    driverEmail: String,
    driverPassword: String

});

const DealerOrderSchema = ({

    DealerName: String,
    DealerEmail: String,
    CompanyName: String,
    Cargo: String,
    Weight: String,
    Distance: String,
    Time: Number,
    Money: Number,
    Pickup: String,
    Destination: String,
    DealerId: String


});

const SelectedOrders = ({

    DriverName: String,
    DealerEmail: String,
    DriverEmail: String,
    OrderID: String
    

});

const DealerRegistrations = mongoose.model("DealerRegistration", TranspoSchemaDealer);
const DriverRegistrations = mongoose.model("DriverRegistration", TranspoSchemaDriver);
const DealerOrders = mongoose.model("DealerOrder", DealerOrderSchema);
const NewOrders = mongoose.model("NewOrder", SelectedOrders);
const Name1 = "ishan";
var ActiveId;
var ActiveId1;
var emails = [];



const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", (req, res) => {


    res.render('home', {});

    console.log(emails);


});

app.get("/DealerSignup", (req, res) => {

    res.render('signUpDealer', {});

});

app.get("/DriverSignup", (req, res) => {

    res.render('signUpDriver', {});

});


app.get("/DealerLogin", (req, res) => {

    res.render("loginDealer", {});

});

app.get("/DriverLogin", (req, res) => {

    res.render("loginDriver", {});

});

app.get("/DealerOrder", async (req, res) => {

    var DealerName = await DealerRegistrations.findOne({ _id: ActiveId1 });

    res.render("DealerOrder", {
        Name: DealerName.DealerName
    });

});

app.get("/DriverOrder", async (req, res) => {

    var entryCount = await DriverRegistrations.countDocuments({}).exec();

    var driverName1 = await DriverRegistrations.findOne({ _id: ActiveId });


    DealerOrders.find({}, function (err, deals) {

        res.render("DriverOrder", {

            Name: driverName1.driverName,
            Orders: deals


        });
    })

});

// app.get("/Driverconfirmed", async function (req, res) {


//     var driver = await DriverRegistrations.findOne({_id : ActiveId});

    

  

//     res.render('Driverconfirmed',{
//         Name: driver.driverName,
//         corder : selectedOrder
//     })
    

   
// });

app.get("/DealerConfirmedOrder", async (req, res) => {

   var dealer = await DealerRegistrations.findOne({_id : ActiveId1});

   var orders = await NewOrders.find();

   

   




});





app.get("/orders/:orderID", async (req, res) => {

    var requestId = req.params.orderID;


    var driverName1 = await DriverRegistrations.findOne({ _id: ActiveId });

    DealerOrders.findOne({ _id: requestId }, function (err, order) {
        res.render("Order", {
            Name: driverName1.driverName,
            Dealer: order.DealerName,
            Company: order.CompanyName,
            Cargo: order.Cargo,
            Weight: order.Weight,
            Distance: order.Distance,
            Time: order.Time,
            Money: order.Money,
            From: order.Pickup,
            To: order.Destination,
            id: requestId

        });
    });

});


app.get("/orders1/:OrderID", async (req, res) => {

    var requestId = req.params.OrderID;




    var driverName1 = await DriverRegistrations.findOne({ _id: ActiveId });


    var dealer = await DealerOrders.findOne({_id: requestId});

    
    
    

            var NewDriverOrder = new NewOrders({

            DriverName : driverName1.driverName,
            DealerEmail : dealer.DealerEmail,
            DriverEmail : driverName1.driverEmail,
            OrderID: requestId
           
        });

        

         NewDriverOrder.save();

        emails.push(dealer.DealerEmail);
    
 

       
        res.redirect('/DriverOrder');

        


    });


// app.post("/orders:OrderID", async function(req, res){

//     var requestId = req.params.OrderID;

//     var driverName1 = await  DriverRegistrations.findOne({ _id: ActiveId });

//     DealerOrders.findOne({_id: requestId},(err)=>{

//         var NewDriverOrder = new NewOrders({
//             DriverName : driverName1.driverName,
//             DriverEmail : driverName1.driverEmail 
//         });

//         NewDriverOrder.save();
//         res.redirect('/DriverOrder');
//     });



// })

app.post("/DealerSignup", (req, res) => {

    var Email = req.body.DealerEmail;
    var Password = req.body.DealerPassword;
    var PasswordConfirmation = req.body.DealerConfirmPassword;
    var Name = req.body.DealerName;

    if (Password == PasswordConfirmation) {


        var NewDealerRegistration = new DealerRegistrations({

            DealerName: Name,
            DealerEmail: Email,
            DealerPassword: Password
        });

        NewDealerRegistration.save();

        res.redirect('/DealerLogin');

    } else {


        res.redirect("/DealerSignup");

    }

});

app.post('/DealerLogin', async function (req, res) {

    var Dealeremail = req.body.Demail;
    var Dealerpassword = req.body.Dpassword;

    const Dlloggedin = await DealerRegistrations.findOne({ DealerEmail: Dealeremail });

    if (Dlloggedin.DealerPassword === Dealerpassword) {
        ActiveId1 = Dlloggedin._id;
        res.redirect('/DealerOrder');
    } else {
        res.redirect('/DealerLogin');
    }


});


app.post("/DriverSignup", (req, res) => {

    var Email = req.body.Email;
    var Password = req.body.Password;
    var PasswordConfirmation = req.body.ConfirmPassword;
    var Name = req.body.Name;

    if (Password == PasswordConfirmation) {


        var NewDriverRegistration = new DriverRegistrations({

            driverName: Name,
            driverEmail: Email,
            driverPassword: Password
        });

        NewDriverRegistration.save();

        res.redirect('/DriverLogin');

    } else {


        res.redirect("/DriverSignup");

    }

});


app.post('/DriverLogin', async function (req, res) {

    var Driveremail = req.body.Demail;
    var Driverpassword = req.body.Dpassword;

    const Drloggedin = await DriverRegistrations.findOne({ driverEmail: Driveremail });

    if (Drloggedin.driverPassword === Driverpassword) {
        ActiveId = Drloggedin._id;
        res.redirect('/DriverOrder');
    } else {
        res.redirect('/DriverLogin');
    };


});

app.post('/DealerOrder', async function (req, res) {

    var dealer = await DealerRegistrations.findOne({ _id: ActiveId1 });

    var DealerName = req.body.Dealer;
    var CompanyName = req.body.Company;
    var Cargo = req.body.Cargo;
    var Weight = req.body.Weight;
    var Distance = req.body.Distance;
    var Time = req.body.Time;
    var Money = req.body.Money;
    var Pickup = req.body.Pickup;
    var Destination = req.body.Drop;
    var email = req.body.Email;
    


    var newDealerOrder = new DealerOrders({

        DealerName: DealerName,
        DealerEmail : email,
        CompanyName: CompanyName,
        Cargo: Cargo,
        Weight: Weight,
        Distance: Distance,
        Time: Time,
        Money: Money,
        Pickup: Pickup,
        Destination: Destination,
        DealerId: dealer._id

    }, function (err) {
        if (err) {
            console.log(err);
            res.redirect('/DealerOrder')
        } else {
            console.log("Order Created Successfully!");
            res.redirect("/");
        }
    });

    newDealerOrder.save();

    res.redirect('/');



})

app.listen(3005, function () {

    console.log("listening on port 3005...");

})









