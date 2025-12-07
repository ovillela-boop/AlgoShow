//Import important elements
const arrayContainer = document.getElementById("array-container");
const algorithmSelect = document.getElementById("algorithm-select");
const arraySizeInput = document.getElementById("array-size");
const arraySizeLabel = document.getElementById("array-size-label");
const speedInput = document.getElementById("speed");
const speedLabel = document.getElementById("speed-label");
const generateBtn = document.getElementById("generate");
const visualizeBtn = document.getElementById("visualize");
const controlPanel = document.getElementById("control-panel");


//Initialize array of numbers that will be sorted
let data = [];

//When the algorithm is running, user cannot manipulate the algorithm
let isSorting = false;


//Manipulate speed with ms (100ms is 0.1 sec)
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//When sliders are dragged, array size and inpuit is manipulated (immediate) 
function updateLabels() {
    //array size
  arraySizeLabel.textContent = arraySizeInput.value;
  //speed of algorithm
  speedLabel.textContent = speedInput.value;
}
//listens and changes immediately
arraySizeInput.addEventListener("input", () => {
  updateLabels();
  generateArray();
});

speedInput.addEventListener("input", updateLabels);

// Generate a new random array when spped or size manipulated
function generateArray() {
  const size = parseInt(arraySizeInput.value, 10);
  data = [];
  for (let i = 0; i < size; i++) {
    // Values between 5 and 100
    data.push(Math.floor(Math.random() * 95) + 5);
  }
  //calls render array to re draw the bars 
  renderArray();
}

// visualy render the array as bars
function renderArray(activeIndices = []) {
  arrayContainer.innerHTML = "";
  const maxVal = Math.max(...data, 100); // avoid divide-by-zero

  data.forEach((value, index) => {
    const bar = document.createElement("div");
bar.classList.add("bar");
if (activeIndices.includes(index)) {
  bar.classList.add("active");
}

const heightPercent = (value / maxVal) * 100;
bar.style.height = `${heightPercent}%`;

// Add the number label
const label = document.createElement("span");
label.classList.add("bar-label");
label.textContent = value;

bar.appendChild(label);
arrayContainer.appendChild(bar);

  });
}

// Disable and enables controls while sorting
function setControlsDisabled(disabled) {
  isSorting = disabled;
  generateBtn.disabled = disabled;
  arraySizeInput.disabled = disabled;
  algorithmSelect.disabled = disabled;
  visualizeBtn.disabled = disabled;
}
function updateQueueDisplay(queue) {
  const queueDisplay = document.getElementById("bfs-queue");
  queueDisplay.textContent = `[ ${queue.join(", ")} ]`;
}


// Bubble Sort visualization
async function bubbleSort() {
  const n = data.length;
  const speed = parseInt(speedInput.value, 10);

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Highlight the pair being compared
      renderArray([j, j + 1]);
      await sleep(speed);

      if (data[j] > data[j + 1]) {
        // Swap values
        [data[j], data[j + 1]] = [data[j + 1], data[j]];
        renderArray([j, j + 1]);
        await sleep(speed);
      }
    }
  }

  // Final render with no highlights
  renderArray();
}

//Binary Search
async function binarySearch() {
  const target = Number(prompt("Enter a value to search for:"));
  if (isNaN(target)) {
    alert("Invalid number.");
    return;
  }

  // Ensure data is sorted before binary search
  data.sort((a, b) => a - b);
  renderArray();

  let left = 0;
  let right = data.length - 1;
  const speed = parseInt(speedInput.value, 10);

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    // Highlight the current mid element
    renderArray([mid]);
    await sleep(speed);

    if (data[mid] === target) {
      // Found -> color it green
      renderArray([mid]);
      arrayContainer.children[mid].style.background = "limegreen";
      return;
    } 
    else if (data[mid] < target) {
      left = mid + 1;  // search right
    } 
    else {
      right = mid - 1; // search left
    }
  }

  alert("Value not found in array.");
}

// dropdown menu picks what algorithm to run
async function runSelectedAlgorithm() {
  const algorithm = algorithmSelect.value;

  if (algorithm === "bubble") {
    await bubbleSort();
  } 
  else if (algorithm === "binary") {
    await binarySearch();
  } 
  else if (algorithm === "bfs") {
    await bfs("A"); // optional: start BFS when clicking the BFS button
  }
}





