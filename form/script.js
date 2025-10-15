const form = document.getElementById("stuform");

// Validation functions
function validateName() {
    const name = document.getElementById("name");
    const regex = /^[A-Za-z\s]{2,}$/;
    if(!regex.test(name.value)){
        showError(name, "name-error"); return false;
    }
    showSuccess(name, "name-success"); return true;
}

function validateEmail() {
    const email = document.getElementById("email");
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|edu|in)$/;
    if(!regex.test(email.value)){
        showError(email, "email-error"); return false;
    }
    showSuccess(email, "email-success"); return true;
}

function validatePassword() {
    const pass = document.getElementById("pass");
    const regex = /^(?=.*[0-9]).{6,}$/;
    if(!regex.test(pass.value)){
        showError(pass, "pass-error"); return false;
    }
    showSuccess(pass, "pass-success"); return true;
}

function validateMobile() {
    const mob = document.getElementById("mobno");
    const regex = /^[0-9]{10}$/;
    if(!regex.test(mob.value)){
        showError(mob, "mob-error"); return false;
    }
    showSuccess(mob, "mob-success"); return true;
}

function validateDOB() {
    const dob = document.getElementById("dob");
    if(dob.value === ""){
        showError(dob, "dob-error"); return false;
    }
    showSuccess(dob, "dob-success"); return true;
}

function validateRating() {
    const rates = document.getElementsByName("rate");
    for(let r of rates){
        if(r.checked){ 
            document.getElementById("rate-success").style.display = "inline";
            document.getElementById("rate-error").style.display = "none"; 
            return true;
        }
    }
    document.getElementById("rate-error").style.display = "inline";
    document.getElementById("rate-success").style.display = "none";
    return false;
}

function validateInterests() {
    const interests = document.getElementsByName("interest");
    for(let i of interests){
        if(i.checked){
            document.getElementById("interest-success").style.display = "inline";
            document.getElementById("interest-error").style.display = "none";
            return true;
        }
    }
    document.getElementById("interest-error").style.display = "inline";
    document.getElementById("interest-success").style.display = "none";
    return false;
}

// Show error / success
function showError(input, errorId){
    input.classList.add("error"); input.classList.remove("success");
    document.getElementById(errorId).style.display = "inline";
}
function showSuccess(input, successId){
    input.classList.add("success"); input.classList.remove("error");
    document.getElementById(successId).style.display = "inline";
}

// Event listeners for onblur
document.getElementById("name").onblur = validateName;
document.getElementById("email").onblur = validateEmail;
document.getElementById("pass").onblur = validatePassword;
document.getElementById("mobno").onblur = validateMobile;
document.getElementById("dob").onblur = validateDOB;

// Submit handler
form.addEventListener("submit", function(event){
    event.preventDefault();
    const valid = validateName() && validateEmail() && validatePassword() && validateMobile() &&
                  validateDOB() && validateRating() && validateInterests();
    if(!valid) return;

    // Collect values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("pass").value;
    const mobile = document.getElementById("mobno").value;
    const dob = document.getElementById("dob").value;
    let rating = "No rating";
    document.getElementsByName("rate").forEach(r => { if(r.checked) rating = r.value; });
    let interests = [];
    document.getElementsByName("interest").forEach(i => { if(i.checked) interests.push(i.value); });

    // Save to localStorage
    localStorage.setItem("Name", name);
    localStorage.setItem("Email", email);
    localStorage.setItem("Password", password);
    localStorage.setItem("Mobile", mobile);
    localStorage.setItem("DOB", dob);
    localStorage.setItem("Rating", rating);
    localStorage.setItem("Interests", JSON.stringify(interests));

    window.location.href = "success.html";
});

// Display button
document.getElementById("display-btn").onclick = function(){
    let msg = `Name: ${document.getElementById("name").value}\n`;
    msg += `Email: ${document.getElementById("email").value}\n`;
    msg += `Password: ${document.getElementById("pass").value}\n`;
    msg += `Mobile: ${document.getElementById("mobno").value}\n`;
    msg += `DOB: ${document.getElementById("dob").value}\n`;
    let rating = "None";
    document.getElementsByName("rate").forEach(r => { if(r.checked) rating = r.value; });
    msg += `Rating: ${rating}\n`;
    let interests = [];
    document.getElementsByName("interest").forEach(i => { if(i.checked) interests.push(i.value); });
    msg += `Interests: ${interests.join(", ")}`;
    alert(msg);
}
