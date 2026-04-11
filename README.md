# 🎮 Wordle Clone

A clean and interactive recreation of the popular Wordle game.
Challenge yourself to guess a 5-letter word in 6 attempts with real-time feedback.

---

## 🚀 Overview

This project replicates the core mechanics of Wordle while focusing on clean logic, user experience, and structured code design.

### 🔥 Key Highlights

* 🎲 Random word generation each game
* 🟩🟨⬜ Real-time feedback system
* 📊 Game statistics (wins, streaks, attempts)
* 🔤 Input validation with dictionary check
* 🔄 Replayable gameplay

---

## ✨ Features

* 🎮 Classic Wordle gameplay (6 attempts)
* 🎨 Color-coded feedback (Green, Yellow, Gray)
* 🔤 Valid word checking
* 📊 Persistent stats tracking
* 💾 Game history storage
* 🔁 Replay system

---

## 🛠️ Tech Stack

* **Python 3**
* Standard Library (random, json, datetime, collections)
* Optional: Colorama (for colored output)

---

## 📁 Project Structure

```
wordle_clone/
├── main.py
├── game.py
├── word_validator.py
├── stats.py
├── words.txt
├── game_stats.json
├── tests/
└── README.md
```

---

## ⚙️ Installation & Setup

```bash
git clone https://github.com/MrWhoCoded/wordle_clone.git
cd wordle_clone
pip install -r requirements.txt
python main.py
```

---

## 🎮 How to Play

* Enter a 5-letter word
* Get feedback after each guess:

  * 🟩 Correct letter & position
  * 🟨 Correct letter, wrong position
  * ⬜ Letter not in word
* You have **6 attempts** to guess correctly

---

## 🎯 Game Logic

* Random word selected from dictionary
* Input validated for length and correctness
* Feedback generated per letter
* Game ends on win or after 6 attempts

---

## 🚀 Future Improvements

* 🌍 Multiplayer mode
* 📱 GUI / Mobile version
* 🤖 AI-based hints
* 🌙 Dark mode
* 🎥 Daily challenge system

---

## 👥 Contributors

[@MrWhoCoded](https://github.com/MrWhoCoded), [@swarup-nandakumar](https://github.com/swarup-nandakumar)

---

## 📜 License

MIT License

---

## 🌟 Final Note

This project focuses on building a clean and extensible implementation of a popular game while maintaining clarity in logic and structure.

Built with ❤️ for learning and experimentation.