// Visualize button
visualizeBtn.addEventListener("click", async () => {
  if (isSorting) return;

  setControlsDisabled(true);
  try {
    await runSelectedAlgorithm();
  } finally {
    setControlsDisabled(false);
  }
});

// Generate new array button handler
generateBtn.addEventListener("click", () => {
  if (isSorting) return;
  generateArray();
});

// Initial setup
updateLabels();
generateArray();


// Example graph in adjacency list form
const graph = {
  A: ["B", "C"],
  B: ["D", "E"],
  C: ["F"],
  D: [],
  E: ["F"],
  F: []
};

const graphCanvas = document.getElementById("graphCanvas");
const gctx = graphCanvas.getContext("2d");

// Node positions
const positions = {
  A: { x: 300, y: 60 },
  B: { x: 150, y: 160 },
  C: { x: 450, y: 160 },
  D: { x: 100, y: 280 },
  E: { x: 250, y: 280 },
  F: { x: 420, y: 280 }
};

function drawGraph(highlight = null) {
  gctx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);

  // Draw edges
  gctx.strokeStyle = "#38bdf8";
  gctx.lineWidth = 2;

  for (let node in graph) {
    for (let neighbor of graph[node]) {
      const p1 = positions[node];
      const p2 = positions[neighbor];
      gctx.beginPath();
      gctx.moveTo(p1.x, p1.y);
      gctx.lineTo(p2.x, p2.y);
      gctx.stroke();
    }
  }

  // Draw nodes
  for (let node in positions) {
    const { x, y } = positions[node];

    gctx.beginPath();
    gctx.arc(x, y, 25, 0, Math.PI * 2);

    gctx.fillStyle = node === highlight ? "#f97316" : "#38bdf8";
    gctx.fill();

    gctx.fillStyle = "#020617";
    gctx.font = "16px Arial";
    gctx.textAlign = "center";
    gctx.textBaseline = "middle";
    gctx.fillText(node, x, y);
  }
}
graphCanvas.addEventListener("click", (event) => {
  const rect = graphCanvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  for (let node in positions) {
    const pos = positions[node];
    const dx = mouseX - pos.x;
    const dy = mouseY - pos.y;

    if (Math.sqrt(dx*dx + dy*dy) < 25) {
      bfs(node);  // BFS starts from the clicked node
      return;
    }
  }
});



async function bfs(start = "A") {
  const visited = new Set();
  const queue = [start];

  updateQueueDisplay(queue); // show initial queue

  while (queue.length > 0) {
    const current = queue.shift();

    drawGraph(current);
    await sleep(600);

    visited.add(current);

    for (let neighbor of graph[current]) {
      if (!visited.has(neighbor) && !queue.includes(neighbor)) {
        queue.push(neighbor);
      }
    }

    updateQueueDisplay(queue); // update queue each loop
  }

  updateQueueDisplay([]);  // empty queue at end
  drawGraph(); // remove highlight
}

document.getElementById("runGraphAlgo").addEventListener("click", () => {
  const algo = algorithmSelect.value;
  if (algo === "bfs") bfs("A");
});


algorithmSelect.addEventListener("change", handleAlgorithmSwitch);

function handleAlgorithmSwitch() {
  const algorithm = algorithmSelect.value;

  const barSection = document.getElementById("array-container").parentElement;
  const graphSection = document.getElementById("graph-section");
  const controls = document.getElementById("control-panel");
  const top = document.getElementById("top-controls");

  // Hide both visualizers first
  barSection.style.display = "none";
  graphSection.style.display = "none";

  if (algorithm === "bfs") {
    // hide sliders/buttons but keep dropdown
    controls.style.display = "none";
    top.style.display = "flex";

    // show graph instantly
    graphSection.style.display = "block";
    drawGraph(); // draw graph immediately
  } 
  else {
    // sorting or searching selected
    controls.style.display = "flex";
    top.style.display = "flex";

    barSection.style.display = "block";
    renderArray(); // show bars immediately
  }
}