import config
import itertools
import logging
import unittest
import urllib.request

log = logging.getLogger(__name__)

class Day1(unittest.TestCase):
    @classmethod
    def setUp(inst):
        """
Download input from website and parse into list of integers
        """
        url = 'https://adventofcode.com/2018/day/{}/input'.format(1)
        cookie = config.COOKIE

        req = urllib.request.Request(url, headers={'Cookie': cookie})
        with urllib.request.urlopen(req) as f:
            inst.calibrationInput = list(map(lambda line: int(line), f.read().splitlines()))


    def test_calibrate_frequency(self):
        """
        Sum of all numbers
        """
        frequency = sum(self.calibrationInput)

        log.debug('final frequency: {}'.format(frequency))

    def test_first_repeated_frequency(self):
        """
        Finds first repeated frequency while repeatedly summing the list of input
        """

        frequencySet = set('')
        frequency = 0
        firstRepeatedFrequency = None
        iterations = 0

        while firstRepeatedFrequency == None:
            iterations += 1
            for input in self.calibrationInput:
                frequency += input
                if not frequency in frequencySet:
                    frequencySet.add(frequency)
                else:
                    firstRepeatedFrequency = frequency
                    break
    
        log.debug('first repeated frequency: {} in {} iterations'.format(firstRepeatedFrequency, iterations))

    def test_day1_part2_take2(self):
        """
        Same as test_first_repeated_frequency but using a generator
        """
        MAX_ITERATIONS = 137

        # enlessly loops over calibrationInput
        def inputGenerator(inputList, max_iterations):
            iterations = 0
            while iterations < max_iterations:
                iterations += 1
                for input in inputList:
                    yield input

        frequencySet = set()
        frequency = 0
        endlessList = inputGenerator(self.calibrationInput, MAX_ITERATIONS)
        for input in endlessList:
            frequency += input
            if not frequency in frequencySet:
                frequencySet.add(frequency)
            else:
                break

        log.debug('first repeated frequency: {}'.format(frequency))
        self.assertEqual(73272, frequency)
        
        
if __name__ == '__main__':
    unittest.main()