async function performTask() {
    // Your asynchronous code here
    console.log("Task is running...");
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate async work
    console.log("Task completed!");
}

performTask();