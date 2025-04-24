document.addEventListener('DOMContentLoaded', () => {
    const ingredientInput = document.getElementById('ingredient-input');
    const addButton = document.getElementById('add-button');
    const submitButton = document.getElementById('submit-button');
    const ingredientList = document.getElementById('ingredient-list');
    const recommendationsDiv = document.getElementById('recommendations');

    let ingredients = [];

    // addButton.addEventListener('click', () => {
    //     const ingredient = ingredientInput.value.trim();
    //     if (ingredient && !ingredients.includes(ingredient)) {
    //         ingredients.push(ingredient);
    //         const listItem = document.createElement('li');
    //         listItem.textContent = ingredient;
    //         ingredientList.appendChild(listItem);
    //         ingredientInput.value = '';
    //     }
    // });
    function addIngredient() {
        const ingredient = ingredientInput.value.trim();
        if (ingredient && !ingredients.includes(ingredient)) {
            ingredients.push(ingredient);
            const listItem = document.createElement('li');
            listItem.textContent = ingredient;
            ingredientList.appendChild(listItem);
            ingredientInput.value = '';
        }
    }
    
    addButton.addEventListener('click', addIngredient);
    
    ingredientInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // prevents form submit or page reload
            addIngredient();
        }
    });
    

    submitButton.addEventListener('click', () => {
        if (ingredients.length === 0) {
            alert('Please add at least one ingredient.');
            return;
        }

        fetch('/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ingredients })
        })
        .then(response => response.json())
        .then(data => {
            recommendationsDiv.innerHTML = '';
            if (data.recommendations && data.recommendations.length > 0) {
                data.recommendations.forEach(recipe => {
                    const recipeDiv = document.createElement('div');
                    recipeDiv.innerHTML = `
                        <h3>${recipe.name}</h3>
                        <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                        <p><strong>Steps:</strong> ${recipe.steps}</p>
                        <img src="/static/${recipe.image_url}" alt="${recipe.name}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 10px;">

                    `;
                    recommendationsDiv.appendChild(recipeDiv);
                });
            } else {
                recommendationsDiv.innerHTML = "<p>No recipes found.</p>";
            }
        });
    });
});
