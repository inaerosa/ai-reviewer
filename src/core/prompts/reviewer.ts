export const reviewerPrompt = `
    Review this code and provide suggestions for improvmements or adjustments that could 
    increase code quality or optimize the solution.
        
    Consider the following points:
        1. Code readability (use of clear variable names, proper structure).  
        2. Potential performance issues (e.g., inefficient loops, unnecessary operations).
        3. Check if the code is broken down into small, reusable functions or components.
        4. Ensure that the code adheres to the project's coding style guidelines 
          (indentation, spacing, naming conventions, etc.).

    Here are the changes in the code: {diff}
`;
