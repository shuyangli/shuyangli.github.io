---
    title: Hints for Lab 8
    author:
        - Shuyang Li
---


[<< Back](http://shuyang.li/fundcomp/)

# Hints for Lab 8

This lab ([Crossword Anagram](https://www3.nd.edu/courses//cse/cse20211.01/www/lab8/)) is definitely the hardest lab so far. Working in pairs may work well for some of you, but it usually takes as much time as working alone, so definitely plan to spend a lot of time on this lab, **even if you're working in pairs!**

Here are some hints for you to start approaching this lab:

- **Start early!**
- Leverage **functions** in this lab.
    + Functions are your friends, because they can help you *break down this complex task into smaller problems*, so you can tackle them one at a time.
    + If you can make sure that your solution to *each smaller problem* is correct (each of your functions behaves correctly), then your overall program will be correct.
    + For example, I can divide up my task, and my main function may look something like this:

``` c
/*
 * CAUTION
 * This pseudocode will NOT compile
 */
int main(void) {

    // These arrays will hold our board and user input words
    char board[][], words[][], clues[][];
    
    // Initialize
    initialize_board(board);
    prompt_user_for_input(words);
    
    // Prepare to sort words
    sort_words(words);

    for_each(word in words) {
        if (!place_words(board, word, clues)) {
            // For each word, if I can't place it, quit altogether
            break;
        }
    }
    
    // Print out results
    print_solution_board(board);
    print_puzzle_board(board);
    print_clues(clues);

    // Clean up if needed
    // ...

    return 0;
}
```

- Read the *lab descriptions* carefully.
    + The algorithm may seem difficult at first glance, but it's actually relatively straightforward.
    + Key phrase: "place them on the board in a way that intersects with exactly one identical letter already on the board. All letters of a word must be separated from other words by at least one blank space, except where it intersects with another word."
- There are many C stdlib functions that may be helpful.
    + For example, `qsort` sorts an array of items with a comparison function of your choice.
    + If you're using the Linux machines, `strfry` literally stir fries a string into random order.
    + [Ask Google](https://www.google.com/) if you don't know how to use them.
- Again, **start early!**
- *EDIT November 6:* it seems like some of you are comparing the words against previously placed words: that could work, but it's a lot harder than checking the word directly against the board. This would be a lot easier:
``` c
int place_word(char word[], char board[BOARD_SIZE][BOARD_SIZE]) {
    int row, col;

    // Loop through the board and see if we can place the word
    for (row = 0; row < BOARD_SIZE; row++) {
        for (col = 0; col < BOARD_SIZE; col++) {

            if (can_place_word(word, board, row, col)) {
                // If we can place the word on the board
                // starting at this position, then we're good
                return PLACE_SUCCESS;
            }
            
            // Otherwise, we move on to check the next position
        }
    }
    
    // If we can't place the character anywhere, then we've failed
    return PLACE_FAILURE;
}
```

If you want to learn about anything specific, please send me an email to let me know!


<script type="text/javascript" src="http://shuyang.li/js/tracking.js"></script>
