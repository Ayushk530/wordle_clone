import unittest
import sys
import os

# Add parent directory to path so we can import wordle_automation
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import wordle_automation

class TestWordleLogic(unittest.TestCase):
    
    def test_hints_all_green(self):
        # Test exact match
        result = wordle_automation.hints("apple", "apple")
        self.assertEqual(result, [1, 1, 1, 1, 1])

    def test_hints_all_grey(self):
        # Test no matching letters
        result = wordle_automation.hints("bound", "types")
        self.assertEqual(result, [0, 0, 0, 0, 0])

    def test_hints_mixed(self):
        # Test combination of green, yellow, grey
        # wordle_word = "apple"
        # guess_word = "peals"
        # p -> in apple, not at index 0 -> yellow (-1)
        # e -> in apple, not at index 1 -> yellow (-1)
        # a -> in apple, not at index 2 -> yellow (-1)
        # l -> in apple, at index 3 -> green (1)
        # s -> not in apple -> grey (0)
        result = wordle_automation.hints("peals", "apple")
        self.assertEqual(result, [-1, -1, -1, 1, 0])

    def test_open_word_file_exists(self):
        # Test opening a file returns a file-like object
        try:
            f = wordle_automation.open_word_file(5, "easy")
            self.assertIsNotNone(f)
            f.close()
        except FileNotFoundError:
            self.skipTest("dictionary files not found in the current directory")

    def test_pick_word(self):
        # Test that picking a word returns a string from the file
        try:
            f = wordle_automation.open_word_file(5, "easy")
            word = wordle_automation.pick_word(f)
            self.assertIsInstance(word, str)
            self.assertTrue(len(word) > 0)
        except FileNotFoundError:
            self.skipTest("dictionary files not found in the current directory")

if __name__ == '__main__':
    unittest.main()
