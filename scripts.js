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

    // Load random question
    async function loadRandomQuestion() {
        

        questionBody.innerHTML = ""; // Clear previous
        let selectedCategories = getSelectedCategories();
        if (selectedCategories.length === 0) return alert("Select at least one category");

        let category = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];
        
        // console.log('category is: ' + category);
        
        let maxRange = parseInt(txtRange.value) || 5;

        // console.log('maxRange is: ' + maxRange);

        // console.log('categories: ');
        // console.log(categories);

        let availableQuestions = categories[category].filter(num => num <= maxRange);

        // console.log('availableQuestions: ');
        // console.log(availableQuestions);

        if (availableQuestions.length === 0) return alert("No questions available in this range");

        let randomNumber = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];

        // console.log('randomNumber: ' + randomNumber);

        let questionFile = `./questions/${category}/${randomNumber}.html`;

        // console.log('questionFile: ' + questionFile);

        try {
            const response = await fetch(questionFile);
            
            // console.log('response: ');
            // console.log(response);
            
            const html = await response.text();

            // console.log('html: ');
            // console.log(html);


            questionBody.innerHTML = html;

            // Hide answer initially
            questionBody.querySelectorAll(".answer, .answer-pre").forEach(el => el.style.display = "none");
        } catch (error) {
            console.error("Error loading question", error);
        }
    }

    // Show answer
    btnShow.addEventListener("click", () => {
        questionBody.querySelectorAll(".answer, .answer-pre").forEach(el => el.style.display = "block");
    });

    // Next question
    btnNext.addEventListener("click", loadRandomQuestion);

    // Initial Load
    await loadCategories();
    loadRandomQuestion();
});
