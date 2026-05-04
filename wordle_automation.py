#swarup,Yasser Ahmed - 20.5.2022
#to find answer of wordle question.

#to get list of words from a dictionary of english words from json file.
#dictionary key/value pair is in the form word/meaning.
import json
import random

#NOTE: can add meanings also as a clue....maybe
# hello
#to get file of words(NOTE: should be under condition)
def open_word_file(no_of_ltr,dif_lvl):
    global file_name, num_words

    #to extract data from file.
    all_words = json.load(open("dictionary_of_words.json", "r"))

    #obtaining file name of required file created in the previous program.
    file_name = str(no_of_ltr)+"letter words.txt"

    if dif_lvl == "easy" : #easy word
        file = open("easy_" + file_name, "r")
        print("e")
            
    if dif_lvl == "medium" : #medium word
        file = open("medium_" + file_name, "r")
        print("m")
    
    if dif_lvl == "hard" : #hard word
        file = open("hard_" + file_name, "r")
        print("h")

    return file

#to pick a random word from word file
def pick_word(file):
    global  wordle_word, common_words

    #with open(file_name, 'r', encoding='utf-8') as words:
    #global wordle_word, common_words

    lst_words = file.readlines()

    #to pick a random number in the range of 0 to total words with required lenght
    random_num = random.randint(0, len(lst_words))
    
    #word to guess-
    #strip function is used to remove undercarriage. 
    wordle_word = lst_words[random_num].strip()

    file.close()
    return wordle_word

#coding for hints
#-1 : yellow
#0 : grey
#1 : green

def hints(guess_word,wordle_word):
    hint_lst=[]
    
    for letter in guess_word:
        #for green entry(i.e when the letter is in the correct position and value)
        if letter == wordle_word[len(hint_lst)]:
            hint_lst.append(1)
        #for yellow output(i.e when the letter is in the word but wrong position)
        elif letter in wordle_word:
            hint_lst.append(-1)
        #for grey output(i.e when the letter is not in the word)
        elif letter not in wordle_word:
            hint_lst.append(0)

    return hint_lst

#inputs
#no_of_ltr - number of letters in the word
#guess_word - word guessed by user

no_of_ltr = '7'
guess_word = "alter"
dif_lvl = "hard"

#file,all_words = open_word_file(no_of_ltr,dif_lvl)
#print(pick_word(file))

#meaning = all_words[wordle_word]
#print(meaning)

#hint_lst = hints(guess_word,wordle_word)
#print(hint_lst)

import time
print("Wordle Backend is running in Docker!")
while True:
    time.sleep(60)
