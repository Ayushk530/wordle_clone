from tkinter import *       
from tkinter import ttk
import csv              #needed for the geometry of boxes
import wordle_automation

complete_attempt_word = ""
hints = []
counter = 0
attempt_words = []

#new comment
def window_switcher(): 
    """
    Switches start to the main game window and picks a random word for the specified
    difficulty and no of letters
    """
    global row, attempt_word, wordle_word, complete_attempt_words, complete_attempt_word, difficulty
    attempt_word = ""
    complete_attempt_words = []
    complete_attempt_word = ""
    row = [1]
    wordle_word = wordle_automation.pick_word(wordle_automation.open_word_file(no_of_words.get(), difficulty.get()))
    print(wordle_word)
    window.destroy()
    _game_window()

def attempt_cleaner():
    """
    Generates the word entered by the user in the input boxes, proceeds only if all the inputs are alphabets
    and not special symbols or numbers
    Stores all the attempts
    """
    global attempt_word, entries, attempt_words, complete_attempt_words, complete_attempt_word
    complete_attempt_word = ""
    for entry in entries:
        if len(entry.get()) != 0:
            if entry.get().isalpha():
                complete_attempt_word += entry.get().lower()
                attempt_word = complete_attempt_word[-(no_of_words.get()):]
                attempt_words = list(attempt_word)
            else:
                complete_attempt_word = ""
                attempt_word = ""
                attempt_words = None
                return 
    complete_attempt_words.append(attempt_words)
    print(complete_attempt_words)
    print(attempt_words)
    
def attempt_verify():
    """
    Verifies if the attempted word by the user is correct and gets the flag for each letter in the
    word attempted by the user in form of a list
    """
    global attempt_word, hints, entries
    attempt_cleaner()
    
    if len(attempt_word)>0 and len(attempt_word) == no_of_words.get():
        hint = wordle_automation.hints(attempt_word, wordle_word)
        hints.append(hint)
        
        entry_disable(row)
    else:
        pass
          
def entry_disable(row):
    """
    Disables the rows by coulouring them based on the flag for each letter
    0 - grey, The letter doesn't exist in the word
    -1 - yellow, The letter is present at the wrong position in the word
    1 - green, The letter is presebt at the correct postion in the word
    
    sets the label text for the game over window 
    updates the no of games won in the games_won.txt if the attempted word by the user mathces with the word to be guessed
    """
    global complete_attempt_word, counter, status, label_text
    status = 0
    label_text = "You Lost"
    if set(hints[-1]) == {1}:
        print("you won")
        disable_hint_list = [0, 0, 0, 0, 0]
        disable_words = " " * no_of_words.get()
        attempt_no = len(hints)
        for i in range(no_of_words.get() - attempt_no):
            hints.append(disable_hint_list)
            complete_attempt_words.append(disable_words)
        
        with open("games_won.txt", "r+", encoding = "utf-8") as file:
            content = file.read().rstrip("\n")
            score = int(content.replace("\x00", "")) + 1
            file.truncate(0)
            file.write(str(score))
        
        for x in range(1, no_of_words.get() + 1):
            for y in range(1, no_of_words.get() + 1):
                attempt_box = Entry(game_window, justify = CENTER, font=('Arial bold',17), width = 3)
                attempt_box.grid(row = x, column = y, padx = 2, pady = 2)
                attempt_box.insert(0 ,complete_attempt_words[x - 1][y - 1])
                flag = int(hints[x - 1][y - 1])
                if flag == 1:
                    attempt_box.config(disabledbackground = "#67CB00")
                elif flag == -1:
                    attempt_box.config(disabledbackground = "#FFEB00")
                elif flag == 0:
                    attempt_box.config(disabledbackground = "grey")
                
                attempt_box.config(state = DISABLED)
        label_text = "You won"
        game_over()
    #hii
        
    else: 
        if (row[-1]+1) < no_of_words.get() + 1:    
            for x in range(1, (row[-1]+1)):
                for y in range(1, no_of_words.get() + 1):
                    attempt_box = Entry(game_window, justify = CENTER, font=('Arial bold',17), width = 3)
                    attempt_box.grid(row = x, column = y, padx = 2, pady = 2)
                    attempt_box.insert(0 ,complete_attempt_words[x - 1][y - 1])
                    flag = int(hints[x - 1][y - 1])
                    if flag == 1:
                        attempt_box.config(disabledbackground = "#67CB00")
                    elif flag == -1:
                        attempt_box.config(disabledbackground = "#FFEB00")
                    elif flag == 0:
                        attempt_box.config(disabledbackground = "grey")
                    
                    attempt_box.config(state = DISABLED)
        else:
            game_window.quit()
            return game_over()
            
    counter += 4                   
    row.append((row[-1]+1))

def give_up():
    quit()
    
def game_over():
    """
    Displayed when the user runs out of attempts or the attempted word matches the word to be guessed
    """
    global label_text
    
    game_over_window = Tk()
    
    game_over_window.geometry("180x160")
    game_over_window.iconbitmap("Wordle_2021_Icon.ico")
    
    dummy4 = Label(game_over_window, text = "     ")
    dummy4.grid(row = 0, column = 0)
    
    dummy5 = Label(game_over_window, text = "     ")
    dummy5.grid(row = 1, column = 1)
    
    lost = Label(game_over_window, text = label_text, font = ('Arial', 15, "bold"))
    lost.grid(row = 2, column = 2, pady = 2)
    
    quit_button = Button(game_over_window, text = "quit", font = ('Arial', 13, "bold"), command = give_up, height = 1, width = 5)
    quit_button.grid(row = 4, column = 2)
    
    game_over_window.mainloop()

