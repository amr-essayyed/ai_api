// Simple test for the quickSort algorithm logic (without UI)
// This test will use a non-animated, synchronous version of quickSort for simplicity

function quickSortSync(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
        let pivotIndex = partitionSync(arr, left, right);
        quickSortSync(arr, left, pivotIndex - 1);
        quickSortSync(arr, pivotIndex + 1, right);
    }
    return arr;
}

function partitionSync(arr, left, right) {
    let pivot = arr[right];
    let i = left;
    for (let j = left; j < right; j++) {
        if (arr[j] < pivot) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            i++;
        }
    }
    [arr[i], arr[right]] = [arr[right], arr[i]];
    return i;
}

// Test cases
function arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
}

function runTests() {
    let tests = [
        { input: [5, 3, 8, 4, 2], expected: [2, 3, 4, 5, 8] },
        { input: [1], expected: [1] },
        { input: [], expected: [] },
        { input: [9, 7, 5, 3, 1], expected: [1, 3, 5, 7, 9] },
        { input: [2, 2, 2, 2], expected: [2, 2, 2, 2] },
        { input: [10, -1, 2, 5, 0], expected: [-1, 0, 2, 5, 10] },
    ];
    let passed = 0;
    tests.forEach(({ input, expected }, idx) => {
        let arr = [...input];
        let result = quickSortSync(arr);
        if (arraysEqual(result, expected)) {
            console.log(`Test ${idx + 1} passed.`);
            passed++;
        } else {
            console.error(`Test ${idx + 1} failed. Got [${result}], expected [${expected}]`);
        }
    });
    console.log(`${passed} / ${tests.length} tests passed.`);
}

runTests();
