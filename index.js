const visitCountText = document.getElementById("visitCount");

let visitCount = localStorage.getItem("visits");

if (visitCount == null)
    visitCount = 0;
else visitCount = Number(visitCount);

visitCount++;
localStorage.setItem("visits", visitCount);

visitCountText.textContent = `Вы посетили эту страницу ${visitCount} раз`;