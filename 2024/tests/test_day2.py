import config
import itertools
import logging
import unittest
import urllib.request

log = logging.getLogger(__name__)

class Day1(unittest.TestCase):
    @classmethod
    def setUp(inst):
        inst.input = [
            '7 6 4 2 1',
            '1 2 7 8 9',
            '9 7 6 2 1',
            '1 3 2 4 5',
            '8 6 4 4 1',
            '1 3 6 7 9'
        ]
        # read a file called test_day2.txt
        with open('tests/test_day2.txt', mode='r',) as f:
            inst.input = f.read().splitlines()

    def test_part1(self):
        # for each line, split it into a list of numbers
        safe_reports = 0
        for line in self.input:
            numbers = list(map(int, line.split()))
            is_safe = self.is_safe_sequence(numbers)
            # count the number of safe reports
            if is_safe:
                safe_reports += 1
        
        log.debug('safe_reports: {}'.format(safe_reports))

    def test_part2(self):
        # for each line, split it into a list of numbers
        safe_reports = 0
        for line in self.input:
            numbers = list(map(int, line.split()))
            is_safe = self.is_safe_sequence_dampened(numbers)
            # count the number of safe reports
            if is_safe:
                safe_reports += 1
        
        log.debug('safe_reports: {}'.format(safe_reports))

    def is_safe_sequence(self, numbers):
        direction = 0
        for i in range(len(numbers) - 1):
            new_direction = self.is_increasing_or_decreasing(numbers[i], numbers[i + 1])
            if new_direction == 0:
                return False
            elif direction == 0:
                direction = new_direction
            elif direction != new_direction:
                return False

            if not self.is_within_one_to_three(numbers[i], numbers[i + 1]):
                return False
        return True

    def is_safe_sequence_dampened(self, numbers):
        # if the sequence is already safe, return True
        if self.is_safe_sequence(numbers):
            return True

        # try removing each number and see if the sequence is safe
        for i in range(len(numbers)):
            sequence = list(numbers)
            sequence.pop(i)
            if self.is_safe_sequence(sequence):
                return True
        
        # if we get here, the sequence is not safe
        return False

    def is_increasing_or_decreasing(self, first_number, second_number):
        # determine if numbers are either increasing or decreasing
        if first_number < second_number:
            return 1
        elif first_number > second_number:
            return -1
        else:
            return 0
        
    def is_within_one_to_three(self, first_number, second_number):
        distance = abs(first_number - second_number)
        if distance < 1 or distance > 3:
            return False
        return True

        
if __name__ == '__main__':
    unittest.main()
