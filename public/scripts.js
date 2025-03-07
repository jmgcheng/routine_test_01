document.addEventListener("DOMContentLoaded", async function () {
    let categories = {};
    const categoryDiv = document.getElementById("opt_categories");
    const questionBody = document.getElementById("q_card_body");
    const btnNext = document.getElementById("btn_next_question");
    const btnShow = document.getElementById("btn_show_answer");
    const txtRange = document.getElementById("txt_range");

    // Load JSON data
    async function loadCategories() {
        try {
            const response = await fetch("./questions.json");
            categories = await response.json();
            populateCategories();
        } catch (error) {
            console.error("Error loading questions.json", error);
        }
    }

    // Populate categories dynamically
    function populateCategories() {
        categoryDiv.innerHTML = ""; // Clear previous
        Object.keys(categories).forEach((cat, index) => {
            const id = `opt_cat_${index}`;
            categoryDiv.innerHTML += `
                <input type="checkbox" class="btn-check category-checkbox" id="${id}" data-category="${cat}" checked>
                <label class="btn btn-outline-primary" for="${id}">${cat}</label>
            `;
        });

    }

    // Get selected categories
    function getSelectedCategories() {
        return Array.from(document.querySelectorAll(".category-checkbox:checked"))
            .map(cb => cb.dataset.category);
    }

    function getRange() {
        let rangeValue = txtRange.value.trim(); // Get input and remove spaces
        let minRange = 1, maxRange = 100; // Default range
    
        // console.log('rangeValue: ' + rangeValue);

        if (rangeValue.includes("-")) {
            // console.log('hermit1');
            // If it's a range like "50-70"
            let parts = rangeValue.split("-").map(num => parseInt(num.trim()));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                minRange = Math.min(parts[0], parts[1]);
                maxRange = Math.max(parts[0], parts[1]);
            }
        } else {
            // console.log('hermit2');
            // If it's a single number (e.g., "100")
            let singleNum = parseInt(rangeValue);
            if (!isNaN(singleNum)) {
                minRange = 1;
                maxRange = singleNum;
            }
        }
    
        return { minRange, maxRange };
    }

    // Load random question
    async function loadRandomQuestion() {
        questionBody.innerHTML = ""; // Clear previous
        btnShow.innerHTML = "Show Answer";
        let selectedCategories = getSelectedCategories();
        if (selectedCategories.length === 0) return alert("Select at least one category");

        let { minRange, maxRange } = getRange(); // Get range from input

        // console.log('minRange, maxRange is ' + minRange, maxRange);

        let category = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];        
        let availableQuestions = categories[category].filter(num => num >= minRange && num <= maxRange);
        if (availableQuestions.length === 0) return alert("No questions in " +category+ " available on range from " + minRange +" to "+ maxRange + ". Check json file if unsure");

        let randomNumber = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
        let questionFile = `./questions/${category}/${randomNumber}.html`;

        try {
            const response = await fetch(questionFile);            
            const html = await response.text();
            questionBody.innerHTML = html;

            // Hide answer initially
            questionBody.querySelectorAll(".answer, .answer-pre").forEach(el => el.style.display = "none");
        } catch (error) {
            console.error("Error loading question", error);
        }
    }

    // Show answer
    btnShow.addEventListener("click", () => {
        questionBody.querySelectorAll(".answer, .answer-pre").forEach(el => {
            // el.style.display = "block"
            if (el.style.display === "none") {
                el.style.display = "block";
                btnShow.innerHTML = "Hide Answer";     
            } else {
                el.style.display = "none";
                btnShow.innerHTML = "Show Answer";
            }            

        });
    });

    // Next question
    btnNext.addEventListener("click", loadRandomQuestion);

    // Initial Load
    await loadCategories();
    loadRandomQuestion();
});

function handleFocusOut(e) {
    if (e.key == "Tab") {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        this.value =
        this.value.substring(0, start) + "\t" + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 1;
    }
}