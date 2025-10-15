document.getElementById("stuform").addEventListener("submit", function(event) {
        event.preventDefault(); // stop page refresh

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        // Gender
        const gender = document.getElementsByName("gender");
        let selectedGender = "No gender selected";
        for (let i = 0; i < gender.length; i++) {
            if (gender[i].checked) {
                selectedGender = gender[i].value;
                break;
            }
        }

        // Course
        const dropdown = document.getElementById("course");
        const selectedCourseText = dropdown.options[dropdown.selectedIndex].text;

        // Hobbies
        const hobbies = document.getElementsByName("hobbies");
        let selectedHobbies = [];
        for (let i = 0; i < hobbies.length; i++) {
            if (hobbies[i].checked) {
                selectedHobbies.push(hobbies[i].value);
            }
        }

        // Save in localStorage
        localStorage.setItem("Name", name);
        localStorage.setItem("Email", email);
        localStorage.setItem("Gender", selectedGender);
        localStorage.setItem("Course", selectedCourseText);
        localStorage.setItem("Hobbies", JSON.stringify(selectedHobbies));

        // Redirect to summary page
        window.location.href = "summary.html";