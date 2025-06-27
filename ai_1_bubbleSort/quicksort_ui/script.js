// Get references to DOM elements
const arrayContainer = document.getElementById('arrayContainer');
const startBtn = document.getElementById('startBtn');
const numberInput = document.getElementById('numberInput');

// Utility function to pause execution for animation
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Render the array as bars, highlighting active, pivot, and sorted indices
function renderArray(arr, activeIndices = [], pivotIndex = null, sortedIndices = []) {
    arrayContainer.innerHTML = '';
    const max = Math.max(...arr, 1); // For scaling bar heights
    arr.forEach((num, idx) => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${(num / max) * 220 + 30}px`;
        bar.textContent = num;
        // Highlight sorted, pivot, or active bars
        if (sortedIndices.includes(idx)) {
            bar.classList.add('sorted');
        } else if (pivotIndex === idx) {
            bar.classList.add('pivot');
        } else if (activeIndices.includes(idx)) {
            bar.classList.add('active');
        }
        arrayContainer.appendChild(bar);
    });
}

// Asynchronous quicksort with animation
async function quickSort(arr, left, right, sortedIndices = []) {
    if (left < right) {
        // Partition the array and get the pivot index
        let pivotIndex = await partition(arr, left, right, sortedIndices);
        sortedIndices.push(pivotIndex); // Mark pivot as sorted
        // Recursively sort left and right partitions
        await quickSort(arr, left, pivotIndex - 1, sortedIndices);
        await quickSort(arr, pivotIndex + 1, right, sortedIndices);
    } else if (left === right) {
        // Single element is sorted
        sortedIndices.push(left);
        renderArray(arr, [], null, sortedIndices);
        await sleep(300);
    }
}

// Partition function for quicksort, with animation
async function partition(arr, left, right, sortedIndices) {
    let pivot = arr[right];
    let i = left;
    renderArray(arr, [], right, sortedIndices); // Highlight pivot
    await sleep(500);
    for (let j = left; j < right; j++) {
        renderArray(arr, [j, i], right, sortedIndices); // Highlight current and swap indices
        await sleep(500);
        if (arr[j] < pivot) {
            // Swap if element is less than pivot
            [arr[i], arr[j]] = [arr[j], arr[i]];
            renderArray(arr, [j, i], right, sortedIndices);
            await sleep(500);
            i++;
        }
    }
    // Place pivot in correct position
    [arr[i], arr[right]] = [arr[right], arr[i]];
    renderArray(arr, [i], i, sortedIndices); // Highlight new pivot position
    await sleep(500);
    return i;
}

// Handle start button click
startBtn.addEventListener('click', async () => {
    let input = numberInput.value.trim();
    if (!input) return;
    // Parse input into array of numbers
    let arr = input.split(',').map(x => parseInt(x)).filter(x => !isNaN(x));
    if (arr.length === 0) return;
    renderArray(arr);
    startBtn.disabled = true;
    numberInput.disabled = true;
    // Start quicksort animation
    await quickSort(arr, 0, arr.length - 1);
    // Mark all as sorted at the end
    renderArray(arr, [], null, arr.map((_, i) => i));
    startBtn.disabled = false;
    numberInput.disabled = false;
});
