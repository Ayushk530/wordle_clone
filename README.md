# 🎮 Wordle Clone

A fun and interactive recreation of the popular word-guessing game **Wordle**! Challenge yourself to guess the secret word in 6 attempts. Get instant feedback on each guess and test your vocabulary skills. 🧠✨

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How to Play](#how-to-play)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Game Mechanics](#game-mechanics)
- [API/Core Functions](#apicore-functions)
- [Configuration](#configuration)
- [Tips & Tricks](#tips--tricks)
- [Future Ideas](#future-ideas)
- [Contributors](#contributors)

---

## 🎯 Overview

**Wordle Clone** is a Python-based recreation of the viral Wordle game! 🎪 Whether you're a word enthusiast or just looking for a fun way to kill time, this game delivers the same addictive gameplay as the original. Guess the 5-letter word before you run out of attempts, and watch the tiles light up to guide you! 🎨

Key highlights:
- 🎲 **Random Word Selection**: Each game features a different mystery word
- 🟩🟨⬜ **Color-Coded Feedback**: Green (correct position), Yellow (wrong position), Gray (not in word)
- 📊 **Game Stats**: Track your wins, losses, and streaks
- 🔤 **Word Validation**: Only accepts real English words
- 🎪 **Replay Functionality**: Play as many rounds as you want!

---

## ✨ Features

### Core Gameplay Features

| Feature | Description | 🎯 |
|---------|-------------|-----|
| 🎲 Random Word Generator | A new secret word every game | Fresh every time! |
| 🟩 Color Feedback System | Visual hints for each guess | Green = Right spot! 🎉 |
| 📝 Input Validation | Only accepts 5-letter words | No cheating! 😄 |
| 🔤 Dictionary Check | Validates guesses against word list | Real words only 📚 |
| 📊 Statistics Tracking | Wins, losses, streak counter | Brag rights! 🏆 |
| 🔄 Replay System | Play unlimited rounds | Addictive AF! 🎮 |
| 💾 Game History | View past games and results | Remember your glory 🌟 |

### User Experience Features

| Feature | What It Does | Why It's Cool |
|---------|-------------|---------------|
| 🎨 **Colored Tiles** | Visual feedback per letter | Super satisfying! ✨ |
| ⏰ **Timer** (Optional) | Track your solve time | Speed run challenge! ⚡ |
| 🔤 **Keyboard Display** | Shows available letters | Know what's left 👀 |
| 📱 **Clean UI** | Simple, intuitive interface | No clutter, just fun! |
| 🎪 **Animations** | Smooth transitions & effects | Feels polished ✨ |

---

## 🎮 How to Play

### Step-by-Step Guide

1. 🎬 **Start the Game**: Run the script and the game initializes with a random word
2. 🤔 **Make Your First Guess**: Type any 5-letter word
3. 👀 **Read the Feedback**: 
   - 🟩 **Green Tile** = Letter is in the word AND in the correct position
   - 🟨 **Yellow Tile** = Letter is in the word but in the WRONG position
   - ⬜ **Gray Tile** = Letter is NOT in the word at all
4. 🧠 **Use the Hints**: Adjust your next guess based on the feedback
5. 🔄 **Repeat**: You have **6 attempts** to find the word
6. 🏁 **Win or Lose**: 
   - ✅ Find the word in 6 tries → **YOU WIN!** 🎉
   - ❌ Run out of attempts → **GAME OVER** 😢 (word is revealed)

### Example Game

```
🎮 Guess 1: STARE
🟨🟩⬜🟨⬜ (S, A are in word but wrong spots; T is wrong)

🎮 Guess 2: AROSE
🟩🟩🟩⬜🟩 (Getting closer! 🔥)

🎮 Guess 3: AROSE → ARSON
🟩🟩🟩🟩🟩 (ALL GREEN! 🎉 YOU WIN!)
```

---

## 🛠️ Technology Stack

### Languages & Frameworks

| Technology | Purpose | Why We Love It |
|-----------|---------|----------------|
| 🐍 **Python 3.8+** | Main language | Simple, powerful, readable |
| 📚 **Standard Library** | Game logic | No heavy dependencies! |
| 🎨 **Colorama** (Optional) | Colored terminal output | Makes it pop! ✨ |
| 📝 **JSON** | Word storage & stats | Lightweight & easy |

### Tools & Libraries

- **random**: For selecting mystery words 🎲
- **string**: String operations 🔤
- **json**: Saving game stats 💾
- **datetime**: Tracking game timestamps ⏰
- **collections**: Word frequency analysis 📊

---

## 📁 Project Structure

```
wordle_clone/
│
├── 📄 README.md                    # You're reading this! 👋
├── 🐍 main.py                      # Entry point - Start here! 🚀
├── 🎮 game.py                      # Core game logic & mechanics
├── 🔤 word_validator.py            # Word checking & validation
├── 📊 stats.py                     # Game statistics & tracking
├── 📚 words.txt                    # Dictionary of valid words
├── 💾 game_stats.json              # Saved player statistics
├── 📋 requirements.txt             # Dependencies (if any)
└── 🧪 tests/
    ├── test_game.py                # Unit tests for game logic
    └── test_validator.py           # Tests for word validation
```

### File Descriptions

| File | What It Does | 🎯 |
|------|-------------|-----|
| **main.py** | Game launcher & main loop | Run this to play! 🎮 |
| **game.py** | Word selection, guess handling, feedback | The brain of the game 🧠 |
| **word_validator.py** | Validates if guesses are real words | Gatekeeper 🚪 |
| **stats.py** | Tracks wins, losses, streaks | Your bragging rights 🏆 |
| **words.txt** | Dictionary file with 5-letter words | The secret sauce 📚 |

---

## 🚀 Installation & Setup

### Prerequisites

- 🐍 Python 3.8 or higher
- 📦 pip (Python package manager)
- 🖥️ Terminal/Command Prompt
- 💪 Willingness to lose to a computer 😄

### Quick Start (2 Minutes)

```bash
# 1️⃣ Clone the repository
git clone https://github.com/MrWhoCoded/wordle_clone.git
cd wordle_clone

# 2️⃣ Install dependencies (optional)
pip install -r requirements.txt

# 3️⃣ Run the game!
python main.py

# 4️⃣ Start guessing! 🎮
```

### Detailed Setup Steps

#### Step 1: Clone the Repository
```bash
git clone https://github.com/MrWhoCoded/wordle_clone.git
cd wordle_clone
```

#### Step 2: Create a Virtual Environment (Recommended 🎯)
```bash
# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

#### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

If no requirements exist, the game runs on Python standard library! 🎉

#### Step 4: Verify Installation
```bash
python main.py --help
# You should see usage instructions
```

#### Step 5: Play!
```bash
python main.py
# Follow the on-screen prompts and start guessing! 🎮
```

---

## 🎯 Game Mechanics

### Feedback System

The color-coded feedback is what makes Wordle so addictive! 🎨

```
Tile Colors Explained:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟩 GREEN   = Correct letter, CORRECT position
🟨 YELLOW  = Correct letter, WRONG position  
⬜ GRAY    = Letter NOT in the word
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Scoring System

```python
# Example scoring logic (may vary)
Attempt 1: 🎉 Perfect! +100 points
Attempt 2-3: 😊 Great! +80 points
Attempt 4-5: 🤔 Okay! +50 points
Attempt 6: 😅 Lucky! +20 points
Failed: 😢 Try again! 0 points
```

### Win/Loss Logic

- **WIN** ✅: Guess matches secret word before attempt 6
- **LOSS** ❌: Fail to guess word after 6 attempts

---

## 🔧 API/Core Functions

### Main Game Functions

```python
# game.py

def start_game():
    """🎮 Initialize a new game"""
    # Selects random word, resets attempts
    pass

def make_guess(user_input):
    """🤔 Process a player's guess"""
    # Validates input, generates feedback
    return feedback  # Green/Yellow/Gray tiles

def get_feedback(secret_word, guess):
    """🟩🟨⬜ Generate color feedback"""
    # Compares guess to secret word
    return color_list

def is_game_over():
    """🏁 Check if game has ended"""
    # Returns True if won or out of attempts
    return bool

def get_stats():
    """📊 Retrieve player statistics"""
    return {
        'wins': int,
        'losses': int,
        'streak': int,
        'avg_attempts': float
    }
```

### Word Validation Functions

```python
# word_validator.py

def is_valid_word(word):
    """🔤 Check if word is in dictionary"""
    return True/False

def is_five_letters(word):
    """📏 Validate word length"""
    return len(word) == 5

def is_alphabetic(word):
    """🔡 Check if word contains only letters"""
    return word.isalpha()

def load_dictionary():
    """📚 Load word list from file"""
    return word_set
```

---

## ⚙️ Configuration

### Customization Options

You can tweak these settings in `config.py` or `main.py`:

```python
# Game Settings 🎮
MAX_ATTEMPTS = 6              # Number of guesses allowed
WORD_LENGTH = 5               # Length of the secret word
DIFFICULTY = "NORMAL"         # Easy, Normal, Hard

# Display Settings 🎨
USE_COLORS = True             # Colored terminal output
SHOW_KEYBOARD = True          # Display available letters
SHOW_TIMER = True             # Show solve time

# File Paths 📁
WORDS_FILE = "words.txt"      # Dictionary file path
STATS_FILE = "game_stats.json" # Stats save file
```

### Difficulty Levels

| Level | Description | 🎯 |
|-------|-------------|-----|
| 🟢 **Easy** | Common words, relaxed time | Perfect for beginners! |
| 🟡 **Normal** | Balanced word list, standard time | The classic experience 🎮 |
| 🔴 **Hard** | Obscure words, time pressure | For the brave! ⚡ |

---

## 💡 Tips & Tricks

### 🧠 Strategy Tips

1. **Start with Vowels** 🔤
   - Use a vowel-rich opening word like "ADIEU" or "AUDIO"
   - Quickly identify which vowels are in the word

2. **Think of Common Patterns** 🧩
   - Words often have common letter combinations
   - "ING", "TION", "ER" are your friends

3. **Eliminate Letters Systematically** 🗑️
   - Track which letters are ruled out (gray tiles)
   - Build your next guess accordingly

4. **Use Yellow Tiles Wisely** 🟨
   - If a letter is yellow, it's in the word but wrong spot
   - Try it in different positions next

5. **Don't Repeat Mistakes** 🚫
   - Avoid guessing the same letter twice
   - Learn from gray feedback!

### 🎮 Pro Tips

- 💪 Try to solve in 3 attempts for maximum bragging rights!
- 🔥 Build a winning streak and track it
- 📚 Learn new words to expand your vocabulary
- ⏰ Time yourself and try to beat your record
- 🎯 Play daily for consistency

---

## 🚀 Future Ideas

Here are some cool features we might add someday! 🌟

- 🌍 **Multiplayer Mode**: Compete with friends online
- 📱 **Mobile App**: Play on iOS/Android with GUI
- 🤖 **AI Opponent**: Get hints or play against AI
- 🎨 **Dark Mode**: Eye-friendly theme for night gaming
- 🔊 **Sound Effects**: Audio feedback for correct/wrong guesses
- 🌍 **Multi-Language**: Support for different languages & word lists
- ⏱️ **Speedrun Mode**: Race against the clock!
- 🧩 **Daily Challenge**: Same word for all players (like real Wordle)

---

## 👥 Contributors

This project was created with ❤️ as a fun learning exercise!

**Developers**: [@MrWhoCoded](https://github.com/MrWhoCoded), [@swarup-nandakumar](https://github.com/swarup-nandakumar) 🚀

Want to contribute? Fork the repo, make your changes, and send a PR! We love community contributions! 💪

### How to Contribute

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/awesome-feature`)
3. 💻 Commit your changes (`git commit -m 'Add awesome feature'`)
4. 📤 Push to the branch (`git push origin feature/awesome-feature`)
5. 📝 Open a Pull Request
6. 🎉 Get featured as a contributor!

---

## 📜 License

This project is licensed under the **MIT License** - feel free to use it, modify it, and build upon it! 📄

For more details, see the [LICENSE](LICENSE) file.

---

## 🎓 Acknowledgments

- 🙏 Inspired by the original [Wordle](https://www.powerlanguage.co.uk/wordle/) by Josh Wardle
- 📚 Thanks to all the word list contributors
- 🌟 Special thanks to everyone who plays and enjoys this game!

---

## 💬 Feedback & Support

Have a bug? 🐛 Found a typo? ✏️ Want a feature? ✨

Please open an [Issue](https://github.com/MrWhoCoded/wordle_clone/issues) and let us know! We read every single one! 👀

---

**Happy Guessing!** 🎮🎉✨

*Made with ❤️ by word enthusiasts, for word enthusiasts*
