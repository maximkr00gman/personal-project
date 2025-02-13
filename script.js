class FoodItem {
  constructor(name, calories, protein, carbs, fats, fiber, sugar,) {
    this.name = name;
    this.calories = calories;
    this.protein = protein;
    this.carbs = carbs
    this.fats = fats;
    this.fiber = fiber
    this.sugar = sugar
  }

  static getMacros() {
    return {
      protein: this.protein,
      carbs: this.carbs,
      fats: this.fats,
      sugar: this.sugar,
      fiber: this.fiber,
    }
  }
}

createFoodItem = (name, calories, protein, carbs, fat, sugar, fiber) => {
  return new FoodItem(name, calories, protein, carbs, fat, sugar, fiber);
}

function calculateMacros(foodItems) {
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;
  let totalSugar = 0;
  let totalFiber = 0;

  foodItems.forEach(item => {
    totalProtein += Number(item.protein);
    totalCarbs += Number(item.carbs);
    totalFats += Number(item.fats);
    totalSugar += Number(item.sugar);
    totalFiber += Number(item.fiber);
  });

  return {
    totalProtein,
    totalCarbs,
    totalFats,
    totalSugar,
    totalFiber,
  }
}

function reset() {
  const calorieValue = document.querySelector('.calorie-progress-value')
  calorieValue.innerText = 0;

  const foodItems = document.querySelectorAll('.food-card');
  foodItems.forEach(item => item.remove());

  document.querySelector('#protein-value').innerText = 0;
  document.querySelector('#carbs-value').innerText = 0;
  document.querySelector('#fat-value').innerText = 0;
  document.querySelector('#sugar-value').innerText = 0;
  document.querySelector('#fiber-value').innerText = 0;

  localStorage.removeItem('foodItems');
  setProgress(0);
}
function removeLeadingZeroes(str) {
  let number = Number(str);
  return number.toString();
}
function validateFoodForm(data) {
  const errors = [];

  if (!data.name || data.name.trim() === "") {
    errors.push("Food name cannot be empty.");
  }
  if (isNaN(data.calories) || data.calories <= 0) {
    errors.push("Calories must be a positive number.");
  }
  if (isNaN(data.protein) || data.protein <= 0) {
    errors.push("Protein must be a positive number.");
  }
  if (isNaN(data.carbs) || data.carbs <= 0) {
    errors.push("Carbs must be a positive number.");
  }
  if (isNaN(data.fats) || data.fats <= 0) {
    errors.push("Fats must be a positive number.");
  }
  if (isNaN(data.sugar) || data.sugar <= 0) {
    errors.push("Sugar must be a positive number.");
  }
  if (isNaN(data.fiber) || data.fiber <= 0) {
    errors.push("Fiber must be a positive number.");
  }
  if (errors.length > 0) {
    alert(errors.join('\n'));
    throw new Error(errors.join('\n'));
  }
}

function loadFoodItems() {
  const storedItems = JSON.parse(localStorage.getItem('foodItems')) || [];
  storedItems.forEach(itemData => {
    const food = createFoodItem(
      itemData.name,
      itemData.calories,
      itemData.protein,
      itemData.carbs,
      itemData.fats,
      itemData.sugar,
      itemData.fiber
    );
    createFoodCard(food);
  });
}

const foodForm = document.getElementById('food-form');

const maxCalories = 2200;


function updateCalories(calories) {
  const calorieValue = document.querySelector('.calorie-progress-value');
  const currentCalories = parseInt(calorieValue.innerText);
  console.log(calorieValue.innerText);
  calorieValue.innerText = currentCalories + parseInt(calories);

  // update circle
  let percent = parseInt(document.querySelector('.calorie-progress-value').innerText);
  percent = percent / maxCalories * 100;
  console.log(percent);
  if (percent > 100) {
    percent = 100;
  }
  setProgress(percent);
}

foodForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let name = document.getElementById('food-name').value
  let calories = document.getElementById('calories').value
  let protein = document.getElementById('protein').value
  let carbs = document.getElementById('carbs').value
  let fats = document.getElementById('fat').value
  let sugar = document.getElementById('sugar').value
  let fiber = document.getElementById('fiber').value

  foodData = {
    name: name,
    calories: removeLeadingZeroes(calories),
    protein: removeLeadingZeroes(protein),
    carbs: removeLeadingZeroes(carbs),
    fats: removeLeadingZeroes(fats),
    sugar: removeLeadingZeroes(sugar),
    fiber: removeLeadingZeroes(fiber),
  }

  console.log(foodData);

  console.log('submitting form');
  validateFoodForm(foodData);

  const food = createFoodItem(foodData.name, foodData.calories, foodData.protein, foodData.carbs, foodData.fats, foodData.sugar, foodData.fiber);
  createFoodCard(food);
  saveFoodItem(food);
  updateCalories(foodData.calories);
  const foodItems = JSON.parse(localStorage.getItem('foodItems'));
  let macros = calculateMacros(foodItems)
  console.log('macros', macros)
  document.querySelector('#protein-value').innerText = macros.totalProtein;
  document.querySelector('#carbs-value').innerText = macros.totalCarbs;
  document.querySelector('#fat-value').innerText = macros.totalFats;
  document.querySelector('#sugar-value').innerText = macros.totalSugar;
  document.querySelector('#fiber-value').innerText = macros.totalFiber;
  console.log(macros);
})

function saveFoodItem(foodItem) {
  let foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
  foodItems.push(foodItem);
  localStorage.setItem('foodItems', JSON.stringify(foodItems));
}

function createFoodCard(FoodItem) {
  const card = document.createElement('div');
  card.className = 'food-card';

  card.innerHTML = `
    <h4 class="card-heading">${FoodItem.name}</h4>
    <p>Calories: ${FoodItem.calories}</p>
    <p>Protein: ${FoodItem.protein}</p>
    <p>Carbs: ${FoodItem.carbs}</p>
    <p>Fats: ${FoodItem.fats}</p>
    <p>Sugar: ${FoodItem.sugar}</p>
    <p>Fiber: ${FoodItem.fiber}</p>
  `;

  const foodContainer = document.getElementById('food-list');
  foodContainer.appendChild(card);
  foodForm.reset();
}

function setProgress(percent) {
  const offset = circumference - percent / 100 * circumference;
  circle.style.strokeDashoffset = offset;
}

var circle = document.querySelector('circle');
var radius = circle.r.baseVal.value;
var circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;

document.getElementById('reset').addEventListener('click', reset);

document.addEventListener('DOMContentLoaded', function () {
  loadFoodItems();
  setProgress(0);
  // circle progress bar
})