def start_window():
    """
    Displayed when the used starts the game, prompts for the difficulty level and no of words that the user prefers
    By defailt, the no of letters in the word is 4 and difficulty is easy
    contains a button named starts the game with the prefered preferences
    """

    global window, no_of_words, complete_attempt_word, hints, counter, attempt_words, difficulty
    
    complete_attempt_word = ""
    hints = []
    counter = 0
    attempt_words = []
    
    window = Tk()

    window.title("Wordle")
    window.geometry("250x220")
    
    window.iconbitmap("Wordle_2021_Icon.ico")

    wordle_label = Label(window, text = "Wordle")
    wordle_label.grid(row = 1, column = 3)
    wordle_label.config(font=('Helvatical bold',25))

    no_of_words_label = Label(window, text = "No_of_words")
    no_of_words_label.grid(row = 2, column = 3)
    no_of_words_label.config(font=('Helvatical bold',15))
    
    difficulty_label = Label(window, text = "Difficulty")
    difficulty_label.grid(row = 4, column = 3)
    difficulty_label.config(font=('Helvatical bold',15))
    
    no_of_words = IntVar()
    no_of_words_choosen = ttk.Combobox(window, width = 10, textvariable = no_of_words)
    no_of_words_choosen["values"] = tuple([i for i in range(4, 8, 1)])
    no_of_words_choosen.grid(row = 3, column = 3)
    no_of_words_choosen.current(0)
    
    difficulty_levels = ["easy", "medium", "hard"]
    difficulty = StringVar()
    difficulty_choosen = ttk.Combobox(window, width = 10, textvariable = difficulty)
    difficulty_choosen["values"] = tuple(difficulty_levels)
    difficulty_choosen.grid(row = 5, column = 3)
    difficulty_choosen.current(0)

    start_button = Button(window, text = "Start", width = 10, command = window_switcher)
    start_button.grid(row = 6, column = 3)

    dummy1 = Label(window, text = "           ")
    dummy1.grid(row = 0, column = 0)

    dummy2 = Label(window, text = "           ")
    dummy2.grid(row = 1, column = 1)

    dummy3 = Label(window, text = "           ")
    dummy3.grid(row = 0, column = 4)

    window.mainloop()

def _game_window():
    """
    Displayed after the start window, This is the main game window
    The entry boxes for each letter are created using a loop and a single object handles all of them
    gets the geometry for boxes with different no of letters from the geometry.csv file
    displays the no of games won
    the attempt button verfies the word entered by the user and the give up button quits the whole program
    """
    global entries, attempt_box, game_window, attempt, games_won

    #print(no_of_words.get())
    
    entries = []
    width = None #+ (no_of_words.get() * 10)
    height = None #+ (no_of_words.get() * 10)
    high_score  = None
    
    with open("geometry.csv", "r") as file:
        dimensions = list(csv.reader(file))
        
        width = dimensions[no_of_words.get() - 3][0]
        height = dimensions[no_of_words.get() - 3][1]
        
    with open("games_won.txt", "r") as file:
        content = file.read().rstrip("\n")
        content = int(content.replace("\x00", ""))
        print(content)

    game_window = Tk()
    game_window.title("Wordle")
    game_window.geometry("{}x{}".format(width, height))
    
    game_window.iconbitmap("Wordle_2021_Icon.ico")
    
    header = Label(game_window, text = "You have {} attempts!".format(no_of_words.get()), width = 16, font = ('Arial',14))
    header.grid(row = 0, column = 2, pady = 5, columnspan = 4)
    
    for x in range(1, no_of_words.get() + 1):
        for y in range(1, no_of_words.get() + 1):
            attempt = StringVar()
            attempt_box = Entry(game_window, textvar = attempt, justify = CENTER, font=('Helvatical bold',17), width = 3)
            attempt_box.grid(row = x, column = y, padx = 2, pady = 2)
            entries.append(attempt_box)
    
    give_up_button = Button(game_window, text = "Quit", width = 7, font = ('Arial',13), command = give_up)
    give_up_button.grid(row = 7 + (no_of_words.get() - 2), column = no_of_words.get() - 1, padx = 2, pady = 1, columnspan = 2)
    
    attempt_button = Button(game_window, text = "attempt", width = 7, font = ('Arial',13), command = attempt_verify)
    attempt_button.grid(row = 7 + (no_of_words.get() - 2), column = 1, padx = 2, pady = 1, columnspan = 2)
    
    games_won = Label(game_window, text = "games won:{}".format(content), font = ('Arial',13))
    games_won.grid(row = 8 + (no_of_words.get() - 2), column = 1, padx = 2, pady = 1, columnspan = 3)
    
    dummy1 = Label(game_window, text = "           ")
    dummy1.grid(row = 0, column = 0)

    #dummy2 = Label(game_window, text = "           ")
    #dummy2.grid(row = 1, column = 1)

    #dummy3 = Label(game_window, text = "           ")
    #dummy3.grid(row = 0, column = 4)
    
    game_window.mainloop()
    
start_window()
