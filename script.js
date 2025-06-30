let quote = document.querySelector("#quoteDisplay");
let btn = document.querySelector("#newQuote");
let category = document.querySelector(".category");

const quotes = [
  {
    text: `"Be the best you can be when there is strentgh to be"`,
    category: `life`,
  },
  {
    text: `"Go for the goal and win the game"`,
    category: `Footbal`,
  },
  {
    text: `"Make hay when the sun shines"`,
    category: `Micheal bane`,
  },
  {
    text: `“I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best.”`,
    category: `life`,
  },
  {
    text: `“Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.”`,
    category: `Human Nature`,
  },
  {
    text: `“Be who you are and say what you feel, because those who mind don't matter, and those who matter don't mind.”`,
    category: `Confidence`,
  },
  {
    text: `“You've gotta dance like there's nobody watching,
            Love like you'll never be hurt,
            Sing like there's nobody listening,
            And live like it's heaven on earth.”`,
    category: `Life`,
  },
];

btn.addEventListener("click", function () {
  let showRandomQuote = Math.floor(Math.random() * quotes.length);
  quote.innerText = quotes[showRandomQuote].text;
  category.innerText = quotes[showRandomQuote].category;
});
